// Fikalistan: en liten demoapp för övning 2.
// Den har några fel inbyggda med flit, så att du kan leta upp dem med Dev Tools.

const NYCKEL = "fikalistan";

const lista = document.querySelector("#lista");
const tom = document.querySelector("#tom");
const formular = document.querySelector("#formular");
const ny = document.querySelector("#ny");

console.log("Fikalistan startad ☕");

function lasIn() {
  try {
    return JSON.parse(localStorage.getItem(NYCKEL)) || [];
  } catch (e) {
    return [];
  }
}

function spara(saker) {
  localStorage.setItem(NYCKEL, JSON.stringify(saker));
}

function visa() {
  const saker = lasIn();
  lista.innerHTML = "";
  for (const sak of saker) {
    const li = document.createElement("li");
    li.textContent = `${sak.namn}`;
    const ta = document.createElement("button");
    ta.type = "button";
    ta.textContent = "✕";
    ta.setAttribute("aria-label", "Ta bort");
    ta.addEventListener("click", () => {
      spara(lasIn().filter((s) => s.id !== sak.id));
      visa();
    });
    li.appendChild(ta);
    lista.appendChild(li);
  }
  tom.hidden = saker.length > 0;
}

function laggTill(namn) {
  namn = namn.trim();
  if (!namn) return;
  const saker = lasIn();
  saker.push({ id: Date.now(), namn: namn });
  spara(saker);
  visa();
}

formular.addEventListener("submit", (e) => {
  e.preventDefault();
  laggTill(ny.value);
  ny.value = "";
  ny.focus();
});

// Förslagen hämtas från servern som en egen fil, syns under Network
fetch("fika.json")
  .then((svar) => svar.json())
  .then((forslag) => {
    const ruta = document.querySelector("#forslag");
    for (const namn of forslag) {
      const knapp = document.createElement("button");
      knapp.type = "button";
      knapp.textContent = "+ " + namn;
      knapp.addEventListener("click", () => laggTill(namn));
      ruta.appendChild(knapp);
    }
  });

// Räkna hur mycket fika som finns i listan
document.querySelector("#rakna").addEventListener("click", () => {
  const antal = lasIn().length;
  document.querySelector("#svar").textContent = "Vi har " + antalBullar + " saker till fikat!";
});

// Låtsas att en äldre version av appen sparade datan på ett annat sätt
document.querySelector("#gammal").addEventListener("click", () => {
  localStorage.setItem(NYCKEL, JSON.stringify("kaffe, bulle, kaka"));
  console.warn("Sparade data i gammalt format.");
  visa();
});

visa();
