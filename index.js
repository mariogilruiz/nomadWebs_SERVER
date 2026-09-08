//-----importaciones
const express = require("express");
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

//----- configuracion de la app
const app = express();

app.set("trust proxy", env.trustProxy);
applySecurityMiddleware(app);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(defaultLimiter);

applyCorsMiddleware(app);

//-----endpoints

app.use(healthRouter);
app.use(contentRouter);

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
