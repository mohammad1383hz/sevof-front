import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Borrar búsqueda",
  "errors": {
    "server": "No pudimos conectar con el servidor. Inténtalo de nuevo.",
    "serverShort": "No pudimos conectar con el servidor."
  },
  "styles": {
    "price": "Precio y presupuesto",
    "comparison": "Comparativa de productos",
    "buying_guide": "Guía de compra"
  },
  "steps": {
    "brief": "Análisis y brief",
    "briefHint": "Estudio de productos y audiencia",
    "plan": "Planificación",
    "planHint": "Asignación de productos a secciones",
    "sections": "Redacción",
    "sectionsHint": "Una sección cada vez",
    "written": "{done} de {total} secciones escritas"
  },
  "idea": {
    "internalLink": "Enlace interno",
    "viewProgress": "Ver progreso",
    "generated": "Artículo listo",
    "failed": "Falló la redacción",
    "viewRetry": "Ver y reintentar",
    "paused": "En pausa (sin créditos)"
  },
  "outline": {
    "title": "Estructura del artículo",
    "building": "Creando la estructura…",
    "approxWords": "≈ {count} palabras",
    "written": "{done} de {total} escritas",
    "untitled": "Sin título",
    "target": "Objetivo: {count} palabras",
    "keyPoints": "Puntos clave",
    "types": {
      "product": "Presentación de producto",
      "products": "Presentación de productos",
      "comparison": "Comparativa",
      "buyingGuide": "Guía de compra",
      "guide": "Guía"
    }
  },
  "editIdea": {
    "subtitle": "Define el título, los productos y el enlace interno del artículo.",
    "titleHint": "Pon la palabra clave principal al principio. Los títulos de menos de {max} caracteres se ven completos en Google.",
    "products": "Productos del artículo",
    "needProduct": "Añade al menos un producto.",
    "removeProduct": "Quitar {name}",
    "changeProducts": "Añadir o cambiar productos",
    "link": "Enlace interno",
    "linkHint": "El artículo enlazará a esta página de la tienda; lo ideal es la categoría principal de esos productos.",
    "categoriesError": "No pudimos cargar tus categorías, así que el enlace actual se mantiene.",
    "missingCategory": "La categoría del enlace actual ya no existe. Elige otra.",
    "pickTitle": "Elige los productos del artículo",
    "pickSubtitle": "Los productos que destacará este artículo.",
    "pickConfirm": "Usar estos productos"
  },
  "category": {
    "filterPrefix": "Categoría:",
    "linkPrefix": "Enlaza a:",
    "all": "Todas las categorías",
    "home": "Inicio de la tienda",
    "filterNote": "Al elegir una categoría también se incluyen los productos de sus subcategorías.",
    "linkNote": "El artículo enlazará a esta página.",
    "none": "Sin categorías",
    "select": "Elige una categoría",
    "search": "Buscar categorías",
    "searchPlaceholder": "Buscar categorías…",
    "empty": "No se encontraron categorías",
    "emptyHint": "Prueba con otra búsqueda.",
    "collapse": "Ocultar subcategorías",
    "expand": "Mostrar subcategorías",
    "removeFilter": "Quitar filtro de categoría",
    "backHome": "Volver al inicio de la tienda"
  },
  "picker": {
    "loadFailed": "No pudimos cargar tus productos.",
    "addFailed": "No pudimos añadir este producto.",
    "alreadySelected": "Este producto ya está seleccionado.",
    "addedAtLimit": "Se añadió el producto, pero has llegado al límite de selección. Quita uno y luego elige este en la lista.",
    "existingSelected": "Este producto ya estaba en tu catálogo y ahora está seleccionado.",
    "addedSelected": "Producto añadido y seleccionado.",
    "manualTitle": "Añadir un producto por URL",
    "manualHint": "¿No encuentras un producto? Pega la URL de su página para añadirlo y seleccionarlo.",
    "manualBody": "Copia la URL de la ficha del producto en tu tienda y pégala aquí. Obtendremos sus datos y lo seleccionaremos por ti.",
    "closeManual": "Cerrar",
    "url": "URL del producto",
    "add": "Añadir",
    "search": "Buscar productos",
    "searchPlaceholder": "Buscar por nombre de producto…",
    "selected": "Productos seleccionados",
    "limit": "límite alcanzado",
    "count": "{count} de {max} seleccionados",
    "clear": "Vaciar",
    "empty": "No se encontraron productos",
    "emptyHint": "Prueba con otra búsqueda o categoría.",
    "more": "Cargar más productos"
  },
  "modal": {
    "title": "Elige cómo se escribe tu artículo de producto",
    "imageModel": "Modelo para la imagen destacada",
    "featuredImage": "Imagen destacada",
    "articlePromptPlaceholder": "p. ej., Céntrate en los beneficios del producto, usa un tono cercano y añade unas preguntas frecuentes al final",
    "imagePromptPlaceholder": "p. ej., El producto sobre una mesa de madera bajo la suave luz de la mañana"
  },
  "body": {
    "saveFailed": "No se pudo guardar.",
    "product": "Producto",
    "productNumber": "Producto n.º {id}",
    "inStock": "En stock",
    "outOfStock": "Agotado",
    "viewProduct": "Ver y comprar",
    "recommended": "Productos recomendados",
    "seoScore": "Puntuación SEO: {score}",
    "writingSection": "Escribiendo esta sección…",
    "noContent": "Aún no hay nada escrito.",
    "schema": "Esquema de producto"
  },
  "seo": {
    "defaultPrompt": "Sugiere ideas de artículos SEO y recomienda productos a partir de los más vendidos y las categorías principales de la tienda.",
    "manualPrompt": "Sugiere ideas de artículos SEO para los productos que he seleccionado.",
    "benefits": {
      "introTitle": "Da a conocer tus productos",
      "introText": "Artículos que presentan tus productos a los compradores.",
      "googleTitle": "Que te encuentren en Google",
      "googleText": "Atrae más compradores a tu tienda desde los buscadores.",
      "salesTitle": "Vende más",
      "salesText": "Convierte lectores en clientes sin esfuerzo."
    },
    "heroTitle": "Artículos que venden los productos de {store}",
    "yourStore": "tu tienda",
    "heroBody": "Esta herramienta propone y escribe artículos sobre los productos de tu tienda: artículos que los presentan, atraen compradores desde Google y te ayudan a vender más.",
    "working": "Estoy revisando tus productos y preparando ideas. Suele tardar menos de un minuto.",
    "editIdea": "Editar idea (título, productos, enlace interno)",
    "backToIdeas": "Volver a las ideas",
    "selectionMethod": "Cómo elegir los productos",
    "auto": "Elegir por mí",
    "manual": "Elegir productos",
    "autoHint": "Elegiremos los mejores productos por ti.",
    "manualHint": "Las ideas solo tratarán los productos que elijas.",
    "requestAria": "Pedir ideas de artículos",
    "placeholderManual": "Opcional: ¿qué enfoque quieres para los artículos?",
    "placeholderAuto": "¿Qué tipo de artículo quieres? (Déjalo vacío y te sugeriré uno)",
    "generate": "Obtener ideas",
    "keyHint": "Enter para enviar · Mayús+Enter para una nueva línea",
    "pickTitle": "Elige productos para tus ideas",
    "pickSubtitle": "Las ideas de artículos se crearán solo para los productos que elijas aquí.",
    "pickConfirm": "Confirmar",
    "selectedCount": {
      "one": "{count} producto seleccionado",
      "other": "{count} productos seleccionados"
    },
    "requestIn": "¡Recibido! Tus ideas ya están en camino.",
    "errors": {
      "slow": "Las ideas están tardando más de lo normal. Inténtalo de nuevo.",
      "open": "No pudimos abrir este chat.",
      "create": "No pudimos iniciar un chat nuevo."
    }
  },
  "page": {
    "preparing": "Preparando tu artículo de producto…"
  }
};

export default product;
