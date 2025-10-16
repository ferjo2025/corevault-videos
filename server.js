import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ===========================
// 🔹 Configuración de rutas
// ===========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// 🔹 Middleware para logs
// ===========================
app.use((req, res, next) => {
  console.log(`🌐 Request: ${req.method} ${req.url}`);
  next();
});

// ===========================
// 🔹 Ruta de prueba
// ===========================
app.get("/", (req, res) => {
  res.send(
    "✅ Server Render activo. Usa /video?name=bienvenida para probar tu video."
  );
});

// ===========================
// 🔹 Ruta para enviar videos
// ===========================
// Ejemplo: /video?name=bienvenida
app.get("/video", (req, res) => {
  const name = req.query.name || "bienvenida"; // Nombre del video sin extensión
  const videoPath = path.join(__dirname, `${name}.mp4`);

  console.log("🎬 Solicitando video:", videoPath);

  // Establecer el Content-Type correcto antes de enviar
  res.set("Content-Type", "video/mp4");

  // Enviar archivo
  res.sendFile(videoPath, (err) => {
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
