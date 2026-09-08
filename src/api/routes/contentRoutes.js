const express = require("express");
const { sectionBySiteController } = require("../controllers/contentController");

const contentRouter = express.Router();

contentRouter.get("/:site/:section", sectionBySiteController);

module.exports = {
  contentRouter,
};
