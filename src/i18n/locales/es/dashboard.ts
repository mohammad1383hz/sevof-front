import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Ver",
  "noResults": "No hay resultados para tu búsqueda.",
  "page": {
    "title": "Panel de artículos",
    "subtitle": "Lo que tu agente de IA está haciendo en este sitio",
    "noSiteTitle": "Todavía no has añadido ningún sitio",
    "noSiteBody": "Añade un sitio para ver sus ideas, artículos y la actividad del piloto automático."
  },
  "errors": {
    "load": "No pudimos cargar el panel.",
    "network": "Problema de conexión: el panel no se pudo cargar.",
    "autopilot": "No pudimos actualizar el piloto automático.",
    "ideas": "Algo salió mal al generar las ideas.",
    "invalidSite": "Este enlace de sitio no es válido.",
    "ideasLoad": "No pudimos cargar las ideas de contenido.",
    "writtenLoad": "No pudimos cargar los artículos escritos.",
    "publishedLoad": "No pudimos cargar los artículos publicados.",
    "keywordsLoad": "No pudimos cargar las palabras clave."
  },
  "articleStatus": {
    "completed": "Completado",
    "failed": "Error",
    "pending": "En cola",
    "generating": "Escribiendo…"
  },
  "ideaStatus": {
    "approved": "Aprobada",
    "rejected": "Rechazada",
    "used": "Usada",
    "recommended": "Sugerida"
  },
  "publishStatus": {
    "published": "Publicado",
    "draft": "Borrador",
    "failed": "Error"
  },
  "stats": {
    "totalArticles": "Artículos en total",
    "published": "Publicados",
    "generating": "En proceso",
    "failed": "Con error",
    "avgSeo": "Puntuación SEO media",
    "totalWords": "Palabras escritas"
  },
  "recent": {
    "title": "Últimos artículos",
    "empty": "Aún no hay artículos.",
    "publishedOn": "Publicado el {date}"
  },
  "connection": {
    "checking": "Comprobando la conexión con tu sitio…",
    "switchBack": "Volver a {platform}",
    "connectVia": "Conectar con {platform}",
    "apiTitle": "Conectar con la API pública",
    "apiBody": "Crea y lee artículos desde tu propia aplicación, incluso sin WordPress ni Shopify. Documentación completa, ejemplos de código y guía de claves de API.",
    "docs": "Docs",
    "platform": "Plataforma de publicación",
    "comingSoon": "Próximamente",
    "soon": "pronto"
  },
  "opportunities": {
    "title": "Nuevas oportunidades",
    "discovering": "Buscando…",
    "discover": "Buscar nuevas oportunidades",
    "empty": "Aún no hay oportunidades. Pulsa «Buscar nuevas oportunidades» para empezar.",
    "generatedHint": "Artículo listo: lo encontrarás en tu lista de artículos",
    "generated": "Escrito",
    "generate": "Escribir artículo",
    "keywords": "Palabras clave encontradas",
    "entities": "Temas identificados"
  },
  "opportunitiesPage": {
    "title": "Oportunidades de contenido",
    "subtitle": "Ideas de artículos pensadas para tu sitio",
    "topic": "Tema",
    "entity": "Entidad principal",
    "competitor": "Competencia",
    "search": "Buscar temas o entidades…",
    "empty": "Aún no hay ideas de contenido."
  },
  "gap": {
    "uncovered": "Sin cubrir",
    "covered": "Ya cubierto",
    "reviewing": "Revisando"
  },
  "columns": {
    "title": "Título del artículo",
    "keyword": "Palabra clave objetivo",
    "words": "Palabras",
    "status": "Estado",
    "publishStatus": "Publicación",
    "date": "Fecha",
    "url": "URL publicada"
  },
  "written": {
    "title": "Artículos escritos",
    "subtitle": "Todo lo que el piloto automático ha escrito para tu sitio hasta ahora",
    "empty": "Aún no se ha escrito ningún artículo."
  },
  "published": {
    "title": "Artículos publicados",
    "subtitleShort": "Todos los intentos de publicación de tu agente",
    "subtitle": "Todos los intentos de publicación de tu agente: publicados, guardados como borrador o con error",
    "empty": "Todavía no se ha publicado nada.",
    "errorDetails": "Ver detalles del error"
  },
  "keywords": {
    "title": "Palabras clave",
    "subtitle": "Palabras clave que el piloto automático encontró para tu sitio",
    "keyword": "Palabra clave",
    "primary": "Principal",
    "difficulty": "Dificultad",
    "analyzing": "Estamos analizando tu sitio para encontrar palabras clave. Puede tardar un momento…",
    "empty": "Aún no hay palabras clave."
  },
  "difficulty": {
    "Low": "Fácil",
    "Medium": "Media",
    "High": "Difícil",
    "Unknown": "Desconocida"
  },
  "agent": {
    "status": {
      "idle": "En espera",
      "working": "Trabajando",
      "generatingIdeas": "Generando ideas",
      "writing": "Escribiendo un artículo",
      "waitingIdeas": "Esperando ideas puntuadas",
      "dailyLimit": "Límite diario alcanzado",
      "needsAnalysis": "Primero hace falta analizar el sitio",
      "unknown": "Desconocido"
    },
    "features": {
      "research": "Investigación de competencia y palabras clave",
      "daily": "Ideas y artículos nuevos cada día",
      "autoPublish": "Publicación automática",
      "scheduling": "Programación inteligente",
      "wordpress": "Publicación en WordPress con un clic"
    },
    "pipeline": {
      "badge": "Flujo de contenidos",
      "intro": "El piloto automático completa estos cuatro pasos uno tras otro, sin que tengas que hacer nada.",
      "keywordsTitle": "Encontrar palabras clave",
      "keywordsDesc": "Analiza tu sitio y detecta las palabras clave que importan",
      "ideasTitle": "Planificar ideas",
      "ideasDesc": "Convierte cada oportunidad en una idea de artículo",
      "writeTitle": "Escribir artículos",
      "writeDesc": "Escribe artículos completos y optimizados para SEO",
      "publishTitle": "Publicar",
      "publishDesc": "Publica los artículos en tu sitio de WordPress"
    },
    "stats": {
      "keywords": "Palabras clave encontradas",
      "opportunities": "Oportunidades encontradas",
      "written": "Artículos escritos",
      "published": "Artículos publicados"
    },
    "locked": {
      "badge": "Función Pro",
      "title": "Pon tu SEO en piloto automático con Pro",
      "body": "Vigila tu sitio las 24 horas, investiga a la competencia y las palabras clave, y escribe y publica por ti artículos optimizados para SEO.",
      "cta": "Pásate a Pro"
    },
    "enableTitle": "Activar el piloto automático",
    "enable": "Activar",
    "enabling": "Activando…",
    "onTitle": "El piloto automático está activo",
    "settings": "Ajustes"
  },
  "settings": {
    "title": "Ajustes del piloto automático",
    "publishStatus": "Cuando un artículo esté listo",
    "publishHint": "Los artículos se publican en cuanto se terminan de escribir.",
    "draftHint": "Los artículos quedan como borrador hasta que los revises y publiques.",
    "publishOptions": {
      "draft": "Guardar como borrador",
      "publish": "Publicar automáticamente"
    },
    "perCycle": "Artículos por ciclo",
    "perCycleHint": "Cuántos artículos se escriben en cada ciclo.",
    "schedule": "Frecuencia",
    "scheduleHint": "¿Cada cuánto debe funcionar el piloto automático?",
    "customInterval": "Cada cuántos días",
    "customIntervalHint": "Por ejemplo, 5 significa una vez cada 5 días.",
    "startTime": "Hora de inicio",
    "startTimeHint": "El piloto automático empieza a trabajar a esta hora.",
    "sectionCount": "Extensión del artículo",
    "sectionCountHint": "Define la estructura general de cada artículo.",
    "sections": {
      "short": "6–8 secciones (corto)",
      "medium": "8–10 secciones (medio)",
      "long": "10–12 secciones (largo)"
    },
    "intervalOptions": {
      "d1": "Todos los días",
      "d2": "Cada dos días",
      "d3": "Cada 3 días",
      "d7": "Una vez por semana",
      "custom": "Personalizado"
    },
    "interval": {
      "everyDay": "cada día",
      "everyOtherDay": "cada dos días",
      "everyWeek": "una vez por semana",
      "everyNDays": "cada {days} días"
    },
    "preview": {
      "short": "Tu programación: {count} artículos {interval}",
      "publish": "El piloto automático empieza a las {time} y, {interval}, escribe {count} artículos y los publica automáticamente.",
      "draft": "El piloto automático empieza a las {time} y, {interval}, escribe {count} artículos y los guarda como borrador para que los revises.",
      "publishWithImages": "El piloto automático empieza a las {time} y, {interval}, escribe {count} artículos con {images} imágenes cada uno y los publica automáticamente.",
      "draftWithImages": "El piloto automático empieza a las {time} y, {interval}, escribe {count} artículos con {images} imágenes cada uno y los guarda como borrador para que los revises."
    },
    "articleModel": "Modelo de redacción",
    "imagesTitle": "Imágenes para tus artículos",
    "imageModel": "Modelo de imagen",
    "imagesPerArticle": "Imágenes por artículo",
    "perImage": "por imagen",
    "perArticle": "por artículo",
    "credits": "{count} créditos",
    "recommended": "Recomendado",
    "decrease": "Reducir",
    "increase": "Aumentar",
    "advanced": "Avanzado",
    "advancedHint": "Tus propias instrucciones para artículos e imágenes (opcional)",
    "articlePrompt": "Instrucciones para el artículo",
    "articlePromptHint": "Déjalo vacío y el artículo se escribirá como siempre.",
    "articlePromptPlaceholder": "p. ej., Un tono cercano y desenfadado para principiantes",
    "imagePrompt": "Instrucciones para la imagen destacada",
    "imagePromptHint": "Déjalo vacío y el prompt se creará a partir del artículo.",
    "imagePromptPlaceholder": "p. ej., Colores cálidos, sin texto en la imagen",
    "summary": "De un vistazo",
    "save": "Guardar ajustes"
  },
  "wp": {
    "title": "Conexión con WordPress",
    "subtitle": "Publica artículos directamente en tu sitio de WordPress",
    "status": {
      "connected": "Conectado",
      "pending": "Pendiente de configurar",
      "disconnected": "Sin conectar"
    },
    "health": {
      "healthy": "Funciona bien",
      "unhealthy": "Error",
      "unreachable": "Inaccesible"
    },
    "verified": "Publicado en WordPress.org",
    "shownOnce": "Solo se muestra una vez",
    "copy": "Copiar {label}",
    "downloadLatest": "Descargar la última versión del plugin",
    "plugin": "Plugin de WordPress",
    "pluginBody": "Instala el plugin en tu sitio. Una vez conectado, los artículos se escriben y se publican por ti.",
    "download": "Descargar plugin",
    "credentials": {
      "title": "Tus datos de conexión",
      "body": "Pega estos tres valores en los ajustes del plugin de tu sitio: es todo lo que necesitas para publicar automáticamente.",
      "warning": "Cuando cierres esta ventana, el Client Secret ya no se volverá a mostrar. Si lo pierdes, usa «Reconectar» para obtener datos nuevos.",
      "done": "Ya los he guardado"
    },
    "checking": "Comprobando la conexión…",
    "empty": "Aún no hay ningún sitio de WordPress conectado",
    "emptyBody": "Al conectar obtendrás un Client ID y un Client Secret para introducir en el plugin de WordPress de tu sitio.",
    "connect": "Conectar WordPress",
    "waiting": "Esperando a que el plugin de WordPress se conecte",
    "waitingBody": "Introduce tu Client ID, tu API Key y tu Client Secret en los ajustes del plugin para terminar. ¿Los perdiste? Pulsa «Reconectar» para obtener otros nuevos.",
    "check": "Comprobar conexión",
    "newCredentials": "Generar nuevas credenciales",
    "siteUrl": "URL del sitio",
    "versions": "Versión de WordPress / del plugin",
    "pluginVersion": "plugin {version}",
    "healthTitle": "Estado",
    "lastCheck": "Última comprobación",
    "test": "Probar conexión",
    "reconnect": "Reconectar",
    "disconnect": "Desconectar",
    "disconnected": "WordPress desconectado",
    "testOk": "Todo en orden: tu sitio de WordPress responde.",
    "testBad": "Tu sitio de WordPress no respondió como se esperaba.",
    "confirmReconnectTitle": "¿Generar nuevos datos de conexión?",
    "confirmReconnectBody": "Tus datos actuales dejarán de funcionar y tendrás que introducir los nuevos en el plugin de WordPress.",
    "confirmDisconnectTitle": "¿Desconectar WordPress?",
    "confirmDisconnectBody": "Los artículos dejarán de publicarse automáticamente en este sitio. Para volver a conectar tendrás que repetir la configuración.",
    "errors": {
      "load": "No pudimos comprobar tu conexión con WordPress.",
      "loadNetwork": "Problema de conexión al comprobar WordPress.",
      "connect": "No pudimos conectar con WordPress.",
      "reconnect": "No se pudo reconectar.",
      "disconnect": "No pudimos desconectar.",
      "testNetwork": "Problema de conexión al probar la conexión."
    }
  },
  "mixin": {
    "title": "Conexión con Mixin",
    "subtitle": "Publica artículos directamente en tu tienda Mixin",
    "connected": "Mixin conectado",
    "disconnected": "Mixin desconectado",
    "testOk": "Todo en orden: Mixin responde.",
    "testBad": "Mixin no respondió como se esperaba.",
    "changeIntro": "Introduce un token nuevo. Lo probaremos antes de guardarlo; tu token actual seguirá activo si la prueba falla.",
    "connectIntro": "Introduce tu token de Mixin. Probaremos la conexión con tu tienda antes de guardar y te avisaremos si algo falla.",
    "siteUrl": "URL de la tienda",
    "currentToken": "Token actual",
    "token": "Token de Mixin",
    "tokenShort": "Token",
    "newToken": "Token nuevo",
    "tokenPlaceholder": "Pega aquí tu token",
    "newTokenPlaceholder": "Pega aquí tu token nuevo",
    "hideToken": "Ocultar token",
    "showToken": "Mostrar token",
    "testing": "Probando la conexión…",
    "testAndConnect": "Probar y conectar",
    "changeToken": "Cambiar token",
    "confirmTitle": "¿Desconectar Mixin?",
    "confirmBody": "Los artículos dejarán de publicarse automáticamente en Mixin. Para volver a conectar tendrás que introducir tu token de nuevo.",
    "errors": {
      "load": "No pudimos comprobar tu conexión con Mixin.",
      "loadNetwork": "Problema de conexión al comprobar Mixin.",
      "tokenShort": "Pega el token completo.",
      "connect": "No pudimos conectar con Mixin. Revisa la URL de la tienda y el token."
    }
  },
  "kwAnalysis": {
    "title": "Buscador de palabras clave",
    "steps": {
      "pending": "Solicitud recibida",
      "processing": "Obteniendo datos de Google Trends",
      "selecting": "La IA está eligiendo la mejor palabra clave",
      "done": "Preparando tus resultados"
    },
    "progress": "Analizando palabras clave ({done}/{total} revisadas)",
    "starting": "Empezando…",
    "note": "Ojo: Google Trends limita las consultas, así que cada palabra clave puede tardar hasta un minuto.",
    "processing": "En curso…",
    "completed": "Listo",
    "failed": "El análisis de palabras clave falló",
    "finalBadge": "Tu palabra clave",
    "suggestedTitle": "Título sugerido",
    "checked": "Palabras clave revisadas ({count})",
    "finalSelection": "Elegida",
    "fetched": "Datos recibidos",
    "fetchError": "No se pudieron obtener datos",
    "topQueries": "Búsquedas relacionadas principales",
    "risingQueries": "Búsquedas en aumento",
    "noData": "Sin datos",
    "breakout": "En auge",
    "backToAnalysis": "Volver al análisis del sitio",
    "errors": {
      "status": "No pudimos obtener el estado del análisis.",
      "start": "No pudimos iniciar el análisis de palabras clave.",
      "site": "No pudimos cargar los datos del sitio."
    }
  },
  "shopify": {
    "title": "Conexión con Shopify",
    "subtitle": "Publica artículos de blog y correcciones SEO de productos directamente en tu tienda Shopify",
    "connected": "Conectado",
    "loadFailed": "No se pudo cargar la conexión con Shopify.",
    "connectedBanner": "Tu tienda Shopify está conectada. Estamos importando tus productos.",
    "invalidShop": "Introduce la dirección de tu tienda, p. ej. tu-tienda.myshopify.com.",
    "installFailed": "No se pudo iniciar la conexión con Shopify. Inténtalo de nuevo.",
    "testOk": "Todo bien: tu tienda responde.",
    "testBad": "Shopify no respondió como se esperaba.",
    "disconnected": "Tienda Shopify desconectada.",
    "disconnectFailed": "No se pudo desconectar la tienda.",
    "store": "Tienda",
    "storefront": "Escaparate",
    "connectedHelp": "Los artículos se publican en el blog de tu tienda y las correcciones de producto aprobadas actualizan tus productos de Shopify. Tus productos se sincronizan automáticamente cada noche.",
    "confirmTitle": "¿Desconectar Shopify?",
    "confirmBody": "La app de Sevof se eliminará de tu tienda. Los artículos ya publicados se quedan en tu blog.",
    "disconnecting": "Desconectando…",
    "disconnect": "Desconectar",
    "cancel": "Cancelar",
    "test": "Probar conexión",
    "notConfigured": "La publicación en Shopify aún no está disponible en este servidor. Contacta con soporte.",
    "intro": "Introduce la dirección de tu tienda y aprueba la app de Sevof en Shopify. Al terminar volverás aquí.",
    "shopLabel": "Dirección de la tienda",
    "shopHint": "Tu dirección myshopify.com: la encontrarás en el admin de Shopify, en Configuración → Dominios.",
    "redirecting": "Abriendo Shopify…",
    "connect": "Conectar Shopify",
    "permissions": "Sevof solo pide acceso a tu blog, tus productos y tus archivos. Puedes quitar la app de Shopify cuando quieras.",
    "pickTitle": "Conecta tu tienda Shopify",
    "pickBody": "Elige el sitio de Sevof al que pertenece esta tienda. Después aprobarás la app en Shopify.",
    "noSites": "Aún no tienes ningún sitio en Sevof. Primero añade el dominio de tu tienda y vuelve.",
    "addSite": "Añadir un sitio"
  }
};

export default dashboard;
