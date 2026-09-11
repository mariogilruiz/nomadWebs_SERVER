const fs = require("node:fs/promises");
const path = require("node:path");

const DATA_ROOT = path.resolve(__dirname, "../data");

function isSlug(value) {
  return /^[a-z0-9-]+$/i.test(value);
}

async function loadSiteContactConfig(site) {
  if (!isSlug(site)) {
    const error = new Error("Invalid site slug");
    error.statusCode = 400;
    throw error;
  }

  const normalizedSite = site.toLowerCase();
  const contactConfigFile = path.join(
    DATA_ROOT,
    normalizedSite,
    "contact-email.json",
  );

  try {
    const rawContent = await fs.readFile(contactConfigFile, "utf-8");
    const config = JSON.parse(rawContent);

    if (!config.enabled) {
      const error = new Error("Contact email is disabled for this site");
      error.statusCode = 403;
      throw error;
    }

    return config;
  } catch (error) {
    if (error.code === "ENOENT") {
      const notFoundError = new Error("Site contact configuration not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    if (error.statusCode) {
      throw error;
    }

    const parseError = new Error("Error reading site contact configuration");
    parseError.statusCode = 500;
    throw parseError;
  }
}

module.exports = {
  loadSiteContactConfig,
};
