import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Suche löschen",
  "errors": {
    "server": "Der Server ist nicht erreichbar. Bitte versuchen Sie es erneut.",
    "serverShort": "Der Server ist nicht erreichbar."
  },
  "styles": {
    "price": "Preis & Budget",
    "comparison": "Produktvergleich",
    "buying_guide": "Kaufberatung"
  },
  "steps": {
    "brief": "Analyse & Briefing",
    "briefHint": "Produkte und Zielgruppe verstehen",
    "plan": "Planung",
    "planHint": "Produkte den Abschnitten zuordnen",
    "sections": "Schreiben",
    "sectionsHint": "Ein Abschnitt nach dem anderen",
    "written": "{done} von {total} Abschnitten geschrieben"
  },
  "idea": {
    "internalLink": "Interner Link",
    "viewProgress": "Fortschritt ansehen",
    "generated": "Artikel fertig",
    "failed": "Schreiben fehlgeschlagen",
    "viewRetry": "Ansehen & erneut versuchen",
    "paused": "Pausiert (keine Credits mehr)"
  },
  "outline": {
    "title": "Gliederung",
    "building": "Gliederung wird erstellt …",
    "approxWords": "≈ {count} Wörter",
    "written": "{done} von {total} geschrieben",
    "untitled": "Ohne Titel",
    "target": "Ziel: {count} Wörter",
    "keyPoints": "Kernpunkte",
    "types": {
      "product": "Produktvorstellung",
      "products": "Produktvorstellungen",
      "comparison": "Vergleich",
      "buyingGuide": "Kaufberatung",
      "guide": "Ratgeber"
    }
  },
  "editIdea": {
    "subtitle": "Legen Sie Titel, Produkte und internen Link des Artikels fest.",
    "titleHint": "Setzen Sie das Haupt-Keyword an den Anfang. Titel unter {max} Zeichen zeigt Google vollständig an.",
    "products": "Produkte in diesem Artikel",
    "needProduct": "Fügen Sie mindestens ein Produkt hinzu.",
    "removeProduct": "{name} entfernen",
    "changeProducts": "Produkte hinzufügen oder ändern",
    "link": "Interner Link",
    "linkHint": "Der Artikel verlinkt auf diese Shopseite – idealerweise die Hauptkategorie dieser Produkte.",
    "categoriesError": "Ihre Kategorien konnten nicht geladen werden; der aktuelle Link bleibt erhalten.",
    "missingCategory": "Die Kategorie des aktuellen Links gibt es nicht mehr. Bitte wählen Sie eine andere.",
    "pickTitle": "Produkte für den Artikel wählen",
    "pickSubtitle": "Diese Produkte stellt der Artikel vor.",
    "pickConfirm": "Diese Produkte übernehmen"
  },
  "category": {
    "filterPrefix": "Kategorie:",
    "linkPrefix": "Verlinkt auf:",
    "all": "Alle Kategorien",
    "home": "Shop-Startseite",
    "filterNote": "Eine Kategorie schließt auch die Produkte ihrer Unterkategorien ein.",
    "linkNote": "Der Artikel verlinkt auf diese Seite.",
    "none": "Keine Kategorien",
    "select": "Kategorie wählen",
    "search": "Kategorien durchsuchen",
    "searchPlaceholder": "Kategorien durchsuchen …",
    "empty": "Keine Kategorien gefunden",
    "emptyHint": "Versuchen Sie einen anderen Suchbegriff.",
    "collapse": "Unterkategorien ausblenden",
    "expand": "Unterkategorien anzeigen",
    "removeFilter": "Kategoriefilter entfernen",
    "backHome": "Zurück zur Shop-Startseite"
  },
  "picker": {
    "loadFailed": "Ihre Produkte konnten nicht geladen werden.",
    "addFailed": "Dieses Produkt konnte nicht hinzugefügt werden.",
    "alreadySelected": "Dieses Produkt ist bereits ausgewählt.",
    "addedAtLimit": "Das Produkt wurde hinzugefügt, aber Ihr Auswahllimit ist erreicht. Entfernen Sie ein Produkt und wählen Sie dieses dann aus der Liste.",
    "existingSelected": "Dieses Produkt war bereits in Ihrem Katalog – es ist jetzt ausgewählt.",
    "addedSelected": "Produkt hinzugefügt und ausgewählt.",
    "manualTitle": "Produkt per URL hinzufügen",
    "manualHint": "Produkt nicht gefunden? Fügen Sie die URL der Produktseite ein, um es hinzuzufügen und auszuwählen.",
    "manualBody": "Kopieren Sie die URL der Produktseite aus Ihrem Shop und fügen Sie sie hier ein. Wir übernehmen die Details und wählen das Produkt für Sie aus.",
    "closeManual": "Schließen",
    "url": "Produkt-URL",
    "add": "Hinzufügen",
    "search": "Produkte durchsuchen",
    "searchPlaceholder": "Nach Produktnamen suchen …",
    "selected": "Ausgewählte Produkte",
    "limit": "Limit erreicht",
    "count": "{count} von {max} ausgewählt",
    "clear": "Leeren",
    "empty": "Keine Produkte gefunden",
    "emptyHint": "Versuchen Sie einen anderen Suchbegriff oder eine andere Kategorie.",
    "more": "Weitere Produkte laden"
  },
  "modal": {
    "title": "So soll Ihr Produktartikel entstehen",
    "imageModel": "Modell für das Beitragsbild",
    "featuredImage": "Beitragsbild",
    "articlePromptPlaceholder": "z. B. Fokus auf die Vorteile des Produkts, gesprächiger Ton und am Ende ein FAQ",
    "imagePromptPlaceholder": "z. B. Das Produkt auf einem Holztisch im sanften Morgenlicht"
  },
  "body": {
    "saveFailed": "Speichern fehlgeschlagen.",
    "product": "Produkt",
    "productNumber": "Produkt Nr. {id}",
    "inStock": "Auf Lager",
    "outOfStock": "Nicht vorrätig",
    "viewProduct": "Ansehen & kaufen",
    "recommended": "Empfohlene Produkte",
    "seoScore": "SEO-Score: {score}",
    "writingSection": "Dieser Abschnitt wird geschrieben …",
    "noContent": "Noch nichts geschrieben.",
    "schema": "Produkt-Schema"
  },
  "seo": {
    "defaultPrompt": "Schlage SEO-Artikelideen vor und empfiehl passende Produkte – auf Basis der Bestseller und Hauptkategorien des Shops.",
    "manualPrompt": "Schlage SEO-Artikelideen für die von mir ausgewählten Produkte vor.",
    "benefits": {
      "introTitle": "Produkte ins Rampenlicht",
      "introText": "Artikel, die Ihre Produkte potenziellen Kunden vorstellen.",
      "googleTitle": "Bei Google gefunden werden",
      "googleText": "Mehr Besucher aus der Suche in Ihren Shop holen.",
      "salesTitle": "Mehr verkaufen",
      "salesText": "Aus Lesern ganz einfach Kunden machen."
    },
    "heroTitle": "Artikel, die die Produkte von {store} verkaufen",
    "yourStore": "Ihrem Shop",
    "heroBody": "Dieses Tool schlägt Artikel rund um die Produkte Ihres Shops vor und schreibt sie – Artikel, die Ihre Produkte vorstellen, Besucher über Google in den Shop bringen und Ihren Umsatz steigern.",
    "working": "Ich sehe mir Ihre Produkte an und entwickle Ideen. Das dauert meist weniger als eine Minute.",
    "editIdea": "Idee bearbeiten (Titel, Produkte, interner Link)",
    "backToIdeas": "Zurück zu den Ideen",
    "selectionMethod": "Wie sollen Produkte gewählt werden?",
    "auto": "Für mich auswählen",
    "manual": "Produkte wählen",
    "autoHint": "Wir wählen die besten Produkte für Sie aus.",
    "manualHint": "Die Ideen beziehen sich nur auf die von Ihnen gewählten Produkte.",
    "requestAria": "Artikelideen anfragen",
    "placeholderManual": "Optional: Welchen Blickwinkel sollen die Artikel haben?",
    "placeholderAuto": "Welche Art von Artikel wünschen Sie? (Leer lassen, dann mache ich einen Vorschlag)",
    "generate": "Ideen erhalten",
    "keyHint": "Enter zum Senden · Umschalt+Enter für eine neue Zeile",
    "pickTitle": "Produkte für Ihre Ideen wählen",
    "pickSubtitle": "Artikelideen entstehen nur für die hier gewählten Produkte.",
    "pickConfirm": "Bestätigen",
    "selectedCount": {
      "one": "{count} Produkt ausgewählt",
      "other": "{count} Produkte ausgewählt"
    },
    "requestIn": "Alles klar – Ihre Ideen sind unterwegs.",
    "errors": {
      "slow": "Die Ideen brauchen länger als üblich. Bitte versuchen Sie es erneut.",
      "open": "Dieser Chat konnte nicht geöffnet werden.",
      "create": "Ein neuer Chat konnte nicht gestartet werden."
    }
  },
  "page": {
    "preparing": "Ihr Produktartikel wird vorbereitet …"
  }
};

export default product;
