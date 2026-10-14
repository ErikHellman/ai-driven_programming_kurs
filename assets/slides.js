// En liten slidemotor utan beroenden.
// Tangenter: → / Mellanslag / PageDown = nästa, ← / PageUp = föregående,
// Home / End = första / sista, F = helskärm, N = talaranteckningar, Esc = stäng anteckningar.
(function () {
  var W = 1280, H = 720;
  var deck, slides, stage, bar, counter, notesBox;
  var cur = 0, frag = 0;

  function frags(i) {
    return slides[i].querySelectorAll(".frag");
  }

  function fit() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }

  function render() {
    slides.forEach(function (s, i) {
      s.classList.toggle("active", i === cur);
      s.classList.toggle("past", i < cur);
    });
    frags(cur).forEach(function (f, i) {
      f.classList.toggle("on", i < frag);
    });
    bar.style.width = ((cur + 1) / slides.length) * 100 + "%";
    counter.textContent = (cur + 1) + " / " + slides.length;
    var n = slides[cur].querySelector(".notes");
    notesBox.innerHTML = n ? n.innerHTML : "<em>Inga anteckningar för den här sliden.</em>";
    if (location.hash !== "#" + (cur + 1)) history.replaceState(null, "", "#" + (cur + 1));
  }

  function go(i, f) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    frag = f === "all" ? frags(cur).length : (f || 0);
    render();
  }

  function next() {
    if (frag < frags(cur).length) { frag++; render(); }
    else if (cur < slides.length - 1) go(cur + 1, 0);
  }

  function prev() {
    if (frag > 0) { frag--; render(); }
    else if (cur > 0) go(cur - 1, "all");
  }

  function fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
  }

  document.addEventListener("DOMContentLoaded", function () {
    deck = document.querySelector(".deck");
    stage = document.createElement("div");
    stage.className = "stage";
    slides = Array.prototype.slice.call(deck.querySelectorAll(":scope > section"));
    slides.forEach(function (s) { stage.appendChild(s); });
    deck.appendChild(stage);

    var progress = document.createElement("div");
    progress.className = "progress";
    bar = document.createElement("div");
    progress.appendChild(bar);
    document.body.appendChild(progress);

    counter = document.createElement("div");
    counter.className = "counter";
    document.body.appendChild(counter);

    notesBox = document.createElement("div");
    notesBox.className = "notes-box";
    document.body.appendChild(notesBox);

    var help = document.createElement("div");
    help.className = "help";
    help.innerHTML = "← → bläddra · F helskärm · N anteckningar";
    document.body.appendChild(help);
    setTimeout(function () { help.classList.add("hide"); }, 4000);

    var start = parseInt(location.hash.slice(1), 10);
    go(isNaN(start) ? 0 : start - 1, "all");
    fit();
    window.addEventListener("resize", fit);

    document.addEventListener("keydown", function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case " ": case "PageDown": case "Enter":
          e.preventDefault(); next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp": case "Backspace":
          e.preventDefault(); prev(); break;
        case "Home": go(0); break;
        case "End": go(slides.length - 1, "all"); break;
        case "f": case "F": fullscreen(); break;
        case "n": case "N": document.body.classList.toggle("show-notes"); break;
        case "Escape": document.body.classList.remove("show-notes"); break;
      }
    });

    // Klick till höger = nästa, till vänster = föregående
    deck.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      if (e.clientX > window.innerWidth / 3) next(); else prev();
    });

    // Svep på pekskärm
    var x0 = null;
    deck.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    deck.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      x0 = null;
    });

    // Kopiera-knapp på långa prompter (.term.prompt)
    deck.querySelectorAll(".term.prompt").forEach(function (box) {
      var pre = box.querySelector("pre");
      if (!pre) return;
      var btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.type = "button";
      btn.textContent = "Kopiera";
      btn.addEventListener("click", function () {
        var text = pre.textContent.trim();
        var done = function () {
          btn.textContent = "Kopierat!";
          btn.classList.add("done");
          setTimeout(function () {
            btn.textContent = "Kopiera";
            btn.classList.remove("done");
          }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done);
        } else {
          // Reserv när sidan öppnas som lokal fil
          var ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
          done();
        }
      });
      box.appendChild(btn);
    });

    window.addEventListener("hashchange", function () {
      var n = parseInt(location.hash.slice(1), 10);
      if (!isNaN(n) && n - 1 !== cur) go(n - 1, "all");
    });
  });
})();
