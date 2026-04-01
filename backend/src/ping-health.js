const https = require("https");
const http = require("http");

const targetUrl = process.env.PING_URL;

if (!targetUrl) {
  console.error("PING_URL is required, e.g. https://your-api.onrender.com/api/health");
  process.exit(1);
}

const client = targetUrl.startsWith("https://") ? https : http;

const req = client.get(targetUrl, (res) => {
  const ok = res.statusCode >= 200 && res.statusCode < 300;
  if (!ok) {
    console.error(`Ping failed: ${res.statusCode} ${res.statusMessage || ""}`.trim());
    process.exit(1);
    return;
  }
  console.log(`Ping success: ${res.statusCode} ${targetUrl}`);
  process.exit(0);
});

req.on("error", (err) => {
  console.error(`Ping error: ${err.message}`);
  process.exit(1);
});

req.setTimeout(10000, () => {
  console.error("Ping timeout after 10s");
  req.destroy();
  process.exit(1);
});
