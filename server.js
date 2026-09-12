/**
 * Dual-Stack Node.js Web Server for Oru Average Malayali
 * Connects Act 1 (Web Career Agent) with Act 2 (Indian Education Machine)
 * Supports both IPv4 and IPv6 on Windows / macOS / Linux seamlessly.
 * Zero external dependencies required.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = parseInt(process.argv[2], 10) || 8080;
const PROJECT_DIR = __dirname;
const ACT2_DIR = path.join(PROJECT_DIR, "useless_project_temp");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".task": "application/octet-stream",
  ".wasm": "application/wasm",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function setNoCacheHeaders(res) {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

function serveStaticFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    if (stats.isDirectory()) {
      serveStaticFile(req, res, path.join(filePath, "index.html"));
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    setNoCacheHeaders(res);
    setCorsHeaders(res);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/health
  if (req.method === "GET" && pathname === "/api/health") {
    const act2DirExists = fs.existsSync(ACT2_DIR);
    const act2ScriptExists =
      fs.existsSync(path.join(ACT2_DIR, "act2_app.js")) ||
      fs.existsSync(path.join(PROJECT_DIR, "js", "act2-app.js")) ||
      fs.existsSync(path.join(ACT2_DIR, "act2_app.py"));

    const body = JSON.stringify({
      status: "ok",
      service: "oruaveragelag-node",
      act2_dir_exists: act2DirExists,
      act2_script_exists: act2ScriptExists
    });

    setCorsHeaders(res);
    setNoCacheHeaders(res);
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(body)
    });
    res.end(body);
    return;
  }

  // POST /api/start-act2
  if (req.method === "POST" && pathname === "/api/start-act2") {
    let rawBody = "";
    req.on("data", chunk => {
      rawBody += chunk;
    });

    req.on("end", () => {
      try {
        let data = {};
        if (rawBody.trim()) {
          data = JSON.parse(rawBody);
        }

        const careerVerdict = data.careerVerdict || "B.Tech Engineering Edition";
        const candidateName = data.candidateName || "Aspirant";
        const streamBadge = data.streamBadge || "ENGINEER PATHWAY";
        const ammavanQuote = data.ammavanQuote || "It's Indian society, you don't have another option.";

        // Write session.json to both locations
        const sessionData = {
          career_verdict: careerVerdict,
          candidate_name: candidateName,
          stream_badge: streamBadge,
          ammavan_advice: ammavanQuote,
          timestamp: data.timestamp || new Date().toISOString()
        };

        try {
          if (!fs.existsSync(ACT2_DIR)) {
            fs.mkdirSync(ACT2_DIR, { recursive: true });
          }
          fs.writeFileSync(
            path.join(ACT2_DIR, "session.json"),
            JSON.stringify(sessionData, null, 2),
            "utf-8"
          );
          fs.writeFileSync(
            path.join(PROJECT_DIR, "session.json"),
            JSON.stringify(sessionData, null, 2),
            "utf-8"
          );
          console.log(`[Bridge] Wrote session.json: ${careerVerdict} for ${candidateName}`);
        } catch (fileErr) {
          console.error(`[Bridge] Error writing session.json:`, fileErr);
        }

        const resp = {
          status: "ok",
          launched: true,
          url: "/act2.html",
          career: careerVerdict,
          candidate: candidateName
        };

        const respBytes = JSON.stringify(resp);
        setCorsHeaders(res);
        setNoCacheHeaders(res);
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(respBytes)
        });
        res.end(respBytes);
      } catch (err) {
        console.error("[Bridge] Error in /api/start-act2:", err);
        const errBytes = JSON.stringify({ status: "error", error: err.message });
        setCorsHeaders(res);
        res.writeHead(500, {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Length": Buffer.byteLength(errBytes)
        });
        res.end(errBytes);
      }
    });
    return;
  }

  // Static file serving
  if (req.method === "GET") {
    if (pathname === "/") {
      pathname = "/index.html";
    }

    const safePath = path.normalize(path.join(PROJECT_DIR, pathname));
    if (!safePath.startsWith(PROJECT_DIR)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("403 Forbidden");
      return;
    }

    serveStaticFile(req, res, safePath);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Method Not Allowed");
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Oru Average Malayali — Node.js Integrated Server`);
  console.log(`  Running at http://localhost:${PORT}`);
  console.log(`  Supporting both Act 1 (Web Agent) & Act 2 (Education Machine)`);
  console.log(`=======================================================`);
});
