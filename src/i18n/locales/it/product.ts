import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Cancella ricerca",
  "errors": {
    "server": "Impossibile raggiungere il server. Riprova.",
    "serverShort": "Impossibile raggiungere il server."
  },
  "styles": {
    "price": "Prezzo e budget",
    "comparison": "Confronto tra prodotti",
    "buying_guide": "Guida all'acquisto"
  },
  "steps": {
    "brief": "Analisi e brief",
    "briefHint": "Studio di prodotti e pubblico",
    "plan": "Pianificazione",
    "planHint": "Assegnazione dei prodotti alle sezioni",
    "sections": "Scrittura",
    "sectionsHint": "Una sezione alla volta",
    "written": "{done} sezioni scritte su {total}"
  },
  "idea": {
    "internalLink": "Link interno",
    "viewProgress": "Vedi avanzamento",
    "generated": "Articolo pronto",
    "failed": "Scrittura non riuscita",
    "viewRetry": "Vedi e riprova",
    "paused": "In pausa (crediti esauriti)"
  },
  "outline": {
    "title": "Struttura dell'articolo",
    "building": "Creazione della struttura…",
    "approxWords": "≈ {count} parole",
    "written": "{done} su {total} scritte",
    "untitled": "Senza titolo",
    "target": "Obiettivo: {count} parole",
    "keyPoints": "Punti chiave",
    "types": {
      "product": "Presentazione del prodotto",
      "products": "Presentazione dei prodotti",
      "comparison": "Confronto",
      "buyingGuide": "Guida all'acquisto",
      "guide": "Guida"
    }
  },
  "editIdea": {
    "subtitle": "Imposta titolo, prodotti e link interno dell'articolo.",
    "titleHint": "Metti la parola chiave principale all'inizio. I titoli sotto i {max} caratteri si vedono per intero su Google.",
    "products": "Prodotti dell'articolo",
    "needProduct": "Aggiungi almeno un prodotto.",
    "removeProduct": "Rimuovi {name}",
    "changeProducts": "Aggiungi o cambia prodotti",
    "link": "Link interno",
    "linkHint": "L'articolo rimanderà a questa pagina del negozio, meglio se la categoria principale di quei prodotti.",
    "categoriesError": "Impossibile caricare le categorie: il link attuale resta invariato.",
    "missingCategory": "La categoria del link attuale non esiste più. Scegline un'altra.",
    "pickTitle": "Scegli i prodotti dell'articolo",
    "pickSubtitle": "I prodotti che questo articolo metterà in evidenza.",
    "pickConfirm": "Usa questi prodotti"
  },
  "category": {
    "filterPrefix": "Categoria:",
    "linkPrefix": "Rimanda a:",
    "all": "Tutte le categorie",
    "home": "Home del negozio",
    "filterNote": "Scegliendo una categoria includi anche i prodotti delle sue sottocategorie.",
    "linkNote": "L'articolo rimanderà a questa pagina.",
    "none": "Nessuna categoria",
    "select": "Scegli una categoria",
    "search": "Cerca categorie",
    "searchPlaceholder": "Cerca categorie…",
    "empty": "Nessuna categoria trovata",
    "emptyHint": "Prova con un'altra ricerca.",
    "collapse": "Nascondi sottocategorie",
    "expand": "Mostra sottocategorie",
    "removeFilter": "Rimuovi filtro categoria",
    "backHome": "Torna alla home del negozio"
  },
  "picker": {
    "loadFailed": "Impossibile caricare i tuoi prodotti.",
    "addFailed": "Impossibile aggiungere questo prodotto.",
    "alreadySelected": "Questo prodotto è già selezionato.",
    "addedAtLimit": "Il prodotto è stato aggiunto, ma hai raggiunto il limite di selezione. Togline uno, poi scegli questo dall'elenco.",
    "existingSelected": "Il prodotto era già nel tuo catalogo: ora è selezionato.",
    "addedSelected": "Prodotto aggiunto e selezionato.",
    "manualTitle": "Aggiungi un prodotto tramite URL",
    "manualHint": "Non trovi un prodotto? Incolla l'URL della sua pagina per aggiungerlo e selezionarlo.",
    "manualBody": "Copia l'URL della pagina prodotto dal tuo negozio e incollalo qui. Recupereremo i dettagli e lo selezioneremo per te.",
    "closeManual": "Chiudi",
    "url": "URL del prodotto",
    "add": "Aggiungi",
    "search": "Cerca prodotti",
    "searchPlaceholder": "Cerca per nome del prodotto…",
    "selected": "Prodotti selezionati",
    "limit": "limite raggiunto",
    "count": "{count} su {max} selezionati",
    "clear": "Svuota",
    "empty": "Nessun prodotto trovato",
    "emptyHint": "Prova con un'altra ricerca o categoria.",
    "more": "Carica altri prodotti"
  },
  "modal": {
    "title": "Scegli come scrivere l'articolo prodotto",
    "imageModel": "Modello per l'immagine in evidenza",
    "featuredImage": "Immagine in evidenza",
    "articlePromptPlaceholder": "es. Punta sui vantaggi del prodotto, usa un tono colloquiale e aggiungi delle FAQ alla fine",
    "imagePromptPlaceholder": "es. Il prodotto su un tavolo di legno nella luce morbida del mattino"
  },
  "body": {
    "saveFailed": "Salvataggio non riuscito.",
    "product": "Prodotto",
    "productNumber": "Prodotto n. {id}",
    "inStock": "Disponibile",
    "outOfStock": "Esaurito",
    "viewProduct": "Vedi e acquista",
    "recommended": "Prodotti consigliati",
    "seoScore": "Punteggio SEO: {score}",
    "writingSection": "Scrittura di questa sezione…",
    "noContent": "Non è ancora stato scritto nulla.",
    "schema": "Schema prodotto"
  },
  "seo": {
    "defaultPrompt": "Suggerisci idee di articoli SEO e consiglia prodotti, partendo dai più venduti e dalle categorie principali del negozio.",
    "manualPrompt": "Suggerisci idee di articoli SEO per i prodotti che ho selezionato.",
    "benefits": {
      "introTitle": "Valorizza i tuoi prodotti",
      "introText": "Articoli che presentano i tuoi prodotti a chi acquista.",
      "googleTitle": "Fatti trovare su Google",
      "googleText": "Porta più clienti nel tuo negozio dalla ricerca.",
      "salesTitle": "Vendi di più",
      "salesText": "Trasforma i lettori in clienti, senza sforzo."
    },
    "heroTitle": "Articoli che vendono i prodotti di {store}",
    "yourStore": "il tuo negozio",
    "heroBody": "Questo strumento propone e scrive articoli sui prodotti del tuo negozio: articoli che li presentano, portano clienti da Google e ti aiutano a vendere di più.",
    "working": "Sto esaminando i tuoi prodotti e preparando le idee. Di solito ci vuole meno di un minuto.",
    "editIdea": "Modifica idea (titolo, prodotti, link interno)",
    "backToIdeas": "Torna alle idee",
    "selectionMethod": "Come scegliere i prodotti",
    "auto": "Scegli per me",
    "manual": "Scegli i prodotti",
    "autoHint": "Sceglieremo noi i prodotti migliori.",
    "manualHint": "Le idee riguarderanno solo i prodotti che scegli.",
    "requestAria": "Chiedi idee per articoli",
    "placeholderManual": "Facoltativo: che taglio vuoi dare agli articoli?",
    "placeholderAuto": "Che tipo di articolo vuoi? (Lascia vuoto e te ne suggerisco uno)",
    "generate": "Ottieni idee",
    "keyHint": "Invio per inviare · Maiusc+Invio per andare a capo",
    "pickTitle": "Scegli i prodotti per le tue idee",
    "pickSubtitle": "Le idee di articoli verranno create solo per i prodotti scelti qui.",
    "pickConfirm": "Conferma",
    "selectedCount": {
      "one": "{count} prodotto selezionato",
      "other": "{count} prodotti selezionati"
    },
    "requestIn": "Ricevuto: le tue idee stanno arrivando.",
    "errors": {
      "slow": "Le idee stanno richiedendo più tempo del solito. Riprova.",
      "open": "Impossibile aprire questa chat.",
      "create": "Impossibile avviare una nuova chat."
    }
  },
  "page": {
    "preparing": "Preparazione dell'articolo prodotto…"
  }
};

export default product;
