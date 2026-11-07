import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "El análisis no se completó",
  "phase": {
    "queued": "Solicitud recibida",
    "crawling": "Leyendo las páginas de tu sitio…",
    "analyzing": "Analizando tu contenido…",
    "done": "Análisis completado"
  },
  "ideaSteps": {
    "connecting": "Conectando con las fuentes de datos (Google Trends, Autocompletar, SERP)",
    "keywords": "Puntuando palabras clave en torno a tus temas principales",
    "generating": "Creando ideas de artículos con IA",
    "scoring": "Evaluando la competencia y calculando la puntuación SEO"
  },
  "empty": {
    "title": "Analiza tu sitio",
    "body": "Escribe un dominio abajo y descubriremos tu sector, resumiremos tu contenido y trazaremos los temas clave (entidades) que tratas.",
    "tagEntities": "Análisis de entidades",
    "tagIdeas": "Ideas de artículos"
  },
  "input": {
    "placeholder": "ejemplo.com — la dirección de tu sitio",
    "submit": "Analizar"
  },
  "progress": {
    "title": "Procesando",
    "inProgress": "En curso…",
    "done": "Listo",
    "hint": "Suele tardar unos minutos."
  },
  "ideasBar": {
    "limit": "Has alcanzado tu límite de generación de ideas",
    "generating": "Escribiendo…",
    "cta": "Buscar oportunidades de artículos"
  },
  "ideas": {
    "ready": {
      "one": "{count} idea lista",
      "other": "{count} ideas listas"
    },
    "preparing": "Preparando…",
    "generatingTitle": "Generando ideas de artículos",
    "retrying": "Reintentando…",
    "retry": "Intentar de nuevo"
  },
  "chat": {
    "yourRequest": "Tu solicitud",
    "preparingIdeas": "Preparando ideas para tu sitio…",
    "articleHeader": "Escribiendo un artículo en este chat",
    "assistant": "Asistente de estrategia de contenidos",
    "selectedEntity": "Tema elegido: {name}",
    "preparing": "Iniciando un chat nuevo…"
  },
  "research": {
    "failed": "La investigación de contenidos no se completó",
    "clustersTitle": "Creando clústeres de palabras clave",
    "gapsTitle": "Analizando la competencia y los huecos de contenido",
    "clusters": "Clústeres de palabras clave",
    "gapsResult": "Huecos de contenido y análisis de la competencia",
    "clusterSteps": {
      "read": "Leyendo los temas y palabras clave de tu sitio",
      "build": "Agrupando búsquedas en clústeres",
      "estimate": "Estimando oportunidades y tendencias"
    },
    "gapSteps": {
      "context": "Entendiendo tu negocio",
      "competitors": "Encontrando a tu competencia real",
      "gaps": "Detectando huecos de contenido"
    },
    "intent": {
      "informational": "Informativa",
      "commercial": "Comercial",
      "transactional": "Transaccional",
      "navigational": "Navegacional"
    },
    "coverage": {
      "missing": "No aparece en Google",
      "weak": "Posiciona mal",
      "low": "Posiciona bajo"
    },
    "level": {
      "low": "baja",
      "medium": "media",
      "high": "alta"
    },
    "priority": {
      "high": "Prioridad alta",
      "medium": "Prioridad media",
      "low": "Prioridad baja"
    },
    "difficulty": {
      "unavailable": "No disponible en esta fuente",
      "estimated": "{score}/100 · estimación de la IA"
    },
    "volumeEstimate": "Estimación de la IA",
    "volumeObserved": "Impresiones reales",
    "trend": "Tendencia",
    "trendNeedsTwo": "Se necesitan dos periodos para comparar",
    "trendUnavailable": "Sin estimación de tendencia",
    "stats": {
      "competitors": "Competidores reales",
      "opportunities": "Oportunidades de contenido",
      "avgScore": "Puntuación media de oportunidad",
      "highThreat": "Competidores de alto riesgo"
    },
    "strengths": "Lo que tu sitio hace bien",
    "weaknesses": "Dónde puedes mejorar",
    "visibility": "Visibilidad en buscadores",
    "depth": "Profundidad del contenido",
    "opportunitiesTitle": "Oportunidades de contenido (ordenadas según resultados reales de Google)",
    "takeAction": "Aprovecharla",
    "recommendedAction": "Enfoque recomendado",
    "competitorSites": "Sitios de la competencia ({count})",
    "rank": "Posición {rank}",
    "rankUnavailable": "Posición desconocida",
    "sharedKeywords": {
      "one": "{count} palabra clave en común",
      "other": "{count} palabras clave en común"
    },
    "moreDetails": "Más detalles",
    "missing": "Lo que le falta a tu sitio",
    "recommendations": "Recomendaciones generales",
    "action": "Siguiente paso: {action}",
    "fullReport": "Abrir el informe completo",
    "opportunityScore": "Oportunidad {score}/100",
    "threat": "Riesgo: {level}",
    "received": "¡Recibido! Los resultados de la investigación aparecerán aquí mismo, en este chat."
  },
  "entities": {
    "title": "Temas encontrados",
    "empty": "Aún no se han encontrado temas."
  },
  "request": {
    "title": "Solicitud de análisis de contenido",
    "body": "La IA analiza tu contenido y a tu competencia para descubrir nuevas oportunidades"
  },
  "summary": {
    "title": "Resultados del análisis",
    "industry": "Sector: {niche}"
  },
  "user": {
    "start": "Analizar este sitio"
  },
  "idea": {
    "edit": "Editar idea",
    "editShort": "Editar",
    "save": "Guardar cambios",
    "category": "Categoría:",
    "noLinks": "No se encontraron enlaces internos",
    "linksLabel": "Enlaces internos:",
    "linksHint": "El artículo final enlazará a estas páginas",
    "viewArticle": "Ver artículo",
    "viewArticleHint": "Abrir el artículo escrito a partir de esta idea",
    "generatingHint": "Se está escribiendo un artículo a partir de esta idea",
    "fields": {
      "title": "Título",
      "titlePlaceholder": "Título de la idea",
      "hook": "Gancho",
      "hookPlaceholder": "Una primera frase que enganche al lector",
      "meta": "Metadescripción",
      "metaPlaceholder": "Un breve resumen para los resultados de búsqueda",
      "tags": "Etiquetas",
      "tagsHint": "(separadas por comas)",
      "tagsPlaceholder": "SEO, marketing, contenidos",
      "links": "Enlaces internos",
      "linkTitle": "Texto del enlace",
      "related": "Relacionados",
      "removeLink": "Quitar enlace",
      "addLink": "Añadir enlace relacionado",
      "outline": "Estructura",
      "outlineHint": "(un encabezado por línea)"
    },
    "score": {
      "entity": "Relevancia del tema",
      "intent": "Intención de búsqueda",
      "business": "Valor para el negocio",
      "serp": "Margen para competir en Google",
      "summary": "En resumen:"
    },
    "errors": {
      "save": "No pudimos guardar tus cambios. Inténtalo de nuevo."
    }
  },
  "gsc": {
    "connect": "Conectar Google Search Console",
    "reconnect": "Reconectar Google Search Console",
    "title": "Datos en vivo de Google Search Console",
    "body": "Lleva a tu investigación de contenidos tus búsquedas, impresiones, clics, CTR y posiciones reales, con acceso de solo lectura.",
    "connected": "Cuenta conectada",
    "showProperties": "Mostrar mis sitios verificados",
    "selectProperty": "Elige una propiedad",
    "connectProperty": "Usar este sitio",
    "lastSynced": "Última sincronización: {date}",
    "noData": "Todavía no hay datos.",
    "syncing": "Obteniendo…",
    "sync": "Sincronizar ahora",
    "impressions": "Impresiones",
    "clicks": "Clics",
    "topQueries": "Búsquedas principales por impresiones",
    "queryStats": "{impressions} impresiones · posición {position}",
    "errors": {
      "start": "No pudimos iniciar la conexión con Google Search Console.",
      "properties": "No pudimos cargar tus sitios de Search Console.",
      "select": "No pudimos conectar esa propiedad.",
      "sync": "No pudimos iniciar la sincronización con Search Console.",
      "disconnect": "No pudimos desconectar Search Console."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Sugerir temas de artículos",
      "prompt": "Dame oportunidades de contenido concretas y accionables basadas en las tendencias relevantes para este sitio."
    },
    "gap": {
      "label": "Análisis de huecos frente a la competencia",
      "prompt": "Analiza a los competidores relevantes de este sitio y sus principales huecos de contenido. Para cada hueco, explica por qué importa, qué tan grande es la amenaza y propón un enfoque para cubrirlo."
    },
    "limit": "Mejora tu plan para continuar.",
    "choosePath": "Elige un tipo de investigación",
    "gscConnect": "Conectar Search Console",
    "connectGoogle": "Conectar cuenta de Google",
    "loadingSites": "Cargando sitios…",
    "showSites": "Mostrar mis sitios",
    "select": "Elegir",
    "queriesReceived": "{count} búsquedas recibidas",
    "loadingData": "Cargando datos…",
    "readyToFetch": "Conectado: listo para obtener datos",
    "fetch": "Obtener datos",
    "connectedQueries": "Search Console conectado · {count} búsquedas",
    "fetchingGsc": "Obteniendo datos de Search Console…",
    "gscConnected": "Search Console conectado",
    "placeholder": "Haz una pregunta o cuéntanos qué necesitas…",
    "send": "Enviar"
  },
  "credits": {
    "banner": "Has agotado tus créditos gratuitos del asistente de contenidos. {still} Elige un plan para seguir chateando.",
    "bannerStill": "Aún puedes escribir artículos a partir de las ideas que ya tienes.",
    "viewPlans": "Ver planes",
    "chatFree": "Has agotado tus créditos gratuitos del asistente de contenidos, así que no puedes hacer nuevas preguntas, pero sí escribir artículos a partir de las ideas que ya tienes. Para seguir chateando, elige un plan en la página de suscripción (/subscription).",
    "chatPaid": "No te quedan créditos para el asistente de contenidos, pero aún puedes escribir artículos a partir de las ideas que ya tienes. Recarga o mejora tu plan en la página de suscripción (/subscription).",
    "shortFree": "Has agotado tus créditos gratuitos. Suscríbete para seguir.",
    "shortPaid": "Te has quedado sin créditos. Recarga o mejora tu plan.",
    "barFree": "Se agotaron tus créditos gratuitos del asistente de contenidos. Suscríbete para seguir.",
    "barPaid": "No tienes créditos suficientes para el análisis de contenido. Recarga o mejora tu plan."
  },
  "entity": {
    "pick": "Elige un tema",
    "pickPrompt": "Para encontrar oportunidades precisas y crear los enlaces internos adecuados, elige el tema (entidad) en el que nos vamos a centrar.",
    "confirmed": "¡Perfecto, tu solicitud está en marcha! Los resultados se centrarán solo en el tema elegido y cada artículo enlazará a su página correspondiente en tu sitio."
  },
  "gapPrompt": "Crea una idea de contenido y su plan para esta oportunidad, detectada al comparar con resultados reales de Google:\nOportunidad: {title}\nBúsqueda objetivo: {query}\nDetalles: {details}\nEnfoque sugerido: {angle}",
  "gapLabel": "Aprovechar: {title}",
  "article": {
    "request": "Escribe un artículo para la idea «{title}».",
    "started": "El artículo se está escribiendo en este chat."
  },
  "nav": {
    "previous": "Mensaje anterior",
    "next": "Mensaje siguiente",
    "latest": "Ir al último mensaje",
    "latestShort": "Último"
  },
  "welcome": {
    "title": "Agente SEO de {domain}",
    "hello": "¡Hola! Soy el asistente SEO de {domain}.",
    "what": "Puedo investigar las palabras clave que importan, descubrir nuevas oportunidades de contenido, analizar a tu competencia y proponerte temas para hacer crecer tu sitio.",
    "ask": "Pregúntame lo que quieras sobre SEO o el contenido de tu sitio."
  },
  "errors": {
    "saveMessage": "No pudimos guardar ese mensaje.",
    "researchResults": "No pudimos cargar los resultados de la investigación.",
    "history": "No pudimos cargar el historial de este chat.",
    "startSession": "No pudimos iniciar el chat de análisis para este sitio.",
    "research": "La solicitud de investigación de contenidos no se completó.",
    "opportunities": "La solicitud de oportunidades de contenido no se completó.",
    "retry": "El reintento no funcionó.",
    "status": "No pudimos obtener el estado del análisis.",
    "domainRequired": "Escribe un dominio, como ejemplo.com.",
    "domainInvalid": "Escribe solo el dominio, sin http:// ni rutas, como ejemplo.com.",
    "addDomain": "No pudimos añadir este dominio."
  }
};

export default analyze;
