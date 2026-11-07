import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Apri",
  "noResults": "Nessun risultato per la tua ricerca.",
  "page": {
    "title": "Dashboard articoli",
    "subtitle": "Cosa sta facendo il tuo agente IA su questo sito",
    "noSiteTitle": "Non hai ancora aggiunto un sito",
    "noSiteBody": "Aggiungi un sito per vederne idee, articoli e attività del pilota automatico."
  },
  "errors": {
    "load": "Impossibile caricare la dashboard.",
    "network": "Problema di connessione: la dashboard non si è caricata.",
    "autopilot": "Impossibile aggiornare il pilota automatico.",
    "ideas": "Qualcosa è andato storto durante la generazione delle idee.",
    "invalidSite": "Il link del sito non è valido.",
    "ideasLoad": "Impossibile caricare le idee di contenuto.",
    "writtenLoad": "Impossibile caricare gli articoli scritti.",
    "publishedLoad": "Impossibile caricare gli articoli pubblicati.",
    "keywordsLoad": "Impossibile caricare le parole chiave."
  },
  "articleStatus": {
    "completed": "Completato",
    "failed": "Non riuscito",
    "pending": "In coda",
    "generating": "In scrittura…"
  },
  "ideaStatus": {
    "approved": "Approvata",
    "rejected": "Scartata",
    "used": "Usata",
    "recommended": "Suggerita"
  },
  "publishStatus": {
    "published": "Pubblicato",
    "draft": "Bozza",
    "failed": "Non riuscito"
  },
  "stats": {
    "totalArticles": "Articoli totali",
    "published": "Pubblicati",
    "generating": "In lavorazione",
    "failed": "Non riusciti",
    "avgSeo": "Punteggio SEO medio",
    "totalWords": "Parole scritte"
  },
  "recent": {
    "title": "Ultimi articoli",
    "empty": "Ancora nessun articolo.",
    "publishedOn": "Pubblicato il {date}"
  },
  "connection": {
    "checking": "Verifica della connessione al tuo sito…",
    "switchBack": "Torna a {platform}",
    "connectVia": "Collega invece {platform}",
    "apiTitle": "Collegati con l'API pubblica",
    "apiBody": "Crea e leggi articoli dalla tua app, anche senza WordPress o Shopify. Documentazione completa, esempi di codice e guida alle chiavi API.",
    "docs": "Docs",
    "platform": "Piattaforma di pubblicazione",
    "comingSoon": "In arrivo",
    "soon": "presto"
  },
  "opportunities": {
    "title": "Nuove opportunità",
    "discovering": "Ricerca…",
    "discover": "Trova nuove opportunità",
    "empty": "Ancora nessuna opportunità. Clicca su «Trova nuove opportunità» per iniziare.",
    "generatedHint": "Articolo pronto: lo trovi nell'elenco degli articoli",
    "generated": "Scritto",
    "generate": "Scrivi l'articolo",
    "keywords": "Parole chiave trovate",
    "entities": "Temi individuati"
  },
  "opportunitiesPage": {
    "title": "Opportunità di contenuto",
    "subtitle": "Idee di articoli scelte per il tuo sito",
    "topic": "Argomento",
    "entity": "Entità principale",
    "competitor": "Concorrenza",
    "search": "Cerca argomenti o entità…",
    "empty": "Ancora nessuna idea di contenuto."
  },
  "gap": {
    "uncovered": "Non ancora trattato",
    "covered": "Già trattato",
    "reviewing": "In verifica"
  },
  "columns": {
    "title": "Titolo dell'articolo",
    "keyword": "Parola chiave target",
    "words": "Parole",
    "status": "Stato",
    "publishStatus": "Pubblicazione",
    "date": "Data",
    "url": "URL online"
  },
  "written": {
    "title": "Articoli scritti",
    "subtitle": "Tutto ciò che il pilota automatico ha scritto finora per il tuo sito",
    "empty": "Ancora nessun articolo scritto."
  },
  "published": {
    "title": "Articoli pubblicati",
    "subtitleShort": "Tutti i tentativi di pubblicazione del tuo agente",
    "subtitle": "Tutti i tentativi di pubblicazione del tuo agente: pubblicati, salvati come bozza o non riusciti",
    "empty": "Non è stato ancora pubblicato nulla.",
    "errorDetails": "Mostra i dettagli dell'errore"
  },
  "keywords": {
    "title": "Parole chiave",
    "subtitle": "Le parole chiave trovate dal pilota automatico per il tuo sito",
    "keyword": "Parola chiave",
    "primary": "Principale",
    "difficulty": "Difficoltà",
    "analyzing": "Stiamo analizzando il tuo sito per trovare parole chiave. Potrebbe volerci un momento…",
    "empty": "Ancora nessuna parola chiave trovata."
  },
  "difficulty": {
    "Low": "Facile",
    "Medium": "Media",
    "High": "Difficile",
    "Unknown": "Sconosciuta"
  },
  "agent": {
    "status": {
      "idle": "In pausa",
      "working": "Al lavoro",
      "generatingIdeas": "Sta trovando idee",
      "writing": "Sta scrivendo un articolo",
      "waitingIdeas": "In attesa di idee valutate",
      "dailyLimit": "Limite giornaliero raggiunto",
      "needsAnalysis": "Serve prima un'analisi del sito",
      "unknown": "Sconosciuto"
    },
    "features": {
      "research": "Ricerca di concorrenti e parole chiave",
      "daily": "Nuove idee e nuovi articoli ogni giorno",
      "autoPublish": "Pubblicazione automatica",
      "scheduling": "Programmazione intelligente",
      "wordpress": "Pubblicazione su WordPress con un clic"
    },
    "pipeline": {
      "badge": "Flusso dei contenuti",
      "intro": "Il pilota automatico esegue queste quattro fasi una dopo l'altra, senza alcun intervento da parte tua.",
      "keywordsTitle": "Trovare parole chiave",
      "keywordsDesc": "Analizza il tuo sito e individua le parole chiave che contano",
      "ideasTitle": "Pianificare le idee",
      "ideasDesc": "Trasforma ogni opportunità in un'idea di articolo",
      "writeTitle": "Scrivere gli articoli",
      "writeDesc": "Scrive articoli completi e ottimizzati per la SEO",
      "publishTitle": "Pubblicare",
      "publishDesc": "Pubblica gli articoli sul tuo sito WordPress"
    },
    "stats": {
      "keywords": "Parole chiave trovate",
      "opportunities": "Opportunità trovate",
      "written": "Articoli scritti",
      "published": "Articoli pubblicati"
    },
    "locked": {
      "badge": "Funzione Pro",
      "title": "Con Pro la tua SEO va col pilota automatico",
      "body": "Tiene d'occhio il tuo sito 24 ore su 24, studia concorrenti e parole chiave, poi scrive e pubblica per te articoli ottimizzati per la SEO.",
      "cta": "Passa a Pro"
    },
    "enableTitle": "Attiva il pilota automatico",
    "enable": "Attiva",
    "enabling": "Attivazione…",
    "onTitle": "Il pilota automatico è attivo",
    "settings": "Impostazioni"
  },
  "settings": {
    "title": "Impostazioni del pilota automatico",
    "publishStatus": "Quando un articolo è pronto",
    "publishHint": "Gli articoli vanno online appena sono scritti.",
    "draftHint": "Gli articoli restano in bozza finché non li controlli e li pubblichi.",
    "publishOptions": {
      "draft": "Salva come bozza",
      "publish": "Pubblica automaticamente"
    },
    "perCycle": "Articoli per ciclo",
    "perCycleHint": "Quanti articoli vengono scritti a ogni ciclo.",
    "schedule": "Frequenza",
    "scheduleHint": "Ogni quanto deve attivarsi il pilota automatico?",
    "customInterval": "Ogni quanti giorni",
    "customIntervalHint": "Ad esempio, 5 significa una volta ogni 5 giorni.",
    "startTime": "Orario di inizio",
    "startTimeHint": "Il pilota automatico inizia a lavorare a quest'ora.",
    "sectionCount": "Lunghezza dell'articolo",
    "sectionCountHint": "Definisce la struttura generale di ogni articolo.",
    "sections": {
      "short": "6–8 sezioni (breve)",
      "medium": "8–10 sezioni (medio)",
      "long": "10–12 sezioni (lungo)"
    },
    "intervalOptions": {
      "d1": "Ogni giorno",
      "d2": "A giorni alterni",
      "d3": "Ogni 3 giorni",
      "d7": "Una volta a settimana",
      "custom": "Personalizzato"
    },
    "interval": {
      "everyDay": "ogni giorno",
      "everyOtherDay": "a giorni alterni",
      "everyWeek": "una volta a settimana",
      "everyNDays": "ogni {days} giorni"
    },
    "preview": {
      "short": "La tua programmazione: {count} articoli {interval}",
      "publish": "Il pilota automatico parte alle {time} e, {interval}, scrive {count} articoli e li pubblica automaticamente.",
      "draft": "Il pilota automatico parte alle {time} e, {interval}, scrive {count} articoli e li salva come bozza perché tu li controlli.",
      "publishWithImages": "Il pilota automatico parte alle {time} e, {interval}, scrive {count} articoli con {images} immagini ciascuno e li pubblica automaticamente.",
      "draftWithImages": "Il pilota automatico parte alle {time} e, {interval}, scrive {count} articoli con {images} immagini ciascuno e li salva come bozza perché tu li controlli."
    },
    "articleModel": "Modello di scrittura",
    "imagesTitle": "Immagini per i tuoi articoli",
    "imageModel": "Modello di immagine",
    "imagesPerArticle": "Immagini per articolo",
    "perImage": "per immagine",
    "perArticle": "per articolo",
    "credits": "{count} crediti",
    "recommended": "Consigliato",
    "decrease": "Diminuisci",
    "increase": "Aumenta",
    "advanced": "Avanzate",
    "advancedHint": "Le tue istruzioni per articoli e immagini (facoltativo)",
    "articlePrompt": "Istruzioni per l'articolo",
    "articlePromptHint": "Lascia vuoto e gli articoli verranno scritti come di consueto.",
    "articlePromptPlaceholder": "es. Tono cordiale e informale, per principianti",
    "imagePrompt": "Istruzioni per l'immagine in evidenza",
    "imagePromptHint": "Lascia vuoto e il prompt verrà creato a partire dall'articolo.",
    "imagePromptPlaceholder": "es. Colori caldi, nessun testo nell'immagine",
    "summary": "In sintesi",
    "save": "Salva impostazioni"
  },
  "wp": {
    "title": "Connessione a WordPress",
    "subtitle": "Pubblica gli articoli direttamente sul tuo sito WordPress",
    "status": {
      "connected": "Collegato",
      "pending": "Configurazione in sospeso",
      "disconnected": "Non collegato"
    },
    "health": {
      "healthy": "Funzionante",
      "unhealthy": "Errore",
      "unreachable": "Non raggiungibile"
    },
    "verified": "Presente su WordPress.org",
    "shownOnce": "Mostrato una sola volta",
    "copy": "Copia {label}",
    "downloadLatest": "Scarica l'ultima versione del plugin",
    "plugin": "Plugin WordPress",
    "pluginBody": "Installa il plugin sul tuo sito. Una volta collegato, gli articoli vengono scritti e pubblicati al posto tuo.",
    "download": "Scarica il plugin",
    "credentials": {
      "title": "I tuoi dati di connessione",
      "body": "Incolla questi tre valori nelle impostazioni del plugin sul tuo sito: è tutto ciò che serve per pubblicare in automatico.",
      "warning": "Dopo aver chiuso questa finestra, il Client Secret non verrà più mostrato. Se lo perdi, usa «Ricollega» per ottenere nuovi dati.",
      "done": "Li ho salvati"
    },
    "checking": "Verifica della connessione…",
    "empty": "Nessun sito WordPress collegato",
    "emptyBody": "Collegandoti ricevi un Client ID e un Client Secret da inserire nel plugin WordPress del tuo sito.",
    "connect": "Collega WordPress",
    "waiting": "In attesa del collegamento del plugin WordPress",
    "waitingBody": "Inserisci Client ID, API Key e Client Secret nelle impostazioni del plugin per completare. Li hai persi? Clicca su «Ricollega» per ottenerne di nuovi.",
    "check": "Verifica connessione",
    "newCredentials": "Genera nuove credenziali",
    "siteUrl": "URL del sito",
    "versions": "Versione di WordPress / del plugin",
    "pluginVersion": "plugin {version}",
    "healthTitle": "Stato",
    "lastCheck": "Ultimo controllo",
    "test": "Prova la connessione",
    "reconnect": "Ricollega",
    "disconnect": "Scollega",
    "disconnected": "WordPress scollegato",
    "testOk": "Tutto a posto: il tuo sito WordPress è raggiungibile.",
    "testBad": "Il tuo sito WordPress non ha risposto come previsto.",
    "confirmReconnectTitle": "Generare nuovi dati di connessione?",
    "confirmReconnectBody": "I dati attuali smetteranno di funzionare e dovrai inserire quelli nuovi nel plugin WordPress.",
    "confirmDisconnectTitle": "Scollegare WordPress?",
    "confirmDisconnectBody": "Gli articoli non verranno più pubblicati automaticamente su questo sito. Per ricollegarti dovrai ripetere la configurazione.",
    "errors": {
      "load": "Impossibile verificare la connessione a WordPress.",
      "loadNetwork": "Problema di connessione durante la verifica di WordPress.",
      "connect": "Impossibile collegarsi a WordPress.",
      "reconnect": "Il ricollegamento non è riuscito.",
      "disconnect": "Impossibile scollegare.",
      "testNetwork": "Problema di connessione durante la prova."
    }
  },
  "mixin": {
    "title": "Connessione a Mixin",
    "subtitle": "Pubblica gli articoli direttamente sul tuo negozio Mixin",
    "connected": "Mixin collegato",
    "disconnected": "Mixin scollegato",
    "testOk": "Tutto a posto: Mixin è raggiungibile.",
    "testBad": "Mixin non ha risposto come previsto.",
    "changeIntro": "Inserisci un nuovo token. Lo proveremo prima di salvarlo: se la prova non riesce, il token attuale resta attivo.",
    "connectIntro": "Inserisci il tuo token Mixin. Proveremo la connessione al negozio prima di salvare e ti avviseremo se qualcosa non va.",
    "siteUrl": "URL del negozio",
    "currentToken": "Token attuale",
    "token": "Token Mixin",
    "tokenShort": "Token",
    "newToken": "Nuovo token",
    "tokenPlaceholder": "Incolla qui il tuo token",
    "newTokenPlaceholder": "Incolla qui il nuovo token",
    "hideToken": "Nascondi token",
    "showToken": "Mostra token",
    "testing": "Prova della connessione…",
    "testAndConnect": "Prova e collega",
    "changeToken": "Cambia token",
    "confirmTitle": "Scollegare Mixin?",
    "confirmBody": "Gli articoli non verranno più pubblicati automaticamente su Mixin. Per ricollegarti dovrai inserire di nuovo il token.",
    "errors": {
      "load": "Impossibile verificare la connessione a Mixin.",
      "loadNetwork": "Problema di connessione durante la verifica di Mixin.",
      "tokenShort": "Incolla il token completo.",
      "connect": "Impossibile collegarsi a Mixin. Controlla l'URL del negozio e il token."
    }
  },
  "kwAnalysis": {
    "title": "Ricerca parola chiave",
    "steps": {
      "pending": "Richiesta ricevuta",
      "processing": "Recupero dei dati da Google Trends",
      "selecting": "L'IA sta scegliendo la parola chiave migliore",
      "done": "Preparazione dei risultati"
    },
    "progress": "Analisi delle parole chiave ({done}/{total} verificate)",
    "starting": "Avvio…",
    "note": "Nota: Google Trends limita le richieste, quindi ogni parola chiave può richiedere fino a un minuto.",
    "processing": "In corso…",
    "completed": "Fatto",
    "failed": "Analisi delle parole chiave non riuscita",
    "finalBadge": "La tua parola chiave",
    "suggestedTitle": "Titolo suggerito",
    "checked": "Parole chiave verificate ({count})",
    "finalSelection": "Scelta",
    "fetched": "Dati ricevuti",
    "fetchError": "Impossibile recuperare i dati",
    "topQueries": "Principali ricerche correlate",
    "risingQueries": "Ricerche in crescita",
    "noData": "Nessun dato",
    "breakout": "In forte crescita",
    "backToAnalysis": "Torna all'analisi del sito",
    "errors": {
      "status": "Impossibile ottenere lo stato dell'analisi.",
      "start": "Impossibile avviare l'analisi delle parole chiave.",
      "site": "Impossibile caricare i dati del sito."
    }
  },
  "shopify": {
    "title": "Connessione Shopify",
    "subtitle": "Pubblica articoli del blog e correzioni SEO dei prodotti direttamente nel tuo negozio Shopify",
    "connected": "Collegato",
    "loadFailed": "Impossibile caricare la connessione Shopify.",
    "connectedBanner": "Il tuo negozio Shopify è collegato. Stiamo importando i tuoi prodotti.",
    "invalidShop": "Inserisci l'indirizzo del negozio, es. tuo-negozio.myshopify.com.",
    "installFailed": "Impossibile avviare la connessione a Shopify. Riprova.",
    "testOk": "Tutto ok: il negozio è raggiungibile.",
    "testBad": "Shopify non ha risposto come previsto.",
    "disconnected": "Negozio Shopify scollegato.",
    "disconnectFailed": "Impossibile scollegare il negozio.",
    "store": "Negozio",
    "storefront": "Vetrina",
    "connectedHelp": "Gli articoli vengono pubblicati nel blog del negozio e le correzioni dei prodotti approvate aggiornano i tuoi prodotti Shopify. I prodotti si sincronizzano automaticamente ogni notte.",
    "confirmTitle": "Scollegare Shopify?",
    "confirmBody": "L'app Sevof verrà rimossa dal tuo negozio. Gli articoli già pubblicati restano nel blog.",
    "disconnecting": "Scollegamento…",
    "disconnect": "Scollega",
    "cancel": "Annulla",
    "test": "Prova connessione",
    "notConfigured": "La pubblicazione su Shopify non è ancora disponibile su questo server. Contatta l'assistenza.",
    "intro": "Inserisci l'indirizzo del negozio e approva l'app Sevof in Shopify. Alla fine tornerai qui.",
    "shopLabel": "Indirizzo del negozio",
    "shopHint": "Il tuo indirizzo myshopify.com: lo trovi nell'admin di Shopify in Impostazioni → Domini.",
    "redirecting": "Apertura di Shopify…",
    "connect": "Collega Shopify",
    "permissions": "Sevof chiede accesso solo a blog, prodotti e file. Puoi rimuovere l'app da Shopify in qualsiasi momento.",
    "pickTitle": "Collega il tuo negozio Shopify",
    "pickBody": "Scegli il sito Sevof a cui appartiene questo negozio. Poi approverai l'app in Shopify.",
    "noSites": "Non hai ancora un sito in Sevof. Aggiungi prima il dominio del negozio, poi torna qui.",
    "addSite": "Aggiungi un sito"
  }
};

export default dashboard;
