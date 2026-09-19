#!/usr/bin/env node
import fs from "node:fs";
import readline from "node:readline/promises";

const file = process.argv[2] ?? "SKILL.md";
const src = fs.readFileSync(file, "utf8");
const S = "<!-- CONFIG:START -->", E = "<!-- CONFIG:END -->";
const a = src.indexOf(S), b = src.indexOf(E);
if (a < 0 || b < 0) throw new Error("CONFIG markers not found");
let block = src.slice(a, b);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const questions = [
  ["category", ["saas-dashboard", "landing-marketing", "ecommerce", "portfolio-blog-docs"], "landing-marketing"],
  ["look", ["minimal-clean", "dark-bold", "soft-glass", "playful", "editorial", "brutalist"], "minimal-clean"],
  ["radius", ["sharp", "subtle", "rounded", "soft", "pill", "auto"], "auto"],
  ["mode", ["light", "dark", "system", "auto"], "auto"],
  ["primary", null, "auto"],          // hex like #0EA5A4 or auto
  ["font_sans", null, "auto"],
  ["ui_library", null, "shadcn/ui"],
  ["framework", ["vite-react", "nextjs", "astro", "sveltekit", "vue", "html"], "vite-react"],
];

const setKey = (text, key, val) => {
  const re = new RegExp(`^(\\s*${key}:\\s*)("[^"]*"|[^#\\n]*?)(\\s*(?:#.*)?)$`, "m");
  const v = /[#\s:]/.test(val) ? `"${val}"` : val;
  return text.replace(re, (_, pre, _old, post) => `${pre}${v}${post}`);
};

for (const [key, options, def] of questions) {
  for (;;) {
    const hint = options ? ` [${options.join(" | ")}]` : "";
    const ans = (await rl.question(`${key}${hint} (${def}): `)).trim() || def;
    if (!options || options.includes(ans)) { block = setKey(block, key, ans); break; }
    console.log("  not an option, try again");
  }
}
rl.close();
block = setKey(block, "status", "configured");
fs.writeFileSync(file, src.slice(0, a) + block + src.slice(b));
console.log("Done. CONFIG updated in", file);
