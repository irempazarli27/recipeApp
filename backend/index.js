// Backend giriş noktası
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import pool from './config/db.js';

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true
}));
app.use(express.json());

// DB migrasyonu: weekly_plan tablosuna week_start ekle
pool.query(`
  ALTER TABLE weekly_plan ADD COLUMN IF NOT EXISTS week_start DATE NOT NULL DEFAULT date_trunc('week', CURRENT_DATE)::date;
`).then(() =>
  pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'weekly_plan_pkey'
        AND contype = 'p'
        AND array_length(conkey, 1) = 2
      ) THEN
        ALTER TABLE weekly_plan DROP CONSTRAINT weekly_plan_pkey;
        ALTER TABLE weekly_plan ADD PRIMARY KEY (user_id, day_of_week, week_start);
      END IF;
    END$$;
  `)
).catch(err => console.error('Migration warning:', err.message));

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
