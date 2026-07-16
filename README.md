# 🌴 Tatil Harcama Takip

Tatil grubunun ortak harcamalarını takip eden, **GitHub Pages** üzerinde çalışan statik web uygulaması.

## 🚀 Sayfalar

| Sayfa | Açıklama |
|-------|----------|
| `index.html` | Herkesin görebileceği genel görüntüleme sayfası |
| `admin.html` | Harcama ekleme, düzenleme ve yönetim paneli |

## 💡 Nasıl Çalışır?

1. **Admin** → `admin.html` sayfasında harcamaları ekler/düzenler
2. **Dışa Aktar** butonu ile `data.json` indirilir
3. `data.json` GitHub'a commit edilir
4. **Herkes** → `index.html` üzerinden güncel verileri görür

> `index.html` her yüklendiğinde `data.json`'ı önbelleksiz olarak çeker.

## 🏗️ Dosya Yapısı

```
/
├── index.html    → Genel görüntüleme (herkes okuyabilir)
├── admin.html    → Veri girişi ve yönetim
├── data.json     → Tüm harcama verileri (repo'ya commit edilir)
├── style.css     → Ortak tasarım sistemi
└── README.md
```

## 💰 Özellikler

- **İki para birimi**: ₺ Türk Lirası ve € Euro ayrı ayrı takip edilir
- **Esnek paylaşım**: Kişi bazlı özel pay, eşit bölüşüm veya aile bazlı bölüşüm
- **Otomatik bakiye**: Kim kime ne kadar borçlu hesaplanır
- **Minimum ödeme**: En az sayıda transferle borçlar kapatılır
- **Önbelleksiz**: Sayfayı yenilediğinizde hep güncel veriyi görürsünüz

## 👨‍👩‍👧 Kişi Tipleri

- **adult** (Yetişkin): Tam ücret
- **child** (Çocuk): İndirimli/ücretsiz yerler için pay farkı girilebilir

## 🖥️ Yerel Geliştirme

GitHub Pages dışında test için basit bir HTTP sunucusu gerekir:

```bash
# Python ile
python -m http.server 8000

# Node.js ile
npx serve .
```

Ardından `http://localhost:8000` adresini açın.
