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

- 📂 **Pulizia file & Desktop** — **Smart Scan ricorsivo** (anche le sottocartelle), dashboard a gruppi, suggerimenti automatici, **anteprima inline foto/video/audio/PDF**, **azione vera sui file** (cancella/sposta su disco via File System Access API in Chrome/Edge desktop, oppure export ZIP organizzato ovunque)
- 📊 **Lista Excel** — carica `.xlsx`/`.csv`/`.tsv`, smista riga per riga, scarica un nuovo Excel organizzato (foglio unico con colonna *Stato* o 3 fogli separati)
- ⚪ **Vuoto** — workspace pulito, configurazione totalmente tua

### Caratteristiche

- 🆕 **v1.5: Smart Scan** — scansione ricorsiva (max 5 livelli / 10.000 file) con barra di avanzamento, dashboard a gruppi (Foto/Video/Documenti/Audio/Archivi/Altro), suggerimenti automatici (screenshot vecchi, duplicati, file giganti, "untitled"), filtri esplora-gruppo (data/origine/dimensione/sotto-tipo) e bulk action multi-selezione
- 🆕 **v1.4: Cancellazione vera dei file** sul disco (Chrome/Edge desktop) o via export ZIP organizzato (ovunque, incluso iPhone/Safari/Android)
- 🆕 **v1.4: Anteprima inline** di foto, video, audio e PDF direttamente nell'app
- 📚 **Micro-guide contestuali** per ogni template + manuale in-app dal bottone Aiuto
- 📥 **File picker nativo** sia per Desktop cleanup che per Excel: niente Terminale, niente upload
- 📊 **Export multi-formato**: PDF (consigliato), Word (.rtf), Testo, Excel (.xlsx), ZIP (.zip con file veri), JSON, CSV, Markdown
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

### Workflow — Pulizia Desktop (v1.5 Smart Scan)

**Modalità A — Azione vera sul disco (Chrome / Edge / Opera desktop)**

1. Apri TriageHub, scegli template "📂 Pulizia file & Desktop"
2. Click "📁 Apri cartella" nel banner → seleziona la cartella da pulire (es. Desktop)
3. Conferma il permesso di lettura/scrittura, poi scegli se **scansionare anche le sottocartelle** (max 5 livelli / 10.000 file)
4. L'app mostra una **dashboard a gruppi** (Foto/Video/Documenti/Audio/Archivi/Altro) e i **suggerimenti** (screenshot vecchi, duplicati, file giganti, "untitled") già pre-marcati come "Da cestinare" — niente è ancora stato toccato
5. Esplora un gruppo, **filtra** per data/origine/dimensione/sotto-tipo e usa le **bulk action** (seleziona i visibili → Tenere/Archiviare/Cestinare), oppure smista file per file
6. Click "⚡ Applica al disco" → conferma → l'app **cancella davvero** i file "Da cestinare" e sposta gli "Da archiviare" in `_TriageHub_Archivio/` (ricreando i sottopercorsi). Operazione irreversibile (no Cestino di sistema).

**Modalità B — Export ZIP organizzato (ovunque: Safari, iPhone, Android, Firefox)**

1. Apri TriageHub, scegli template "📂 Pulizia file & Desktop"
2. Click "📥 Carica file da smistare", seleziona i file dal Desktop (Cmd+A per tutti)
3. L'app categorizza automaticamente per tipo e mostra anteprime di foto/video
4. Smisti ogni file in **Da tenere / Da archiviare / Da cestinare**
5. Click "↑ Esporta" → "📦 ZIP organizzato" → scarichi un `.zip` con cartelle `Tenere/` e `Archiviare/`. I "Da cestinare" non sono inclusi.
6. Estrai lo ZIP e sostituisci la cartella originale (oppure usa il PDF report come prima).

**Modalità C — Report PDF (come prima)**

Funziona ancora come in v1.3: l'app produce un manuale operativo cross-platform e tu agisci manualmente nel Finder/Esplora File.

### Tecnologie

Vanilla HTML/CSS/JavaScript. SheetJS (Apache 2.0, ~950KB) e JSZip (MIT, ~96KB) bundlati localmente per parsing Excel e generazione archivi `.zip`. File System Access API per cancellazione/spostamento di file reali (Chrome/Edge/Opera desktop). Service Worker per offline. localStorage per la persistenza del workspace (i file blob restano in memoria di sessione). *Instrument Serif* via Google Fonts.

---

## 🇬🇧 English

### What it is

TriageHub is a **PWA to sort** Desktop files and Excel/CSV rows into three states you define (e.g. *To keep / To archive / To trash*). Three focused templates with real automation, no filler.

### How it works

You have a stack of **files on your Desktop** or a **spreadsheet with hundreds of rows**: you need a fast decisional gesture for each item. TriageHub gives you three boxes, you pick, it produces a report (PDF, Word, Excel) telling you exactly what to do next.

### The 3 templates

- 📂 **File & Desktop cleanup** — **recursive Smart Scan** (subfolders too), group dashboard, automatic suggestions, **inline photo/video/audio/PDF preview**, **real action on files** (delete/move on disk via File System Access API in Chrome/Edge desktop, or organized ZIP export anywhere)
- 📊 **Excel List** — upload `.xlsx`/`.csv`/`.tsv`, sort row by row, download a new organized Excel (single sheet with *Status* column or 3 separate sheets)
- ⚪ **Blank** — clean workspace, fully customizable

### Features

- 🆕 **v1.5: Smart Scan** — recursive scan (max 5 levels / 10,000 files) with progress bar, group dashboard (Photos/Video/Documents/Audio/Archives/Other), automatic suggestions (old screenshots, duplicates, huge files, "untitled"), explore-group filters (date/origin/size/subtype) and multi-select bulk actions
- 🆕 **v1.4: Real file deletion** on disk (Chrome/Edge desktop) or via organized ZIP export (anywhere, including iPhone/Safari/Android)
- 🆕 **v1.4: Inline preview** of photos, videos, audio and PDFs directly in the app
- 📚 **Contextual micro-guides** for every template + in-app manual via the Help button
- 📥 **Native file picker** for both Desktop cleanup and Excel: no Terminal, no uploads
- 📊 **Multi-format export**: PDF (recommended), Word (.rtf), Text, Excel (.xlsx), ZIP (.zip with real files), JSON, CSV, Markdown
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

### Workflow — Desktop Cleanup (v1.5 Smart Scan)

**Mode A — Real action on disk (Chrome / Edge / Opera desktop)**

1. Open TriageHub, pick the "📂 File & Desktop cleanup" template
2. Click "📁 Open folder" in the banner → select the folder to clean (e.g. Desktop)
3. Confirm the read/write permission, then choose whether to **scan subfolders too** (max 5 levels / 10,000 files)
4. The app shows a **group dashboard** (Photos/Video/Documents/Audio/Archives/Other) and **suggestions** (old screenshots, duplicates, huge files, "untitled") already pre-marked as "To trash" — nothing has been touched yet
5. Explore a group, **filter** by date/origin/size/subtype and use **bulk actions** (select visible → Keep/Archive/Trash), or sort file by file
6. Click "⚡ Apply to disk" → confirm → the app **actually deletes** "To trash" files and moves "To archive" ones into `_TriageHub_Archive/` (recreating subpaths). Irreversible (no system Trash).

**Mode B — Organized ZIP export (anywhere: Safari, iPhone, Android, Firefox)**

1. Open TriageHub, pick the "📂 File & Desktop cleanup" template
2. Click "📥 Load files to triage", select files from Desktop (Cmd+A picks all)
3. The app auto-categorizes by type and shows previews of photos/videos
4. Sort each file into **To keep / To archive / To trash**
5. Click "↑ Export" → "📦 Organized ZIP" → download a `.zip` with `Keep/` and `Archive/` folders. "To trash" files are not included.
6. Extract the ZIP and replace the original folder (or use the PDF report as before).

**Mode C — PDF report (as before)**

Still works as in v1.3: the app produces a cross-platform operations manual and you act manually in Finder/File Explorer.

### Tech

Vanilla HTML/CSS/JS. SheetJS (Apache 2.0, ~950KB) and JSZip (MIT, ~96KB) bundled locally for Excel parsing and `.zip` generation. File System Access API for real file deletion/move (Chrome/Edge/Opera desktop). Service Worker for offline. localStorage for workspace persistence (file blobs live in session memory). *Instrument Serif* via Google Fonts.

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
- **v1.4** ✅ — File System Access API per cancellazione/spostamento file reali; export ZIP organizzato; anteprima foto/video/audio/PDF inline; bundle JSZip
- **v1.5** ✅ — Smart Scan: scansione ricorsiva, dashboard a gruppi, suggerimenti automatici, filtri esplora-gruppo, bulk action multi-selezione
- **v1.6** — Web Share Target API (mobile: "Share to TriageHub" from any app)
- **v1.7** — IndexedDB for large datasets & blob persistence across reloads (>5,000 items per workspace)
- **v1.8** — Optional manual sync via JSON file on Drive/Dropbox/iCloud
- **v2.0** — Drag & drop reordering, custom fields beyond `value`

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

Built by [Alessandro Pezzali](https://www.alessandropezzali.it) — part of the [pezzaliapp ecosystem](https://pezzaliapp.github.io/pezzaliHub/) of free, open-source, offline-first PWAs.

🌐 [pezzaliapp.github.io/pezzaliHub](https://pezzaliapp.github.io/pezzaliHub/) · 📧 [GitHub](https://github.com/pezzaliapp)
