const express = require("express");
const { sendContactController } = require("../controllers/contactController");

const { contactLimiter } = require("../../middlewares/rateLimitMiddleware");

const contactRouter = express.Router();

contactRouter.post("/contact/:site", contactLimiter, sendContactController);

module.exports = {
  contactRouter,
};
