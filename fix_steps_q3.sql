-- =====================================================
-- Üçüncü çeyrek tariflerin adımlarını düzelt (ID 57-84)
-- Tariflere özgü, detaylı adımlar
-- =====================================================

DELETE FROM recipe_steps WHERE recipe_id BETWEEN 57 AND 84;

INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES

-- 57: Makarna Salatası
(57, 1, 'Makarnayı kaynayan bol tuzlu suda al dente (paket süresinin 2 dk eksiğinde) pişirin; soğuk suyla durulayıp süzün ve büyük bir kaseye alın.'),
(57, 2, 'Domatesi küçük küpler, salatalığı ince halkalar, kırmızı soğanı çok ince doğrayın; konserve mısır varsa süzüp yıkayın.'),
(57, 3, 'Maydanoz ve taze fesleğen varsa ince kıyın; zeytun, kapari veya kızarmış biber eklemek isterseniz hazırlayın.'),
(57, 4, 'Sos için zeytinyağı, limon suyu, tuz, karabiber ve isteğe göre bir tutam kekik veya hardal karıştırın.'),
(57, 5, 'Makarnayı sebzeler ve maydanozla birleştirin; sosu üzerine gezdirin. Tüm malzemeyi nazikçe harmanlayın.'),
(57, 6, 'Buzdolabında en az 20 dakika bekletin; servis öncesi tuz kontrolü yapıp taze maydanoz serperek soğuk sunun.'),

-- 58: Mantarlı Omlet
(58, 1, 'Mantarları kağıt havluyla temizleyin; ince dilimleyin. Domatesi ve yeşil biberi ince küpler halinde kesin.'),
(58, 2, 'Tavada sıvı yağı kızdırın; mantarları yüksek ateşte 3-4 dakika suyu tamamen çekene kadar kavurun. Tuz ve karabiber ekleyin; kenara alın.'),
(58, 3, 'Yumurtaları kaseye kırın; sütü, tuz ve karabiberi ekleyin. Çatal veya çırpıcıyla pürüzsüz kıvama çırpın.'),
(58, 4, 'Teflon tavayı orta ateşte ısıtın; sıvı yağı ekleyin. Yumurta karışımını dökün; kenarlardan ortaya doğru hafifçe iterek pişirin.'),
(58, 5, 'Yumurta yarı katılaşınca üzerine kavurulan mantarları ve rendelenmiş kaşar peynirini serpin; ometin yarısını diğer yarısının üstüne katlamak için hazır bekleyin.'),
(58, 6, 'Ometi katlayın; peynir eriyene kadar kısık ateşte 1-2 dakika daha pişirin. Sıcak olarak tabağa alıp hemen servis edin.'),

-- 59: Nohutlu Salata
(59, 1, 'Haşlanmış nohutları süzüp soğuk suyla durulayın; kağıt havluyla hafifçe kurulayın.'),
(59, 2, 'Domatesi küçük küpler, salatalığı ince halkalar, kırmızı soğanı çok ince doğrayın; soğanı soğuk suda 10 dakika bekletip süzün.'),
(59, 3, 'Taze maydanozu ve varsa dereotunu ince kıyın; sarımsakları çok ince kıyın veya ezin.'),
(59, 4, 'Sos için zeytinyağı, limon suyu, tuz, karabiber ve sarımsakları karıştırın.'),
(59, 5, 'Nohutları, sebzeleri ve maydanozu geniş kaseye alın; sosu üzerine gezdirip tüm malzemeyi nazikçe harmanlayın.'),
(59, 6, 'En az 15 dakika bekletip lezzetlerin birbirine geçmesini sağlayın; servis öncesi tuz kontrolü yapıp taze otlarla süsleyerek sunun.'),

-- 60: Patatesli Gözleme
(60, 1, 'Hamur için unu ve tuzu kaseye alın; ortasına çukur açıp yoğurt ve sıvı yağı ekleyin. Yavaş yavaş su ekleyerek yumuşak, ele yapışmayan bir hamur yoğurun; 20 dakika dinlendirin.'),
(60, 2, 'Haşlanmış patatesleri iyice ezin; tuz, karabiber ve ince kıyılmış maydanozu ekleyin. İstenirse kırmızı pul biber veya rendelenmiş peynir de katabilirsiniz.'),
(60, 3, 'Hamuru mandalina büyüklüğünde bezeler halinde bölün; her bezeyi ince ve geniş (yaklaşık 2-3 mm) açın.'),
(60, 4, 'Açılan hamurun yarısına patates harcından ince bir kat yayın; diğer yarısını üstüne katlayın veya üzerine başka bir hamur tabakası örtün.'),
(60, 5, 'Kuru veya çok az yağlı ısıtılmış tava ya da sacda her iki tarafı altın sarısı kızarana kadar 2-3 dakika pişirin.'),
(60, 6, 'Pişer pişmez üzerine sıvı yağ veya tereyağı sürün; dilimleyerek sıcak servis edin. Yanında yoğurt ve taze soğanla sunun.'),

-- 61: Patatesli Omlet
(61, 1, 'Patatesi küçük küpler veya ince dilimler halinde kesin; zeytinyağında tuz ekleyerek yumuşayana ve hafif kızarana kadar 8-10 dakika soteleyin. Kenara alın.'),
(61, 2, 'Domatesi ve yeşil biberi ince küpler halinde kesin; aynı tavada 2-3 dakika hafifçe kavurun.'),
(61, 3, 'Yumurtaları kaseye kırın; sütü, tuz ve pul biberi ekleyip çırpın.'),
(61, 4, 'Tavaya biraz sıvı yağ ekleyin; yumurtaları dökün. Kenarlar koyulaşmaya başlayınca patatesleri ve sebzeleri üzerine serpin.'),
(61, 5, 'Kaşar peynirini üzerine rendeleyin; ometin yarısını katlayın ya da kapağı kapatıp iç kısmının pişmesini bekleyin.'),
(61, 6, 'Yumurta tamamen katılaşınca ocaktan alın; sıcak olarak tabağa alıp yanında ekmekle servis edin.'),

-- 62: Peynirli Gözleme
(62, 1, 'Hamur için unu ve tuzu kaseye alın; yoğurt, sıvı yağ ve su ekleyerek kulak memesi kıvamında yumuşak bir hamur yoğurun. Üzerini örtüp 20 dakika dinlendirin.'),
(62, 2, 'Beyaz peyniri ufalayın veya ezin; ince kıyılmış maydanozu ve karabiberi ekleyip karıştırın.'),
(62, 3, 'Hamuru küçük bezeler halinde bölün; her bezeyi mümkün olduğunca ince (2 mm) büyük bir daire şeklinde açın.'),
(62, 4, 'Açılan hamurun yarısına peynir harcından ince bir kat yayın; kenarlarında 1 cm boşluk bırakın. Diğer yarısını üstüne katlayın.'),
(62, 5, 'Önceden ısıtılmış kuru sacda veya tavada her iki tarafı altın sarısı kızarana kadar pişirin (her taraf 2-3 dakika).'),
(62, 6, 'Pişer pişmez üzerine tereyağı veya sıvı yağ sürün; sıcakken dilimleyin ve hemen servis edin.'),

-- 63: Peynirli Poğaça
(63, 1, 'Fırını 180 dereceye ısıtın. Unu, tuzu, kabartma tozunu kaseye alın; ortasına çukur açıp yoğurt ve sıvı yağı ekleyin. Ele yapışmayan yumuşak bir hamur yoğurun; gerekirse az su ekleyin.'),
(63, 2, 'Kaşar peynirini rendeleyip bir kaseye alın; isteğe göre ince kıyılmış maydanoz veya kekik ekleyin.'),
(63, 3, 'Hamurdan ceviz büyüklüğünde parçalar koparın; her parçanın içine bir çay kaşığı peynir harcı koyup sıkıca kapatarak yuvarlak veya oval şekil verin.'),
(63, 4, 'Poğaçaları yağlı kağıtla kaplı fırın tepsisine aralarında boşluk bırakarak dizin; üzerlerine yumurta sarısı veya süt sürün. İstenirse üstüne çörek otu veya susam serpin.'),
(63, 5, 'Önceden ısıtılmış fırında 20-25 dakika, üzerleri altın sarısına kızarana kadar pişirin.'),
(63, 6, 'Fırından alıp 5 dakika dinlendirin; sıcak veya ılık servis edin. Yanında çay ile ikram edin.'),

-- 64: Peynirli Quesadilla
(64, 1, 'Domatesi ve yeşil biberi çok ince doğrayın; kaşar peynirini rendeleyip hazır edin.'),
(64, 2, 'Tortillanın tamamına rendelenmiş kaşarı yayın; üzerine domates ve yeşil biber dilimlerini serpin. Tuz, karabiber ve kekik ekleyin.'),
(64, 3, 'Tortillayı yarıya katlayın (yarım ay şekli) ya da ikinci bir tortillayla kapatın.'),
(64, 4, 'Orta ateşte ısıtılmış kuru tavaya tortillayı alın; tereyağını kenarda eritip tortillanın üzerine sürün.'),
(64, 5, 'Her iki tarafı altın sarısı ve çıtır kızarana kadar 2-3 dakika pişirin; peynirin iyice erimesi önemli.'),
(64, 6, 'Üçgen dilimler halinde kesin; yanında salsa sos, yoğurt veya guakamole ile sıcak servis edin.'),

-- 65: Sebzeli Krep Bohçası
(65, 1, 'Krep hamuru için unu ve tuzu kaseye alın; yumurta, süt ve sıvı yağı ekleyip çırparak pürüzsüz bir hamur hazırlayın. 15 dakika dinlendirin.'),
(65, 2, 'Karışık sebzeleri (biber, kabak, havuç, mantar gibi) ince julyen kesin; zeytinyağında tuz ve karabiberle 5-6 dakika soteleyin. Ocaktan alıp soğumaya bırakın.'),
(65, 3, 'Teflon tavada krepler pişirin: yağlı tavaya bir kepçe hamur döküp ince daire şeklinde yayın; her iki tarafı açık sarı renk alana kadar pişirin.'),
(65, 4, 'Pişen krepin ortasına sotelenen sebzelerden bir kaşık koyun; isteğe göre rendelenmiş peynir veya yoğurt ekleyin.'),
(65, 5, 'Krepin kenarlarını içe doğru katlayarak bohça şekli oluşturun; kürdan ile sabitleyin.'),
(65, 6, 'Bohçaları servis tabağına dizin; üzerine maydanoz serpin ve yanında yoğurtlu sos ile sunun.'),

-- 66: Sebzeli Noodle
(66, 1, 'Noodleları kaynar tuzlu suda paket talimatına göre (genellikle 3-4 dakika) pişirin; soğuk suyla durulayıp süzün.'),
(66, 2, 'Sebzeleri (havuç, biber, kabak, mantar) ince julyen kesin; sarımsak ve zencefil varsa ince kıyın.'),
(66, 3, 'Wok veya büyük tavada sıvı yağı yüksek ateşte kızdırın; önce sarımsak ve zencefili 30 saniye kavurun.'),
(66, 4, 'Havuç ve biber gibi sert sebzeleri ekleyin; 2-3 dakika kavurun. Ardından yumuşak sebzeler (kabak, mantar) ve yeşil soğanı ekleyip 2 dakika daha pişirin.'),
(66, 5, 'Noodleları tencereye ekleyin; soya sosu, tuz, karabiber ve az miktarda maydanoz ilave edin. Yüksek ateşte 1-2 dakika karıştırarak pişirin.'),
(66, 6, 'Ocaktan alıp limon suyu gezdirin; yoğurtlu sos ile veya tek başına sıcak servis edin.'),

-- 67: Sucuklu Tost
(67, 1, 'Sucuğu ince dilimleyin; teflon tavada yağsız olarak her iki tarafından kısa süre pişirin ve fazla yağını kağıt havluyla alın.'),
(67, 2, 'Tost ekmeklerini hazırlayın; iç yüzlerine ince bir kat tereyağı sürün.'),
(67, 3, 'Bir dilim ekmek üzerine kaşar dilimleri, ardından sucuk dilimleri ve ince doğranmış domates ve yeşil biber yerleştirin.'),
(67, 4, 'Tuz, karabiber ve kekik serpin; ikinci ekmek dilimini üstüne kapatın.'),
(67, 5, 'Tost makinesini önceden ısıtın; sandviçi yerleştirip altın sarısı kızarana ve peynir eriyene kadar 3-4 dakika pişirin.'),
(67, 6, 'Sıcakken köşegenden keserek servis edin; yanında turşu, domates ve salatalıkla sunun.'),

-- 68: Tavuklu Wrap
(68, 1, 'Tavuk göğsünü ince şeritler halinde kesin; tuz, karabiber, kekik ve zeytinyağı ile marine edip 15 dakika bekletin.'),
(68, 2, 'Marine edilmiş tavukları kızgın tavada her tarafı pişip hafif kızarana kadar 5-6 dakika soteleyin.'),
(68, 3, 'Domatesi ve yeşil biberi ince dilimleyin; kaşarı rendeleyin. İstenirse ince doğranmış marul veya roka da ekleyebilirsiniz.'),
(68, 4, 'Tortillayı kuru ısıtılmış tavada 30 saniye ısıtın; yumuşayıp bükülebilir hale gelsin.'),
(68, 5, 'Tortillanın ortasına önce kaşarı yayın, sonra pişmiş tavuk, domates ve yeşil biberi sıralayın; tuz ve kekik serpin.'),
(68, 6, 'Tortillayı sıkıca sarın; ortadan ikiye kesin. Yanında yoğurtlu sos veya acı sos ile sıcak servis edin.'),

-- 69: Ton Balıklı Sandviç
(69, 1, 'Ton balığı konservesini süzün ve büyük kaseye alın; iyice ufalayın.'),
(69, 2, 'Ton balığına mayonez, limon suyu, tuz ve karabiber ekleyin; isteğe göre ince kıyılmış soğan veya kapari de koyabilirsiniz. Karıştırın.'),
(69, 3, 'Domatesi ve yeşil biberi ince dilimleyin; ekmekleri tercihli olarak kızartabilirsiniz.'),
(69, 4, 'Bir dilim ekmek üzerine tereyağı sürün; ton balığı karışımından cömertçe yayın.'),
(69, 5, 'Üzerine domates ve yeşil biber dilimlerini sıralayın; kaşar veya çedar dilimleri de ekleyebilirsiniz. İkinci ekmekle kapatın.'),
(69, 6, 'İsterseniz tost makinesinde ısıtın ya da soğuk servis edin; yanında turşu ve yeşil salatayla sunun.'),

-- 70: Yumurtalı Ekmek
(70, 1, 'Yumurtaları geniş kaseye kırın; sütü, tuzu ve pul biberi ekleyip iyice çırpın.'),
(70, 2, 'Ekmek dilimlerini (bayat ekmek daha iyi sonu verir) yumurta karışımına her iki taraftan iyice batırın; 1-2 dakika dinlendirin.'),
(70, 3, 'Tavada sıvı yağı orta ateşte ısıtın; ıslandırılmış ekmek dilimlerini tavaya alın.'),
(70, 4, 'Her iki tarafı altın sarısı kızarana kadar 2-3 dakika pişirin; dilimlerin ortası içe kaçık kalmamalı.'),
(70, 5, 'İnce dilimlenmiş domates ve yeşil biberi aynı tavada birkaç dakika kavurun; ya da çiğ olarak hazır edin.'),
(70, 6, 'Yumurtalı ekmeği tabağa alın; üzerine veya yanına domates, yeşil biber ve kaşar koyun. Sıcak servis edin.'),

-- 71: Arpa Şehriye Çorbası
(71, 1, 'Soğanı ince doğrayın; havucu küçük küpler halinde kesin. Arpa şehriyeyi kuru tavada hafifçe kavurun (rengi değişene kadar).'),
(71, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika kavurun, ardından havucu ekleyip 2 dakika daha çevirin.'),
(71, 3, 'Kavrulmuş arpa şehriyeyi tencereye ekleyin; 1-2 dakika birlikte kavurun.'),
(71, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alın, tuz ve kimyonu ilave edin. Şehriye yumuşayana kadar 15-20 dakika pişirin.'),
(71, 5, 'Ayrı tavada tereyağında pul biberi 30 saniye kızdırın; çorbaya gezdirin.'),
(71, 6, 'Kase veya çorba tabağına alın; üzerine limon suyu sıkabilir, yanında ekmekle sıcak servis edebilirsiniz.'),

-- 72: Balkabağı Çorbası
(72, 1, 'Balkabağını soyup çekirdeklerini çıkarın; 3-4 cm küpler halinde kesin. Soğanı yemeklik doğrayın, havucu küçük küpler kesin.'),
(72, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika kavurun, havucu ekleyip 2 dakika daha çevirin.'),
(72, 3, 'Balkabağı küplerini ekleyin; kısaca kavurun. Suyu ilave edip kaynamaya bırakın.'),
(72, 4, 'Kaynamaya başlayınca kısık ateşe alın; tuz, kimyon ve karabiberi ekleyin. Balkabağı tamamen yumuşayana kadar 20-25 dakika pişirin.'),
(72, 5, 'Çorbayı blender ile pürüzsüz hale getirin; kıvam çok koyuysa sıcak su veya süt ekleyin. Tat kontrolü yapın.'),
(72, 6, 'Kaseye alın; üzerine tereyağında kızdırılmış pul biber gezdirin, isteğe göre krema ve kabak çekirdeği serpin. Sıcak servis edin.'),

-- 73: Brokoli Çorbası
(73, 1, 'Brokolileri küçük çiçeklere ayırın, saplarını soyup dilimleyin; patatesi küpler halinde kesin, soğanı ince doğrayın.'),
(73, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3 dakika kavurun.'),
(73, 3, 'Patates küplerini ekleyin; 2 dakika çevirin. Ardından brokoli ve suyu ilave edin; kaynama başlayana kadar orta ateşte pişirin.'),
(73, 4, 'Kısık ateşe alın; tuz ve karabiberi ekleyin. Patates ve brokoli iyice yumuşayana kadar 20 dakika pişirin.'),
(73, 5, 'Çorbayı blender ile pürüzsüz hale getirin; çok koyu ise biraz daha sıcak su ekleyin. Limon suyunu ilave edip karıştırın.'),
(73, 6, 'Servis kasesine alın; üzerine zeytinyağı gezdirin ve istenirse çıtır galeta unu veya kızarmış brokoli çiçeği ile süsleyip sıcak sunun.'),

-- 74: Domates Çorbası
(74, 1, 'Olgun domatesleri ikiye bölün; soğanı iri, sarımsakları iri doğrayın. İstenirse fırında 200 derecede 25 dakika közleyebilirsiniz (daha yoğun tat için).'),
(74, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika kavurun, sarımsakları ekleyip 1 dakika çevirin.'),
(74, 3, 'Domatesleri tencereye ekleyin; 5-6 dakika kavurun. Tuz, kimyon ve karabiberi ilave edin.'),
(74, 4, 'Suyu ekleyin; kaynama başlayınca kısık ateşe alıp 20 dakika pişirin.'),
(74, 5, 'Çorbayı blender ile pürüzsüz çekin; süzgeçten geçirerek kabuklarını ve tohumlarını ayırın. Tenceреye geri koyup ısıtın.'),
(74, 6, 'Kaselere alın; üzerine tereyağında pul biber gezdirin. Yanında kızarmış ekmek veya kraker ile sıcak servis edin.'),

-- 75: Düğün Çorbası
(75, 1, 'Kuzu veya dana eti küçük parçalar halinde kesin; soğanı ince doğrayın, havucu küçük küpler kesin.'),
(75, 2, 'Tencerede tereyağında eti yüksek ateşte mühürleyin; soğanı ve havucu ekleyip 3-4 dakika kavurun.'),
(75, 3, 'Suyu ekleyin; köpüğü alarak kaynayana kadar bekleyin. Kısık ateşe alıp et yumuşayana kadar 40-45 dakika pişirin.'),
(75, 4, 'Terbiye için yumurta sarısını ve unu bir kasede çırpın; limon suyunu ekleyin. Sıcak et suyundan kepçe kepçe alıp terbiyeye yavaşça karıştırın (ısı eşitleme).'),
(75, 5, 'Terbiyeli karışımı tencereye dökerken sürekli karıştırın; kısık ateşte 5-6 dakika daha pişirin. Kaynamasın, aksi halde yumurta kesilir.'),
(75, 6, 'Ayrı tavada tereyağında pul biber ve kimyonu kızdırın; çorbaya gezdirin. Kaseye alıp limon dilimleri ile sıcak servis edin.'),

-- 76: Erişteli Yeşil Mercimek Çorbası
(76, 1, 'Yeşil mercimeği yıkayıp süzün; bol suda 5 dakika haşlayın, suyunu dökün ve taze su ekleyin. Soğanı ve havucu küçük küpler kesin.'),
(76, 2, 'Tencerede tereyağında soğanı 3-4 dakika kavurun; havucu ekleyip 2 dakika daha çevirin.'),
(76, 3, 'Mercimeği tencereye ekleyin; 2 dakika kavurun. Suyu ilave edip kaynamaya bırakın.'),
(76, 4, 'Köpüğü alın; kısık ateşe alıp tuz ve kimyonu ekleyin. Mercimek yumuşayana kadar 25-30 dakika pişirin.'),
(76, 5, 'Erişteyi ekleyin; 8-10 dakika daha pişirin. Çorba koyulaşacak, gerekirse sıcak su ilave edin.'),
(76, 6, 'Ayrı tavada tereyağında pul biberi kızdırın; çorbaya gezdirin. Kaseye alıp yanında ekmekle sıcak servis edin.'),

-- 77: Havuç Çorbası
(77, 1, 'Havuçları soyup kalın halka dilimleyin; patatesi küpler, soğanı iri parçalar halinde kesin.'),
(77, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3 dakika kavurun.'),
(77, 3, 'Havuç ve patates küplerini ekleyin; 2-3 dakika birlikte kavurun.'),
(77, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve karabiberi ilave edin. Havuç ve patates tamamen yumuşayana kadar 25 dakika pişirin.'),
(77, 5, 'Çorbayı blender ile pürüzsüz hale getirin; limon suyunu ekleyin. Kıvam için gerekirse sıcak su ilave edin.'),
(77, 6, 'Kaselere alın; üzerine zeytinyağı gezdirin ve isteğe göre taze kekik veya krema ile süsleyip sıcak servis edin.'),

-- 78: Ispanak Çorbası
(78, 1, 'Ispanakları yıkayıp iri doğrayın; patatesi küpler, soğanı ince kesin.'),
(78, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3 dakika pembeleşene kadar kavurun.'),
(78, 3, 'Patates küplerini ekleyin; 2 dakika kavurun. Suyu ilave edip kaynama başlayana kadar pişirin.'),
(78, 4, 'Kısık ateşe alın; tuz ve karabiberi ekleyin. Patatesler yumuşayana kadar 15 dakika pişirin.'),
(78, 5, 'Ispanakları tencereye ekleyin; 5-6 dakika pişirin. Renk canlı yeşil kalmalı, fazla uzun pişirmekten kaçının. Blender ile püre yapın.'),
(78, 6, 'Limon suyunu ekleyin; tat kontrolü yapın. Kaselere alıp üzerine zeytinyağı gezdirin ve sıcak servis edin.'),

-- 79: Karnabahar Çorbası
(79, 1, 'Karnabaharı küçük çiçeklere ayırın; patatesi küpler, soğanı ince kesin.'),
(79, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3-4 dakika kavurun.'),
(79, 3, 'Karnabahar çiçeklerini ve patates küplerini ekleyin; 2-3 dakika kavurun.'),
(79, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve karabiberi ilave edin. Karnabahar ve patatesler iyice yumuşayana kadar 20-25 dakika pişirin.'),
(79, 5, 'Çorbayı blender ile pürüzsüz hale getirin; limon suyunu ekleyin. Kıvam koyuysa sıcak su ilave edin.'),
(79, 6, 'Kaselere alın; üzerine zeytinyağı gezdirin ve isteğe göre taze kekik veya kızarmış karnabahar parçacıkları ile süsleyip sıcak servis edin.'),

-- 80: Kereviz Çorbası
(80, 1, 'Kerevizi soyup küpler halinde kesin; patatesi küpler, soğanı ince doğrayın. Kereviz oksidasyona uğramaması için limonlu suya atın.'),
(80, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3 dakika kavurun.'),
(80, 3, 'Kereviz ve patates küplerini ekleyin; 2-3 dakika birlikte kavurun.'),
(80, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve karabiberi ilave edin. Her şey iyice yumuşayana kadar 25-30 dakika pişirin.'),
(80, 5, 'Çorbayı blender ile pürüzsüz hale getirin; limon suyunu ekleyin. Kıvam için gerekirse sıcak su veya süt katabilirsiniz.'),
(80, 6, 'Kaselere alın; üzerine zeytinyağı gezdirin ve taze maydanoz veya krema ile süsleyip sıcak servis edin.'),

-- 81: Mahluta Çorbası
(81, 1, 'Kırmızı mercimek ve bulguru ayrı ayrı yıkayıp süzün; soğanı ince doğrayın, havucu küçük küpler kesin.'),
(81, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika kavurun, havucu ekleyip 2 dakika daha çevirin.'),
(81, 3, 'Mercimek ve bulguru tencereye ekleyin; 2 dakika birlikte kavurun.'),
(81, 4, 'Suyu ekleyin; kaynamaya başlayınca köpüğü alın. Kısık ateşe alıp tuz ve kimyonu ilave edin. Her şey yumuşayana kadar 25-30 dakika pişirin.'),
(81, 5, 'Çorbayı blender ile hafifçe çekin (tam pürüzsüz olmak zorunda değil, biraz taneli kalabilir). Kıvamı düzeltin.'),
(81, 6, 'Ayrı tavada tereyağında pul biber ve kırmızı pul biberi kızdırın; çorbaya gezdirin. Kaseye alıp yanında ekmekle sıcak servis edin.'),

-- 82: Mantar Çorbası
(82, 1, 'Mantarları kağıt havluyla temizleyin; ince dilimleyin. Soğanı yemeklik doğrayın, sarımsakları ince kıyın.'),
(82, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika pembeleşene kadar kavurun, sarımsakları ekleyip 1 dakika daha çevirin.'),
(82, 3, 'Mantarları tencereye ekleyin; yüksek ateşte mantarlar suyunu salıp çekene kadar 6-7 dakika kavurun. Bu adım derin tat için kritik.'),
(82, 4, 'Unu üzerine serpin; 1-2 dakika kavurun. Sütü ve suyu azar azar ekleyerek sürekli karıştırın; topak oluşmamasına dikkat edin.'),
(82, 5, 'Kısık ateşe alın; tuz ve karabiberi ekleyin. Çorba koyulaşana kadar 10-15 dakika pişirin. Blender ile yarısını pürüzsüz yapıp geri eklerseniz kremamsı kıvam elde edersiniz.'),
(82, 6, 'Kaseye alın; üzerine tereyağında pul biber gezdirin ve taze kekik veya maydanozla süsleyip sıcak servis edin.'),

-- 83: Patates Çorbası
(83, 1, 'Patatesleri soyup küpler halinde kesin; soğanı ince doğrayın, havucu küçük küpler kesin.'),
(83, 2, 'Tencerede tereyağını eritin; soğanı 3-4 dakika kavurun, havucu ekleyip 2 dakika daha çevirin.'),
(83, 3, 'Patates küplerini tencereye ekleyin; 2-3 dakika birlikte kavurun.'),
(83, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve kimyonu ilave edin. Patatesler tamamen yumuşayana kadar 20-25 dakika pişirin.'),
(83, 5, 'Çorbanın yarısını veya tamamını blender ile pürüzsüz hale getirin; süt veya krema eklerseniz daha kremamsı bir kıvam elde edersiniz.'),
(83, 6, 'Ayrı tavada tereyağında pul biber kızdırın; çorbaya gezdirin. Kaseye alıp taze maydanoz serperek sıcak servis edin.'),

-- 84: Sebze Çorbası
(84, 1, 'Karışık sebzeleri (patates, havuç, kabak, bezelye, kereviz) yemeklik küpler halinde kesin; soğanı ince doğrayın.'),
(84, 2, 'Tencerede zeytinyağını ısıtın; soğanı 3-4 dakika kavurun.'),
(84, 3, 'Pişme süreleri uzun olan sebzeleri (havuç, patates) önce ekleyin; 3 dakika kavurun. Ardından yumuşak sebzeleri (kabak, bezelye) ilave edin.'),
(84, 4, 'Suyu ekleyin; kaynamaya başlayınca kısık ateşe alıp tuz ve karabiberi ilave edin. Tüm sebzeler yumuşayana kadar 20-25 dakika pişirin.'),
(84, 5, 'İstenirse bir kepçe çorbayı alıp blender ile pürüzsüz yapın ve geri ekleyerek kıvamı koyulaştırın; ya da tüm sebzeler tane tane kalacak şekilde çorba bırakın. Limon suyunu ekleyin.'),
(84, 6, 'Kaseye alın; üzerine zeytinyağı gezdirin ve taze maydanoz serpin. Yanında ekmekle sıcak servis edin.');
