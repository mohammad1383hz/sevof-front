import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "API anahtarları",
    "subtitle": "Kendi uygulamanızı herkese açık API'ye bağlamak için bir anahtar oluşturun.",
    "docsLink": "API dokümantasyonu",
    "name": "Anahtar adı",
    "namePlaceholder": "ör. İçerik sunucusu",
    "create": "Anahtar oluştur",
    "creating": "Oluşturuluyor…",
    "created": "Anahtarınız hazır: “{name}”. Hemen kopyalayın; tamamı bir daha gösterilmeyecek.",
    "copy": "Kopyala",
    "copied": "Kopyalandı",
    "gotIt": "Anladım",
    "empty": "Henüz anahtar yok. İlk anahtarınızı yukarıdaki formdan oluşturun.",
    "cols": {
      "name": "Ad",
      "key": "Anahtar",
      "created": "Oluşturulma",
      "lastUsed": "Son kullanım",
      "site": "Site"
    },
    "active": "Etkin",
    "revoked": "İptal edildi",
    "revoke": "İptal et",
    "revokeConfirm": "“{name}” iptal edilsin mi? Bu anahtarı kullanan tüm uygulamaların erişimi anında kesilir.",
    "errors": {
      "load": "API anahtarlarınız yüklenemedi.",
      "loadNetwork": "API anahtarları yüklenirken bağlantı sorunu oluştu.",
      "create": "Anahtar oluşturulamadı.",
      "createNetwork": "Anahtar oluşturulurken bağlantı sorunu oluştu.",
      "revoke": "Anahtar iptal edilemedi.",
      "revokeNetwork": "Anahtar iptal edilirken bağlantı sorunu oluştu."
    },
    "sitesFailed": "Siteleriniz yüklenemedi.",
    "sitesLoading": "Yükleniyor…",
    "noSites": "Henüz site yok",
    "addSiteFirst": "Anahtar oluşturmak için önce bir site ekleyin.",
    "legacySite": "İlk site (eski anahtar)"
  },
  "docs": {
    "title": "API dokümantasyonu",
    "subtitle": "Uygulamanızı herkese açık API'ye bağlayın ve makalelerinizi yönetin.",
    "createKey": "API anahtarı oluştur",
    "auth": "Kimlik doğrulama",
    "authBody": "API anahtarınızı her istekte aşağıdaki iki biçimden biriyle gönderin. Anahtarlar “API anahtarları” sayfasında oluşturulur; her biri yalnızca bir kez gösterilir, bu yüzden güvenli bir yerde saklayın.",
    "orEquivalent": "Ya da aynı şekilde:",
    "unauthorized": "Anahtar yoksa, geçersizse veya iptal edildiyse {code} yanıtı alırsınız:",
    "baseUrl": "Temel URL",
    "endpoints": "Uç noktalar",
    "listArticles": "Bu anahtarın ait olduğu sitenin makalelerini en yeniden başlayarak listeler.",
    "showArticle": "Bir makaleyi bölümleri ve banner'ı ile birlikte eksiksiz döndürür.",
    "createTask": "Bir makale oluşturma görevi açar ve arka planda başlatır.",
    "taskStatus": "Bir makale oluşturma görevinin durumunu döndürür. Görev tamamlandığında yanıtta article_id yer alır.",
    "notes": "Bilmeniz gerekenler",
    "note1": "Bir anahtar yalnızca ait olduğu sitenin makalelerine erişebilir.",
    "note2": "Bir anahtarı iptal ettiğinizde erişimi hemen kesilir.",
    "note3": "Makale oluşturmak için bir görev açın ve tek bir uzun isteği beklemek yerine durumunu düzenli aralıklarla (örneğin 30 saniyede bir) sorgulayın."
  }
};

export default developer;
