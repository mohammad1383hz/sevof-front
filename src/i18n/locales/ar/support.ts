import type en from "../en/support";

const support: typeof en = {
  "newTicket": "تذكرة جديدة",
  "backToTickets": "العودة إلى التذاكر",
  "empty": "لا توجد تذاكر بعد. استخدم الزر أعلاه لفتح أول تذكرة.",
  "messages": {
    "zero": "لا توجد رسائل",
    "one": "رسالة واحدة",
    "two": "رسالتان",
    "few": "{count} رسائل",
    "many": "{count} رسالة",
    "other": "{count} رسالة"
  },
  "attachment": "المرفق {index}",
  "attachedImage": "صورة مرفقة",
  "fullImage": "الصورة بالحجم الكامل",
  "closedNotice": "تم إغلاق هذه التذكرة. افتح تذكرة جديدة إذا احتجت مساعدة في أمر آخر.",
  "status": {
    "open": "بانتظار ردّنا",
    "answered": "تم الرد",
    "closed": "مغلقة"
  },
  "topics": {
    "wordpress": "إضافة ووردبريس",
    "api": "واجهة API",
    "bug": "هناك شيء لا يعمل",
    "billing": "الفوترة والدفع"
  },
  "priority": {
    "low": "منخفضة",
    "normal": "عادية",
    "high": "مرتفعة"
  },
  "form": {
    "topic": "كيف يمكننا مساعدتك؟",
    "subjectPlaceholder": "…أو اكتب موضوعك الخاص",
    "description": "التفاصيل",
    "descriptionPlaceholder": "أخبرنا بما يحدث…",
    "phone": "رقم الجوال",
    "phoneHint": "ليتمكّن فريقنا من التواصل معك بخصوص هذه التذكرة.",
    "image": "لقطة شاشة (اختياري)",
    "addImage": "إضافة صورة",
    "imagesSelected": "تم اختيار {count} من {max} صور",
    "priority": "الأولوية",
    "submit": "إرسال التذكرة"
  },
  "reply": {
    "send": "إرسال",
    "sendReply": "إرسال الرد",
    "messagePlaceholder": "اكتب رسالتك…",
    "replyPlaceholder": "اكتب ردّك…",
    "staff": "الدعم",
    "you": "أنت",
    "photo": "صورة",
    "close": "إغلاق التذكرة",
    "closing": "جارٍ الإغلاق…"
  },
  "errors": {
    "load": "تعذّر تحميل تذاكرك.",
    "loadNetwork": "حدثت مشكلة في الاتصال أثناء تحميل التذاكر.",
    "imagesOnly": "يمكن إرفاق ملفات الصور فقط.",
    "tooLarge": "حجم «{name}» أكبر من 4 ميغابايت.",
    "tooMany": "يمكنك إرفاق {max} صور كحد أقصى.",
    "subjectRequired": "يُرجى كتابة موضوع.",
    "subjectMin": "يجب ألّا يقل الموضوع عن {min} حرفًا.",
    "subjectMax": "يجب ألّا يزيد الموضوع عن {max} حرفًا.",
    "messageRequired": "يُرجى وصف مشكلتك.",
    "messageMin": "يجب ألّا تقل التفاصيل عن {min} حرفًا.",
    "messageMax": "يجب ألّا تزيد التفاصيل عن {max} حرفًا.",
    "phone": "يُرجى إدخال رقم جوال صالح (مثل 09xxxxxxxxx).",
    "submit": "تعذّر إرسال تذكرتك.",
    "submitNetwork": "حدثت مشكلة في الاتصال أثناء إرسال التذكرة.",
    "notFound": "لم يتم العثور على التذكرة.",
    "ticketNetwork": "حدثت مشكلة في الاتصال أثناء تحميل هذه التذكرة.",
    "reply": "تعذّر إرسال ردّك.",
    "replyNetwork": "حدثت مشكلة في الاتصال أثناء إرسال الرد."
  }
};

export default support;
