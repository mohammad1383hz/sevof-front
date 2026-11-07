import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "Chiavi API",
    "subtitle": "Crea una chiave per collegare la tua applicazione all'API pubblica.",
    "docsLink": "Documentazione API",
    "name": "Nome della chiave",
    "namePlaceholder": "es. Server dei contenuti",
    "create": "Crea chiave",
    "creating": "Creazione…",
    "created": "La chiave «{name}» è pronta. Copiala adesso: non potrai più vederla per intero.",
    "copy": "Copia",
    "copied": "Copiata",
    "gotIt": "Ho capito",
    "empty": "Ancora nessuna chiave. Crea la prima con il modulo qui sopra.",
    "cols": {
      "name": "Nome",
      "key": "Chiave",
      "created": "Creata il",
      "lastUsed": "Ultimo utilizzo",
      "site": "Sito"
    },
    "active": "Attiva",
    "revoked": "Revocata",
    "revoke": "Revoca",
    "revokeConfirm": "Revocare «{name}»? Le applicazioni che la usano perderanno subito l'accesso.",
    "errors": {
      "load": "Impossibile caricare le tue chiavi API.",
      "loadNetwork": "Problema di connessione durante il caricamento delle chiavi API.",
      "create": "Impossibile creare la chiave.",
      "createNetwork": "Problema di connessione durante la creazione della chiave.",
      "revoke": "Impossibile revocare la chiave.",
      "revokeNetwork": "Problema di connessione durante la revoca della chiave."
    },
    "sitesFailed": "Impossibile caricare i tuoi siti.",
    "sitesLoading": "Caricamento…",
    "noSites": "Ancora nessun sito",
    "addSiteFirst": "Aggiungi prima un sito per creare una chiave.",
    "legacySite": "Primo sito (chiave precedente)"
  },
  "docs": {
    "title": "Documentazione API",
    "subtitle": "Collega la tua applicazione all'API pubblica e gestisci i tuoi articoli.",
    "createKey": "Crea chiave API",
    "auth": "Autenticazione",
    "authBody": "Invia la chiave API con ogni richiesta, in uno dei due formati qui sotto. Le chiavi si creano nella pagina «Chiavi API»; ciascuna viene mostrata una sola volta, quindi conservala in un posto sicuro.",
    "orEquivalent": "Oppure, in modo equivalente:",
    "unauthorized": "Se la chiave manca, non è valida o è stata revocata, riceverai una risposta {code}:",
    "baseUrl": "URL di base",
    "endpoints": "Endpoint",
    "listArticles": "Elenca gli articoli del sito a cui appartiene la chiave, dai più recenti.",
    "showArticle": "Restituisce un articolo completo, con sezioni e banner.",
    "createTask": "Crea un'attività di generazione dell'articolo e la avvia in background.",
    "taskStatus": "Restituisce lo stato di un'attività di generazione. A completamento, la risposta include article_id.",
    "notes": "Da sapere",
    "note1": "Una chiave accede solo agli articoli del sito a cui appartiene.",
    "note2": "Revocando una chiave, il suo accesso viene interrotto immediatamente.",
    "note3": "Per generare un articolo, crea un'attività e controllane lo stato a intervalli regolari (ad esempio ogni 30 secondi) invece di attendere un'unica richiesta lunga."
  }
};

export default developer;
