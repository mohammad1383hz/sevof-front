import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Voir",
  "noResults": "Aucun résultat pour cette recherche.",
  "page": {
    "title": "Tableau de bord des articles",
    "subtitle": "Ce que votre agent IA fait sur ce site",
    "noSiteTitle": "Aucun site ajouté pour l'instant",
    "noSiteBody": "Ajoutez un site pour voir ses idées, ses articles et l'activité du pilote automatique."
  },
  "errors": {
    "load": "Impossible de charger le tableau de bord.",
    "network": "Problème de connexion : le tableau de bord n'a pas pu se charger.",
    "autopilot": "Impossible de mettre à jour le pilote automatique.",
    "ideas": "Un problème est survenu pendant la génération des idées.",
    "invalidSite": "Ce lien de site n'est pas valide.",
    "ideasLoad": "Impossible de charger les idées de contenu.",
    "writtenLoad": "Impossible de charger les articles rédigés.",
    "publishedLoad": "Impossible de charger les articles publiés.",
    "keywordsLoad": "Impossible de charger les mots-clés."
  },
  "articleStatus": {
    "completed": "Terminé",
    "failed": "Échec",
    "pending": "En file d'attente",
    "generating": "Rédaction…"
  },
  "ideaStatus": {
    "approved": "Validée",
    "rejected": "Refusée",
    "used": "Utilisée",
    "recommended": "Suggérée"
  },
  "publishStatus": {
    "published": "Publié",
    "draft": "Brouillon",
    "failed": "Échec"
  },
  "stats": {
    "totalArticles": "Total des articles",
    "published": "Publiés",
    "generating": "En cours",
    "failed": "En échec",
    "avgSeo": "Score SEO moyen",
    "totalWords": "Mots rédigés"
  },
  "recent": {
    "title": "Derniers articles",
    "empty": "Aucun article pour l'instant.",
    "publishedOn": "Publié le {date}"
  },
  "connection": {
    "checking": "Vérification de la connexion à votre site…",
    "switchBack": "Revenir à {platform}",
    "connectVia": "Se connecter plutôt avec {platform}",
    "apiTitle": "Se connecter via l'API publique",
    "apiBody": "Créez et lisez des articles depuis votre propre application, même sans WordPress ni Shopify. Documentation complète, exemples de code et guide des clés API.",
    "docs": "Docs",
    "platform": "Plateforme de publication",
    "comingSoon": "Bientôt disponible",
    "soon": "bientôt"
  },
  "opportunities": {
    "title": "Nouvelles opportunités",
    "discovering": "Recherche…",
    "discover": "Trouver de nouvelles opportunités",
    "empty": "Aucune opportunité pour l'instant. Cliquez sur « Trouver de nouvelles opportunités » pour commencer.",
    "generatedHint": "Article prêt : retrouvez-le dans votre liste d'articles",
    "generated": "Rédigé",
    "generate": "Rédiger l'article",
    "keywords": "Mots-clés trouvés",
    "entities": "Thèmes identifiés"
  },
  "opportunitiesPage": {
    "title": "Opportunités de contenu",
    "subtitle": "Des idées d'articles choisies pour votre site",
    "topic": "Sujet",
    "entity": "Entité principale",
    "competitor": "Concurrence",
    "search": "Rechercher un sujet ou une entité…",
    "empty": "Aucune idée de contenu pour l'instant."
  },
  "gap": {
    "uncovered": "Pas encore traité",
    "covered": "Déjà traité",
    "reviewing": "Vérification"
  },
  "columns": {
    "title": "Titre de l'article",
    "keyword": "Mot-clé cible",
    "words": "Mots",
    "status": "Statut",
    "publishStatus": "Publication",
    "date": "Date",
    "url": "URL en ligne"
  },
  "written": {
    "title": "Articles rédigés",
    "subtitle": "Tout ce que le pilote automatique a rédigé pour votre site jusqu'ici",
    "empty": "Aucun article rédigé pour l'instant."
  },
  "published": {
    "title": "Articles publiés",
    "subtitleShort": "Toutes les tentatives de publication de votre agent",
    "subtitle": "Toutes les tentatives de publication de votre agent : publiés, enregistrés en brouillon ou en échec",
    "empty": "Rien n'a encore été publié.",
    "errorDetails": "Afficher le détail de l'erreur"
  },
  "keywords": {
    "title": "Mots-clés",
    "subtitle": "Les mots-clés trouvés par le pilote automatique pour votre site",
    "keyword": "Mot-clé",
    "primary": "Principal",
    "difficulty": "Difficulté",
    "analyzing": "Nous analysons votre site pour trouver des mots-clés. Cela peut prendre un moment…",
    "empty": "Aucun mot-clé trouvé pour l'instant."
  },
  "difficulty": {
    "Low": "Facile",
    "Medium": "Moyenne",
    "High": "Difficile",
    "Unknown": "Inconnue"
  },
  "agent": {
    "status": {
      "idle": "En veille",
      "working": "Au travail",
      "generatingIdeas": "Trouve des idées",
      "writing": "Rédige un article",
      "waitingIdeas": "Attend des idées notées",
      "dailyLimit": "Limite quotidienne atteinte",
      "needsAnalysis": "Une analyse du site est d'abord nécessaire",
      "unknown": "Inconnu"
    },
    "features": {
      "research": "Recherche de concurrents et de mots-clés",
      "daily": "Nouvelles idées et nouveaux articles chaque jour",
      "autoPublish": "Publication automatique",
      "scheduling": "Planification intelligente",
      "wordpress": "Publication WordPress en un clic"
    },
    "pipeline": {
      "badge": "Chaîne de contenu",
      "intro": "Le pilote automatique enchaîne ces quatre étapes, sans aucune intervention de votre part.",
      "keywordsTitle": "Trouver les mots-clés",
      "keywordsDesc": "Analyse votre site et repère les mots-clés qui comptent",
      "ideasTitle": "Planifier les idées",
      "ideasDesc": "Transforme chaque opportunité en idée d'article",
      "writeTitle": "Rédiger les articles",
      "writeDesc": "Rédige des articles complets et optimisés pour le SEO",
      "publishTitle": "Publier",
      "publishDesc": "Publie les articles sur votre site WordPress"
    },
    "stats": {
      "keywords": "Mots-clés trouvés",
      "opportunities": "Opportunités trouvées",
      "written": "Articles rédigés",
      "published": "Articles publiés"
    },
    "locked": {
      "badge": "Fonction Pro",
      "title": "Avec Pro, votre SEO passe en pilote automatique",
      "body": "Surveille votre site 24 h/24, étudie concurrents et mots-clés, puis rédige et publie pour vous des articles optimisés pour le SEO.",
      "cta": "Passer à Pro"
    },
    "enableTitle": "Activer le pilote automatique",
    "enable": "Activer",
    "enabling": "Activation…",
    "onTitle": "Le pilote automatique est activé",
    "settings": "Réglages"
  },
  "settings": {
    "title": "Réglages du pilote automatique",
    "publishStatus": "Quand un article est prêt",
    "publishHint": "Les articles sont mis en ligne dès qu'ils sont rédigés.",
    "draftHint": "Les articles restent en brouillon jusqu'à ce que vous les relisiez et les publiiez.",
    "publishOptions": {
      "draft": "Enregistrer en brouillon",
      "publish": "Publier automatiquement"
    },
    "perCycle": "Articles par cycle",
    "perCycleHint": "Le nombre d'articles rédigés à chaque cycle.",
    "schedule": "Fréquence",
    "scheduleHint": "À quelle fréquence le pilote automatique doit-il tourner ?",
    "customInterval": "Tous les combien de jours",
    "customIntervalHint": "Par exemple, 5 signifie une fois tous les 5 jours.",
    "startTime": "Heure de début",
    "startTimeHint": "Le pilote automatique se met au travail à cette heure-là.",
    "sectionCount": "Longueur de l'article",
    "sectionCountHint": "Définit la structure générale de chaque article.",
    "sections": {
      "short": "6 à 8 sections (court)",
      "medium": "8 à 10 sections (moyen)",
      "long": "10 à 12 sections (long)"
    },
    "intervalOptions": {
      "d1": "Tous les jours",
      "d2": "Un jour sur deux",
      "d3": "Tous les 3 jours",
      "d7": "Une fois par semaine",
      "custom": "Personnalisé"
    },
    "interval": {
      "everyDay": "chaque jour",
      "everyOtherDay": "un jour sur deux",
      "everyWeek": "une fois par semaine",
      "everyNDays": "tous les {days} jours"
    },
    "preview": {
      "short": "Votre planning : {count} articles {interval}",
      "publish": "Le pilote automatique démarre à {time} et, {interval}, rédige {count} articles qu'il publie automatiquement.",
      "draft": "Le pilote automatique démarre à {time} et, {interval}, rédige {count} articles qu'il enregistre en brouillon pour que vous les relisiez.",
      "publishWithImages": "Le pilote automatique démarre à {time} et, {interval}, rédige {count} articles de {images} images chacun, qu'il publie automatiquement.",
      "draftWithImages": "Le pilote automatique démarre à {time} et, {interval}, rédige {count} articles de {images} images chacun, qu'il enregistre en brouillon pour que vous les relisiez."
    },
    "articleModel": "Modèle de rédaction",
    "imagesTitle": "Images de vos articles",
    "imageModel": "Modèle d'image",
    "imagesPerArticle": "Images par article",
    "perImage": "par image",
    "perArticle": "par article",
    "credits": "{count} crédits",
    "recommended": "Recommandé",
    "decrease": "Diminuer",
    "increase": "Augmenter",
    "advanced": "Avancé",
    "advancedHint": "Vos propres consignes pour les articles et les images (facultatif)",
    "articlePrompt": "Consignes pour l'article",
    "articlePromptHint": "Laissez vide pour une rédaction classique.",
    "articlePromptPlaceholder": "ex. Un ton chaleureux et décontracté, pour les débutants",
    "imagePrompt": "Consignes pour l'image à la une",
    "imagePromptHint": "Laissez vide et la consigne sera créée à partir de l'article.",
    "imagePromptPlaceholder": "ex. Couleurs chaudes, aucun texte sur l'image",
    "summary": "En bref",
    "save": "Enregistrer les réglages"
  },
  "wp": {
    "title": "Connexion WordPress",
    "subtitle": "Publiez vos articles directement sur votre site WordPress",
    "status": {
      "connected": "Connecté",
      "pending": "Configuration en attente",
      "disconnected": "Non connecté"
    },
    "health": {
      "healthy": "Opérationnel",
      "unhealthy": "Erreur",
      "unreachable": "Injoignable"
    },
    "verified": "Référencée sur WordPress.org",
    "shownOnce": "Affiché une seule fois",
    "copy": "Copier {label}",
    "downloadLatest": "Télécharger la dernière version de l'extension",
    "plugin": "Extension WordPress",
    "pluginBody": "Installez l'extension sur votre site. Une fois connectée, vos articles sont rédigés et publiés pour vous.",
    "download": "Télécharger l'extension",
    "credentials": {
      "title": "Vos identifiants de connexion",
      "body": "Collez ces trois valeurs dans les réglages de l'extension sur votre site : c'est tout ce qu'il faut pour publier automatiquement.",
      "warning": "Une fois cette fenêtre fermée, le Client Secret ne sera plus affiché. Si vous le perdez, utilisez « Reconnecter » pour obtenir de nouveaux identifiants.",
      "done": "Je les ai enregistrés"
    },
    "checking": "Vérification de la connexion…",
    "empty": "Aucun site WordPress connecté pour l'instant",
    "emptyBody": "La connexion vous fournit un Client ID et un Client Secret à saisir dans l'extension WordPress de votre site.",
    "connect": "Connecter WordPress",
    "waiting": "En attente de la connexion de l'extension WordPress",
    "waitingBody": "Saisissez votre Client ID, votre API Key et votre Client Secret dans les réglages de l'extension pour terminer. Identifiants perdus ? Cliquez sur « Reconnecter » pour en obtenir de nouveaux.",
    "check": "Vérifier la connexion",
    "newCredentials": "Générer de nouveaux identifiants",
    "siteUrl": "URL du site",
    "versions": "Version de WordPress / de l'extension",
    "pluginVersion": "extension {version}",
    "healthTitle": "État",
    "lastCheck": "Dernière vérification",
    "test": "Tester la connexion",
    "reconnect": "Reconnecter",
    "disconnect": "Déconnecter",
    "disconnected": "WordPress déconnecté",
    "testOk": "Tout fonctionne : votre site WordPress est joignable.",
    "testBad": "Votre site WordPress n'a pas répondu comme prévu.",
    "confirmReconnectTitle": "Générer de nouveaux identifiants ?",
    "confirmReconnectBody": "Vos identifiants actuels ne fonctionneront plus et vous devrez saisir les nouveaux dans l'extension WordPress.",
    "confirmDisconnectTitle": "Déconnecter WordPress ?",
    "confirmDisconnectBody": "Vos articles ne seront plus publiés automatiquement sur ce site. Pour vous reconnecter, il faudra refaire la configuration.",
    "errors": {
      "load": "Impossible de vérifier votre connexion WordPress.",
      "loadNetwork": "Problème de connexion lors de la vérification de WordPress.",
      "connect": "Impossible de se connecter à WordPress.",
      "reconnect": "La reconnexion a échoué.",
      "disconnect": "Impossible de se déconnecter.",
      "testNetwork": "Problème de connexion pendant le test."
    }
  },
  "mixin": {
    "title": "Connexion Mixin",
    "subtitle": "Publiez vos articles directement sur votre boutique Mixin",
    "connected": "Mixin connecté",
    "disconnected": "Mixin déconnecté",
    "testOk": "Tout fonctionne : Mixin est joignable.",
    "testBad": "Mixin n'a pas répondu comme prévu.",
    "changeIntro": "Saisissez un nouveau jeton. Nous le testons avant de l'enregistrer : votre jeton actuel reste actif si le test échoue.",
    "connectIntro": "Saisissez votre jeton Mixin. Nous testons la connexion à votre boutique avant d'enregistrer et vous prévenons en cas de problème.",
    "siteUrl": "URL de la boutique",
    "currentToken": "Jeton actuel",
    "token": "Jeton Mixin",
    "tokenShort": "Jeton",
    "newToken": "Nouveau jeton",
    "tokenPlaceholder": "Collez votre jeton ici",
    "newTokenPlaceholder": "Collez votre nouveau jeton ici",
    "hideToken": "Masquer le jeton",
    "showToken": "Afficher le jeton",
    "testing": "Test de la connexion…",
    "testAndConnect": "Tester et connecter",
    "changeToken": "Changer de jeton",
    "confirmTitle": "Déconnecter Mixin ?",
    "confirmBody": "Vos articles ne seront plus publiés automatiquement sur Mixin. Pour vous reconnecter, il faudra saisir à nouveau votre jeton.",
    "errors": {
      "load": "Impossible de vérifier votre connexion Mixin.",
      "loadNetwork": "Problème de connexion lors de la vérification de Mixin.",
      "tokenShort": "Veuillez coller le jeton complet.",
      "connect": "Impossible de se connecter à Mixin. Vérifiez l'URL de la boutique et le jeton."
    }
  },
  "kwAnalysis": {
    "title": "Recherche de mot-clé",
    "steps": {
      "pending": "Demande reçue",
      "processing": "Récupération des données Google Trends",
      "selecting": "L'IA choisit le meilleur mot-clé",
      "done": "Préparation de vos résultats"
    },
    "progress": "Analyse des mots-clés ({done}/{total} vérifiés)",
    "starting": "Démarrage…",
    "note": "À noter : Google Trends limite les requêtes, chaque mot-clé peut donc prendre jusqu'à une minute.",
    "processing": "En cours…",
    "completed": "Terminé",
    "failed": "L'analyse des mots-clés a échoué",
    "finalBadge": "Votre mot-clé",
    "suggestedTitle": "Titre suggéré",
    "checked": "Mots-clés vérifiés ({count})",
    "finalSelection": "Retenu",
    "fetched": "Données reçues",
    "fetchError": "Données indisponibles",
    "topQueries": "Principales recherches associées",
    "risingQueries": "Recherches en hausse",
    "noData": "Aucune donnée",
    "breakout": "Forte hausse",
    "backToAnalysis": "Retour à l'analyse du site",
    "errors": {
      "status": "Impossible d'obtenir le statut de l'analyse.",
      "start": "Impossible de lancer l'analyse des mots-clés.",
      "site": "Impossible de charger les informations du site."
    }
  },
  "shopify": {
    "title": "Connexion Shopify",
    "subtitle": "Publiez articles de blog et corrections SEO produits directement sur votre boutique Shopify",
    "connected": "Connecté",
    "loadFailed": "Impossible de charger la connexion Shopify.",
    "connectedBanner": "Votre boutique Shopify est connectée. Nous importons vos produits.",
    "invalidShop": "Saisissez l'adresse de votre boutique, par ex. votre-boutique.myshopify.com.",
    "installFailed": "Impossible de lancer la connexion Shopify. Veuillez réessayer.",
    "testOk": "Tout va bien — votre boutique est joignable.",
    "testBad": "Shopify n'a pas répondu comme prévu.",
    "disconnected": "Boutique Shopify déconnectée.",
    "disconnectFailed": "Impossible de déconnecter la boutique.",
    "store": "Boutique",
    "storefront": "Vitrine",
    "connectedHelp": "Les articles sont publiés sur le blog de votre boutique, et les corrections produits validées mettent à jour vos produits Shopify. Vos produits se synchronisent automatiquement chaque nuit.",
    "confirmTitle": "Déconnecter Shopify ?",
    "confirmBody": "L'app Sevof sera retirée de votre boutique. Les articles déjà publiés restent sur votre blog.",
    "disconnecting": "Déconnexion…",
    "disconnect": "Déconnecter",
    "cancel": "Annuler",
    "test": "Tester la connexion",
    "notConfigured": "La publication Shopify n'est pas encore disponible sur ce serveur. Veuillez contacter le support.",
    "intro": "Saisissez l'adresse de votre boutique et approuvez l'app Sevof dans Shopify. Vous reviendrez ici automatiquement ensuite.",
    "shopLabel": "Adresse de la boutique",
    "shopHint": "Votre adresse myshopify.com — vous la trouverez dans l'admin Shopify sous Paramètres → Domaines.",
    "redirecting": "Ouverture de Shopify…",
    "connect": "Connecter Shopify",
    "permissions": "Sevof ne demande l'accès qu'à votre blog, vos produits et vos fichiers. Vous pouvez retirer l'app de Shopify à tout moment.",
    "pickTitle": "Connecter votre boutique Shopify",
    "pickBody": "Choisissez le site Sevof auquel appartient cette boutique. Vous approuverez ensuite l'app dans Shopify.",
    "noSites": "Vous n'avez pas encore de site dans Sevof. Ajoutez d'abord le domaine de votre boutique, puis revenez ici.",
    "addSite": "Ajouter un site"
  }
};

export default dashboard;
