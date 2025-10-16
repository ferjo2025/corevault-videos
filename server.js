import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("🎥 CoreVault Video Service activo y listo para servir contenido Web3");
});

// ==========================================
// 📦 Endpoint para servir videos dinámicamente
// ==========================================
app.get("/video", (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).send("❌ Falta parámetro 'name' en la URL");

  const videoPath = path.join(__dirname, "videos", `${name}.mp4`);

  if (!fs.existsSync(videoPath)) {
    console.warn(`⚠️ Video no encontrado: ${videoPath}`);
    return res.status(404).send("🎞️ Video no encontrado en el servidor.");
  }

  // Configuración para streaming parcial (Telegram lo ama)
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 CoreVault Video Service corriendo en puerto ${PORT}`);
});
