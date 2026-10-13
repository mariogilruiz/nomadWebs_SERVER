function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeMessage(value) {
  return String(value ?? "").trim() || "Sin mensaje.";
}

function buildContactEmailTemplate({ siteName, siteDomain, formData = {} }) {
  const safeSiteName = escapeHtml(siteName || "websnomadas");
  const safeSiteDomain = escapeHtml(siteDomain || "websnomadas.com");
  const name = escapeHtml(formData.name || "Sin nombre");
  const email = escapeHtml(formData.email || "Sin email");
  const telefono = escapeHtml(formData.telefono || "No facilitado");
  const message = escapeHtml(normalizeMessage(formData.message));

  const subject = `[${siteName || "websnomadas"}] Nuevo mensaje de contacto`;

  const text = [
    `Nuevo mensaje de contacto para ${siteName || "websnomadas"}`,
    `Web: ${siteDomain || "websnomadas.com"}`,
    `Nombre: ${formData.name || "Sin nombre"}`,
    `Email: ${formData.email || "Sin email"}`,
    `Telefono: ${formData.telefono || "No facilitado"}`,
    "",
    "Mensaje:",
    normalizeMessage(formData.message),
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f7f3ef;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
      <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #eadfd5;border-radius:20px;overflow:hidden;box-shadow:0 18px 40px rgba(82,63,52,0.08);">
          <div style="background:linear-gradient(135deg,#1f1f1f 0%,#4b3b33 100%);padding:28px 32px;color:#fff;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#d8c2b4;">Nuevo contacto</p>
            <h1 style="margin:0;font-size:24px;line-height:1.2;">${safeSiteName}</h1>
            <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#f2e8e1;">Se ha recibido un nuevo mensaje desde el formulario de contacto de ${safeSiteDomain}.</p>
          </div>

          <div style="padding:32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:0 0 12px;font-size:13px;font-weight:700;color:#6c5b53;text-transform:uppercase;letter-spacing:0.08em;">Datos del remitente</td>
              </tr>
            </table>

            <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:0 0 12px;width:30%;font-size:13px;font-weight:700;color:#6c5b53;">Nombre</td>
                <td style="padding:0 0 12px;font-size:15px;color:#2b2b2b;">${name}</td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;width:30%;font-size:13px;font-weight:700;color:#6c5b53;">Email</td>
                <td style="padding:0 0 12px;font-size:15px;color:#2b2b2b;"><a href="mailto:${email}" style="color:#a36d4f;text-decoration:none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:0 0 12px;width:30%;font-size:13px;font-weight:700;color:#6c5b53;">Telefono</td>
                <td style="padding:0 0 12px;font-size:15px;color:#2b2b2b;">${telefono}</td>
              </tr>
            </table>

            <div style="margin-top:20px;padding:20px;border-radius:16px;background:#fbf8f5;border:1px solid #eee1d8;">
              <p style="margin:0 0 10px;font-size:13px;font-weight:700;color:#6c5b53;text-transform:uppercase;letter-spacing:0.08em;">Mensaje</p>
              <p style="margin:0;font-size:15px;line-height:1.8;color:#333333;white-space:pre-line;">${message}</p>
            </div>

            <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eadfd5;font-size:12px;line-height:1.6;color:#8a776d;">
              <p style="margin:0;">Este correo se generó automáticamente desde el formulario de ${safeSiteDomain}.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
}

function buildContactAutoReplyTemplate({
  siteName,
  siteDomain,
  formData = {},
}) {
  const safeSiteName = escapeHtml(siteName || "websnomadas");
  const safeSiteDomain = escapeHtml(siteDomain || "websnomadas.com");
  const name = escapeHtml(formData.name || "").trim() || "Hola";

  const subject = `Hemos recibido tu solicitud para ${siteName || "websnomadas"}`;

  const text = [
    `Hola ${formData.name || ""},`.trim(),
    "",
    "Hemos recibido tu mensaje correctamente.",
    `Tu solicitud ha sido enviada a ${siteName || "websnomadas"} y en breve se pondran en contacto contigo.`,
    "",
    `Este es un correo automatico enviado desde websnomadas para ${siteDomain || "websnomadas.com"}.`,
    "No es necesario responder a este mensaje.",
  ].join("\n");

  const html = `
    <div style="margin:0;padding:0;background:#f7f3ef;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
      <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
        <div style="background:#ffffff;border:1px solid #eadfd5;border-radius:20px;overflow:hidden;box-shadow:0 18px 40px rgba(82,63,52,0.08);">
          <div style="background:linear-gradient(135deg,#1f1f1f 0%,#4b3b33 100%);padding:28px 32px;color:#fff;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#d8c2b4;">Confirmacion automatica</p>
            <h1 style="margin:0;font-size:24px;line-height:1.2;">${safeSiteName}</h1>
            <p style="margin:10px 0 0;font-size:14px;line-height:1.6;color:#f2e8e1;">Hemos recibido tu solicitud correctamente.</p>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#2b2b2b;">Hola ${name},</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#333333;">Tu solicitud ha sido enviada a <strong>${safeSiteName}</strong> y en breve se pondran en contacto contigo.</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.8;color:#333333;">Este es un correo automatico enviado desde websnomadas para el sitio ${safeSiteDomain}.</p>
            <div style="margin-top:24px;padding-top:20px;border-top:1px solid #eadfd5;font-size:12px;line-height:1.6;color:#8a776d;">
              <p style="margin:0;">No es necesario responder a este mensaje.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    subject,
    text,
    html,
  };
}

module.exports = {
  buildContactAutoReplyTemplate,
  buildContactEmailTemplate,
};
