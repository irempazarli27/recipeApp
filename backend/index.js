// Backend giriş noktası
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json());


// Sağlık kontrolü
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Tüm route'ları yükle
routes(app);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend hazir: http://localhost:${port}`);
});
