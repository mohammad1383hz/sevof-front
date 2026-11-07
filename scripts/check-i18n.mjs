// scripts/check-i18n.mjs
// Verifies that every translation key used in the source exists in the English copy,
// and that every locale defines exactly the same keys as English.
//   node scripts/check-i18n.mjs
import { build } from "esbuild";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const LANGS = ["en", "de", "fr", "es", "pt", "it", "tr", "ar"];

async function loadLocale(lang) {
  const out = await build({
    entryPoints: [join(ROOT, `src/i18n/locales/${lang}/index.ts`)],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
  });
  const code = out.outputFiles[0].text;
  const mod = await import("data:text/javascript;base64," + Buffer.from(code).toString("base64"));
  return mod.default;
}

function flatten(obj, prefix = "", acc = new Map()) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") acc.set(key, v);
    else if (v && typeof v === "object" && "one" in v && "other" in v && Object.keys(v).every((x) => ["zero", "one", "two", "few", "many", "other"].includes(x))) acc.set(key, v);
    else if (v && typeof v === "object") flatten(v, key, acc);
  }
  return acc;
}

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "i18n" || name === "node_modules") continue;
      walk(p, files);
    } else if (/\.(tsx?|jsx?)$/.test(name)) files.push(p);
  }
  return files;
}

const en = flatten(await loadLocale("en"));
let problems = 0;

// 1) keys used in source
const used = new Set();
const keyRe = /\b(?:t|tx|tMaybe|hasKey)\(\s*["'`]([a-z][\w]*(?:\.[\w]+)+)["'`]/g;
const literalKeyRe = /(?:Key|key)\s*:\s*["']([a-z][\w]*(?:\.[\w]+){2,})["']/g;
for (const file of walk(join(ROOT, "src"))) {
  const src = readFileSync(file, "utf8");
  for (const re of [keyRe, literalKeyRe]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(src))) {
      used.add(m[1]);
      if (!en.has(m[1])) {
        problems++;
        console.log(`missing in en: ${m[1]}  (${file.slice(ROOT.length)})`);
      }
    }
  }
}

// 2) parity + placeholders across locales
const placeholders = (v) =>
  [...new Set((typeof v === "string" ? v : Object.values(v).join(" ")).match(/\{\w+\}/g) ?? [])].sort().join(",");
for (const lang of LANGS.slice(1)) {
  let loc;
  try {
    loc = flatten(await loadLocale(lang));
  } catch (e) {
    console.log(`[${lang}] failed to load: ${e.message}`);
    problems++;
    continue;
  }
  for (const [k, v] of en) {
    if (!loc.has(k)) {
      problems++;
      console.log(`[${lang}] missing: ${k}`);
    } else if (placeholders(loc.get(k)) !== placeholders(v)) {
      problems++;
      console.log(`[${lang}] placeholder mismatch: ${k}  en=${placeholders(v)} ${lang}=${placeholders(loc.get(k))}`);
    }
  }
  for (const k of loc.keys()) if (!en.has(k)) console.log(`[${lang}] extra key: ${k}`);
}

console.log(`${en.size} English keys, ${used.size} literal keys referenced in source, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
