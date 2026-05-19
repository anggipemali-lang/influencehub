const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend jalan!",
  });
});

// Route contoh API
app.get("/api/user", (req, res) => {
  res.json({
    success: true,
    data: {
      nama: "Anggi",
      status: "Aktif",
    },
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});