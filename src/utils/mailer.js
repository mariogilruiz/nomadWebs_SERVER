const nodemailer = require("nodemailer");
const { env } = require("../config/env");

let cachedTransporter = null;

function buildTransporter() {
  if (!env.smtpUser || !env.smtpPass) {
    const error = new Error("SMTP credentials are not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return cachedTransporter;
}

async function sendContactEmail({
  fromName,
  fromEmail,
  toEmail,
  replyToEmail,
  subject,
  text,
  html,
}) {
  const transporter = buildTransporter();
  const resolvedFromEmail = fromEmail || env.smtpFromEmail || env.smtpUser;

  return transporter.sendMail({
    from: fromName ? `${fromName} <${resolvedFromEmail}>` : resolvedFromEmail,
    to: toEmail,
    replyTo: replyToEmail || resolvedFromEmail,
    subject,
    text,
    html,
  });
}

module.exports = {
  sendContactEmail,
};
