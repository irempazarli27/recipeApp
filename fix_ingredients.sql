-- Patlıcan veya kabak → tarife özgü sebze
UPDATE ingredients SET name = 'Sivri biber' WHERE recipe_id = 13 AND name = 'Patlıcan veya kabak';
UPDATE ingredients SET name = 'Patlıcan' WHERE recipe_id = 16 AND name = 'Patlıcan veya kabak';
UPDATE ingredients SET name = 'Ispanak' WHERE recipe_id = 20 AND name = 'Patlıcan veya kabak';
UPDATE ingredients SET name = 'Kabak' WHERE recipe_id = 28 AND name = 'Patlıcan veya kabak';

-- Ana meze malzemesi → tarife özgü ana malzeme
UPDATE ingredients SET name = 'Domates' WHERE recipe_id = 31 AND name = 'Ana meze malzemesi';
UPDATE ingredients SET name = 'Yoğurt' WHERE recipe_id = 34 AND name = 'Ana meze malzemesi';
UPDATE ingredients SET name = 'Süzme yoğurt' WHERE recipe_id = 38 AND name = 'Ana meze malzemesi';
UPDATE ingredients SET name = 'Haşlanmış nohut' WHERE recipe_id = 39 AND name = 'Ana meze malzemesi';
UPDATE ingredients SET name = 'Havuç' WHERE recipe_id = 48 AND name = 'Ana meze malzemesi';
UPDATE ingredients SET name = 'Siyah zeytin' WHERE recipe_id = 50 AND name = 'Ana meze malzemesi';

-- Kimyon veya nane → tarife özgü baharat
UPDATE ingredients SET name = 'Pul biber' WHERE recipe_id = 31 AND name = 'Kimyon veya nane';
UPDATE ingredients SET name = 'Nane' WHERE recipe_id = 34 AND name = 'Kimyon veya nane';
UPDATE ingredients SET name = 'Dereotu' WHERE recipe_id = 38 AND name = 'Kimyon veya nane';
UPDATE ingredients SET name = 'Kimyon' WHERE recipe_id = 39 AND name = 'Kimyon veya nane';
UPDATE ingredients SET name = 'Sarımsak' WHERE recipe_id = 48 AND name = 'Kimyon veya nane';
UPDATE ingredients SET name = 'Kekik' WHERE recipe_id = 50 AND name = 'Kimyon veya nane';

-- Ana atıştırmalık malzeme → tarife özgü ana malzeme
UPDATE ingredients SET name = 'Avokado' WHERE recipe_id = 32 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Yoğurt' WHERE recipe_id = 33 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Tavuk göğsü' WHERE recipe_id = 35 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Kabak' WHERE recipe_id = 36 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Haşlanmış nohut' WHERE recipe_id = 37 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Mantar' WHERE recipe_id = 40 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Kırmızı biber' WHERE recipe_id = 41 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Ekmek' WHERE recipe_id = 42 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Haşlanmış patates' WHERE recipe_id = 44 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Beyaz peynir' WHERE recipe_id = 46 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Yufka' WHERE recipe_id = 47 AND name = 'Ana atıştırmalık malzeme';
UPDATE ingredients SET name = 'Kabak' WHERE recipe_id = 49 AND name = 'Ana atıştırmalık malzeme';

-- Haşlanmış ana malzeme → tarife özgü
UPDATE ingredients SET name = 'Mısır' WHERE recipe_id = 43 AND name = 'Haşlanmış ana malzeme';
UPDATE ingredients SET name = 'Haşlanmış patates' WHERE recipe_id = 45 AND name = 'Haşlanmış ana malzeme';

-- Ekmek/lavaş/bazlama → tarife özgü ekmek
UPDATE ingredients SET name = 'Lavaş' WHERE recipe_id = 51 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Ekmek' WHERE recipe_id = 52 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Tost ekmeği' WHERE recipe_id = 55 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Tortilla' WHERE recipe_id = 64 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Tost ekmeği' WHERE recipe_id = 67 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Tortilla' WHERE recipe_id = 68 AND name = 'Ekmek/lavaş/bazlama';
UPDATE ingredients SET name = 'Ekmek' WHERE recipe_id = 69 AND name = 'Ekmek/lavaş/bazlama';

-- İç harç → tarife özgü ana malzeme
UPDATE ingredients SET name = 'Patates' WHERE recipe_id = 53 AND name = 'İç harç';
UPDATE ingredients SET name = 'Kaşar peyniri' WHERE recipe_id = 54 AND name = 'İç harç';
UPDATE ingredients SET name = 'Lor peyniri' WHERE recipe_id = 56 AND name = 'İç harç';
UPDATE ingredients SET name = 'Makarna' WHERE recipe_id = 57 AND name = 'İç harç';
UPDATE ingredients SET name = 'Haşlanmış nohut' WHERE recipe_id = 59 AND name = 'İç harç';
UPDATE ingredients SET name = 'Haşlanmış patates' WHERE recipe_id = 60 AND name = 'İç harç';
UPDATE ingredients SET name = 'Beyaz peynir' WHERE recipe_id = 62 AND name = 'İç harç';
UPDATE ingredients SET name = 'Kaşar peyniri' WHERE recipe_id = 63 AND name = 'İç harç';
UPDATE ingredients SET name = 'Karışık sebze' WHERE recipe_id = 65 AND name = 'İç harç';
UPDATE ingredients SET name = 'Noodle' WHERE recipe_id = 66 AND name = 'İç harç';

-- Ana sebze → tarife özgü sebze
UPDATE ingredients SET name = 'Brokoli' WHERE recipe_id = 73 AND name = 'Ana sebze';
UPDATE ingredients SET name = 'Havuç' WHERE recipe_id = 77 AND name = 'Ana sebze';
UPDATE ingredients SET name = 'Ispanak' WHERE recipe_id = 78 AND name = 'Ana sebze';
UPDATE ingredients SET name = 'Karnabahar' WHERE recipe_id = 79 AND name = 'Ana sebze';
UPDATE ingredients SET name = 'Kereviz' WHERE recipe_id = 80 AND name = 'Ana sebze';
UPDATE ingredients SET name = 'Karışık sebze' WHERE recipe_id = 84 AND name = 'Ana sebze';

-- Pirinç veya buğday → Pirinç
UPDATE ingredients SET name = 'Pirinç' WHERE recipe_id = 88 AND name = 'Pirinç veya buğday';
UPDATE ingredients SET name = 'Pirinç' WHERE recipe_id = 89 AND name = 'Pirinç veya buğday';
UPDATE ingredients SET name = 'Pirinç' WHERE recipe_id = 90 AND name = 'Pirinç veya buğday';

-- Süt veya yoğurt → tarife özgü süt ürünü
UPDATE ingredients SET name = 'Süt' WHERE recipe_id = 91 AND name = 'Süt veya yoğurt';
UPDATE ingredients SET name = 'Tereyağı' WHERE recipe_id = 92 AND name = 'Süt veya yoğurt';
UPDATE ingredients SET name = 'Süt' WHERE recipe_id = 97 AND name = 'Süt veya yoğurt';
UPDATE ingredients SET name = 'Krem peynir' WHERE recipe_id = 105 AND name = 'Süt veya yoğurt';
UPDATE ingredients SET name = 'Süt' WHERE recipe_id = 109 AND name = 'Süt veya yoğurt';

-- Meyve veya fındık → tarife özgü malzeme
UPDATE ingredients SET name = 'Muz' WHERE recipe_id = 91 AND name = 'Meyve veya fındık';
UPDATE ingredients SET name = 'Elma' WHERE recipe_id = 92 AND name = 'Meyve veya fındık';
UPDATE ingredients SET name = 'Kakao' WHERE recipe_id = 97 AND name = 'Meyve veya fındık';
UPDATE ingredients SET name = 'Krema' WHERE recipe_id = 105 AND name = 'Meyve veya fındık';
UPDATE ingredients SET name = 'Krema' WHERE recipe_id = 109 AND name = 'Meyve veya fındık';

-- Yazım hatalarını düzelt
UPDATE ingredients SET name = 'Domates salçası' WHERE name = 'Domates salcasi';
UPDATE ingredients SET name = 'Havuç' WHERE name = 'Havuc';
UPDATE ingredients SET name = 'Kırmızı mercimek' WHERE name = 'Kirmizi mercimek';
UPDATE ingredients SET name = 'Soğan' WHERE name = 'Sogan';
UPDATE ingredients SET name = 'Süt' WHERE name = 'Sut';
UPDATE ingredients SET name = 'Tarçın' WHERE name = 'Tarcin';
