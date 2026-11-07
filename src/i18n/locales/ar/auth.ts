import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "يثق بنا {count} عميل",
    "trustedCount": "أكثر من 1,000",
    "googleSigningIn": "جارٍ تسجيل الدخول عبر جوجل…",
    "eyebrow": "// تسجيل الدخول أو إنشاء حساب",
    "title": "سجّل الدخول إلى حسابك",
    "subtitle": "استخدم بريدك على Gmail أو Yahoo أو Outlook أو iCloud للمتابعة.",
    "emailLabel": "البريد الإلكتروني",
    "emailPlaceholder": "you@gmail.com",
    "checking": "جارٍ التحقق…"
  },
  "otp": {
    "title": "أدخل رمز التحقق",
    "codeLabel": "رمز التحقق",
    "submit": "تسجيل الدخول",
    "resend": "إعادة إرسال الرمز",
    "resendIn": "إعادة الإرسال بعد {seconds} ث",
    "digitAria": "الخانة {index} من {total}"
  },
  "email": {
    "eyebrow": "// المتابعة بالبريد الإلكتروني",
    "title": "أدخل كلمة المرور",
    "forAccount": "للحساب {email}",
    "passwordLabel": "كلمة المرور",
    "editEmail": "استخدام بريد آخر"
  },
  "emailVerify": {
    "eyebrow": "// تأكيد البريد الإلكتروني",
    "sentTo": "أرسلنا رمز التحقق إلى {email}.",
    "submit": "تحقّق وسجّل الدخول"
  },
  "admin": {
    "title": "دخول المسؤول",
    "phonePlaceholder": "رقم جوال المسؤول",
    "signingIn": "جارٍ تسجيل الدخول…",
    "impersonateTitle": "فتح حساب مستخدم",
    "goToDashboard": "الانتقال إلى لوحة التحكم",
    "loginFailed": "تعذّر دخول المسؤول.",
    "impersonateFailed": "تعذّر فتح حساب هذا المستخدم.",
    "impersonating": "جارٍ فتح حساب المستخدم…"
  },
  "captcha": {
    "label": "تحقّق أمني سريع",
    "clickToChange": "انقر للحصول على سؤال جديد",
    "answer": "الإجابة",
    "newQuestion": "سؤال جديد",
    "required": "يُرجى الإجابة عن سؤال التحقق.",
    "wrong": "الإجابة غير صحيحة. جرّب السؤال الجديد."
  },
  "errors": {
    "googleFailed": "تعذّر تسجيل الدخول عبر جوجل. يُرجى المحاولة مرة أخرى.",
    "invalidEmail": "يبدو أن البريد الإلكتروني غير صحيح.",
    "emailProvider": "يُرجى استخدام بريد من مزوّد معروف مثل Gmail أو Yahoo أو Outlook أو iCloud.",
    "emailCodeIncomplete": "يُرجى إدخال الأرقام الستة للرمز.",
    "codeWrong": "الرمز غير صحيح.",
    "resendFailed": "تعذّرت إعادة إرسال الرمز. يُرجى المحاولة مرة أخرى.",
    "passwordShort": "يجب ألّا تقل كلمة المرور عن 6 أحرف."
  }
};

export default auth;
