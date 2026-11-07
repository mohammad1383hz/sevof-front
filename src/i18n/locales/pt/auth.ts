import type en from "../en/auth";

const auth: typeof en = {
  "login": {
    "trustedBy": "Mais de {count} clientes confiam na gente",
    "trustedCount": "1.000",
    "googleSigningIn": "Entrando com o Google…",
    "eyebrow": "// Entre ou crie sua conta",
    "title": "Entre na sua conta",
    "subtitle": "Use seu e-mail do Gmail, Yahoo, Outlook ou iCloud para continuar.",
    "emailLabel": "E-mail",
    "emailPlaceholder": "voce@gmail.com",
    "checking": "Verificando…"
  },
  "otp": {
    "title": "Digite o código de verificação",
    "codeLabel": "Código de verificação",
    "submit": "Entrar",
    "resend": "Reenviar código",
    "resendIn": "Reenviar em {seconds}s",
    "digitAria": "Dígito {index} de {total}"
  },
  "email": {
    "eyebrow": "// Continuar com e-mail",
    "title": "Digite sua senha",
    "forAccount": "para {email}",
    "passwordLabel": "Senha",
    "editEmail": "Usar outro e-mail"
  },
  "emailVerify": {
    "eyebrow": "// Confirme seu e-mail",
    "sentTo": "Enviamos um código de verificação para {email}.",
    "submit": "Confirmar e entrar"
  },
  "admin": {
    "title": "Acesso de administrador",
    "phonePlaceholder": "Celular do administrador",
    "signingIn": "Entrando…",
    "impersonateTitle": "Abrir a conta de um usuário",
    "goToDashboard": "Abrir painel",
    "loginFailed": "Não foi possível entrar como administrador.",
    "impersonateFailed": "Não foi possível abrir a conta desse usuário.",
    "impersonating": "Abrindo a conta do usuário…"
  },
  "captcha": {
    "label": "Verificação rápida de segurança",
    "clickToChange": "Clique para outra pergunta",
    "answer": "Resposta",
    "newQuestion": "Outra pergunta",
    "required": "Responda à pergunta de segurança.",
    "wrong": "Resposta incorreta. Tente a nova pergunta."
  },
  "errors": {
    "googleFailed": "Não deu para entrar com o Google. Tente novamente.",
    "invalidEmail": "Esse e-mail não parece estar certo.",
    "emailProvider": "Use um e-mail de um provedor conhecido, como Gmail, Yahoo, Outlook ou iCloud.",
    "emailCodeIncomplete": "Digite os 6 dígitos do código.",
    "codeWrong": "Esse código está incorreto.",
    "resendFailed": "Não conseguimos reenviar o código. Tente novamente.",
    "passwordShort": "Sua senha precisa ter pelo menos 6 caracteres."
  }
};

export default auth;
