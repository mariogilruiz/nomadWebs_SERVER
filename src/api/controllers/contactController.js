const {
  buildContactAutoReplyTemplate,
  buildContactEmailTemplate,
} = require("../../utils/emailTemplates");
const { loadSiteContactConfig } = require("../../utils/siteContactConfig");
const { sendContactEmail } = require("../../utils/mailer");

function isSlug(value) {
  return /^[a-z0-9-]+$/i.test(value);
}

async function sendContactController(req, res) {
  const rawSite = req.params.site || req.body.site || req.body.siteSlug;

  if (!rawSite || !isSlug(rawSite)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid or missing site",
    });
  }

  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim();
  const telefono = String(req.body.telefono || "").trim();
  const message = String(req.body.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields",
      details: "name, email and message are required",
    });
  }

  let siteConfig;
  try {
    siteConfig = await loadSiteContactConfig(rawSite);
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || "Error loading site contact configuration",
    });
  }

  const template = buildContactEmailTemplate({
    siteName: siteConfig.siteName,
    siteDomain: siteConfig.siteDomain,
    formData: {
      name,
      email,
      telefono,
      message,
    },
  });

  const autoReplyTemplate = buildContactAutoReplyTemplate({
    siteName: siteConfig.siteName,
    siteDomain: siteConfig.siteDomain,
    formData: {
      name,
      email,
      telefono,
      message,
    },
  });

  const subject =
    `${siteConfig.subjectPrefix || ""} Nuevo mensaje de contacto`.trim();

  try {
    const leadInfo = await sendContactEmail({
      fromName: siteConfig.fromName,
      fromEmail: siteConfig.fromEmail,
      toEmail: siteConfig.toEmail,
      replyToEmail: email,
      subject,
      text: template.text,
      html: template.html,
    });

    let autoReplySent = false;
    let autoReplyInfo = null;

    if (siteConfig.autoReplyEnabled !== false) {
      autoReplyInfo = await sendContactEmail({
        fromName: siteConfig.fromName,
        fromEmail: siteConfig.fromEmail,
        toEmail: email,
        replyToEmail: siteConfig.replyToEmail || siteConfig.toEmail,
        subject: autoReplyTemplate.subject,
        text: autoReplyTemplate.text,
        html: autoReplyTemplate.html,
      });
      autoReplySent = true;
    }

    return res.status(200).json({
      ok: true,
      message: "Contact email sent",
      autoReplySent,
      site: siteConfig.siteSlug,
      lead: {
        accepted: leadInfo.accepted,
        rejected: leadInfo.rejected,
        response: leadInfo.response,
        messageId: leadInfo.messageId,
      },
      autoReply: autoReplyInfo
        ? {
            accepted: autoReplyInfo.accepted,
            rejected: autoReplyInfo.rejected,
            response: autoReplyInfo.response,
            messageId: autoReplyInfo.messageId,
          }
        : null,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      error: error.message || "Error sending contact email",
    });
  }
}

module.exports = {
  sendContactController,
};
