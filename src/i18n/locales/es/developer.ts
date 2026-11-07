import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "Claves de API",
    "subtitle": "Crea una clave para conectar tu propia aplicación con la API pública.",
    "docsLink": "Documentación de la API",
    "name": "Nombre de la clave",
    "namePlaceholder": "p. ej., Servidor de contenidos",
    "create": "Crear clave",
    "creating": "Creando…",
    "created": "La clave «{name}» está lista. Cópiala ahora: no podrás volver a verla completa.",
    "copy": "Copiar",
    "copied": "Copiada",
    "gotIt": "Entendido",
    "empty": "Aún no hay claves. Crea la primera con el formulario de arriba.",
    "cols": {
      "name": "Nombre",
      "key": "Clave",
      "created": "Creada",
      "lastUsed": "Último uso",
      "site": "Sitio"
    },
    "active": "Activa",
    "revoked": "Revocada",
    "revoke": "Revocar",
    "revokeConfirm": "¿Revocar «{name}»? Cualquier aplicación que la use perderá el acceso al instante.",
    "errors": {
      "load": "No pudimos cargar tus claves de API.",
      "loadNetwork": "Problema de conexión al cargar tus claves de API.",
      "create": "No pudimos crear la clave.",
      "createNetwork": "Problema de conexión al crear la clave.",
      "revoke": "No pudimos revocar la clave.",
      "revokeNetwork": "Problema de conexión al revocar la clave."
    },
    "sitesFailed": "No se pudieron cargar tus sitios.",
    "sitesLoading": "Cargando…",
    "noSites": "Aún no hay sitios",
    "addSiteFirst": "Primero añade un sitio para crear una clave.",
    "legacySite": "Primer sitio (clave antigua)"
  },
  "docs": {
    "title": "Documentación de la API",
    "subtitle": "Conecta tu aplicación con la API pública y gestiona tus artículos.",
    "createKey": "Crear clave de API",
    "auth": "Autenticación",
    "authBody": "Envía tu clave de API en cada solicitud, en cualquiera de los dos formatos de abajo. Las claves se crean en la página «Claves de API»; cada una se muestra solo una vez, así que guárdala en un lugar seguro.",
    "orEquivalent": "O, de forma equivalente:",
    "unauthorized": "Si la clave falta, no es válida o fue revocada, recibirás una respuesta {code}:",
    "baseUrl": "URL base",
    "endpoints": "Endpoints",
    "listArticles": "Lista los artículos del sitio al que pertenece esta clave, empezando por los más recientes.",
    "showArticle": "Devuelve un artículo completo, con sus secciones y su banner.",
    "createTask": "Crea una tarea de generación de artículo y la inicia en segundo plano.",
    "taskStatus": "Devuelve el estado de una tarea de generación. Cuando termina, la respuesta incluye article_id.",
    "notes": "Ten en cuenta",
    "note1": "Una clave solo accede a los artículos del sitio al que pertenece.",
    "note2": "Al revocar una clave, su acceso se corta de inmediato.",
    "note3": "Para generar un artículo, crea una tarea y consulta su estado cada cierto tiempo (por ejemplo, cada 30 segundos) en lugar de esperar una única solicitud larga."
  }
};

export default developer;
