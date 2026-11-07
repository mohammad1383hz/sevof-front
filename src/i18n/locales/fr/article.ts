import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} mot",
    "other": "{count} mots"
  },
  "actions": {
    "chat": "Discuter",
    "save": "Enregistrer"
  },
  "steps": {
    "brief": "Brief",
    "briefHint": "Étude de l'audience et des concurrents",
    "outline": "Plan",
    "outlineHint": "Construction de la structure",
    "sections": "Rédaction",
    "sectionsHint": "Section par section",
    "meta": "Métadonnées et SEO",
    "metaHint": "Titre, résumé et schéma FAQ",
    "review": "Revue SEO",
    "reviewHint": "Vérification et notation",
    "done": "Article final",
    "doneHint": "Prêt à publier"
  },
  "status": {
    "generated": "Terminé",
    "pending": "En attente"
  },
  "sectionType": {
    "introduction": "Introduction",
    "section": "Section principale",
    "faq": "Questions fréquentes",
    "conclusion": "Conclusion"
  },
  "breakdown": {
    "intent_match": "Adéquation à l'intention de recherche",
    "keyword_usage": "Usage des mots-clés",
    "entity_coverage": "Couverture du thème",
    "completeness": "Exhaustivité",
    "readability": "Lisibilité",
    "structure": "Structure"
  },
  "target": {
    "title": "Titre de l'article",
    "meta_title": "Titre SEO",
    "meta_description": "Méta-description",
    "excerpt": "Extrait",
    "general": "Article entier",
    "section": "Section",
    "faq": "FAQ",
    "article": "Article entier",
    "metaTitleLong": "Titre SEO (meta title)",
    "metaDescriptionLong": "Méta-description",
    "excerptLong": "Extrait",
    "question": "Question {index}"
  },
  "models": {
    "choose": "Choisir un modèle d'IA",
    "upgrade": "Passez à l'offre supérieure pour débloquer les modèles Pro.",
    "nano": "Rapide et économique",
    "mini": "Plus précis pour les modifications complexes",
    "luna": "La meilleure qualité d'écriture et le ton le plus naturel — notre choix pour des résultats optimaux."
  },
  "imageModels": {
    "flux": "Rapide et abordable, idéal pour les images d'articles du quotidien.",
    "banana": "Un rendu riche, parfait pour des images créatives et variées.",
    "gpt": "Suit fidèlement votre consigne et soigne les moindres détails."
  },
  "styles": {
    "minimal": "Minimaliste",
    "infographic": "Infographie",
    "conceptual": "Conceptuel",
    "realistic": "Réaliste",
    "product": "Produit"
  },
  "editor": {
    "placeholder": "Rédigez ou modifiez cette section…"
  },
  "copy": {
    "failed": "La copie n'a pas fonctionné.",
    "failedRetry": "La copie n'a pas fonctionné. Veuillez réessayer."
  },
  "errors": {
    "request": "La requête n'a pas abouti.",
    "invalidResponse": "Le serveur a renvoyé une réponse inattendue."
  },
  "error": {
    "paused": "Rédaction de l'article en pause",
    "pausedCredit": "Rédaction en pause : vos crédits sont épuisés",
    "savedCredit": "Pas d'inquiétude : tout ce qui est déjà terminé est enregistré. Dès que vous rechargez, la rédaction reprend là où elle s'est arrêtée.",
    "savedRetry": "Pas d'inquiétude : tout ce qui est déjà terminé est enregistré. Réessayez et la rédaction reprendra là où elle s'est arrêtée.",
    "buyCredits": "Acheter ou renouveler des crédits",
    "resume": "Reprendre la rédaction"
  },
  "seo": {
    "title": "Revue SEO",
    "evaluating": "Vérification de l'article complet par rapport au brief…",
    "failed": "La revue SEO n'a pas abouti (votre article est prêt, simplement sans score).",
    "outOf100": "sur 100",
    "overall": "Score SEO global",
    "suggestions": "Pistes d'amélioration"
  },
  "image": {
    "featured": "Image à la une",
    "failed": "La génération de l'image a échoué",
    "noBlock": "Pas d'inquiétude : cela n'empêche ni la rédaction ni la publication du texte.",
    "creating": "L'IA rédige une consigne et crée votre image à la une…",
    "tip": "Pour des images de meilleure qualité, essayez GPT Image ou Nano Banana",
    "generating": "Création d'une nouvelle image…",
    "generatingShort": "Génération…",
    "closeEditor": "Fermer l'éditeur",
    "retryPrompt": "Réessayer avec une nouvelle consigne",
    "editPrompt": "Modifier la consigne et régénérer",
    "promptPlaceholder": "Décrivez l'image souhaitée…",
    "modelLocked": "Le modèle « {model} » est réservé aux utilisateurs Pro. Redirection vers les offres…",
    "editLocked": "La retouche et la régénération d'images sont réservées à l'offre Pro. Redirection vers les offres…",
    "promptShort": "Cette consigne est trop courte.",
    "assistant": "Assistant image — modifiez la consigne puis envoyez",
    "proOnly": "La modification de la consigne et la régénération d'images sont disponibles avec Pro.",
    "introExisting": "Voici la consigne utilisée pour cette image. Modifiez-la à votre guise :",
    "introNew": "Il n'y a pas encore de consigne. Rédigez-en une pour générer l'image :",
    "submit": "Régénérer",
    "proOnlyShort": "Réservé à Pro"
  },
  "meta": {
    "title": "Réglages SEO",
    "empty": "vide",
    "focusKeyword": "Mot-clé principal",
    "slug": "Slug de l'URL",
    "slugHint": "La partie URL de l'adresse : lettres minuscules et tirets uniquement",
    "ogTitle": "Titre pour les réseaux sociaux (og:title)",
    "ogDescription": "Description pour les réseaux sociaux (og:description)"
  },
  "faq": {
    "title": "Questions fréquentes",
    "count": {
      "one": "{count} question",
      "other": "{count} questions"
    },
    "question": "Question",
    "answer": "Réponse",
    "saveFailed": "Impossible d'enregistrer cette question."
  },
  "sections": {
    "title": "Sections de l'article",
    "designing": "Construction du plan à partir du brief…",
    "none": "Le plan n'a pas encore été créé.",
    "editManually": "Modifier manuellement",
    "progress": "{done} sections sur {total}",
    "regenerate": "Réécrire cette section"
  },
  "banner": {
    "title": "Bannière de l'article",
    "designing": "Création de votre bannière…",
    "failed": "Impossible de régénérer la bannière.",
    "failedRetry": "Impossible de régénérer la bannière. Veuillez réessayer.",
    "generationFailed": "La création de la bannière a échoué.",
    "regenerate": "Régénérer"
  },
  "brief": {
    "title": "Brief de l'article",
    "analyzing": "L'IA étudie votre audience, l'intention de recherche et les manques dans le contenu de vos concurrents…",
    "notYet": "Pas encore créé.",
    "audience": "Audience",
    "tone": "Ton",
    "length": "Longueur visée",
    "goal": "Objectif de l'article",
    "mustCover": "Sujets incontournables",
    "gaps": "Manques des concurrents (votre avantage)",
    "linkPlan": "« {anchor} » dans la section « {section} »"
  },
  "chat": {
    "title": "Discuter avec l'IA",
    "selectSection": "Choisissez une section",
    "or": "ou",
    "orDrag": "ou glissez une section ici",
    "selectAll": "sélectionnez tout l'article",
    "useSelect": "Choisissez une section via « Sélectionner la section »",
    "drop": "Déposez pour discuter de cette section",
    "dropHere": "Déposez ici pour l'ajouter à la discussion",
    "loading": "Chargement de la discussion…",
    "empty": "Aucune discussion sur cet article pour l'instant.",
    "applied": "Appliqué",
    "clearTarget": "Retirer",
    "placeholder": "ex. Rends cette section plus formelle et plus concise…",
    "placeholderShort": "ex. Rends cette section plus formelle…",
    "placeholderEmpty": "Choisissez d'abord une section de l'article, ou déposez-la ici",
    "selectFirst": "Choisissez d'abord une section",
    "disabledUntilDone": "La discussion s'ouvre une fois l'article terminé…",
    "waitForArticle": "Rédaction de l'article… La discussion s'ouvrira dès qu'il sera prêt",
    "noCredits": "Votre abonnement n'est pas actif ou vos crédits sont épuisés.",
    "sendFailed": "Votre message n'est pas parti. Veuillez réessayer.",
    "sendAria": "Envoyer le message",
    "previous": "Discussions précédentes sur cet article ({count})",
    "loadingPrevious": "Chargement des discussions précédentes…",
    "firstDraft": "Premier jet",
    "draft": "Version {index}",
    "withAgent": "Discuter avec l'agent"
  },
  "final": {
    "article": "Article",
    "ready": "Votre article est prêt",
    "section": "Section {index}",
    "waiting": "En attente",
    "sectionFailed": "Cette section n'a pas pu être rédigée.",
    "sectionTitle": "Titre de la section",
    "saveFailed": "Impossible d'enregistrer l'article.",
    "dragToChat": "Glisser dans la discussion",
    "dragShort": "Glisser vers la discussion",
    "dragArticle": "Glisser tout l'article dans la discussion",
    "dragSection": "Glisser cette section dans la discussion",
    "chatArticle": "Discuter de l'article entier",
    "editArticle": "Modifier l'article entier",
    "copyMarkdown": "Copier en Markdown"
  },
  "modal": {
    "title": "Choisissez comment rédiger votre article",
    "subtitle": "Le modèle choisi détermine la qualité et le SEO de l'article. Les modèles les plus avancés sont inclus dans Pro.",
    "writingModel": "Modèle de rédaction",
    "writingModelDesc": "Ce modèle rédige le texte et la structure de l'article.",
    "images": "Images de l'article",
    "imagesDesc": "Choisissez le modèle d'image et le nombre d'images à créer pour cet article.",
    "qualityTip": "Pour une qualité optimale, utilisez GPT Image ou Nano Banana",
    "imageCount": "Nombre d'images",
    "upToImages": "Créer jusqu'à {count} images",
    "firstImage": "La première image devient l'image à la une.",
    "sectionCount": "Nombre de sections",
    "rangePro": "Cette fourchette est disponible avec Pro",
    "sectionRange": "Votre article comptera de {min} à {max} sections.",
    "advanced": "Avancé (facultatif)",
    "advancedHint": "Style d'image et vos propres consignes pour le texte et l'image à la une",
    "imageStyle": "Style d'image",
    "infographicHint": "Les infographies nécessitent GPT Image ou Nano Banana",
    "articlePromptPlaceholder": "ex. Ton conversationnel, pour débutants, avec une conclusion claire",
    "imagePromptPlaceholder": "ex. Un bureau en bois avec un ordinateur portable et une tasse de café dans la douce lumière du matin",
    "imagePromptHint": "Le style choisi plus haut s'applique aussi à cette image, sans texte ni logo.",
    "start": "Lancer la rédaction"
  },
  "publish": {
    "connect": "Connecter {platform}",
    "notConnected": "Votre site n'est pas encore connecté à {platform}.",
    "publishTo": "Publier sur {platform}",
    "updateOn": "Mettre à jour sur {platform}",
    "removeFrom": "Retirer de {platform}",
    "draftOn": "Brouillon {platform}",
    "viewOn": "Voir sur {platform}",
    "checking": "Vérification de la connexion…",
    "finishFirst": "L'article doit être terminé avant de pouvoir être publié.",
    "whenReady": "Vous pourrez publier dès que l'article sera prêt.",
    "publishing": "Publication…",
    "publish": "Publier",
    "updating": "Mise à jour…",
    "updated": "Mis à jour",
    "update": "Mettre à jour",
    "deleting": "Retrait…",
    "confirmDelete": "Vous êtes sûr ? Cliquez à nouveau"
  },
  "page": {
    "missingId": "L'identifiant de l'idée ou de l'article est manquant.",
    "startFailed": "Impossible de lancer la rédaction de l'article.",
    "noId": "Le serveur n'a pas renvoyé d'identifiant d'article.",
    "startError": "Un problème est survenu au lancement de la rédaction.",
    "retryFailed": "La nouvelle tentative a échoué. Veuillez réessayer.",
    "regenFailed": "Impossible de réécrire cette section.",
    "regenFailedRetry": "Impossible de réécrire cette section. Veuillez réessayer.",
    "wpPublishFailed": "La publication sur WordPress a échoué.",
    "wpPublishFailedRetry": "La publication sur WordPress a échoué. Veuillez réessayer.",
    "wpUpdateFailed": "La mise à jour sur WordPress a échoué.",
    "wpUpdateFailedRetry": "La mise à jour sur WordPress a échoué. Veuillez réessayer.",
    "wpDeleteFailed": "Le retrait de WordPress a échoué.",
    "wpDeleteFailedRetry": "Le retrait de WordPress a échoué. Veuillez réessayer.",
    "checkingPlan": "Vérification de votre offre…",
    "preparing": "Préparation de votre article…",
    "autoRefresh": "Cette page se met à jour toute seule, inutile de la recharger."
  }
};

export default article;
