# Proje Yapısı Açıklaması

```
/project
│
├── /backend          ← API burada olur
│   ├── /config       ← DB bağlantı vs
│   ├── /controllers  ← istekleri karşılar
│   ├── /models       ← veritabanı işlemleri
│   ├── /services     ← iş mantığı
│   ├── /routes       ← endpoint tanımları
│   ├── /middlewares  ← auth kontrol
│   ├── index.js      ← giriş noktası
│
├── /frontend         ← admin panel / site
│   ├── /admin
│   ├── /user
│   ├── index.html
│
```

## Açıklamalar
- **backend/**: Sunucu tarafı kodları ve API.
  - **config/**: Veritabanı ve genel ayarlar.
  - **controllers/**: İstekleri karşılayan fonksiyonlar.
  - **models/**: Veritabanı işlemleri.
  - **services/**: İş mantığı (servis katmanı).
  - **routes/**: API endpoint tanımları.
  - **middlewares/**: Orta katman (ör. auth).
  - **index.js**: Sunucu giriş noktası.
- **frontend/**: Kullanıcı arayüzü.
  - **admin/**: Admin paneli.
  - **user/**: Kullanıcıya özel sayfalar.
  - **index.html**: Ana giriş noktası.
