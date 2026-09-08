const cors = require("cors");
const { env } = require("../config/env");

function applyCorsMiddleware(app) {
  app.use(
    cors({
      origin: (origin, callback) => {
        // Permite clientes sin header Origin (curl, health checks, server-to-server).
        if (!origin) {
          return callback(null, true);
        }

        if (env.corsOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
    }),
  );
}

module.exports = {
  applyCorsMiddleware,
};
