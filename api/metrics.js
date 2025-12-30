// api/metrics.js
// The external URL you want to proxy to:
const TARGET_URL = "https://sgtm.example.com";

module.exports = async (req, res) => {
  try {
    // Vercel populates x-forwarded-for with the real client IP (among others).
    // The first IP is typically the visitor’s IP.
    const forwardedFor = req.headers["x-forwarded-for"] || "";
    const clientIp = (forwardedFor.split(",")[0] || "").trim() || "unknown";

    // Build new headers for forwarding
    const newHeaders = {
      // Spread original request headers if you want
      ...req.headers,
      // Override or add your custom ones (lowercased keys are fine)
      "x-forwarded-for": clientIp,
      "x-from-cdn": "cf-stape",
      "host": "sgtm.example.com",
      "cf-connecting-ip": clientIp
    };

    // Collect body for non-GET/HEAD requests
    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = Buffer.concat(chunks);
      if (body.length === 0) body = undefined;
    }

    // Forward the request to the target
    const upstream = await fetch(TARGET_URL, {
      method: req.method,
      headers: newHeaders,
      body
    });

    // Relay status and headers
    upstream.headers.forEach((value, key) => {
      // Avoid setting hop-by-hop headers that Node/servers may manage
      res.setHeader(key, value);
    });
    res.status(upstream.status);

    // Stream or send the body back
    const buffer = await upstream.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send('Proxy error: ' + String(err));
  }
};
