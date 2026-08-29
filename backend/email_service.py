import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

def send_password_reset_email(recipient_email: str, token: str):
    if not SMTP_USER or not SMTP_PASSWORD:
        print(f"MOCK EMAIL SENT TO {recipient_email}. TOKEN: {token}")
        return

    reset_url = f"{FRONTEND_URL}/login?reset_token={token}"
    message = MIMEMultipart("alternative")
    message["Subject"] = "SteNox Protocol Gateway"
    message["From"] = SMTP_USER
    message["To"] = recipient_email

    html_content = f"""
    <html>
      <body style="font-family: sans-serif; background: #090d16; color: #f1f5f9; padding: 24px;">
        <div style="max-width: 500px; margin: auto; background: #131d31; padding: 24px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
          <h2 style="color: #10b981; margin-bottom: 8px;">A REQUEST FOR PASSWORD RESET</h2>
          <p style="font-size: 14px; color: #94a3b8;">A password reset request was initiated for your account. Click the button below to proceed. This link expires shortly.</p>
          <div style="margin: 24px 0;">
            <a href="{reset_url}" style="background: #10b981; color: #090d16; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #94a3b8;">If you did not initiate this request, please disregard this email or send a text message to onistephenomololu@gmail.com to confirm.</p>
        </div>
      </body>
    </html>
    """
    part = MIMEText(html_content, "html")
    message.attach(part)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, recipient_email, message.as_string())