const dotenv = require("dotenv");

dotenv.config();

function toPositiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseTrustProxy(value) {
  if (value === "true") return true;
  if (value === "false") return false;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
}

function parseOrigins(csvValue, singleValueFallback) {
  const raw = csvValue || singleValueFallback || "http://localhost:3000";

  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Configuración de variables de entorno y valores por defecto.
// Aqui añadimos la variable de entorno y sus valores por defecto.

const env = {
  port: toPositiveNumber(process.env.PORT, 3000),
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS, process.env.CORS_ORIGIN),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY || "1"),
  rateLimitWindowMs: toPositiveNumber(
    process.env.RATE_LIMIT_WINDOW_MS,
    15 * 60 * 1000,
  ),
  rateLimitMax: toPositiveNumber(process.env.RATE_LIMIT_MAX, 300),
  mongoUri: process.env.MONGO_URI || null,
  smtpHost: process.env.SMTP_HOST || "smtp.ionos.es",
  smtpPort: toPositiveNumber(process.env.SMTP_PORT, 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpFromName: process.env.SMTP_FROM_NAME || "NomadWebs",
};

module.exports = {
  env,
};
