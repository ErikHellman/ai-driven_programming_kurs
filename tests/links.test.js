// Kontrollerar att alla interna länkar, bilder, skript och stilmallar
// pekar på filer som finns, och att #ankare finns på sidan de pekar på.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { parse } from "node-html-parser";

const ROOT = resolve(import.meta.dirname, "..");

// Saknas med flit: övning 2 går ut på att hitta felet
const KANDA_FEL = new Set(["ovningar/fikalistan/bilder/kanelbulle.png"]);

function htmlFiler(dir = ROOT) {
  return readdirSync(dir).flatMap((namn) => {
    if (namn.startsWith(".") || namn === "node_modules") return [];
    const sokvag = join(dir, namn);
    if (statSync(sokvag).isDirectory()) return htmlFiler(sokvag);
    return namn.endsWith(".html") ? [sokvag] : [];
  });
}

const sidor = new Map(
  htmlFiler().map((fil) => [fil, parse(readFileSync(fil, "utf8"))]),
);

function malFil(fran, url) {
  let mal = resolve(dirname(fran), decodeURIComponent(url));
  if (url.endsWith("/") || (existsSync(mal) && statSync(mal).isDirectory())) {
    mal = join(mal, "index.html");
  }
  return mal;
}

function harAnkare(dokument, id) {
  return dokument.querySelector(`[id="${id}"], a[name="${id}"]`) !== null;
}

for (const [fil, dokument] of sidor) {
  const namn = relative(ROOT, fil);

  test(`interna länkar i ${namn}`, () => {
    const fel = [];
    for (const el of dokument.querySelectorAll("[href], [src]")) {
      const url = el.getAttribute("href") ?? el.getAttribute("src");
      if (!url || /^([a-z][a-z0-9+.-]*:|\/\/)/i.test(url)) continue;

      const [sokvag, ankare] = url.split("?")[0].split("#");
      const mal = sokvag ? malFil(fil, sokvag) : fil;
      if (KANDA_FEL.has(relative(ROOT, mal))) continue;

      if (!existsSync(mal)) {
        fel.push(`${url} (filen finns inte)`);
      } else if (ankare && mal.endsWith(".html")) {
        const malDokument = sidor.get(mal);
        if (!harAnkare(malDokument, ankare)) fel.push(`${url} (ankaret finns inte)`);
      }
    }
    assert.deepEqual(fel, [], `Trasiga länkar i ${namn}`);
  });
}
