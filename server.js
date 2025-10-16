import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware simple para logs
app.use((req, res, next) => {
  console.log(`🌐 Request: ${req.method} ${req.url}`);
  next();
});

// Ruta para enviar video por query
// Ejemplo: /video?name=bienvenida
app.get("/video", (req, res) => {
  const name = req.query.name || "bienvenida";
  const videoPath = path.join(__dirname, `${name}.mp4`);

  console.log("🎬 Solicitando video:", videoPath);

  res.sendFile(videoPath, (err) => {
    if (err) {
      console.error("❌ Error enviando video:", err.message);
      res.status(404).send("🎞️ Video no encontrado en el servidor.");
    }
  });
});

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ Server Render activo. Usa /video?name=bienvenida para probar tu video.");
});

// Iniciar server
app.listen(PORT, () => {
  console.log(`🚀 Server activo en puerto ${PORT}`);
});
