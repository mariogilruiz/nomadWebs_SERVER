const express = require("express");
const { sendContactController } = require("../controllers/contactController");

const contactRouter = express.Router();

contactRouter.post("/contact/:site", sendContactController);

module.exports = {
  contactRouter,
};
