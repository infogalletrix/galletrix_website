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
                        client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                        client.EnableSsl = true;

                        var mailMessage = new MailMessage
                        {
                            From = new MailAddress(smtpUser, "Galletrix Website"),
                            Subject = $"New Contact Form Submission from {submission.FullName}",
                            Body = $"Name: {submission.FullName}\nCompany: {submission.Company}\nEmail: {submission.Email}\nPhone: {submission.Phone}\nService of Interest: {submission.ServiceOfInterest}\n\nMessage:\n{submission.Message}",
                            IsBodyHtml = false,
                        };
                        
                        // Send to the requested email
                        mailMessage.To.Add("info@galletrix.com");
                        
                        // Optional: Allow easy replying to the person who submitted the form
                        mailMessage.ReplyToList.Add(new MailAddress(submission.Email));

                        await client.SendMailAsync(mailMessage);
                    }
                }
            }
            catch (Exception ex)
            {
                // If email fails, log it but still return success for the form submission
                Console.WriteLine($"Failed to send email: {ex.Message}");
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
