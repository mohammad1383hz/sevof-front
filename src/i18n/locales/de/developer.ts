import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "API-Schlüssel",
    "subtitle": "Erstellen Sie einen Schlüssel, um Ihre eigene Anwendung mit der öffentlichen API zu verbinden.",
    "docsLink": "API-Doku",
    "name": "Name des Schlüssels",
    "namePlaceholder": "z. B. Content-Server",
    "create": "Schlüssel erstellen",
    "creating": "Wird erstellt …",
    "created": "Der Schlüssel „{name}“ ist bereit. Kopieren Sie ihn jetzt – vollständig wird er nicht noch einmal angezeigt.",
    "copy": "Kopieren",
    "copied": "Kopiert",
    "gotIt": "Verstanden",
    "empty": "Noch keine Schlüssel. Erstellen Sie Ihren ersten über das Formular oben.",
    "cols": {
      "name": "Name",
      "key": "Schlüssel",
      "created": "Erstellt",
      "lastUsed": "Zuletzt verwendet",
      "site": "Website"
    },
    "active": "Aktiv",
    "revoked": "Widerrufen",
    "revoke": "Widerrufen",
    "revokeConfirm": "„{name}“ widerrufen? Jede Anwendung, die diesen Schlüssel nutzt, verliert sofort den Zugriff.",
    "errors": {
      "load": "Ihre API-Schlüssel konnten nicht geladen werden.",
      "loadNetwork": "Verbindungsproblem beim Laden Ihrer API-Schlüssel.",
      "create": "Der Schlüssel konnte nicht erstellt werden.",
      "createNetwork": "Verbindungsproblem beim Erstellen des Schlüssels.",
      "revoke": "Der Schlüssel konnte nicht widerrufen werden.",
      "revokeNetwork": "Verbindungsproblem beim Widerrufen des Schlüssels."
    },
    "sitesFailed": "Ihre Websites konnten nicht geladen werden.",
    "sitesLoading": "Wird geladen…",
    "noSites": "Noch keine Websites",
    "addSiteFirst": "Fügen Sie zuerst eine Website hinzu, um einen Schlüssel zu erstellen.",
    "legacySite": "Erste Website (älterer Schlüssel)"
  },
  "docs": {
    "title": "API-Dokumentation",
    "subtitle": "Verbinden Sie Ihre Anwendung mit der öffentlichen API und verwalten Sie Ihre Artikel.",
    "createKey": "API-Schlüssel erstellen",
    "auth": "Authentifizierung",
    "authBody": "Senden Sie Ihren API-Schlüssel bei jeder Anfrage in einem der beiden folgenden Formate mit. Schlüssel erstellen Sie auf der Seite „API-Schlüssel“ – jeder wird nur einmal angezeigt, bewahren Sie ihn also sicher auf.",
    "orEquivalent": "Oder gleichwertig:",
    "unauthorized": "Fehlt der Schlüssel oder ist er ungültig bzw. widerrufen, erhalten Sie eine {code}-Antwort:",
    "baseUrl": "Basis-URL",
    "endpoints": "Endpunkte",
    "listArticles": "Listet die Artikel der Website auf, zu der dieser Schlüssel gehört – die neuesten zuerst.",
    "showArticle": "Liefert einen Artikel vollständig, inklusive Abschnitten und Banner.",
    "createTask": "Legt eine Aufgabe zur Artikelerstellung an und startet sie im Hintergrund.",
    "taskStatus": "Liefert den Status einer Artikelerstellung. Ist sie abgeschlossen, enthält die Antwort article_id.",
    "notes": "Gut zu wissen",
    "note1": "Ein Schlüssel hat nur Zugriff auf die Artikel der Website, zu der er gehört.",
    "note2": "Wird ein Schlüssel widerrufen, endet sein Zugriff sofort.",
    "note3": "Für einen neuen Artikel legen Sie eine Aufgabe an und fragen ihren Status regelmäßig ab (etwa alle 30 Sekunden), statt auf eine einzige lange Anfrage zu warten."
  }
};

export default developer;
