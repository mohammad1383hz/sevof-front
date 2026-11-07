import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "عرض",
  "noResults": "لا توجد نتائج مطابقة لبحثك.",
  "page": {
    "title": "لوحة المقالات",
    "subtitle": "ما يقوم به وكيل الذكاء الاصطناعي على هذا الموقع",
    "noSiteTitle": "لم تُضِف أي موقع بعد",
    "noSiteBody": "أضف موقعًا لعرض أفكاره ومقالاته ونشاط الطيار الآلي."
  },
  "errors": {
    "load": "تعذّر تحميل لوحة التحكم.",
    "network": "مشكلة في الاتصال، تعذّر تحميل لوحة التحكم.",
    "autopilot": "تعذّر تحديث الطيار الآلي.",
    "ideas": "حدث خطأ أثناء إنشاء الأفكار.",
    "invalidSite": "رابط الموقع غير صالح.",
    "ideasLoad": "تعذّر تحميل أفكار المحتوى.",
    "writtenLoad": "تعذّر تحميل المقالات المكتوبة.",
    "publishedLoad": "تعذّر تحميل المقالات المنشورة.",
    "keywordsLoad": "تعذّر تحميل الكلمات المفتاحية."
  },
  "articleStatus": {
    "completed": "مكتمل",
    "failed": "فشل",
    "pending": "في الانتظار",
    "generating": "جارٍ الكتابة…"
  },
  "ideaStatus": {
    "approved": "معتمدة",
    "rejected": "مرفوضة",
    "used": "مستخدمة",
    "recommended": "مقترحة"
  },
  "publishStatus": {
    "published": "منشور",
    "draft": "مسودة",
    "failed": "فشل"
  },
  "stats": {
    "totalArticles": "إجمالي المقالات",
    "published": "المنشورة",
    "generating": "قيد الإنشاء",
    "failed": "الفاشلة",
    "avgSeo": "متوسط درجة السيو",
    "totalWords": "الكلمات المكتوبة"
  },
  "recent": {
    "title": "أحدث المقالات",
    "empty": "لا توجد مقالات بعد.",
    "publishedOn": "نُشر في {date}"
  },
  "connection": {
    "checking": "جارٍ التحقق من اتصال موقعك…",
    "switchBack": "العودة إلى {platform}",
    "connectVia": "الربط عبر {platform} بدلًا من ذلك",
    "apiTitle": "الاتصال عبر الـ API العامة",
    "apiBody": "أنشئ المقالات واقرأها من تطبيقك الخاص، حتى دون WordPress أو Shopify. توثيق كامل وأمثلة برمجية ودليل لمفاتيح API.",
    "docs": "التوثيق",
    "platform": "منصة النشر",
    "comingSoon": "قريبًا",
    "soon": "قريبًا"
  },
  "opportunities": {
    "title": "فرص جديدة",
    "discovering": "جارٍ البحث…",
    "discover": "اكتشاف فرص جديدة",
    "empty": "لا توجد فرص بعد. اضغط «اكتشاف فرص جديدة» للبدء.",
    "generatedHint": "المقال جاهز، ستجده في قائمة المقالات",
    "generated": "تمت كتابته",
    "generate": "كتابة المقال",
    "keywords": "الكلمات المفتاحية المكتشفة",
    "entities": "المواضيع المحدّدة"
  },
  "opportunitiesPage": {
    "title": "فرص المحتوى",
    "subtitle": "أفكار مقالات مختارة لموقعك",
    "topic": "الموضوع",
    "entity": "الكيان الرئيسي",
    "competitor": "المنافسة",
    "search": "ابحث في المواضيع أو الكيانات…",
    "empty": "لا توجد أفكار محتوى بعد."
  },
  "gap": {
    "uncovered": "غير مغطّى بعد",
    "covered": "مغطّى بالفعل",
    "reviewing": "قيد المراجعة"
  },
  "columns": {
    "title": "عنوان المقال",
    "keyword": "الكلمة المفتاحية المستهدفة",
    "words": "عدد الكلمات",
    "status": "الحالة",
    "publishStatus": "حالة النشر",
    "date": "التاريخ",
    "url": "الرابط المنشور"
  },
  "written": {
    "title": "المقالات المكتوبة",
    "subtitle": "كل ما كتبه الطيار الآلي لموقعك حتى الآن",
    "empty": "لم تُكتب أي مقالات بعد."
  },
  "published": {
    "title": "المقالات المنشورة",
    "subtitleShort": "جميع محاولات النشر التي قام بها وكيلك",
    "subtitle": "جميع محاولات النشر التي قام بها وكيلك: المنشورة، والمحفوظة كمسودة، والفاشلة",
    "empty": "لم يُنشر أي شيء بعد.",
    "errorDetails": "عرض تفاصيل الخطأ"
  },
  "keywords": {
    "title": "الكلمات المفتاحية",
    "subtitle": "الكلمات المفتاحية التي وجدها الطيار الآلي لموقعك",
    "keyword": "الكلمة المفتاحية",
    "primary": "رئيسية",
    "difficulty": "الصعوبة",
    "analyzing": "نحلّل موقعك للعثور على الكلمات المفتاحية. قد يستغرق ذلك بعض الوقت…",
    "empty": "لم يتم العثور على كلمات مفتاحية بعد."
  },
  "difficulty": {
    "Low": "سهلة",
    "Medium": "متوسطة",
    "High": "صعبة",
    "Unknown": "غير معروفة"
  },
  "agent": {
    "status": {
      "idle": "متوقف مؤقتًا",
      "working": "يعمل",
      "generatingIdeas": "يُنشئ الأفكار",
      "writing": "يكتب مقالًا",
      "waitingIdeas": "بانتظار الأفكار المقيَّمة",
      "dailyLimit": "تم بلوغ الحد اليومي",
      "needsAnalysis": "يلزم تحليل الموقع أولًا",
      "unknown": "غير معروف"
    },
    "features": {
      "research": "تحليل المنافسين والكلمات المفتاحية",
      "daily": "أفكار ومقالات جديدة كل يوم",
      "autoPublish": "نشر تلقائي",
      "scheduling": "جدولة ذكية",
      "wordpress": "النشر على ووردبريس بنقرة واحدة"
    },
    "pipeline": {
      "badge": "مسار المحتوى",
      "intro": "يُنجز الطيار الآلي هذه الخطوات الأربع تباعًا دون أي جهد منك.",
      "keywordsTitle": "اكتشاف الكلمات المفتاحية",
      "keywordsDesc": "يحلّل موقعك ويحدّد الكلمات المفتاحية المهمة",
      "ideasTitle": "تخطيط الأفكار",
      "ideasDesc": "يحوّل كل فرصة إلى فكرة مقال",
      "writeTitle": "كتابة المقالات",
      "writeDesc": "يكتب مقالات كاملة ومحسّنة للسيو",
      "publishTitle": "النشر",
      "publishDesc": "ينشر المقالات على موقع ووردبريس الخاص بك"
    },
    "stats": {
      "keywords": "كلمات مفتاحية مكتشفة",
      "opportunities": "فرص مكتشفة",
      "written": "مقالات مكتوبة",
      "published": "مقالات منشورة"
    },
    "locked": {
      "badge": "ميزة Pro",
      "title": "ضع السيو على الطيار الآلي مع Pro",
      "body": "يراقب موقعك على مدار الساعة، ويحلّل المنافسين والكلمات المفتاحية، ثم يكتب لك مقالات محسّنة للسيو وينشرها.",
      "cta": "الترقية إلى Pro"
    },
    "enableTitle": "تشغيل الطيار الآلي",
    "enable": "تشغيل",
    "enabling": "جارٍ التشغيل…",
    "onTitle": "الطيار الآلي يعمل",
    "settings": "الإعدادات"
  },
  "settings": {
    "title": "إعدادات الطيار الآلي",
    "publishStatus": "عند جاهزية المقال",
    "publishHint": "تُنشر المقالات فور الانتهاء من كتابتها.",
    "draftHint": "تبقى المقالات مسودات حتى تراجعها وتنشرها بنفسك.",
    "publishOptions": {
      "draft": "حفظ كمسودة",
      "publish": "نشر تلقائي"
    },
    "perCycle": "عدد المقالات في كل دورة",
    "perCycleHint": "عدد المقالات التي تُكتب في كل دورة.",
    "schedule": "معدّل التكرار",
    "scheduleHint": "كم مرة يعمل الطيار الآلي؟",
    "customInterval": "كل كم يوم",
    "customIntervalHint": "مثلًا، 5 تعني مرة كل 5 أيام.",
    "startTime": "وقت البدء",
    "startTimeHint": "يبدأ الطيار الآلي العمل في هذا الوقت.",
    "sectionCount": "طول المقال",
    "sectionCountHint": "يحدّد البنية العامة لكل مقال.",
    "sections": {
      "short": "6–8 أقسام (قصير)",
      "medium": "8–10 أقسام (متوسط)",
      "long": "10–12 قسمًا (طويل)"
    },
    "intervalOptions": {
      "d1": "يوميًا",
      "d2": "يومًا بعد يوم",
      "d3": "كل 3 أيام",
      "d7": "مرة أسبوعيًا",
      "custom": "مخصّص"
    },
    "interval": {
      "everyDay": "يوميًا",
      "everyOtherDay": "يومًا بعد يوم",
      "everyWeek": "مرة أسبوعيًا",
      "everyNDays": "كل {days} أيام"
    },
    "preview": {
      "short": "جدولك: {count} مقالات {interval}",
      "publish": "يبدأ الطيار الآلي عند {time}، ويكتب {interval} {count} مقالات وينشرها تلقائيًا.",
      "draft": "يبدأ الطيار الآلي عند {time}، ويكتب {interval} {count} مقالات ويحفظها كمسودات لمراجعتها.",
      "publishWithImages": "يبدأ الطيار الآلي عند {time}، ويكتب {interval} {count} مقالات بـ{images} صور لكل مقال وينشرها تلقائيًا.",
      "draftWithImages": "يبدأ الطيار الآلي عند {time}، ويكتب {interval} {count} مقالات بـ{images} صور لكل مقال ويحفظها كمسودات لمراجعتها."
    },
    "articleModel": "نموذج الكتابة",
    "imagesTitle": "صور مقالاتك",
    "imageModel": "نموذج الصور",
    "imagesPerArticle": "عدد الصور لكل مقال",
    "perImage": "لكل صورة",
    "perArticle": "لكل مقال",
    "credits": "{count} رصيد",
    "recommended": "موصى به",
    "decrease": "إنقاص",
    "increase": "زيادة",
    "advanced": "إعدادات متقدمة",
    "advancedHint": "تعليماتك الخاصة للمقالات والصور (اختياري)",
    "articlePrompt": "تعليمات المقال",
    "articlePromptHint": "اتركها فارغة لتُكتب المقالات بالطريقة المعتادة.",
    "articlePromptPlaceholder": "مثال: أسلوب ودّي وبسيط موجّه للمبتدئين",
    "imagePrompt": "تعليمات الصورة البارزة",
    "imagePromptHint": "اتركها فارغة ليُنشأ الوصف من محتوى المقال.",
    "imagePromptPlaceholder": "مثال: ألوان دافئة، بدون نص على الصورة",
    "summary": "نظرة سريعة",
    "save": "حفظ الإعدادات"
  },
  "wp": {
    "title": "الربط مع ووردبريس",
    "subtitle": "انشر المقالات مباشرة على موقع ووردبريس الخاص بك",
    "status": {
      "connected": "متصل",
      "pending": "بانتظار الإعداد",
      "disconnected": "غير متصل"
    },
    "health": {
      "healthy": "يعمل بشكل سليم",
      "unhealthy": "خطأ",
      "unreachable": "تعذّر الوصول"
    },
    "verified": "مدرجة في WordPress.org",
    "shownOnce": "تظهر مرة واحدة فقط",
    "copy": "نسخ {label}",
    "downloadLatest": "تنزيل أحدث إصدار من الإضافة",
    "plugin": "إضافة ووردبريس",
    "pluginBody": "ثبّت الإضافة على موقعك. بعد الربط ستُكتب المقالات وتُنشر نيابةً عنك.",
    "download": "تنزيل الإضافة",
    "credentials": {
      "title": "بيانات الربط الخاصة بك",
      "body": "الصق هذه القيم الثلاث في إعدادات الإضافة على موقعك، وهذا كل ما تحتاجه للنشر التلقائي.",
      "warning": "بعد إغلاق هذه النافذة لن يظهر Client Secret مرة أخرى. إذا فقدته، استخدم «إعادة الربط» للحصول على بيانات جديدة.",
      "done": "حفظتها"
    },
    "checking": "جارٍ التحقق من الاتصال…",
    "empty": "لا يوجد موقع ووردبريس مرتبط بعد",
    "emptyBody": "عند الربط ستحصل على Client ID وClient Secret لإدخالهما في إضافة ووردبريس على موقعك.",
    "connect": "ربط ووردبريس",
    "waiting": "بانتظار اتصال إضافة ووردبريس",
    "waitingBody": "أدخل Client ID وAPI Key وClient Secret في إعدادات الإضافة لإكمال الربط. فقدت هذه القيم؟ اضغط «إعادة الربط» للحصول على قيم جديدة.",
    "check": "التحقق من الاتصال",
    "newCredentials": "إنشاء بيانات جديدة",
    "siteUrl": "رابط الموقع",
    "versions": "إصدار ووردبريس / الإضافة",
    "pluginVersion": "الإضافة {version}",
    "healthTitle": "الحالة",
    "lastCheck": "آخر فحص",
    "test": "اختبار الاتصال",
    "reconnect": "إعادة الربط",
    "disconnect": "فصل",
    "disconnected": "تم فصل ووردبريس",
    "testOk": "كل شيء على ما يرام، موقع ووردبريس الخاص بك متاح.",
    "testBad": "لم يستجب موقع ووردبريس كما هو متوقع.",
    "confirmReconnectTitle": "إنشاء بيانات ربط جديدة؟",
    "confirmReconnectBody": "ستتوقف بياناتك الحالية عن العمل، وستحتاج إلى إدخال البيانات الجديدة في إضافة ووردبريس.",
    "confirmDisconnectTitle": "فصل ووردبريس؟",
    "confirmDisconnectBody": "لن تُنشر المقالات تلقائيًا على هذا الموقع بعد الآن، وستحتاج إلى إعادة الإعداد لربطه مجددًا.",
    "errors": {
      "load": "تعذّر التحقق من ربط ووردبريس.",
      "loadNetwork": "مشكلة في الاتصال أثناء التحقق من ووردبريس.",
      "connect": "تعذّر الربط مع ووردبريس.",
      "reconnect": "تعذّرت إعادة الربط.",
      "disconnect": "تعذّر الفصل.",
      "testNetwork": "مشكلة في الاتصال أثناء الاختبار."
    }
  },
  "mixin": {
    "title": "الربط مع Mixin",
    "subtitle": "انشر المقالات مباشرة على متجرك في Mixin",
    "connected": "تم ربط Mixin",
    "disconnected": "تم فصل Mixin",
    "testOk": "كل شيء على ما يرام، Mixin متاح.",
    "testBad": "لم يستجب Mixin كما هو متوقع.",
    "changeIntro": "أدخل رمزًا جديدًا. سنختبره قبل الحفظ، ويبقى رمزك الحالي فعّالًا إذا فشل الاختبار.",
    "connectIntro": "أدخل رمز Mixin الخاص بك. سنختبر الاتصال بمتجرك قبل الحفظ ونخبرك إن وُجدت مشكلة.",
    "siteUrl": "رابط المتجر",
    "currentToken": "الرمز الحالي",
    "token": "رمز Mixin",
    "tokenShort": "الرمز",
    "newToken": "رمز جديد",
    "tokenPlaceholder": "الصق رمزك هنا",
    "newTokenPlaceholder": "الصق الرمز الجديد هنا",
    "hideToken": "إخفاء الرمز",
    "showToken": "إظهار الرمز",
    "testing": "جارٍ اختبار الاتصال…",
    "testAndConnect": "اختبار وربط",
    "changeToken": "تغيير الرمز",
    "confirmTitle": "فصل Mixin؟",
    "confirmBody": "لن تُنشر المقالات تلقائيًا على Mixin بعد الآن، وستحتاج إلى إدخال الرمز مجددًا لإعادة الربط.",
    "errors": {
      "load": "تعذّر التحقق من ربط Mixin.",
      "loadNetwork": "مشكلة في الاتصال أثناء التحقق من Mixin.",
      "tokenShort": "يُرجى لصق الرمز كاملًا.",
      "connect": "تعذّر الربط مع Mixin. تحقّق من رابط المتجر والرمز."
    }
  },
  "kwAnalysis": {
    "title": "مكتشف الكلمات المفتاحية",
    "steps": {
      "pending": "تم استلام الطلب",
      "processing": "جلب البيانات من Google Trends",
      "selecting": "الذكاء الاصطناعي يختار أفضل كلمة مفتاحية",
      "done": "تجهيز النتائج"
    },
    "progress": "تحليل الكلمات المفتاحية (تم فحص {done} من {total})",
    "starting": "جارٍ البدء…",
    "note": "ملاحظة: يقيّد Google Trends عدد الطلبات، لذا قد يستغرق فحص كل كلمة مفتاحية حتى دقيقة.",
    "processing": "قيد التنفيذ…",
    "completed": "اكتمل",
    "failed": "فشل تحليل الكلمات المفتاحية",
    "finalBadge": "كلمتك المفتاحية",
    "suggestedTitle": "العنوان المقترح",
    "checked": "الكلمات المفتاحية التي تم فحصها ({count})",
    "finalSelection": "المختارة",
    "fetched": "تم جلب البيانات",
    "fetchError": "تعذّر جلب البيانات",
    "topQueries": "أبرز عمليات البحث المرتبطة",
    "risingQueries": "عمليات البحث الصاعدة",
    "noData": "لا توجد بيانات",
    "breakout": "قفزة كبيرة",
    "backToAnalysis": "العودة إلى تحليل الموقع",
    "errors": {
      "status": "تعذّر الحصول على حالة التحليل.",
      "start": "تعذّر بدء تحليل الكلمات المفتاحية.",
      "site": "تعذّر تحميل بيانات الموقع."
    }
  },
  "shopify": {
    "title": "اتصال Shopify",
    "subtitle": "انشر مقالات المدونة وإصلاحات SEO للمنتجات مباشرة في متجرك على Shopify",
    "connected": "متصل",
    "loadFailed": "تعذّر تحميل اتصال Shopify.",
    "connectedBanner": "تم ربط متجرك على Shopify. نستورد منتجاتك الآن.",
    "invalidShop": "أدخل عنوان متجرك، مثل your-store.myshopify.com.",
    "installFailed": "تعذّر بدء الاتصال بـ Shopify. يُرجى المحاولة مرة أخرى.",
    "testOk": "كل شيء على ما يرام — متجرك متاح.",
    "testBad": "لم يستجب Shopify كما هو متوقع.",
    "disconnected": "تم فصل متجر Shopify.",
    "disconnectFailed": "تعذّر فصل المتجر.",
    "store": "المتجر",
    "storefront": "واجهة المتجر",
    "connectedHelp": "تُنشر المقالات في مدونة متجرك، وتُحدّث إصلاحات المنتجات المعتمدة منتجاتك على Shopify. تتم مزامنة منتجاتك تلقائيًا كل ليلة.",
    "confirmTitle": "فصل Shopify؟",
    "confirmBody": "ستُزال تطبيق Sevof من متجرك. تبقى المقالات المنشورة سابقًا في مدونتك.",
    "disconnecting": "جارٍ الفصل…",
    "disconnect": "فصل",
    "cancel": "إلغاء",
    "test": "اختبار الاتصال",
    "notConfigured": "النشر على Shopify غير متاح على هذا الخادم بعد. يُرجى التواصل مع الدعم.",
    "intro": "أدخل عنوان متجرك ووافق على تطبيق Sevof في Shopify. ستعود إلى هنا مباشرة بعد ذلك.",
    "shopLabel": "عنوان المتجر",
    "shopHint": "عنوانك على myshopify.com — تجده في لوحة إدارة Shopify ضمن الإعدادات ← النطاقات.",
    "redirecting": "جارٍ فتح Shopify…",
    "connect": "ربط Shopify",
    "permissions": "يطلب Sevof الوصول إلى مدونتك ومنتجاتك وملفاتك فقط. يمكنك إزالة التطبيق من Shopify في أي وقت.",
    "pickTitle": "اربط متجرك على Shopify",
    "pickBody": "اختر موقع Sevof الذي ينتمي إليه هذا المتجر. بعد ذلك ستوافق على التطبيق في Shopify.",
    "noSites": "ليس لديك أي موقع في Sevof بعد. أضف نطاق متجرك أولًا ثم عد إلى هنا.",
    "addSite": "إضافة موقع"
  }
};

export default dashboard;
