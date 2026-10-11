# Die große Schrottwichtel-Ziehung 🎄

Eine absichtlich überdrehte statische Seite für eine Schrottwichtel-Ziehung. Sie läuft ohne Server und ist für **eine gemeinsame Ziehung an einem Gerät** gedacht: Nach jedem Los wird das Gerät weitergegeben.

## Vor dem Einsatz

Die Fragen und korrekten Antworten stehen am Anfang von [`app.js`](./app.js) im Array `PEOPLE`. Dort die Platzhalter gegen persönliche Insiderfragen austauschen.

Die Ziehung erstellt eine zufällige, eindeutige Zuordnung und garantiert dabei:

- Niemand zieht sich selbst.
- Janika/Silas, Tim/Mathilda und Toni/Johanna ziehen sich gegenseitig **nie**.
- Jede Person wird genau einmal gezogen.

Der Ziehungsstand wird lokal im Browser gespeichert. Für einen neuen Durchlauf den Website-Speicher im Browser löschen.

## GitHub Pages aktivieren

1. Dateien nach GitHub pushen.
2. Auf GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions** wählen.
3. Auf den erfolgreichen Workflow **Deploy static site to GitHub Pages** warten.

Danach ist die Seite unter `https://physilas.github.io/schrottwichteln/` erreichbar, sofern dieses Repository bei `physilas/schrottwichteln` liegt.
