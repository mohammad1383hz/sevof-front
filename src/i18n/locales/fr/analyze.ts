import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "L'analyse n'a pas abouti",
  "phase": {
    "queued": "Demande reçue",
    "crawling": "Lecture des pages de votre site…",
    "analyzing": "Analyse de votre contenu…",
    "done": "Analyse terminée"
  },
  "ideaSteps": {
    "connecting": "Connexion aux sources de données (Google Trends, Autocomplete, SERP)",
    "keywords": "Notation des mots-clés liés à vos thèmes principaux",
    "generating": "Rédaction d'idées d'articles par l'IA",
    "scoring": "Évaluation de la concurrence et calcul des scores SEO"
  },
  "empty": {
    "title": "Analysez votre site",
    "body": "Saisissez un domaine ci-dessous : nous identifierons votre secteur, résumerons votre contenu et cartographierons les grands thèmes (entités) que vous traitez.",
    "tagEntities": "Analyse des entités",
    "tagIdeas": "Idées d'articles"
  },
  "input": {
    "placeholder": "exemple.fr — l'adresse de votre site",
    "submit": "Analyser"
  },
  "progress": {
    "title": "Traitement en cours",
    "inProgress": "En cours…",
    "done": "Terminé",
    "hint": "Cela prend généralement quelques minutes."
  },
  "ideasBar": {
    "limit": "Vous avez atteint votre limite de génération d'idées",
    "generating": "Rédaction…",
    "cta": "Trouver des opportunités d'articles"
  },
  "ideas": {
    "ready": {
      "one": "{count} idée prête",
      "other": "{count} idées prêtes"
    },
    "preparing": "Préparation…",
    "generatingTitle": "Recherche d'idées d'articles",
    "retrying": "Nouvelle tentative…",
    "retry": "Réessayer"
  },
  "chat": {
    "yourRequest": "Votre demande",
    "preparingIdeas": "Nous préparons des idées pour votre site…",
    "articleHeader": "Rédaction d'un article dans cette discussion",
    "assistant": "Assistant stratégie de contenu",
    "selectedEntity": "Thème ciblé : {name}",
    "preparing": "Ouverture d'une nouvelle discussion…"
  },
  "research": {
    "failed": "La recherche de contenu n'a pas abouti",
    "clustersTitle": "Création des clusters de mots-clés",
    "gapsTitle": "Analyse des concurrents et des manques de contenu",
    "clusters": "Clusters de mots-clés",
    "gapsResult": "Manques de contenu et analyse concurrentielle",
    "clusterSteps": {
      "read": "Lecture des thèmes et mots-clés de votre site",
      "build": "Regroupement des recherches en clusters",
      "estimate": "Estimation du potentiel et des tendances"
    },
    "gapSteps": {
      "context": "Compréhension de votre activité",
      "competitors": "Identification de vos vrais concurrents",
      "gaps": "Repérage des manques de contenu"
    },
    "intent": {
      "informational": "Informationnelle",
      "commercial": "Commerciale",
      "transactional": "Transactionnelle",
      "navigational": "Navigationnelle"
    },
    "coverage": {
      "missing": "Absent des résultats Google",
      "weak": "Mal positionné",
      "low": "Positionné trop bas"
    },
    "level": {
      "low": "faible",
      "medium": "moyenne",
      "high": "forte"
    },
    "priority": {
      "high": "Priorité haute",
      "medium": "Priorité moyenne",
      "low": "Priorité basse"
    },
    "difficulty": {
      "unavailable": "Non disponible pour cette source",
      "estimated": "{score}/100 · estimation IA"
    },
    "volumeEstimate": "Estimation IA",
    "volumeObserved": "Impressions réelles",
    "trend": "Tendance",
    "trendNeedsTwo": "Deux périodes nécessaires pour comparer",
    "trendUnavailable": "Pas d'estimation de tendance",
    "stats": {
      "competitors": "Vrais concurrents",
      "opportunities": "Opportunités de contenu",
      "avgScore": "Score d'opportunité moyen",
      "highThreat": "Concurrents très menaçants"
    },
    "strengths": "Les points forts de votre site",
    "weaknesses": "Les axes d'amélioration",
    "visibility": "Visibilité dans la recherche",
    "depth": "Profondeur du contenu",
    "opportunitiesTitle": "Opportunités de contenu (classées d'après les vrais résultats Google)",
    "takeAction": "Passer à l'action",
    "recommendedAction": "Approche conseillée",
    "competitorSites": "Sites concurrents ({count})",
    "rank": "Position {rank}",
    "rankUnavailable": "Position inconnue",
    "sharedKeywords": {
      "one": "{count} mot-clé en commun",
      "other": "{count} mots-clés en commun"
    },
    "moreDetails": "Plus de détails",
    "missing": "Ce qui manque à votre site",
    "recommendations": "Recommandations générales",
    "action": "Prochaine étape : {action}",
    "fullReport": "Ouvrir le rapport de recherche complet",
    "opportunityScore": "Opportunité {score}/100",
    "threat": "Menace : {level}",
    "received": "C'est noté ! Les résultats de la recherche s'afficheront ici même, dans cette discussion."
  },
  "entities": {
    "title": "Thèmes identifiés",
    "empty": "Aucun thème identifié pour l'instant."
  },
  "request": {
    "title": "Demande d'analyse de contenu",
    "body": "L'IA étudie votre contenu et vos concurrents pour dénicher de nouvelles opportunités"
  },
  "summary": {
    "title": "Résultats de l'analyse",
    "industry": "Secteur : {niche}"
  },
  "user": {
    "start": "Analyser ce site"
  },
  "idea": {
    "edit": "Modifier l'idée",
    "editShort": "Modifier",
    "save": "Enregistrer les modifications",
    "category": "Catégorie :",
    "noLinks": "Aucun lien interne trouvé",
    "linksLabel": "Liens internes :",
    "linksHint": "L'article final renverra vers ces pages",
    "viewArticle": "Voir l'article",
    "viewArticleHint": "Ouvrir l'article rédigé à partir de cette idée",
    "generatingHint": "Un article est en cours de rédaction à partir de cette idée",
    "fields": {
      "title": "Titre",
      "titlePlaceholder": "Titre de l'idée",
      "hook": "Accroche",
      "hookPlaceholder": "Une première phrase qui capte l'attention",
      "meta": "Méta-description",
      "metaPlaceholder": "Un court résumé pour les résultats de recherche",
      "tags": "Étiquettes",
      "tagsHint": "(séparées par des virgules)",
      "tagsPlaceholder": "SEO, marketing, contenu",
      "links": "Liens internes",
      "linkTitle": "Texte du lien",
      "related": "Associés",
      "removeLink": "Retirer le lien",
      "addLink": "Ajouter un lien associé",
      "outline": "Plan",
      "outlineHint": "(un intertitre par ligne)"
    },
    "score": {
      "entity": "Pertinence du thème",
      "intent": "Intention de recherche",
      "business": "Valeur business",
      "serp": "Marge de progression sur Google",
      "summary": "En résumé :"
    },
    "errors": {
      "save": "Impossible d'enregistrer vos modifications. Veuillez réessayer."
    }
  },
  "gsc": {
    "connect": "Connecter Google Search Console",
    "reconnect": "Reconnecter Google Search Console",
    "title": "Données en direct de Google Search Console",
    "body": "Intégrez vos vraies requêtes, impressions, clics, CTR et positions à votre recherche de contenu, en lecture seule.",
    "connected": "Compte connecté",
    "showProperties": "Afficher mes sites validés",
    "selectProperty": "Choisir une propriété",
    "connectProperty": "Utiliser ce site",
    "lastSynced": "Dernière synchronisation : {date}",
    "noData": "Pas encore de données.",
    "syncing": "Récupération…",
    "sync": "Synchroniser",
    "impressions": "Impressions",
    "clicks": "Clics",
    "topQueries": "Principales requêtes par impressions",
    "queryStats": "{impressions} impressions · position {position}",
    "errors": {
      "start": "Impossible de lancer la connexion à Google Search Console.",
      "properties": "Impossible de charger vos sites Search Console.",
      "select": "Impossible de connecter cette propriété.",
      "sync": "Impossible de lancer la synchronisation Search Console.",
      "disconnect": "Impossible de déconnecter Search Console."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Suggérer des sujets d'articles",
      "prompt": "Propose-moi des opportunités de contenu précises et concrètes, basées sur les tendances pertinentes pour ce site."
    },
    "gap": {
      "label": "Analyse des manques face aux concurrents",
      "prompt": "Analyse les concurrents pertinents de ce site et ses principaux manques de contenu. Pour chaque manque, explique pourquoi il compte, évalue la menace et propose un angle pour le combler."
    },
    "limit": "Passez à l'offre supérieure pour continuer.",
    "choosePath": "Choisir un type de recherche",
    "gscConnect": "Connecter Search Console",
    "connectGoogle": "Connecter mon compte Google",
    "loadingSites": "Chargement des sites…",
    "showSites": "Afficher mes sites",
    "select": "Choisir",
    "queriesReceived": "{count} requêtes reçues",
    "loadingData": "Chargement des données…",
    "readyToFetch": "Connecté — prêt à récupérer les données",
    "fetch": "Récupérer les données",
    "connectedQueries": "Search Console connecté · {count} requêtes",
    "fetchingGsc": "Récupération des données Search Console…",
    "gscConnected": "Search Console connecté",
    "placeholder": "Posez une question ou décrivez votre besoin…",
    "send": "Envoyer"
  },
  "credits": {
    "banner": "Vous avez épuisé vos crédits gratuits pour l'assistant de contenu. {still} Choisissez une offre pour continuer à discuter.",
    "bannerStill": "Vous pouvez toujours faire rédiger des articles à partir de vos idées existantes.",
    "viewPlans": "Voir les offres",
    "chatFree": "Vous avez épuisé vos crédits gratuits pour l'assistant de contenu : impossible de poser de nouvelles questions, mais vous pouvez toujours faire rédiger des articles à partir de vos idées existantes. Pour continuer à discuter, choisissez une offre sur la page d'abonnement (/subscription).",
    "chatPaid": "Vous n'avez plus assez de crédits pour l'assistant de contenu, mais vous pouvez toujours faire rédiger des articles à partir de vos idées existantes. Rechargez ou changez d'offre sur la page d'abonnement (/subscription).",
    "shortFree": "Vos crédits gratuits sont épuisés. Abonnez-vous pour continuer.",
    "shortPaid": "Vos crédits sont épuisés. Rechargez ou changez d'offre.",
    "barFree": "Vos crédits gratuits pour l'assistant de contenu sont épuisés. Abonnez-vous pour continuer.",
    "barPaid": "Crédits insuffisants pour l'analyse de contenu. Rechargez ou changez d'offre."
  },
  "entity": {
    "pick": "Choisir un thème",
    "pickPrompt": "Pour trouver des opportunités précises et créer les bons liens internes, choisissez le thème (entité) sur lequel nous concentrer.",
    "confirmed": "Parfait, votre demande est bien partie ! Les résultats porteront uniquement sur le thème choisi, et chaque article renverra vers la page correspondante de votre site."
  },
  "gapPrompt": "Crée une idée de contenu et son plan pour cette opportunité, repérée en comparant avec les vrais résultats Google :\nOpportunité : {title}\nRequête ciblée : {query}\nDétails : {details}\nAngle suggéré : {angle}",
  "gapLabel": "Passer à l'action : {title}",
  "article": {
    "request": "Rédige un article pour l'idée « {title} ».",
    "started": "L'article est en cours de rédaction dans cette discussion."
  },
  "nav": {
    "previous": "Message précédent",
    "next": "Message suivant",
    "latest": "Aller au dernier message",
    "latestShort": "Dernier"
  },
  "welcome": {
    "title": "Agent SEO de {domain}",
    "hello": "Bonjour ! Je suis l'assistant SEO de {domain}.",
    "what": "Je peux creuser les mots-clés qui comptent, dénicher de nouvelles opportunités de contenu, passer vos concurrents au crible et vous suggérer des sujets pour faire grandir votre site.",
    "ask": "Posez-moi toutes vos questions sur le SEO ou le contenu de votre site."
  },
  "errors": {
    "saveMessage": "Impossible d'enregistrer ce message.",
    "researchResults": "Impossible de charger les résultats de la recherche.",
    "history": "Impossible de charger l'historique de cette discussion.",
    "startSession": "Impossible de démarrer la discussion d'analyse pour ce site.",
    "research": "La demande de recherche de contenu n'a pas abouti.",
    "opportunities": "La demande d'opportunités de contenu n'a pas abouti.",
    "retry": "La nouvelle tentative a échoué.",
    "status": "Impossible d'obtenir le statut de l'analyse.",
    "domainRequired": "Saisissez un domaine, par exemple exemple.fr.",
    "domainInvalid": "Saisissez uniquement le domaine, sans http:// ni chemin, par exemple exemple.fr.",
    "addDomain": "Impossible d'ajouter ce domaine."
  }
};

export default analyze;
