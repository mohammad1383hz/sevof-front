import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Nuovo ticket",
  "backToTickets": "Torna ai ticket",
  "empty": "Ancora nessun ticket. Usa il pulsante qui sopra per aprire il primo.",
  "messages": {
    "one": "{count} messaggio",
    "other": "{count} messaggi"
  },
  "attachment": "Allegato {index}",
  "attachedImage": "Immagine allegata",
  "fullImage": "Immagine a dimensione intera",
  "closedNotice": "Questo ticket è chiuso. Aprine uno nuovo se ti serve aiuto per altro.",
  "status": {
    "open": "In attesa di risposta",
    "answered": "Risposto",
    "closed": "Chiuso"
  },
  "topics": {
    "wordpress": "Plugin WordPress",
    "api": "API",
    "bug": "Qualcosa non funziona",
    "billing": "Fatturazione e pagamenti"
  },
  "priority": {
    "low": "Bassa",
    "normal": "Normale",
    "high": "Alta"
  },
  "form": {
    "topic": "Come possiamo aiutarti?",
    "subjectPlaceholder": "…oppure scrivi il tuo oggetto",
    "description": "Dettagli",
    "descriptionPlaceholder": "Raccontaci cosa sta succedendo…",
    "phone": "Numero di cellulare",
    "phoneHint": "Così il nostro team può contattarti per questo ticket.",
    "image": "Screenshot (facoltativo)",
    "addImage": "Aggiungi immagine",
    "imagesSelected": "{count}/{max} immagini selezionate",
    "priority": "Priorità",
    "submit": "Invia ticket"
  },
  "reply": {
    "send": "Invia",
    "sendReply": "Invia risposta",
    "messagePlaceholder": "Scrivi il tuo messaggio…",
    "replyPlaceholder": "Scrivi la tua risposta…",
    "staff": "Assistenza",
    "you": "Tu",
    "photo": "Immagine",
    "close": "Chiudi ticket",
    "closing": "Chiusura…"
  },
  "errors": {
    "load": "Impossibile caricare i tuoi ticket.",
    "loadNetwork": "Problema di connessione durante il caricamento dei ticket.",
    "imagesOnly": "Puoi allegare solo immagini.",
    "tooLarge": "«{name}» supera i 4 MB.",
    "tooMany": "Puoi allegare fino a {max} immagini.",
    "subjectRequired": "Inserisci un oggetto.",
    "subjectMin": "L'oggetto deve avere almeno {min} caratteri.",
    "subjectMax": "L'oggetto può avere al massimo {max} caratteri.",
    "messageRequired": "Descrivi il problema.",
    "messageMin": "I dettagli devono avere almeno {min} caratteri.",
    "messageMax": "I dettagli possono avere al massimo {max} caratteri.",
    "phone": "Inserisci un numero di cellulare valido (es. 09xxxxxxxxx).",
    "submit": "Impossibile inviare il ticket.",
    "submitNetwork": "Problema di connessione durante l'invio del ticket.",
    "notFound": "Ticket non trovato.",
    "ticketNetwork": "Problema di connessione durante il caricamento del ticket.",
    "reply": "Impossibile inviare la risposta.",
    "replyNetwork": "Problema di connessione durante l'invio della risposta."
  }
};

export default support;
