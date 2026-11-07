import type en from "../en/pps";

const pps: typeof en = {
  "title": "Ürün sayfası SEO'su",
  "subtitle": "Ürünleri seçin; eksikleri bulup tamamlayalım. Hiçbir şey kaydedilmeden önce her şeyi siz inceler, düzenler ve onaylarsınız.",
  "fields": {
    "short_description": "Kısa açıklama",
    "description": "Ayrıntılı açıklama",
    "attributes": "Özellikler",
    "tags": "Ürün etiketleri",
    "faq": "SSS",
    "image_alts": "Görsel alt metinleri",
    "seo_title": "SEO başlığı",
    "meta_description": "Meta açıklaması",
    "focus_keyword": "Odak anahtar kelime",
    "category_link": "Kategori bağlantısı"
  },
  "status": {
    "pending": "Sırada",
    "analyzing": "Analiz ediliyor",
    "ready": "İlgilenilmeli",
    "skipped": "Sorun yok",
    "approved": "Gönderiliyor",
    "published": "Yayında",
    "failed": "Hata"
  },
  "source": {
    "seller": "Mağaza verileriniz",
    "ai": "Yapay zekâ önerisi",
    "user": "Sizin düzenlemeniz"
  },
  "stats": {
    "total": "Ürün",
    "issues": "Eksiği olan"
  },
  "quota": {
    "exhausted": "Ücretsiz plan kredilerinizin tamamını kullandınız",
    "freePlan": "Ücretsiz plan: {count} ürün",
    "used": "{total} üründen {used} tanesi kullanıldı",
    "remaining": "{count} kaldı",
    "upgrade": "Pro'ya geçerek tek seferde {count} ürüne kadar optimize edin.",
    "upgradeMore": "Daha fazlasını seçmek için Pro'ya geçin",
    "selectionsUsed": "Ücretsiz plandaki tüm seçim hakkınızı kullandınız.",
    "selectMore": "Ücretsiz planda {count} ürün daha seçebilirsiniz.",
    "perBatch": "Tek seferde en fazla {count} ürün."
  },
  "results": "Sonuçlar",
  "processing": "İşleniyor",
  "selectAllIssues": "İlgilenilmesi gerekenlerin tümünü seç",
  "selectProduct": "Seç: {name}",
  "deletedProduct": "Silinmiş ürün",
  "notFound": "Bulunamadı: {field}",
  "missing": "Eksik: {field}",
  "review": "İncele ve düzelt",
  "clearSelection": "Seçimi temizle",
  "start": "Optimizasyonu başlat",
  "selectAll": "Tümünü seç",
  "deselectAll": "Seçimi kaldır",
  "noProducts": "Henüz eşitlenmiş ürün yok.",
  "showMore": "Daha fazla göster",
  "preview": "Önizleme",
  "issuesFound": "Bu üründe eksik olanlar",
  "aiNotice": "Bu içerik yapay zekâ tarafından önerildi ve hata içerebilir. Onaylamadan önce gözden geçirin; değiştirmek istediğiniz her şey için “Düzenle”yi kullanın.",
  "sellerInput": "Bu alanları yalnızca siz doldurabilirsiniz",
  "verifyNumbers": "Bu rakamları kontrol edin",
  "verifyNumbersBody": "Bu rakamlar metinde geçiyor ancak mevcut ürün bilgilerinizde yok:",
  "selectAllFields": "Tüm alanları seç",
  "suggested": "Önerilen",
  "current": "Mevcut",
  "edited": "Düzenlendi",
  "unsaved": "Kaydedilmedi",
  "restore": "Geri yükle",
  "cancelEdit": "Düzenlemeyi iptal et",
  "unsavedHint": "Kaydedilmemiş düzenlemeleriniz var; “Sitenizde düzeltin”e tıkladığınızda otomatik olarak kaydedilir.",
  "approvedOnly": "Ürününüzde yalnızca onayladığınız alanlar güncellenir.",
  "saveEdits": "Düzenlemeleri kaydet ({count})",
  "fixOnSite": "Sitenizde düzeltin",
  "confirmDiscard": "Kaydedilmemiş değişiklikleriniz kaybolacak. Devam edilsin mi?",
  "noAttributes": "Henüz özellik yok.",
  "attrName": "Ad",
  "attrNameAria": "Özellik adı",
  "attrValue": "Değer",
  "attrValueAria": "Özellik değeri",
  "removeAttr": "Özelliği kaldır",
  "addAttr": "Özellik ekle",
  "tagsPlaceholder": "Etiketleri virgülle ayırın",
  "tagsHint": "Mevcut etiketleriniz korunur; bunlar onlara eklenir.",
  "removeQuestion": "Soruyu kaldır",
  "addQuestion": "Soru ekle",
  "altAria": "Görsel {index} için alt metin",
  "altHint": "Yalnızca alt metni olmayan görseller için gönderilir. Sitenizdeki mevcut alt metinler değişmez.",
  "formatHint": "Paragraflar arasında bir boş satır bırakın. Başlıklar: “## Başlık” veya “### Başlık” · Listeler: “- Madde”",
  "bulk": {
    "sending": "{total} üründen {done} tanesi gönderiliyor",
    "fixSelected": "Seçilenleri sitenizde düzeltin",
    "done": {
      "one": "{count} ürün onaylandı ve sitenize gönderiliyor",
      "other": "{count} ürün onaylandı ve sitenize gönderiliyor"
    },
    "failed": "{count} başarısız",
    "more": "…ve {count} tane daha",
    "confirmTitle": "Tüm düzeltmeler tek seferde uygulansın mı?",
    "confirmBody": "Bu {count} ürün için önerilen tüm alanlar (açıklamalar, özellikler, etiketler, SSS, görsel alt metinleri ve SEO ayarları) tek tek incelenmeden doğrudan sitenize gönderilecek. İçerik yapay zekâ ile üretildiğinden, en azından birkaçını “İncele ve düzelt” ile kontrol etmenizi öneririz.",
    "confirm": "Onayla ve gönder"
  },
  "validation": {
    "attr": "Her özelliğin bir adı ve bir değeri olmalı.",
    "empty": "“{field}” boş bırakılamaz.",
    "tagsMax": "En fazla {max} etiket ekleyebilirsiniz.",
    "tagLength": "Her etiket en fazla {max} karakter olabilir.",
    "faq": "Her SSS maddesinin bir sorusu ve bir cevabı olmalı.",
    "faqLength": "Sorular en fazla {q}, cevaplar en fazla {a} karakter olabilir.",
    "altEmpty": "Alt metin boş bırakılamaz.",
    "altLength": "Her görselin alt metni en fazla {max} karakter olabilir.",
    "maxLength": "“{field}” en fazla {max} karakter olabilir."
  },
  "errors": {
    "results": "SEO sonuçları yüklenemedi.",
    "products": "Ürünleriniz yüklenemedi.",
    "start": "Optimizasyon başlatılamadı.",
    "preview": "Önizleme yüklenemedi.",
    "noFields": "Gönderilecek alan yok.",
    "restore": "Geri yüklenemedi.",
    "noneSelected": "Seçili alan yok.",
    "submit": "Değişiklikler gönderilemedi."
  }
};

export default pps;
