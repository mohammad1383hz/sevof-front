import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "Über {count} Kunden vertrauen uns",
    "trustedCount": "1.000",
    "googleSigningIn": "Anmeldung mit Google läuft …",
    "eyebrow": "// Anmelden oder registrieren",
    "title": "Bei Ihrem Konto anmelden",
    "subtitle": "Melden Sie sich mit Ihrer Gmail-, Yahoo-, Outlook- oder iCloud-Adresse an.",
    "emailLabel": "E-Mail-Adresse",
    "emailPlaceholder": "name@gmail.com",
    "checking": "Wird geprüft …"
  },
  "otp": {
    "title": "Bestätigungscode eingeben",
    "codeLabel": "Bestätigungscode",
    "submit": "Anmelden",
    "resend": "Code erneut senden",
    "resendIn": "Erneut senden in {seconds} s",
    "digitAria": "Ziffer {index} von {total}"
  },
  "email": {
    "eyebrow": "// Weiter mit E-Mail",
    "title": "Passwort eingeben",
    "forAccount": "für {email}",
    "passwordLabel": "Passwort",
    "editEmail": "Andere E-Mail verwenden"
  },
  "emailVerify": {
    "eyebrow": "// E-Mail-Adresse bestätigen",
    "sentTo": "Wir haben Ihnen einen Bestätigungscode an {email} geschickt.",
    "submit": "Bestätigen und anmelden"
  },
  "admin": {
    "title": "Admin-Anmeldung",
    "phonePlaceholder": "Handynummer des Admins",
    "signingIn": "Anmeldung läuft …",
    "impersonateTitle": "Nutzerkonto öffnen",
    "goToDashboard": "Zum Dashboard",
    "loginFailed": "Die Admin-Anmeldung ist fehlgeschlagen.",
    "impersonateFailed": "Das Nutzerkonto konnte nicht geöffnet werden.",
    "impersonating": "Nutzerkonto wird geöffnet …"
  },
  "captcha": {
    "label": "Kurze Sicherheitsprüfung",
    "clickToChange": "Klicken für eine neue Aufgabe",
    "answer": "Antwort",
    "newQuestion": "Neue Aufgabe",
    "required": "Bitte lösen Sie die Sicherheitsaufgabe.",
    "wrong": "Leider falsch. Versuchen Sie es mit der neuen Aufgabe."
  },
  "errors": {
    "googleFailed": "Die Anmeldung mit Google hat nicht geklappt. Bitte versuchen Sie es erneut.",
    "invalidEmail": "Diese E-Mail-Adresse scheint nicht korrekt zu sein.",
    "emailProvider": "Bitte verwenden Sie eine E-Mail-Adresse eines bekannten Anbieters wie Gmail, Yahoo, Outlook, GMX oder Web.de.",
    "emailCodeIncomplete": "Bitte geben Sie alle 6 Ziffern des Codes ein.",
    "codeWrong": "Dieser Code ist nicht korrekt.",
    "resendFailed": "Der Code konnte nicht erneut gesendet werden. Bitte versuchen Sie es noch einmal.",
    "passwordShort": "Ihr Passwort muss mindestens 6 Zeichen lang sein."
  }
};

export default auth;
