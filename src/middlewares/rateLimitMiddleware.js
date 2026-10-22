const rateLimit = require("express-rate-limit");
const { env } = require("../config/env");

const defaultLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health",
  message: {
    ok: false,
    error: "Too many requests",
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "Too many requests",
  },
});

module.exports = {
  defaultLimiter,
  contactLimiter,
};
