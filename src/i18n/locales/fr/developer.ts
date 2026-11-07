import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "Clés API",
    "subtitle": "Créez une clé pour connecter votre propre application à l'API publique.",
    "docsLink": "Doc API",
    "name": "Nom de la clé",
    "namePlaceholder": "ex. Serveur de contenu",
    "create": "Créer une clé",
    "creating": "Création…",
    "created": "La clé « {name} » est prête. Copiez-la maintenant : elle ne sera plus affichée en entier.",
    "copy": "Copier",
    "copied": "Copiée",
    "gotIt": "C'est noté",
    "empty": "Aucune clé pour l'instant. Créez la première avec le formulaire ci-dessus.",
    "cols": {
      "name": "Nom",
      "key": "Clé",
      "created": "Créée le",
      "lastUsed": "Dernière utilisation",
      "site": "Site"
    },
    "active": "Active",
    "revoked": "Révoquée",
    "revoke": "Révoquer",
    "revokeConfirm": "Révoquer « {name} » ? Toute application qui l'utilise perdra immédiatement l'accès.",
    "errors": {
      "load": "Impossible de charger vos clés API.",
      "loadNetwork": "Problème de connexion lors du chargement de vos clés API.",
      "create": "Impossible de créer la clé.",
      "createNetwork": "Problème de connexion lors de la création de la clé.",
      "revoke": "Impossible de révoquer la clé.",
      "revokeNetwork": "Problème de connexion lors de la révocation de la clé."
    },
    "sitesFailed": "Impossible de charger vos sites.",
    "sitesLoading": "Chargement…",
    "noSites": "Aucun site pour l'instant",
    "addSiteFirst": "Ajoutez d'abord un site pour créer une clé.",
    "legacySite": "Premier site (ancienne clé)"
  },
  "docs": {
    "title": "Documentation de l'API",
    "subtitle": "Connectez votre application à l'API publique et gérez vos articles.",
    "createKey": "Créer une clé API",
    "auth": "Authentification",
    "authBody": "Envoyez votre clé API avec chaque requête, dans l'un des deux formats ci-dessous. Les clés se créent sur la page « Clés API » ; chacune n'est affichée qu'une seule fois, conservez-la en lieu sûr.",
    "orEquivalent": "Ou, de manière équivalente :",
    "unauthorized": "Si la clé est absente, invalide ou révoquée, vous recevrez une réponse {code} :",
    "baseUrl": "URL de base",
    "endpoints": "Endpoints",
    "listArticles": "Liste les articles du site associé à cette clé, du plus récent au plus ancien.",
    "showArticle": "Renvoie un article complet, avec ses sections et sa bannière.",
    "createTask": "Crée une tâche de génération d'article et la lance en arrière-plan.",
    "taskStatus": "Renvoie le statut d'une tâche de génération. Une fois terminée, la réponse contient article_id.",
    "notes": "Bon à savoir",
    "note1": "Une clé ne donne accès qu'aux articles du site auquel elle appartient.",
    "note2": "Révoquer une clé coupe son accès immédiatement.",
    "note3": "Pour générer un article, créez une tâche puis interrogez son statut à intervalles réguliers (par exemple toutes les 30 secondes) plutôt que d'attendre une longue requête unique."
  }
};

export default developer;
