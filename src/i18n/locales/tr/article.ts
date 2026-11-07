import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} kelime",
    "other": "{count} kelime"
  },
  "actions": {
    "chat": "Sohbet",
    "save": "Kaydet"
  },
  "steps": {
    "brief": "Brif",
    "briefHint": "Hedef kitle ve rakip araştırması",
    "outline": "Taslak",
    "outlineHint": "Yapının planlanması",
    "sections": "Yazım",
    "sectionsHint": "Bölüm bölüm",
    "meta": "Meta veriler ve SEO",
    "metaHint": "Başlık, özet ve SSS şeması",
    "review": "SEO incelemesi",
    "reviewHint": "Kontrol ve puanlama",
    "done": "Son makale",
    "doneHint": "Yayına hazır"
  },
  "status": {
    "generated": "Tamam",
    "pending": "Bekliyor"
  },
  "sectionType": {
    "introduction": "Giriş",
    "section": "Ana bölüm",
    "faq": "Sık sorulan sorular",
    "conclusion": "Sonuç"
  },
  "breakdown": {
    "intent_match": "Arama amacına uygunluk",
    "keyword_usage": "Anahtar kelime kullanımı",
    "entity_coverage": "Konu kapsamı",
    "completeness": "Bütünlük",
    "readability": "Okunabilirlik",
    "structure": "Yapı"
  },
  "target": {
    "title": "Makale başlığı",
    "meta_title": "SEO başlığı",
    "meta_description": "Meta açıklaması",
    "excerpt": "Özet",
    "general": "Tüm makale",
    "section": "Bölüm",
    "faq": "SSS",
    "article": "Tüm makale",
    "metaTitleLong": "SEO başlığı (meta title)",
    "metaDescriptionLong": "Meta açıklaması",
    "excerptLong": "Özet",
    "question": "Soru {index}"
  },
  "models": {
    "choose": "Yapay zekâ modeli seçin",
    "upgrade": "Pro modellerin kilidini açmak için planınızı yükseltin.",
    "nano": "Hızlı ve ekonomik",
    "mini": "Karmaşık düzenlemelerde daha isabetli",
    "luna": "En iyi yazım kalitesi ve en doğal üslup; en iyi sonuçlar için önerimiz."
  },
  "imageModels": {
    "flux": "Hızlı ve uygun fiyatlı; günlük makale görselleri için ideal.",
    "banana": "Etkileyici görsel kalite; yaratıcı ve çeşitli görseller için ideal.",
    "gpt": "İsteminize sadık kalır, ince ayrıntıları yakalar."
  },
  "styles": {
    "minimal": "Minimal",
    "infographic": "İnfografik",
    "conceptual": "Kavramsal",
    "realistic": "Gerçekçi",
    "product": "Ürün"
  },
  "editor": {
    "placeholder": "Bu bölümü yazın veya düzenleyin…"
  },
  "copy": {
    "failed": "Kopyalanamadı.",
    "failedRetry": "Kopyalanamadı. Lütfen tekrar deneyin."
  },
  "errors": {
    "request": "İstek tamamlanamadı.",
    "invalidResponse": "Sunucu beklenmedik bir yanıt gönderdi."
  },
  "error": {
    "paused": "Makale yazımı duraklatıldı",
    "pausedCredit": "Makale yazımı duraklatıldı: krediniz bitti",
    "savedCredit": "Merak etmeyin, tamamlanan her şey kaydedildi. Kredi yüklediğinizde kaldığı yerden devam eder.",
    "savedRetry": "Merak etmeyin, tamamlanan her şey kaydedildi. Tekrar denediğinizde kaldığı yerden devam eder.",
    "buyCredits": "Kredi satın al veya yenile",
    "resume": "Yazıma devam et"
  },
  "seo": {
    "title": "SEO incelemesi",
    "evaluating": "Makalenin tamamı brife göre kontrol ediliyor…",
    "failed": "SEO incelemesi tamamlanamadı (makaleniz hazır, yalnızca puanı yok).",
    "outOf100": "100 üzerinden",
    "overall": "Genel SEO puanı",
    "suggestions": "Geliştirme önerileri"
  },
  "image": {
    "featured": "Öne çıkan görsel",
    "failed": "Görsel oluşturulamadı",
    "noBlock": "Sorun değil; bu, makale metninin yazılmasını veya yayınlanmasını engellemez.",
    "creating": "Yapay zekâ bir istem yazıp öne çıkan görselinizi oluşturuyor…",
    "tip": "Daha kaliteli görseller için GPT Image veya Nano Banana'yı deneyin",
    "generating": "Yeni görsel oluşturuluyor…",
    "generatingShort": "Oluşturuluyor…",
    "closeEditor": "Düzenleyiciyi kapat",
    "retryPrompt": "Yeni bir istemle tekrar dene",
    "editPrompt": "İstemi düzenle ve yeniden oluştur",
    "promptPlaceholder": "İstediğiniz görseli tarif edin…",
    "modelLocked": "“{model}” modeli yalnızca Pro kullanıcılar içindir. Planlar sayfasına yönlendiriliyorsunuz…",
    "editLocked": "Görselleri düzenleme ve yeniden oluşturma bir Pro özelliğidir. Planlar sayfasına yönlendiriliyorsunuz…",
    "promptShort": "Bu istem çok kısa.",
    "assistant": "Görsel asistanı: istemi düzenleyip gönderin",
    "proOnly": "İstemi düzenleme ve görseli yeniden oluşturma Pro'da kullanılabilir.",
    "introExisting": "Bu görsel için kullanılan istem bu. Dilediğiniz gibi değiştirin:",
    "introNew": "Henüz istem yok. Görseli oluşturmak için bir istem yazın:",
    "submit": "Yeniden oluştur",
    "proOnlyShort": "Yalnızca Pro"
  },
  "meta": {
    "title": "SEO ayarları",
    "empty": "boş",
    "focusKeyword": "Odak anahtar kelime",
    "slug": "URL kısa adı (slug)",
    "slugHint": "Adresin URL kısmı; yalnızca küçük harf ve tire",
    "ogTitle": "Sosyal medya başlığı (og:title)",
    "ogDescription": "Sosyal medya açıklaması (og:description)"
  },
  "faq": {
    "title": "Sık sorulan sorular",
    "count": {
      "one": "{count} soru",
      "other": "{count} soru"
    },
    "question": "Soru",
    "answer": "Cevap",
    "saveFailed": "Bu soru kaydedilemedi."
  },
  "sections": {
    "title": "Makale bölümleri",
    "designing": "Brife göre taslak oluşturuluyor…",
    "none": "Taslak henüz oluşturulmadı.",
    "editManually": "Elle düzenle",
    "progress": "{total} bölümden {done} tamamlandı",
    "regenerate": "Bu bölümü yeniden yaz"
  },
  "banner": {
    "title": "Makale banner'ı",
    "designing": "Banner'ınız tasarlanıyor…",
    "failed": "Banner yeniden oluşturulamadı.",
    "failedRetry": "Banner yeniden oluşturulamadı. Lütfen tekrar deneyin.",
    "generationFailed": "Banner oluşturulamadı.",
    "regenerate": "Yeniden oluştur"
  },
  "brief": {
    "title": "Makale brifi",
    "analyzing": "Yapay zekâ hedef kitlenizi, arama amacını ve rakiplerin içeriğindeki boşlukları inceliyor…",
    "notYet": "Henüz oluşturulmadı.",
    "audience": "Hedef kitle",
    "tone": "Üslup",
    "length": "Hedef uzunluk",
    "goal": "Makalenin amacı",
    "mustCover": "Mutlaka işlenecek konular",
    "gaps": "Rakiplerin eksikleri (sizin avantajınız)",
    "linkPlan": "“{anchor}” · bölüm: “{section}”"
  },
  "chat": {
    "title": "Yapay zekâyla sohbet",
    "selectSection": "Bir bölüm seçin",
    "or": "ya da",
    "orDrag": "ya da bir bölümü buraya sürükleyin",
    "selectAll": "tüm makaleyi seçin",
    "useSelect": "“Bölüm seç” ile bir bölüm seçin",
    "drop": "Bu bölüm hakkında sohbet için bırakın",
    "dropHere": "Sohbete eklemek için buraya bırakın",
    "loading": "Sohbet yükleniyor…",
    "empty": "Bu makaleyle ilgili henüz sohbet yok.",
    "applied": "Uygulandı",
    "clearTarget": "Kaldır",
    "placeholder": "ör. Bu bölümü daha resmî ve kısa yap…",
    "placeholderShort": "ör. Bu bölümü daha resmî yap…",
    "placeholderEmpty": "Önce makaleden bir bölüm seçin ya da buraya bırakın",
    "selectFirst": "Önce bir bölüm seçin",
    "disabledUntilDone": "Sohbet, makale tamamlandığında açılır…",
    "waitForArticle": "Makale yazılıyor… Hazır olduğunda sohbet açılacak",
    "noCredits": "Planınız etkin değil ya da krediniz bitti.",
    "sendFailed": "Mesajınız gönderilemedi. Lütfen tekrar deneyin.",
    "sendAria": "Mesaj gönder",
    "previous": "Bu makaleyle ilgili önceki sohbetler ({count})",
    "loadingPrevious": "Önceki sohbetler yükleniyor…",
    "firstDraft": "İlk taslak",
    "draft": "Taslak {index}",
    "withAgent": "Asistanla sohbet et"
  },
  "final": {
    "article": "Makale",
    "ready": "Makaleniz hazır",
    "section": "Bölüm {index}",
    "waiting": "Bekliyor",
    "sectionFailed": "Bu bölüm yazılamadı.",
    "sectionTitle": "Bölüm başlığı",
    "saveFailed": "Makale kaydedilemedi.",
    "dragToChat": "Sohbete sürükleyin",
    "dragShort": "Sohbete sürükle",
    "dragArticle": "Tüm makaleyi sohbete sürükleyin",
    "dragSection": "Bu bölümü sohbete sürükleyin",
    "chatArticle": "Tüm makale hakkında sohbet et",
    "editArticle": "Tüm makaleyi düzenle",
    "copyMarkdown": "Markdown olarak kopyala"
  },
  "modal": {
    "title": "Makalenizin nasıl yazılacağını seçin",
    "subtitle": "Seçtiğiniz model makalenin kalitesini ve SEO'sunu belirler. En gelişmiş modeller Pro ile gelir.",
    "writingModel": "Yazım modeli",
    "writingModelDesc": "Bu model makalenin metnini ve yapısını yazar.",
    "images": "Makale görselleri",
    "imagesDesc": "Bu makale için görsel modelini ve kaç görsel oluşturulacağını seçin.",
    "qualityTip": "En iyi kalite için GPT Image veya Nano Banana kullanın",
    "imageCount": "Görsel sayısı",
    "upToImages": "En fazla {count} görsel oluşturun",
    "firstImage": "İlk görsel, öne çıkan görsel olur.",
    "sectionCount": "Bölüm sayısı",
    "rangePro": "Bu aralık Pro'da kullanılabilir",
    "sectionRange": "Makaleniz {min} ile {max} arasında bölümden oluşacak.",
    "advanced": "Gelişmiş (isteğe bağlı)",
    "advancedHint": "Görsel stili ve metin ile öne çıkan görsel için kendi talimatlarınız",
    "imageStyle": "Görsel stili",
    "infographicHint": "İnfografik için GPT Image veya Nano Banana gerekir",
    "articlePromptPlaceholder": "ör. Sohbet havasında, yeni başlayanlara yönelik, net bir sonuç bölümüyle",
    "imagePromptPlaceholder": "ör. Sabahın yumuşak ışığında, üzerinde dizüstü bilgisayar ve bir fincan kahve olan ahşap bir masa",
    "imagePromptHint": "Yukarıda seçtiğiniz stil bu görsele de uygulanır; yazı ve logo içermez.",
    "start": "Yazmaya başla"
  },
  "publish": {
    "connect": "{platform} bağlantısı kur",
    "notConnected": "Siteniz henüz {platform} ile bağlı değil.",
    "publishTo": "{platform} üzerinde yayınla",
    "updateOn": "{platform} üzerinde güncelle",
    "removeFrom": "{platform} üzerinden kaldır",
    "draftOn": "{platform} taslağı",
    "viewOn": "{platform} üzerinde görüntüle",
    "checking": "Bağlantı kontrol ediliyor…",
    "finishFirst": "Makale yayınlanmadan önce tamamlanmalı.",
    "whenReady": "Makale hazır olduğunda yayınlayabilirsiniz.",
    "publishing": "Yayınlanıyor…",
    "publish": "Yayınla",
    "updating": "Güncelleniyor…",
    "updated": "Güncellendi",
    "update": "Güncelle",
    "deleting": "Kaldırılıyor…",
    "confirmDelete": "Emin misiniz? Tekrar tıklayın"
  },
  "page": {
    "missingId": "Fikir veya makale kimliği eksik.",
    "startFailed": "Makale yazımı başlatılamadı.",
    "noId": "Sunucu makale kimliği döndürmedi.",
    "startError": "Makale başlatılırken bir sorun oluştu.",
    "retryFailed": "Yeniden deneme başarısız oldu. Lütfen tekrar deneyin.",
    "regenFailed": "Bu bölüm yeniden yazılamadı.",
    "regenFailedRetry": "Bu bölüm yeniden yazılamadı. Lütfen tekrar deneyin.",
    "wpPublishFailed": "WordPress'te yayınlanamadı.",
    "wpPublishFailedRetry": "WordPress'te yayınlanamadı. Lütfen tekrar deneyin.",
    "wpUpdateFailed": "WordPress'te güncellenemedi.",
    "wpUpdateFailedRetry": "WordPress'te güncellenemedi. Lütfen tekrar deneyin.",
    "wpDeleteFailed": "WordPress'ten kaldırılamadı.",
    "wpDeleteFailedRetry": "WordPress'ten kaldırılamadı. Lütfen tekrar deneyin.",
    "checkingPlan": "Planınız kontrol ediliyor…",
    "preparing": "Makaleniz hazırlanıyor…",
    "autoRefresh": "Bu sayfa kendiliğinden güncellenir; yenilemenize gerek yok."
  }
};

export default article;
