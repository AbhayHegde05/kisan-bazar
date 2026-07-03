const nodemailer = require("nodemailer");

/**
 * Sends email using SMTP.
 * SnapDeploy/Docker requirement:
 * - Read credentials only from:
 *   - process.env.EMAIL_USER
 *   - process.env.EMAIL_PASS
 */
async function sendEmail({ to, subject, text, html }) {
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email credentials not configured. Set EMAIL_USER/EMAIL_PASS in backend .env or Docker environment variables."
    );
  }

  const transporterOptions = {
    secure: false,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  };

  // Optional: host support. If not provided, use Gmail service as a fallback.
  if (process.env.SMTP_HOST) {
    transporterOptions.host = process.env.SMTP_HOST;
  } else {
    transporterOptions.service = "gmail";
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  return transporter.sendMail({
    from: EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };

