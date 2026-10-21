// Grundkrav som alla sidor ska uppfylla.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "node-html-parser";

const ROOT = resolve(import.meta.dirname, "..");

function las(fil) {
  return parse(readFileSync(join(ROOT, fil), "utf8"));
}

function filerI(mapp) {
  return readdirSync(join(ROOT, mapp))
    .filter((f) => f.endsWith(".html"))
    .map((f) => `${mapp}/${f}`);
}

const allaSidor = [
  "index.html",
  ...filerI("guider"),
  ...filerI("ovningar"),
  ...filerI("slides"),
  "ovningar/fikalistan/index.html",
];

for (const fil of allaSidor) {
  test(`${fil} har svenska, titel och viewport`, () => {
    const dok = las(fil);
    assert.equal(dok.querySelector("html")?.getAttribute("lang"), "sv");
    assert.ok(dok.querySelector("title")?.text.trim(), "titel saknas");
    assert.ok(dok.querySelector('meta[name="viewport"]'), "viewport saknas");
  });
}

for (const fil of filerI("slides")) {
  test(`${fil} har slides som fungerar`, () => {
    const dok = las(fil);
    const slides = dok.querySelectorAll(".deck > section");
    assert.ok(slides.length > 0, "inga slides hittades");
    assert.ok(
      dok.querySelector('script[src*="slides.js"]'),
      "slides.js laddas inte",
    );
  });
}

test("startsidan länkar till alla slides, guider och övningar", () => {
  const lankar = new Set(
    las("index.html")
      .querySelectorAll("a[href]")
      .map((a) => a.getAttribute("href").split("#")[0]),
  );
  const saknas = [...filerI("slides"), ...filerI("guider"), ...filerI("ovningar")]
    .filter((f) => !lankar.has(f));
  assert.deepEqual(saknas, [], "sidor som inte länkas från startsidan");
});
