/**
 * Veritabanına örnek Türk yemekleri ekler.
 * Kullanım: node backend/scripts/seedRecipes.js
 * Render DB: DATABASE_URL="..." node backend/scripts/seedRecipes.js
 */
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://irem@localhost:5432/recipe_app',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const recipes = [
  {
    title: 'Mercimek Çorbası',
    description: 'Klasik Türk mutfağının vazgeçilmezi, besleyici ve lezzetli kırmızı mercimek çorbası.',
    difficulty: 'kolay',
    time_minutes: 30,
    category: 'Çorba',
    ingredients: [
      { name: 'Kırmızı mercimek', amount: 1, unit: 'su bardağı' },
      { name: 'Soğan', amount: 1, unit: 'adet' },
      { name: 'Havuç', amount: 1, unit: 'adet' },
      { name: 'Patates', amount: 1, unit: 'adet' },
      { name: 'Tereyağı', amount: 2, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Pul biber', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Kimyon', amount: 0.5, unit: 'tatlı kaşığı' },
      { name: 'Su', amount: 6, unit: 'su bardağı' },
    ],
    steps: [
      'Mercimeği yıkayın. Soğan, havuç ve patatesi küçük küpler halinde doğrayın.',
      'Tencereye tereyağını ekleyip soğanı kavurun.',
      'Havuç ve patatesi ekleyip 2 dakika daha kavurun.',
      'Mercimek ve suyu ekleyip kaynamaya bırakın.',
      'Kısık ateşte 20-25 dakika pişirin.',
      'Blender ile pürüzsüz hale getirin.',
      'Tuz ve baharatları ekleyip 5 dakika daha pişirin.',
      'Üzerine kızdırılmış tereyağı ve pul biber gezdirerek servis yapın.',
    ],
    note: 'Daha koyu renk için bir tutam zerdeçal ekleyebilirsiniz.',
  },
  {
    title: 'Karnıyarık',
    description: 'İçi kıymalı dolgu ile pişirilmiş fırın patlıcan yemeği.',
    difficulty: 'orta',
    time_minutes: 60,
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Patlıcan', amount: 4, unit: 'adet' },
      { name: 'Kıyma', amount: 300, unit: 'gram' },
      { name: 'Soğan', amount: 2, unit: 'adet' },
      { name: 'Domates', amount: 3, unit: 'adet' },
      { name: 'Yeşil biber', amount: 2, unit: 'adet' },
      { name: 'Sarımsak', amount: 3, unit: 'diş' },
      { name: 'Zeytinyağı', amount: 4, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Karabiber', amount: 0.5, unit: 'tatlı kaşığı' },
      { name: 'Maydanoz', amount: 1, unit: 'demet' },
    ],
    steps: [
      'Patlıcanları yıkayıp kabukları çizgili soyun, tuzlu suda bekletin.',
      'Patlıcanları yağda kızartın, fazla yağını alın.',
      'Kıymayı soğan ve sarımsak ile kavurun.',
      'İnce doğranmış domates ve biberleri ekleyip pişirin.',
      'Tuz, karabiber ve maydanoz ekleyin.',
      'Patlıcanların ortasını boylamasına kesin ve iç harcı doldurun.',
      'Üzerine dilimlenmiş domates ve biber koyun.',
      '180°C fırında 30-35 dakika pişirin.',
    ],
    note: 'Patlıcanları kızartmak yerine fırında da pişirebilirsiniz.',
  },
  {
    title: 'Çoban Salatası',
    description: 'Taze sebzelerle hazırlanan hafif ve ferahlatıcı Türk salatası.',
    difficulty: 'kolay',
    time_minutes: 15,
    category: 'Salata',
    ingredients: [
      { name: 'Domates', amount: 3, unit: 'adet' },
      { name: 'Salatalık', amount: 2, unit: 'adet' },
      { name: 'Yeşil biber', amount: 2, unit: 'adet' },
      { name: 'Soğan', amount: 1, unit: 'adet' },
      { name: 'Maydanoz', amount: 0.5, unit: 'demet' },
      { name: 'Zeytinyağı', amount: 3, unit: 'yemek kaşığı' },
      { name: 'Limon suyu', amount: 2, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 0.5, unit: 'tatlı kaşığı' },
    ],
    steps: [
      'Tüm sebzeleri küçük küpler halinde doğrayın.',
      'Maydanozu ince kıyın.',
      'Tüm malzemeleri büyük bir kaba alın.',
      'Zeytinyağı, limon suyu ve tuz ekleyip karıştırın.',
      'Servis öncesi 10 dakika buzdolabında bekletin.',
    ],
    note: 'Servis öncesi tuz ekleyin, aksi halde sebzeler su bırakır.',
  },
  {
    title: 'Sütlaç',
    description: 'Fırında pişirilmiş geleneksel Türk pirinç pudingi.',
    difficulty: 'orta',
    time_minutes: 90,
    category: 'Tatlı',
    ingredients: [
      { name: 'Pirinç', amount: 0.5, unit: 'su bardağı' },
      { name: 'Süt', amount: 1, unit: 'litre' },
      { name: 'Şeker', amount: 0.75, unit: 'su bardağı' },
      { name: 'Nişasta', amount: 2, unit: 'yemek kaşığı' },
      { name: 'Vanilya', amount: 1, unit: 'paket' },
      { name: 'Su', amount: 1.5, unit: 'su bardağı' },
    ],
    steps: [
      'Pirinci yıkayıp su ile haşlayın.',
      'Pişen pirinci sütle birlikte tencereye alın ve kısık ateşte pişirmeye başlayın.',
      'Şekeri ekleyip karıştırın.',
      'Nişastayı az su ile eritip tencereye yavaşça ekleyin.',
      'Koyulaşana kadar sürekli karıştırarak pişirin.',
      'Vanilya ekleyip kaseler veya fırın kabına dökün.',
      'Üzeri kızarana kadar fırında ızgara konumunda pişirin.',
      'Soğuduktan sonra buzdolabında soğutup servis yapın.',
    ],
    note: 'Üzerine tarçın serperek servis yapabilirsiniz.',
  },
  {
    title: 'Menemen',
    description: 'Domates ve biberle yapılan geleneksel Türk kahvaltılık yumurta yemeği.',
    difficulty: 'kolay',
    time_minutes: 20,
    category: 'Kahvaltılık',
    ingredients: [
      { name: 'Yumurta', amount: 3, unit: 'adet' },
      { name: 'Domates', amount: 2, unit: 'adet' },
      { name: 'Yeşil biber', amount: 2, unit: 'adet' },
      { name: 'Soğan', amount: 1, unit: 'adet' },
      { name: 'Zeytinyağı', amount: 2, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 0.5, unit: 'tatlı kaşığı' },
      { name: 'Karabiber', amount: 0.25, unit: 'tatlı kaşığı' },
    ],
    steps: [
      'Soğanı ve biberi ince kıyın.',
      'Tavada zeytinyağını ısıtıp soğanı kavurun.',
      'Biberleri ekleyip 2 dakika kavurun.',
      'Rendelenmiş veya küçük doğranmış domatesleri ekleyin.',
      'Domatesler suyunu çekene kadar orta ateşte pişirin.',
      'Yumurtaları kırıp karıştırın veya bütün bırakın.',
      'Tuz ve karabiber ekleyip yumurtalar pişene kadar pişirin.',
      'Ekmekle sıcak servis yapın.',
    ],
    note: 'Geleneksel menemen karıştırılmaz, yumurtalar bütün bırakılır.',
  },
  {
    title: 'Tavuk Sote',
    description: 'Sebzeli, baharatlı pratik tavuk sote — hem hafif hem doyurucu.',
    difficulty: 'kolay',
    time_minutes: 35,
    category: 'Ana Yemek',
    ingredients: [
      { name: 'Tavuk göğsü', amount: 500, unit: 'gram' },
      { name: 'Biber (renkli)', amount: 2, unit: 'adet' },
      { name: 'Soğan', amount: 1, unit: 'adet' },
      { name: 'Mantar', amount: 200, unit: 'gram' },
      { name: 'Sarımsak', amount: 3, unit: 'diş' },
      { name: 'Zeytinyağı', amount: 3, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Kekik', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Karabiber', amount: 0.5, unit: 'tatlı kaşığı' },
    ],
    steps: [
      'Tavuk göğsünü küçük küpler halinde doğrayın.',
      'Tavada yağı ısıtıp tavukları her tarafı mühürlenene kadar kavurun.',
      'Soğan ve sarımsağı ekleyip kavurun.',
      'Biber ve mantarları ekleyin.',
      'Tuz, kekik ve karabiber serpin.',
      'Orta ateşte 15-20 dakika pişirin.',
      'Pirinç pilavı veya ekmekle servis yapın.',
    ],
    note: 'Daha lezzetli olması için tavukları önceden marine edebilirsiniz.',
  },
  {
    title: 'İmam Bayıldı',
    description: 'Zeytinyağlı, soğan-domatesli patlıcan yemeği — vejetaryen ve hafif.',
    difficulty: 'orta',
    time_minutes: 60,
    category: 'Sebze Yemeği',
    ingredients: [
      { name: 'Patlıcan', amount: 4, unit: 'adet' },
      { name: 'Soğan', amount: 3, unit: 'adet' },
      { name: 'Domates', amount: 4, unit: 'adet' },
      { name: 'Sarımsak', amount: 4, unit: 'diş' },
      { name: 'Zeytinyağı', amount: 6, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Şeker', amount: 1, unit: 'tatlı kaşığı' },
      { name: 'Maydanoz', amount: 0.5, unit: 'demet' },
    ],
    steps: [
      'Patlıcanları soyup ortasından yarın, tuzlu suda bekletin.',
      'Soğanı ince halkalar halinde doğrayın.',
      'Zeytinyağında soğanları kavurun.',
      'Sarımsak ve domatesleri ekleyip pişirin.',
      'Tuz, şeker ve maydanoz ekleyin.',
      'Patlıcanları yağda hafif kızartın.',
      'İçlerine soğan-domates harcını doldurun.',
      'Üzerine zeytinyağı ve su ekleyip kısık ateşte 30-40 dakika pişirin.',
    ],
    note: 'Soğuyunca daha lezzetlidir, ertesi gün de güzel olur.',
  },
  {
    title: 'Ayran',
    description: 'Soğuk, serinletici geleneksel Türk içeceği.',
    difficulty: 'kolay',
    time_minutes: 5,
    category: 'İçecek',
    ingredients: [
      { name: 'Yoğurt', amount: 1, unit: 'su bardağı' },
      { name: 'Soğuk su', amount: 1, unit: 'su bardağı' },
      { name: 'Tuz', amount: 1, unit: 'tutam' },
    ],
    steps: [
      'Yoğurdu derin bir kaba alın.',
      'Soğuk suyu yavaş yavaş ekleyerek çırpın.',
      'Bir tutam tuz ekleyip karıştırın.',
      'Köpürmesi için 1 dakika çırpın.',
      'Buz ekleyip soğuk servis yapın.',
    ],
    note: 'Blender ile yapılırsa daha köpüklü olur.',
  },
  {
    title: 'Kısır',
    description: 'Bulgurla yapılan, narlı Türk salatası — hafif ve sağlıklı.',
    difficulty: 'kolay',
    time_minutes: 30,
    category: 'Salata',
    ingredients: [
      { name: 'İnce bulgur', amount: 1, unit: 'su bardağı' },
      { name: 'Nar ekşisi', amount: 2, unit: 'yemek kaşığı' },
      { name: 'Domates salçası', amount: 1, unit: 'yemek kaşığı' },
      { name: 'Zeytinyağı', amount: 3, unit: 'yemek kaşığı' },
      { name: 'Domates', amount: 2, unit: 'adet' },
      { name: 'Yeşil soğan', amount: 4, unit: 'adet' },
      { name: 'Maydanoz', amount: 1, unit: 'demet' },
      { name: 'Nane', amount: 1, unit: 'yemek kaşığı' },
      { name: 'Tuz', amount: 1, unit: 'tatlı kaşığı' },
    ],
    steps: [
      'Bulguru kaynar su ile ıslatıp 10 dakika demleyin.',
      'Salça, nar ekşisi, zeytinyağı ve tuzla yoğurun.',
      'Domates ve yeşil soğanı küçük küp doğrayın.',
      'Maydanoz ve naneyi ince kıyın.',
      'Tüm malzemeleri karıştırın.',
      '15 dakika dinlendirip servis yapın.',
    ],
    note: 'Nar tanesi veya ceviz eklerseniz daha zengin olur.',
  },
  {
    title: 'Fırın Sütlaç',
    description: 'Üzeri fırında kızartılmış kremalı Türk tatlısı.',
    difficulty: 'orta',
    time_minutes: 75,
    category: 'Tatlı',
    ingredients: [
      { name: 'Süt', amount: 1, unit: 'litre' },
      { name: 'Pirinç', amount: 100, unit: 'gram' },
      { name: 'Şeker', amount: 150, unit: 'gram' },
      { name: 'Pirinç nişastası', amount: 3, unit: 'yemek kaşığı' },
      { name: 'Vanilya özü', amount: 1, unit: 'tatlı kaşığı' },
    ],
    steps: [
      'Pirinci 1 saat suda bekletip haşlayın.',
      'Sütü orta ateşte ısıtın.',
      'Şeker ve nişastayı az süt ile eritip ana süte ekleyin.',
      'Pişmiş pirinci ekleyip koyulaşana kadar karıştırın.',
      'Vanilya ekleyin.',
      'Fırın kaplarına dökün.',
      'Fırın üst ısıtıcısında (ızgara) üzeri kızarana kadar pişirin.',
      'Soğutup buzdolabında bekletip servis yapın.',
    ],
    note: 'Tarçın ile servis yapın.',
  },
];

async function seed() {
  console.log('Seed başlıyor...');

  for (const recipe of recipes) {
    // Kategoriyi bul
    const catRes = await pool.query('SELECT id FROM categories WHERE name = $1', [recipe.category]);
    if (!catRes.rows.length) {
      console.warn(`Kategori bulunamadı: ${recipe.category}`);
      continue;
    }
    const categoryId = catRes.rows[0].id;

    // Tarif zaten var mı?
    const exists = await pool.query('SELECT id FROM recipes WHERE title = $1', [recipe.title]);
    if (exists.rows.length) {
      console.log(`Atlandı (zaten var): ${recipe.title}`);
      continue;
    }

    // Tarifi ekle
    const recipeRes = await pool.query(
      `INSERT INTO recipes (title, description, difficulty, time_minutes, category_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [recipe.title, recipe.description, recipe.difficulty, recipe.time_minutes, categoryId]
    );
    const recipeId = recipeRes.rows[0].id;

    // Malzemeleri ekle
    for (const ing of recipe.ingredients) {
      await pool.query(
        'INSERT INTO ingredients (recipe_id, name, amount, unit) VALUES ($1, $2, $3, $4)',
        [recipeId, ing.name, ing.amount, ing.unit]
      );
    }

    // Adımları ekle
    for (let i = 0; i < recipe.steps.length; i++) {
      await pool.query(
        'INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES ($1, $2, $3)',
        [recipeId, i + 1, recipe.steps[i]]
      );
    }

    console.log(`✓ Eklendi: ${recipe.title}`);
  }

  console.log('\nSeed tamamlandı!');
  await pool.end();
}

seed().catch(err => {
  console.error('Seed hatası:', err.message);
  process.exit(1);
});
