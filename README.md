# Folkuniversitetskurs: AI-driven programmering

Kursinformation och undervisningsmaterial för kursen "AI-driven programmering – Claude Code och Codex" på Folkuniversitetet i Stockholm, hösten 2026.

Materialet publiceras med GitHub Pages på <https://ai-kurs.hellman.cloud/>

## Innehåll

| Sökväg | Vad |
| --- | --- |
| `index.html` | Startsida med länkar till allt material |
| `slides/` | Presentationer som HTML-slides |
| `guider/` | Installationsguider med kommandon för Windows och macOS/Linux |
| `ovningar/` | Övningar med färdiga startprompter |
| `ovningar/fikalistan/` | Demoapp med fel inbyggda med flit, används i övning 2 |
| `assets/` | Gemensam stil (`theme.css`), stil och skript för guider (`site.*`) och slides (`slides.*`) |

## Presentationerna

Öppna en fil i `slides/` i webbläsaren. Inga verktyg eller beroenden behövs.

| Tangent | Gör |
| --- | --- |
| `→` `Mellanslag` `PageDown` | Nästa steg eller slide |
| `←` `PageUp` | Föregående |
| `Home` / `End` | Första / sista sliden |
| `F` | Helskärm |
| `N` | Visa eller dölj talaranteckningar |

En slide är ett `<section>`-element. Element med klassen `frag` visas ett i taget, och talaranteckningar skrivs i `<aside class="notes">`. Lägg till `#5` i adressen för att hoppa direkt till slide 5. Skriv ut till PDF från webbläsaren för att få en slide per sida.

## Publicering

GitHub Pages: **Settings → Pages → Build and deployment → Deploy from a branch**, välj `main` och `/ (root)`.

Testa lokalt:

```sh
python3 -m http.server 8000
# öppna http://localhost:8000
```
