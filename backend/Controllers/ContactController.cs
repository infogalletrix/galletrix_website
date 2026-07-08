using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public ContactController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // POST: api/contact
        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] ContactSubmission submission)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            submission.SubmittedAt = DateTime.UtcNow;
            _context.ContactSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            // Try to send email notification
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
                            Subject = $"New Contact Form Submission from {submission.FullName}",
                            Body = $"Name: {submission.FullName}\r\nCompany: {submission.Company}\r\nEmail: {submission.Email}\r\nPhone: {submission.Phone}\r\nService of Interest: {submission.ServiceOfInterest}\r\n\r\nMessage:\r\n{submission.Message?.Replace("\r\n", "\n").Replace("\n", "\r\n")}",
                            IsBodyHtml = false,
                        };
                        
                        // Send to the requested email
                        mailMessage.To.Add("ceo@galletrix.com");
                        
                        // Optional: Allow easy replying to the person who submitted the form
                        mailMessage.ReplyToList.Add(new MailAddress(submission.Email));

                        client.Send(mailMessage);

                        // Send Acknowledgement Email
                        var ackMessage = new MailMessage
                        {
                            From = new MailAddress(smtpUser, "Galletrix"),
                            Subject = "We have received your inquiry",
                            Body = $"Dear {submission.FullName},\r\n\r\nThank you for contacting Galletrix.\r\n\r\nWe have successfully received your inquiry regarding {submission.ServiceOfInterest}. Our team is reviewing your request and will get back to you as soon as possible with the relevant information.\r\n\r\nIf you have any additional details to share in the meantime, please feel free to reply to this email.\r\n\r\nBest regards,\r\nTeam Galletrix",
                            IsBodyHtml = false,
                        };
                        ackMessage.To.Add(submission.Email);
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

            return Ok(new { message = "Message submitted successfully!", id = submission.Id });
        }

        // GET: api/contact
        [HttpGet]
        public async Task<IActionResult> GetSubmissions()
        {
            var submissions = await _context.ContactSubmissions
                .OrderByDescending(s => s.SubmittedAt)
                .ToListAsync();

            return Ok(submissions);
        }
    }
}
