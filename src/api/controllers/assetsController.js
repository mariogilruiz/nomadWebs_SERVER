const fs = require("node:fs/promises");
const path = require("node:path");

const DATA_ROOT = path.resolve(__dirname, "../../../src/data");
const GLOBAL_ICONS_FILE = path.join(DATA_ROOT, "manifests/global/icons.json");
const GLOBAL_IMAGES_FILE = path.join(DATA_ROOT, "manifests/global/images.json");

function isSlug(value) {
  return /^[a-z0-9-]+$/i.test(value);
}

async function siteAssetsController(req, res) {
  const rawSite = req.params.site;

  if (!isSlug(rawSite)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid route params",
      details: "site must be a slug value",
    });
  }

  const site = rawSite.toLowerCase();
  const assetsFile = path.join(DATA_ROOT, site, "assets.json");

  try {
    const fileContent = await fs.readFile(assetsFile, "utf-8");
    const assets = JSON.parse(fileContent);

    return res.json({
      ok: true,
      service: "nomadwebs_server",
      site,
      assets,
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        ok: false,
        error: "Site assets not found",
        site,
      });
    }

    return res.status(500).json({
      ok: false,
      error: "Error reading site assets",
    });
  }
}

async function globalIconsController(_req, res) {
  try {
    const fileContent = await fs.readFile(GLOBAL_ICONS_FILE, "utf-8");

    const icons = JSON.parse(fileContent);

    return res.json({
      ok: true,
      service: "nomadwebs_server",
      icons,
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Error reading global icons",
    });
  }
}

async function globalImagesController(_req, res) {
  try {
    const fileContent = await fs.readFile(GLOBAL_IMAGES_FILE, "utf-8");
    const images = JSON.parse(fileContent);

    return res.json({
      ok: true,
      service: "nomadwebs_server",
      images,
    });
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Error reading global images",
    });
  }
}

module.exports = {
  siteAssetsController,
  globalIconsController,
  globalImagesController,
};
