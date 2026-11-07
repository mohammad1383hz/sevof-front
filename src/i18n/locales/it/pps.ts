import type en from "../en/pps";

const pps: typeof en = {
  "title": "SEO delle schede prodotto",
  "subtitle": "Scegli i prodotti: troviamo e completiamo ciò che manca. Tu controlli, modifichi e approvi tutto prima che venga salvato qualcosa.",
  "fields": {
    "short_description": "Descrizione breve",
    "description": "Descrizione completa",
    "attributes": "Caratteristiche",
    "tags": "Tag del prodotto",
    "faq": "FAQ",
    "image_alts": "Testo alternativo delle immagini",
    "seo_title": "Titolo SEO",
    "meta_description": "Meta description",
    "focus_keyword": "Parola chiave principale",
    "category_link": "Link alla categoria"
  },
  "status": {
    "pending": "In coda",
    "analyzing": "Analisi in corso",
    "ready": "Da sistemare",
    "skipped": "Tutto a posto",
    "approved": "Invio in corso",
    "published": "Pubblicato",
    "failed": "Errore"
  },
  "source": {
    "seller": "Dati del tuo negozio",
    "ai": "Suggerimento dell'IA",
    "user": "Tua modifica"
  },
  "stats": {
    "total": "Prodotti",
    "issues": "Da completare"
  },
  "quota": {
    "exhausted": "Hai usato tutti i crediti del piano gratuito",
    "freePlan": "Piano gratuito: {count} prodotti",
    "used": "{used} prodotti usati su {total}",
    "remaining": "ne restano {count}",
    "upgrade": "Passa a Pro per ottimizzare fino a {count} prodotti alla volta.",
    "upgradeMore": "Passa a Pro per selezionarne di più",
    "selectionsUsed": "Hai usato tutte le selezioni del piano gratuito.",
    "selectMore": "Con il piano gratuito puoi selezionare ancora {count} prodotti.",
    "perBatch": "Fino a {count} prodotti alla volta."
  },
  "results": "Risultati",
  "processing": "Elaborazione",
  "selectAllIssues": "Seleziona tutto ciò che è da sistemare",
  "selectProduct": "Seleziona {name}",
  "deletedProduct": "Prodotto eliminato",
  "notFound": "{field} non trovato",
  "missing": "Manca {field}",
  "review": "Controlla e completa",
  "clearSelection": "Annulla selezione",
  "start": "Avvia l'ottimizzazione",
  "selectAll": "Seleziona tutto",
  "deselectAll": "Deseleziona tutto",
  "noProducts": "Ancora nessun prodotto sincronizzato.",
  "showMore": "Mostra altri",
  "preview": "Anteprima",
  "issuesFound": "Cosa manca a questo prodotto",
  "aiNotice": "Questi contenuti sono stati proposti dall'IA e possono contenere errori. Controllali prima di approvarli e usa «Modifica» per cambiare ciò che vuoi.",
  "sellerInput": "Solo tu puoi compilare questi campi",
  "verifyNumbers": "Controlla questi numeri",
  "verifyNumbersBody": "Questi numeri compaiono nel testo ma non nei dati attuali del prodotto:",
  "selectAllFields": "Seleziona tutti i campi",
  "suggested": "Suggerito",
  "current": "Attuale",
  "edited": "Modificato",
  "unsaved": "Non salvato",
  "restore": "Ripristina",
  "cancelEdit": "Annulla modifica",
  "unsavedHint": "Hai modifiche non salvate: verranno salvate automaticamente quando clicchi su «Sistema sul tuo sito».",
  "approvedOnly": "Sul prodotto verranno aggiornati solo i campi approvati.",
  "saveEdits": "Salva modifiche ({count})",
  "fixOnSite": "Sistema sul tuo sito",
  "confirmDiscard": "Le modifiche non salvate andranno perse. Continuare?",
  "noAttributes": "Ancora nessuna caratteristica.",
  "attrName": "Nome",
  "attrNameAria": "Nome della caratteristica",
  "attrValue": "Valore",
  "attrValueAria": "Valore della caratteristica",
  "removeAttr": "Rimuovi caratteristica",
  "addAttr": "Aggiungi caratteristica",
  "tagsPlaceholder": "Separa i tag con virgole",
  "tagsHint": "I tag attuali restano: questi vengono aggiunti.",
  "removeQuestion": "Rimuovi domanda",
  "addQuestion": "Aggiungi domanda",
  "altAria": "Testo alternativo dell'immagine {index}",
  "altHint": "Viene inviato solo per le immagini senza testo alternativo. I testi alternativi già presenti sul tuo sito restano invariati.",
  "formatHint": "Lascia una riga vuota tra i paragrafi. Titoli: «## Titolo» o «### Titolo» · Elenchi: «- Voce»",
  "bulk": {
    "sending": "Invio {done} di {total}",
    "fixSelected": "Sistema i selezionati sul sito",
    "done": {
      "one": "{count} prodotto approvato e in invio al tuo sito",
      "other": "{count} prodotti approvati e in invio al tuo sito"
    },
    "failed": "{count} non riusciti",
    "more": "…e altri {count}",
    "confirmTitle": "Applicare tutte le correzioni insieme?",
    "confirmBody": "Tutti i campi suggeriti per questi {count} prodotti — descrizioni, caratteristiche, tag, FAQ, testi alternativi e impostazioni SEO — verranno inviati direttamente al tuo sito senza controllo singolo. Trattandosi di contenuti generati dall'IA, ti consigliamo di verificarne almeno alcuni con «Controlla e completa».",
    "confirm": "Conferma e invia"
  },
  "validation": {
    "attr": "Ogni caratteristica deve avere un nome e un valore.",
    "empty": "«{field}» non può essere vuoto.",
    "tagsMax": "Puoi aggiungere fino a {max} tag.",
    "tagLength": "Ogni tag può avere al massimo {max} caratteri.",
    "faq": "Ogni FAQ deve avere una domanda e una risposta.",
    "faqLength": "Le domande possono avere fino a {q} caratteri e le risposte fino a {a}.",
    "altEmpty": "Il testo alternativo non può essere vuoto.",
    "altLength": "Il testo alternativo di ogni immagine può avere al massimo {max} caratteri.",
    "maxLength": "«{field}» può avere al massimo {max} caratteri."
  },
  "errors": {
    "results": "Impossibile caricare i risultati SEO.",
    "products": "Impossibile caricare i tuoi prodotti.",
    "start": "Impossibile avviare l'ottimizzazione.",
    "preview": "Impossibile caricare l'anteprima.",
    "noFields": "Non ci sono campi da inviare.",
    "restore": "Ripristino non riuscito.",
    "noneSelected": "Nessun campo selezionato.",
    "submit": "Impossibile inviare le modifiche."
  }
};

export default pps;
