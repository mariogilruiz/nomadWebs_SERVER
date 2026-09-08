function healthController(_req, res) {
  return res.json({ ok: true, service: "nomadwebs_server" });
}

function rootController(_req, res) {
  return res.json({
    ok: true,
    service: "nomadwebs_server",
    message: "API running",
  });
}

module.exports = {
  healthController,
  rootController,
};
