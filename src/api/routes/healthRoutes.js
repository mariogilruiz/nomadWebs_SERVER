const express = require("express");
const {
  healthController,
  rootController,
} = require("../controllers/healthController");

const healthRouter = express.Router();

healthRouter.get("/", rootController);
healthRouter.get("/health", healthController);

module.exports = {
  healthRouter,
};
