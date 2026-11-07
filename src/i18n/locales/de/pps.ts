import type en from "../en/pps";

const pps: typeof en = {
  "title": "Produktseiten-SEO",
  "subtitle": "Wählen Sie Produkte aus – wir finden fehlende Angaben und ergänzen sie. Sie prüfen und bearbeiten alles und geben es frei, bevor etwas gespeichert wird.",
  "fields": {
    "short_description": "Kurzbeschreibung",
    "description": "Ausführliche Beschreibung",
    "attributes": "Eigenschaften",
    "tags": "Produkt-Tags",
    "faq": "FAQ",
    "image_alts": "Alt-Texte der Bilder",
    "seo_title": "SEO-Titel",
    "meta_description": "Meta-Beschreibung",
    "focus_keyword": "Fokus-Keyword",
    "category_link": "Link zur Kategorie"
  },
  "status": {
    "pending": "In der Warteschlange",
    "analyzing": "Wird analysiert",
    "ready": "Handlungsbedarf",
    "skipped": "Alles in Ordnung",
    "approved": "Wird gesendet",
    "published": "Veröffentlicht",
    "failed": "Fehler"
  },
  "source": {
    "seller": "Ihre Shopdaten",
    "ai": "KI-Vorschlag",
    "user": "Ihre Bearbeitung"
  },
  "stats": {
    "total": "Produkte",
    "issues": "Mit Lücken"
  },
  "quota": {
    "exhausted": "Ihre Credits im kostenlosen Tarif sind aufgebraucht",
    "freePlan": "Kostenloser Tarif: {count} Produkte",
    "used": "{used} von {total} Produkten genutzt",
    "remaining": "noch {count}",
    "upgrade": "Mit Pro optimieren Sie bis zu {count} Produkte auf einmal.",
    "upgradeMore": "Mit Pro mehr auswählen",
    "selectionsUsed": "Ihre Auswahl im kostenlosen Tarif ist ausgeschöpft.",
    "selectMore": "Im kostenlosen Tarif können Sie noch {count} Produkte auswählen.",
    "perBatch": "Bis zu {count} Produkte auf einmal."
  },
  "results": "Ergebnisse",
  "processing": "In Bearbeitung",
  "selectAllIssues": "Alles mit Handlungsbedarf auswählen",
  "selectProduct": "{name} auswählen",
  "deletedProduct": "Gelöschtes Produkt",
  "notFound": "{field} nicht gefunden",
  "missing": "{field} fehlt",
  "review": "Prüfen & ergänzen",
  "clearSelection": "Auswahl aufheben",
  "start": "Optimierung starten",
  "selectAll": "Alle auswählen",
  "deselectAll": "Auswahl aufheben",
  "noProducts": "Noch keine Produkte synchronisiert.",
  "showMore": "Mehr anzeigen",
  "preview": "Vorschau",
  "issuesFound": "Das fehlt bei diesem Produkt",
  "aiNotice": "Diese Inhalte hat eine KI vorgeschlagen; sie können Fehler enthalten. Prüfen Sie sie vor der Freigabe und ändern Sie über „Bearbeiten“, was Sie möchten.",
  "sellerInput": "Diese Angaben können nur Sie ergänzen",
  "verifyNumbers": "Bitte diese Zahlen prüfen",
  "verifyNumbersBody": "Diese Zahlen stehen im Text, aber nicht in Ihren aktuellen Produktdaten:",
  "selectAllFields": "Alle Felder auswählen",
  "suggested": "Vorschlag",
  "current": "Aktuell",
  "edited": "Bearbeitet",
  "unsaved": "Nicht gespeichert",
  "restore": "Wiederherstellen",
  "cancelEdit": "Bearbeitung abbrechen",
  "unsavedHint": "Sie haben ungespeicherte Änderungen – sie werden automatisch gespeichert, wenn Sie auf „Auf Ihrer Website ergänzen“ klicken.",
  "approvedOnly": "Nur die freigegebenen Felder werden bei Ihrem Produkt aktualisiert.",
  "saveEdits": "Änderungen speichern ({count})",
  "fixOnSite": "Auf Ihrer Website ergänzen",
  "confirmDiscard": "Ihre ungespeicherten Änderungen gehen verloren. Fortfahren?",
  "noAttributes": "Noch keine Eigenschaften.",
  "attrName": "Name",
  "attrNameAria": "Name der Eigenschaft",
  "attrValue": "Wert",
  "attrValueAria": "Wert der Eigenschaft",
  "removeAttr": "Eigenschaft entfernen",
  "addAttr": "Eigenschaft hinzufügen",
  "tagsPlaceholder": "Tags durch Kommas trennen",
  "tagsHint": "Ihre bestehenden Tags bleiben erhalten – diese kommen hinzu.",
  "removeQuestion": "Frage entfernen",
  "addQuestion": "Frage hinzufügen",
  "altAria": "Alt-Text für Bild {index}",
  "altHint": "Wird nur für Bilder ohne Alt-Text gesendet. Bestehende Alt-Texte auf Ihrer Website bleiben unverändert.",
  "formatHint": "Absätze durch eine Leerzeile trennen. Überschriften: „## Überschrift“ oder „### Überschrift“ · Listen: „- Punkt“",
  "bulk": {
    "sending": "{done} von {total} werden gesendet",
    "fixSelected": "Ausgewählte auf der Website ergänzen",
    "done": {
      "one": "{count} Produkt freigegeben und auf dem Weg zu Ihrer Website",
      "other": "{count} Produkte freigegeben und auf dem Weg zu Ihrer Website"
    },
    "failed": "{count} fehlgeschlagen",
    "more": "… und {count} weitere",
    "confirmTitle": "Alle Ergänzungen auf einmal übernehmen?",
    "confirmBody": "Alle vorgeschlagenen Felder dieser {count} Produkte – Beschreibungen, Eigenschaften, Tags, FAQ, Alt-Texte und SEO-Einstellungen – gehen ohne Einzelprüfung direkt auf Ihre Website. Da die Inhalte von einer KI stammen, empfehlen wir, zumindest einige vorher über „Prüfen & ergänzen“ anzusehen.",
    "confirm": "Bestätigen & senden"
  },
  "validation": {
    "attr": "Jede Eigenschaft braucht einen Namen und einen Wert.",
    "empty": "„{field}“ darf nicht leer sein.",
    "tagsMax": "Sie können bis zu {max} Tags hinzufügen.",
    "tagLength": "Jeder Tag darf höchstens {max} Zeichen lang sein.",
    "faq": "Jeder FAQ-Eintrag braucht eine Frage und eine Antwort.",
    "faqLength": "Fragen dürfen bis zu {q} Zeichen lang sein, Antworten bis zu {a}.",
    "altEmpty": "Der Alt-Text darf nicht leer sein.",
    "altLength": "Der Alt-Text jedes Bildes darf höchstens {max} Zeichen lang sein.",
    "maxLength": "„{field}“ darf höchstens {max} Zeichen lang sein."
  },
  "errors": {
    "results": "Die SEO-Ergebnisse konnten nicht geladen werden.",
    "products": "Ihre Produkte konnten nicht geladen werden.",
    "start": "Die Optimierung konnte nicht gestartet werden.",
    "preview": "Die Vorschau konnte nicht geladen werden.",
    "noFields": "Es gibt keine Felder zum Senden.",
    "restore": "Wiederherstellen hat nicht funktioniert.",
    "noneSelected": "Keine Felder ausgewählt.",
    "submit": "Die Änderungen konnten nicht gesendet werden."
  }
};

export default pps;
