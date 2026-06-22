import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8080);

const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml; charset=utf-8"
};

function resolvePath(urlPathname) {
    const cleanPath = decodeURIComponent(urlPathname.split("?")[0]);
    const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
    const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.[\\/])+/, "");
    return path.join(rootDir, normalizedPath);
}

const server = http.createServer(async (req, res) => {
    const filePath = resolvePath(req.url || "/");

    if (!filePath.startsWith(rootDir) || !existsSync(filePath)) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
    }

    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
    }

    const extension = path.extname(filePath).toLowerCase();

    res.writeHead(200, {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "no-store"
    });

    createReadStream(filePath).pipe(res);
});

server.listen(port, () => {
    console.log(`Frontend available at http://127.0.0.1:${port}`);
});
