# 🌴 Tatil Harcama Takip

Tatil grubunun ortak harcamalarını takip eden, yerel sunucu ve **GitHub Pages** üzerinde çalışan harcama yönetim uygulaması.

## 🚀 Hızlı Başlatma (Tek Tıkla)

Windows üzerinde **`baslat.bat`** dosyasına çift tıklayarak sistemi başlatabilirsiniz.
- Otomatik olarak yerel sunucuyu açar (`http://localhost:3000/admin.html`).
- Tarayıcıda yaptığınız **HER işlem** (ekleme, düzenleme, silme) anında ve doğrudan **`data.json`** dosyasına kaydedilir.
- Her kayıt öncesinde `data.backup.json` dosyasına otomatik yedek alınır.

Alternatif çalıştırma komutları:
```bash
# Node.js ile
node server.js

# Python ile
python server.py
```

## 📄 Sayfalar

| Sayfa | Açıklama |
|-------|----------|
| `index.html` | Herkesin görebileceği genel görüntüleme ve hesap özet sayfası |
| `admin.html` | Harcama ekleme, düzenleme, kişi yönetimi ve seyahat ayarları |

## 🏗️ Dosya Yapısı

```
/
├── baslat.bat        → Windows için tek tıkla başlatıcı
├── server.js         → Node.js yerel sunucusu (anında data.json'a kaydeder)
├── server.py         → Python yerel sunucusu (alternatif)
├── index.html        → Genel görüntüleme sayfası
├── admin.html        → Veri girişi ve yönetim paneli
├── data.json         → Tüm harcama verileri (canlı veritabanı dosyası)
├── data.backup.json  → Otomatik alınan en son güvenli yedek
├── style.css         → Ortak tasarım sistemi
└── README.md
```

## 💰 Özellikler

- **Anında Dosyaya Kayıt**: Yaptığınız hiçbir işlem kaybolmaz; doğrudan `data.json` dosyasına yazılır.
- **İki Para Birimi**: ₺ Türk Lirası ve € Euro ayrı ayrı takip edilir.
- **Esnek Paylaşım**: Kişi bazlı özel pay, eşit bölüşüm veya aile bazlı bölüşüm.
- **Otomatik Bakiye & Minimum Transfer**: Kimin kime ne kadar ödemesi gerektiği en az transfer sayısı ile hesaplanır.
- **Güvenli Önbellek**: Yenileme butonları verilerinizi asla silmez; her zaman diskteki en güncel veriyi çeker.
