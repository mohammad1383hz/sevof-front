import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Neues Ticket",
  "backToTickets": "Zurück zu den Tickets",
  "empty": "Noch keine Tickets. Über die Schaltfläche oben können Sie Ihr erstes eröffnen.",
  "messages": {
    "one": "{count} Nachricht",
    "other": "{count} Nachrichten"
  },
  "attachment": "Anhang {index}",
  "attachedImage": "Angehängtes Bild",
  "fullImage": "Bild in voller Größe",
  "closedNotice": "Dieses Ticket ist geschlossen. Für ein anderes Anliegen eröffnen Sie bitte ein neues Ticket.",
  "status": {
    "open": "Wartet auf unsere Antwort",
    "answered": "Beantwortet",
    "closed": "Geschlossen"
  },
  "topics": {
    "wordpress": "WordPress-Plugin",
    "api": "API",
    "bug": "Etwas funktioniert nicht",
    "billing": "Abrechnung & Zahlung"
  },
  "priority": {
    "low": "Niedrig",
    "normal": "Normal",
    "high": "Hoch"
  },
  "form": {
    "topic": "Wobei können wir helfen?",
    "subjectPlaceholder": "… oder eigenen Betreff eingeben",
    "description": "Beschreibung",
    "descriptionPlaceholder": "Beschreiben Sie Ihr Anliegen …",
    "phone": "Handynummer",
    "phoneHint": "Damit unser Team Sie zu diesem Ticket erreichen kann.",
    "image": "Screenshot (optional)",
    "addImage": "Bild hinzufügen",
    "imagesSelected": "{count}/{max} Bilder ausgewählt",
    "priority": "Priorität",
    "submit": "Ticket senden"
  },
  "reply": {
    "send": "Senden",
    "sendReply": "Antwort senden",
    "messagePlaceholder": "Ihre Nachricht …",
    "replyPlaceholder": "Ihre Antwort …",
    "staff": "Support",
    "you": "Sie",
    "photo": "Bild",
    "close": "Ticket schließen",
    "closing": "Wird geschlossen …"
  },
  "errors": {
    "load": "Ihre Tickets konnten nicht geladen werden.",
    "loadNetwork": "Verbindungsproblem beim Laden Ihrer Tickets.",
    "imagesOnly": "Es können nur Bilddateien angehängt werden.",
    "tooLarge": "„{name}“ ist größer als 4 MB.",
    "tooMany": "Sie können bis zu {max} Bilder anhängen.",
    "subjectRequired": "Bitte geben Sie einen Betreff ein.",
    "subjectMin": "Der Betreff muss mindestens {min} Zeichen lang sein.",
    "subjectMax": "Der Betreff darf höchstens {max} Zeichen lang sein.",
    "messageRequired": "Bitte beschreiben Sie Ihr Anliegen.",
    "messageMin": "Die Beschreibung muss mindestens {min} Zeichen lang sein.",
    "messageMax": "Die Beschreibung darf höchstens {max} Zeichen lang sein.",
    "phone": "Bitte geben Sie eine gültige Handynummer ein (z. B. 09xxxxxxxxx).",
    "submit": "Ihr Ticket konnte nicht gesendet werden.",
    "submitNetwork": "Verbindungsproblem beim Senden Ihres Tickets.",
    "notFound": "Ticket nicht gefunden.",
    "ticketNetwork": "Verbindungsproblem beim Laden dieses Tickets.",
    "reply": "Ihre Antwort konnte nicht gesendet werden.",
    "replyNetwork": "Verbindungsproblem beim Senden Ihrer Antwort."
  }
};

export default support;
