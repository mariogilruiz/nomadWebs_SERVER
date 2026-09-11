//-----importaciones
const express = require("express");
const path = require("node:path");
const { connectMongo } = require("./src/data/mongo");

//-----rutas
const { env } = require("./src/config/env");
const {
  applySecurityMiddleware,
} = require("./src/middlewares/securityMiddleware");
const { applyCorsMiddleware } = require("./src/middlewares/corsMiddleware");
const { defaultLimiter } = require("./src/middlewares/rateLimitMiddleware");
const { healthRouter } = require("./src/api/routes/healthRoutes");
const { contentRouter } = require("./src/api/routes/contentRoutes");
const { assetsRouter } = require("./src/api/routes/assetsRoutes");
const { contactRouter } = require("./src/api/routes/contactRoutes");

//----- configuracion de la app
const app = express();

app.set("trust proxy", env.trustProxy);
applySecurityMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(defaultLimiter);

applyCorsMiddleware(app);

//-----endpoints

app.use(
  "/assets",
  express.static(path.resolve(__dirname, "./src/data/assets"), {
    setHeaders(res) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

app.use(healthRouter);
app.use(assetsRouter);
app.use(contentRouter);
app.use(contactRouter);

async function startServer() {
  try {
    await connectMongo();
    app.listen(env.port, () => {
      console.log(`Servidor corriendo en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("ERROR: No se pudo iniciar el servidor", error.message);
    process.exit(1);
  }
}

startServer();
