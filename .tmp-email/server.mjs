import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(".tmp-email");

http
  .createServer((req, res) => {
    const name = decodeURIComponent((req.url ?? "/").split("?")[0]).replace(/^\/+/, "");
    const file = path.resolve(root, name || "preview-buy.html");
    if (!file.startsWith(root) || !fs.existsSync(file)) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(file));
  })
  .listen(4400, () => console.log("preview server on http://localhost:4400"));
