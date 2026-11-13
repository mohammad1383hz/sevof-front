import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "Analiz tamamlanamadı",
  "phase": {
    "queued": "İstek alındı",
    "crawling": "Sitenizin sayfaları okunuyor…",
    "analyzing": "İçeriğiniz analiz ediliyor…",
    "done": "Analiz tamamlandı"
  },
  "ideaSteps": {
    "connecting": "Veri kaynaklarına bağlanılıyor (Google Trends, Otomatik Tamamlama, SERP)",
    "keywords": "Ana konularınızla ilgili anahtar kelimeler puanlanıyor",
    "generating": "Yapay zekâ makale fikirleri üretiyor",
    "scoring": "Rekabet değerlendiriliyor ve SEO puanları hesaplanıyor"
  },
  "empty": {
    "title": "Sitenizi analiz edin",
    "body": "Aşağıya bir alan adı girin; sektörünüzü belirleyelim, içeriğinizi özetleyelim ve işlediğiniz ana konuları (varlıkları) çıkaralım.",
    "tagEntities": "Varlık analizi",
    "tagIdeas": "Makale fikirleri"
  },
  "input": {
    "placeholder": "ornek.com — sitenizin adresi",
    "submit": "Analiz et"
  },
  "progress": {
    "title": "İşleniyor",
    "inProgress": "Sürüyor…",
    "done": "Tamam",
    "hint": "Bu genellikle birkaç dakika sürer."
  },
  "ideasBar": {
    "limit": "Fikir üretme limitinize ulaştınız",
    "generating": "Yazılıyor…",
    "cta": "Makale fırsatlarını bul"
  },
  "ideas": {
    "ready": {
      "one": "{count} fikir hazır",
      "other": "{count} fikir hazır"
    },
    "preparing": "Hazırlanıyor…",
    "generatingTitle": "Makale fikirleri üretiliyor",
    "retrying": "Yeniden deneniyor…",
    "retry": "Tekrar dene"
  },
  "chat": {
    "yourRequest": "İsteğiniz",
    "preparingIdeas": "Siteniz için fikirler hazırlanıyor…",
    "articleHeader": "Bu sohbette makale yazılıyor",
    "assistant": "İçerik stratejisi asistanı",
    "selectedEntity": "Odak konu: {name}",
    "preparing": "Yeni sohbet başlatılıyor…"
  },
  "research": {
    "failed": "İçerik araştırması tamamlanamadı",
    "clustersTitle": "Anahtar kelime kümeleri oluşturuluyor",
    "gapsTitle": "Rakipler ve içerik boşlukları analiz ediliyor",
    "clusters": "Anahtar kelime kümeleri",
    "gapsResult": "İçerik boşlukları ve rakip analizi",
    "clusterSteps": {
      "read": "Sitenizin konuları ve anahtar kelimeleri okunuyor",
      "build": "Aramalar kümelere ayrılıyor",
      "estimate": "Fırsatlar ve trendler tahmin ediliyor"
    },
    "gapSteps": {
      "context": "İşletmeniz anlaşılıyor",
      "competitors": "Gerçek rakipleriniz bulunuyor",
      "gaps": "İçerik boşlukları tespit ediliyor"
    },
    "intent": {
      "informational": "Bilgi amaçlı",
      "commercial": "Ticari",
      "transactional": "İşlem amaçlı",
      "navigational": "Yönlendirme amaçlı"
    },
    "coverage": {
      "missing": "Google sonuçlarında yok",
      "weak": "Sıralaması zayıf",
      "low": "Sıralaması düşük"
    },
    "level": {
      "low": "düşük",
      "medium": "orta",
      "high": "yüksek"
    },
    "priority": {
      "high": "Yüksek öncelik",
      "medium": "Orta öncelik",
      "low": "Düşük öncelik"
    },
    "difficulty": {
      "unavailable": "Bu kaynakta mevcut değil",
      "estimated": "{score}/100 · yapay zekâ tahmini"
    },
    "volumeEstimate": "Yapay zekâ tahmini",
    "volumeObserved": "Gerçek gösterim",
    "trend": "Trend",
    "trendNeedsTwo": "Karşılaştırma için iki dönem gerekir",
    "trendUnavailable": "Trend tahmini yok",
    "stats": {
      "competitors": "Gerçek rakipler",
      "opportunities": "İçerik fırsatları",
      "avgScore": "Ort. fırsat puanı",
      "highThreat": "Yüksek tehdit oluşturan rakipler"
    },
    "strengths": "Sitenizin güçlü yanları",
    "weaknesses": "Geliştirebileceğiniz alanlar",
    "visibility": "Arama görünürlüğü",
    "depth": "İçerik derinliği",
    "opportunitiesTitle": "İçerik fırsatları (gerçek Google sonuçlarına göre sıralı)",
    "takeAction": "Harekete geç",
    "recommendedAction": "Önerilen yaklaşım",
    "competitorSites": "Rakip siteler ({count})",
    "rank": "Sıra: {rank}",
    "rankUnavailable": "Sıra bilinmiyor",
    "sharedKeywords": {
      "one": "{count} ortak anahtar kelime",
      "other": "{count} ortak anahtar kelime"
    },
    "moreDetails": "Daha fazla ayrıntı",
    "missing": "Sitenizde eksik olanlar",
    "recommendations": "Genel öneriler",
    "action": "Sonraki adım: {action}",
    "fullReport": "Tam araştırma raporunu aç",
    "opportunityScore": "Fırsat {score}/100",
    "threat": "Tehdit: {level}",
    "received": "Tamamdır! Araştırma sonuçları tam burada, bu sohbette görünecek."
  },
  "entities": {
    "title": "Bulunan konular",
    "empty": "Henüz konu bulunamadı."
  },
  "request": {
    "title": "İçerik analizi isteği",
    "body": "Yapay zekâ içeriğinizi ve rakiplerinizi inceleyerek yeni içerik fırsatları ortaya çıkarır"
  },
  "summary": {
    "title": "Analiz sonuçları",
    "industry": "Sektör: {niche}"
  },
  "user": {
    "start": "Bu siteyi analiz et"
  },
  "idea": {
    "edit": "Fikri düzenle",
    "editShort": "Düzenle",
    "save": "Değişiklikleri kaydet",
    "category": "Kategori:",
    "noLinks": "İç bağlantı bulunamadı",
    "linksLabel": "İç bağlantılar:",
    "linksHint": "Hazırlanan makale bu sayfalara bağlantı verecek",
    "viewArticle": "Makaleyi görüntüle",
    "viewArticleHint": "Bu fikirden yazılan makaleyi aç",
    "generatingHint": "Bu fikirden bir makale yazılıyor",
    "fields": {
      "title": "Başlık",
      "titlePlaceholder": "Fikrin başlığı",
      "hook": "Giriş cümlesi",
      "hookPlaceholder": "Okuru yakalayan bir açılış cümlesi",
      "meta": "Meta açıklaması",
      "metaPlaceholder": "Arama sonuçları için kısa bir özet",
      "tags": "Etiketler",
      "tagsHint": "(virgülle ayırın)",
      "tagsPlaceholder": "SEO, pazarlama, içerik",
      "links": "İç bağlantılar",
      "linkTitle": "Bağlantı metni",
      "related": "İlgili",
      "removeLink": "Bağlantıyı kaldır",
      "addLink": "İlgili bağlantı ekle",
      "outline": "Taslak",
      "outlineHint": "(her satıra bir başlık)"
    },
    "score": {
      "entity": "Konu uygunluğu",
      "intent": "Arama amacı",
      "business": "İş değeri",
      "serp": "Google'da rekabet fırsatı",
      "summary": "Özet:"
    },
    "errors": {
      "save": "Değişiklikleriniz kaydedilemedi. Lütfen tekrar deneyin."
    }
  },
  "gsc": {
    "connect": "Google Search Console'u bağla",
    "reconnect": "Google Search Console'u yeniden bağla",
    "title": "Google Search Console'dan canlı veriler",
    "body": "Gerçek sorgularınızı, gösterimlerinizi, tıklamalarınızı, TO ve sıralamalarınızı salt okunur erişimle içerik araştırmanıza katın.",
    "connected": "Hesap bağlı",
    "showProperties": "Doğrulanmış sitelerimi göster",
    "selectProperty": "Bir mülk seçin",
    "connectProperty": "Bu siteyi kullan",
    "lastSynced": "Son eşitleme: {date}",
    "noData": "Henüz veri yok.",
    "syncing": "Alınıyor…",
    "sync": "Şimdi eşitle",
    "impressions": "Gösterim",
    "clicks": "Tıklama",
    "topQueries": "Gösterime göre en iyi sorgular",
    "queryStats": "{impressions} gösterim · sıra {position}",
    "errors": {
      "start": "Google Search Console bağlantısı başlatılamadı.",
      "noProperties": "Bağlı Google hesabında doğrulanmış site yok. Sitenizin otomasyon panelinden bağlantıyı kesip doğru hesabı bağlayın.",
      "properties": "Search Console siteleriniz yüklenemedi.",
      "select": "Bu mülk bağlanamadı.",
      "sync": "Search Console eşitlemesi başlatılamadı.",
      "disconnect": "Search Console bağlantısı kesilemedi."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Makale konusu öner",
      "prompt": "Bu siteyle ilgili trendlere dayanan, somut ve uygulanabilir içerik fırsatları öner."
    },
    "gap": {
      "label": "Rakiplere göre içerik boşluğu analizi",
      "prompt": "Bu sitenin ilgili rakiplerini ve başlıca içerik boşluklarını analiz et. Her boşluk için neden önemli olduğunu ve tehdidin ne kadar büyük olduğunu açıkla, kapatmak için bir yaklaşım öner."
    },
    "limit": "Devam etmek için planınızı yükseltin.",
    "choosePath": "Araştırma türünü seçin",
    "gscConnect": "Search Console'u bağla",
    "connectGoogle": "Google hesabını bağla",
    "loadingSites": "Siteler yükleniyor…",
    "showSites": "Sitelerimi göster",
    "select": "Seç",
    "queriesReceived": "{count} sorgu alındı",
    "loadingData": "Veriler yükleniyor…",
    "readyToFetch": "Bağlandı, veri almaya hazır",
    "fetch": "Verileri al",
    "connectedQueries": "Search Console bağlı · {count} sorgu",
    "fetchingGsc": "Search Console'dan veriler alınıyor…",
    "gscConnected": "Search Console bağlı",
    "placeholder": "Bir soru sorun ya da neye ihtiyacınız olduğunu yazın…",
    "send": "Gönder"
  },
  "credits": {
    "banner": "İçerik asistanıyla sohbet için ücretsiz kredileriniz bitti. {still} Sohbete devam etmek için bir plan seçin.",
    "bannerStill": "Mevcut fikirlerinizden makale yazdırmaya devam edebilirsiniz.",
    "viewPlans": "Planları gör",
    "chatFree": "İçerik asistanıyla sohbet için ücretsiz kredileriniz bitti; yeni soru soramazsınız ama mevcut fikirlerinizden makale yazdırmaya devam edebilirsiniz. Sohbete devam etmek için abonelik sayfasından (/subscription) bir plan seçin.",
    "chatPaid": "İçerik asistanı için yeterli krediniz yok ama mevcut fikirlerinizden makale yazdırmaya devam edebilirsiniz. Abonelik sayfasından (/subscription) kredi yükleyin ya da planınızı yükseltin.",
    "shortFree": "Ücretsiz kredileriniz bitti. Devam etmek için abone olun.",
    "shortPaid": "Kredileriniz bitti. Kredi yükleyin ya da planınızı yükseltin.",
    "barFree": "İçerik asistanı için ücretsiz kredileriniz bitti. Devam etmek için abone olun.",
    "barPaid": "İçerik analizi için yeterli krediniz yok. Kredi yükleyin ya da planınızı yükseltin."
  },
  "entity": {
    "pick": "Bir konu seçin",
    "pickPrompt": "Doğru içerik fırsatlarını bulmak ve uygun iç bağlantıları kurmak için odaklanacağımız konuyu (varlığı) seçin.",
    "confirmed": "Harika, isteğiniz alındı! Sonuçlar yalnızca seçtiğiniz konuya odaklanacak ve her makale sitenizdeki ilgili sayfaya bağlantı verecek."
  },
  "gapPrompt": "Gerçek Google sonuçlarıyla karşılaştırılarak bulunan bu fırsat için bir içerik fikri ve planı oluştur:\nFırsat: {title}\nHedef sorgu: {query}\nAyrıntılar: {details}\nÖnerilen yaklaşım: {angle}",
  "gapLabel": "Harekete geç: {title}",
  "article": {
    "request": "Şu fikir için bir makale yaz: “{title}”.",
    "started": "Makale bu sohbette yazılıyor."
  },
  "nav": {
    "previous": "Önceki mesaj",
    "next": "Sonraki mesaj",
    "latest": "Son mesaja git",
    "latestShort": "Son"
  },
  "welcome": {
    "title": "SEO asistanı: {domain}",
    "hello": "Merhaba! Bu sitenin SEO asistanıyım: {domain}",
    "what": "Önemli anahtar kelimeleri araştırabilir, yeni içerik fırsatları bulabilir, rakiplerinizi inceleyebilir ve sitenizi büyütecek konular önerebilirim.",
    "ask": "SEO veya sitenizin içeriği hakkında bana her şeyi sorabilirsiniz."
  },
  "errors": {
    "saveMessage": "Bu mesaj kaydedilemedi.",
    "researchResults": "Araştırma sonuçları yüklenemedi.",
    "history": "Bu sohbetin geçmişi yüklenemedi.",
    "startSession": "Bu site için analiz sohbeti başlatılamadı.",
    "research": "İçerik araştırması isteği tamamlanamadı.",
    "opportunities": "İçerik fırsatları isteği tamamlanamadı.",
    "retry": "Yeniden deneme başarısız oldu.",
    "status": "Analiz durumu alınamadı.",
    "domainRequired": "ornek.com gibi bir alan adı girin.",
    "domainInvalid": "Yalnızca alan adını girin (http:// veya yol olmadan), örneğin ornek.com.",
    "addDomain": "Bu alan adı eklenemedi."
  }
};

export default analyze;
