import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "{count} müşteri bize güveniyor",
    "trustedCount": "1.000+",
    "googleSigningIn": "Google ile giriş yapılıyor…",
    "eyebrow": "// Giriş yapın veya hesap oluşturun",
    "title": "Hesabınıza giriş yapın",
    "subtitle": "Devam etmek için Gmail, Yahoo, Outlook veya iCloud adresinizi kullanın.",
    "emailLabel": "E-posta adresi",
    "emailPlaceholder": "adiniz@gmail.com",
    "checking": "Kontrol ediliyor…"
  },
  "otp": {
    "title": "Doğrulama kodunu girin",
    "codeLabel": "Doğrulama kodu",
    "submit": "Giriş yap",
    "resend": "Kodu tekrar gönder",
    "resendIn": "{seconds} sn sonra tekrar gönder",
    "digitAria": "{total} haneden {index}. hane"
  },
  "email": {
    "eyebrow": "// E-posta ile devam edin",
    "title": "Şifrenizi girin",
    "forAccount": "Hesap: {email}",
    "passwordLabel": "Şifre",
    "editEmail": "Başka bir e-posta kullan"
  },
  "emailVerify": {
    "eyebrow": "// E-postanızı doğrulayın",
    "sentTo": "Doğrulama kodunu şu adrese gönderdik: {email}",
    "submit": "Doğrula ve giriş yap"
  },
  "admin": {
    "title": "Yönetici girişi",
    "phonePlaceholder": "Yöneticinin cep telefonu",
    "signingIn": "Giriş yapılıyor…",
    "impersonateTitle": "Bir kullanıcının hesabını aç",
    "goToDashboard": "Panele git",
    "loginFailed": "Yönetici girişi başarısız oldu.",
    "impersonateFailed": "Bu kullanıcının hesabı açılamadı.",
    "impersonating": "Kullanıcının hesabı açılıyor…"
  },
  "captcha": {
    "label": "Kısa güvenlik kontrolü",
    "clickToChange": "Yeni soru için tıklayın",
    "answer": "Cevap",
    "newQuestion": "Yeni soru",
    "required": "Lütfen güvenlik sorusunu yanıtlayın.",
    "wrong": "Cevap yanlış. Yeni soruyla tekrar deneyin."
  },
  "errors": {
    "googleFailed": "Google ile giriş yapılamadı. Lütfen tekrar deneyin.",
    "invalidEmail": "Bu e-posta adresi geçerli görünmüyor.",
    "emailProvider": "Lütfen Gmail, Yahoo, Outlook veya iCloud gibi bilinen bir sağlayıcıdan e-posta adresi kullanın.",
    "emailCodeIncomplete": "Lütfen kodun 6 hanesinin tamamını girin.",
    "codeWrong": "Bu kod doğru değil.",
    "resendFailed": "Kod tekrar gönderilemedi. Lütfen tekrar deneyin.",
    "passwordShort": "Şifreniz en az 6 karakter olmalı."
  }
};

export default auth;
