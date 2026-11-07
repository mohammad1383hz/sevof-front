import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} parola",
    "other": "{count} parole"
  },
  "actions": {
    "chat": "Chat",
    "save": "Salva"
  },
  "steps": {
    "brief": "Brief",
    "briefHint": "Studio di pubblico e concorrenti",
    "outline": "Struttura",
    "outlineHint": "Pianificazione dello schema",
    "sections": "Scrittura",
    "sectionsHint": "Una sezione alla volta",
    "meta": "Metadati e SEO",
    "metaHint": "Titolo, riassunto e schema FAQ",
    "review": "Revisione SEO",
    "reviewHint": "Controllo e punteggio",
    "done": "Articolo finale",
    "doneHint": "Pronto da pubblicare"
  },
  "status": {
    "generated": "Fatto",
    "pending": "In attesa"
  },
  "sectionType": {
    "introduction": "Introduzione",
    "section": "Sezione principale",
    "faq": "Domande frequenti",
    "conclusion": "Conclusione"
  },
  "breakdown": {
    "intent_match": "Aderenza all'intento di ricerca",
    "keyword_usage": "Uso delle parole chiave",
    "entity_coverage": "Copertura del tema",
    "completeness": "Completezza",
    "readability": "Leggibilità",
    "structure": "Struttura"
  },
  "target": {
    "title": "Titolo dell'articolo",
    "meta_title": "Titolo SEO",
    "meta_description": "Meta description",
    "excerpt": "Estratto",
    "general": "Intero articolo",
    "section": "Sezione",
    "faq": "FAQ",
    "article": "Intero articolo",
    "metaTitleLong": "Titolo SEO (meta title)",
    "metaDescriptionLong": "Meta description",
    "excerptLong": "Estratto",
    "question": "Domanda {index}"
  },
  "models": {
    "choose": "Scegli un modello di IA",
    "upgrade": "Passa a un piano superiore per sbloccare i modelli Pro.",
    "nano": "Veloce ed economico",
    "mini": "Più preciso per le modifiche complesse",
    "luna": "La migliore qualità di scrittura e il tono più naturale: la nostra scelta per risultati al top."
  },
  "imageModels": {
    "flux": "Veloce e conveniente, ideale per le immagini di tutti i giorni.",
    "banana": "Grande resa visiva, perfetto per immagini creative e varie.",
    "gpt": "Segue fedelmente il prompt e cura i minimi dettagli."
  },
  "styles": {
    "minimal": "Minimal",
    "infographic": "Infografica",
    "conceptual": "Concettuale",
    "realistic": "Realistico",
    "product": "Prodotto"
  },
  "editor": {
    "placeholder": "Scrivi o modifica questa sezione…"
  },
  "copy": {
    "failed": "Copia non riuscita.",
    "failedRetry": "Copia non riuscita. Riprova."
  },
  "errors": {
    "request": "La richiesta non è andata a buon fine.",
    "invalidResponse": "Il server ha restituito una risposta inattesa."
  },
  "error": {
    "paused": "Scrittura dell'articolo in pausa",
    "pausedCredit": "Scrittura in pausa: hai esaurito i crediti",
    "savedCredit": "Tranquillo: tutto ciò che è già pronto è salvato. Appena ricarichi, si riparte esattamente da dove si era fermata.",
    "savedRetry": "Tranquillo: tutto ciò che è già pronto è salvato. Riprova e si riparte esattamente da dove si era fermata.",
    "buyCredits": "Acquista o rinnova crediti",
    "resume": "Riprendi la scrittura"
  },
  "seo": {
    "title": "Revisione SEO",
    "evaluating": "Confronto dell'articolo completo con il brief…",
    "failed": "La revisione SEO non è stata completata (l'articolo è pronto, solo senza punteggio).",
    "outOf100": "su 100",
    "overall": "Punteggio SEO complessivo",
    "suggestions": "Come migliorare"
  },
  "image": {
    "featured": "Immagine in evidenza",
    "failed": "Generazione dell'immagine non riuscita",
    "noBlock": "Nessun problema: questo non impedisce di scrivere né di pubblicare il testo.",
    "creating": "L'IA sta scrivendo un prompt e creando l'immagine in evidenza…",
    "tip": "Per immagini di qualità superiore, prova GPT Image o Nano Banana",
    "generating": "Creazione di una nuova immagine…",
    "generatingShort": "Generazione…",
    "closeEditor": "Chiudi editor",
    "retryPrompt": "Riprova con un nuovo prompt",
    "editPrompt": "Modifica il prompt e rigenera",
    "promptPlaceholder": "Descrivi l'immagine che vuoi…",
    "modelLocked": "Il modello «{model}» è riservato agli utenti Pro. Ti portiamo alla pagina dei piani…",
    "editLocked": "Modificare e rigenerare le immagini è una funzione Pro. Ti portiamo alla pagina dei piani…",
    "promptShort": "Il prompt è troppo breve.",
    "assistant": "Assistente immagini: modifica il prompt e invia",
    "proOnly": "Modificare il prompt e rigenerare le immagini è disponibile con Pro.",
    "introExisting": "Questo è il prompt usato per l'immagine. Modificalo come preferisci:",
    "introNew": "Non c'è ancora un prompt. Scrivine uno per generare l'immagine:",
    "submit": "Rigenera",
    "proOnlyShort": "Solo Pro"
  },
  "meta": {
    "title": "Impostazioni SEO",
    "empty": "vuoto",
    "focusKeyword": "Parola chiave principale",
    "slug": "Slug dell'URL",
    "slugHint": "La parte URL dell'indirizzo: solo lettere minuscole e trattini",
    "ogTitle": "Titolo per i social (og:title)",
    "ogDescription": "Descrizione per i social (og:description)"
  },
  "faq": {
    "title": "Domande frequenti",
    "count": {
      "one": "{count} domanda",
      "other": "{count} domande"
    },
    "question": "Domanda",
    "answer": "Risposta",
    "saveFailed": "Impossibile salvare questa domanda."
  },
  "sections": {
    "title": "Sezioni dell'articolo",
    "designing": "Creazione della struttura a partire dal brief…",
    "none": "La struttura non è ancora stata creata.",
    "editManually": "Modifica a mano",
    "progress": "{done} sezioni su {total}",
    "regenerate": "Riscrivi questa sezione"
  },
  "banner": {
    "title": "Banner dell'articolo",
    "designing": "Creazione del banner…",
    "failed": "Impossibile rigenerare il banner.",
    "failedRetry": "Impossibile rigenerare il banner. Riprova.",
    "generationFailed": "Creazione del banner non riuscita.",
    "regenerate": "Rigenera"
  },
  "brief": {
    "title": "Brief dell'articolo",
    "analyzing": "L'IA sta studiando il tuo pubblico, l'intento di ricerca e le lacune nei contenuti dei concorrenti…",
    "notYet": "Non ancora creato.",
    "audience": "Pubblico",
    "tone": "Tono",
    "length": "Lunghezza obiettivo",
    "goal": "Obiettivo dell'articolo",
    "mustCover": "Argomenti da non perdere",
    "gaps": "Lacune dei concorrenti (il tuo vantaggio)",
    "linkPlan": "«{anchor}» nella sezione «{section}»"
  },
  "chat": {
    "title": "Chatta con l'IA",
    "selectSection": "Scegli una sezione",
    "or": "oppure",
    "orDrag": "oppure trascina qui una sezione",
    "selectAll": "seleziona l'intero articolo",
    "useSelect": "Scegli una sezione con «Seleziona sezione»",
    "drop": "Rilascia per parlare di questa sezione",
    "dropHere": "Rilascia qui per aggiungerla alla chat",
    "loading": "Caricamento della chat…",
    "empty": "Ancora nessuna chat su questo articolo.",
    "applied": "Applicato",
    "clearTarget": "Rimuovi",
    "placeholder": "es. Rendi questa sezione più formale e concisa…",
    "placeholderShort": "es. Rendi questa sezione più formale…",
    "placeholderEmpty": "Scegli prima una sezione dell'articolo o rilasciala qui",
    "selectFirst": "Scegli prima una sezione",
    "disabledUntilDone": "La chat si apre quando l'articolo è pronto…",
    "waitForArticle": "Scrittura dell'articolo… La chat si aprirà appena sarà pronto",
    "noCredits": "Il tuo piano non è attivo oppure hai esaurito i crediti.",
    "sendFailed": "Il messaggio non è stato inviato. Riprova.",
    "sendAria": "Invia messaggio",
    "previous": "Chat precedenti su questo articolo ({count})",
    "loadingPrevious": "Caricamento delle chat precedenti…",
    "firstDraft": "Prima bozza",
    "draft": "Bozza {index}",
    "withAgent": "Chatta con l'agente"
  },
  "final": {
    "article": "Articolo",
    "ready": "Il tuo articolo è pronto",
    "section": "Sezione {index}",
    "waiting": "In attesa",
    "sectionFailed": "Non è stato possibile scrivere questa sezione.",
    "sectionTitle": "Titolo della sezione",
    "saveFailed": "Impossibile salvare l'articolo.",
    "dragToChat": "Trascina nella chat",
    "dragShort": "Trascina nella chat",
    "dragArticle": "Trascina l'intero articolo nella chat",
    "dragSection": "Trascina questa sezione nella chat",
    "chatArticle": "Chatta sull'intero articolo",
    "editArticle": "Modifica l'intero articolo",
    "copyMarkdown": "Copia in Markdown"
  },
  "modal": {
    "title": "Scegli come scrivere il tuo articolo",
    "subtitle": "Il modello che scegli determina qualità e SEO dell'articolo. I modelli più avanzati sono inclusi in Pro.",
    "writingModel": "Modello di scrittura",
    "writingModelDesc": "Questo modello scrive il testo e la struttura dell'articolo.",
    "images": "Immagini dell'articolo",
    "imagesDesc": "Scegli il modello di immagine e quante immagini creare per questo articolo.",
    "qualityTip": "Per la massima qualità, usa GPT Image o Nano Banana",
    "imageCount": "Numero di immagini",
    "upToImages": "Crea fino a {count} immagini",
    "firstImage": "La prima immagine diventa l'immagine in evidenza.",
    "sectionCount": "Numero di sezioni",
    "rangePro": "Questa fascia è disponibile con Pro",
    "sectionRange": "L'articolo avrà da {min} a {max} sezioni.",
    "advanced": "Avanzate (facoltativo)",
    "advancedHint": "Stile dell'immagine e istruzioni tue per il testo e l'immagine in evidenza",
    "imageStyle": "Stile dell'immagine",
    "infographicHint": "Per le infografiche servono GPT Image o Nano Banana",
    "articlePromptPlaceholder": "es. Tono colloquiale, pensato per principianti, con una conclusione chiara",
    "imagePromptPlaceholder": "es. Una scrivania in legno con un portatile e una tazza di caffè nella luce morbida del mattino",
    "imagePromptHint": "Lo stile scelto sopra vale anche per questa immagine, senza testi né loghi.",
    "start": "Inizia a scrivere"
  },
  "publish": {
    "connect": "Collega {platform}",
    "notConnected": "Il tuo sito non è ancora collegato a {platform}.",
    "publishTo": "Pubblica su {platform}",
    "updateOn": "Aggiorna su {platform}",
    "removeFrom": "Rimuovi da {platform}",
    "draftOn": "Bozza su {platform}",
    "viewOn": "Vedi su {platform}",
    "checking": "Verifica della connessione…",
    "finishFirst": "L'articolo deve essere completato prima di poterlo pubblicare.",
    "whenReady": "Potrai pubblicarlo appena l'articolo sarà pronto.",
    "publishing": "Pubblicazione…",
    "publish": "Pubblica",
    "updating": "Aggiornamento…",
    "updated": "Aggiornato",
    "update": "Aggiorna",
    "deleting": "Rimozione…",
    "confirmDelete": "Sicuro? Clicca di nuovo"
  },
  "page": {
    "missingId": "Manca l'ID dell'idea o dell'articolo.",
    "startFailed": "Impossibile avviare la scrittura dell'articolo.",
    "noId": "Il server non ha restituito l'ID dell'articolo.",
    "startError": "Qualcosa è andato storto all'avvio dell'articolo.",
    "retryFailed": "Il nuovo tentativo non è riuscito. Riprova.",
    "regenFailed": "Impossibile riscrivere questa sezione.",
    "regenFailedRetry": "Impossibile riscrivere questa sezione. Riprova.",
    "wpPublishFailed": "Pubblicazione su WordPress non riuscita.",
    "wpPublishFailedRetry": "Pubblicazione su WordPress non riuscita. Riprova.",
    "wpUpdateFailed": "Aggiornamento su WordPress non riuscito.",
    "wpUpdateFailedRetry": "Aggiornamento su WordPress non riuscito. Riprova.",
    "wpDeleteFailed": "Rimozione da WordPress non riuscita.",
    "wpDeleteFailedRetry": "Rimozione da WordPress non riuscita. Riprova.",
    "checkingPlan": "Verifica del tuo piano…",
    "preparing": "Preparazione dell'articolo…",
    "autoRefresh": "Questa pagina si aggiorna da sola, non serve ricaricarla."
  }
};

export default article;
