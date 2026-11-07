import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Aramayı temizle",
  "errors": {
    "server": "Sunucuya ulaşılamadı. Lütfen tekrar deneyin.",
    "serverShort": "Sunucuya ulaşılamadı."
  },
  "styles": {
    "price": "Fiyat ve bütçe",
    "comparison": "Ürün karşılaştırması",
    "buying_guide": "Satın alma rehberi"
  },
  "steps": {
    "brief": "Analiz ve brif",
    "briefHint": "Ürünler ve hedef kitle inceleniyor",
    "plan": "Planlama",
    "planHint": "Ürünler bölümlere dağıtılıyor",
    "sections": "Yazım",
    "sectionsHint": "Her seferinde bir bölüm",
    "written": "{total} bölümden {done} tanesi yazıldı"
  },
  "idea": {
    "internalLink": "İç bağlantı",
    "viewProgress": "İlerlemeyi gör",
    "generated": "Makale hazır",
    "failed": "Yazım başarısız oldu",
    "viewRetry": "Görüntüle ve tekrar dene",
    "paused": "Duraklatıldı (kredi bitti)"
  },
  "outline": {
    "title": "Makale taslağı",
    "building": "Taslak oluşturuluyor…",
    "approxWords": "≈ {count} kelime",
    "written": "{total} bölümden {done} tanesi yazıldı",
    "untitled": "Başlıksız",
    "target": "Hedef: {count} kelime",
    "keyPoints": "Önemli noktalar",
    "types": {
      "product": "Ürün tanıtımı",
      "products": "Ürün tanıtımları",
      "comparison": "Karşılaştırma",
      "buyingGuide": "Satın alma rehberi",
      "guide": "Rehber"
    }
  },
  "editIdea": {
    "subtitle": "Makalenin başlığını, ürünlerini ve iç bağlantısını belirleyin.",
    "titleHint": "Ana anahtar kelimeyi başa koyun. {max} karakterden kısa başlıklar Google'da tam görünür.",
    "products": "Makaledeki ürünler",
    "needProduct": "En az bir ürün ekleyin.",
    "removeProduct": "Kaldır: {name}",
    "changeProducts": "Ürün ekle veya değiştir",
    "link": "İç bağlantı",
    "linkHint": "Makale bu mağaza sayfasına bağlantı verecek; tercihen bu ürünlerin ana kategorisi.",
    "categoriesError": "Kategorileriniz yüklenemedi; mevcut bağlantı korunuyor.",
    "missingCategory": "Mevcut bağlantının kategorisi artık yok. Lütfen başka bir kategori seçin.",
    "pickTitle": "Makalenin ürünlerini seçin",
    "pickSubtitle": "Bu makalede öne çıkarılacak ürünler.",
    "pickConfirm": "Bu ürünleri kullan"
  },
  "category": {
    "filterPrefix": "Kategori:",
    "linkPrefix": "Bağlantı:",
    "all": "Tüm kategoriler",
    "home": "Mağaza ana sayfası",
    "filterNote": "Bir kategori seçtiğinizde alt kategorilerindeki ürünler de dahil edilir.",
    "linkNote": "Makale bu sayfaya bağlantı verecek.",
    "none": "Kategori yok",
    "select": "Kategori seçin",
    "search": "Kategori ara",
    "searchPlaceholder": "Kategori ara…",
    "empty": "Kategori bulunamadı",
    "emptyHint": "Başka bir arama deneyin.",
    "collapse": "Alt kategorileri gizle",
    "expand": "Alt kategorileri göster",
    "removeFilter": "Kategori filtresini kaldır",
    "backHome": "Mağaza ana sayfasına dön"
  },
  "picker": {
    "loadFailed": "Ürünleriniz yüklenemedi.",
    "addFailed": "Bu ürün eklenemedi.",
    "alreadySelected": "Bu ürün zaten seçili.",
    "addedAtLimit": "Ürün eklendi ama seçim limitine ulaştınız. Bir ürünü kaldırıp bunu listeden seçin.",
    "existingSelected": "Bu ürün kataloğunuzda zaten vardı; şimdi seçildi.",
    "addedSelected": "Ürün eklendi ve seçildi.",
    "manualTitle": "Bağlantıyla ürün ekle",
    "manualHint": "Bir ürünü bulamıyor musunuz? Eklemek ve seçmek için sayfa adresini yapıştırın.",
    "manualBody": "Ürün sayfasının adresini mağazanızdan kopyalayıp buraya yapıştırın. Bilgileri alıp ürünü sizin için seçeriz.",
    "closeManual": "Kapat",
    "url": "Ürün adresi",
    "add": "Ekle",
    "search": "Ürün ara",
    "searchPlaceholder": "Ürün adına göre ara…",
    "selected": "Seçilen ürünler",
    "limit": "limite ulaşıldı",
    "count": "{max} üründen {count} tanesi seçildi",
    "clear": "Temizle",
    "empty": "Ürün bulunamadı",
    "emptyHint": "Başka bir arama veya kategori deneyin.",
    "more": "Daha fazla ürün yükle"
  },
  "modal": {
    "title": "Ürün makalenizin nasıl yazılacağını seçin",
    "imageModel": "Öne çıkan görsel modeli",
    "featuredImage": "Öne çıkan görsel",
    "articlePromptPlaceholder": "ör. Ürünün faydalarına odaklan, samimi bir dil kullan ve sonuna bir SSS ekle",
    "imagePromptPlaceholder": "ör. Sabahın yumuşak ışığında ahşap bir masanın üzerindeki ürün"
  },
  "body": {
    "saveFailed": "Kaydedilemedi.",
    "product": "Ürün",
    "productNumber": "Ürün no. {id}",
    "inStock": "Stokta",
    "outOfStock": "Tükendi",
    "viewProduct": "İncele ve satın al",
    "recommended": "Önerilen ürünler",
    "seoScore": "SEO puanı: {score}",
    "writingSection": "Bu bölüm yazılıyor…",
    "noContent": "Henüz bir şey yazılmadı.",
    "schema": "Ürün şeması"
  },
  "seo": {
    "defaultPrompt": "Mağazanın en çok satan ürünlerine ve ana kategorilerine göre SEO makale fikirleri öner ve ürünler tavsiye et.",
    "manualPrompt": "Seçtiğim ürünler için SEO makale fikirleri öner.",
    "benefits": {
      "introTitle": "Ürünlerinizi tanıtın",
      "introText": "Ürünlerinizi alışveriş yapanlara tanıtan makaleler.",
      "googleTitle": "Google'da bulunun",
      "googleText": "Aramalardan mağazanıza daha fazla müşteri çekin.",
      "salesTitle": "Daha fazla satın",
      "salesText": "Okurları zahmetsizce müşteriye dönüştürün."
    },
    "heroTitle": "Ürünlerinizi satan makaleler · {store}",
    "yourStore": "mağazanız",
    "heroBody": "Bu araç mağazanızdaki ürünler için makaleler önerir ve yazar; ürünlerinizi tanıtan, Google'dan müşteri getiren ve satışlarınızı artıran makaleler.",
    "working": "Ürünlerinizi inceliyor ve fikirler hazırlıyorum. Bu genellikle bir dakikadan kısa sürer.",
    "editIdea": "Fikri düzenle (başlık, ürünler, iç bağlantı)",
    "backToIdeas": "Fikirlere dön",
    "selectionMethod": "Ürünler nasıl seçilsin",
    "auto": "Benim için seç",
    "manual": "Ürünleri seç",
    "autoHint": "En uygun ürünleri sizin için biz seçeriz.",
    "manualHint": "Fikirler yalnızca seçtiğiniz ürünleri kapsar.",
    "requestAria": "Makale fikirleri iste",
    "placeholderManual": "İsteğe bağlı: Makaleler hangi açıdan ele alınsın?",
    "placeholderAuto": "Nasıl bir makale istersiniz? (Boş bırakırsanız ben öneririm)",
    "generate": "Fikir al",
    "keyHint": "Göndermek için Enter · Yeni satır için Shift+Enter",
    "pickTitle": "Fikirleriniz için ürün seçin",
    "pickSubtitle": "Makale fikirleri yalnızca burada seçtiğiniz ürünler için oluşturulur.",
    "pickConfirm": "Onayla",
    "selectedCount": {
      "one": "{count} ürün seçildi",
      "other": "{count} ürün seçildi"
    },
    "requestIn": "İsteğiniz alındı; fikirleriniz yolda.",
    "errors": {
      "slow": "Fikirler her zamankinden uzun sürüyor. Lütfen tekrar deneyin.",
      "open": "Bu sohbet açılamadı.",
      "create": "Yeni sohbet başlatılamadı."
    }
  },
  "page": {
    "preparing": "Ürün makaleniz hazırlanıyor…"
  }
};

export default product;
