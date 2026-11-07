import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "Déjà plus de {count} clients nous font confiance",
    "trustedCount": "1 000",
    "googleSigningIn": "Connexion avec Google…",
    "eyebrow": "// Connexion ou inscription",
    "title": "Connectez-vous à votre compte",
    "subtitle": "Utilisez votre adresse Gmail, Yahoo, Outlook ou iCloud pour continuer.",
    "emailLabel": "Adresse e-mail",
    "emailPlaceholder": "vous@gmail.com",
    "checking": "Vérification…"
  },
  "otp": {
    "title": "Saisissez votre code de vérification",
    "codeLabel": "Code de vérification",
    "submit": "Se connecter",
    "resend": "Renvoyer le code",
    "resendIn": "Renvoyer dans {seconds} s",
    "digitAria": "Chiffre {index} sur {total}"
  },
  "email": {
    "eyebrow": "// Continuer avec l'e-mail",
    "title": "Saisissez votre mot de passe",
    "forAccount": "pour {email}",
    "passwordLabel": "Mot de passe",
    "editEmail": "Utiliser une autre adresse"
  },
  "emailVerify": {
    "eyebrow": "// Confirmation de l'e-mail",
    "sentTo": "Nous avons envoyé un code de vérification à {email}.",
    "submit": "Vérifier et se connecter"
  },
  "admin": {
    "title": "Connexion administrateur",
    "phonePlaceholder": "Numéro de mobile de l'admin",
    "signingIn": "Connexion…",
    "impersonateTitle": "Ouvrir le compte d'un utilisateur",
    "goToDashboard": "Ouvrir le tableau de bord",
    "loginFailed": "La connexion administrateur a échoué.",
    "impersonateFailed": "Impossible d'ouvrir le compte de cet utilisateur.",
    "impersonating": "Ouverture du compte de l'utilisateur…"
  },
  "captcha": {
    "label": "Petite vérification de sécurité",
    "clickToChange": "Cliquez pour une nouvelle question",
    "answer": "Réponse",
    "newQuestion": "Nouvelle question",
    "required": "Veuillez répondre à la question de sécurité.",
    "wrong": "Ce n'est pas la bonne réponse. Essayez avec la nouvelle question."
  },
  "errors": {
    "googleFailed": "La connexion avec Google n'a pas fonctionné. Veuillez réessayer.",
    "invalidEmail": "Cette adresse e-mail ne semble pas valide.",
    "emailProvider": "Merci d'utiliser une adresse d'un fournisseur reconnu, comme Gmail, Yahoo, Outlook, Orange ou iCloud.",
    "emailCodeIncomplete": "Veuillez saisir les 6 chiffres du code.",
    "codeWrong": "Ce code est incorrect.",
    "resendFailed": "Impossible de renvoyer le code. Veuillez réessayer.",
    "passwordShort": "Votre mot de passe doit contenir au moins 6 caractères."
  }
};

export default auth;
