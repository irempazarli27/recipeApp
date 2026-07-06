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

// Tüm tabloları oluştur (yoksa)
async function runMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255),
      role VARCHAR(50) NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      difficulty VARCHAR(50),
      time_minutes INTEGER,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ingredients (
      id SERIAL PRIMARY KEY,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      amount NUMERIC,
      unit VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS recipe_steps (
      id SERIAL PRIMARY KEY,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      instruction TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, recipe_id)
    );

    CREATE TABLE IF NOT EXISTS recipe_wishlist (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY(user_id, recipe_id)
    );

    CREATE TABLE IF NOT EXISTS shopping_lists (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS shopping_list_items (
      id SERIAL PRIMARY KEY,
      list_id INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      amount NUMERIC,
      unit VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS view_history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
      view_count INTEGER DEFAULT 1,
      cooked_count INTEGER DEFAULT 0,
      UNIQUE(user_id, recipe_id)
    );

    CREATE TABLE IF NOT EXISTS weekly_plan (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      day_of_week INTEGER NOT NULL,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE SET NULL,
      week_start DATE NOT NULL DEFAULT date_trunc('week', CURRENT_DATE)::date,
      PRIMARY KEY(user_id, day_of_week, week_start)
    );

    CREATE TABLE IF NOT EXISTS recipe_ratings (
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      PRIMARY KEY(user_id, recipe_id)
    );
  `);

  // Varsayılan kategorileri ekle (yoksa)
  await pool.query(`
    INSERT INTO categories (name) VALUES
      ('Çorba'), ('Ana Yemek'), ('Salata'), ('Tatlı'),
      ('Kahvaltılık'), ('Atıştırmalık'), ('İçecek'), ('Sebze Yemeği')
    ON CONFLICT (name) DO NOTHING;
  `);

  console.log('[DB] Migrasyon tamamlandı.');
}

runMigrations().catch(err => console.error('[DB] Migrasyon hatası:', err.message));

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
