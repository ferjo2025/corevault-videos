// ===================================================
// 🎥 CORE VAULT MEDIA SERVER (2 videos por ahora)
// ===================================================
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// 🔹 Logs de requests
// ===========================
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

// ===========================
// 🔹 Ruta raíz de prueba
// ===========================
app.get("/", (req, res) => {
  res.send(`
    ✅ Core Vault Media Server Activo<br><br>
    🎬 Videos disponibles:<br>
    - <a href="/video?name=bienvenidadash">bienvenidadash</a><br>
    - <a href="/video?name=invita">invita</a>
  `);
});

// ===========================
// 🎬 Ruta para videos (actualmente 2)
// ===========================
app.get("/video", (req, res) => {
  const name = req.query.name;

  // Lista blanca de videos permitidos
  const allowedVideos = ["bienvenidadash", "invita"];

  if (!name) return res.status(400).send("⚠️ Falta el parámetro 'name'.");
  if (!allowedVideos.includes(name)) return res.status(404).send("❌ Video no permitido.");

  const videoPath = path.join(__dirname, `${name}.mp4`);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("❌ Video no encontrado en el servidor.");
  }

  // ✅ Range requests para streaming
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
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

  console.log(`🎬 Video enviado: ${name}.mp4`);
});

// ===========================
// 🚀 Iniciar servidor
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Core Vault Media Server escuchando en puerto ${PORT}`);
});
