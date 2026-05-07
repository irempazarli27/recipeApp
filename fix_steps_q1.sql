-- =====================================================
-- İlk çeyrek tariflerin adımlarını düzelt (ID 11-28)
-- Tariflere özgü, detaylı adımlar
-- =====================================================

DELETE FROM recipe_steps WHERE recipe_id BETWEEN 11 AND 28;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES

-- 11: Ali Nazik
(11, 1, 'Patlıcanları gazocağı közünde veya fırın ızgarasında dış kabuğu kararana kadar döndürerek pişirin; soyup tahta kaşıkla liflerine ayırın ve bir kaseye alın.'),
(11, 2, 'Patlıcan püresine ezilmiş sarımsak, yoğurt, bir tutam tuz ve birkaç damla limon suyu ekleyin; güzelce karıştırıp oda sıcaklığında bekletin.'),
(11, 3, 'Geniş tavada zeytinyağını kızdırın; soğanı yemeklik doğrayıp 3-4 dakika kavurun, ardından ince dilimlenmiş sarımsakları ekleyip 1 dakika daha çevirin.'),
(11, 4, 'Dana kuşbaşını ekleyin; yüksek ateşte her tarafı mühürlenene kadar çevirin. Domates salçasını ilave edip 2 dakika daha kavurun.'),
(11, 5, 'Sıcak suyu ekleyin; tuz ve kekiği ilave edip kapağı kapatın, kısık ateşte etler iyice yumuşayana kadar 40-45 dakika pişirin.'),
(11, 6, 'Servis tabağına önce patlıcan püresini yayın, üzerine etli sosu dökün; yanında bulgur pilavı veya pirinç pilavıyla sıcak servis edin.'),

-- 12: Beğendili Tavuk
(12, 1, 'Tavuk göğsünü yemeklik küp doğrayın; soğanı yemeklik, kapya biberi ince şeritler, domatesleri küçük küpler halinde kesin.'),
(12, 2, 'Geniş tavada zeytinyağını ısıtın; soğanı 3 dakika pembeleşene kadar kavurun, ardından kapya biberi ekleyip 2 dakika daha pişirin.'),
(12, 3, 'Tavuk parçalarını ilave edin; yüksek ateşte her tarafı renk alana kadar çevirin. Domates salçasını ekleyip 2 dakika kavurun.'),
(12, 4, 'Domatesleri ilave edin; tuz ve karabiberi ekleyin, kapağı kapatıp orta-kısık ateşte tavuk tamamen pişene kadar 20-25 dakika pişirin.'),
(12, 5, 'Beğendi için tereyağında unu kavurun; sütü azar azar ekleyip sürekli karıştırarak koyulaştırın, ezilmiş közlenmiş patlıcan ve rendelenmiş kaşarı ilave edip karıştırın.'),
(12, 6, 'Servis tabağına beğendiyi yayın, üzerine tavuklu sosu dökün; yanında taze maydanoz ile süsleyip sıcak getirin.'),

-- 13: Biber Dolması
(13, 1, 'Sivri biberlerin sapından küçük bir kapak kesin ve çekirdeklerini çıkarın; kapak biberleri atılmamasın. Biberleri soğuk suda durulayın.'),
(13, 2, 'Soğan ve kapya biberi çok ince kıyın; domatesleri rendeleyin veya küçük küp doğrayın, sarımsakları ezin.'),
(13, 3, 'Zeytinyağını ısıtın; soğanı 3-4 dakika kavurun, ardından kapya biber, domates ve sarımsakları ekleyip 5 dakika pişirin; tuz ve karabiberle tatlandırın.'),
(13, 4, 'İç harcı biraz soğutun; her biberin içine doldurun (3/4 oranında, pirinç varsa şişmesi için boşluk bırakın) ve kapakları üstlerine kapatın.'),
(13, 5, 'Biberleri tencereye dik dizin; üzerine zeytinyağı ve biberleri örtecek kadar sıcak su ekleyin. Kapağı kapatıp orta-kısık ateşte 35-40 dakika pişirin.'),
(13, 6, 'Biber yumuşayıp iç harç iyice sinince ocaktan alın; oda sıcaklığında 10-15 dakika dinlendirin, zeytinyağlı olarak servis edin.'),

-- 14: Et Sote
(14, 1, 'Dana kuşbaşını yıkayıp kağıt havluyla iyice kurulayın; soğanı yemeklik doğrayın, sarımsakları ince dilimleyin.'),
(14, 2, 'Kalın tabanlı geniş tavada zeytinyağını yüksek ateşte kızdırın; etleri sıkışık koymadan küçük partiler halinde her tarafı mühürlenene kadar kavurun. Mühürlenen etleri kenara alın.'),
(14, 3, 'Aynı tavada soğanı ekleyin; 3 dakika kavurup sarımsakları ilave edin, 1 dakika daha çevirin. Etleri geri koyun.'),
(14, 4, 'Domates salçasını ekleyin; 2-3 dakika boyunca karıştırarak kavurun. Kekik ve tuzu ilave edin.'),
(14, 5, 'Sıcak suyu ekleyin; kaynamaya başlayınca kısık ateşe alın, kapağı kapatıp etler iyice yumuşayana kadar 45-50 dakika pişirin.'),
(14, 6, 'Et çatalla kolayca parçalanıyorsa pişmiş demektir; sosu koyulaştırmak için kapağı açık tutarak 5 dakika daha pişirin, sıcak servis edin.'),

-- 15: Etli Nohut
(15, 1, 'Kuru nohutları bir gece önceden ıslatın; suyu dökün, taze su ile yumuşayana kadar haşlayıp süzün. (Konserve nohut kullanılacaksa bu adımı atlayın.) Dana kuşbaşını kurulayın.'),
(15, 2, 'Geniş tencerede zeytinyağını kızdırın; soğanı 3-4 dakika kavurun, ardından sarımsakları ekleyip 1 dakika daha çevirin.'),
(15, 3, 'Dana kuşbaşını ekleyin; yüksek ateşte her tarafı mühürlenene kadar kavurun.'),
(15, 4, 'Domates salçasını ilave edip 2 dakika kavurun; kekik ve tuzu ekleyin.'),
(15, 5, 'Haşlanmış nohutları ve sıcak suyu tencereye ekleyin; kaynamaya başlayınca kısık ateşe alıp kapağı kapatın, her şey iyice birleşip sos koyulaşana kadar 35-40 dakika pişirin.'),
(15, 6, 'Son 5 dakika kapağı açık bırakarak fazla suyu çekin; tuz kontrolü yapıp yanında pirinç pilavı ile sıcak servis edin.'),

-- 16: Etli Türlü
(16, 1, 'Patlıcanları yuvarlak dilimleyin; tuzlu suda 15-20 dakika bekletin, ardından süzüp kağıt havluyla iyice kurulayın.'),
(16, 2, 'Soğanı yarım ay, kapya biberi iri parçalar, domatesleri kalın dilimler, sarımsakları ince dilimler halinde kesin.'),
(16, 3, 'Geniş tencerede zeytinyağını kızdırın; soğanı 3 dakika kavurun, ardından kapya biberi ekleyin, 2 dakika daha pişirin.'),
(16, 4, 'Patlıcanları ekleyin; orta ateşte 5-6 dakika hafifçe kavurun. Sarımsak ve domatesleri ilave edin.'),
(16, 5, 'Tuz ve karabiberi ekleyin; 2-3 yemek kaşığı sıcak su ilave edip kapağı kapatın, kısık ateşte 30-35 dakika pişirin.'),
(16, 6, 'Sebzeler iyice yumuşayıp güzel bir sos oluşunca ocaktan alın; 10 dakika dinlendirip sıcak servis edin.'),

-- 17: Fırın Makarna
(17, 1, 'Fırını 180 dereceye ısıtın. Makarnayı kaynayan bol tuzlu suda paket üzerindeki sürenin 2 dakika eksiğinde al dente pişirin; süzüp bir kenara alın.'),
(17, 2, 'Soğan ve sarımsakları ince doğrayın; geniş tavada zeytinyağında 3-4 dakika pembeleşene kadar kavurun.'),
(17, 3, 'Dana kuşbaşını veya kıymayı ekleyin; yüksek ateşte renk alana kadar kavurun. Domates salçasını ilave edip 2 dakika daha pişirin.'),
(17, 4, 'Sıcak suyu, tuzu ve kekiği ekleyin; kısık ateşte 20-25 dakika pişirip et sosunu hazırlayın. Sosu makarna ile karıştırın.'),
(17, 5, 'Makarnalı karışımı fırın kabına aktarın; üzerine bol rendelenmiş kaşar peyniri serpin.'),
(17, 6, 'Önceden ısıtılmış fırında üzeri altın sarısı kızarana kadar 20-25 dakika pişirin; dilimleyerek sıcak servis edin.'),

-- 18: Fırında Köfte Patates
(18, 1, 'Fırını 200 dereceye ısıtın. Patatesleri kalın kama dilimler halinde kesin; zeytinyağı, tuz ve kekikle harmanlayın.'),
(18, 2, 'Kıymayı ince rendelenmiş soğan, ezilmiş sarımsak, tuz, kekik ve karabiberle 3-4 dakika yoğurun; ceviz büyüklüğünde uzun köfteler şekillendirin.'),
(18, 3, 'Fırın tepsisini zeytinyağıyla yağlayın; patatesleri tek sıra halinde yayın, köfteleri aralarına ve üstüne dizin.'),
(18, 4, 'Domates salçasını bir bardak sıcak suda eritin; tuz ve baharatları ekleyin, köfte ve patateslerin üzerine gezdirin.'),
(18, 5, 'Tepsinin üzerini alüminyum folyo ile sıkıca örtün; fırında 30 dakika pişirin.'),
(18, 6, 'Folyoyu açın; üzerinin kızarması için 10-15 dakika daha pişirin. Fırından alıp 5 dakika dinlendirin ve sıcak servis edin.'),

-- 19: Fırında Patatesli Tavuk
(19, 1, 'Fırını 190 dereceye ısıtın. Patatesleri büyük kama, soğanı halka, kapya biberi iri parçalar halinde kesin; domatesleri kalın dilimleyin.'),
(19, 2, 'Tavuk göğsünü zeytinyağı, domates salçası, tuz ve karabiber ile güzelce harleyin; en az 15 dakika marine edin.'),
(19, 3, 'Fırın tepsisine patatesleri yayın; üzerine soğan ve kapya biberi dağıtın, tuz ve karabiber serpin.'),
(19, 4, 'Marine edilmiş tavukları sebzelerin üzerine yerleştirin; kalan marinasyonu tepsiye dökün, domates dilimlerini üstüne koyun.'),
(19, 5, 'Tepsinin üzerini folyo ile örtün; fırında 35 dakika pişirin.'),
(19, 6, 'Folyoyu alın; tavuklar altın sarısına kızarana ve patatesler yumuşayana kadar 15-20 dakika daha pişirin. Dinlendirip sıcak servis edin.'),

-- 20: Ispanak Graten
(20, 1, 'Fırını 180 dereceye ısıtın. Ispanakları yıkayıp iri doğrayın; soğanı yemeklik, sarımsakları ince kıyın.'),
(20, 2, 'Geniş tavada zeytinyağını ısıtın; soğanı 3 dakika kavurun, ardından sarımsakları ekleyin, 1 dakika çevirin.'),
(20, 3, 'Ispanakları ekleyin; yüksek ateşte suyu tamamen çekene kadar 5-6 dakika pişirin. Tuz ve karabiberle tatlandırın; kenara alın.'),
(20, 4, 'Beşamel sos için ayrı bir tencerede tereyağında unu kavurun; sütü azar azar ekleyip sürekli karıştırarak koyulaştırın, tuz ve karabiber ekleyin.'),
(20, 5, 'Fırın kabına ıspanağı yayın; üzerine beşamel sosu dökün, bolca rendelenmiş kaşar veya Gruyère peyniri serpin.'),
(20, 6, 'Önceden ısıtılmış fırında üzeri altın rengine kızarana kadar 20-25 dakika pişirin; kabarcıklı ve kızarmış şekilde sıcak servis edin.'),

-- 21: İzmir Köfte
(21, 1, 'Kıymayı ince rendelenmiş soğan, ezilmiş sarımsak, tuz, kekik ve karabiber ile 4-5 dakika yoğurun; köfteleri parmak şeklinde uzunlamasına şekillendirin.'),
(21, 2, 'Kızgın yağda köfteleri her tarafını mühürleyecek şekilde kısaca kızartın (tamamen pişirmeden); bir güveç kabı veya fırın tepsisine dizin.'),
(21, 3, 'Patatesleri kalın dilim veya kamalar şeklinde kesin; domatesleri halka halka dilimleyin. Patatesleri köftelerin arasına, domatesleri üstüne yerleştirin.'),
(21, 4, 'Domates salçasını bir su bardağı sıcak suda eritin; tuz ve kekiği ekleyin, hazırlanan sosu tepsiye dökün.'),
(21, 5, 'Tepsinin üzerini folyo ile örtün; önceden 180 dereceye ısıtılmış fırında 30 dakika pişirin.'),
(21, 6, 'Folyoyu alın; üzeri kızarana kadar 15 dakika daha pişirin. Fırından alıp 5 dakika dinlendirin ve sıcak servis edin.'),

-- 22: Kabak Sandal
(22, 1, 'Orta boy kabakları uzunlamasına ikiye bölün; kaşıkla ortasını hafifçe oyarak sandal şekli verin. Oyulan parçaları atılmamasın, ince kıyın.'),
(22, 2, 'Soğan ve sarımsakları ince doğrayın; zeytinyağında 3-4 dakika kavurun.'),
(22, 3, 'Dana kuşbaşını ekleyin; yüksek ateşte her tarafı mühürleyene kadar kavurun. Domates salçasını ilave edip 2 dakika kavurun.'),
(22, 4, 'Kabaktan çıkan ince kıyılmış parçaları da tencereye ekleyin; tuz ve kekiği ilave edip sıcak su ile kısık ateşte et yumuşayana kadar 25-30 dakika pişirin.'),
(22, 5, 'Kabak yarımlarını zeytinyağıyla yağlanmış fırın kabına yerleştirin; içlerine etli harcı doldurun, üzerine domates dilimleri koyun.'),
(22, 6, 'Önceden 180 dereceye ısıtılmış fırında kabaklar yumuşayıp üstü hafif kızarana kadar 25-30 dakika pişirin; sıcak servis edin.'),

-- 23: Karnıyarık
(23, 1, 'Patlıcanların boyuna ortasına derin bir kesi atın (sandalye gibi açılsın, dağılmasın); 30 dakika tuzlu suda bekletin, süzüp kağıt havluyla kurulayın.'),
(23, 2, 'Soğan ve sarımsakları ince doğrayın; zeytinyağında kavurun. Dana kıymasını ekleyin; suyunu çekip renk alana kadar pişirin.'),
(23, 3, 'Domates salçasını ilave edip 2 dakika kavurun; ince doğranmış domatesleri ve kekiği ekleyin. Tuzla tatlandırıp 10 dakika pişirin. Harcı ocaktan alın.'),
(23, 4, 'Patlıcanları kızgın zeytinyağında her tarafından güzelce kızartın; kağıt havlu üzerine alıp fazla yağı süzdürün.'),
(23, 5, 'Kızarmış patlıcanları fırın tepsisine dizin; kesikleri açarak içlerine etli harcı doldurun. Üzerine domates ve yeşil biber dilimi koyun.'),
(23, 6, 'Önceden 190 dereceye ısıtılmış fırında 25-30 dakika pişirin; patlıcanlar tamamen yumuşayınca fırından alın, 10 dakika dinlendirip servis edin.'),

-- 24: Kuru Fasulye
(24, 1, 'Kuru fasulyeyi bir gece önceden ıslatın; suyu dökün, taze su ekleyip fasulyeler diş diş ama sert olarak haşlanana kadar yaklaşık 45-50 dakika pişirin.'),
(24, 2, 'Geniş tencerede zeytinyağını kızdırın; soğanı 3-4 dakika kavurun, sarımsakları ekleyip 1 dakika daha çevirin.'),
(24, 3, 'Dana kuşbaşını ekleyin; yüksek ateşte her tarafı mühürlenene kadar kavurun.'),
(24, 4, 'Domates salçasını ekleyin; 2-3 dakika kavurun. Kekik ve tuzu ilave edin.'),
(24, 5, 'Yarı pişmiş fasulyeler ve sıcak suyu tencereye ekleyin; kaynamaya başlayınca kısık ateşe alıp kapağı kapatın, 35-40 dakika fasulye ve et iyice yumuşayana kadar pişirin.'),
(24, 6, 'Son 5 dakika kapağı açık bırakarak sos koyulaşana kadar pişirin; tuz ayarı yapıp yanında pirinç pilavı ile sıcak servis edin.'),

-- 25: Mantarlı Tavuk
(25, 1, 'Tavuk göğsünü iri küpler veya şeritler halinde doğrayın; soğanı yemeklik, kapya biberi ince şeritler halinde kesin, mantarları dörde bölün.'),
(25, 2, 'Geniş tavada zeytinyağını kızdırın; soğanı 3 dakika kavurun, ardından kapya biberi ekleyip 2 dakika daha pişirin.'),
(25, 3, 'Tavuk parçalarını ilave edin; yüksek ateşte her tarafı renk alana kadar çevirin.'),
(25, 4, 'Mantarları ekleyin; suları tamamen çekene kadar 5-6 dakika yüksek ateşte pişirin.'),
(25, 5, 'Domates salçasını ve ince doğranmış domatesleri ekleyin; tuz ve karabiberi ilave edip kapağı kapatın, orta ateşte 15-20 dakika pişirin.'),
(25, 6, 'Sos güzel koyulaşınca ocaktan alın; taze kekik veya maydanozla süsleyip sıcak servis edin.'),

-- 26: Nohutlu Bulgur Pilavı
(26, 1, 'Bulguru geniş bir kaba alın; ılık suyla bir kez durulayıp süzün. Haşlanmış nohutları hazır edin (konserve ise süzüp yıkayın).'),
(26, 2, 'Geniş ve kalın tabanlı tencerede zeytinyağını kızdırın; soğanı 3-4 dakika kavurun, sarımsakları ekleyip 1 dakika daha çevirin.'),
(26, 3, 'Domates salçasını ilave edip 2 dakika kavurun; haşlanmış nohutları ekleyip karıştırın.'),
(26, 4, 'Bulguru tencereye ekleyin; kekik ve tuzu ilave edip 2 dakika kavurun. Sıcak suyu bulgur miktarının iki katı olacak şekilde (yaklaşık 4 su bardağı) ekleyin.'),
(26, 5, 'Kaynamaya başlayınca kısık ateşe alıp kapağı kapatın; bulgur suyu tamamen çekene kadar 15-20 dakika pişirin.'),
(26, 6, 'Ocağı kapatın; kapağın altına bir kağıt havlu koyup 10 dakika demlendirin. Kapağı açıp kavurmadan çatalla hafifçe karıştırıp servis edin.'),

-- 27: Patlıcan Musakka
(27, 1, 'Patlıcanları yuvarlak dilimleyin; tuzlu suda 20-30 dakika bekletip kağıt havluyla iyice kurulayın. Fırını 180 dereceye ısıtın.'),
(27, 2, 'Patlıcan dilimlerini zeytinyağında her iki taraftan altın rengi alana kadar kızartın; kağıt havlu üzerine alıp yağını süzdürün.'),
(27, 3, 'Aynı tavada soğan ve sarımsakları kavurun; dana kıymasını ekleyip suyunu çekene kadar pişirin. Domates salçasını ilave edip 2 dakika kavurun.'),
(27, 4, 'Domatesleri küp doğrayıp tencereye ekleyin; tuz ve kekiği ilave edip orta ateşte 10 dakika pişirin. Harcı kenara alın.'),
(27, 5, 'Fırın kabına önce bir kat kızartılmış patlıcan, ardından kıymalı sos, tekrar patlıcan şeklinde katmanlar oluşturun; en üste domates dilimleri koyun.'),
(27, 6, 'Önceden ısıtılmış fırında 30-35 dakika pişirin; fırından alıp 10 dakika dinlendirdikten sonra servis edin.'),

-- 28: Sebzeli Güveç
(28, 1, 'Kabakları kalın halka veya yarım ay şeklinde kesin; soğanı halka, kapya biberi iri parçalar, domatesleri ince dilimler, sarımsakları ince dilimler halinde kesin. Fırını 170 dereceye ısıtın.'),
(28, 2, 'Güveç kabının tabanına zeytinyağı gezdirin; soğan halkalarını yayın.'),
(28, 3, 'Üzerine kabak, kapya biber ve sarımsakları sıralayın; tuz ve karabiber serpin.'),
(28, 4, 'Domates dilimlerini en üst katmana yerleştirin; üzerine zeytinyağı ve taze veya kuru kekik ilave edin.'),
(28, 5, 'Güveç kabını sıkıca kapatın veya alüminyum folyo ile örtün; önceden ısıtılmış fırına koyun. 50-60 dakika, sebzeler iyice yumuşayıp kendi suyunu salana kadar pişirin.'),
(28, 6, 'Kapağı açıp fazla suyu çekmek için 10 dakika daha pişirin; kekikle süsleyip ekmekle sıcak servis edin.');
