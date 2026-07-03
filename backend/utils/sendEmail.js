const nodemailer = require("nodemailer");

/**
 * Sends email using SMTP.
 * Supports BOTH env styles:
 *  1) EMAIL_USER / EMAIL_PASS (implemented previously)
 *  2) SMTP_USER / SMTP_PASS / SMTP_PORT (requested by your env config)
 */
async function sendEmail({ to, subject, text, html }) {
  const EMAIL_USER = process.env.EMAIL_USER || process.env.SMTP_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  const transporterOptions = {
    secure: false,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  };

  // If SMTP_HOST is missing but we're using Gmail, fall back to Gmail service.
  if (process.env.SMTP_HOST) {
    transporterOptions.host = process.env.SMTP_HOST;
  } else {
    transporterOptions.service = "gmail";
  }

  // Ensure FROM value exists (nodemailer requires a valid from address)
  const fromAddress = process.env.EMAIL_USER || EMAIL_USER;
  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error(
      "Email credentials not configured. Set SMTP_USER/SMTP_PASS in backend .env"
    );
  }

  if (!fromAddress) {
    throw new Error("Email sender address missing (EMAIL_USER or SMTP_USER) in backend .env");
  }

  transporterOptions.auth.user = EMAIL_USER;
  transporterOptions.auth.pass = EMAIL_PASS;

  const transporter = nodemailer.createTransport(transporterOptions);

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendEmail };

