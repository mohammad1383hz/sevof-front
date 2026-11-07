import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Nuevo ticket",
  "backToTickets": "Volver a los tickets",
  "empty": "Aún no tienes tickets. Usa el botón de arriba para abrir el primero.",
  "messages": {
    "one": "{count} mensaje",
    "other": "{count} mensajes"
  },
  "attachment": "Adjunto {index}",
  "attachedImage": "Imagen adjunta",
  "fullImage": "Imagen a tamaño completo",
  "closedNotice": "Este ticket está cerrado. Abre uno nuevo si necesitas ayuda con otra cosa.",
  "status": {
    "open": "Esperando nuestra respuesta",
    "answered": "Respondido",
    "closed": "Cerrado"
  },
  "topics": {
    "wordpress": "Plugin de WordPress",
    "api": "API",
    "bug": "Algo no funciona",
    "billing": "Facturación y pagos"
  },
  "priority": {
    "low": "Baja",
    "normal": "Normal",
    "high": "Alta"
  },
  "form": {
    "topic": "¿En qué podemos ayudarte?",
    "subjectPlaceholder": "…o escribe tu propio asunto",
    "description": "Detalles",
    "descriptionPlaceholder": "Cuéntanos qué está pasando…",
    "phone": "Número de móvil",
    "phoneHint": "Para que nuestro equipo pueda contactarte sobre este ticket.",
    "image": "Captura de pantalla (opcional)",
    "addImage": "Añadir imagen",
    "imagesSelected": "{count}/{max} imágenes seleccionadas",
    "priority": "Prioridad",
    "submit": "Enviar ticket"
  },
  "reply": {
    "send": "Enviar",
    "sendReply": "Enviar respuesta",
    "messagePlaceholder": "Escribe tu mensaje…",
    "replyPlaceholder": "Escribe tu respuesta…",
    "staff": "Soporte",
    "you": "Tú",
    "photo": "Imagen",
    "close": "Cerrar ticket",
    "closing": "Cerrando…"
  },
  "errors": {
    "load": "No pudimos cargar tus tickets.",
    "loadNetwork": "Problema de conexión al cargar tus tickets.",
    "imagesOnly": "Solo se pueden adjuntar imágenes.",
    "tooLarge": "«{name}» pesa más de 4 MB.",
    "tooMany": "Puedes adjuntar hasta {max} imágenes.",
    "subjectRequired": "Escribe un asunto.",
    "subjectMin": "El asunto necesita al menos {min} caracteres.",
    "subjectMax": "El asunto puede tener como máximo {max} caracteres.",
    "messageRequired": "Describe tu problema.",
    "messageMin": "Los detalles necesitan al menos {min} caracteres.",
    "messageMax": "Los detalles pueden tener como máximo {max} caracteres.",
    "phone": "Introduce un número de móvil válido (p. ej., 09xxxxxxxxx).",
    "submit": "No pudimos enviar tu ticket.",
    "submitNetwork": "Problema de conexión al enviar tu ticket.",
    "notFound": "No encontramos el ticket.",
    "ticketNetwork": "Problema de conexión al cargar este ticket.",
    "reply": "No pudimos enviar tu respuesta.",
    "replyNetwork": "Problema de conexión al enviar tu respuesta."
  }
};

export default support;
