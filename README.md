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

TriageHub è una **PWA per smistare** file del Desktop e righe di Excel/CSV in tre stati che decidi tu (es. *Da tenere / Da archiviare / Da cestinare*). Tre template focalizzati con automazione vera, niente filler.

### Come funziona

Hai una pila di **file sul Desktop** o un **foglio Excel di centinaia di righe**: ti serve un gesto decisionale rapido per ognuno. TriageHub ti dà tre caselle, tu scegli, lui produce un report (PDF, Word, Excel) che dice esattamente cosa fare dopo.

### I 3 template

- 📂 **Pulizia file & Desktop** — file picker nativo, MIME-detect automatico, report PDF con istruzioni concrete macOS/Windows/Linux per spostare e cestinare
- 📊 **Lista Excel** — carica `.xlsx`/`.csv`/`.tsv`, smista riga per riga, scarica un nuovo Excel organizzato (foglio unico con colonna *Stato* o 3 fogli separati)
- ⚪ **Vuoto** — workspace pulito, configurazione totalmente tua

### Caratteristiche

- 📚 **Micro-guide contestuali** per ogni template + manuale in-app dal bottone Aiuto
- 📥 **File picker nativo** sia per Desktop cleanup che per Excel: niente Terminale, niente upload
- 📊 **Export multi-formato**: PDF (consigliato), Word (.rtf), Testo, Excel (.xlsx), JSON, CSV, Markdown
- ✏️ **Tutto personalizzabile**: nome, emoji e colore di stati e categorie; mapping colonne Excel rinominabili
- 🔍 **Ricerca full-text** + filtri per categoria e stato
- 💾 **Tutto offline** dopo il primo caricamento
- 🌐 **Bilingue** italiano / inglese
- 🔒 **Privacy by design**: i dati restano nel tuo browser, niente account, niente server

### Installazione

**Da browser** (Chrome, Edge, Safari, Firefox): apri il sito e clicca "Installa app" / "Aggiungi alla schermata Home".

**Da iPhone**: Safari → tasto Condividi → "Aggiungi a Home".

**Da desktop**: nessuna installazione necessaria, funziona come sito web.

### Workflow — Lista Excel

1. Apri TriageHub, scegli template "📊 Lista Excel"
2. Click "📥 Carica file Excel/CSV", seleziona il tuo `.xlsx`/`.csv`/`.tsv`
3. (Opzionale) Click "🔧 Mapping colonne" per scegliere quale colonna è il nome, quale è la categoria, rinominare o nascondere colonne
4. Smisti ogni riga in **Da tenere / Da archiviare / Da cestinare**
5. Click "↑ Esporta" → "📊 Excel organizzato" → scegli foglio unico con colonna *Stato* o 3 fogli separati
6. Apri il file in Excel/Numbers/LibreOffice e usalo

### Workflow — Pulizia Desktop

1. Apri TriageHub, scegli template "📂 Pulizia file & Desktop"
2. Click "📥 Carica file da smistare", seleziona i file dal Desktop (Cmd+A per tutti)
3. L'app categorizza automaticamente per tipo (immagini, audio, documenti, excel)
4. Smisti ogni file in **Da tenere / Da archiviare / Da cestinare**
5. Click "↑ Esporta" → "📄 PDF" → ottieni un manuale operativo cross-platform (macOS/Windows/Linux) con destinazioni consigliate, scorciatoie tastiera, calcolo spazio recuperabile
6. Segui il PDF nel Finder/Esplora File/file manager

### Tecnologie

Vanilla HTML/CSS/JavaScript. SheetJS (Apache 2.0, ~950KB) bundlato localmente per parsing Excel. Service Worker per offline. localStorage per la persistenza. *Instrument Serif* via Google Fonts.

---

## 🇬🇧 English

### What it is

TriageHub is a **PWA to sort** Desktop files and Excel/CSV rows into three states you define (e.g. *To keep / To archive / To trash*). Three focused templates with real automation, no filler.

### How it works

You have a stack of **files on your Desktop** or a **spreadsheet with hundreds of rows**: you need a fast decisional gesture for each item. TriageHub gives you three boxes, you pick, it produces a report (PDF, Word, Excel) telling you exactly what to do next.

### The 3 templates

- 📂 **File & Desktop cleanup** — native file picker, automatic MIME detection, PDF report with concrete macOS/Windows/Linux instructions for moving and trashing
- 📊 **Excel List** — upload `.xlsx`/`.csv`/`.tsv`, sort row by row, download a new organized Excel (single sheet with *Status* column or 3 separate sheets)
- ⚪ **Blank** — clean workspace, fully customizable

### Features

- 📚 **Contextual micro-guides** for every template + in-app manual via the Help button
- 📥 **Native file picker** for both Desktop cleanup and Excel: no Terminal, no uploads
- 📊 **Multi-format export**: PDF (recommended), Word (.rtf), Text, Excel (.xlsx), JSON, CSV, Markdown
- ✏️ **Fully customizable**: names, emoji and colors for states and categories; renamable Excel column mapping
- 🔍 **Full-text search** + category & status filters
- 💾 **Fully offline** after first load
- 🌐 **Bilingual** Italian / English
- 🔒 **Privacy by design**: data stays in your browser, no accounts, no server

### Installation

**From browser** (Chrome, Edge, Safari, Firefox): open the site and click "Install app" / "Add to Home Screen".

**From iPhone**: Safari → Share → "Add to Home Screen".

**From desktop**: no installation needed, works as a regular website.

### Workflow — Excel List

1. Open TriageHub, pick the "📊 Excel List" template
2. Click "📥 Load Excel/CSV file", pick your `.xlsx`/`.csv`/`.tsv`
3. (Optional) Click "🔧 Column mapping" to choose which column is the name, which is the category, rename or hide columns
4. Sort each row into **To keep / To archive / To trash**
5. Click "↑ Export" → "📊 Organized Excel" → pick single sheet with *Status* column or 3 separate sheets
6. Open the file in Excel/Numbers/LibreOffice and use it

### Workflow — Desktop Cleanup

1. Open TriageHub, pick the "📂 File & Desktop cleanup" template
2. Click "📥 Load files to triage", select files from your Desktop (Cmd+A for all)
3. The app auto-categorizes by type (images, audio, documents, spreadsheets)
4. Sort each file into **To keep / To archive / To trash**
5. Click "↑ Export" → "📄 PDF" → get a cross-platform (macOS/Windows/Linux) operations manual with recommended destinations, keyboard shortcuts, reclaimable space estimate
6. Follow the PDF in Finder/File Explorer/file manager

### Tech

Vanilla HTML/CSS/JS. SheetJS (Apache 2.0, ~950KB) bundled locally for Excel parsing. Service Worker for offline. localStorage for persistence. *Instrument Serif* via Google Fonts.

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

- **v1.2** ✅ — Workspaces multipli, galleria flottante, workspace cards, template Pulizia file & Desktop, export multi-formato
- **v1.3** ✅ — Major refocus: 8 → 3 template focalizzati (Cleanup, Excel, Blank); SheetJS integration; export Excel organizzato
- **v1.4** — Web Share Target API (mobile: "Share to TriageHub" from any app)
- **v1.5** — IndexedDB for large datasets (>5,000 items per workspace)
- **v1.6** — Optional manual sync via JSON file on Drive/Dropbox/iCloud
- **v2.0** — Drag & drop reordering, custom fields beyond `value`

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

Built by [Alessandro Pezzali](https://www.alessandropezzali.it) — part of the [pezzaliapp ecosystem](https://pezzaliapp.github.io/pezzaliHub/) of free, open-source, offline-first PWAs.

🌐 [pezzaliapp.github.io/pezzaliHub](https://pezzaliapp.github.io/pezzaliHub/) · 📧 [GitHub](https://github.com/pezzaliapp)
