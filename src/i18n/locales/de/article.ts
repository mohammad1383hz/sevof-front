import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} Wort",
    "other": "{count} Wörter"
  },
  "actions": {
    "chat": "Chat",
    "save": "Speichern"
  },
  "steps": {
    "brief": "Briefing",
    "briefHint": "Zielgruppe & Wettbewerb recherchieren",
    "outline": "Gliederung",
    "outlineHint": "Struktur planen",
    "sections": "Schreiben",
    "sectionsHint": "Abschnitt für Abschnitt",
    "meta": "Metadaten & SEO",
    "metaHint": "Titel, Zusammenfassung & FAQ-Schema",
    "review": "SEO-Prüfung",
    "reviewHint": "Prüfen und bewerten",
    "done": "Fertiger Artikel",
    "doneHint": "Bereit zur Veröffentlichung"
  },
  "status": {
    "generated": "Fertig",
    "pending": "Wartet"
  },
  "sectionType": {
    "introduction": "Einleitung",
    "section": "Hauptteil",
    "faq": "Häufige Fragen",
    "conclusion": "Fazit"
  },
  "breakdown": {
    "intent_match": "Passt zur Suchintention",
    "keyword_usage": "Keyword-Einsatz",
    "entity_coverage": "Themenabdeckung",
    "completeness": "Vollständigkeit",
    "readability": "Lesbarkeit",
    "structure": "Struktur"
  },
  "target": {
    "title": "Artikeltitel",
    "meta_title": "SEO-Titel",
    "meta_description": "Meta-Beschreibung",
    "excerpt": "Auszug",
    "general": "Gesamter Artikel",
    "section": "Abschnitt",
    "faq": "FAQ",
    "article": "Gesamter Artikel",
    "metaTitleLong": "SEO-Titel (Meta-Title)",
    "metaDescriptionLong": "Meta-Beschreibung",
    "excerptLong": "Auszug",
    "question": "Frage {index}"
  },
  "models": {
    "choose": "KI-Modell wählen",
    "upgrade": "Mit einem höheren Tarif schalten Sie die Pro-Modelle frei.",
    "nano": "Schnell und preiswert",
    "mini": "Präziser bei komplexen Änderungen",
    "luna": "Beste Schreibqualität und natürlichster Ton – unsere Empfehlung für Top-Ergebnisse."
  },
  "imageModels": {
    "flux": "Schnell und günstig – ideal für alltägliche Artikelbilder.",
    "banana": "Starke Optik, ideal für kreative, abwechslungsreiche Bilder.",
    "gpt": "Hält sich genau an Ihren Prompt und trifft feine Details."
  },
  "styles": {
    "minimal": "Minimalistisch",
    "infographic": "Infografik",
    "conceptual": "Konzeptuell",
    "realistic": "Realistisch",
    "product": "Produkt"
  },
  "editor": {
    "placeholder": "Diesen Abschnitt schreiben oder bearbeiten …"
  },
  "copy": {
    "failed": "Kopieren hat nicht funktioniert.",
    "failedRetry": "Kopieren hat nicht funktioniert. Bitte versuchen Sie es erneut."
  },
  "errors": {
    "request": "Die Anfrage ist fehlgeschlagen.",
    "invalidResponse": "Der Server hat eine unerwartete Antwort geschickt."
  },
  "error": {
    "paused": "Artikelerstellung pausiert",
    "pausedCredit": "Artikelerstellung pausiert – Ihre Credits sind aufgebraucht",
    "savedCredit": "Keine Sorge – alles bisher Fertige ist gespeichert. Sobald Sie aufladen, geht es genau dort weiter.",
    "savedRetry": "Keine Sorge – alles bisher Fertige ist gespeichert. Beim nächsten Versuch geht es genau dort weiter.",
    "buyCredits": "Credits kaufen oder verlängern",
    "resume": "Weiterschreiben"
  },
  "seo": {
    "title": "SEO-Prüfung",
    "evaluating": "Der gesamte Artikel wird mit dem Briefing abgeglichen …",
    "failed": "Die SEO-Prüfung wurde nicht abgeschlossen (Ihr Artikel ist fertig, nur ohne Bewertung).",
    "outOf100": "von 100",
    "overall": "SEO-Gesamtscore",
    "suggestions": "Verbesserungsvorschläge"
  },
  "image": {
    "featured": "Beitragsbild",
    "failed": "Bilderstellung fehlgeschlagen",
    "noBlock": "Kein Problem – der Artikeltext wird trotzdem geschrieben und veröffentlicht.",
    "creating": "Die KI schreibt einen Prompt und erstellt Ihr Beitragsbild …",
    "tip": "Für hochwertigere Bilder nutzen Sie GPT Image oder Nano Banana",
    "generating": "Neues Bild wird erstellt …",
    "generatingShort": "Wird erstellt …",
    "closeEditor": "Editor schließen",
    "retryPrompt": "Mit neuem Prompt erneut versuchen",
    "editPrompt": "Prompt bearbeiten & neu erstellen",
    "promptPlaceholder": "Beschreiben Sie das gewünschte Bild …",
    "modelLocked": "Das Modell „{model}“ ist Pro-Nutzern vorbehalten. Sie werden zu den Tarifen weitergeleitet …",
    "editLocked": "Bilder bearbeiten und neu erstellen ist eine Pro-Funktion. Sie werden zu den Tarifen weitergeleitet …",
    "promptShort": "Dieser Prompt ist zu kurz.",
    "assistant": "Bildassistent – Prompt anpassen und absenden",
    "proOnly": "Prompts bearbeiten und Bilder neu erstellen ist mit Pro möglich.",
    "introExisting": "Mit diesem Prompt wurde das Bild erstellt. Passen Sie ihn ganz nach Wunsch an:",
    "introNew": "Noch gibt es keinen Prompt. Schreiben Sie einen, um das Bild zu erstellen:",
    "submit": "Neu erstellen",
    "proOnlyShort": "Nur mit Pro"
  },
  "meta": {
    "title": "SEO-Einstellungen",
    "empty": "leer",
    "focusKeyword": "Fokus-Keyword",
    "slug": "URL-Slug",
    "slugHint": "Der URL-Teil der Adresse – nur Kleinbuchstaben und Bindestriche",
    "ogTitle": "Social-Media-Titel (og:title)",
    "ogDescription": "Social-Media-Beschreibung (og:description)"
  },
  "faq": {
    "title": "Häufige Fragen",
    "count": {
      "one": "{count} Frage",
      "other": "{count} Fragen"
    },
    "question": "Frage",
    "answer": "Antwort",
    "saveFailed": "Diese Frage konnte nicht gespeichert werden."
  },
  "sections": {
    "title": "Artikelabschnitte",
    "designing": "Die Gliederung wird anhand des Briefings erstellt …",
    "none": "Die Gliederung wurde noch nicht erstellt.",
    "editManually": "Manuell bearbeiten",
    "progress": "{done} von {total} Abschnitten",
    "regenerate": "Abschnitt neu schreiben"
  },
  "banner": {
    "title": "Artikelbanner",
    "designing": "Ihr Banner wird gestaltet …",
    "failed": "Das Banner konnte nicht neu erstellt werden.",
    "failedRetry": "Das Banner konnte nicht neu erstellt werden. Bitte versuchen Sie es erneut.",
    "generationFailed": "Bannererstellung fehlgeschlagen.",
    "regenerate": "Neu erstellen"
  },
  "brief": {
    "title": "Artikel-Briefing",
    "analyzing": "Die KI untersucht Zielgruppe, Suchintention und die Lücken in den Inhalten Ihrer Wettbewerber …",
    "notYet": "Noch nicht erstellt.",
    "audience": "Zielgruppe",
    "tone": "Tonalität",
    "length": "Ziellänge",
    "goal": "Ziel des Artikels",
    "mustCover": "Pflichtthemen",
    "gaps": "Lücken der Wettbewerber (Ihr Vorsprung)",
    "linkPlan": "„{anchor}“ im Abschnitt „{section}“"
  },
  "chat": {
    "title": "Mit der KI chatten",
    "selectSection": "Abschnitt wählen",
    "or": "oder",
    "orDrag": "oder einen Abschnitt hierher ziehen",
    "selectAll": "den ganzen Artikel wählen",
    "useSelect": "Abschnitt über „Abschnitt wählen“ auswählen",
    "drop": "Loslassen, um über diesen Abschnitt zu chatten",
    "dropHere": "Hier ablegen, um es zum Chat hinzuzufügen",
    "loading": "Chat wird geladen …",
    "empty": "Zu diesem Artikel gibt es noch keine Chats.",
    "applied": "Übernommen",
    "clearTarget": "Entfernen",
    "placeholder": "z. B. Formuliere diesen Abschnitt förmlicher und knapper …",
    "placeholderShort": "z. B. Formuliere diesen Abschnitt förmlicher …",
    "placeholderEmpty": "Wählen Sie zuerst einen Abschnitt aus oder ziehen Sie ihn hierher",
    "selectFirst": "Wählen Sie zuerst einen Abschnitt",
    "disabledUntilDone": "Der Chat öffnet, sobald der Artikel fertig ist …",
    "waitForArticle": "Der Artikel wird geschrieben … Der Chat öffnet, sobald er fertig ist",
    "noCredits": "Ihr Abo ist nicht aktiv oder Ihre Credits sind aufgebraucht.",
    "sendFailed": "Ihre Nachricht wurde nicht gesendet. Bitte versuchen Sie es erneut.",
    "sendAria": "Nachricht senden",
    "previous": "Frühere Chats zu diesem Artikel ({count})",
    "loadingPrevious": "Frühere Chats werden geladen …",
    "firstDraft": "Erster Entwurf",
    "draft": "Entwurf {index}",
    "withAgent": "Mit dem Agenten chatten"
  },
  "final": {
    "article": "Artikel",
    "ready": "Ihr Artikel ist fertig",
    "section": "Abschnitt {index}",
    "waiting": "Wartet",
    "sectionFailed": "Dieser Abschnitt konnte nicht geschrieben werden.",
    "sectionTitle": "Abschnittstitel",
    "saveFailed": "Der Artikel konnte nicht gespeichert werden.",
    "dragToChat": "In den Chat ziehen",
    "dragShort": "In den Chat ziehen",
    "dragArticle": "Den ganzen Artikel in den Chat ziehen",
    "dragSection": "Diesen Abschnitt in den Chat ziehen",
    "chatArticle": "Über den ganzen Artikel chatten",
    "editArticle": "Ganzen Artikel bearbeiten",
    "copyMarkdown": "Als Markdown kopieren"
  },
  "modal": {
    "title": "So soll Ihr Artikel entstehen",
    "subtitle": "Das gewählte Modell bestimmt Qualität und SEO des Artikels. Die stärksten Modelle gibt es mit Pro.",
    "writingModel": "Schreibmodell",
    "writingModelDesc": "Dieses Modell schreibt Text und Struktur des Artikels.",
    "images": "Artikelbilder",
    "imagesDesc": "Wählen Sie das Bildmodell und wie viele Bilder für diesen Artikel entstehen sollen.",
    "qualityTip": "Für beste Qualität nutzen Sie GPT Image oder Nano Banana",
    "imageCount": "Anzahl der Bilder",
    "upToImages": "Bis zu {count} Bilder erstellen",
    "firstImage": "Das erste Bild wird zum Beitragsbild.",
    "sectionCount": "Anzahl der Abschnitte",
    "rangePro": "Dieser Umfang ist mit Pro verfügbar",
    "sectionRange": "Ihr Artikel erhält {min} bis {max} Abschnitte.",
    "advanced": "Erweitert (optional)",
    "advancedHint": "Bildstil und eigene Anweisungen für Text und Beitragsbild",
    "imageStyle": "Bildstil",
    "infographicHint": "Für Infografiken wählen Sie GPT Image oder Nano Banana",
    "articlePromptPlaceholder": "z. B. Gesprächiger Ton, für Einsteiger, mit klarem Fazit",
    "imagePromptPlaceholder": "z. B. Ein Holzschreibtisch mit Laptop und einer Tasse Kaffee im sanften Morgenlicht",
    "imagePromptHint": "Der oben gewählte Stil gilt auch für dieses Bild – ohne Text und Logos.",
    "start": "Schreiben starten"
  },
  "publish": {
    "connect": "{platform} verbinden",
    "notConnected": "Ihre Website ist noch nicht mit {platform} verbunden.",
    "publishTo": "In {platform} veröffentlichen",
    "updateOn": "In {platform} aktualisieren",
    "removeFrom": "Aus {platform} entfernen",
    "draftOn": "{platform}-Entwurf",
    "viewOn": "In {platform} ansehen",
    "checking": "Verbindung wird geprüft …",
    "finishFirst": "Der Artikel muss erst fertig sein, bevor Sie ihn veröffentlichen können.",
    "whenReady": "Sobald der Artikel fertig ist, können Sie ihn veröffentlichen.",
    "publishing": "Wird veröffentlicht …",
    "publish": "Veröffentlichen",
    "updating": "Wird aktualisiert …",
    "updated": "Aktualisiert",
    "update": "Aktualisieren",
    "deleting": "Wird entfernt …",
    "confirmDelete": "Sicher? Noch einmal klicken"
  },
  "page": {
    "missingId": "Die ID der Idee oder des Artikels fehlt.",
    "startFailed": "Die Artikelerstellung konnte nicht gestartet werden.",
    "noId": "Der Server hat keine Artikel-ID zurückgegeben.",
    "startError": "Beim Start der Artikelerstellung ist etwas schiefgelaufen.",
    "retryFailed": "Der erneute Versuch hat nicht funktioniert. Bitte versuchen Sie es noch einmal.",
    "regenFailed": "Der Abschnitt konnte nicht neu geschrieben werden.",
    "regenFailedRetry": "Der Abschnitt konnte nicht neu geschrieben werden. Bitte versuchen Sie es erneut.",
    "wpPublishFailed": "Die Veröffentlichung in WordPress ist fehlgeschlagen.",
    "wpPublishFailedRetry": "Die Veröffentlichung in WordPress ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "wpUpdateFailed": "Die Aktualisierung in WordPress ist fehlgeschlagen.",
    "wpUpdateFailedRetry": "Die Aktualisierung in WordPress ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "wpDeleteFailed": "Das Entfernen aus WordPress ist fehlgeschlagen.",
    "wpDeleteFailedRetry": "Das Entfernen aus WordPress ist fehlgeschlagen. Bitte versuchen Sie es erneut.",
    "checkingPlan": "Ihr Tarif wird geprüft …",
    "preparing": "Ihr Artikel wird vorbereitet …",
    "autoRefresh": "Diese Seite aktualisiert sich von selbst – kein Neuladen nötig."
  }
};

export default article;
