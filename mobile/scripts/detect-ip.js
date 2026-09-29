/**
 * scripts/detect-ip.js
 * Automatically detects the machine's active IPv4 address (Wi-Fi/LAN)
 * and updates EXPO_PUBLIC_API_URL and EXPO_PUBLIC_APP_API_URL in mobile/.env.
 * Leaves all other .env values untouched.
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const DEFAULT_PORT = 5019;
const ENV_PATH = path.resolve(__dirname, "..", ".env");

function getLanIp() {
  const interfaces = os.networkInterfaces();

  // 1. Try explicit Wi-Fi / Wireless / WLAN adapter first
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    if (/wi-?fi|wireless|wlan/i.test(name)) {
      const match = addrs.find(
        (addr) =>
          !addr.internal &&
          (addr.family === "IPv4" || addr.family === 4) &&
          addr.address &&
          addr.address !== "127.0.0.1"
      );
      if (match) return { ip: match.address, interfaceName: name };
    }
  }

  // 2. Physical / primary adapters (Ethernet, etc.), excluding virtual/VM/tunnel adapters
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    if (/virtual|vbox|vmware|wsl|docker|loopback|vethernet|tap|vpn/i.test(name)) {
      continue;
    }
    const match = addrs.find(
      (addr) =>
        !addr.internal &&
        (addr.family === "IPv4" || addr.family === 4) &&
        addr.address &&
        addr.address !== "127.0.0.1"
    );
    if (match) return { ip: match.address, interfaceName: name };
  }

  // 3. Fallback: Any non-internal IPv4
  for (const [name, addrs] of Object.entries(interfaces)) {
    if (!addrs) continue;
    const match = addrs.find(
      (addr) =>
        !addr.internal &&
        (addr.family === "IPv4" || addr.family === 4) &&
        addr.address &&
        addr.address !== "127.0.0.1"
    );
    if (match) return { ip: match.address, interfaceName: name };
  }

  return null;
}

let hasLoggedNoOp = false;

function detectAndSyncIp(envFilePath = ENV_PATH) {
  const result = getLanIp();
  if (!result) {
    if (!hasLoggedNoOp) {
      console.warn("⚠️ [detect-ip] Could not detect an active IPv4 address. Leaving .env unchanged.");
      hasLoggedNoOp = true;
    }
    return null;
  }

  const { ip, interfaceName } = result;

  let content = "";
  if (fs.existsSync(envFilePath)) {
    content = fs.readFileSync(envFilePath, "utf8");
  }

  // Preserve existing port if configured, else default to 5019
  const portMatch = content.match(/EXPO_PUBLIC_(?:APP_)?API_URL=https?:\/\/[^:]+:(\d+)/);
  const port = portMatch ? portMatch[1] : DEFAULT_PORT;
  const newUrl = `http://${ip}:${port}`;

  // Update in process.env so in-memory runners (like app.config.js) see it immediately
  process.env.EXPO_PUBLIC_API_URL = newUrl;
  process.env.EXPO_PUBLIC_APP_API_URL = newUrl;

  let updated = content;
  const apiRegex = /^EXPO_PUBLIC_API_URL=.*$/m;
  const appApiRegex = /^EXPO_PUBLIC_APP_API_URL=.*$/m;

  if (apiRegex.test(updated)) {
    updated = updated.replace(apiRegex, `EXPO_PUBLIC_API_URL=${newUrl}`);
  } else {
    updated += (updated.endsWith("\n") || updated === "" ? "" : "\n") + `EXPO_PUBLIC_API_URL=${newUrl}\n`;
  }

  if (appApiRegex.test(updated)) {
    updated = updated.replace(appApiRegex, `EXPO_PUBLIC_APP_API_URL=${newUrl}`);
  } else {
    updated += (updated.endsWith("\n") ? "" : "\n") + `EXPO_PUBLIC_APP_API_URL=${newUrl}\n`;
  }

  if (content === updated) {
    if (!hasLoggedNoOp) {
      console.log(`✅ [detect-ip] .env already up-to-date with active IP: ${newUrl} (${interfaceName})`);
      hasLoggedNoOp = true;
    }
  } else {
    fs.writeFileSync(envFilePath, updated, "utf8");
    console.log(`🚀 [detect-ip] Updated mobile/.env with detected LAN IP:`);
    console.log(`   EXPO_PUBLIC_API_URL=${newUrl} (${interfaceName})`);
    console.log(`   EXPO_PUBLIC_APP_API_URL=${newUrl}`);
    hasLoggedNoOp = true;
  }

  return { ip, port, url: newUrl, interfaceName };
}

if (require.main === module) {
  detectAndSyncIp();
}

module.exports = {
  getLanIp,
  detectAndSyncIp,
};
