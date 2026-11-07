import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Görüntüle",
  "noResults": "Aramanızla eşleşen sonuç yok.",
  "page": {
    "title": "Makale paneli",
    "subtitle": "Yapay zekâ asistanınızın bu sitede yaptıkları",
    "noSiteTitle": "Henüz site eklenmedi",
    "noSiteBody": "Fikirleri, makaleleri ve otomatik pilot etkinliğini görmek için bir site ekleyin."
  },
  "errors": {
    "load": "Panel yüklenemedi.",
    "network": "Bağlantı sorunu nedeniyle panel yüklenemedi.",
    "autopilot": "Otomatik pilot güncellenemedi.",
    "ideas": "Fikirler oluşturulurken bir sorun oluştu.",
    "invalidSite": "Bu site bağlantısı geçersiz.",
    "ideasLoad": "İçerik fikirleri yüklenemedi.",
    "writtenLoad": "Yazılan makaleler yüklenemedi.",
    "publishedLoad": "Yayınlanan makaleler yüklenemedi.",
    "keywordsLoad": "Anahtar kelimeler yüklenemedi."
  },
  "articleStatus": {
    "completed": "Tamamlandı",
    "failed": "Başarısız",
    "pending": "Sırada",
    "generating": "Yazılıyor…"
  },
  "ideaStatus": {
    "approved": "Onaylandı",
    "rejected": "Reddedildi",
    "used": "Kullanıldı",
    "recommended": "Önerilen"
  },
  "publishStatus": {
    "published": "Yayında",
    "draft": "Taslak",
    "failed": "Başarısız"
  },
  "stats": {
    "totalArticles": "Toplam makale",
    "published": "Yayınlanan",
    "generating": "Hazırlanıyor",
    "failed": "Başarısız",
    "avgSeo": "Ort. SEO puanı",
    "totalWords": "Yazılan kelime"
  },
  "recent": {
    "title": "Son makaleler",
    "empty": "Henüz makale yok.",
    "publishedOn": "Yayın tarihi: {date}"
  },
  "connection": {
    "checking": "Site bağlantınız kontrol ediliyor…",
    "switchBack": "Geri dön: {platform}",
    "connectVia": "Bunun yerine bağla: {platform}",
    "apiTitle": "Herkese açık API ile bağlanın",
    "apiBody": "WordPress veya Shopify olmadan da kendi uygulamanızdan makale oluşturup okuyun. Eksiksiz dokümantasyon, kod örnekleri ve API anahtarı rehberi.",
    "docs": "Doküman",
    "platform": "Yayın platformu",
    "comingSoon": "Yakında",
    "soon": "yakında"
  },
  "opportunities": {
    "title": "Yeni fırsatlar",
    "discovering": "Aranıyor…",
    "discover": "Yeni fırsatlar bul",
    "empty": "Henüz fırsat yok. Başlamak için “Yeni fırsatlar bul”a tıklayın.",
    "generatedHint": "Makale hazır; makale listenizde bulabilirsiniz",
    "generated": "Yazıldı",
    "generate": "Makale yaz",
    "keywords": "Bulunan anahtar kelimeler",
    "entities": "Belirlenen konular"
  },
  "opportunitiesPage": {
    "title": "İçerik fırsatları",
    "subtitle": "Siteniz için seçilen makale fikirleri",
    "topic": "Konu",
    "entity": "Ana varlık",
    "competitor": "Rekabet",
    "search": "Konu veya varlık arayın…",
    "empty": "Henüz içerik fikri yok."
  },
  "gap": {
    "uncovered": "Henüz işlenmedi",
    "covered": "Zaten işlendi",
    "reviewing": "İnceleniyor"
  },
  "columns": {
    "title": "Makale başlığı",
    "keyword": "Hedef anahtar kelime",
    "words": "Kelime",
    "status": "Durum",
    "publishStatus": "Yayın durumu",
    "date": "Tarih",
    "url": "Yayın adresi"
  },
  "written": {
    "title": "Yazılan makaleler",
    "subtitle": "Otomatik pilotun bugüne kadar siteniz için yazdıkları",
    "empty": "Henüz makale yazılmadı."
  },
  "published": {
    "title": "Yayınlanan makaleler",
    "subtitleShort": "Asistanınızın tüm yayın denemeleri",
    "subtitle": "Asistanınızın tüm yayın denemeleri: yayınlanan, taslak olarak kaydedilen veya başarısız olan",
    "empty": "Henüz hiçbir şey yayınlanmadı.",
    "errorDetails": "Hata ayrıntılarını göster"
  },
  "keywords": {
    "title": "Anahtar kelimeler",
    "subtitle": "Otomatik pilotun siteniz için bulduğu anahtar kelimeler",
    "keyword": "Anahtar kelime",
    "primary": "Ana",
    "difficulty": "Zorluk",
    "analyzing": "Anahtar kelime bulmak için sitenizi analiz ediyoruz. Bu biraz sürebilir…",
    "empty": "Henüz anahtar kelime bulunamadı."
  },
  "difficulty": {
    "Low": "Kolay",
    "Medium": "Orta",
    "High": "Zor",
    "Unknown": "Bilinmiyor"
  },
  "agent": {
    "status": {
      "idle": "Beklemede",
      "working": "Çalışıyor",
      "generatingIdeas": "Fikir üretiyor",
      "writing": "Makale yazıyor",
      "waitingIdeas": "Puanlanmış fikirleri bekliyor",
      "dailyLimit": "Günlük limite ulaşıldı",
      "needsAnalysis": "Önce site analizi gerekiyor",
      "unknown": "Bilinmiyor"
    },
    "features": {
      "research": "Rakip ve anahtar kelime araştırması",
      "daily": "Her gün yeni fikirler ve makaleler",
      "autoPublish": "Otomatik yayınlama",
      "scheduling": "Akıllı zamanlama",
      "wordpress": "Tek tıkla WordPress'te yayınlama"
    },
    "pipeline": {
      "badge": "İçerik akışı",
      "intro": "Otomatik pilot bu dört adımı sırayla tamamlar; sizin hiçbir şey yapmanıza gerek kalmaz.",
      "keywordsTitle": "Anahtar kelimeleri bul",
      "keywordsDesc": "Sitenizi tarar ve önemli anahtar kelimeleri belirler",
      "ideasTitle": "Fikirleri planla",
      "ideasDesc": "Her fırsatı bir makale fikrine dönüştürür",
      "writeTitle": "Makaleleri yaz",
      "writeDesc": "Eksiksiz ve SEO uyumlu makaleler yazar",
      "publishTitle": "Yayınla",
      "publishDesc": "Makaleleri WordPress sitenizde yayınlar"
    },
    "stats": {
      "keywords": "Bulunan anahtar kelime",
      "opportunities": "Bulunan fırsat",
      "written": "Yazılan makale",
      "published": "Yayınlanan makale"
    },
    "locked": {
      "badge": "Pro özelliği",
      "title": "Pro ile SEO'nuz otomatik pilotta",
      "body": "Sitenizi 7/24 izler, rakipleri ve anahtar kelimeleri araştırır, ardından SEO uyumlu makaleleri sizin için yazıp yayınlar.",
      "cta": "Pro'ya geç"
    },
    "enableTitle": "Otomatik pilotu aç",
    "enable": "Aç",
    "enabling": "Açılıyor…",
    "onTitle": "Otomatik pilot açık",
    "settings": "Ayarlar"
  },
  "settings": {
    "title": "Otomatik pilot ayarları",
    "publishStatus": "Makale hazır olduğunda",
    "publishHint": "Makaleler yazılır yazılmaz yayına alınır.",
    "draftHint": "Makaleler siz inceleyip yayınlayana kadar taslak olarak kalır.",
    "publishOptions": {
      "draft": "Taslak olarak kaydet",
      "publish": "Otomatik yayınla"
    },
    "perCycle": "Döngü başına makale",
    "perCycleHint": "Her döngüde yazılacak makale sayısı.",
    "schedule": "Sıklık",
    "scheduleHint": "Otomatik pilot ne sıklıkla çalışsın?",
    "customInterval": "Kaç günde bir",
    "customIntervalHint": "Örneğin 5, beş günde bir anlamına gelir.",
    "startTime": "Başlangıç saati",
    "startTimeHint": "Otomatik pilot bu saatte çalışmaya başlar.",
    "sectionCount": "Makale uzunluğu",
    "sectionCountHint": "Her makalenin genel yapısını belirler.",
    "sections": {
      "short": "6–8 bölüm (kısa)",
      "medium": "8–10 bölüm (orta)",
      "long": "10–12 bölüm (uzun)"
    },
    "intervalOptions": {
      "d1": "Her gün",
      "d2": "İki günde bir",
      "d3": "Üç günde bir",
      "d7": "Haftada bir",
      "custom": "Özel"
    },
    "interval": {
      "everyDay": "her gün",
      "everyOtherDay": "iki günde bir",
      "everyWeek": "haftada bir",
      "everyNDays": "{days} günde bir"
    },
    "preview": {
      "short": "Programınız: {interval} {count} makale",
      "publish": "Başlangıç saati {time}: otomatik pilot {interval} {count} makale yazar ve otomatik olarak yayınlar.",
      "draft": "Başlangıç saati {time}: otomatik pilot {interval} {count} makale yazar ve incelemeniz için taslak olarak kaydeder.",
      "publishWithImages": "Başlangıç saati {time}: otomatik pilot {interval} her biri {images} görselli {count} makale yazar ve otomatik olarak yayınlar.",
      "draftWithImages": "Başlangıç saati {time}: otomatik pilot {interval} her biri {images} görselli {count} makale yazar ve incelemeniz için taslak olarak kaydeder."
    },
    "articleModel": "Yazım modeli",
    "imagesTitle": "Makaleleriniz için görseller",
    "imageModel": "Görsel modeli",
    "imagesPerArticle": "Makale başına görsel",
    "perImage": "görsel başına",
    "perArticle": "makale başına",
    "credits": "{count} kredi",
    "recommended": "Önerilen",
    "decrease": "Azalt",
    "increase": "Artır",
    "advanced": "Gelişmiş",
    "advancedHint": "Makaleler ve görseller için kendi talimatlarınız (isteğe bağlı)",
    "articlePrompt": "Makale talimatı",
    "articlePromptHint": "Boş bırakırsanız makaleler her zamanki gibi yazılır.",
    "articlePromptPlaceholder": "ör. Yeni başlayanlara yönelik samimi ve rahat bir dil",
    "imagePrompt": "Öne çıkan görsel talimatı",
    "imagePromptHint": "Boş bırakırsanız istem makaleye göre oluşturulur.",
    "imagePromptPlaceholder": "ör. Sıcak renkler, görselde yazı olmasın",
    "summary": "Özet",
    "save": "Ayarları kaydet"
  },
  "wp": {
    "title": "WordPress bağlantısı",
    "subtitle": "Makaleleri doğrudan WordPress sitenizde yayınlayın",
    "status": {
      "connected": "Bağlı",
      "pending": "Kurulum bekleniyor",
      "disconnected": "Bağlı değil"
    },
    "health": {
      "healthy": "Sorunsuz",
      "unhealthy": "Hata",
      "unreachable": "Erişilemiyor"
    },
    "verified": "WordPress.org'da listeleniyor",
    "shownOnce": "Yalnızca bir kez gösterilir",
    "copy": "Kopyala: {label}",
    "downloadLatest": "Eklentinin son sürümünü indir",
    "plugin": "WordPress eklentisi",
    "pluginBody": "Eklentiyi sitenize kurun. Bağlantı kurulduğunda makaleler sizin için yazılır ve yayınlanır.",
    "download": "Eklentiyi indir",
    "credentials": {
      "title": "Bağlantı bilgileriniz",
      "body": "Bu üç değeri sitenizdeki eklenti ayarlarına yapıştırın; otomatik yayın için gereken tek şey bu.",
      "warning": "Bu pencereyi kapattıktan sonra Client Secret bir daha gösterilmez. Kaybederseniz yeni bilgiler almak için “Yeniden bağlan”ı kullanın.",
      "done": "Kaydettim"
    },
    "checking": "Bağlantı kontrol ediliyor…",
    "empty": "Henüz bağlı bir WordPress sitesi yok",
    "emptyBody": "Bağlandığınızda, sitenizdeki WordPress eklentisine gireceğiniz bir Client ID ve Client Secret alırsınız.",
    "connect": "WordPress'i bağla",
    "waiting": "WordPress eklentisinin bağlanması bekleniyor",
    "waitingBody": "Kurulumu tamamlamak için Client ID, API Key ve Client Secret bilgilerini eklenti ayarlarına girin. Bilgileri kaybettiyseniz yenilerini almak için “Yeniden bağlan”a tıklayın.",
    "check": "Bağlantıyı kontrol et",
    "newCredentials": "Yeni bilgiler oluştur",
    "siteUrl": "Site adresi",
    "versions": "WordPress / eklenti sürümü",
    "pluginVersion": "eklenti {version}",
    "healthTitle": "Durum",
    "lastCheck": "Son kontrol",
    "test": "Bağlantıyı test et",
    "reconnect": "Yeniden bağlan",
    "disconnect": "Bağlantıyı kes",
    "disconnected": "WordPress bağlantısı kesildi",
    "testOk": "Her şey yolunda; WordPress sitenize erişilebiliyor.",
    "testBad": "WordPress siteniz beklendiği gibi yanıt vermedi.",
    "confirmReconnectTitle": "Yeni bağlantı bilgileri oluşturulsun mu?",
    "confirmReconnectBody": "Mevcut bilgileriniz geçersiz olur ve yenilerini WordPress eklentisine girmeniz gerekir.",
    "confirmDisconnectTitle": "WordPress bağlantısı kesilsin mi?",
    "confirmDisconnectBody": "Makaleler artık bu sitede otomatik olarak yayınlanmaz. Yeniden bağlanmak için kurulumu tekrarlamanız gerekir.",
    "errors": {
      "load": "WordPress bağlantınız kontrol edilemedi.",
      "loadNetwork": "WordPress kontrol edilirken bağlantı sorunu oluştu.",
      "connect": "WordPress'e bağlanılamadı.",
      "reconnect": "Yeniden bağlanılamadı.",
      "disconnect": "Bağlantı kesilemedi.",
      "testNetwork": "Test sırasında bağlantı sorunu oluştu."
    }
  },
  "mixin": {
    "title": "Mixin bağlantısı",
    "subtitle": "Makaleleri doğrudan Mixin mağazanızda yayınlayın",
    "connected": "Mixin bağlandı",
    "disconnected": "Mixin bağlantısı kesildi",
    "testOk": "Her şey yolunda; Mixin'e erişilebiliyor.",
    "testBad": "Mixin beklendiği gibi yanıt vermedi.",
    "changeIntro": "Yeni bir token girin. Kaydetmeden önce test ederiz; test başarısız olursa mevcut token'ınız geçerli kalır.",
    "connectIntro": "Mixin token'ınızı girin. Kaydetmeden önce mağazanızla bağlantıyı test eder, sorun varsa size haber veririz.",
    "siteUrl": "Mağaza adresi",
    "currentToken": "Mevcut token",
    "token": "Mixin token'ı",
    "tokenShort": "Token",
    "newToken": "Yeni token",
    "tokenPlaceholder": "Token'ınızı buraya yapıştırın",
    "newTokenPlaceholder": "Yeni token'ınızı buraya yapıştırın",
    "hideToken": "Token'ı gizle",
    "showToken": "Token'ı göster",
    "testing": "Bağlantı test ediliyor…",
    "testAndConnect": "Test et ve bağla",
    "changeToken": "Token'ı değiştir",
    "confirmTitle": "Mixin bağlantısı kesilsin mi?",
    "confirmBody": "Makaleler artık Mixin'de otomatik olarak yayınlanmaz. Yeniden bağlanmak için token'ınızı tekrar girmeniz gerekir.",
    "errors": {
      "load": "Mixin bağlantınız kontrol edilemedi.",
      "loadNetwork": "Mixin kontrol edilirken bağlantı sorunu oluştu.",
      "tokenShort": "Lütfen token'ın tamamını yapıştırın.",
      "connect": "Mixin'e bağlanılamadı. Mağaza adresini ve token'ı kontrol edin."
    }
  },
  "kwAnalysis": {
    "title": "Anahtar kelime bulucu",
    "steps": {
      "pending": "İstek alındı",
      "processing": "Google Trends verileri alınıyor",
      "selecting": "Yapay zekâ en iyi anahtar kelimeyi seçiyor",
      "done": "Sonuçlarınız hazırlanıyor"
    },
    "progress": "Anahtar kelimeler analiz ediliyor ({done}/{total} kontrol edildi)",
    "starting": "Başlatılıyor…",
    "note": "Not: Google Trends istekleri sınırladığı için her anahtar kelime bir dakikaya kadar sürebilir.",
    "processing": "Sürüyor…",
    "completed": "Tamamlandı",
    "failed": "Anahtar kelime analizi başarısız oldu",
    "finalBadge": "Anahtar kelimeniz",
    "suggestedTitle": "Önerilen başlık",
    "checked": "Kontrol edilen anahtar kelimeler ({count})",
    "finalSelection": "Seçilen",
    "fetched": "Veri alındı",
    "fetchError": "Veri alınamadı",
    "topQueries": "En çok yapılan ilgili aramalar",
    "risingQueries": "Yükselen aramalar",
    "noData": "Veri yok",
    "breakout": "Patlama yaptı",
    "backToAnalysis": "Site analizine dön",
    "errors": {
      "status": "Analiz durumu alınamadı.",
      "start": "Anahtar kelime analizi başlatılamadı.",
      "site": "Site bilgileri yüklenemedi."
    }
  },
  "shopify": {
    "title": "Shopify bağlantısı",
    "subtitle": "Blog makalelerini ve ürün SEO düzeltmelerini doğrudan Shopify mağazanızda yayınlayın",
    "connected": "Bağlı",
    "loadFailed": "Shopify bağlantısı yüklenemedi.",
    "connectedBanner": "Shopify mağazanız bağlandı. Ürünlerinizi şimdi içe aktarıyoruz.",
    "invalidShop": "Mağaza adresinizi girin, ör. magazaniz.myshopify.com.",
    "installFailed": "Shopify bağlantısı başlatılamadı. Lütfen tekrar deneyin.",
    "testOk": "Her şey yolunda — mağazanıza erişilebiliyor.",
    "testBad": "Shopify beklendiği gibi yanıt vermedi.",
    "disconnected": "Shopify mağazasının bağlantısı kesildi.",
    "disconnectFailed": "Mağazanın bağlantısı kesilemedi.",
    "store": "Mağaza",
    "storefront": "Vitrin",
    "connectedHelp": "Makaleler mağazanızın blogunda yayınlanır, onaylanan ürün düzeltmeleri Shopify ürünlerinizi günceller. Ürünleriniz her gece otomatik olarak senkronize edilir.",
    "confirmTitle": "Shopify bağlantısı kesilsin mi?",
    "confirmBody": "Sevof uygulaması mağazanızdan kaldırılacak. Yayınlanmış makaleler blogunuzda kalır.",
    "disconnecting": "Bağlantı kesiliyor…",
    "disconnect": "Bağlantıyı kes",
    "cancel": "İptal",
    "test": "Bağlantıyı test et",
    "notConfigured": "Shopify'da yayınlama bu sunucuda henüz kullanılamıyor. Lütfen destekle iletişime geçin.",
    "intro": "Mağaza adresinizi girin ve Shopify'da Sevof uygulamasını onaylayın. İşlem bitince buraya geri döneceksiniz.",
    "shopLabel": "Mağaza adresi",
    "shopHint": "myshopify.com adresiniz — Shopify yöneticisinde Ayarlar → Alan adları bölümünde bulabilirsiniz.",
    "redirecting": "Shopify açılıyor…",
    "connect": "Shopify'ı bağla",
    "permissions": "Sevof yalnızca blogunuza, ürünlerinize ve dosyalarınıza erişim ister. Uygulamayı istediğiniz zaman Shopify'dan kaldırabilirsiniz.",
    "pickTitle": "Shopify mağazanızı bağlayın",
    "pickBody": "Bu mağazanın ait olduğu Sevof sitesini seçin. Ardından uygulamayı Shopify'da onaylayacaksınız.",
    "noSites": "Sevof'ta henüz bir siteniz yok. Önce mağazanızın alan adını ekleyin, sonra buraya dönün.",
    "addSite": "Site ekle"
  }
};

export default dashboard;
