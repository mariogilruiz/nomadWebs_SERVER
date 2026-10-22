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

  // Honeypot: los bots rellenan campos ocultos; respondemos OK sin enviar nada
  const honeypot = String(req.body.company_fax || "").trim();
  const isAutofill = [email, name, telefono].includes(honeypot);
  if (honeypot && !isAutofill) {
    console.warn(
      "Contacto descartado: honeypot relleno",
      req.ip,
      JSON.stringify(String(req.body.company_fax).slice(0, 60)),
      Object.keys(req.body),
    );
    return res.status(200).json({ ok: true, message: "Contact email sent" });
  }

  const urlPattern =
    /(https?:\/\/|www\.|\b[a-z0-9-]+\.(buzz|xyz|top|click|ru|cn)\b)/i;
  if (urlPattern.test(name) || urlPattern.test(telefono)) {
    console.warn("Contacto descartado: enlace en nombre/telefono", req.ip);
    return res.status(200).json({ ok: true, message: "Contact email sent" });
  }

  const validEmail =
    email.length <= 254 &&
    /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]{2,}$/.test(email);

  if (
    name.length > 100 ||
    telefono.length > 30 ||
    message.length > 5000 ||
    /[\r\n]/.test(name)
  ) {
    return res.status(400).json({ ok: false, error: "Invalid fields" });
  }

  if (!name || !email || !message) {
    return res.status(400).json({
      ok: false,
      error: "Missing required fields",
      details: "name, email and message are required",
    });
  }

  if (!validEmail) {
    return res.status(400).json({ ok: false, error: "Invalid email" });
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
      siteSlug: siteConfig.siteSlug || rawSite,
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
      try {
        autoReplyInfo = await sendContactEmail({
          siteSlug: siteConfig.siteSlug || rawSite,
          fromName: siteConfig.fromName,
          fromEmail: siteConfig.fromEmail,
          toEmail: email,
          replyToEmail: siteConfig.replyToEmail || siteConfig.toEmail,
          subject: autoReplyTemplate.subject,
          text: autoReplyTemplate.text,
          html: autoReplyTemplate.html,
        });
        autoReplySent = true;
      } catch (autoReplyError) {
        console.error("Auto-reply failed:", autoReplyError.message);
      }
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
