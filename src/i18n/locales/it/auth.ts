import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "Oltre {count} clienti si fidano di noi",
    "trustedCount": "1.000",
    "googleSigningIn": "Accesso con Google in corso…",
    "eyebrow": "// Accedi o registrati",
    "title": "Accedi al tuo account",
    "subtitle": "Usa il tuo indirizzo Gmail, Yahoo, Outlook o iCloud per continuare.",
    "emailLabel": "Indirizzo email",
    "emailPlaceholder": "tu@gmail.com",
    "checking": "Verifica…"
  },
  "otp": {
    "title": "Inserisci il codice di verifica",
    "codeLabel": "Codice di verifica",
    "submit": "Accedi",
    "resend": "Invia di nuovo il codice",
    "resendIn": "Nuovo invio tra {seconds} s",
    "digitAria": "Cifra {index} di {total}"
  },
  "email": {
    "eyebrow": "// Continua con l'email",
    "title": "Inserisci la password",
    "forAccount": "per {email}",
    "passwordLabel": "Password",
    "editEmail": "Usa un'altra email"
  },
  "emailVerify": {
    "eyebrow": "// Conferma la tua email",
    "sentTo": "Abbiamo inviato un codice di verifica a {email}.",
    "submit": "Verifica e accedi"
  },
  "admin": {
    "title": "Accesso amministratore",
    "phonePlaceholder": "Cellulare dell'amministratore",
    "signingIn": "Accesso in corso…",
    "impersonateTitle": "Apri l'account di un utente",
    "goToDashboard": "Apri la dashboard",
    "loginFailed": "Accesso amministratore non riuscito.",
    "impersonateFailed": "Impossibile aprire l'account di questo utente.",
    "impersonating": "Apertura dell'account utente…"
  },
  "captcha": {
    "label": "Controllo di sicurezza veloce",
    "clickToChange": "Clicca per una nuova domanda",
    "answer": "Risposta",
    "newQuestion": "Nuova domanda",
    "required": "Rispondi alla domanda di sicurezza.",
    "wrong": "Risposta sbagliata. Prova con la nuova domanda."
  },
  "errors": {
    "googleFailed": "L'accesso con Google non è riuscito. Riprova.",
    "invalidEmail": "Questo indirizzo email non sembra corretto.",
    "emailProvider": "Usa un'email di un provider noto, come Gmail, Yahoo, Outlook, Libero o iCloud.",
    "emailCodeIncomplete": "Inserisci tutte e 6 le cifre del codice.",
    "codeWrong": "Il codice non è corretto.",
    "resendFailed": "Impossibile inviare di nuovo il codice. Riprova.",
    "passwordShort": "La password deve avere almeno 6 caratteri."
  }
};

export default auth;
