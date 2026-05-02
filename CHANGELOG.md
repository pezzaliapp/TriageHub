# Changelog

All notable changes to TriageHub are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning](https://semver.org/).

## [1.2.0] — Unreleased

### Added
- 🗂 **Workspaces**: ogni flusso (email, lead, listino, …) vive in un container indipendente con propri item, categorie, stati, valueUnit. La firma "3 stati" resta, ma è 3 stati per workspace.
- ✨ **Galleria template flottante draggabile**: pillola compatta in alto a destra; espandibile, trascinabile via Pointer API (mouse + touch), posizione persistita in `localStorage`, clamp automatico al viewport. Header con grab indicator (⋮⋮) e tooltip "Trascina per spostare".
- 📂 **Nuovo template "Pulizia file & Desktop"** (7° template): smista file e cartelle del Desktop esportando una lista CSV, triagiando in *Tieni / Archivia / Cestina* e agendo poi nel Finder. valueUnit = `MB`. Categorie: Documenti, Immagini, Audio, Excel & Listini, Lavoro cliente, Cartelle progetto, Da capire.
- 🎴 Card di template con 3 stati visivi: *Disponibile*, *Attivo* (badge `● Attivo`, bordo accent), *Già creato non attivo* (badge `↗ Vai`, click = switch al workspace esistente).
- 🆓 Template "Vuoto" duplicabile per design, con numerazione automatica (`Vuoto 1`, `Vuoto 2`, …).

### Changed
- Schema dati interno migrato a `state.workspaces[]` + `activeWorkspaceId` + `state.ui` (galleria). Storage key invariata (`triagehub-v1`).
- `loadState()` rileva il vecchio formato v1.1 e migra automaticamente al primo carico in un workspace `Default` (toast informativo, nessuna perdita di dati).
- Export JSON ora produce un backup completo v1.2 con tutti i workspace; import JSON riconosce sia il vecchio formato v1.1 sia il nuovo.
- Empty state ripulito: rimosso il bottone "Scegli un template" perché ridondante con la galleria sempre visibile.

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
