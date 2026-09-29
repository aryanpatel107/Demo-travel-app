/**
 * scripts/update-ip.js
 * Backwards-compatible wrapper delegating to detect-ip.js.
 */
const { detectAndSyncIp, getLanIp } = require("./detect-ip");

if (require.main === module) {
  detectAndSyncIp();
}

module.exports = {
  detectAndSyncIp,
  getWifiIp: getLanIp,
  updateEnv: detectAndSyncIp,
};
