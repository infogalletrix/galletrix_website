using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        private const string AUTHORIZED_EMAIL = "ceo@galletrix.com";

        public AuthController(IMemoryCache cache, IConfiguration configuration)
        {
            _cache = cache;
            _configuration = configuration;
        }

        public class SendOtpRequest
        {
            public string Email { get; set; } = string.Empty;
        }

        public class VerifyOtpRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Otp { get; set; } = string.Empty;
        }

        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest("Email is required.");

            if (!request.Email.Equals(AUTHORIZED_EMAIL, StringComparison.OrdinalIgnoreCase))
                return Unauthorized("Recovery OTP can only be sent to the authorized administrator email.");

            // Generate 6-digit OTP
            Random rnd = new Random();
            string otp = rnd.Next(100000, 999999).ToString();

            // Save OTP in memory cache for 10 minutes
            _cache.Set(GetCacheKey(request.Email), otp, TimeSpan.FromMinutes(10));

            try
            {
                var smtpSettings = _configuration.GetSection("SmtpSettings");
                var host = smtpSettings["Host"];
                var port = int.Parse(smtpSettings["Port"] ?? "587");
                var username = smtpSettings["Username"];
                var password = smtpSettings["Password"];

                using (var client = new SmtpClient(host, port))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(username, password);

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(username, "Galletrix Security"),
                        Subject = "Galletrix Admin Portal - Recovery OTP",
                        IsBodyHtml = true,
                        Body = $@"
                        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #07080a; color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #1e293b;'>
                            <h2 style='color: #cc6f2a; margin-top: 0;'>Galletrix Admin Security</h2>
                            <p style='font-size: 16px; color: #cbd5e1;'>A password recovery request was initiated for your administrator account.</p>
                            <div style='background-color: #0f172a; border: 1px solid #334155; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;'>
                                <p style='font-size: 14px; color: #94a3b8; margin: 0 0 10px 0;'>Your One-Time Password (OTP)</p>
                                <h1 style='font-size: 32px; letter-spacing: 5px; margin: 0; color: #ffffff;'>{otp}</h1>
                            </div>
                            <p style='font-size: 14px; color: #94a3b8;'>This code will expire in 10 minutes. If you did not request this recovery, please ignore this email.</p>
                            <hr style='border-color: #334155; margin: 30px 0;'/>
                            <p style='font-size: 12px; color: #64748b; text-align: center;'>&copy; {DateTime.UtcNow.Year} Galletrix. All rights reserved.</p>
                        </div>".Replace("\n", "\r\n")
                    };

                    mailMessage.To.Add(request.Email);
                    await client.SendMailAsync(mailMessage);
                }

                return Ok(new { message = "OTP sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Otp))
                return BadRequest("Email and OTP are required.");

            if (!request.Email.Equals(AUTHORIZED_EMAIL, StringComparison.OrdinalIgnoreCase))
                return Unauthorized("Unauthorized email.");

            if (_cache.TryGetValue(GetCacheKey(request.Email), out string? storedOtp))
            {
                if (request.Otp == storedOtp)
                {
                    // OTP is correct, invalidate it immediately
                    _cache.Remove(GetCacheKey(request.Email));
                    return Ok(new { message = "OTP verified successfully." });
                }
            }

            return BadRequest("Invalid or expired OTP.");
        }

        private string GetCacheKey(string email)
        {
            return $"OTP_{email.ToLower()}";
        }
    }
}
