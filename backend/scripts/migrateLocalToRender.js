/**
 * Local PostgreSQL'den Render PostgreSQL'e veri taşıma scripti
 * Çalıştırmak için:
 * node backend/scripts/migrateLocalToRender.js
 */

import pg from 'pg';
const { Pool } = pg;

const LOCAL = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'irem',
  database: 'recipe_app',
});

const RENDER = new Pool({
  connectionString: 'postgresql://recipe_app_db_5z2a_user:OxLqXjr1hG3Iisi7bXgkUWFB0ifQdjEJ@dpg-d95lqb5aeets73bbc48g-a.frankfurt-postgres.render.com/recipe_app_db_5z2a',
  ssl: { rejectUnauthorized: false },
});

async function migrate() {
  console.log('Migrasyon başlıyor...\n');

  // 1. Render DB'yi temizle
  await RENDER.query(`
    TRUNCATE recipe_steps, ingredients, favorites, recipe_wishlist,
             view_history, weekly_plan, recipe_notes, recipes,
             categories RESTART IDENTITY CASCADE;
  `);
  console.log('✓ Render DB temizlendi');

  // 2. Kategorileri aktar
  const cats = await LOCAL.query('SELECT id, name, slug FROM categories ORDER BY id');
  for (const c of cats.rows) {
    await RENDER.query(
      'INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
      [c.id, c.name, c.slug]
    );
  }
  await RENDER.query(`SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories))`);
  console.log(`✓ ${cats.rows.length} kategori aktarıldı`);

  // 3. Tarifleri aktar
  const recipes = await LOCAL.query(`
    SELECT id, title, description, difficulty,
           prep_time_minutes, cook_time_minutes, base_servings,
           category_id, tags, created_at, updated_at
    FROM recipes ORDER BY id
  `);
  for (const r of recipes.rows) {
    await RENDER.query(
      `INSERT INTO recipes
        (id, title, description, difficulty,
         prep_time_minutes, cook_time_minutes, base_servings,
         category_id, tags, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING`,
      [
        r.id, r.title, r.description, r.difficulty,
        r.prep_time_minutes, r.cook_time_minutes, r.base_servings,
        r.category_id, r.tags, r.created_at, r.updated_at,
      ]
    );
  }
  await RENDER.query(`SELECT setval('recipes_id_seq', (SELECT MAX(id) FROM recipes))`);
  console.log(`✓ ${recipes.rows.length} tarif aktarıldı`);

  // 4. Malzemeleri aktar
  const ings = await LOCAL.query(`
    SELECT id, recipe_id, name, amount, unit, notes FROM ingredients ORDER BY id
  `);
  let ingCount = 0;
  for (const i of ings.rows) {
    await RENDER.query(
      `INSERT INTO ingredients (id, recipe_id, name, amount, unit, notes)
       VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING`,
      [i.id, i.recipe_id, i.name, i.amount, i.unit, i.notes]
    );
    ingCount++;
  }
  await RENDER.query(`SELECT setval('ingredients_id_seq', (SELECT MAX(id) FROM ingredients))`);
  console.log(`✓ ${ingCount} malzeme aktarıldı`);

  // 5. Adımları aktar
  const steps = await LOCAL.query(`
    SELECT id, recipe_id, step_number, instruction FROM recipe_steps ORDER BY id
  `);
  let stepCount = 0;
  for (const s of steps.rows) {
    await RENDER.query(
      `INSERT INTO recipe_steps (id, recipe_id, step_number, instruction)
       VALUES ($1,$2,$3,$4) ON CONFLICT (id) DO NOTHING`,
      [s.id, s.recipe_id, s.step_number, s.instruction]
    );
    stepCount++;
  }
  await RENDER.query(`SELECT setval('recipe_steps_id_seq', (SELECT MAX(id) FROM recipe_steps))`);
  console.log(`✓ ${stepCount} adım aktarıldı`);

  // 6. Doğrulama
  const counts = await RENDER.query(`
    SELECT
      (SELECT COUNT(*) FROM categories) AS categories,
      (SELECT COUNT(*) FROM recipes) AS recipes,
      (SELECT COUNT(*) FROM ingredients) AS ingredients,
      (SELECT COUNT(*) FROM recipe_steps) AS steps
  `);
  console.log('\n--- Render DB Özet ---');
  console.table(counts.rows[0]);
  console.log('\nMigrasyon tamamlandı!');
}

migrate()
  .catch(err => { console.error('HATA:', err.message); process.exit(1); })
  .finally(() => { LOCAL.end(); RENDER.end(); });
