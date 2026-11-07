import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "Más de {count} clientes ya confían en nosotros",
    "trustedCount": "1000",
    "googleSigningIn": "Iniciando sesión con Google…",
    "eyebrow": "// Inicia sesión o crea tu cuenta",
    "title": "Inicia sesión en tu cuenta",
    "subtitle": "Usa tu correo de Gmail, Yahoo, Outlook o iCloud para continuar.",
    "emailLabel": "Correo electrónico",
    "emailPlaceholder": "tu@gmail.com",
    "checking": "Comprobando…"
  },
  "otp": {
    "title": "Introduce el código de verificación",
    "codeLabel": "Código de verificación",
    "submit": "Iniciar sesión",
    "resend": "Reenviar código",
    "resendIn": "Reenviar en {seconds} s",
    "digitAria": "Dígito {index} de {total}"
  },
  "email": {
    "eyebrow": "// Continúa con tu correo",
    "title": "Introduce tu contraseña",
    "forAccount": "para {email}",
    "passwordLabel": "Contraseña",
    "editEmail": "Usar otro correo"
  },
  "emailVerify": {
    "eyebrow": "// Confirma tu correo",
    "sentTo": "Te enviamos un código de verificación a {email}.",
    "submit": "Verificar e iniciar sesión"
  },
  "admin": {
    "title": "Acceso de administrador",
    "phonePlaceholder": "Móvil del administrador",
    "signingIn": "Iniciando sesión…",
    "impersonateTitle": "Abrir la cuenta de un usuario",
    "goToDashboard": "Abrir el panel",
    "loginFailed": "No se pudo iniciar sesión como administrador.",
    "impersonateFailed": "No se pudo abrir la cuenta de ese usuario.",
    "impersonating": "Abriendo la cuenta del usuario…"
  },
  "captcha": {
    "label": "Comprobación rápida de seguridad",
    "clickToChange": "Haz clic para otra pregunta",
    "answer": "Respuesta",
    "newQuestion": "Otra pregunta",
    "required": "Responde la pregunta de seguridad.",
    "wrong": "Esa respuesta no es correcta. Prueba con la nueva pregunta."
  },
  "errors": {
    "googleFailed": "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
    "invalidEmail": "Ese correo no parece correcto.",
    "emailProvider": "Usa un correo de un proveedor conocido, como Gmail, Yahoo, Outlook o iCloud.",
    "emailCodeIncomplete": "Introduce los 6 dígitos del código.",
    "codeWrong": "Ese código no es correcto.",
    "resendFailed": "No pudimos reenviar el código. Inténtalo de nuevo.",
    "passwordShort": "Tu contraseña debe tener al menos 6 caracteres."
  }
};

export default auth;
