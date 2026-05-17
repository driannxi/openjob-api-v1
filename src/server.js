import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON (penting untuk API)
app.use(express.json());

// Endpoint dasar (Route)
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Halo! Server Express kamu sudah berjalan dengan lancar 🚀'
  });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di: http://localhost:${PORT}`);
});