const helmet = require("helmet");

function applySecurityMiddleware(app) {
  app.use(helmet());
}

module.exports = {
  applySecurityMiddleware,
};
