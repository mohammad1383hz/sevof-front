import type en from "../en/pps";

const pps: typeof en = {
  "title": "SEO des fiches produits",
  "subtitle": "Choisissez des produits : nous repérons ce qui manque et le complétons. Vous relisez, modifiez et validez tout avant le moindre enregistrement.",
  "fields": {
    "short_description": "Description courte",
    "description": "Description complète",
    "attributes": "Caractéristiques",
    "tags": "Étiquettes produit",
    "faq": "FAQ",
    "image_alts": "Texte alternatif des images",
    "seo_title": "Titre SEO",
    "meta_description": "Méta-description",
    "focus_keyword": "Mot-clé principal",
    "category_link": "Lien vers la catégorie"
  },
  "status": {
    "pending": "En file d'attente",
    "analyzing": "Analyse en cours",
    "ready": "À traiter",
    "skipped": "Rien à signaler",
    "approved": "Envoi en cours",
    "published": "Publié",
    "failed": "Erreur"
  },
  "source": {
    "seller": "Vos données boutique",
    "ai": "Suggestion de l'IA",
    "user": "Votre modification"
  },
  "stats": {
    "total": "Produits",
    "issues": "À compléter"
  },
  "quota": {
    "exhausted": "Vous avez utilisé tous les crédits de l'offre gratuite",
    "freePlan": "Offre gratuite : {count} produits",
    "used": "{used} produits utilisés sur {total}",
    "remaining": "encore {count}",
    "upgrade": "Passez à Pro pour optimiser jusqu'à {count} produits à la fois.",
    "upgradeMore": "Passer à Pro pour en sélectionner davantage",
    "selectionsUsed": "Vous avez utilisé toutes les sélections de l'offre gratuite.",
    "selectMore": "Vous pouvez encore sélectionner {count} produits avec l'offre gratuite.",
    "perBatch": "Jusqu'à {count} produits à la fois."
  },
  "results": "Résultats",
  "processing": "Traitement",
  "selectAllIssues": "Sélectionner tout ce qui est à traiter",
  "selectProduct": "Sélectionner {name}",
  "deletedProduct": "Produit supprimé",
  "notFound": "{field} introuvable",
  "missing": "{field} manquant",
  "review": "Relire et compléter",
  "clearSelection": "Effacer la sélection",
  "start": "Lancer l'optimisation",
  "selectAll": "Tout sélectionner",
  "deselectAll": "Tout désélectionner",
  "noProducts": "Aucun produit synchronisé pour l'instant.",
  "showMore": "Afficher plus",
  "preview": "Aperçu",
  "issuesFound": "Ce qui manque sur ce produit",
  "aiNotice": "Ce contenu a été proposé par l'IA et peut comporter des erreurs. Relisez-le avant de le valider et utilisez « Modifier » pour changer ce que vous voulez.",
  "sellerInput": "Vous seul pouvez compléter ces champs",
  "verifyNumbers": "Vérifiez ces chiffres",
  "verifyNumbersBody": "Ces chiffres apparaissent dans le texte mais pas dans vos données produit actuelles :",
  "selectAllFields": "Sélectionner tous les champs",
  "suggested": "Suggestion",
  "current": "Actuel",
  "edited": "Modifié",
  "unsaved": "Non enregistré",
  "restore": "Restaurer",
  "cancelEdit": "Annuler la modification",
  "unsavedHint": "Vous avez des modifications non enregistrées : elles le seront automatiquement quand vous cliquerez sur « Corriger sur votre site ».",
  "approvedOnly": "Seuls les champs validés seront mis à jour sur votre produit.",
  "saveEdits": "Enregistrer les modifications ({count})",
  "fixOnSite": "Corriger sur votre site",
  "confirmDiscard": "Vos modifications non enregistrées seront perdues. Continuer ?",
  "noAttributes": "Aucune caractéristique pour l'instant.",
  "attrName": "Nom",
  "attrNameAria": "Nom de la caractéristique",
  "attrValue": "Valeur",
  "attrValueAria": "Valeur de la caractéristique",
  "removeAttr": "Retirer la caractéristique",
  "addAttr": "Ajouter une caractéristique",
  "tagsPlaceholder": "Séparez les étiquettes par des virgules",
  "tagsHint": "Vos étiquettes actuelles sont conservées ; celles-ci s'y ajoutent.",
  "removeQuestion": "Retirer la question",
  "addQuestion": "Ajouter une question",
  "altAria": "Texte alternatif de l'image {index}",
  "altHint": "Envoyé uniquement pour les images sans texte alternatif. Les textes alternatifs existants sur votre site restent inchangés.",
  "formatHint": "Laissez une ligne vide entre les paragraphes. Intertitres : « ## Titre » ou « ### Titre » · Listes : « - Élément »",
  "bulk": {
    "sending": "Envoi {done} sur {total}",
    "fixSelected": "Corriger la sélection sur votre site",
    "done": {
      "one": "{count} produit validé, en route vers votre site",
      "other": "{count} produits validés, en route vers votre site"
    },
    "failed": "{count} en échec",
    "more": "… et {count} de plus",
    "confirmTitle": "Appliquer toutes les corrections d'un coup ?",
    "confirmBody": "Tous les champs proposés pour ces {count} produits — descriptions, caractéristiques, étiquettes, FAQ, textes alternatifs et réglages SEO — seront envoyés directement sur votre site, sans relecture individuelle. Comme ce contenu est généré par l'IA, nous vous conseillons d'en vérifier au moins quelques-uns avec « Relire et compléter ».",
    "confirm": "Confirmer et envoyer"
  },
  "validation": {
    "attr": "Chaque caractéristique doit avoir un nom et une valeur.",
    "empty": "« {field} » ne peut pas être vide.",
    "tagsMax": "Vous pouvez ajouter jusqu'à {max} étiquettes.",
    "tagLength": "Chaque étiquette peut contenir jusqu'à {max} caractères.",
    "faq": "Chaque entrée de FAQ doit avoir une question et une réponse.",
    "faqLength": "Les questions peuvent contenir jusqu'à {q} caractères, et les réponses jusqu'à {a}.",
    "altEmpty": "Le texte alternatif ne peut pas être vide.",
    "altLength": "Le texte alternatif de chaque image peut contenir jusqu'à {max} caractères.",
    "maxLength": "« {field} » peut contenir jusqu'à {max} caractères."
  },
  "errors": {
    "results": "Impossible de charger les résultats SEO.",
    "products": "Impossible de charger vos produits.",
    "start": "Impossible de lancer l'optimisation.",
    "preview": "Impossible de charger l'aperçu.",
    "noFields": "Aucun champ à envoyer.",
    "restore": "Impossible de restaurer.",
    "noneSelected": "Aucun champ sélectionné.",
    "submit": "Impossible d'envoyer les modifications."
  }
};

export default pps;
