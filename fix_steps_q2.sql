-- =====================================================
-- İkinci çeyrek tariflerin adımlarını düzelt (ID 29-56)
-- Tariflere özgü, detaylı adımlar
-- =====================================================

DELETE FROM recipe_steps WHERE recipe_id BETWEEN 29 AND 56;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES

-- 29: Tas Kebabı
(29, 1, 'Dana kuşbaşını yıkayıp kağıt havluyla iyice kurulayın; soğanları yemeklik doğrayın, sarımsakları ince dilimleyin.'),
(29, 2, 'Kalın tabanlı tencerede zeytinyağını yüksek ateşte kızdırın; etleri partiler halinde her tarafı kahverengiye mühürlenene kadar kavurun, mühürlenen etleri kenara alın.'),
(29, 3, 'Aynı tencereye soğanları ekleyin; orta ateşte 4-5 dakika pembeleşene kadar kavurun. Sarımsakları ekleyip 1 dakika çevirin.'),
(29, 4, 'Etleri tencereye geri koyun; domates salçasını ekleyip 2-3 dakika karıştırarak kavurun. Tuz ve kekiği ilave edin.'),
(29, 5, 'Sıcak suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp kapağı kapatın. Etler çatalla kolayca dağılana kadar 50-60 dakika pişirin.'),
(29, 6, 'Sos güzel koyulaşınca ocaktan alın; yanında pirinç pilavı veya bulgur pilavı ve turşuyla sıcak servis edin.'),

-- 30: Tavuk Kapama
(30, 1, 'Tavuk göğsünü büyük parçalar veya bütün halinde kullanabilirsiniz; soğanı yemeklik, kapya biberi iri şeritler, domatesleri iri küpler halinde kesin.'),
(30, 2, 'Geniş ve kalın tabanlı tencerede zeytinyağını kızdırın; soğanı 3-4 dakika pembeleşene kadar kavurun, ardından kapya biberi ekleyip 2 dakika daha çevirin.'),
(30, 3, 'Tavuk parçalarını tencereye ekleyin; yüksek ateşte her tarafı hafifçe renk alana kadar çevirin.'),
(30, 4, 'Domates salçasını ve domatesleri ilave edin; tuz ve karabiberi ekleyin. Malzemeleri güzelce karıştırın.'),
(30, 5, 'Tencerenin kapağını sıkıca kapatın; kısık ateşte tavuklar iyice pişip sebzeler tamamen yumuşayana kadar 30-35 dakika pişirin. Kapağı aralamadan pişirme tamamlanmalı.'),
(30, 6, 'Ocaktan alıp 5 dakika dinlendirin; taze maydanoz veya dereotu ile süsleyip ekmekle sıcak servis edin.'),

-- 31: Acılı Ezme
(31, 1, 'Domatesleri çok ince kıyın veya kabuklarını soyup ince doğrayın; kırmızı soğan varsa çok ince kıyın; maydanozu da ince doğrayın.'),
(31, 2, 'Sarımsakları ezin veya çok ince kıyın; limon suyunu sıkıp zeytinyağını hazırlayın.'),
(31, 3, 'Geniş bir kasede domates, sarımsak, maydanoz, pul biber ve tuzu birleştirin; tahini veya yoğurdu ekleyin.'),
(31, 4, 'Zeytinyağını ve limon suyunu ekleyin; tüm malzemeyi tahta kaşıkla güzelce karıştırın.'),
(31, 5, 'Tat kontrolü yapın; gerekirse tuz, pul biber veya limon suyu ekleyin. Buzdolabında en az 30 dakika dinlendirin ki lezzetler birbirine yansısın.'),
(31, 6, 'Servis tabağına alın; üzerine zeytinyağı gezdirin, taze maydanoz serpin. Lavaş veya ekmekle servis edin.'),

-- 32: Avokadolu Bruschetta
(32, 1, 'Ekmek dilimlerini (baget veya kepek ekmeği tercih edin) kalın dilimleyin; zeytinyağı sürerek ızgara veya tost makinesinde her iki taraftan altın sarısı kızarana kadar kızartın.'),
(32, 2, 'Avokadoları ikiye bölüp çekirdeklerini çıkarın; etiyle birlikte geniş bir kaseye alıp çatalla ezin.'),
(32, 3, 'Ezilmiş avokadoya limon suyu, tuz ve karabiber ekleyin; pürüzsüz kıvam için biraz daha ezip karıştırın.'),
(32, 4, 'Cherry domatesleri ikiye bölün, taze fesleğen varsa ince kıyın; ekmeğin üzerine yayacak yoğurtlu sosu hazırlayın.'),
(32, 5, 'Kızarmış ekmek dilimlerinin üzerine avokado püresini yayın; üzerine domates parçalarını ve istenirse haşlanmış ya da çırpılmış yumurtayı yerleştirin.'),
(32, 6, 'Üzerine tuz, karabiber serpin; zeytinyağı ve yoğurtlu sos gezdirin. Hemen servis edin, avokado kararmaması için bekletmeden tükеtin.'),

-- 33: Baharatlı Dip Sos
(33, 1, 'Yoğurdu süzgeçte veya tülbentte 1-2 saat süzün; daha koyu ve kremsi bir kıvam elde edin.'),
(33, 2, 'Sarımsakları çok ince kıyın veya ezin; bir kaseye alıp üzerine tuz serpin, ezip macun haline getirin.'),
(33, 3, 'Süzülmüş yoğurdu geniş kaseye alın; sarımsak macununu, karabiber, pul biber veya kırmızı pul biber ve zeytinyağını ekleyin.'),
(33, 4, 'Taze nane, dereotu veya maydanozu ince kıyıp kaseye ekleyin; tüm malzemeyi güzelce karıştırın.'),
(33, 5, 'Tat kontrolü yapın; limon suyu eklerseniz ferahlatıcı bir aroma kazanır. Buzdolabında 20-30 dakika dinlendirin.'),
(33, 6, 'Servis kasesine alın; üzerine zeytinyağı gezdirin ve kırmızı pul biber serpin. Sebze çubukları, nachos veya ekmekle servis edin.'),

-- 34: Cacık
(34, 1, 'Salatalığı soyun ve ince rondela veya ince kibrit şeklinde doğrayın; tuz serpin ve 10 dakika bekletip suyunu sıkın.'),
(34, 2, 'Sarımsakları ezin; bir tutam tuzla macun haline getirin.'),
(34, 3, 'Yoğurdu derin kaseye alın; sarımsak macununu, süzülmüş salatalığı ekleyin.'),
(34, 4, 'Kuru nane ve taze maydanozu ekleyin; limon suyu ve zeytinyağını ilave edip güzelce karıştırın.'),
(34, 5, 'Buzdolabında en az 30 dakika soğutun; servis öncesinde bir miktar soğuk su veya süt ekleyerek kıvamı ayarlayabilirsiniz.'),
(34, 6, 'Derin servis kasesine alın; üzerine zeytinyağı gezdirin ve kuru nane veya pul biber serpin. Soğuk servis edin.'),

-- 35: Çıtır Tavuk Atıştırmalık
(35, 1, 'Tavuk göğsünü parmak büyüklüğünde şeritler veya küçük parçalar halinde kesin; tuz ve karabiber serpin.'),
(35, 2, 'Üç derin tabak hazırlayın: birine un, birine çırpılmış yumurta, birine galeta unu koyun. Galeta ununa istenirse kekik veya kırmızı pul biber ekleyin.'),
(35, 3, 'Tavuk parçalarını sırasıyla un, yumurta ve galeta ununa bulayın; her katmanın iyice yapıştığından emin olun.'),
(35, 4, 'Kaplanmış tavukları 15-20 dakika buzdolabında dinlendirin; bu işlem kaplamanın pişme sırasında dökülmemesini sağlar.'),
(35, 5, 'Kızartma yağını 170-180 dereceye ısıtın; tavukları altın sarısı kızarana kadar 4-5 dakika kızartın. Kağıt havlu üzerine alıp yağını süzdürün.'),
(35, 6, 'Sıcak servis edin; yanında yoğurtlu sos veya domates sosuyla sunun.'),

-- 36: Fırın Mücver Dilimleri
(36, 1, 'Fırını 190 dereceye ısıtın. Kabakları rendeleyip büyük bir kaseye alın; tuz serpin ve 10 dakika bekletip suyunu iyice sıkın.'),
(36, 2, 'Suyu sıkılan kabağa yumurtayı, un ve galeta ununu ekleyin; tuz ve karabiber ilave edip homojen bir hamur elde edene kadar karıştırın. Hamur ele yapışmamalı, gerekirse biraz daha un ekleyin.'),
(36, 3, 'İstenirse ince kıyılmış maydanoz, rendelenmiş beyaz peynir veya dereotu ekleyin; karıştırın.'),
(36, 4, 'Fırın tepsisini yağlı kağıtla hizalayın ve üzerine sıvı yağ sürün; hamuru tepsiye yayarak eşit kalınlıkta (yaklaşık 1.5-2 cm) yayın.'),
(36, 5, 'Önceden ısıtılmış fırında 25-30 dakika, üzeri altın sarısına kızarana kadar pişirin.'),
(36, 6, 'Fırından alıp 5 dakika soğutun; karelere veya dikdörtgenlere dilimleyin. Yanında yoğurtlu sos veya cacıkla servis edin.'),

-- 37: Fırınlanmış Nohut
(37, 1, 'Fırını 200 dereceye ısıtın. Konserve nohutları süzüp yıkayın; kağıt havluyla iyice kurulayın (kuru nohut daha çıtır olur).'),
(37, 2, 'Nohutları geniş bir kaba alın; üzerine sıvı yağ, tuz, karabiber ve isteğe göre kimyon, kırmızı pul biber veya kekik ekleyin. İyice harmanlayın.'),
(37, 3, 'Nohutları yağlı kağıtla kaplı fırın tepsisine tek sıra halinde yayın; birbirinin üstüne binmemesine dikkat edin.'),
(37, 4, 'Önceden ısıtılmış fırında 25-30 dakika, ara ara karıştırarak kızartın. İstenen çıtırlık seviyesine göre süreyi ayarlayın.'),
(37, 5, 'Fırından alıp 5-10 dakika soğutun; soğudukça daha da çıtırlaşır. Henüz sıcakken ekstra tuz ve baharat ekleyebilirsiniz.'),
(37, 6, 'Servis kasesine alın; aperatif olarak veya salata üstü çıtır ek olarak servis edin. Oda sıcaklığında servis edildiğinde daha çıtır olur.'),

-- 38: Haydari
(38, 1, 'Süzme yoğurdu derin kaseye alın; içinde iri parçalar varsa düzgünleştirin.'),
(38, 2, 'Sarımsakları ezin; tuz ekleyip macun haline getirin. Dereotunu ince kıyın, maydanozu da ince doğrayın.'),
(38, 3, 'Yoğurda sarımsak macununu ekleyin; zeytinyağını ve limon suyunu ilave edip karıştırın.'),
(38, 4, 'Dereotu ve maydanozu kaseye ekleyin; tuz ile tatlandırıp güzelce harmanlayın.'),
(38, 5, 'Buzdolabında en az 1 saat bekletin; lezzetlerin birbirine geçmesi için soğuk dinlendirme önemlidir.'),
(38, 6, 'Servis tabağına alın; üzerine zeytinyağı gezdirin ve taze dereotu ile süsleyin. Pide veya lavaş ile soğuk servis edin.'),

-- 39: Humus
(39, 1, 'Haşlanmış nohutları süzün; bir miktar haşlama suyu veya soğuk suyu saklayın. İstenirse kabuklarını soyun (daha pürüzsüz bir sonuç için).'),
(39, 2, 'Sarımsakları mutfak robotuna alın; birkaç saniye çekin. Nohutları ekleyin, biraz ön ezme yapın.'),
(39, 3, 'Tahini, limon suyunu ve tuzu ekleyin; düşük devirde çekmeye başlayın.'),
(39, 4, 'Motor çalışırken azar azar soğuk su veya buz gibi su ekleyin; hamur kremi haline gelene kadar 3-4 dakika çekmeye devam edin.'),
(39, 5, 'Zeytinyağını ekleyip 1 dakika daha çekin; tat kontrolü yapın, gerekirse limon suyu veya tuz ekleyin. Buzdolabında 30 dakika dinlendirin.'),
(39, 6, 'Derin servis tabağına alın; ortasına çukur yapıp zeytinyağı gezdirin. Kırmızı toz biber, kimyon ve maydanozla süsleyip pide veya lavaş ile servis edin.'),

-- 40: Kaşarlı Mantar
(40, 1, 'Mantarları kağıt havlu veya fırça ile temizleyin; büyükse ikiye veya dörde bölün, küçükse bütün bırakın. Yıkamaktan kaçının, aksi halde sulanır.'),
(40, 2, 'Bol zeytinyağını kızdırın; mantarları tavaya sıkışık koymadan tek kat halinde yayın. Çevirmeden 2-3 dakika yüksek ateşte kızartın.'),
(40, 3, 'Mantarları çevirin; diğer tarafını da 2-3 dakika kızartın. Bu yöntem mantarların sulanmadan güzel renk almasını sağlar.'),
(40, 4, 'Ateşi kısın; tuz ve karabiberi ekleyin. İstenirse bir diş ezilmiş sarımsak veya kekik ilave edin, 1 dakika daha çevirin.'),
(40, 5, 'Mantarların üzerine rendelenmiş kaşar peynirini serpin; kapak kapatıp peynir eriyene kadar 2-3 dakika bekletin.'),
(40, 6, 'Yoğurtlu sos hazırlayın: yoğurda sarımsak, tuz ve dereotu ekleyip karıştırın. Mantarları sıcak servis edin, yanında yoğurtlu sos sunun.'),

-- 41: Köz Biber Mezesi
(41, 1, 'Kırmızı biberleri gazocağı közünde, ızgarada veya fırın ızgarasında dış kabukları kararana kadar döndürerek közleyin; fırın için 220 derecede 20-25 dakika yeterli.'),
(41, 2, 'Közlenmiş biberleri hemen plastik poşete veya kapalı kaba alın; 15 dakika bekletin. Bu işlem kabukların kolayca soyulmasını sağlar.'),
(41, 3, 'Biberlerin kabuklarını soyun, saplarını ve çekirdeklerini çıkarın; ince şeritler veya iri parçalar halinde kesin.'),
(41, 4, 'Biberleri geniş kaseye alın; ezilmiş sarımsak, zeytinyağı, limon suyu, tuz ve karabiber ekleyin.'),
(41, 5, 'Taze maydanoz veya fesleğen kıyıp kaseye ilave edin; güzelce karıştırın. Buzdolabında 20-30 dakika dinlendirin.'),
(41, 6, 'Servis tabağına alın; üzerine zeytinyağı gezdirin ve taze otlarla süsleyin. Ekmek veya pide ile servis edin.'),

-- 42: Mini Sandviç
(42, 1, 'Sandviç ekmeğini ya da baget ekmeğini küçük porsiyonlar halinde kesin; ekmekleri ızgara veya tost makinesinde hafifçe kızartın.'),
(42, 2, 'İç harcı hazırlayın: yumurtaları haşlayın (6-7 dakika) soyup ince dilimleyin; domatesi ve yeşil biberi ince dilimleyin.'),
(42, 3, 'İstenirse tavuk, ton balığı veya peynir gibi protein ekleyin; tuz ve karabiber serpin.'),
(42, 4, 'Ekmeklerin iç yüzeyine tereyağı veya yoğurtlu sos sürün; haşlanmış yumurta, domates, yeşil biber ve diğer malzemeleri sıralayın.'),
(42, 5, 'Sandviçleri kapatın; servis süslemesi için kürdanla sabitleyin.'),
(42, 6, 'Servis tabağına dizin; yanında turşu veya yoğurtlu sos ile servis edin.'),

-- 43: Mısır Salatası
(43, 1, 'Konserve mısırları süzüp soğuk suyla durulayın; kırmızı soğanı çok ince doğrayın, keskin tadını gidermek için 10 dakika soğuk suda bekletin, ardından süzün.'),
(43, 2, 'Salatalık turşularını ince halkalar halinde dilimleyin; taze maydanoz veya dereotunu ince kıyın.'),
(43, 3, 'Geniş kaseye mısır, kırmızı soğan, salatalık turşusu ve kalan mısırı ekleyin; iyice karıştırın.'),
(43, 4, 'Zeytinyağı ve limon suyunu üzerine gezdirin; tuz serpin. Salata sos ile harmanlayın.'),
(43, 5, 'Tat kontrolü yapın; daha ekşi bir tat için limon suyu, daha taze bir tat için dereotu miktarını artırın. Buzdolabında 15-20 dakika bekletin.'),
(43, 6, 'Servis kasesine alın; taze dereotu ve limon dilimleriyle süsleyerek soğuk servis edin.'),

-- 44: Patates Kroket
(44, 1, 'Patatesleri haşlayın ve sıcakken iyice ezip pürüzsüz kıvama getirin; soğumaya bırakın. Puré soğuduktan sonra yumurta ve tuz ekleyip karıştırın.'),
(44, 2, 'Pürüye isteğe göre rendelenmiş kaşar peyniri, ince kıyılmış maydanoz veya baharatlar ekleyin; homojen bir karışım elde edin.'),
(44, 3, 'Karışımdan ceviz büyüklüğünde parçalar koparın; avuç içinde oval veya yuvarlak kroket şekillendirin.'),
(44, 4, 'Üç tabak hazırlayın: birine un, birine çırpılmış yumurta, birine galeta unu. Kroketleri sırasıyla her tabaktan geçirin, iyice kaplayın.'),
(44, 5, 'Yağı 170-180 dereceye ısıtın; kroketleri altın sarısı kızarana kadar 2-3 dakika kızartın. Kağıt havlu üzerine alıp yağını süzdürün.'),
(44, 6, 'Sıcak servis edin; yanında yoğurtlu sos veya ketçap ile sunun.'),

-- 45: Patates Salatası
(45, 1, 'Patatesleri kabuklu olarak haşlayın; diş bıçak kolayca girdiğinde (yaklaşık 20-25 dakika) pişmiş demektir. Soğutup soyun ve küp doğrayın.'),
(45, 2, 'Kırmızı soğanı çok ince doğrayın; soğuk suda 10 dakika bekletip süzün. Salatalık turşularını ince dilimleyin.'),
(45, 3, 'Mısırı (konserveyse süzüp yıkayın), taze maydanoz veya dereotunu ince kıyın.'),
(45, 4, 'Geniş kaseye patatesleri, kırmızı soğanı, salatalık turşusu ve mısırı ekleyin; hafifçe karıştırın.'),
(45, 5, 'Sos için zeytinyağı, limon suyu, tuz ve dereotunu karıştırın; salata üzerine dökün. Yoğurt da eklenebilir.'),
(45, 6, 'Tüm malzemeyi nazikçe karıştırın; buzdolabında 30 dakika bekletip soğuk servis edin. Üzerine taze dereotu serpin.'),

-- 46: Peynir Topları
(46, 1, 'Beyaz peyniri geniş kaseye alıp çatalla iyice ezin; pürüzsüz kıvam için mutfak robotundan geçirebilirsiniz.'),
(46, 2, 'Ezilmiş peynire yumurta sarısı, karabiber ve isteğe göre ince kıyılmış maydanoz veya dereotu ekleyin; el ile yoğurarak homojen kıvama getirin.'),
(46, 3, 'Karışımın kıvamı çok yumuşaksa biraz un ekleyin; ceviz büyüklüğünde parçalar koparıp avuç içinde top şekli verin.'),
(46, 4, 'Galeta ununu geniş tabağa alın; topları iyice galeta ununa bulayın.'),
(46, 5, 'Yağı 170 dereceye ısıtın; topları altın sarısı kızarana kadar 2-3 dakika kızartın. Çok uzun tutmayın, iç ısısı fazla olunca dağılabilir. Kağıt havlu üzerine alın.'),
(46, 6, 'Sıcakken servis edin; yanında domates sosu veya yoğurtlu sos ile sunun.'),

-- 47: Sigara Böreği
(47, 1, 'Yufkaları üçgen veya dikdörtgen şeritler halinde kesin. İç harcı hazırlayın: peyniri ezin, ince kıyılmış maydanozu ve karabiberi ekleyin; isteğe göre haşlanmış yumurta da koyabilirsiniz.'),
(47, 2, 'Yufka şeridinin geniş ucuna 1 çay kaşığı iç harç koyun; kenarları içe katlayarak sıkıca sigara şeklinde sarın, ucunu yumurta akı veya su ile yapıştırın.'),
(47, 3, 'Tüm börekleri aynı şekilde hazırlayın; birbirinin üstüne koymamalısınız, aksi halde yapışır.'),
(47, 4, 'Kızartma için yağı 170-180 dereceye ısıtın. Kızartmak yerine fırın tercih edilirse: börekleri yumurta sarısı veya sütle fırçalayın, 190 derece fırında 20-25 dakika kızartın.'),
(47, 5, 'Börekleri kızgın yağda sürekli çevirerek altın sarısına kızarana kadar 2-3 dakika kızartın; kağıt havlu üzerine alıp yağını süzdürün.'),
(47, 6, 'Sıcak servis edin; yanında yoğurt veya domates sosuyla sunun.'),

-- 48: Yoğurtlu Havuç Tarator
(48, 1, 'Havuçları soyun ve ince rendeleyin veya julyen (kibrit) şeklinde kesin; büyük bir kaseye alın.'),
(48, 2, 'Sarımsakları çok ince kıyın veya ezin; bir tutam tuzla macun haline getirin.'),
(48, 3, 'Yoğurdu kaseye ekleyin; sarımsak macununu ve zeytinyağını ilave edip karıştırın.'),
(48, 4, 'Limon suyunu, tuzu ve istenirse dereotu veya maydanozu ekleyin; havuçlarla birlikte güzelce harmanlayın.'),
(48, 5, 'Tat kontrolü yapın; limon suyu ve tuz dengesini ayarlayın. Buzdolabında 20-30 dakika dinlendirin.'),
(48, 6, 'Servis tabağına alın; üzerine zeytinyağı gezdirin ve ince kıyılmış maydanozla süsleyin. Soğuk servis edin.'),

-- 49: Yoğurtlu Kabak Mücveri
(49, 1, 'Kabakları ince rendeleyin; tuz serpin, 10-15 dakika bekletip iyice sıkın (suyu tamamen çıkmış olmalı).'),
(49, 2, 'Sıkılmış kabağı geniş kaseye alın; yumurta, un ve galeta ununu ekleyin. Tuz ve karabiber ilave edin.'),
(49, 3, 'İsteğe göre rendelenmiş peynir, ince kıyılmış maydanoz veya dereotu ekleyin; tüm malzemeyi karıştırıp kıvamı ayarlayın (çok sıvıysa biraz daha un, çok katıysa az su).'),
(49, 4, 'Geniş tavada sıvı yağı ısıtın; kaşıkla hamurdan parçalar alıp düzleştirerek tavaya koyun. Çok ince olmalarına dikkat edin.'),
(49, 5, 'Her iki tarafı altın sarısı kızarana kadar (her taraf 3-4 dakika) orta ateşte kızartın; kağıt havlu üzerine alın.'),
(49, 6, 'Yoğurtlu sosu hazırlayın: yoğurda sarımsak, tuz ve dereotu ekleyin. Sıcak mücverlerin yanında yoğurtlu sos ile servis edin.'),

-- 50: Zeytin Ezmeli Kanape
(50, 1, 'Siyah zeytinlerin çekirdeklerini çıkarın; mutfak robotuna veya büyük bıçakla ince kıyın.'),
(50, 2, 'Kıyılmış zeytinlere sarımsak (ezilmiş), zeytinyağı, limon suyu ve kekik ekleyin; hamur kıvamına gelene kadar ezin veya mutfak robotunda çekin.'),
(50, 3, 'Tuz ve karabiber ile tatlandırın; tat kontrolü yapın. İstenirse tapenade kıvamı için biraz daha zeytinyağı ekleyebilirsiniz.'),
(50, 4, 'Baget ekmek veya kepek ekmeği ince dilimleyin; zeytinyağı sürerek ızgara veya tost makinesinde kızartın.'),
(50, 5, 'Ekmek dilimlerinin üzerine zeytin ezmesini cömertçe yayın; üzerine taze maydanoz veya kekik yaprağı koyun.'),
(50, 6, 'Servis tabağına derin dizin; yanında domatesleri veya roka ile süsleyerek sunun.'),

-- 51: Çıtır Lavaş Dürüm
(51, 1, 'Lavaşları tezgaha serin; iç malzemeleri hazırlayın: kaşarı ince dilimleyin, domatesi ve yeşil biberi ince halkalar halinde kesin.'),
(51, 2, 'Her lavaşın üzerine kaşar peyniri dilimlerini yayın; üzerine domates ve yeşil biber dilimlerini sıralayın. Tuz, karabiber ve kekik serpin.'),
(51, 3, 'Lavaşı sıkıca dürüm şeklinde sarın; kenarlarını içe katlayarak sararsanız içi dökülmez.'),
(51, 4, 'Tavayı orta ateşte ısıtın; tereyağını eritin. Dürümleri kapama tarafi aşağıya gelecek şekilde tavaya koyun.'),
(51, 5, 'Her tarafı altın sarısı kızarana ve peynir eriyene kadar 2-3 dakika pişirin; lavaş çıtır bir hal almalı.'),
(51, 6, 'Kare veya üçgen şeklinde kesin; hemen servis edin. Yanında yoğurt veya domates sosuyla sunun.'),

-- 52: Domatesli Kaşarlı Sandviç
(52, 1, 'Ekmek dilimlerini hazırlayın; iç yüzlerine tereyağı sürün. Domatesleri ve yeşil biberi ince halkalar halinde kesin.'),
(52, 2, 'Ekmek dilimlerinin birinin üzerine kaşar dilimleri yerleştirin; üzerine domates ve yeşil biber dilimlerini sıralayın.'),
(52, 3, 'Tuz, karabiber ve kekik serpin; ikinci ekmek dilimini kapatın.'),
(52, 4, 'Sandviç makinesini veya tavayı orta ateşte önceden ısıtın; sandviçleri yerleştirin.'),
(52, 5, 'Sandviç makinesinde 3-4 dakika, tavada ise her iki tarafı altın sarısı kızarana kadar bastırarak pişirin. Peynirin iyice erimesi önemli.'),
(52, 6, 'Sıcakken köşegenden keserek servis edin; yanında turşu veya salatayla sunun.'),

-- 53: Fırın Patates Dilimleri
(53, 1, 'Fırını 210 dereceye ısıtın. Patatesleri soyup 1 cm kalınlığında yuvarlak veya kama dilimler halinde kesin; soğuk suya atıp 15 dakika bekletin, ardından iyice kurulayın.'),
(53, 2, 'Patatesleri geniş kaseye alın; sıvı yağ, tuz, karabiber ve isteğe göre kekik, kırmızı pul biber veya sarımsak tozu ile harmanlayın.'),
(53, 3, 'Fırın tepsisine yağlı kağıt serin; patatesleri birbirinin üstüne binmeden tek sıra halinde yayın.'),
(53, 4, 'Önceden ısıtılmış fırında 20 dakika pişirin; sonra patatesleri çevirin ve 15-20 dakika daha pişirin. Altları güzel kızarmış olmalı.'),
(53, 5, 'Fırından alıp hemen tuz ekleyin; yoğurtlu sosu hazırlayın: yoğurda sarımsak, tuz ve ince kıyılmış maydanoz ekleyin.'),
(53, 6, 'Patatesleri servis tabağına alın; yanında yoğurtlu sos veya ketçapla sıcak servis edin.'),

-- 54: Kaşarlı Bazlama
(54, 1, 'Un ve tuzu geniş kaseye alın; ortasına çukur açıp sıvı yağı ve yoğurdu ekleyin. Yavaş yavaş su ekleyerek kulak memesi kıvamında yumuşak bir hamur yoğurun.'),
(54, 2, 'Hamuru toparlayın; üzerini örtüp 20-30 dakika oda sıcaklığında dinlendirin.'),
(54, 3, 'Hamuru mandalina büyüklüğünde bezeler halinde bölün; her bezeyi hafifçe unlanmış tezgahta 3-4 mm kalınlığında daire şeklinde açın.'),
(54, 4, 'Orta ateşte ısıtılmış kuru tavaya bazlamayı alın; yüzeyinde kabarcıklar oluşup alt taraf kızarana kadar 2-3 dakika pişirin.'),
(54, 5, 'Bazlamayı çevirin; hemen üzerine kaşar peyniri dilimlerini yayın, kapağı kapatarak peynir eriyene kadar 2-3 dakika pişirin.'),
(54, 6, 'Peynir erir erimez ocaktan alın; sıcakken katlayabilir veya açık bırakabilirsiniz. İnce kıyılmış maydanozla süsleyip hemen servis edin.'),

-- 55: Kaşarlı Tost
(55, 1, 'Tost ekmeklerini hazırlayın; iç yüzlerine ince bir kat tereyağı veya margarin sürün.'),
(55, 2, 'Bir dilim ekmek üzerine kaşar peyniri dilimlerini yayın; üzerine domates ve yeşil biber dilimlerini sıralayın.'),
(55, 3, 'Tuz, karabiber ve kekik serpin; ikinci ekmek dilimini üstüne kapatın.'),
(55, 4, 'Tost makinesini önceden ısıtın; sandviçi yerleştirip kapağı indirin.'),
(55, 5, 'Ekmek altın sarısı kızarana ve içindeki peynir iyice eriyene kadar 3-4 dakika pişirin.'),
(55, 6, 'Tostları köşegenden keserek sıcak servis edin; yanında domates, salatalık ve turşuyla sunabilirsiniz.'),

-- 56: Lorlu Krep
(56, 1, 'Krep hamurunu hazırlayın: unu ve tuzu kaseye alın, ortasına çukur açın; yumurta, süt ve sıvı yağı ekleyip pürüzsüz kıvama gelene kadar çırpın. 15 dakika dinlendirin.'),
(56, 2, 'Lor peyniri dolgusu için lor peynirini kaseye alın; tuz, karabiber ve ince kıyılmış maydanozu ekleyip karıştırın. İstenirse rendelenmiş peynir de eklenebilir.'),
(56, 3, 'Teflon tavayı orta ateşte ısıtın; sıvı yağ ile hafifçe yağlayın. Bir kepçe hamuru alıp tavaya döküp döndürerek ince bir daire oluşturun.'),
(56, 4, 'Krepin kenarları kızarıp ortası dongunca altın sarısına gelene kadar (yaklaşık 1-1.5 dakika) pişirin; çevirin ve diğer tarafı 30 saniye pişirin.'),
(56, 5, 'Pişen krepin ortasına lor harcından bir kaşık koyun; ikiye veya dörde katlayın.'),
(56, 6, 'Tüm krepleri aynı şekilde hazırlayıp servis tabağına dizin; üzerine yoğurt sosu veya istenirse ince kıyılmış taze otlar serpin ve sıcak servis edin.');
