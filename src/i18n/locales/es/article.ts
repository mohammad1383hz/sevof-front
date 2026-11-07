import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} palabra",
    "other": "{count} palabras"
  },
  "actions": {
    "chat": "Chat",
    "save": "Guardar"
  },
  "steps": {
    "brief": "Brief",
    "briefHint": "Estudio de audiencia y competencia",
    "outline": "Estructura",
    "outlineHint": "Planificación del esquema",
    "sections": "Redacción",
    "sectionsHint": "Sección por sección",
    "meta": "Metadatos y SEO",
    "metaHint": "Título, resumen y esquema FAQ",
    "review": "Revisión SEO",
    "reviewHint": "Revisión y puntuación",
    "done": "Artículo final",
    "doneHint": "Listo para publicar"
  },
  "status": {
    "generated": "Listo",
    "pending": "Pendiente"
  },
  "sectionType": {
    "introduction": "Introducción",
    "section": "Sección principal",
    "faq": "Preguntas frecuentes",
    "conclusion": "Conclusión"
  },
  "breakdown": {
    "intent_match": "Ajuste a la intención de búsqueda",
    "keyword_usage": "Uso de palabras clave",
    "entity_coverage": "Cobertura del tema",
    "completeness": "Exhaustividad",
    "readability": "Legibilidad",
    "structure": "Estructura"
  },
  "target": {
    "title": "Título del artículo",
    "meta_title": "Título SEO",
    "meta_description": "Metadescripción",
    "excerpt": "Extracto",
    "general": "Artículo completo",
    "section": "Sección",
    "faq": "FAQ",
    "article": "Artículo completo",
    "metaTitleLong": "Título SEO (meta title)",
    "metaDescriptionLong": "Metadescripción",
    "excerptLong": "Extracto",
    "question": "Pregunta {index}"
  },
  "models": {
    "choose": "Elige un modelo de IA",
    "upgrade": "Mejora tu plan para desbloquear los modelos Pro.",
    "nano": "Rápido y económico",
    "mini": "Más preciso para ediciones complejas",
    "luna": "La mejor calidad de redacción y el tono más natural: nuestra recomendación para los mejores resultados."
  },
  "imageModels": {
    "flux": "Rápido y asequible: ideal para las imágenes habituales de tus artículos.",
    "banana": "Gran calidad visual, perfecto para imágenes creativas y variadas.",
    "gpt": "Sigue tu prompt al pie de la letra y cuida los detalles."
  },
  "styles": {
    "minimal": "Minimalista",
    "infographic": "Infografía",
    "conceptual": "Conceptual",
    "realistic": "Realista",
    "product": "Producto"
  },
  "editor": {
    "placeholder": "Escribe o edita esta sección…"
  },
  "copy": {
    "failed": "No se pudo copiar.",
    "failedRetry": "No se pudo copiar. Inténtalo de nuevo."
  },
  "errors": {
    "request": "La solicitud no se completó.",
    "invalidResponse": "El servidor devolvió una respuesta inesperada."
  },
  "error": {
    "paused": "La redacción del artículo está en pausa",
    "pausedCredit": "Redacción en pausa: te has quedado sin créditos",
    "savedCredit": "Tranquilo: todo lo terminado hasta ahora está guardado. En cuanto recargues, seguirá justo donde se quedó.",
    "savedRetry": "Tranquilo: todo lo terminado hasta ahora está guardado. Vuelve a intentarlo y seguirá justo donde se quedó.",
    "buyCredits": "Comprar o renovar créditos",
    "resume": "Reanudar la redacción"
  },
  "seo": {
    "title": "Revisión SEO",
    "evaluating": "Comparando el artículo completo con el brief…",
    "failed": "La revisión SEO no se completó (tu artículo está listo, solo que sin puntuación).",
    "outOf100": "de 100",
    "overall": "Puntuación SEO global",
    "suggestions": "Cómo mejorarlo"
  },
  "image": {
    "featured": "Imagen destacada",
    "failed": "No se pudo generar la imagen",
    "noBlock": "No te preocupes: esto no impide que el texto se escriba ni que se publique.",
    "creating": "La IA está escribiendo un prompt y creando tu imagen destacada…",
    "tip": "Para imágenes de más calidad, prueba GPT Image o Nano Banana",
    "generating": "Creando una imagen nueva…",
    "generatingShort": "Generando…",
    "closeEditor": "Cerrar editor",
    "retryPrompt": "Probar con un prompt nuevo",
    "editPrompt": "Editar prompt y regenerar",
    "promptPlaceholder": "Describe la imagen que quieres…",
    "modelLocked": "El modelo «{model}» es solo para usuarios Pro. Te llevamos a la página de planes…",
    "editLocked": "Editar y regenerar imágenes es una función Pro. Te llevamos a la página de planes…",
    "promptShort": "Ese prompt es demasiado corto.",
    "assistant": "Asistente de imágenes: edita el prompt y envíalo",
    "proOnly": "Editar el prompt y regenerar imágenes está disponible en Pro.",
    "introExisting": "Este es el prompt que usamos para la imagen. Cámbialo como quieras:",
    "introNew": "Todavía no hay prompt. Escribe uno para generar la imagen:",
    "submit": "Regenerar",
    "proOnlyShort": "Solo Pro"
  },
  "meta": {
    "title": "Ajustes SEO",
    "empty": "vacío",
    "focusKeyword": "Palabra clave principal",
    "slug": "Slug de la URL",
    "slugHint": "La parte de la dirección que forma la URL: solo minúsculas y guiones",
    "ogTitle": "Título para redes sociales (og:title)",
    "ogDescription": "Descripción para redes sociales (og:description)"
  },
  "faq": {
    "title": "Preguntas frecuentes",
    "count": {
      "one": "{count} pregunta",
      "other": "{count} preguntas"
    },
    "question": "Pregunta",
    "answer": "Respuesta",
    "saveFailed": "No pudimos guardar esta pregunta."
  },
  "sections": {
    "title": "Secciones del artículo",
    "designing": "Creando la estructura a partir del brief…",
    "none": "La estructura aún no se ha creado.",
    "editManually": "Editar a mano",
    "progress": "{done} de {total} secciones",
    "regenerate": "Reescribir esta sección"
  },
  "banner": {
    "title": "Banner del artículo",
    "designing": "Diseñando tu banner…",
    "failed": "No se pudo regenerar el banner.",
    "failedRetry": "No se pudo regenerar el banner. Inténtalo de nuevo.",
    "generationFailed": "No se pudo crear el banner.",
    "regenerate": "Regenerar"
  },
  "brief": {
    "title": "Brief del artículo",
    "analyzing": "La IA está estudiando tu audiencia, la intención de búsqueda y los huecos en el contenido de tu competencia…",
    "notYet": "Aún no se ha creado.",
    "audience": "Audiencia",
    "tone": "Tono",
    "length": "Extensión objetivo",
    "goal": "Objetivo del artículo",
    "mustCover": "Temas imprescindibles",
    "gaps": "Huecos de la competencia (tu ventaja)",
    "linkPlan": "«{anchor}» en la sección «{section}»"
  },
  "chat": {
    "title": "Chatea con la IA",
    "selectSection": "Elige una sección",
    "or": "o",
    "orDrag": "o arrastra una sección aquí",
    "selectAll": "selecciona el artículo completo",
    "useSelect": "Elige una sección con «Seleccionar sección»",
    "drop": "Suelta para chatear sobre esta sección",
    "dropHere": "Suéltalo aquí para añadirlo al chat",
    "loading": "Cargando chat…",
    "empty": "Todavía no hay chats sobre este artículo.",
    "applied": "Aplicado",
    "clearTarget": "Quitar",
    "placeholder": "p. ej., Haz esta sección más formal y concisa…",
    "placeholderShort": "p. ej., Haz esta sección más formal…",
    "placeholderEmpty": "Primero elige una sección del artículo o suéltala aquí",
    "selectFirst": "Primero elige una sección",
    "disabledUntilDone": "El chat se abrirá cuando el artículo esté terminado…",
    "waitForArticle": "Escribiendo el artículo… El chat se abrirá en cuanto esté listo",
    "noCredits": "Tu plan no está activo o te has quedado sin créditos.",
    "sendFailed": "Tu mensaje no se envió. Inténtalo de nuevo.",
    "sendAria": "Enviar mensaje",
    "previous": "Chats anteriores sobre este artículo ({count})",
    "loadingPrevious": "Cargando chats anteriores…",
    "firstDraft": "Primer borrador",
    "draft": "Borrador {index}",
    "withAgent": "Chatear con el agente"
  },
  "final": {
    "article": "Artículo",
    "ready": "Tu artículo está listo",
    "section": "Sección {index}",
    "waiting": "En espera",
    "sectionFailed": "No se pudo escribir esta sección.",
    "sectionTitle": "Título de la sección",
    "saveFailed": "No pudimos guardar el artículo.",
    "dragToChat": "Arrastra al chat",
    "dragShort": "Arrastrar al chat",
    "dragArticle": "Arrastra el artículo completo al chat",
    "dragSection": "Arrastra esta sección al chat",
    "chatArticle": "Chatear sobre el artículo completo",
    "editArticle": "Editar el artículo completo",
    "copyMarkdown": "Copiar como Markdown"
  },
  "modal": {
    "title": "Elige cómo se escribe tu artículo",
    "subtitle": "El modelo que elijas define la calidad y el SEO del artículo. Los modelos más avanzados vienen con Pro.",
    "writingModel": "Modelo de redacción",
    "writingModelDesc": "Este modelo escribe el texto y la estructura del artículo.",
    "images": "Imágenes del artículo",
    "imagesDesc": "Elige el modelo de imagen y cuántas imágenes crear para este artículo.",
    "qualityTip": "Para la mejor calidad, usa GPT Image o Nano Banana",
    "imageCount": "Número de imágenes",
    "upToImages": "Crea hasta {count} imágenes",
    "firstImage": "La primera imagen será la imagen destacada.",
    "sectionCount": "Número de secciones",
    "rangePro": "Este rango está disponible en Pro",
    "sectionRange": "Tu artículo tendrá entre {min} y {max} secciones.",
    "advanced": "Avanzado (opcional)",
    "advancedHint": "Estilo de imagen e instrucciones propias para el texto y la imagen destacada",
    "imageStyle": "Estilo de imagen",
    "infographicHint": "Las infografías necesitan GPT Image o Nano Banana",
    "articlePromptPlaceholder": "p. ej., Tono conversacional, pensado para principiantes y con una conclusión clara",
    "imagePromptPlaceholder": "p. ej., Un escritorio de madera con un portátil y una taza de café bajo la suave luz de la mañana",
    "imagePromptHint": "El estilo elegido arriba también se aplica a esta imagen, sin textos ni logotipos.",
    "start": "Empezar a escribir"
  },
  "publish": {
    "connect": "Conectar {platform}",
    "notConnected": "Tu sitio aún no está conectado a {platform}.",
    "publishTo": "Publicar en {platform}",
    "updateOn": "Actualizar en {platform}",
    "removeFrom": "Quitar de {platform}",
    "draftOn": "Borrador en {platform}",
    "viewOn": "Ver en {platform}",
    "checking": "Comprobando la conexión…",
    "finishFirst": "El artículo tiene que estar terminado antes de publicarlo.",
    "whenReady": "Podrás publicar en cuanto el artículo esté listo.",
    "publishing": "Publicando…",
    "publish": "Publicar",
    "updating": "Actualizando…",
    "updated": "Actualizado",
    "update": "Actualizar",
    "deleting": "Quitando…",
    "confirmDelete": "¿Seguro? Haz clic otra vez"
  },
  "page": {
    "missingId": "Falta el ID de la idea o del artículo.",
    "startFailed": "No pudimos empezar a escribir el artículo.",
    "noId": "El servidor no devolvió un ID de artículo.",
    "startError": "Algo salió mal al empezar el artículo.",
    "retryFailed": "El reintento no funcionó. Inténtalo de nuevo.",
    "regenFailed": "No pudimos reescribir esta sección.",
    "regenFailedRetry": "No pudimos reescribir esta sección. Inténtalo de nuevo.",
    "wpPublishFailed": "No se pudo publicar en WordPress.",
    "wpPublishFailedRetry": "No se pudo publicar en WordPress. Inténtalo de nuevo.",
    "wpUpdateFailed": "No se pudo actualizar en WordPress.",
    "wpUpdateFailedRetry": "No se pudo actualizar en WordPress. Inténtalo de nuevo.",
    "wpDeleteFailed": "No se pudo quitar de WordPress.",
    "wpDeleteFailedRetry": "No se pudo quitar de WordPress. Inténtalo de nuevo.",
    "checkingPlan": "Comprobando tu plan…",
    "preparing": "Preparando tu artículo…",
    "autoRefresh": "Esta página se actualiza sola, no hace falta recargarla."
  }
};

export default article;
