// Veritabanı bağlantısı
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://irem@localhost:5432/recipe_app'
});

export default pool;
