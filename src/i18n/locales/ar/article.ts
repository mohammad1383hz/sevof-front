import type en from "../en/article";

const article: typeof en = {
  "words": {
    "zero": "0 كلمة",
    "one": "كلمة واحدة",
    "two": "كلمتان",
    "few": "{count} كلمات",
    "many": "{count} كلمة",
    "other": "{count} كلمة"
  },
  "actions": {
    "chat": "محادثة",
    "save": "حفظ"
  },
  "steps": {
    "brief": "الموجز",
    "briefHint": "تحليل الجمهور والمنافسين",
    "outline": "المخطط",
    "outlineHint": "تخطيط بنية المقال",
    "sections": "الكتابة",
    "sectionsHint": "قسمًا تلو الآخر",
    "meta": "البيانات الوصفية والسيو",
    "metaHint": "العنوان والملخص ومخطط FAQ",
    "review": "مراجعة السيو",
    "reviewHint": "التقييم ومنح الدرجة",
    "done": "المقال النهائي",
    "doneHint": "جاهز للنشر"
  },
  "status": {
    "generated": "اكتمل",
    "pending": "بالانتظار"
  },
  "sectionType": {
    "introduction": "المقدمة",
    "section": "قسم رئيسي",
    "faq": "الأسئلة الشائعة",
    "conclusion": "الخاتمة"
  },
  "breakdown": {
    "intent_match": "التوافق مع نية البحث",
    "keyword_usage": "استخدام الكلمات المفتاحية",
    "entity_coverage": "تغطية الموضوع",
    "completeness": "شمولية المحتوى",
    "readability": "سهولة القراءة",
    "structure": "البنية"
  },
  "target": {
    "title": "عنوان المقال",
    "meta_title": "عنوان السيو",
    "meta_description": "الوصف التعريفي",
    "excerpt": "المقتطف",
    "general": "المقال كاملًا",
    "section": "قسم",
    "faq": "سؤال شائع",
    "article": "المقال كاملًا",
    "metaTitleLong": "عنوان السيو (Meta Title)",
    "metaDescriptionLong": "الوصف التعريفي (Meta Description)",
    "excerptLong": "المقتطف (Excerpt)",
    "question": "السؤال {index}"
  },
  "models": {
    "choose": "اختر نموذج الذكاء الاصطناعي",
    "upgrade": "رقِّ اشتراكك لفتح نماذج Pro.",
    "nano": "سريع واقتصادي",
    "mini": "دقة أعلى للتعديلات المعقّدة",
    "luna": "أفضل جودة كتابة وأسلوب أكثر طبيعية؛ اختيارنا لأفضل النتائج."
  },
  "imageModels": {
    "flux": "سريع ومنخفض التكلفة، مناسب لصور المقالات اليومية.",
    "banana": "جودة بصرية عالية، مثالي للصور الإبداعية والمتنوعة.",
    "gpt": "يلتزم بوصفك بدقة ويهتم بأدق التفاصيل."
  },
  "styles": {
    "minimal": "بسيط",
    "infographic": "إنفوجرافيك",
    "conceptual": "مفاهيمي",
    "realistic": "واقعي",
    "product": "منتج"
  },
  "editor": {
    "placeholder": "اكتب هذا القسم أو عدّله…"
  },
  "copy": {
    "failed": "تعذّر النسخ.",
    "failedRetry": "تعذّر النسخ. يُرجى المحاولة مرة أخرى."
  },
  "errors": {
    "request": "لم يكتمل الطلب.",
    "invalidResponse": "أرسل الخادم استجابة غير متوقعة."
  },
  "error": {
    "paused": "توقفت كتابة المقال مؤقتًا",
    "pausedCredit": "توقفت كتابة المقال لنفاد الرصيد",
    "savedCredit": "لا تقلق، كل ما اكتمل محفوظ. بعد شحن رصيدك ستُستأنف الكتابة من حيث توقفت.",
    "savedRetry": "لا تقلق، كل ما اكتمل محفوظ. أعد المحاولة وستُستأنف الكتابة من حيث توقفت.",
    "buyCredits": "شراء الرصيد أو تجديده",
    "resume": "استئناف الكتابة"
  },
  "seo": {
    "title": "مراجعة السيو",
    "evaluating": "جارٍ تقييم المقال كاملًا مقارنةً بالموجز…",
    "failed": "لم تكتمل مراجعة السيو (مقالك جاهز لكن دون درجة).",
    "outOf100": "من 100",
    "overall": "درجة السيو الإجمالية",
    "suggestions": "اقتراحات للتحسين"
  },
  "image": {
    "featured": "الصورة البارزة",
    "failed": "تعذّر إنشاء الصورة",
    "noBlock": "لا تقلق، هذا لا يمنع كتابة نص المقال أو نشره.",
    "creating": "يكتب الذكاء الاصطناعي وصفًا وينشئ الصورة البارزة…",
    "tip": "للحصول على صور بجودة أعلى، جرّب GPT Image أو Nano Banana",
    "generating": "جارٍ إنشاء صورة جديدة…",
    "generatingShort": "جارٍ الإنشاء…",
    "closeEditor": "إغلاق المحرّر",
    "retryPrompt": "إعادة المحاولة بوصف جديد",
    "editPrompt": "تعديل الوصف وإعادة الإنشاء",
    "promptPlaceholder": "صِف الصورة التي تريدها…",
    "modelLocked": "النموذج «{model}» متاح لمشتركي Pro فقط. ننقلك إلى صفحة الباقات…",
    "editLocked": "تعديل الصور وإعادة إنشائها ميزة خاصة بـPro. ننقلك إلى صفحة الباقات…",
    "promptShort": "الوصف قصير جدًا.",
    "assistant": "مساعد الصور: عدّل الوصف ثم أرسله",
    "proOnly": "تعديل الوصف وإعادة إنشاء الصورة متاحان في باقة Pro.",
    "introExisting": "هذا هو الوصف الذي أُنشئت به الصورة. عدّله كما تشاء:",
    "introNew": "لا يوجد وصف بعد. اكتب وصفًا لإنشاء الصورة:",
    "submit": "إعادة الإنشاء",
    "proOnlyShort": "لمشتركي Pro فقط"
  },
  "meta": {
    "title": "إعدادات السيو",
    "empty": "فارغ",
    "focusKeyword": "الكلمة المفتاحية الرئيسية",
    "slug": "الرابط المختصر (Slug)",
    "slugHint": "الجزء اللاتيني من الرابط؛ بأحرف صغيرة وشرطات فقط",
    "ogTitle": "عنوان الشبكات الاجتماعية (og:title)",
    "ogDescription": "وصف الشبكات الاجتماعية (og:description)"
  },
  "faq": {
    "title": "الأسئلة الشائعة",
    "count": {
      "zero": "لا توجد أسئلة",
      "one": "سؤال واحد",
      "two": "سؤالان",
      "few": "{count} أسئلة",
      "many": "{count} سؤالًا",
      "other": "{count} سؤال"
    },
    "question": "السؤال",
    "answer": "الإجابة",
    "saveFailed": "تعذّر حفظ هذا السؤال."
  },
  "sections": {
    "title": "أقسام المقال",
    "designing": "جارٍ بناء المخطط استنادًا إلى الموجز…",
    "none": "لم يُنشأ مخطط المقال بعد.",
    "editManually": "تعديل يدوي",
    "progress": "{done} من {total} أقسام",
    "regenerate": "إعادة كتابة هذا القسم"
  },
  "banner": {
    "title": "بانر المقال",
    "designing": "جارٍ تصميم البانر…",
    "failed": "تعذّرت إعادة إنشاء البانر.",
    "failedRetry": "تعذّرت إعادة إنشاء البانر. يُرجى المحاولة مرة أخرى.",
    "generationFailed": "تعذّر إنشاء البانر.",
    "regenerate": "إعادة الإنشاء"
  },
  "brief": {
    "title": "موجز المقال",
    "analyzing": "يحلّل الذكاء الاصطناعي جمهورك ونية البحث وفجوات المحتوى لدى منافسيك…",
    "notYet": "لم يُنشأ بعد.",
    "audience": "الجمهور",
    "tone": "الأسلوب",
    "length": "الطول المستهدف",
    "goal": "هدف المقال",
    "mustCover": "مواضيع لا بد من تغطيتها",
    "gaps": "فجوات المنافسين (ميزتك)",
    "linkPlan": "«{anchor}» في قسم «{section}»"
  },
  "chat": {
    "title": "تحدّث مع الذكاء الاصطناعي",
    "selectSection": "اختر قسمًا",
    "or": "أو",
    "orDrag": "أو اسحب قسمًا إلى هنا",
    "selectAll": "اختر المقال كاملًا",
    "useSelect": "اختر قسمًا عبر «تحديد القسم»",
    "drop": "أفلت هنا للتحدث عن هذا القسم",
    "dropHere": "أفلت هنا لإضافته إلى المحادثة",
    "loading": "جارٍ تحميل المحادثة…",
    "empty": "لا توجد محادثات حول هذا المقال بعد.",
    "applied": "تم التطبيق",
    "clearTarget": "إزالة",
    "placeholder": "مثال: اجعل هذا القسم أكثر رسمية وإيجازًا…",
    "placeholderShort": "مثال: اجعل هذا القسم أكثر رسمية…",
    "placeholderEmpty": "اختر قسمًا من المقال أولًا أو أفلته هنا",
    "selectFirst": "اختر قسمًا أولًا",
    "disabledUntilDone": "تُتاح المحادثة بعد اكتمال المقال…",
    "waitForArticle": "جارٍ كتابة المقال… ستُتاح المحادثة فور جاهزيته",
    "noCredits": "اشتراكك غير مفعّل أو نفد رصيدك.",
    "sendFailed": "لم تُرسل رسالتك. يُرجى المحاولة مرة أخرى.",
    "sendAria": "إرسال الرسالة",
    "previous": "المحادثات السابقة حول هذا المقال ({count})",
    "loadingPrevious": "جارٍ تحميل المحادثات السابقة…",
    "firstDraft": "المسودة الأولى",
    "draft": "المسودة {index}",
    "withAgent": "تحدّث مع الوكيل"
  },
  "final": {
    "article": "المقال",
    "ready": "مقالك جاهز",
    "section": "القسم {index}",
    "waiting": "بالانتظار",
    "sectionFailed": "تعذّرت كتابة هذا القسم.",
    "sectionTitle": "عنوان القسم",
    "saveFailed": "تعذّر حفظ المقال.",
    "dragToChat": "اسحبه إلى المحادثة",
    "dragShort": "اسحب إلى المحادثة",
    "dragArticle": "اسحب المقال كاملًا إلى المحادثة",
    "dragSection": "اسحب هذا القسم إلى المحادثة",
    "chatArticle": "تحدّث عن المقال كاملًا",
    "editArticle": "تعديل المقال كاملًا",
    "copyMarkdown": "نسخ بصيغة Markdown"
  },
  "modal": {
    "title": "اختر طريقة كتابة مقالك",
    "subtitle": "يحدّد النموذج الذي تختاره جودة المقال وقوته في السيو. النماذج الأكثر تقدّمًا متاحة مع Pro.",
    "writingModel": "نموذج الكتابة",
    "writingModelDesc": "يكتب هذا النموذج نص المقال وبنيته.",
    "images": "صور المقال",
    "imagesDesc": "اختر نموذج الصور وعدد الصور التي ستُنشأ لهذا المقال.",
    "qualityTip": "لأفضل جودة، استخدم GPT Image أو Nano Banana",
    "imageCount": "عدد الصور",
    "upToImages": "أنشئ حتى {count} صور",
    "firstImage": "الصورة الأولى ستكون الصورة البارزة للمقال.",
    "sectionCount": "عدد الأقسام",
    "rangePro": "هذا النطاق متاح في باقة Pro",
    "sectionRange": "سيضمّ مقالك من {min} إلى {max} أقسام.",
    "advanced": "إعدادات متقدمة (اختياري)",
    "advancedHint": "نمط الصورة وتعليماتك الخاصة للنص والصورة البارزة",
    "imageStyle": "نمط الصورة",
    "infographicHint": "يتطلّب الإنفوجرافيك نموذج GPT Image أو Nano Banana",
    "articlePromptPlaceholder": "مثال: أسلوب حواري موجّه للمبتدئين مع خاتمة واضحة",
    "imagePromptPlaceholder": "مثال: مكتب خشبي عليه حاسوب محمول وفنجان قهوة في ضوء الصباح الهادئ",
    "imagePromptHint": "يُطبّق النمط المختار أعلاه على هذه الصورة أيضًا، دون نصوص أو شعارات.",
    "start": "ابدأ الكتابة"
  },
  "publish": {
    "connect": "ربط {platform}",
    "notConnected": "موقعك غير مرتبط بـ{platform} بعد.",
    "publishTo": "النشر على {platform}",
    "updateOn": "التحديث على {platform}",
    "removeFrom": "الإزالة من {platform}",
    "draftOn": "مسودة على {platform}",
    "viewOn": "العرض على {platform}",
    "checking": "جارٍ التحقق من الاتصال…",
    "finishFirst": "يجب اكتمال المقال قبل نشره.",
    "whenReady": "يمكنك النشر فور جاهزية المقال.",
    "publishing": "جارٍ النشر…",
    "publish": "نشر",
    "updating": "جارٍ التحديث…",
    "updated": "تم التحديث",
    "update": "تحديث",
    "deleting": "جارٍ الإزالة…",
    "confirmDelete": "هل أنت متأكد؟ انقر مجددًا"
  },
  "page": {
    "missingId": "معرّف الفكرة أو المقال مفقود.",
    "startFailed": "تعذّر بدء كتابة المقال.",
    "noId": "لم يُرجع الخادم معرّف المقال.",
    "startError": "حدث خطأ أثناء بدء كتابة المقال.",
    "retryFailed": "فشلت إعادة المحاولة. يُرجى المحاولة مرة أخرى.",
    "regenFailed": "تعذّرت إعادة كتابة هذا القسم.",
    "regenFailedRetry": "تعذّرت إعادة كتابة هذا القسم. يُرجى المحاولة مرة أخرى.",
    "wpPublishFailed": "تعذّر النشر على ووردبريس.",
    "wpPublishFailedRetry": "تعذّر النشر على ووردبريس. يُرجى المحاولة مرة أخرى.",
    "wpUpdateFailed": "تعذّر التحديث على ووردبريس.",
    "wpUpdateFailedRetry": "تعذّر التحديث على ووردبريس. يُرجى المحاولة مرة أخرى.",
    "wpDeleteFailed": "تعذّرت الإزالة من ووردبريس.",
    "wpDeleteFailedRetry": "تعذّرت الإزالة من ووردبريس. يُرجى المحاولة مرة أخرى.",
    "checkingPlan": "جارٍ التحقق من باقتك…",
    "preparing": "جارٍ تجهيز مقالك…",
    "autoRefresh": "تتحدّث هذه الصفحة تلقائيًا، لا حاجة لإعادة تحميلها."
  }
};

export default article;
