const express = require("express");
const {
  siteAssetsController,
  globalIconsController,
  globalImagesController,
} = require("../controllers/assetsController");

const assetsRouter = express.Router();

assetsRouter.get("/content-assets/icons", globalIconsController);
assetsRouter.get("/content-assets/images", globalImagesController);
assetsRouter.get("/content-assets/:site", siteAssetsController);

module.exports = {
  assetsRouter,
};
