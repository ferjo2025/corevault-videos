import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ===========================
// 🔹 Variables para rutas
// ===========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// 🔹 Middleware de logs
// ===========================
app.use((req, res, next) => {
  console.log(`🌐 Request: ${req.method} ${req.url}`);
  next();
});

// ===========================
// 🔹 Ruta principal de prueba
// ===========================
app.get("/", (req, res) => {
  res.send("✅ Server Render activo. Usa /video?name=bienvenida para probar tu video.");
});

// ===========================
// 🔹 Ruta para enviar videos
// ===========================
// Ejemplo de uso: /video?name=bienvenida
app.get("/video", (req, res) => {
  const name = req.query.name || "bienvenida";       // nombre del video
  const videoPath = path.join(__dirname, `${name}.mp4`); // archivo en la raíz

  console.log("🎬 Solicitando video:", videoPath);

  // Enviar video con encabezado correcto
  res.sendFile(videoPath, { headers: { 'Content-Type': 'video/mp4' } }, (err) => {
    if (err) {
      console.error("❌ Error enviando video:", err.message);
      res.status(404).send("🎞️ Video no encontrado en el servidor.");
    } else {
      console.log(`✅ Video "${name}.mp4" enviado correctamente`);
    }
  });
});

// ===========================
// 🔹 Iniciar servidor
// ===========================
app.listen(PORT, () => {
  console.log(`🚀 Server activo en puerto ${PORT}`);
});
