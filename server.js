import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Endpoint dinámico para enviar el video
app.get("/video", (req, res) => {
  const name = req.query.name || "bienvenida";
  const videoPath = path.join(__dirname, `${name}.mp4`);
  res.sendFile(videoPath, (err) => {
    if (err) {
      console.error("❌ Error enviando video:", err.message);
      res.status(404).send("🎞️ Video no encontrado en el servidor.");
    }
  });
});

// ✅ Página simple para verificar el estado
app.get("/", (req, res) => {
  res.send("🚀 CoreVault Video Server está activo y listo.");
});

// ✅ Puerto de Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor de videos activo en puerto ${PORT}`));
