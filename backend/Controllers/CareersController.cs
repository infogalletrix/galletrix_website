using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CareersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public CareersController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/careers
        [HttpPost]
        public async Task<IActionResult> SubmitApplication([FromForm] CareerApplicationDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!string.IsNullOrEmpty(dto.Phone) && !System.Text.RegularExpressions.Regex.IsMatch(dto.Phone, @"^\+91 \d{10}$"))
            {
                return BadRequest(new { message = "Phone number must be exactly 10 digits prefixed with +91." });
            }

            if (dto.Resume == null || dto.Resume.Length == 0)
            {
                return BadRequest(new { message = "Resume file is required." });
            }

            // Limit file size to 5MB (5 * 1024 * 1024 bytes)
            if (dto.Resume.Length > 5 * 1024 * 1024)
            {
                return BadRequest(new { message = "File size exceeds the limit of 5MB." });
            }

            // Read file into byte array
            using var memoryStream = new MemoryStream();
            await dto.Resume.CopyToAsync(memoryStream);

            var submission = new CareerSubmission
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone,
                Position = dto.Position,
                Experience = dto.Experience,
                Portfolio = dto.Portfolio,
                Message = dto.Message,
                ResumeFileName = dto.Resume.FileName,
                ResumeContentType = dto.Resume.ContentType,
                ResumeData = memoryStream.ToArray(),
                SubmittedAt = DateTime.UtcNow
            };

            _context.CareerSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            // Try to send email notification in the background
            _ = Task.Run(() =>
            {
                try
                {
                var smtpHost = _configuration["SmtpSettings:Host"];
                var smtpPortStr = _configuration["SmtpSettings:Port"];
                var smtpUser = _configuration["SmtpSettings:Username"];
                var smtpPass = _configuration["SmtpSettings:Password"];
                
                if (!string.IsNullOrEmpty(smtpHost) && !string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPass))
                {
                    int smtpPort = int.TryParse(smtpPortStr, out var port) ? port : 587;
                    
                    using (var client = new SmtpClient(smtpHost, smtpPort))
                    {
                        client.UseDefaultCredentials = false;
                        client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                        client.EnableSsl = true;

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress(smtpUser, "Galletrix Website"),
                            Subject = $"New Career Application from {dto.FullName} - {dto.Position}",
                            Body = $"Name: {dto.FullName}\r\nEmail: {dto.Email}\r\nPhone: {dto.Phone}\r\nPosition: {dto.Position}\r\nExperience: {dto.Experience}\r\nPortfolio: {dto.Portfolio}\r\n\r\nMessage:\r\n{dto.Message?.Replace("\r\n", "\n").Replace("\n", "\r\n")}",
                            IsBodyHtml = false,
                        };
                        
                        // Send to the requested email
                        mailMessage.To.Add("ceo@galletrix.com");
                        
                        // Add reply-to
                        mailMessage.ReplyToList.Add(new MailAddress(dto.Email));

                        // Attach the resume
                        using (var attachStream = new MemoryStream(submission.ResumeData))
                        {
                            mailMessage.Attachments.Add(new Attachment(attachStream, submission.ResumeFileName, submission.ResumeContentType));
                            client.Send(mailMessage);
                        }

                        // Send Acknowledgement Email
                        var ackMessage = new MailMessage
                        {
                            From = new MailAddress(smtpUser, "Galletrix Careers"),
                            Subject = "Application Received - Galletrix",
                            Body = $"Dear {dto.FullName},\r\n\r\nThank you for applying for the {dto.Position} position at Galletrix. We have successfully received your application and resume.\r\n\r\nOur team will review your profile and get back to you if your qualifications match our current needs.\r\n\r\nBest regards,\r\nTeam Galletrix",
                            IsBodyHtml = false,
                        };
                        ackMessage.To.Add(dto.Email);
                        client.Send(ackMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                // If email fails, log it but still return success for the form submission
                Console.WriteLine($"Failed to send email: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }
            }
            });

            return Ok(new { message = "Application submitted successfully!", id = submission.Id });
        }
    }

    public class CareerApplicationDto
    {
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [MaxLength(50)]
        public string? Phone { get; set; }

        [Required]
        [MaxLength(100)]
        public string Position { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Experience { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Portfolio { get; set; }

        public string? Message { get; set; }

        [Required]
        public IFormFile Resume { get; set; } = null!;
    }
}
