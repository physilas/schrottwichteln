# Die große Schrottwichtel-Ziehung 🎄

Eine absichtlich überdrehte statische Seite für eine Schrottwichtel-Ziehung. Sie läuft ohne Server und ist für **individuelle, private Ziehungen** gedacht: Jede Person öffnet den Link selbst und wählt nur den eigenen Namen.

## Vor dem Einsatz

Die Fragen, Antworten und feste Zuordnung stehen am Anfang von [`app.js`](./app.js) im Array `PEOPLE`.

Die fest hinterlegte Zuordnung garantiert dabei:

- Niemand zieht sich selbst.
- Janika/Silas, Tim/Mathilda und Toni/Johanna ziehen sich gegenseitig **nie**.
- Jede Person wird genau einmal gezogen.

Da alle Teilnehmenden den Link getrennt öffnen, ist die Zuordnung bewusst fest hinterlegt. So bleiben alle Lose eindeutig, unabhängig davon, wann jemand die Seite öffnet.

> Die Namensauswahl und Sicherheitsfragen sind bewusst spielerisch, nicht technisch geheim: Bei einer statischen, öffentlichen GitHub Page könnte jemand mit genügend Neugier auch andere Namen auswählen oder den Quelltext ansehen.

## GitHub Pages aktivieren

1. Dateien nach GitHub pushen.
2. Auf GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen.
3. Auf den erfolgreichen Workflow **Deploy static site to GitHub Pages** warten.

Danach ist die Seite unter `https://physilas.github.io/schrottwichteln/` erreichbar, sofern dieses Repository bei `physilas/schrottwichteln` liegt.
