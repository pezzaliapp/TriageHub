# Changelog

All notable changes to TriageHub are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning](https://semver.org/).

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
