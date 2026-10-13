const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const cachedTransporters = new Map();

function buildTransporter(siteSlug) {
  const normalizedSiteSlug = String(siteSlug || "").toLowerCase();
  if (!/^[a-z0-9-]+$/.test(normalizedSiteSlug)) {
    const error = new Error("Invalid site slug for SMTP configuration");
    error.statusCode = 500;
    throw error;
  }

  const envSuffix = normalizedSiteSlug.toUpperCase().replace(/-/g, "_");
  const smtpUser = process.env[`SMTP_USER_${envSuffix}`];
  const smtpPass = process.env[`SMTP_PASS_${envSuffix}`];

  if (!smtpUser || !smtpPass) {
    const error = new Error(
      `SMTP credentials are not configured for site "${normalizedSiteSlug}"`,
    );
    error.statusCode = 500;
    throw error;
  }

  if (!cachedTransporters.has(normalizedSiteSlug)) {
    cachedTransporters.set(
      normalizedSiteSlug,
      nodemailer.createTransport({
        host: env.smtpHost,
        port: env.smtpPort,
        secure: env.smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
    );
  }

  return {
    transporter: cachedTransporters.get(normalizedSiteSlug),
    smtpUser,
  };
}

async function sendContactEmail({
  siteSlug,
  fromName,
  fromEmail,
  toEmail,
  replyToEmail,
  subject,
  text,
  html,
}) {
  const { transporter, smtpUser } = buildTransporter(siteSlug);
  const resolvedFromEmail = fromEmail || smtpUser;

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
