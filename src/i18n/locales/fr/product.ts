import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Effacer la recherche",
  "errors": {
    "server": "Impossible de joindre le serveur. Veuillez réessayer.",
    "serverShort": "Impossible de joindre le serveur."
  },
  "styles": {
    "price": "Prix et budget",
    "comparison": "Comparatif de produits",
    "buying_guide": "Guide d'achat"
  },
  "steps": {
    "brief": "Analyse et brief",
    "briefHint": "Étude des produits et de l'audience",
    "plan": "Planification",
    "planHint": "Répartition des produits par section",
    "sections": "Rédaction",
    "sectionsHint": "Une section à la fois",
    "written": "{done} sections rédigées sur {total}"
  },
  "idea": {
    "internalLink": "Lien interne",
    "viewProgress": "Voir l'avancement",
    "generated": "Article prêt",
    "failed": "La rédaction a échoué",
    "viewRetry": "Voir et réessayer",
    "paused": "En pause (crédits épuisés)"
  },
  "outline": {
    "title": "Plan de l'article",
    "building": "Construction du plan…",
    "approxWords": "≈ {count} mots",
    "written": "{done} sur {total} rédigées",
    "untitled": "Sans titre",
    "target": "Objectif : {count} mots",
    "keyPoints": "Points clés",
    "types": {
      "product": "Présentation produit",
      "products": "Présentations produits",
      "comparison": "Comparatif",
      "buyingGuide": "Guide d'achat",
      "guide": "Guide"
    }
  },
  "editIdea": {
    "subtitle": "Définissez le titre, les produits et le lien interne de l'article.",
    "titleHint": "Placez le mot-clé principal en début de titre. Les titres de moins de {max} caractères s'affichent en entier sur Google.",
    "products": "Produits de l'article",
    "needProduct": "Ajoutez au moins un produit.",
    "removeProduct": "Retirer {name}",
    "changeProducts": "Ajouter ou modifier des produits",
    "link": "Lien interne",
    "linkHint": "L'article renverra vers cette page de la boutique, idéalement la catégorie principale de ces produits.",
    "categoriesError": "Impossible de charger vos catégories : le lien actuel est conservé.",
    "missingCategory": "La catégorie du lien actuel n'existe plus. Choisissez-en une autre.",
    "pickTitle": "Choisir les produits de l'article",
    "pickSubtitle": "Les produits que cet article mettra en avant.",
    "pickConfirm": "Utiliser ces produits"
  },
  "category": {
    "filterPrefix": "Catégorie :",
    "linkPrefix": "Renvoie vers :",
    "all": "Toutes les catégories",
    "home": "Page d'accueil de la boutique",
    "filterNote": "Choisir une catégorie inclut aussi les produits de ses sous-catégories.",
    "linkNote": "L'article renverra vers cette page.",
    "none": "Aucune catégorie",
    "select": "Choisir une catégorie",
    "search": "Rechercher une catégorie",
    "searchPlaceholder": "Rechercher une catégorie…",
    "empty": "Aucune catégorie trouvée",
    "emptyHint": "Essayez une autre recherche.",
    "collapse": "Masquer les sous-catégories",
    "expand": "Afficher les sous-catégories",
    "removeFilter": "Retirer le filtre de catégorie",
    "backHome": "Revenir à la page d'accueil de la boutique"
  },
  "picker": {
    "loadFailed": "Impossible de charger vos produits.",
    "addFailed": "Impossible d'ajouter ce produit.",
    "alreadySelected": "Ce produit est déjà sélectionné.",
    "addedAtLimit": "Le produit a été ajouté, mais vous avez atteint la limite de sélection. Retirez-en un, puis choisissez celui-ci dans la liste.",
    "existingSelected": "Ce produit était déjà dans votre catalogue : il est maintenant sélectionné.",
    "addedSelected": "Produit ajouté et sélectionné.",
    "manualTitle": "Ajouter un produit par URL",
    "manualHint": "Vous ne trouvez pas un produit ? Collez l'URL de sa page pour l'ajouter et le sélectionner.",
    "manualBody": "Copiez l'URL de la fiche produit depuis votre boutique et collez-la ici. Nous récupérons ses informations et le sélectionnons pour vous.",
    "closeManual": "Fermer",
    "url": "URL du produit",
    "add": "Ajouter",
    "search": "Rechercher des produits",
    "searchPlaceholder": "Rechercher par nom de produit…",
    "selected": "Produits sélectionnés",
    "limit": "limite atteinte",
    "count": "{count} sur {max} sélectionnés",
    "clear": "Tout retirer",
    "empty": "Aucun produit trouvé",
    "emptyHint": "Essayez une autre recherche ou une autre catégorie.",
    "more": "Afficher plus de produits"
  },
  "modal": {
    "title": "Choisissez comment rédiger votre article produit",
    "imageModel": "Modèle pour l'image à la une",
    "featuredImage": "Image à la une",
    "articlePromptPlaceholder": "ex. Mets en avant les bénéfices du produit, ton conversationnel, et ajoute une FAQ à la fin",
    "imagePromptPlaceholder": "ex. Le produit posé sur une table en bois, dans la douce lumière du matin"
  },
  "body": {
    "saveFailed": "Impossible d'enregistrer.",
    "product": "Produit",
    "productNumber": "Produit n° {id}",
    "inStock": "En stock",
    "outOfStock": "En rupture",
    "viewProduct": "Voir et acheter",
    "recommended": "Produits recommandés",
    "seoScore": "Score SEO : {score}",
    "writingSection": "Rédaction de cette section…",
    "noContent": "Rien n'a encore été rédigé.",
    "schema": "Schéma produit"
  },
  "seo": {
    "defaultPrompt": "Propose des idées d'articles SEO et recommande des produits, à partir des meilleures ventes et des catégories principales de la boutique.",
    "manualPrompt": "Propose des idées d'articles SEO pour les produits que j'ai sélectionnés.",
    "benefits": {
      "introTitle": "Mettez vos produits en valeur",
      "introText": "Des articles qui présentent vos produits aux acheteurs.",
      "googleTitle": "Soyez trouvé sur Google",
      "googleText": "Attirez plus d'acheteurs depuis les moteurs de recherche.",
      "salesTitle": "Vendez davantage",
      "salesText": "Transformez vos lecteurs en clients, sans effort."
    },
    "heroTitle": "Des articles qui vendent les produits de {store}",
    "yourStore": "votre boutique",
    "heroBody": "Cet outil propose et rédige des articles autour des produits de votre boutique : des articles qui les présentent, attirent des acheteurs depuis Google et vous aident à vendre plus.",
    "working": "J'étudie vos produits et je prépare des idées. Cela prend généralement moins d'une minute.",
    "editIdea": "Modifier l'idée (titre, produits, lien interne)",
    "backToIdeas": "Retour aux idées",
    "selectionMethod": "Comment choisir les produits",
    "auto": "Choisir pour moi",
    "manual": "Choisir les produits",
    "autoHint": "Nous choisissons les meilleurs produits pour vous.",
    "manualHint": "Les idées porteront uniquement sur les produits que vous choisissez.",
    "requestAria": "Demander des idées d'articles",
    "placeholderManual": "Facultatif : quel angle donner aux articles ?",
    "placeholderAuto": "Quel type d'article souhaitez-vous ? (Laissez vide et je vous ferai une suggestion)",
    "generate": "Obtenir des idées",
    "keyHint": "Entrée pour envoyer · Maj+Entrée pour aller à la ligne",
    "pickTitle": "Choisissez les produits pour vos idées",
    "pickSubtitle": "Les idées d'articles porteront uniquement sur les produits choisis ici.",
    "pickConfirm": "Confirmer",
    "selectedCount": {
      "one": "{count} produit sélectionné",
      "other": "{count} produits sélectionnés"
    },
    "requestIn": "C'est parti, vos idées arrivent.",
    "errors": {
      "slow": "Les idées mettent plus de temps que d'habitude. Veuillez réessayer.",
      "open": "Impossible d'ouvrir cette discussion.",
      "create": "Impossible de démarrer une nouvelle discussion."
    }
  },
  "page": {
    "preparing": "Préparation de votre article produit…"
  }
};

export default product;
