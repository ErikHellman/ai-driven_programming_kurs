// OS-väljare och kopieringsknappar för installationsguiderna
(function () {
  var KEY = "kurs-os";

  function guessOs() {
    var p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent;
    p = String(p).toLowerCase();
    if (p.indexOf("win") !== -1) return "windows";
    if (p.indexOf("mac") !== -1 || p.indexOf("iphone") !== -1 || p.indexOf("ipad") !== -1) return "mac";
    if (p.indexOf("linux") !== -1 || p.indexOf("x11") !== -1) return "linux";
    return "windows";
  }

  function readSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(os) {
    try { localStorage.setItem(KEY, os); } catch (e) { /* privat läge, ignorera */ }
  }

  function setOs(os) {
    document.body.setAttribute("data-os", os);
    document.querySelectorAll(".os-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.os === os ? "true" : "false");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setOs(readSaved() || guessOs());

    document.querySelectorAll(".os-switch button").forEach(function (b) {
      b.addEventListener("click", function () {
        setOs(b.dataset.os);
        save(b.dataset.os);
      });
    });

    document.querySelectorAll(".code").forEach(function (block) {
      var pre = block.querySelector("pre");
      if (!pre) return;
      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.textContent = "Kopiera";
      btn.addEventListener("click", function () {
        // Hoppa över kommentarsrader (markerade med .c) när vi kopierar
        var clone = pre.cloneNode(true);
        clone.querySelectorAll(".c").forEach(function (c) { c.remove(); });
        var text = clone.textContent.replace(/^\s*\n/gm, "").trim();
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = "Kopierat!";
          btn.classList.add("done");
          setTimeout(function () {
            btn.textContent = "Kopiera";
            btn.classList.remove("done");
          }, 1600);
        });
      });
      block.appendChild(btn);
    });

    resumeSlides();
  });

  // Startsidan: H hoppar tillbaka till presentationen man lämnade med H
  // (sparas av slides.js). Att öppna en presentation via länkarna nollställer.
  function resumeSlides() {
    var SLIDE_KEY = "kurs-senaste-slide";
    if (!document.querySelector('a[href^="slides/"]')) return;

    var last = null;
    try { last = JSON.parse(localStorage.getItem(SLIDE_KEY)); } catch (e) { /* ignorera */ }

    document.querySelectorAll('a[href^="slides/"]').forEach(function (a) {
      a.addEventListener("click", function () {
        try { localStorage.removeItem(SLIDE_KEY); } catch (e) { /* ignorera */ }
      });
    });

    if (!last || !/^[\w-]+\.html$/.test(last.url)) return;
    var href = "slides/" + last.url + "#" + (parseInt(last.slide, 10) || 1);

    var back = document.createElement("a");
    back.className = "resume-slides";
    back.href = href;
    back.textContent = "Tryck H för att gå tillbaka till " + (last.title || "presentationen") + ", bild " + (parseInt(last.slide, 10) || 1);
    document.body.appendChild(back);

    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest && e.target.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "h" || e.key === "H") location.href = href;
    });
  }
})();
