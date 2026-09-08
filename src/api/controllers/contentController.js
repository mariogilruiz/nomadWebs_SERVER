const fs = require("node:fs/promises");
const path = require("node:path");

const CONTENT_ROOT = path.resolve(__dirname, "../../../src/data");

function isSlug(value) {
  return /^[a-z0-9-]+$/i.test(value);
}

async function sectionBySiteController(req, res) {
  const rawSite = req.params.site;
  const rawSection = req.params.section;

  if (!isSlug(rawSite) || !isSlug(rawSection)) {
    return res.status(400).json({
      ok: false,
      error: "Invalid route params",
      details: "site and section must be slug values",
    });
  }

  const site = rawSite.toLowerCase();
  const section = rawSection.toLowerCase();
  const siteDir = path.join(CONTENT_ROOT, site);
  const sectionFile = path.join(siteDir, `${section}.json`);

  let siteEntries;
  try {
    siteEntries = await fs.readdir(siteDir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        ok: false,
        error: "Site not found",
        site,
      });
    }

    return res.status(500).json({
      ok: false,
      error: "Error reading site content",
    });
  }

  const availableSections = siteEntries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.basename(entry.name, ".json"));

  if (!availableSections.includes(section)) {
    return res.status(404).json({
      ok: false,
      error: "Section not found",
      site,
      section,
      availableSections,
    });
  }

  let sectionContent;
  try {
    const fileContent = await fs.readFile(sectionFile, "utf-8");
    sectionContent = JSON.parse(fileContent);
  } catch {
    return res.status(500).json({
      ok: false,
      error: "Error reading section content",
    });
  }

  return res.json({
    ok: true,
    service: "nomadwebs_server",
    site,
    section,
    content: sectionContent,
  });
}

module.exports = {
  sectionBySiteController,
};
