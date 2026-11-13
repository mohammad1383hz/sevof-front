import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "L'analisi non è stata completata",
  "phase": {
    "queued": "Richiesta ricevuta",
    "crawling": "Lettura delle pagine del tuo sito…",
    "analyzing": "Analisi dei tuoi contenuti…",
    "done": "Analisi completata"
  },
  "ideaSteps": {
    "connecting": "Connessione alle fonti di dati (Google Trends, Autocomplete, SERP)",
    "keywords": "Valutazione delle parole chiave legate ai tuoi temi principali",
    "generating": "Creazione di idee di articoli con l'IA",
    "scoring": "Analisi della concorrenza e calcolo del punteggio SEO"
  },
  "empty": {
    "title": "Analizza il tuo sito",
    "body": "Inserisci un dominio qui sotto: individueremo il tuo settore, riassumeremo i tuoi contenuti e mapperemo i temi principali (entità) che tratti.",
    "tagEntities": "Analisi delle entità",
    "tagIdeas": "Idee di articoli"
  },
  "input": {
    "placeholder": "esempio.it — l'indirizzo del tuo sito",
    "submit": "Analizza"
  },
  "progress": {
    "title": "Elaborazione in corso",
    "inProgress": "In corso…",
    "done": "Fatto",
    "hint": "Di solito servono pochi minuti."
  },
  "ideasBar": {
    "limit": "Hai raggiunto il limite di generazione delle idee",
    "generating": "In scrittura…",
    "cta": "Trova opportunità di articoli"
  },
  "ideas": {
    "ready": {
      "one": "{count} idea pronta",
      "other": "{count} idee pronte"
    },
    "preparing": "Preparazione…",
    "generatingTitle": "Ricerca di idee di articoli",
    "retrying": "Nuovo tentativo…",
    "retry": "Riprova"
  },
  "chat": {
    "yourRequest": "La tua richiesta",
    "preparingIdeas": "Stiamo preparando idee per il tuo sito…",
    "articleHeader": "Scrittura di un articolo in questa chat",
    "assistant": "Assistente per la strategia dei contenuti",
    "selectedEntity": "Tema scelto: {name}",
    "preparing": "Avvio di una nuova chat…"
  },
  "research": {
    "failed": "La ricerca dei contenuti non è stata completata",
    "clustersTitle": "Creazione dei cluster di parole chiave",
    "gapsTitle": "Analisi dei concorrenti e delle lacune di contenuto",
    "clusters": "Cluster di parole chiave",
    "gapsResult": "Lacune di contenuto e analisi della concorrenza",
    "clusterSteps": {
      "read": "Lettura dei temi e delle parole chiave del tuo sito",
      "build": "Raggruppamento delle ricerche in cluster",
      "estimate": "Stima di potenziale e tendenze"
    },
    "gapSteps": {
      "context": "Comprensione della tua attività",
      "competitors": "Individuazione dei veri concorrenti",
      "gaps": "Ricerca delle lacune di contenuto"
    },
    "intent": {
      "informational": "Informativo",
      "commercial": "Commerciale",
      "transactional": "Transazionale",
      "navigational": "Navigazionale"
    },
    "coverage": {
      "missing": "Assente dai risultati di Google",
      "weak": "Posizionamento debole",
      "low": "Posizionamento basso"
    },
    "level": {
      "low": "bassa",
      "medium": "media",
      "high": "alta"
    },
    "priority": {
      "high": "Priorità alta",
      "medium": "Priorità media",
      "low": "Priorità bassa"
    },
    "difficulty": {
      "unavailable": "Non disponibile da questa fonte",
      "estimated": "{score}/100 · stima dell'IA"
    },
    "volumeEstimate": "Stima dell'IA",
    "volumeObserved": "Impressioni reali",
    "trend": "Tendenza",
    "trendNeedsTwo": "Servono due periodi per confrontare",
    "trendUnavailable": "Nessuna stima della tendenza",
    "stats": {
      "competitors": "Concorrenti reali",
      "opportunities": "Opportunità di contenuto",
      "avgScore": "Punteggio medio di opportunità",
      "highThreat": "Concorrenti più pericolosi"
    },
    "strengths": "I punti di forza del tuo sito",
    "weaknesses": "Dove puoi migliorare",
    "visibility": "Visibilità nella ricerca",
    "depth": "Profondità dei contenuti",
    "opportunitiesTitle": "Opportunità di contenuto (ordinate in base ai veri risultati di Google)",
    "takeAction": "Agisci",
    "recommendedAction": "Approccio consigliato",
    "competitorSites": "Siti concorrenti ({count})",
    "rank": "Posizione {rank}",
    "rankUnavailable": "Posizione sconosciuta",
    "sharedKeywords": {
      "one": "{count} parola chiave in comune",
      "other": "{count} parole chiave in comune"
    },
    "moreDetails": "Altri dettagli",
    "missing": "Cosa manca al tuo sito",
    "recommendations": "Consigli generali",
    "action": "Prossimo passo: {action}",
    "fullReport": "Apri il report completo",
    "opportunityScore": "Opportunità {score}/100",
    "threat": "Minaccia: {level}",
    "received": "Ricevuto! I risultati della ricerca compariranno proprio qui, in questa chat."
  },
  "entities": {
    "title": "Temi individuati",
    "empty": "Ancora nessun tema individuato."
  },
  "request": {
    "title": "Richiesta di analisi dei contenuti",
    "body": "L'IA studia i tuoi contenuti e i tuoi concorrenti per scoprire nuove opportunità"
  },
  "summary": {
    "title": "Risultati dell'analisi",
    "industry": "Settore: {niche}"
  },
  "user": {
    "start": "Analizza questo sito"
  },
  "idea": {
    "edit": "Modifica idea",
    "editShort": "Modifica",
    "save": "Salva modifiche",
    "category": "Categoria:",
    "noLinks": "Nessun link interno trovato",
    "linksLabel": "Link interni:",
    "linksHint": "L'articolo finale rimanderà a queste pagine",
    "viewArticle": "Vedi l'articolo",
    "viewArticleHint": "Apri l'articolo scritto a partire da questa idea",
    "generatingHint": "È in corso la scrittura di un articolo da questa idea",
    "fields": {
      "title": "Titolo",
      "titlePlaceholder": "Titolo dell'idea",
      "hook": "Gancio",
      "hookPlaceholder": "Una frase d'apertura che catturi il lettore",
      "meta": "Meta description",
      "metaPlaceholder": "Un breve riassunto per i risultati di ricerca",
      "tags": "Tag",
      "tagsHint": "(separati da virgole)",
      "tagsPlaceholder": "SEO, marketing, contenuti",
      "links": "Link interni",
      "linkTitle": "Testo del link",
      "related": "Correlati",
      "removeLink": "Rimuovi link",
      "addLink": "Aggiungi link correlato",
      "outline": "Struttura",
      "outlineHint": "(un titolo per riga)"
    },
    "score": {
      "entity": "Pertinenza del tema",
      "intent": "Intento di ricerca",
      "business": "Valore per il business",
      "serp": "Margine per competere su Google",
      "summary": "In sintesi:"
    },
    "errors": {
      "save": "Impossibile salvare le modifiche. Riprova."
    }
  },
  "gsc": {
    "connect": "Collega Google Search Console",
    "reconnect": "Ricollega Google Search Console",
    "title": "Dati in tempo reale da Google Search Console",
    "body": "Porta nella ricerca dei contenuti le tue vere query, impressioni, clic, CTR e posizioni, con accesso in sola lettura.",
    "connected": "Account collegato",
    "showProperties": "Mostra i miei siti verificati",
    "selectProperty": "Scegli una proprietà",
    "connectProperty": "Usa questo sito",
    "lastSynced": "Ultima sincronizzazione: {date}",
    "noData": "Ancora nessun dato.",
    "syncing": "Recupero…",
    "sync": "Sincronizza ora",
    "impressions": "Impressioni",
    "clicks": "Clic",
    "topQueries": "Query principali per impressioni",
    "queryStats": "{impressions} impressioni · posizione {position}",
    "errors": {
      "start": "Impossibile avviare il collegamento a Google Search Console.",
      "noProperties": "L'account Google collegato non ha siti verificati. Scollegalo dalla dashboard di automazione del tuo sito e collega l'account giusto.",
      "properties": "Impossibile caricare i tuoi siti di Search Console.",
      "select": "Impossibile collegare questa proprietà.",
      "sync": "Impossibile avviare la sincronizzazione con Search Console.",
      "disconnect": "Impossibile scollegare Search Console."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Suggerisci argomenti per articoli",
      "prompt": "Dammi opportunità di contenuto concrete e utilizzabili, basate sulle tendenze rilevanti per questo sito."
    },
    "gap": {
      "label": "Lacune rispetto ai concorrenti",
      "prompt": "Analizza i concorrenti rilevanti di questo sito e le sue principali lacune di contenuto. Per ogni lacuna spiega perché è importante, quanto è grande la minaccia e proponi un approccio per colmarla."
    },
    "limit": "Passa a un piano superiore per continuare.",
    "choosePath": "Scegli un tipo di ricerca",
    "gscConnect": "Collega Search Console",
    "connectGoogle": "Collega l'account Google",
    "loadingSites": "Caricamento siti…",
    "showSites": "Mostra i miei siti",
    "select": "Scegli",
    "queriesReceived": "{count} query ricevute",
    "loadingData": "Caricamento dati…",
    "readyToFetch": "Collegato: pronto a recuperare i dati",
    "fetch": "Recupera i dati",
    "connectedQueries": "Search Console collegato · {count} query",
    "fetchingGsc": "Recupero dei dati da Search Console…",
    "gscConnected": "Search Console collegato",
    "placeholder": "Fai una domanda o descrivi cosa ti serve…",
    "send": "Invia"
  },
  "credits": {
    "banner": "Hai esaurito i crediti gratuiti per l'assistente dei contenuti. {still} Scegli un piano per continuare a chattare.",
    "bannerStill": "Puoi comunque far scrivere articoli dalle idee che hai già.",
    "viewPlans": "Vedi i piani",
    "chatFree": "Hai esaurito i crediti gratuiti per l'assistente dei contenuti, quindi non puoi fare nuove domande, ma puoi comunque far scrivere articoli dalle idee che hai già. Per continuare a chattare, scegli un piano nella pagina dell'abbonamento (/subscription).",
    "chatPaid": "Non hai abbastanza crediti per l'assistente dei contenuti, ma puoi comunque far scrivere articoli dalle idee che hai già. Ricarica o cambia piano nella pagina dell'abbonamento (/subscription).",
    "shortFree": "Hai esaurito i crediti gratuiti. Abbonati per continuare.",
    "shortPaid": "Hai esaurito i crediti. Ricarica o cambia piano.",
    "barFree": "I crediti gratuiti dell'assistente dei contenuti sono finiti. Abbonati per continuare.",
    "barPaid": "Crediti insufficienti per l'analisi dei contenuti. Ricarica o cambia piano."
  },
  "entity": {
    "pick": "Scegli un tema",
    "pickPrompt": "Per trovare opportunità precise e creare i link interni giusti, scegli il tema (entità) su cui concentrarci.",
    "confirmed": "Perfetto, la tua richiesta è partita! I risultati riguarderanno solo il tema scelto e ogni articolo rimanderà alla pagina corrispondente del tuo sito."
  },
  "gapPrompt": "Crea un'idea di contenuto e il relativo piano per questa opportunità, individuata confrontando i veri risultati di Google:\nOpportunità: {title}\nQuery target: {query}\nDettagli: {details}\nApproccio suggerito: {angle}",
  "gapLabel": "Agisci su: {title}",
  "article": {
    "request": "Scrivi un articolo per l'idea «{title}».",
    "started": "L'articolo è in fase di scrittura in questa chat."
  },
  "nav": {
    "previous": "Messaggio precedente",
    "next": "Messaggio successivo",
    "latest": "Vai all'ultimo messaggio",
    "latestShort": "Ultimo"
  },
  "welcome": {
    "title": "Agente SEO di {domain}",
    "hello": "Ciao! Sono l'assistente SEO di {domain}.",
    "what": "Posso approfondire le parole chiave che contano, scoprire nuove opportunità di contenuto, analizzare i tuoi concorrenti e suggerirti argomenti per far crescere il sito.",
    "ask": "Chiedimi tutto ciò che vuoi sulla SEO o sui contenuti del tuo sito."
  },
  "errors": {
    "saveMessage": "Impossibile salvare il messaggio.",
    "researchResults": "Impossibile caricare i risultati della ricerca.",
    "history": "Impossibile caricare la cronologia della chat.",
    "startSession": "Impossibile avviare la chat di analisi per questo sito.",
    "research": "La richiesta di ricerca dei contenuti non è andata a buon fine.",
    "opportunities": "La richiesta di opportunità di contenuto non è andata a buon fine.",
    "retry": "Il nuovo tentativo non è riuscito.",
    "status": "Impossibile ottenere lo stato dell'analisi.",
    "domainRequired": "Inserisci un dominio, ad esempio esempio.it.",
    "domainInvalid": "Inserisci solo il dominio, senza http:// né percorso, ad esempio esempio.it.",
    "addDomain": "Impossibile aggiungere questo dominio."
  }
};

export default analyze;
