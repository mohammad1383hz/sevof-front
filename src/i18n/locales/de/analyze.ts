import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "Die Analyse wurde nicht abgeschlossen",
  "phase": {
    "queued": "Anfrage erhalten",
    "crawling": "Seiten Ihrer Website werden gelesen …",
    "analyzing": "Ihre Inhalte werden analysiert …",
    "done": "Analyse abgeschlossen"
  },
  "ideaSteps": {
    "connecting": "Verbindung zu den Datenquellen (Google Trends, Autocomplete, SERP)",
    "keywords": "Keywords rund um Ihre Kernthemen werden bewertet",
    "generating": "Die KI entwickelt Artikelideen",
    "scoring": "Wettbewerb wird geprüft und SEO-Score berechnet"
  },
  "empty": {
    "title": "Website analysieren",
    "body": "Geben Sie unten eine Domain ein – wir ermitteln Ihre Branche, fassen Ihre Inhalte zusammen und zeigen die zentralen Themen (Entitäten), die Sie abdecken.",
    "tagEntities": "Entitätsanalyse",
    "tagIdeas": "Artikelideen"
  },
  "input": {
    "placeholder": "beispiel.de – Ihre Website-Adresse",
    "submit": "Analysieren"
  },
  "progress": {
    "title": "In Bearbeitung",
    "inProgress": "Läuft …",
    "done": "Fertig",
    "hint": "Das dauert meist ein paar Minuten."
  },
  "ideasBar": {
    "limit": "Sie haben Ihr Limit für Ideen erreicht",
    "generating": "Wird geschrieben …",
    "cta": "Artikelchancen finden"
  },
  "ideas": {
    "ready": {
      "one": "{count} Idee bereit",
      "other": "{count} Ideen bereit"
    },
    "preparing": "Wird vorbereitet …",
    "generatingTitle": "Artikelideen werden entwickelt",
    "retrying": "Neuer Versuch …",
    "retry": "Erneut versuchen"
  },
  "chat": {
    "yourRequest": "Ihre Anfrage",
    "preparingIdeas": "Ideen für Ihre Website werden zusammengestellt …",
    "articleHeader": "Artikel in diesem Chat schreiben",
    "assistant": "Content-Strategie-Assistent",
    "selectedEntity": "Fokusthema: {name}",
    "preparing": "Neuer Chat wird gestartet …"
  },
  "research": {
    "failed": "Die Content-Recherche wurde nicht abgeschlossen",
    "clustersTitle": "Keyword-Cluster werden gebildet",
    "gapsTitle": "Wettbewerber und Content-Lücken werden analysiert",
    "clusters": "Keyword-Cluster",
    "gapsResult": "Content-Lücken & Wettbewerbsanalyse",
    "clusterSteps": {
      "read": "Themen und Keywords Ihrer Website werden gelesen",
      "build": "Suchanfragen werden zu Clustern gruppiert",
      "estimate": "Potenzial und Trends werden geschätzt"
    },
    "gapSteps": {
      "context": "Ihr Geschäftsmodell wird erfasst",
      "competitors": "Echte Wettbewerber werden ermittelt",
      "gaps": "Content-Lücken werden aufgespürt"
    },
    "intent": {
      "informational": "Informational",
      "commercial": "Kommerziell",
      "transactional": "Transaktional",
      "navigational": "Navigational"
    },
    "coverage": {
      "missing": "Nicht in den Google-Ergebnissen",
      "weak": "Schwaches Ranking",
      "low": "Niedriges Ranking"
    },
    "level": {
      "low": "gering",
      "medium": "mittel",
      "high": "hoch"
    },
    "priority": {
      "high": "Hohe Priorität",
      "medium": "Mittlere Priorität",
      "low": "Niedrige Priorität"
    },
    "difficulty": {
      "unavailable": "In dieser Quelle nicht verfügbar",
      "estimated": "{score}/100 · KI-Schätzung"
    },
    "volumeEstimate": "KI-Schätzung",
    "volumeObserved": "Echte Impressionen",
    "trend": "Trend",
    "trendNeedsTwo": "Zwei Zeiträume zum Vergleich nötig",
    "trendUnavailable": "Keine Trendschätzung",
    "stats": {
      "competitors": "Echte Wettbewerber",
      "opportunities": "Content-Chancen",
      "avgScore": "Ø Chancen-Score",
      "highThreat": "Starke Wettbewerber"
    },
    "strengths": "Das macht Ihre Website gut",
    "weaknesses": "Hier gibt es Potenzial",
    "visibility": "Sichtbarkeit in der Suche",
    "depth": "Inhaltstiefe",
    "opportunitiesTitle": "Content-Chancen (abgeglichen mit echten Google-Ergebnissen)",
    "takeAction": "Umsetzen",
    "recommendedAction": "Empfohlener Ansatz",
    "competitorSites": "Wettbewerber ({count})",
    "rank": "Position {rank}",
    "rankUnavailable": "Position unbekannt",
    "sharedKeywords": {
      "one": "{count} gemeinsames Keyword",
      "other": "{count} gemeinsame Keywords"
    },
    "moreDetails": "Mehr Details",
    "missing": "Das fehlt Ihrer Website",
    "recommendations": "Allgemeine Empfehlungen",
    "action": "Nächster Schritt: {action}",
    "fullReport": "Vollständigen Recherchebericht öffnen",
    "opportunityScore": "Chance {score}/100",
    "threat": "Bedrohung: {level}",
    "received": "Alles klar! Die Rechercheergebnisse erscheinen direkt hier im Chat."
  },
  "entities": {
    "title": "Gefundene Themen",
    "empty": "Noch keine Themen gefunden."
  },
  "request": {
    "title": "Content-Analyse anfragen",
    "body": "Die KI wertet Ihre Inhalte und Ihre Wettbewerber aus und findet neue Content-Chancen"
  },
  "summary": {
    "title": "Analyseergebnis",
    "industry": "Branche: {niche}"
  },
  "user": {
    "start": "Diese Website analysieren"
  },
  "idea": {
    "edit": "Idee bearbeiten",
    "editShort": "Bearbeiten",
    "save": "Änderungen speichern",
    "category": "Kategorie:",
    "noLinks": "Keine internen Links gefunden",
    "linksLabel": "Interne Links:",
    "linksHint": "Der fertige Artikel verlinkt auf diese Seiten",
    "viewArticle": "Artikel ansehen",
    "viewArticleHint": "Den aus dieser Idee entstandenen Artikel öffnen",
    "generatingHint": "Zu dieser Idee wird gerade ein Artikel geschrieben",
    "fields": {
      "title": "Titel",
      "titlePlaceholder": "Titel der Idee",
      "hook": "Aufhänger",
      "hookPlaceholder": "Ein Einstieg, der neugierig macht",
      "meta": "Meta-Beschreibung",
      "metaPlaceholder": "Eine kurze Zusammenfassung für die Suchergebnisse",
      "tags": "Tags",
      "tagsHint": "(durch Kommas getrennt)",
      "tagsPlaceholder": "SEO, Marketing, Content",
      "links": "Interne Links",
      "linkTitle": "Linktext",
      "related": "Weitere",
      "removeLink": "Link entfernen",
      "addLink": "Weiteren Link hinzufügen",
      "outline": "Gliederung",
      "outlineHint": "(eine Überschrift pro Zeile)"
    },
    "score": {
      "entity": "Themenrelevanz",
      "intent": "Suchintention",
      "business": "Geschäftlicher Nutzen",
      "serp": "Chancen gegen den Wettbewerb bei Google",
      "summary": "Fazit:"
    },
    "errors": {
      "save": "Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut."
    }
  },
  "gsc": {
    "connect": "Google Search Console verbinden",
    "reconnect": "Google Search Console neu verbinden",
    "title": "Live-Daten aus der Google Search Console",
    "body": "Nutzen Sie Ihre echten Suchanfragen, Impressionen, Klicks, CTR und Rankings für die Content-Recherche – mit reinem Lesezugriff.",
    "connected": "Konto verbunden",
    "showProperties": "Meine bestätigten Websites anzeigen",
    "selectProperty": "Property auswählen",
    "connectProperty": "Diese Website verwenden",
    "lastSynced": "Zuletzt synchronisiert: {date}",
    "noData": "Noch keine Daten.",
    "syncing": "Wird abgerufen …",
    "sync": "Jetzt synchronisieren",
    "impressions": "Impressionen",
    "clicks": "Klicks",
    "topQueries": "Top-Suchanfragen nach Impressionen",
    "queryStats": "{impressions} Impressionen · Position {position}",
    "errors": {
      "start": "Die Verbindung zur Google Search Console konnte nicht gestartet werden.",
      "noProperties": "Das verbundene Google-Konto hat keine verifizierten Websites. Trennen Sie es im Automatisierungs-Dashboard Ihrer Website und verbinden Sie das richtige Konto.",
      "properties": "Ihre Search-Console-Websites konnten nicht geladen werden.",
      "select": "Diese Property konnte nicht verbunden werden.",
      "sync": "Die Search-Console-Synchronisierung konnte nicht gestartet werden.",
      "disconnect": "Die Search Console konnte nicht getrennt werden."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Artikelthemen vorschlagen",
      "prompt": "Schlage mir konkrete, umsetzbare Content-Chancen vor, die auf relevanten Trends für diese Website basieren."
    },
    "gap": {
      "label": "Content-Lücken gegenüber Wettbewerbern",
      "prompt": "Analysiere die relevanten Wettbewerber dieser Website und ihre wichtigsten Content-Lücken. Erkläre zu jeder Lücke, warum sie wichtig ist, wie groß die Bedrohung ist, und schlage einen Ansatz vor, um sie zu schließen."
    },
    "limit": "Für mehr wechseln Sie bitte in einen höheren Tarif.",
    "choosePath": "Rechercheart wählen",
    "gscConnect": "Search Console verbinden",
    "connectGoogle": "Google-Konto verbinden",
    "loadingSites": "Websites werden geladen …",
    "showSites": "Meine Websites anzeigen",
    "select": "Auswählen",
    "queriesReceived": "{count} Suchanfragen erhalten",
    "loadingData": "Daten werden geladen …",
    "readyToFetch": "Verbunden – bereit zum Abrufen",
    "fetch": "Daten abrufen",
    "connectedQueries": "Search Console verbunden · {count} Suchanfragen",
    "fetchingGsc": "Daten werden aus der Search Console abgerufen …",
    "gscConnected": "Search Console verbunden",
    "placeholder": "Stellen Sie eine Frage oder beschreiben Sie Ihr Anliegen …",
    "send": "Senden"
  },
  "credits": {
    "banner": "Ihre kostenlosen Chat-Credits für den Content-Assistenten sind aufgebraucht. {still} Wählen Sie einen Tarif, um weiter zu chatten.",
    "bannerStill": "Aus Ihren vorhandenen Ideen können Sie weiterhin Artikel schreiben lassen.",
    "viewPlans": "Tarife ansehen",
    "chatFree": "Ihre kostenlosen Chat-Credits für den Content-Assistenten sind aufgebraucht, daher sind keine neuen Fragen möglich – aus Ihren vorhandenen Ideen können Sie aber weiterhin Artikel schreiben lassen. Zum Weiterchatten wählen Sie einen Tarif auf der Abo-Seite (/subscription).",
    "chatPaid": "Ihre Credits für den Content-Assistenten reichen nicht aus. Aus Ihren vorhandenen Ideen können Sie aber weiterhin Artikel schreiben lassen. Laden Sie auf oder upgraden Sie auf der Abo-Seite (/subscription).",
    "shortFree": "Ihre kostenlosen Credits sind aufgebraucht. Mit einem Abo geht es weiter.",
    "shortPaid": "Ihre Credits sind aufgebraucht. Laden Sie auf oder upgraden Sie Ihren Tarif.",
    "barFree": "Ihre kostenlosen Credits für den Content-Assistenten sind aufgebraucht. Mit einem Abo geht es weiter.",
    "barPaid": "Nicht genügend Credits für die Content-Analyse. Laden Sie auf oder upgraden Sie Ihren Tarif."
  },
  "entity": {
    "pick": "Thema auswählen",
    "pickPrompt": "Damit wir präzise Content-Chancen finden und passende interne Links setzen können, wählen Sie bitte das Thema (die Entität), auf das wir uns konzentrieren sollen.",
    "confirmed": "Super – Ihre Anfrage ist eingegangen! Die Ergebnisse beziehen sich nur auf das gewählte Thema, und jeder Artikel verlinkt auf die passende Seite Ihrer Website."
  },
  "gapPrompt": "Erstelle eine Content-Idee samt Plan für diese Chance, die durch den Abgleich mit echten Google-Ergebnissen gefunden wurde:\nChance: {title}\nZiel-Suchanfrage: {query}\nDetails: {details}\nEmpfohlener Ansatz: {angle}",
  "gapLabel": "Umsetzen: {title}",
  "article": {
    "request": "Schreibe einen Artikel zur Idee „{title}“.",
    "started": "Der Artikel wird gerade in diesem Chat geschrieben."
  },
  "nav": {
    "previous": "Vorherige Nachricht",
    "next": "Nächste Nachricht",
    "latest": "Zur neuesten Nachricht",
    "latestShort": "Neueste"
  },
  "welcome": {
    "title": "SEO-Agent für {domain}",
    "hello": "Hallo! Ich bin der SEO-Assistent für {domain}.",
    "what": "Ich recherchiere die Keywords, auf die es ankommt, finde neue Content-Chancen, nehme Ihre Wettbewerber unter die Lupe und schlage Themen vor, mit denen Ihre Website wächst.",
    "ask": "Fragen Sie mich alles rund um SEO und die Inhalte Ihrer Website."
  },
  "errors": {
    "saveMessage": "Diese Nachricht konnte nicht gespeichert werden.",
    "researchResults": "Die Rechercheergebnisse konnten nicht geladen werden.",
    "history": "Der Verlauf dieses Chats konnte nicht geladen werden.",
    "startSession": "Der Analyse-Chat für diese Website konnte nicht gestartet werden.",
    "research": "Die Anfrage zur Content-Recherche ist fehlgeschlagen.",
    "opportunities": "Die Anfrage nach Content-Chancen ist fehlgeschlagen.",
    "retry": "Der erneute Versuch hat nicht funktioniert.",
    "status": "Der Analysestatus konnte nicht abgerufen werden.",
    "domainRequired": "Geben Sie eine Domain ein, z. B. beispiel.de.",
    "domainInvalid": "Geben Sie nur die Domain ein – ohne http:// oder Pfad –, z. B. beispiel.de.",
    "addDomain": "Diese Domain konnte nicht hinzugefügt werden."
  }
};

export default analyze;
