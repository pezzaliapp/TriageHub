# Changelog

All notable changes to TriageHub are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning](https://semver.org/).

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
