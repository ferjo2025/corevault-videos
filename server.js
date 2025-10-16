import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Endpoint dinámico para cualquier video
app.get("/video", (req, res) => {
  const name = req.query.name || "bienvenida";
  const videoPath = path.join(__dirname, "videos", `${name}.mp4`);

  console.log("🎬 Solicitando video:", videoPath);

  res.sendFile(videoPath, (err) => {
    if (err) {
      console.error("❌ Error enviando video:", err.message);
      res.status(404).send("🎞️ Video no encontrado en el servidor.");
    }
  });
});

// ✅ Página de prueba para ver si el servidor está activo
app.get("/", (req, res) => {
  res.send("🚀 CoreVault Video Server está activo y listo.");
});

// ✅ Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor activo en puerto ${PORT}`));
