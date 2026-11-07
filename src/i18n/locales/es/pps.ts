import type en from "../en/pps";

const pps: typeof en = {
  "title": "SEO de fichas de producto",
  "subtitle": "Elige productos y detectaremos y completaremos lo que les falta. Tú revisas, editas y apruebas todo antes de que se guarde nada.",
  "fields": {
    "short_description": "Descripción corta",
    "description": "Descripción completa",
    "attributes": "Características",
    "tags": "Etiquetas del producto",
    "faq": "Preguntas frecuentes",
    "image_alts": "Texto alternativo de las imágenes",
    "seo_title": "Título SEO",
    "meta_description": "Metadescripción",
    "focus_keyword": "Palabra clave principal",
    "category_link": "Enlace a la categoría"
  },
  "status": {
    "pending": "En cola",
    "analyzing": "Analizando",
    "ready": "Requiere atención",
    "skipped": "Todo en orden",
    "approved": "Enviando",
    "published": "Publicado",
    "failed": "Error"
  },
  "source": {
    "seller": "Datos de tu tienda",
    "ai": "Sugerencia de la IA",
    "user": "Tu edición"
  },
  "stats": {
    "total": "Productos",
    "issues": "Con carencias"
  },
  "quota": {
    "exhausted": "Has usado todos los créditos del plan gratuito",
    "freePlan": "Plan gratuito: {count} productos",
    "used": "{used} de {total} productos usados",
    "remaining": "quedan {count}",
    "upgrade": "Pásate a Pro para optimizar hasta {count} productos a la vez.",
    "upgradeMore": "Pásate a Pro para seleccionar más",
    "selectionsUsed": "Has usado todas las selecciones del plan gratuito.",
    "selectMore": "Puedes seleccionar {count} productos más con el plan gratuito.",
    "perBatch": "Hasta {count} productos a la vez."
  },
  "results": "Resultados",
  "processing": "Procesando",
  "selectAllIssues": "Seleccionar todo lo que requiere atención",
  "selectProduct": "Seleccionar {name}",
  "deletedProduct": "Producto eliminado",
  "notFound": "No se encontró {field}",
  "missing": "Falta {field}",
  "review": "Revisar y completar",
  "clearSelection": "Borrar selección",
  "start": "Empezar a optimizar",
  "selectAll": "Seleccionar todo",
  "deselectAll": "Quitar selección",
  "noProducts": "Aún no hay productos sincronizados.",
  "showMore": "Ver más",
  "preview": "Vista previa",
  "issuesFound": "Lo que le falta a este producto",
  "aiNotice": "La IA sugirió este contenido y puede contener errores. Revísalo antes de aprobarlo y usa «Editar» para cambiar lo que quieras.",
  "sellerInput": "Solo tú puedes completar estos campos",
  "verifyNumbers": "Revisa estas cifras",
  "verifyNumbersBody": "Estas cifras aparecen en el texto pero no en los datos actuales de tu producto:",
  "selectAllFields": "Seleccionar todos los campos",
  "suggested": "Sugerido",
  "current": "Actual",
  "edited": "Editado",
  "unsaved": "Sin guardar",
  "restore": "Restaurar",
  "cancelEdit": "Cancelar edición",
  "unsavedHint": "Tienes cambios sin guardar: se guardarán automáticamente al pulsar «Corregir en tu sitio».",
  "approvedOnly": "Solo se actualizarán en tu producto los campos que apruebes.",
  "saveEdits": "Guardar cambios ({count})",
  "fixOnSite": "Corregir en tu sitio",
  "confirmDiscard": "Se perderán los cambios sin guardar. ¿Continuar?",
  "noAttributes": "Aún no hay características.",
  "attrName": "Nombre",
  "attrNameAria": "Nombre de la característica",
  "attrValue": "Valor",
  "attrValueAria": "Valor de la característica",
  "removeAttr": "Quitar característica",
  "addAttr": "Añadir característica",
  "tagsPlaceholder": "Separa las etiquetas con comas",
  "tagsHint": "Tus etiquetas actuales se mantienen; estas se añaden a ellas.",
  "removeQuestion": "Quitar pregunta",
  "addQuestion": "Añadir pregunta",
  "altAria": "Texto alternativo de la imagen {index}",
  "altHint": "Solo se envía para imágenes que aún no tienen texto alternativo. Los textos alternativos que ya existen en tu sitio no cambian.",
  "formatHint": "Deja una línea en blanco entre párrafos. Encabezados: «## Título» o «### Título» · Listas: «- Elemento»",
  "bulk": {
    "sending": "Enviando {done} de {total}",
    "fixSelected": "Corregir la selección en tu sitio",
    "done": {
      "one": "{count} producto aprobado y en camino a tu sitio",
      "other": "{count} productos aprobados y en camino a tu sitio"
    },
    "failed": "{count} con error",
    "more": "…y {count} más",
    "confirmTitle": "¿Aplicar todas las correcciones a la vez?",
    "confirmBody": "Todos los campos sugeridos de estos {count} productos —descripciones, características, etiquetas, preguntas frecuentes, textos alternativos y ajustes SEO— se enviarán directamente a tu sitio sin revisión individual. Como es contenido generado por IA, te recomendamos revisar al menos algunos con «Revisar y completar».",
    "confirm": "Confirmar y enviar"
  },
  "validation": {
    "attr": "Cada característica necesita un nombre y un valor.",
    "empty": "«{field}» no puede estar vacío.",
    "tagsMax": "Puedes añadir hasta {max} etiquetas.",
    "tagLength": "Cada etiqueta puede tener hasta {max} caracteres.",
    "faq": "Cada pregunta frecuente necesita una pregunta y una respuesta.",
    "faqLength": "Las preguntas pueden tener hasta {q} caracteres y las respuestas hasta {a}.",
    "altEmpty": "El texto alternativo no puede estar vacío.",
    "altLength": "El texto alternativo de cada imagen puede tener hasta {max} caracteres.",
    "maxLength": "«{field}» puede tener hasta {max} caracteres."
  },
  "errors": {
    "results": "No pudimos cargar los resultados SEO.",
    "products": "No pudimos cargar tus productos.",
    "start": "No pudimos iniciar la optimización.",
    "preview": "No pudimos cargar la vista previa.",
    "noFields": "No hay campos que enviar.",
    "restore": "No se pudo restaurar.",
    "noneSelected": "No hay campos seleccionados.",
    "submit": "No pudimos enviar los cambios."
  }
};

export default pps;
