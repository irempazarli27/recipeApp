import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[Gemini] GEMINI_API_KEY tanımlı değil, AI özellikleri devre dışı.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Elindeki malzemelere göre tarif önerileri üretir.
 * @param {string[]} ingredients - malzeme listesi
 * @param {string} [title] - isteğe bağlı tarif adı
 * @returns {Promise<string>} - Gemini'nin metin yanıtı
 */
export async function suggestRecipesWithAI(ingredients, title, existingTitles = []) {
  if (!ai) throw new Error('Gemini API anahtarı yapılandırılmamış.');

  const existingLower = existingTitles.map(t => t.toLowerCase().trim());

  let contextDesc;
  if (title && ingredients.length === 0) {
    contextDesc = `"${title}" ile ilgili`;
  } else if (title && ingredients.length > 0) {
    contextDesc = `"${title}" tarifi yapmak istiyorum, elimde şu malzemeler var: ${ingredients.join(', ')}. Bu koşullara uygun`;
  } else {
    contextDesc = `Elimde şu malzemeler var: ${ingredients.join(', ')}. Bu malzemelerle yapılabilecek`;
  }

  const excludeLine = existingTitles.length > 0
    ? `\nÖNEMLİ KURAL: Aşağıdaki tarifler ZATEN uygulamada mevcut. Bu listede olan HİÇBİR tarifi ÖNERME, tamamen farklı ve özgün tarifler seç:\n${existingTitles.join(', ')}.`
    : '';

  const prompt = `${contextDesc} 3 Türk yemeği tarifi öner.${excludeLine} Türkçe yaz, Türkçe karakterleri doğru kullan (ş, ğ, ü, ö, ç, ı, İ, Ğ, Ü, Ş, Ç gibi).
Yanıtı SADECE geçerli JSON formatında ver, başka hiçbir metin veya açıklama ekleme:
[
  {"name": "Tarif Adı", "description": "Kısa açıklama (1-2 cümle)", "difficulty": "kolay", "time": "30 dk"},
  {"name": "Tarif Adı 2", "description": "Kısa açıklama", "difficulty": "orta", "time": "45 dk"},
  {"name": "Tarif Adı 3", "description": "Kısa açıklama", "difficulty": "zor", "time": "60 dk"}
]`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    
  });
  const text = response.text.trim();
  // JSON array'i çıkar (markdown code block içinde olabilir)
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI yanıtı JSON formatında değil');
  const parsed = JSON.parse(match[0]);

  // Backend filtresi: DB'deki isimlerle birebir örtüşenleri çıkar
  return parsed.filter(r => {
    const name = (r.name || '').toLowerCase().trim();
    return !existingLower.some(ex => ex === name || ex.includes(name) || name.includes(ex));
  });
}

/**
 * Günlük tarif önerileri üretir (malzeme gerekmez).
 * @returns {Promise<Array>}
 */
export async function getDailyRecipes(existingTitles = []) {
  if (!ai) throw new Error('Gemini API anahtarı yapılandırılmamış.');

  const existingLower = existingTitles.map(t => t.toLowerCase().trim());

  const excludeLine = existingTitles.length > 0
    ? `\nÖNEMLİ KURAL: Aşağıdaki tarifler ZATEN uygulamada mevcut. Bu listede olan HİÇBİR tarifi ÖNERME, tamamen farklı ve özgün tarifler seç:\n${existingTitles.join(', ')}.`
    : '';

  const prompt = `Bugün için 3 farklı Türk mutfağı tarifi öner. Çeşitli kategorilerden seç (örneğin çorba, ana yemek, tatlı veya kahvaltılık).${excludeLine}
Türkçe yaz, Türkçe karakterleri doğru kullan (ş, ğ, ü, ö, ç, ı gibi).
Yanıtı SADECE geçerli JSON formatında ver, başka hiçbir metin veya açıklama ekleme:
[
  {"name": "Tarif Adı", "description": "Kısa açıklama (1-2 cümle)", "difficulty": "kolay", "time": "30 dk"},
  {"name": "Tarif Adı 2", "description": "Kısa açıklama", "difficulty": "orta", "time": "45 dk"},
  {"name": "Tarif Adı 3", "description": "Kısa açıklama", "difficulty": "zor", "time": "60 dk"}
]`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    
  });
  const text = response.text.trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI yanıtı JSON formatında değil');
  const parsed = JSON.parse(match[0]);

  // Backend filtresi: DB'deki isimlerle birebir örtüşenleri çıkar
  return parsed.filter(r => {
    const name = (r.name || '').toLowerCase().trim();
    return !existingLower.some(ex => ex === name || ex.includes(name) || name.includes(ex));
  });
}

/**
 * Haftalık menü için 7 kategori önerisi üretir
 */
export async function suggestWeeklyPlan(categories) {
  if (!ai) throw new Error('Gemini API anahtarı yapılandırılmamış.');
  const catList = categories.join(', ');
  const prompt = `Türk mutfağında haftalık (7 günlük) dengeli bir yemek planı öner. Mevcut kategoriler: ${catList}.
Her gün için farklı bir kategori seç, çeşitli ve dengeli olsun (örn. Pazartesi çorba+ana yemek, Salı sebze, vb.)
Yanıtı SADECE geçerli JSON formatında ver, başka hiçbir metin ekleme. Türkçe yaz:
[
  {"day": 0, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden (tek cümle)"},
  {"day": 1, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"},
  {"day": 2, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"},
  {"day": 3, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"},
  {"day": 4, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"},
  {"day": 5, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"},
  {"day": 6, "category": "kategori adı", "difficulty": "kolay|orta|zor", "reason": "kısa neden"}
]`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    
  });
  const text = response.text.trim();
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('AI yanıtı JSON formatında değil');
  return JSON.parse(match[0]);
}

/**
 * Mevcut bir tarifi dönüştürür (vejetaryen, kolay, sağlıklı vb.)
 */
export async function transformRecipe(recipe, transformation) {
  if (!ai) throw new Error('Gemini API anahtarı yapılandırılmamış.');
  const transformMap = {
    vejetaryen: 'vejetaryen (etsiz) versiyona çevir; et yerine uygun sebze veya baklagil kullan',
    kolay: 'daha kolay ve pratik bir versiyona çevir; karmaşık adımları sadeleştir, hazır ürün kullanılabilir',
    saglikli: 'daha sağlıklı bir versiyona çevir; yağı azalt, şekeri azalt veya doğal tatlandırıcı kullan',
    glutensiz: 'glutensiz versiyona çevir; unlu ürünleri glutensiz alternatiflerle değiştir',
  };
  const desc = transformMap[transformation] || transformation;
  const ingList = (recipe.ingredients || []).map(i => `${i.amount || ''} ${i.unit || ''} ${i.name}`.trim()).join(', ');
  const stepList = (recipe.steps || []).map((s, i) => `${i + 1}. ${s.instruction || s}`).join(' ');
  const prompt = `"${recipe.title}" tarifini ${desc}.
Mevcut malzemeler: ${ingList}
Mevcut adımlar: ${stepList}

Dönüştürülmüş tarifi SADECE geçerli JSON formatında ver, başka hiçbir metin veya açıklama ekleme. Türkçe yaz:
{
  "title": "Yeni Tarif Adı",
  "ingredients": [{"name": "malzeme", "amount": 1, "unit": "birim"}],
  "steps": ["adım 1", "adım 2"],
  "note": "yapılan değişiklikler hakkında kısa not"
}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    
  });
  const text = response.text.trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI yanıtı JSON formatında değil');
  return JSON.parse(match[0]);
}

/**
 * Bir tarif adına göre detaylı tarif üretir.
 * @param {string} recipeName - tarif adı
 * @returns {Promise<string>}
 */
export async function generateRecipeDetail(recipeName) {
  if (!ai) throw new Error('Gemini API anahtarı yapılandırılmamış.');
  const prompt = `"${recipeName}" tarifini JSON formatında Türkçe yaz. Türkçe karakterleri doğru kullan (ş, ğ, ü, ö, ç, ı gibi). Markdown veya *, # gibi semboller kullanma.
Sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme:
{
  "ingredients": [
    {"name": "malzeme adı", "amount": 2, "unit": "su bardağı"},
    {"name": "malzeme adı", "amount": 1, "unit": "adet"}
  ],
  "steps": ["adım açıklaması", "adım açıklaması"],
  "note": "püf noktası veya ipucu (yoksa boş string yaz)"
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    
  });
  const text = response.text.trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('AI yanıtı JSON formatında değil');
  return JSON.parse(match[0]);
}
