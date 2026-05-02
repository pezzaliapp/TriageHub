# TriageHub

> **Smista qualsiasi cosa in tre stati.** PWA gratuita, offline, privacy-first.
> *Triage anything into three states.* Free PWA, offline, privacy-first.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-installable-brightgreen.svg)](#installazione)
[![Privacy](https://img.shields.io/badge/Privacy-100%25_client--side-success.svg)](#privacy)

🌐 **Live:** [pezzaliapp.github.io/TriageHub](https://pezzaliapp.github.io/TriageHub/) · [alessandropezzali.it/TriageHub](https://www.alessandropezzali.it/TriageHub/)

---

## 🇮🇹 Italiano

### Cos'è

TriageHub è una **PWA generica per il triage** di qualsiasi tipo di item: email, lead commerciali, ticket di assistenza, prodotti di un listino, candidature, idee di progetto. Lo strumento ti aiuta a smistare ogni elemento in **uno dei tre stati** che decidi tu (es. "Fare / Rivedere / Scartare", "Caldo / Tiepido / Freddo", "Aperto / In lavorazione / Risolto").

### A cosa serve davvero

I gestionali sono pieni di filtri, ma quando hai una lista di 200 email, 150 lead, 800 prodotti, ti serve un **gesto decisionale rapido**: per ognuno scegli una delle 3 caselle, e poi esporti il risultato. TriageHub fa solo questo, ma lo fa molto bene.

### Caratteristiche

- 🎯 **6 template precaricati**: Email, Lead commerciali, Ticket assistenza, Listino prodotti, Candidature HR, Idee progetto
- ✏️ **Tutto personalizzabile**: nome, emoji e colore di stati e categorie
- 📥 **Import CSV** con auto-rilevamento delle colonne
- 📤 **Import/Export JSON** per backup completi
- 📊 **Export Markdown** (report leggibile) e CSV (per Excel)
- 🔍 **Ricerca full-text** + filtri per categoria e stato
- 💾 **Tutto offline** dopo il primo caricamento
- 🌐 **Bilingue** italiano / inglese
- 🔒 **Privacy by design**: i dati restano nel tuo browser, niente account, niente server

### Installazione

**Da browser** (Chrome, Edge, Safari, Firefox): apri il sito e clicca "Installa app" / "Aggiungi alla schermata Home".

**Da iPhone**: Safari → tasto Condividi → "Aggiungi a Home".

**Da desktop**: nessuna installazione necessaria, funziona come sito web.

### Workflow tipico — Listino prodotti

1. Esporti il listino da Excel/Numbers/Google Sheets in CSV
2. Apri TriageHub, scegli template "Listino prodotti"
3. Importi il CSV: il mapping è automatico per colonne tipo "Codice", "Descrizione", "Prezzo", "Categoria"
4. Smisti ogni prodotto in **Spingere / Da valutare / Out**
5. Esporti il CSV finale → lo passi a marketing, gestionale, [CSVXpress](https://www.alessandropezzali.it/CSVXpress/)

### Workflow tipico — Email Outlook

1. In Outlook desktop: File → Apri ed esporta → Esporta in CSV
2. In TriageHub scegli template "Email", importi il CSV
3. Mapping: Oggetto → Nome, Inizio corpo → Descrizione, Da → Tag
4. Smisti in **Da rispondere / In attesa / Archiviata**
5. Esporti report Markdown come tua to-do list

### Tecnologie

Vanilla HTML/CSS/JavaScript. Zero dipendenze runtime. Service Worker per offline. localStorage per la persistenza. *Instrument Serif* via Google Fonts come unica risorsa esterna.

---

## 🇬🇧 English

### What it is

TriageHub is a **generic triage PWA** for any kind of item: emails, sales leads, support tickets, product catalogs, job applications, project ideas. It helps you sort each element into **one of three states** that you define (e.g. "Do / Review / Drop", "Hot / Warm / Cold", "Open / In progress / Resolved").

### Why it exists

CRMs and inboxes are full of filters, but when you have a list of 200 emails, 150 leads, 800 products, what you really need is a **fast decisional gesture**: pick one of three boxes per item, then export the result. TriageHub does just this, very well.

### Features

- 🎯 **6 ready-made templates**: Email, Sales Leads, Support Tickets, Product Catalog, HR Applications, Project Ideas
- ✏️ **Fully customizable**: names, emoji and colors for states and categories
- 📥 **CSV import** with column auto-detection
- 📤 **JSON import/export** for full backups
- 📊 **Markdown export** (readable report) and CSV (for Excel)
- 🔍 **Full-text search** + category & status filters
- 💾 **Fully offline** after first load
- 🌐 **Bilingual** Italian / English
- 🔒 **Privacy by design**: data stays in your browser, no accounts, no server

### Installation

**From browser** (Chrome, Edge, Safari, Firefox): open the site and click "Install app" / "Add to Home Screen".

**From iPhone**: Safari → Share → "Add to Home Screen".

**From desktop**: no installation needed, works as a regular website.

### Tech

Vanilla HTML/CSS/JS. Zero runtime dependencies. Service Worker for offline. localStorage for persistence. *Instrument Serif* via Google Fonts is the only external resource.

---

## Privacy

🔒 **TriageHub never sends your data anywhere.**

- No backend, no API, no cloud sync
- No analytics, no tracking, no cookies
- All data lives in your browser's `localStorage`
- Backups are exported as files you save yourself
- Open source: you can read every line of code

The only network request, after the first load, is for Google Fonts — and even that is cached by the Service Worker for offline use.

---

## Roadmap

- **v1.2** — Web Share Target API (mobile: "Share to TriageHub" from any app)
- **v1.3** — IndexedDB for large datasets (>5,000 items)
- **v1.4** — Optional manual sync via JSON file on Drive/Dropbox/iCloud
- **v2.0** — Drag & drop reordering, custom fields beyond `value`

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

Built by [Alessandro Pezzali](https://www.alessandropezzali.it) — part of the [pezzaliapp ecosystem](https://pezzaliapp.github.io/pezzaliHub/) of free, open-source, offline-first PWAs.

🌐 [pezzaliapp.github.io/pezzaliHub](https://pezzaliapp.github.io/pezzaliHub/) · 📧 [GitHub](https://github.com/pezzaliapp)
