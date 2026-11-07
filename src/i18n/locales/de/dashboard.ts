import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Ansehen",
  "noResults": "Keine Treffer für Ihre Suche.",
  "page": {
    "title": "Artikel-Dashboard",
    "subtitle": "Was Ihr KI-Agent auf dieser Website erledigt",
    "noSiteTitle": "Noch keine Website hinzugefügt",
    "noSiteBody": "Fügen Sie eine Website hinzu, um Ideen, Artikel und Autopilot-Aktivitäten zu sehen."
  },
  "errors": {
    "load": "Das Dashboard konnte nicht geladen werden.",
    "network": "Verbindungsproblem – das Dashboard konnte nicht geladen werden.",
    "autopilot": "Der Autopilot konnte nicht aktualisiert werden.",
    "ideas": "Beim Erstellen der Ideen ist etwas schiefgelaufen.",
    "invalidSite": "Dieser Website-Link ist ungültig.",
    "ideasLoad": "Die Content-Ideen konnten nicht geladen werden.",
    "writtenLoad": "Die geschriebenen Artikel konnten nicht geladen werden.",
    "publishedLoad": "Die veröffentlichten Artikel konnten nicht geladen werden.",
    "keywordsLoad": "Die Keywords konnten nicht geladen werden."
  },
  "articleStatus": {
    "completed": "Fertig",
    "failed": "Fehlgeschlagen",
    "pending": "In der Warteschlange",
    "generating": "Wird geschrieben …"
  },
  "ideaStatus": {
    "approved": "Freigegeben",
    "rejected": "Abgelehnt",
    "used": "Verwendet",
    "recommended": "Vorgeschlagen"
  },
  "publishStatus": {
    "published": "Veröffentlicht",
    "draft": "Entwurf",
    "failed": "Fehlgeschlagen"
  },
  "stats": {
    "totalArticles": "Artikel gesamt",
    "published": "Veröffentlicht",
    "generating": "In Arbeit",
    "failed": "Fehlgeschlagen",
    "avgSeo": "Ø SEO-Score",
    "totalWords": "Geschriebene Wörter"
  },
  "recent": {
    "title": "Neueste Artikel",
    "empty": "Noch keine Artikel.",
    "publishedOn": "Veröffentlicht am {date}"
  },
  "connection": {
    "checking": "Verbindung zu Ihrer Website wird geprüft …",
    "switchBack": "Zurück zu {platform}",
    "connectVia": "Stattdessen mit {platform} verbinden",
    "apiTitle": "Über die öffentliche API verbinden",
    "apiBody": "Erstellen und lesen Sie Artikel aus Ihrer eigenen App, auch ohne WordPress oder Shopify. Vollständige Doku, Codebeispiele und Anleitung zu API-Schlüsseln.",
    "docs": "Doku",
    "platform": "Veröffentlichungsplattform",
    "comingSoon": "Demnächst",
    "soon": "bald"
  },
  "opportunities": {
    "title": "Neue Chancen",
    "discovering": "Wird gesucht …",
    "discover": "Neue Chancen finden",
    "empty": "Noch keine Chancen gefunden. Klicken Sie auf „Neue Chancen finden“, um zu starten.",
    "generatedHint": "Artikel fertig – Sie finden ihn in Ihrer Artikelliste",
    "generated": "Geschrieben",
    "generate": "Artikel schreiben",
    "keywords": "Gefundene Keywords",
    "entities": "Erkannte Themen"
  },
  "opportunitiesPage": {
    "title": "Content-Chancen",
    "subtitle": "Artikelideen, passend für Ihre Website",
    "topic": "Thema",
    "entity": "Hauptentität",
    "competitor": "Wettbewerb",
    "search": "Themen oder Entitäten durchsuchen …",
    "empty": "Noch keine Content-Ideen."
  },
  "gap": {
    "uncovered": "Noch nicht abgedeckt",
    "covered": "Bereits abgedeckt",
    "reviewing": "Wird geprüft"
  },
  "columns": {
    "title": "Artikeltitel",
    "keyword": "Fokus-Keyword",
    "words": "Wörter",
    "status": "Status",
    "publishStatus": "Veröffentlichung",
    "date": "Datum",
    "url": "Live-URL"
  },
  "written": {
    "title": "Geschriebene Artikel",
    "subtitle": "Alles, was der Autopilot bisher für Ihre Website geschrieben hat",
    "empty": "Noch keine Artikel geschrieben."
  },
  "published": {
    "title": "Veröffentlichte Artikel",
    "subtitleShort": "Alle Veröffentlichungsversuche Ihres Agenten",
    "subtitle": "Alle Veröffentlichungsversuche Ihres Agenten – veröffentlicht, als Entwurf gespeichert oder fehlgeschlagen",
    "empty": "Bisher wurde nichts veröffentlicht.",
    "errorDetails": "Fehlerdetails anzeigen"
  },
  "keywords": {
    "title": "Keywords",
    "subtitle": "Keywords, die der Autopilot für Ihre Website gefunden hat",
    "keyword": "Keyword",
    "primary": "Haupt-Keyword",
    "difficulty": "Schwierigkeit",
    "analyzing": "Wir analysieren Ihre Website und suchen nach Keywords. Das kann einen Moment dauern …",
    "empty": "Noch keine Keywords gefunden."
  },
  "difficulty": {
    "Low": "Leicht",
    "Medium": "Mittel",
    "High": "Schwer",
    "Unknown": "Unbekannt"
  },
  "agent": {
    "status": {
      "idle": "Pausiert",
      "working": "Arbeitet",
      "generatingIdeas": "Entwickelt Ideen",
      "writing": "Schreibt einen Artikel",
      "waitingIdeas": "Wartet auf bewertete Ideen",
      "dailyLimit": "Tageslimit erreicht",
      "needsAnalysis": "Zuerst ist eine Website-Analyse nötig",
      "unknown": "Unbekannt"
    },
    "features": {
      "research": "Wettbewerbs- und Keyword-Recherche",
      "daily": "Täglich neue Ideen und Artikel",
      "autoPublish": "Automatische Veröffentlichung",
      "scheduling": "Intelligente Zeitplanung",
      "wordpress": "Veröffentlichen in WordPress per Klick"
    },
    "pipeline": {
      "badge": "Content-Pipeline",
      "intro": "Der Autopilot erledigt diese vier Schritte nacheinander – ganz ohne Ihr Zutun.",
      "keywordsTitle": "Keywords finden",
      "keywordsDesc": "Durchsucht Ihre Website nach den relevanten Keywords",
      "ideasTitle": "Ideen planen",
      "ideasDesc": "Macht aus jeder Chance eine Artikelidee",
      "writeTitle": "Artikel schreiben",
      "writeDesc": "Schreibt vollständige, SEO-optimierte Artikel",
      "publishTitle": "Veröffentlichen",
      "publishDesc": "Veröffentlicht die Artikel auf Ihrer WordPress-Website"
    },
    "stats": {
      "keywords": "Gefundene Keywords",
      "opportunities": "Gefundene Chancen",
      "written": "Geschriebene Artikel",
      "published": "Veröffentlichte Artikel"
    },
    "locked": {
      "badge": "Pro-Funktion",
      "title": "Mit Pro läuft Ihr SEO auf Autopilot",
      "body": "Beobachtet Ihre Website rund um die Uhr, recherchiert Wettbewerber und Keywords und schreibt und veröffentlicht SEO-optimierte Artikel für Sie.",
      "cta": "Auf Pro upgraden"
    },
    "enableTitle": "Autopilot einschalten",
    "enable": "Einschalten",
    "enabling": "Wird eingeschaltet …",
    "onTitle": "Autopilot ist aktiv",
    "settings": "Einstellungen"
  },
  "settings": {
    "title": "Autopilot-Einstellungen",
    "publishStatus": "Wenn ein Artikel fertig ist",
    "publishHint": "Artikel gehen online, sobald sie geschrieben sind.",
    "draftHint": "Artikel bleiben Entwürfe, bis Sie sie prüfen und veröffentlichen.",
    "publishOptions": {
      "draft": "Als Entwurf speichern",
      "publish": "Automatisch veröffentlichen"
    },
    "perCycle": "Artikel pro Durchlauf",
    "perCycleHint": "So viele Artikel werden pro Durchlauf geschrieben.",
    "schedule": "Häufigkeit",
    "scheduleHint": "Wie oft soll der Autopilot laufen?",
    "customInterval": "Alle wie viele Tage",
    "customIntervalHint": "Zum Beispiel bedeutet 5: einmal alle 5 Tage.",
    "startTime": "Startzeit",
    "startTimeHint": "Zu dieser Uhrzeit beginnt der Autopilot mit der Arbeit.",
    "sectionCount": "Artikellänge",
    "sectionCountHint": "Legt die Grundstruktur jedes Artikels fest.",
    "sections": {
      "short": "6–8 Abschnitte (kurz)",
      "medium": "8–10 Abschnitte (mittel)",
      "long": "10–12 Abschnitte (lang)"
    },
    "intervalOptions": {
      "d1": "Täglich",
      "d2": "Jeden zweiten Tag",
      "d3": "Alle 3 Tage",
      "d7": "Einmal pro Woche",
      "custom": "Individuell"
    },
    "interval": {
      "everyDay": "täglich",
      "everyOtherDay": "jeden zweiten Tag",
      "everyWeek": "einmal pro Woche",
      "everyNDays": "alle {days} Tage"
    },
    "preview": {
      "short": "Ihr Zeitplan: {count} Artikel {interval}",
      "publish": "Der Autopilot startet um {time} und schreibt {interval} {count} Artikel, die automatisch veröffentlicht werden.",
      "draft": "Der Autopilot startet um {time} und schreibt {interval} {count} Artikel, die als Entwurf auf Ihre Prüfung warten.",
      "publishWithImages": "Der Autopilot startet um {time} und schreibt {interval} {count} Artikel mit je {images} Bildern, die automatisch veröffentlicht werden.",
      "draftWithImages": "Der Autopilot startet um {time} und schreibt {interval} {count} Artikel mit je {images} Bildern, die als Entwurf auf Ihre Prüfung warten."
    },
    "articleModel": "Schreibmodell",
    "imagesTitle": "Bilder für Ihre Artikel",
    "imageModel": "Bildmodell",
    "imagesPerArticle": "Bilder pro Artikel",
    "perImage": "pro Bild",
    "perArticle": "pro Artikel",
    "credits": "{count} Credits",
    "recommended": "Empfohlen",
    "decrease": "Verringern",
    "increase": "Erhöhen",
    "advanced": "Erweitert",
    "advancedHint": "Eigene Anweisungen für Artikel und Bilder (optional)",
    "articlePrompt": "Anweisungen für den Artikel",
    "articlePromptHint": "Leer lassen, und Artikel werden wie gewohnt geschrieben.",
    "articlePromptPlaceholder": "z. B. Lockerer, freundlicher Ton für Einsteiger",
    "imagePrompt": "Anweisungen für das Beitragsbild",
    "imagePromptHint": "Leer lassen, und der Prompt wird aus dem Artikel erstellt.",
    "imagePromptPlaceholder": "z. B. Warme Farben, kein Text im Bild",
    "summary": "Auf einen Blick",
    "save": "Einstellungen speichern"
  },
  "wp": {
    "title": "WordPress-Verbindung",
    "subtitle": "Artikel direkt auf Ihrer WordPress-Website veröffentlichen",
    "status": {
      "connected": "Verbunden",
      "pending": "Einrichtung ausstehend",
      "disconnected": "Nicht verbunden"
    },
    "health": {
      "healthy": "Funktioniert",
      "unhealthy": "Fehler",
      "unreachable": "Nicht erreichbar"
    },
    "verified": "Gelistet auf WordPress.org",
    "shownOnce": "Wird nur einmal angezeigt",
    "copy": "{label} kopieren",
    "downloadLatest": "Neueste Plugin-Version herunterladen",
    "plugin": "WordPress-Plugin",
    "pluginBody": "Installieren Sie das Plugin auf Ihrer Website. Sobald es verbunden ist, werden Artikel für Sie geschrieben und veröffentlicht.",
    "download": "Plugin herunterladen",
    "credentials": {
      "title": "Ihre Verbindungsdaten",
      "body": "Tragen Sie diese drei Werte in die Plugin-Einstellungen Ihrer Website ein – mehr braucht es nicht für die automatische Veröffentlichung.",
      "warning": "Nach dem Schließen dieses Fensters wird das Client Secret nicht mehr angezeigt. Falls Sie es verlieren, erzeugen Sie über „Neu verbinden“ neue Daten.",
      "done": "Habe ich gespeichert"
    },
    "checking": "Verbindung wird geprüft …",
    "empty": "Noch keine WordPress-Website verbunden",
    "emptyBody": "Beim Verbinden erhalten Sie eine Client ID und ein Client Secret, die Sie im WordPress-Plugin Ihrer Website eintragen.",
    "connect": "WordPress verbinden",
    "waiting": "Warten auf die Verbindung des WordPress-Plugins",
    "waitingBody": "Tragen Sie Client ID, API Key und Client Secret in die Plugin-Einstellungen ein, um die Einrichtung abzuschließen. Daten verloren? Über „Neu verbinden“ erhalten Sie neue.",
    "check": "Verbindung prüfen",
    "newCredentials": "Neue Zugangsdaten erzeugen",
    "siteUrl": "Website-URL",
    "versions": "WordPress- / Plugin-Version",
    "pluginVersion": "Plugin {version}",
    "healthTitle": "Zustand",
    "lastCheck": "Zuletzt geprüft",
    "test": "Verbindung testen",
    "reconnect": "Neu verbinden",
    "disconnect": "Trennen",
    "disconnected": "WordPress getrennt",
    "testOk": "Alles in Ordnung – Ihre WordPress-Website ist erreichbar.",
    "testBad": "Ihre WordPress-Website hat nicht wie erwartet geantwortet.",
    "confirmReconnectTitle": "Neue Verbindungsdaten erzeugen?",
    "confirmReconnectBody": "Ihre bisherigen Daten werden ungültig. Die neuen müssen Sie anschließend im WordPress-Plugin eintragen.",
    "confirmDisconnectTitle": "WordPress trennen?",
    "confirmDisconnectBody": "Artikel werden dann nicht mehr automatisch auf dieser Website veröffentlicht. Für eine neue Verbindung ist die Einrichtung erneut nötig.",
    "errors": {
      "load": "Ihre WordPress-Verbindung konnte nicht geprüft werden.",
      "loadNetwork": "Verbindungsproblem beim Prüfen Ihrer WordPress-Verbindung.",
      "connect": "Die Verbindung zu WordPress ist fehlgeschlagen.",
      "reconnect": "Das erneute Verbinden hat nicht funktioniert.",
      "disconnect": "Die Verbindung konnte nicht getrennt werden.",
      "testNetwork": "Verbindungsproblem beim Testen der Verbindung."
    }
  },
  "mixin": {
    "title": "Mixin-Verbindung",
    "subtitle": "Artikel direkt in Ihrem Mixin-Shop veröffentlichen",
    "connected": "Mixin verbunden",
    "disconnected": "Mixin getrennt",
    "testOk": "Alles in Ordnung – Mixin ist erreichbar.",
    "testBad": "Mixin hat nicht wie erwartet geantwortet.",
    "changeIntro": "Geben Sie ein neues Token ein. Wir testen es vor dem Speichern – Ihr bisheriges Token bleibt aktiv, falls der Test fehlschlägt.",
    "connectIntro": "Geben Sie Ihr Mixin-Token ein. Wir testen die Verbindung zu Ihrem Shop vor dem Speichern und melden uns, falls etwas nicht stimmt.",
    "siteUrl": "Shop-URL",
    "currentToken": "Aktuelles Token",
    "token": "Mixin-Token",
    "tokenShort": "Token",
    "newToken": "Neues Token",
    "tokenPlaceholder": "Token hier einfügen",
    "newTokenPlaceholder": "Neues Token hier einfügen",
    "hideToken": "Token verbergen",
    "showToken": "Token anzeigen",
    "testing": "Verbindung wird getestet …",
    "testAndConnect": "Testen & verbinden",
    "changeToken": "Token ändern",
    "confirmTitle": "Mixin trennen?",
    "confirmBody": "Artikel werden dann nicht mehr automatisch in Mixin veröffentlicht. Für eine neue Verbindung müssen Sie Ihr Token erneut eingeben.",
    "errors": {
      "load": "Ihre Mixin-Verbindung konnte nicht geprüft werden.",
      "loadNetwork": "Verbindungsproblem beim Prüfen Ihrer Mixin-Verbindung.",
      "tokenShort": "Bitte fügen Sie das vollständige Token ein.",
      "connect": "Die Verbindung zu Mixin ist fehlgeschlagen. Prüfen Sie Shop-URL und Token."
    }
  },
  "kwAnalysis": {
    "title": "Keyword-Finder",
    "steps": {
      "pending": "Anfrage erhalten",
      "processing": "Daten von Google Trends werden abgerufen",
      "selecting": "Die KI wählt das beste Keyword",
      "done": "Ergebnisse werden vorbereitet"
    },
    "progress": "Keywords werden analysiert ({done}/{total} geprüft)",
    "starting": "Wird gestartet …",
    "note": "Hinweis: Google Trends begrenzt die Anfragen, daher kann jedes Keyword bis zu einer Minute dauern.",
    "processing": "In Arbeit …",
    "completed": "Fertig",
    "failed": "Keyword-Analyse fehlgeschlagen",
    "finalBadge": "Ihr Keyword",
    "suggestedTitle": "Titelvorschlag",
    "checked": "Geprüfte Keywords ({count})",
    "finalSelection": "Ausgewählt",
    "fetched": "Daten erhalten",
    "fetchError": "Daten nicht abrufbar",
    "topQueries": "Häufigste verwandte Suchanfragen",
    "risingQueries": "Steigende Suchanfragen",
    "noData": "Keine Daten",
    "breakout": "Durchbruch",
    "backToAnalysis": "Zurück zur Website-Analyse",
    "errors": {
      "status": "Der Analysestatus konnte nicht abgerufen werden.",
      "start": "Die Keyword-Analyse konnte nicht gestartet werden.",
      "site": "Die Website-Daten konnten nicht geladen werden."
    }
  },
  "shopify": {
    "title": "Shopify-Verbindung",
    "subtitle": "Blogartikel und Produkt-SEO-Korrekturen direkt in Ihrem Shopify-Shop veröffentlichen",
    "connected": "Verbunden",
    "loadFailed": "Die Shopify-Verbindung konnte nicht geladen werden.",
    "connectedBanner": "Ihr Shopify-Shop ist verbunden. Wir importieren jetzt Ihre Produkte.",
    "invalidShop": "Geben Sie Ihre Shop-Adresse ein, z. B. ihr-shop.myshopify.com.",
    "installFailed": "Die Shopify-Verbindung konnte nicht gestartet werden. Bitte erneut versuchen.",
    "testOk": "Alles in Ordnung – Ihr Shop ist erreichbar.",
    "testBad": "Shopify hat nicht wie erwartet geantwortet.",
    "disconnected": "Shopify-Shop getrennt.",
    "disconnectFailed": "Der Shop konnte nicht getrennt werden.",
    "store": "Shop",
    "storefront": "Storefront",
    "connectedHelp": "Artikel werden im Blog Ihres Shops veröffentlicht, und freigegebene Produktkorrekturen aktualisieren Ihre Shopify-Produkte. Ihre Produkte werden jede Nacht automatisch synchronisiert.",
    "confirmTitle": "Shopify trennen?",
    "confirmBody": "Die Sevof-App wird aus Ihrem Shop entfernt. Bereits veröffentlichte Artikel bleiben in Ihrem Blog.",
    "disconnecting": "Wird getrennt…",
    "disconnect": "Trennen",
    "cancel": "Abbrechen",
    "test": "Verbindung testen",
    "notConfigured": "Das Veröffentlichen auf Shopify ist auf diesem Server noch nicht verfügbar. Bitte wenden Sie sich an den Support.",
    "intro": "Geben Sie Ihre Shop-Adresse ein und genehmigen Sie die Sevof-App in Shopify. Danach kommen Sie direkt hierher zurück.",
    "shopLabel": "Shop-Adresse",
    "shopHint": "Ihre myshopify.com-Adresse – Sie finden sie im Shopify-Admin unter Einstellungen → Domains.",
    "redirecting": "Shopify wird geöffnet…",
    "connect": "Shopify verbinden",
    "permissions": "Sevof fragt nur Zugriff auf Ihren Blog, Ihre Produkte und Dateien an. Sie können die App jederzeit aus Shopify entfernen.",
    "pickTitle": "Shopify-Shop verbinden",
    "pickBody": "Wählen Sie die Sevof-Website, zu der dieser Shop gehört. Danach genehmigen Sie die App in Shopify.",
    "noSites": "Sie haben noch keine Website in Sevof. Fügen Sie zuerst die Domain Ihres Shops hinzu und kommen Sie dann zurück.",
    "addSite": "Website hinzufügen"
  }
};

export default dashboard;
