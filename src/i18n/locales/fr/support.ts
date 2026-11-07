import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Nouveau ticket",
  "backToTickets": "Retour aux tickets",
  "empty": "Aucun ticket pour l'instant. Utilisez le bouton ci-dessus pour ouvrir votre premier ticket.",
  "messages": {
    "one": "{count} message",
    "other": "{count} messages"
  },
  "attachment": "Pièce jointe {index}",
  "attachedImage": "Image jointe",
  "fullImage": "Image en taille réelle",
  "closedNotice": "Ce ticket est clôturé. Ouvrez-en un nouveau si vous avez besoin d'aide pour autre chose.",
  "status": {
    "open": "En attente de notre réponse",
    "answered": "Répondu",
    "closed": "Clôturé"
  },
  "topics": {
    "wordpress": "Extension WordPress",
    "api": "API",
    "bug": "Quelque chose ne fonctionne pas",
    "billing": "Facturation et paiement"
  },
  "priority": {
    "low": "Basse",
    "normal": "Normale",
    "high": "Haute"
  },
  "form": {
    "topic": "Comment pouvons-nous vous aider ?",
    "subjectPlaceholder": "… ou saisissez votre propre objet",
    "description": "Détails",
    "descriptionPlaceholder": "Expliquez-nous ce qui se passe…",
    "phone": "Numéro de mobile",
    "phoneHint": "Pour que notre équipe puisse vous joindre au sujet de ce ticket.",
    "image": "Capture d'écran (facultatif)",
    "addImage": "Ajouter une image",
    "imagesSelected": "{count}/{max} images sélectionnées",
    "priority": "Priorité",
    "submit": "Envoyer le ticket"
  },
  "reply": {
    "send": "Envoyer",
    "sendReply": "Envoyer la réponse",
    "messagePlaceholder": "Écrivez votre message…",
    "replyPlaceholder": "Écrivez votre réponse…",
    "staff": "Assistance",
    "you": "Vous",
    "photo": "Image",
    "close": "Clôturer le ticket",
    "closing": "Clôture…"
  },
  "errors": {
    "load": "Impossible de charger vos tickets.",
    "loadNetwork": "Problème de connexion lors du chargement de vos tickets.",
    "imagesOnly": "Seules les images peuvent être jointes.",
    "tooLarge": "« {name} » dépasse 4 Mo.",
    "tooMany": "Vous pouvez joindre jusqu'à {max} images.",
    "subjectRequired": "Veuillez indiquer un objet.",
    "subjectMin": "L'objet doit contenir au moins {min} caractères.",
    "subjectMax": "L'objet ne peut pas dépasser {max} caractères.",
    "messageRequired": "Veuillez décrire votre problème.",
    "messageMin": "La description doit contenir au moins {min} caractères.",
    "messageMax": "La description ne peut pas dépasser {max} caractères.",
    "phone": "Veuillez saisir un numéro de mobile valide (ex. 09xxxxxxxxx).",
    "submit": "Impossible d'envoyer votre ticket.",
    "submitNetwork": "Problème de connexion lors de l'envoi de votre ticket.",
    "notFound": "Ticket introuvable.",
    "ticketNetwork": "Problème de connexion lors du chargement de ce ticket.",
    "reply": "Impossible d'envoyer votre réponse.",
    "replyNetwork": "Problème de connexion lors de l'envoi de votre réponse."
  }
};

export default support;
