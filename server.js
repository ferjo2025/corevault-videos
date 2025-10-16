const express = require("express");
const path = require("path");
const app = express();

// Puerto de Render o local
const PORT = process.env.PORT || 3000;

// Middleware para logs simples
app.use((req, res, next) => {
  console.log(`🌐 Request: ${req.method} ${req.url}`);
  next();
});

// Ruta principal para enviar video
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
