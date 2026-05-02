# Changelog

All notable changes to TriageHub are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning](https://semver.org/).

## [1.2.4] — Unreleased

### Fixed
- 🪟 **Galleria template — testo troncato anche su tablet 768–1023px**: la galleria a quel viewport ora usa **2 colonne** (invece di 3) per dare più larghezza alle card, e su desktop wide ≥ 1024px torna a 3 colonne con 900px width. Le descrizioni passano da 2 a 3 righe di clamp, così niente più tronchi a metà parola.

### Added
- 🏷️ **Etichette UX più chiare per il template Pulizia Desktop**: gli stati ora sono `Da tenere / Da archiviare / Da cestinare` (era `Tieni / Archivia / Cestina`). In EN: `To keep / To archive / To trash`. Migration soft per i workspace esistenti: i label vengono aggiornati solo se ancora ai default (i nomi rinominati dall'utente non si toccano).
- ⚠️ **Dialog disclaimer al primo click sul template Desktop**: spiega cosa fa e cosa NON fa l'app (no upload, no spostamento file, no cancellazione), perché un browser non può modificare i file e il tempo stimato totale (~25 min). Checkbox "non mostrare più" persiste in `localStorage`.
- 💡 **Banner promemoria permanente** nel workspace Desktop (sopra la lista item): ricorda all'utente che TriageHub non sposta i file, le scelte sono marcature per il report finale.
- 🧭 **Report Markdown multi-piattaforma** per il template Desktop: rilevamento automatico del sistema operativo (macOS / Windows / Linux) e generazione di un manuale operativo personalizzato — destinazioni consigliate per ogni categoria di file (Documenti, Immagini, Audio, Excel & Listini, Lavoro cliente, Cartelle progetto), istruzioni passo-passo per spostare e cestinare con scorciatoie tastiera per il proprio OS, calcolo dello spazio recuperabile dai file da cestinare.

### Changed
- 📖 Manuale in-app, sezione 4 "Tutorial Pulizia Desktop": riscritta in 5 step con enfasi sul fatto che TriageHub aiuta a decidere ma è il sistema operativo a eseguire. Specifica esplicita "funziona su macOS, Windows e Linux".

## [1.2.3] — 2026-05-02

### Fixed
- 🪟 **Galleria template — testo troncato su desktop wide**: a viewport ≥ 1024px la galleria si allarga da 720px a 900px e le descrizioni delle card passano a 3 righe massime di clamp.

## [1.2.2] — Unreleased

### Added
- 📥 **File picker per template "Pulizia file & Desktop"**: bottone "Carica file da smistare" nell'empty state. Click apre il selettore file del sistema operativo, l'utente seleziona N file (anche centinaia con Cmd+A), l'app crea un item per ogni file con nome, dimensione in MB (`item.value`), data ultimo aggiornamento (`item.tag`) e categoria auto-detect dal MIME type (Immagini / Audio / Documenti / Excel & Listini / Da capire). Niente Terminale richiesto.
- 🔒 Privacy: i file restano sul disco dell'utente, l'app legge solo i metadata (nome/size/type/lastModified). Nessun upload.
- 📚 **Micro-guide contestuali**: quando un workspace è vuoto e ha un templateId, sopra l'empty state compare una guida 3-step specifica per quel template (8 guide totali, IT + EN). Bottoni di azione collegati alle azioni reali (file picker, import CSV, dialog item, dialog stati/categorie). La guida si nasconde quando arriva il primo item, oppure tramite "✕ Nascondi questa guida" (persiste per workspace tramite `ws.hideGuide`).
- 📖 **Manuale in-app**: nuovo bottone `❓ Aiuto` in toolbar che apre un dialog modale con 8 sezioni espandibili (Cos'è / Quickstart 60s / Concetti / Tutorial Pulizia Desktop / Guida ai 8 template / Import-Export / Privacy / FAQ). Tutto in IT + EN.

### Changed
- L'empty state per il template "Pulizia file & Desktop" ora mostra `📥 Carica file da smistare` come azione primaria (al posto di `+ Nuovo`).
- I bottoni dell'empty state classico ora usano `data-guide-action` invece di `onclick`, per coerenza con la guida.

## [1.2.1] — Unreleased

### Added
- 🪪 **Workspace cards switcher**: nuova riga sopra la search bar con una card per ogni workspace (emoji, nome, count item, mini-stats con i 3 stati). Click su card inattiva = switch immediato. Card `+` finale apre la galleria. Layout responsive: fila orizzontale su desktop, scroll-x con snap su mobile.
- 🗂 **Menu contestuale workspace** (right-click desktop / long-press 500ms mobile): Rinomina, Cambia emoji, Duplica template, Esporta solo questo, Elimina. Su desktop dropdown floating, su mobile action sheet stile iOS con bottone "Annulla".
- ✏️ Dialog rinomina/cambia emoji con due input (nome + emoji) e hint per il picker emoji del sistema operativo.
- 🗑 Dialog elimina workspace con conferma esplicita, count degli item che andranno persi, e bottone "Esporta prima" che scarica un JSON del solo workspace prima della cancellazione.
- 🛟 Auto-fallback: se l'utente elimina l'ultimo workspace, ne viene creato automaticamente uno `Default` vuoto.

### Changed
- 🎯 Click su template della galleria: ora **sempre crea un nuovo workspace**. Se ne esiste già uno con lo stesso template, il nuovo prende un suffisso numerico (es. `Email 2`, `Email 3`). Lo switch tra workspace si fa solo dalle workspace cards.
- 🔁 Rimosso il badge `↗ Vai` dalle card della galleria: la galleria è ora un "archivio template", non più uno switcher.
- 🧹 Rimossa la pillola flottante esterna `✨ Template`: la card `+` delle workspace cards la sostituisce. Il bottone toolbar resta.

## [1.2.0] — 2026-05-02

### Added
- 🗂 **Workspaces**: ogni flusso (email, lead, listino, …) vive in un container indipendente con propri item, categorie, stati, valueUnit. La firma "3 stati" resta, ma è 3 stati per workspace.
- ✨ **Galleria template responsive**: bottom sheet su mobile (slide-up, swipe-down per chiudere) e dialog centrato draggabile su desktop (Pointer API, posizione persistita in `localStorage`, clamp al viewport in resize).
- 📂 **Nuovo template "Pulizia file & Desktop"** (7° template): smista file e cartelle del Desktop esportando una lista CSV, triagiando in *Tieni / Archivia / Cestina* e agendo poi nel Finder. valueUnit = `MB`. Categorie: Documenti, Immagini, Audio, Excel & Listini, Lavoro cliente, Cartelle progetto, Da capire.
- 🎴 Card di template con badge visivo *Attivo* (bordo accent).
- 🆓 Template "Vuoto" duplicabile per design, con numerazione automatica (`Vuoto 1`, `Vuoto 2`, …).

### Changed
- Schema dati interno migrato a `state.workspaces[]` + `activeWorkspaceId` + `state.ui` (galleria). Storage key invariata (`triagehub-v1`).
- `loadState()` rileva il vecchio formato v1.1 e migra automaticamente al primo carico in un workspace `Default` (toast informativo, nessuna perdita di dati).
- Export JSON ora produce un backup completo v1.2 con tutti i workspace; import JSON riconosce sia il vecchio formato v1.1 sia il nuovo.
- Empty state ripulito: rimosso il bottone "Scegli un template".

## [1.1.0] — 2026-05-02

### Added
- 🌐 Bilingual UI (Italian / English) with toolbar switch, persisted in localStorage
- ✨ Template gallery with 6 pre-configured workflows: Blank, Email, Sales Leads, Support Tickets, Product Catalog, HR Applications, Project Ideas
- 🔢 Optional numeric `value` field on items (e.g. price, quantity, score), with customizable unit (€, pcs, score)
- 📦 PWA installable via `manifest.json` with adaptive icons (192, 512, maskable, apple-touch)
- 🔌 Service Worker for offline-first behavior with cache versioning
- 📊 Auto-template gallery on first launch (only once, then dismissed)
- 🔄 CSV import auto-detects more column variants (subject, importo, codice, sku, oggetto, body, family, brand, etc.)
- 🇪🇺 CSV parser supports both `,` and `;` separators (Italian/European Excel exports)

### Changed
- Item card layout includes optional value display in serif italic
- README expanded with use cases (Outlook export, price-list workflow)
- Footer with project credits and link to PezzaliHub portfolio

## [1.0.0] — 2026-05-02

### Added
- Initial release of TriageHub
- 3-state triage system, fully customizable (label, emoji, color)
- Categories with emoji and name, addable/editable/deletable
- Items with name, description, category, tag, multiple links
- CSV import with column mapping
- JSON import (TriageHub backup format or simple object array)
- Export to JSON (full backup), Markdown (report), CSV (table)
- Full-text search with `Cmd/Ctrl+K` shortcut, `Esc` to clear
- Sticky toolbar with chip filters by category and status
- localStorage persistence
- Apple-clean visual identity with Instrument Serif accent typography
