import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.send("🎥 CoreVault Video Service activo");
});

// ===============================
// Endpoint para servir videos
// ===============================
app.get("/video", (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).send("Falta parámetro 'name'");

  const videoPath = path.join(__dirname, "videos", `${name}.mp4`);
  if (!fs.existsSync(videoPath)) return res.status(404).send("Video no encontrado");

  res.setHeader("Content-Type", "video/mp4");
  fs.createReadStream(videoPath).pipe(res);
});

app.listen(PORT, () => console.log(`🚀 CoreVault Video Service en puerto ${PORT}`));
