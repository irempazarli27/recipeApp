-- =====================================================
-- Dördüncü çeyrek tariflerin adımlarını düzelt (ID 85-113)
-- Tariflere özgü, detaylı adımlar
-- =====================================================

DELETE FROM recipe_steps WHERE recipe_id BETWEEN 85 AND 113;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES

-- 85: Şehriye Çorbası
(85, 1, 'Şehriyeyi kuru tavada orta ateşte sürekli karıştırarak altın sarısına kavurun; yanmaması için dikkatli olun. Kenara alın.'),
(85, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika pembeleşene kadar kavurun. Havucu ekleyip 2 dakika daha çevirin.'),
(85, 3, 'Kavrulmuş şehriyeyi tencereye ekleyin; 1 dakika birlikte kavurun.'),
(85, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve kimyonu ilave edin. Şehriye yumuşayana kadar 10-12 dakika pişirin.'),
(85, 5, 'Ayrı tavada tereyağında pul biberi 30 saniye kızdırın; çorbaya gezdirin. Tat kontrolü yapın.'),
(85, 6, 'Kaseye alın; yanında limon dilimleri ile sıcak servis edin.'),

-- 86: Tavuk Suyu Çorbası
(86, 1, 'Tavuk parçalarını (kemikli olursa suyu daha lezzetli olur) soğuk suya koyun; soğanı, havucu ve kerevizi iri parçalar halinde ekleyin.'),
(86, 2, 'Orta ateşte kaynatın; köpüğü düzenli olarak alın. Kısık ateşe alıp 45-50 dakika pişirin.'),
(86, 3, 'Tavuğu suyundan alın; et kısmını didikleyip küçük parçalar halinde ayırın. Suyu süzgeçten geçirin.'),
(86, 4, 'Süzülmüş tavuk suyunu tekrar ocağa alın; tuz ve karabiber ekleyin, kaynatın. İnce şehriye veya pirinç ekleyip yumuşayana kadar 10-12 dakika pişirin.'),
(86, 5, 'Didiklenmiş tavuk etlerini çorbaya ekleyin; 2-3 dakika daha ısıtın. Pul biber eklemek isterseniz ayrı tavada tereyağında kızdırın.'),
(86, 6, 'Kaseye alın; üzerine pul biber tereyağı gezdirin, ince kıyılmış maydanoz serpin ve yanında limon dilimiyle sıcak servis edin.'),

-- 87: Terbiyeli Tavuk Çorbası
(87, 1, 'Tavuk göğsünü küçük küpler halinde kesin; soğanı ve havucu ince doğrayın.'),
(87, 2, 'Tencerede tereyağını eritin; soğanı ve havucu 4-5 dakika kavurun.'),
(87, 3, 'Tavuk küplerini ekleyin; renk alana kadar 3-4 dakika kavurun. Suyu ilave edip kaynamaya bırakın.'),
(87, 4, 'Kısık ateşe alın; tuz ve kimyonu ekleyin. Tavuk iyice pişene kadar 20-25 dakika pişirin. İstenirse ince şehriye veya pirinç de ekleyebilirsiniz.'),
(87, 5, 'Terbiye için yumurta sarısını çırpın; unu ekleyip karıştırın, limon suyunu ilave edin. Sıcak çorbadan kepçe kepçe alıp terbiyeye yavaşça karıştırın, ardından tencereye dökün. Kaynamasın.'),
(87, 6, 'Kısık ateşte 3-4 dakika daha ısıtın; ayrı tavada tereyağında pul biber ve kimyonu kızdırıp çorbaya gezdirin. Sıcak servis edin.'),

-- 88: Toyga Çorbası
(88, 1, 'Pirinci yıkayıp tencereye alın; suyu ekleyip yumuşayana kadar 15-18 dakika pişirin.'),
(88, 2, 'Yoğurdu geniş kaseye alın; yumurta sarısını ve unu ekleyip iyice çırpın. Topak kalmamasına dikkat edin.'),
(88, 3, 'Yoğurt karışımına sıcak çorbadan kepçe kepçe alıp yavaşça ekleyin; sürekli karıştırarak ısı eşitleyin (yoğurt kesilmesin).'),
(88, 4, 'Terbiyeli yoğurdu tencereye dökerken sürekli karıştırın; kısık ateşte 8-10 dakika pişirin. Çorba kaynamasın.'),
(88, 5, 'Tuz ekleyin; ayrı tavada tereyağında kuru naneyi 30 saniye kızdırın ve çorbaya gezdirin.'),
(88, 6, 'Kaseye alın; üzerine tereyağında nane gezdirin ve sıcak servis edin.'),

-- 89: Yayla Çorbası
(89, 1, 'Pirinci yıkayıp tencereye alın; suyu ekleyip yumuşayana kadar 15-18 dakika pişirin.'),
(89, 2, 'Yoğurdu derin kaseye alın; yumurta sarısı ve unu ekleyip çırpın. Karışım pürüzsüz olmalı.'),
(89, 3, 'Yoğurt karışımına sıcak çorbadan azar azar kepçe ekleyerek ısı eşitleyin; çırpmayı bırakmayın.'),
(89, 4, 'Karışımı tencerenin tamamına dökerken sürekli karıştırın; kısık ateşte 8-10 dakika daha pişirin. Kaynamamasına dikkat edin.'),
(89, 5, 'Tuz ekleyin; ayrı tavada tereyağında kuru naneyi 30 saniye kızdırın.'),
(89, 6, 'Çorbayı kaseye alın; üzerine naneli tereyağı gezdirin ve limon dilimiyle sıcak servis edin.'),

-- 90: Yoğurt Çorbası
(90, 1, 'Pirinci yıkayıp süzün; tencereye alıp suyu ekleyin ve kısık ateşte 15-18 dakika pişirin.'),
(90, 2, 'Yoğurt, yumurta sarısı ve unu geniş kasede iyice çırparak karıştırın.'),
(90, 3, 'Pişen pirinç tenceresinden sıcak et suyu alarak yoğurt karışımına yavaş yavaş ekleyin; çırpmayı bırakmayın.'),
(90, 4, 'Terbiyeli karışımı tencereye dökerken sürekli karıştırın; kısık ateşte 8-10 dakika pişirin.'),
(90, 5, 'Tuzu ekleyin; tereyağında kuru naneyi kızdırıp çorbaya gezdirin.'),
(90, 6, 'Kaseye alıp sıcak servis edin; istenirse limon suyu sıkarak tatlandırın.'),

-- 91: Bisküvili Pasta
(91, 1, 'Kreması için sütü tencereye alıp ısıtın; kakao, şeker ve nişastayı soğuk sütle açıp sıcak süte ekleyin. Sürekli karıştırarak koyulaşana kadar pişirin, vanilini ekleyin ve soğumaya bırakın.'),
(91, 2, 'Muzu ince dilimleyin; dilimler kararmaması için limon suyuyla haflçe harleyin.'),
(91, 3, 'Derin dikdörtgen kalıba veya servis kabına ilk kat bisküvileri yayın; üzerine kremadan cömertçe sürün.'),
(91, 4, 'Muz dilimlerini kremaya yerleştirin; tekrar bisküvi katı, ardından krema katı oluşturun. İstenen yüksekliğe ulaşana kadar katmanlamaya devam edin. En üst kat krema olmalı.'),
(91, 5, 'Üzeri pürüzsüz hale getirilmiş pastayı streç filmle örtün; buzdolabında en az 4 saat, tercihen bir gece bekletin.'),
(91, 6, 'Servis öncesi streç filmi alın; üzerine kakao tozu eleyin veya ezilmiş bisküvi serpin. Dilimleyerek soğuk servis edin.'),

-- 92: Elmalı Turta
(92, 1, 'Fırını 180 dereceye ısıtın. Elmaları soyup ince dilimleyin; tarçın, şeker ve limon suyuyla harmanlayın. 10 dakika bekletin.'),
(92, 2, 'Hamur için unu, tereyağını ve tuzu parmak uçlarıyla kırıntı kıvamına getirin; yumurtayı ve az su ekleyerek toparlanan bir hamur yoğurun. Buzdolabında 30 dakika dinlendirin.'),
(92, 3, 'Hamurun 2/3''ünü unlanmış tezgahta tart kalıbına uygun açın; kalıba serin, dip ve kenarları iyice yerleştirin.'),
(92, 4, 'Elma karışımını hamur tabanına yayın; kalan hamuru ızgara veya üst kapak şeklinde açıp elmaların üzerine yerleştirin.'),
(92, 5, 'Üzerine yumurta sarısı veya süt sürün; istenirse şeker serpin. Önceden ısıtılmış fırında 35-40 dakika, üzeri altın sarısına kızarana kadar pişirin.'),
(92, 6, 'Fırından alıp oda sıcaklığında 20 dakika dinlendirin; dilimleyerek vanilya dondurması veya çırpılmış krema ile servis edin.'),

-- 93: Etimek Tatlısı
(93, 1, 'Şerbeti hazırlayın: su ve şekeri tencereye alıp kaynayınca limon suyunu ekleyin, 10-12 dakika kaynatın. Soğumaya bırakın.'),
(93, 2, 'Etimek dilimlerini servis kabına dizin; üzerine ılık şerbeti yavaş yavaş dökerek etimeklerin şerbeti çekmesini bekleyin.'),
(93, 3, 'Krem şantiyi yoğun kıvamda çırpın; istenirse vanilin ekleyin.'),
(93, 4, 'Şerbet çekmiş etimeklerin üzerine çırpılmış krem şantiyi yayın; düzgün bir kat oluşturun.'),
(93, 5, 'Üzerine Antep fıstığını kıyıp serpin; istenirse rendelenmiş hindistancevizi veya kakao tozu da ekleyebilirsiniz.'),
(93, 6, 'Streç filmle örtüp buzdolabında en az 2 saat bekletin; dilimleyerek soğuk servis edin.'),

-- 94: Fırın Sütlaç
(94, 1, 'Sütü tencereye alın; şeker ve vanilinle birlikte orta ateşte ısıtın. Kaynama noktasına gelmeden şeker eriyene kadar karıştırın.'),
(94, 2, 'Nişasta ve unu az miktarda soğuk sütle pürüzsüzce açın; sıcak süte ince akışla ekleyerek sürekli karıştırın. Karışım koyulaşana kadar pişirin.'),
(94, 3, 'Tereyağını ekleyin; karıştırın. Sütlaç karışımını fırına dayanıklı bireysel kaselere veya büyük bir kaba paylaştırın.'),
(94, 4, 'Kaseleri derin fırın tepsisine yerleştirin; tepsiye kaselerin yarısına kadar sıcak su ekleyin (bain-marie yöntemi).'),
(94, 5, 'Önceden 200 dereceye ısıtılmış fırının üst kısmında sütlaçların yüzeyi kahverengi lekeler oluşana kadar 10-15 dakika kızartın.'),
(94, 6, 'Fırından alıp oda sıcaklığında soğutun; ardından buzdolabında 1-2 saat bekletin. Üzerine tarçın veya fındık serperek soğuk servis edin.'),

-- 95: Güllaç
(95, 1, 'Şerbeti hazırlayın: suyu ve şekeri kaynatın; gül suyu veya limon suyu ekleyin. Ilımaya bırakın.'),
(95, 2, 'Sütü hafifçe ısıtın; şeker ekleyip karıştırın. Güllaç yapraklarını sütün içinde 1-2 dakika bekletip yumuşatın.'),
(95, 3, 'Derin servis kabına bir kat yumuşamış güllaç yaprağı serin; üzerine sütlü karışımdan dökün.'),
(95, 4, 'Üzerine nar taneleri ve Antep fıstığı serpin; tekrar güllaç yaprağı, süt ve içecekler katmanını tekrarlayın.'),
(95, 5, 'Son kat güllaç yaprağının üzerine kalan sütü dökün; üstünü nar taneleri ve kıyılmış Antep fıstığıyla süsleyin.'),
(95, 6, 'Buzdolabında en az 2 saat bekletin; servis öncesi ek süt veya şerbet ekleyebilirsiniz. Soğuk servis edin.'),

-- 96: İrmik Helvası
(96, 1, 'Geniş ve kalın tabanlı tencerede sıvı yağı orta ateşte ısıtın; irmiki ekleyip sürekli karıştırarak altın sarısına kavurun (yaklaşık 15-20 dakika). Sabrın önemli olduğu bu adımı hızlandırmayın.'),
(96, 2, 'İrmik güzel renk alınca suyu ve şekeri karıştırarak hazırladığınız şerbeti sıcak irmike dökün; dikkatli olun, fışkırabilir.'),
(96, 3, 'Hızlıca karıştırın; kapağı kapatıp kısık ateşte su çekilene kadar 5-6 dakika pişirin.'),
(96, 4, 'Ocaktan alın; kapağın altına bir kağıt havlu koyup 10 dakika demlendirin.'),
(96, 5, 'Limon suyunu ekleyin; çatalla hafifçe karıştırın. Antep fıstığını kıyıp helvanın üzerine serpin.'),
(96, 6, 'Sıcak veya ılık olarak servis edin; kaşıkla tabağa alıp üzerine daha fazla fıstık koyabilirsiniz.'),

-- 97: Islak Kek
(97, 1, 'Fırını 170 dereceye ısıtın. Yumurta ve şekeri köpürene kadar (en az 5 dakika) çırpın; sıvı yağı ve sütü ekleyip karıştırın.'),
(97, 2, 'Un, kakao, kabartma tozu ve vanilini ayrı kasede karıştırın; kuru malzemeleri yaş malzemelere eleğe süzerek ekleyin. Kesme hareketleriyle pürüzsüz bir hamur elde edin.'),
(97, 3, 'Yağlanmış ve unlanmış kek kalıbına hamuru dökün; önceden ısıtılmış fırında 30-35 dakika pişirin. Kürdan testi ile denetleyin.'),
(97, 4, 'Islak sos için kremayı ısıtın; içine çikolata veya kakao ekleyip karıştırın. Şekeri de ilave edip eritin; ılıtın.'),
(97, 5, 'Fırından çıkan sıcak keke ıslak sosu yavaşça dökün; kek sosu tamamen emene kadar 15-20 dakika bekleyin.'),
(97, 6, 'Oda sıcaklığında soğutup dilimleyin; yanında dondurma veya çırpılmış krema ile servis edin.'),

-- 98: Kadayıf Tatlısı
(98, 1, 'Şerbeti hazırlayın: su ve şekeri kaynatıp limon suyu ekleyin, 10-12 dakika kaynatın. Tamamen soğutun.'),
(98, 2, 'Kadayıfı geniş kaseye alın; parmaklarınızla tel tel ayırın. Eritilmiş tereyağını üzerine gezdirerek iyice harmanlayın.'),
(98, 3, 'Fırın kabının yarısına yağlanmış kadayıfı yayın; üzerine kıyılmış ceviz veya Antep fıstığını serpin.'),
(98, 4, 'Kalan kadayıfı iç harcın üzerine sıkıştırarak üst katmanı oluşturun.'),
(98, 5, 'Önceden 180 dereceye ısıtılmış fırında üzeri altın sarısına kızarana kadar 25-30 dakika pişirin.'),
(98, 6, 'Fırından alır almaz soğuk şerbeti üzerine dökün; 30 dakika şerbeti çekmesi için bekleyin. Dilimleyerek Antep fıstığı ile servis edin.'),

-- 99: Kalburabastı
(99, 1, 'Şerbeti hazırlayın: su ve şekeri kaynatıp limon suyu ekleyin, 10 dakika kaynatın. Soğutun.'),
(99, 2, 'Un, sıvı yağ, yumurta ve kabartma tozunu karıştırın; pürüzsüz, ele yapışmayan bir hamur elde edin. Gerekirse az su ekleyin.'),
(99, 3, 'Hamurdan ceviz büyüklüğünde parçalar koparın; kalburabastı kalıbına veya çatalla bastırarak özel şekli verin.'),
(99, 4, 'Yağlanmış fırın tepsisine dizin; önceden 170 dereceye ısıtılmış fırında 20-25 dakika, altları ve üstleri altın sarısına kızarana kadar pişirin.'),
(99, 5, 'Fırından çıkar çıkmaz soğuk şerbete alın ya da şerbeti üzerine dökün; şerbeti iyice emmeleri için 20-30 dakika bekletin.'),
(99, 6, 'Servis tabağına alın; üzerine Antep fıstığı serpin ve oda sıcaklığında servis edin.'),

-- 100: Kazandibi
(100, 1, 'Sütü tencereye alın; şeker ve vanilinle birlikte orta ateşte ısıtın.'),
(100, 2, 'Nişasta ve unu az soğuk sütle açın; sıcak süte dökerken sürekli karıştırın. Karışım koyulaşana kadar orta-kısık ateşte pişirin.'),
(100, 3, 'Tereyağını ekleyin; karıştırın. Islatılmış tavuk göğsü didiklenmiş halde kullanılacaksa şu aşamada ekleyin.'),
(100, 4, 'Kalın tabanlı alüminyum tencereye veya tavaya bol şeker serpin; orta ateşte şekerin karamelleşmesini bekleyin. Şeker siyaha döndüğünde kremayı üzerine dökün.'),
(100, 5, 'Kazandibini karamelleşmiş yüzeyi aşağı kalacak şekilde tahta spatula ile tepsiye veya servis kabına alın; dikkatli çevirin.'),
(100, 6, 'Buzdolabında en az 2 saat soğutun; tarçın serperek soğuk servis edin.'),

-- 101: Kemalpaşa Tatlısı
(101, 1, 'Şerbeti hazırlayın: su ve şekeri kaynatıp limon suyu ekleyin, 10 dakika kaynatın. Soğutun.'),
(101, 2, 'Un, irmik, yumurta ve kabartma tozunu karıştırın; sıvı yağı ekleyip yumuşak bir hamur yoğurun.'),
(101, 3, 'Hamurdan limon büyüklüğünde parçalar koparın; avuç içinde pürüzsüz toplar şekillendirin. Fırın tepsisine aralarında boşluk bırakarak dizin.'),
(101, 4, 'Önceden 180 dereceye ısıtılmış fırında toplar şişip hafif kızarana kadar 20-22 dakika pişirin.'),
(101, 5, 'Fırından çıkar çıkmaz soğuk şerbete alın; topların şerbeti iyice çekmesi için en az 20-30 dakika bekletin.'),
(101, 6, 'Servis kabına alın; üzerine Antep fıstığı veya kaymak koyarak servis edin.'),

-- 102: Magnolia
(102, 1, 'Sütü tencereye alın; şeker, nişasta, un ve vanilinle birlikte orta ateşte sürekli karıştırarak koyulaşana kadar pişirin.'),
(102, 2, 'Tereyağını ekleyin; karıştırın. Pudingyi ocaktan alıp ılımaya bırakın.'),
(102, 3, 'Servis bardaklarına veya kaselerine sırayla bisküvi katmanı, krem katmanı oluşturun.'),
(102, 4, 'İstenirse her kat arasına taze meyve dilimleri (muz, çilek gibi) ekleyin.'),
(102, 5, 'Üst katmanı krema olacak şekilde tamamlayın; üzerine kakao tozu eleyin veya fındık serpin.'),
(102, 6, 'Buzdolabında en az 3-4 saat, tercihen bir gece bekletin; soğuk servis edin.'),

-- 103: Muhallebi
(103, 1, 'Sütü tencereye alın; şeker ekleyip orta ateşte ısıtın.'),
(103, 2, 'Nişasta ve unu az soğuk sütle pürüzsüzce açın; ısınan süte ince akışla ekleyip sürekli karıştırın.'),
(103, 3, 'Karışım koyulaşana kadar orta ateşte pişirin; vanilinini ve tereyağını ekleyip karıştırın.'),
(103, 4, 'Bireysel kaselere veya büyük servis kabına paylaştırın; yüzeyde kabuk bağlamaması için streç filmi doğrudan yüzeye yapıştırın.'),
(103, 5, 'Oda sıcaklığında soğuduktan sonra buzdolabında en az 2-3 saat bekletin.'),
(103, 6, 'Servis öncesi tarçın ve fındık serpin; soğuk olarak sunun.'),

-- 104: Profiterol
(104, 1, 'Fırını 200 dereceye ısıtın. Su ve tereyağını kaynatın; unu bir seferde ekleyip hızlıca karıştırın. Toparlanan hamuru kısık ateşte 1-2 dakika daha kavurun.'),
(104, 2, 'Hamuru kenara alıp biraz soğutun; yumurtaları birer birer ekleyerek her seferinde iyice çırpın. Hamur parlak ve akıcı kıvama gelmeli.'),
(104, 3, 'Hamuru sıkma torbasına alın; yağlı kağıtlı fırın tepsisine küçük toplar şeklinde sıkın. Aralarında boşluk bırakın.'),
(104, 4, 'Fırında 20-25 dakika, şişip altın sarısına kızarana kadar pişirin. Pişirme sırasında fırını açmayın.'),
(104, 5, 'Kreması için sütü, şekeri, nişastayı ve vanilinini karıştırarak koyulaşana kadar pişirin; soğutun.'),
(104, 6, 'Profiterolleri kenarından kesin; içine krema doldurun. Üzerine sıcak çikolata veya Antep fıstığı serperek servis edin.'),

-- 105: San Sebastian Cheesecake
(105, 1, 'Fırını 220 dereceye ısıtın. Krem peyniri ve şekeri kremamsı kıvama gelene kadar karıştırın.'),
(105, 2, 'Yumurtaları birer birer ekleyin; her defasında iyice karıştırın.'),
(105, 3, 'Krema ve unu ekleyin; pürüzsüz bir dolgu karışımı elde edin. Aşırı karıştırmaktan kaçının.'),
(105, 4, 'Yağlı kağıtla kaplı yuvarlak kalıba (20-22 cm) karışımı dökün; kağıt kenarlardan taşsın.'),
(105, 5, 'Önceden ısıtılmış fırında 25-28 dakika pişirin. Üzeri koyuca yanmış görünecek, ortası hala titrek kalacak; bu normaldir.'),
(105, 6, 'Fırından alıp oda sıcaklığında soğutun; ardından buzdolabında en az 4 saat bekletin. Kağıdını çıkarmadan dilimleyerek soğuk servis edin.'),

-- 106: Şekerpare
(106, 1, 'Şerbeti hazırlayın: su ve şekeri kaynatıp limon suyunu ekleyin, 10 dakika kaynatın. Soğutun.'),
(106, 2, 'Un, irmik, yumurta, sıvı yağ ve kabartma tozunu birleştirin; pürüzsüz, yoğurt kıvamında bir hamur yoğurun.'),
(106, 3, 'Ceviz büyüklüğünde parçalar koparın; üstten hafifçe bastırarak oval şekil verin. Ortasına bir Antep fıstığı basın.'),
(106, 4, 'Yağlı kağıtlı fırın tepsisine aralarında boşluk bırakarak dizin; önceden 175 dereceye ısıtılmış fırında 18-20 dakika, altları kızarana kadar pişirin.'),
(106, 5, 'Fırından çıkar çıkmaz soğuk şerbeti üzerine dökün; şekerpare şerbet çekene kadar 20-30 dakika bekleyin.'),
(106, 6, 'Servis tabağına alın; üzerine kıyılmış Antep fıstığı serpin ve oda sıcaklığında servis edin.'),

-- 107: Supangle
(107, 1, 'Sütü tencereye alın; kakao, şeker ve nişastayı soğuk sütle açıp sıcak süte ekleyin. Orta ateşte sürekli karıştırarak koyulaşana kadar pişirin.'),
(107, 2, 'Tereyağını ve vanilinini ekleyin; karıştırın. Karışımı bireysel kaselere veya büyük servis kabına paylaştırın.'),
(107, 3, 'Yüzeyde kabuk bağlamaması için streç filmi doğrudan yüzeye yapıştırın; oda sıcaklığında soğutun.'),
(107, 4, 'Buzdolabında en az 2-3 saat bekletin.'),
(107, 5, 'Servis öncesi üzerine kıyılmış fındık veya Antep fıstığı serpin.'),
(107, 6, 'Buzdolabından alıp tarçın serperek soğuk servis edin.'),

-- 108: Tavukgöğsü
(108, 1, 'Tavuk göğsünü haşlayın; iyice pişince liflere ayırarak tel tel didikleyin ve çok ince hale getirin.'),
(108, 2, 'Sütü tencereye alın; şeker ve nişastayı soğuk sütle açıp sıcak süte ekleyin. Orta ateşte karıştırarak koyulaşmaya başlayana kadar pişirin.'),
(108, 3, 'Didiklenmiş tavuğu tencereye ekleyin; sürekli karıştırarak muhallebi koyulaşana kadar orta ateşte 10-15 dakika daha pişirin.'),
(108, 4, 'Vanilinini ekleyin; karıştırın. Karışımı bireysel kaselere veya büyük servis kabına paylaştırın.'),
(108, 5, 'Yüzeye streç film yapıştırın; oda sıcaklığında soğuduktan sonra buzdolabında en az 3 saat bekletin.'),
(108, 6, 'Kaselerin üzerine tarçın eleyin; istenirse Antep fıstığı serpin ve soğuk servis edin.'),

-- 109: Trileçe
(109, 1, 'Fırını 175 dereceye ısıtın. Yumurta ve şekeri köpürene kadar çırpın; sıvı yağı ve sütü ekleyin. Un ve kabartma tozunu eleye eleye katın; pürüzsüz hamur hazırlayın.'),
(109, 2, 'Yağlanmış fırın tepsisine hamuru dökün; 25-30 dakika pişirin. Kürdan testi yapın. Fırından alıp soğumaya bırakın.'),
(109, 3, 'Üç sütlü karışımı hazırlayın: krema, süt ve vanilini karıştırın.'),
(109, 4, 'Soğuyan keki çatalla veya kürdan ile bol bol delin; üç sütlü karışımı yavaş yavaş dökün. Kek kalan karışımı emene kadar 30 dakika bekletin.'),
(109, 5, 'Soğuk kremayı sert köpük kıvamına çırpın; kek üzerine düzgünce yayın.'),
(109, 6, 'Buzdolabında en az 4-6 saat bekletin; servis öncesi dilimleyerek yanında karamel sos veya tarçın ile sunun.'),

-- 110: Un Helvası
(110, 1, 'Geniş ve kalın tabanlı tencerede sıvı yağı orta ateşte ısıtın; unu ekleyip sürekli karıştırarak renk alana kadar (yaklaşık 20-25 dakika) kavurun. Bu adım helvanın temelini oluşturur, sabırla yapın.'),
(110, 2, 'Un güzel kokulanıp bej-altın rengi alınca ocağı kısın.'),
(110, 3, 'Suyu ve şekeri ayrı tencerede kaynatın; şerbeti hazırlayın.'),
(110, 4, 'Sıcak şerbeti kavrulan una dökün; dikkatli olun, fışkırabilir. Hızlıca karıştırın.'),
(110, 5, 'Kısık ateşte su çekilene kadar 3-4 dakika daha karıştırarak pişirin; kapağı kapatıp 10 dakika demlendirin.'),
(110, 6, 'Limon suyunu ekleyip çatalla karıştırın; sıcak olarak kaşıkla tabağa alın, üzerine Antep fıstığı veya tarçın serpin ve hemen servis edin.');
