// Sign-up is limited to well-known email providers (Gmail, Yahoo, Outlook …).
// Disposable and unknown domains are rejected on the login page.

const EXACT = new Set([
  // Google
  "gmail.com", "googlemail.com",
  // Microsoft
  "outlook.com", "hotmail.com", "live.com", "msn.com", "windowslive.com",
  // Apple
  "icloud.com", "me.com", "mac.com",
  // Others with global reach
  "aol.com", "proton.me", "protonmail.com", "pm.me", "zoho.com", "zohomail.com",
  "mail.com", "gmx.com", "gmx.net", "yandex.com", "yandex.ru", "ya.ru", "tutanota.com", "tuta.io",
  // Germany / Austria / Switzerland
  "web.de", "gmx.de", "gmx.at", "gmx.ch", "t-online.de", "freenet.de", "posteo.de", "mailbox.org", "bluewin.ch",
  // France
  "orange.fr", "wanadoo.fr", "free.fr", "sfr.fr", "laposte.net",
  // Italy
  "libero.it", "virgilio.it", "tiscali.it", "alice.it", "tim.it",
  // Spain / Portugal / Brazil
  "terra.com", "terra.com.br", "uol.com.br", "bol.com.br", "sapo.pt",
  // Russia & CIS
  "mail.ru", "bk.ru", "inbox.ru", "list.ru", "rambler.ru",
  // Asia
  "qq.com", "163.com", "126.com", "naver.com", "daum.net", "rediffmail.com",
]);

// Providers that use many country domains: yahoo.com, yahoo.de, yahoo.co.uk, hotmail.fr, outlook.de, ymail.com …
const FAMILIES = ["yahoo", "ymail", "rocketmail", "hotmail", "outlook", "live", "gmx"];

export function isAllowedEmailProvider(email: string): boolean {
  const domain = email.split("@").pop()?.toLowerCase().trim() ?? "";
  if (EXACT.has(domain)) return true;
  const [name, ...rest] = domain.split(".");
  return FAMILIES.includes(name) && rest.length > 0 && rest.every((p) => /^[a-z]{2,3}$/.test(p));
}
