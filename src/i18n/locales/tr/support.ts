import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Yeni talep",
  "backToTickets": "Taleplere dön",
  "empty": "Henüz talebiniz yok. İlk talebinizi açmak için yukarıdaki düğmeyi kullanın.",
  "messages": {
    "one": "{count} mesaj",
    "other": "{count} mesaj"
  },
  "attachment": "Ek {index}",
  "attachedImage": "Ekli görsel",
  "fullImage": "Görselin tam boyutu",
  "closedNotice": "Bu talep kapatıldı. Başka bir konuda yardıma ihtiyacınız varsa yeni bir talep açın.",
  "status": {
    "open": "Yanıtımızı bekliyor",
    "answered": "Yanıtlandı",
    "closed": "Kapatıldı"
  },
  "topics": {
    "wordpress": "WordPress eklentisi",
    "api": "API",
    "bug": "Bir şey çalışmıyor",
    "billing": "Faturalandırma ve ödeme"
  },
  "priority": {
    "low": "Düşük",
    "normal": "Normal",
    "high": "Yüksek"
  },
  "form": {
    "topic": "Size nasıl yardımcı olabiliriz?",
    "subjectPlaceholder": "…ya da kendi konunuzu yazın",
    "description": "Ayrıntılar",
    "descriptionPlaceholder": "Neler olduğunu anlatın…",
    "phone": "Cep telefonu",
    "phoneHint": "Ekibimiz bu talep için size ulaşabilsin diye.",
    "image": "Ekran görüntüsü (isteğe bağlı)",
    "addImage": "Görsel ekle",
    "imagesSelected": "{count}/{max} görsel seçildi",
    "priority": "Öncelik",
    "submit": "Talebi gönder"
  },
  "reply": {
    "send": "Gönder",
    "sendReply": "Yanıtı gönder",
    "messagePlaceholder": "Mesajınızı yazın…",
    "replyPlaceholder": "Yanıtınızı yazın…",
    "staff": "Destek",
    "you": "Siz",
    "photo": "Görsel",
    "close": "Talebi kapat",
    "closing": "Kapatılıyor…"
  },
  "errors": {
    "load": "Talepleriniz yüklenemedi.",
    "loadNetwork": "Talepler yüklenirken bağlantı sorunu oluştu.",
    "imagesOnly": "Yalnızca görsel dosyaları eklenebilir.",
    "tooLarge": "“{name}” 4 MB'tan büyük.",
    "tooMany": "En fazla {max} görsel ekleyebilirsiniz.",
    "subjectRequired": "Lütfen bir konu yazın.",
    "subjectMin": "Konu en az {min} karakter olmalı.",
    "subjectMax": "Konu en fazla {max} karakter olabilir.",
    "messageRequired": "Lütfen sorununuzu anlatın.",
    "messageMin": "Ayrıntılar en az {min} karakter olmalı.",
    "messageMax": "Ayrıntılar en fazla {max} karakter olabilir.",
    "phone": "Lütfen geçerli bir cep telefonu numarası girin (ör. 09xxxxxxxxx).",
    "submit": "Talebiniz gönderilemedi.",
    "submitNetwork": "Talep gönderilirken bağlantı sorunu oluştu.",
    "notFound": "Talep bulunamadı.",
    "ticketNetwork": "Talep yüklenirken bağlantı sorunu oluştu.",
    "reply": "Yanıtınız gönderilemedi.",
    "replyNetwork": "Yanıt gönderilirken bağlantı sorunu oluştu."
  }
};

export default support;
