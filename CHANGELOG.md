# Changelog

All notable changes to TriageHub are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning](https://semver.org/).

## [1.3.4] — Unreleased

### Fixed
- 📝 **Export Excel preserva tutti i campi item nativi**, non solo le colonne del file originale + categoria/stato. Aggiunte 4 colonne: `Descrizione (TriageHub)`, `Link`, `Tag`, `Valore`. Prima un utente che modificava un item su TriageHub aggiungendo descrizione/link/tag/valore non trovava traccia di quei campi nell'export Excel — ora compaiono tutti.
  - **Modalità foglio unico**: header → `…colonne originali, Descrizione (TriageHub), Link, Tag, Valore, Categoria, Stato`.
  - **Modalità 3 fogli**: header → `…colonne originali, Descrizione (TriageHub), Link, Tag, Valore, Categoria` (lo stato è il nome del foglio).
  - **Link**: 1 link → solo URL; più link → "label: url" su una riga ciascuno (Excel rispetta `\n` nelle celle con wrap-text).
  - **Valore**: esportato come numero raw, mantiene il `type:'n'` di Excel per `=SUM/AVERAGE`. Nessun valueUnit appiccicato — l'utente può formattare in Excel come preferisce.
  - **Suffisso "(TriageHub)"** sulla colonna `Descrizione`: evita collisioni con eventuali colonne `Descrizione` già presenti nel file Excel originale.

### Verified
- ✅ I template `cleanup` e `blank` esportano già tutti i campi item (desc, cat, tag, value, links) nei report PDF/Word/Testo/Markdown via `buildMarkdownReport`. Nessuna modifica necessaria su quel path.

## [1.3.3] — Unreleased

### Fixed
- 🏷 **L'export Excel ora include la colonna `Categoria`** con il nome della categoria assegnata manualmente a ciascun item. Prima l'utente poteva categorizzare 100 item dentro TriageHub e poi non trovava traccia di quelle scelte nel file scaricato. Modalità foglio unico: header → `…colonne originali, Categoria, Stato`. Modalità 3 fogli: ogni foglio aggiunge solo `Categoria` (lo stato è implicito nel nome del foglio). Per item senza categoria assegnata il valore è una cella vuota — convenzione Excel-friendly per filtri e pivot.

## [1.3.2] — Unreleased

> Risposta tecnica al fact-check `FACT_CHECK_xlsx_v1.3.1.md`. Il template Excel dichiarava più di quanto poteva mantenere: passa dal ~30% al ~95% di promesse mantenute restringendo lo scope ed essendo trasparente sui limiti.

### Changed
- 🎯 **Scope del template Excel ristretto a file tabellari puliti**: descrizione del template, micro-guida e manuale aggiornati con linee guida esplicite "quando funziona bene / quando NON usarlo". I file con più fogli, formule, titoli prima degli header, totali in mezzo ai dati o celle merge non sono ben supportati e ora vengono segnalati prima dell'import.
- 📖 **Manuale in-app**: nuovo riquadro giallo "⚠️ Limiti del template Excel" nella sezione 4b "Tutorial Excel" (IT + EN), che elenca i casi non gestiti e suggerisce come pulire il file in Excel prima di caricarlo.
- 🪧 **Micro-guida xlsx**: due nuovi step iniziali (`🎯 Quando funziona bene` / `⚠️ Quando NON usarlo`) prima dei passi tecnici, IT e EN.

### Added
- 📑 **Dialog di avviso pre-import** (`dlg-xlsx-warn`): rileva e mostra in un'unica schermata, prima di caricare gli item, queste casistiche:
  - **Multi-foglio**: indica quanti fogli ci sono e quali (oltre al primo) verranno ignorati
  - **Formule**: avverte che `=B2*1.22` viene valutato al caricamento e nell'export salvato come valore statico
  - **Header dubbio**: la prima riga ha < 50% di celle non vuote, oppure contiene numeri/non-stringhe (sintomo di un titolo o di una riga incompleta)
  L'utente può `Continua comunque` o `Annulla`. Niente più import silenziosi che producono risultati sbagliati senza che l'utente sappia perché.
- 🔢 **Preservazione tipi numerici nell'export Excel**: `parseXlsxFile` ora usa `XLSX.read({cellDates:true})` + `sheet_to_json({raw:true})` e immagazzina numeri come numeri (non più stringhe). Il roundtrip preserva il `type:'n'` delle celle Excel: prima `Prezzo: 51.25 (number)` diventava `"51.25" (string)` rendendo `=SUM(D:D)` rotto nell'export, ora resta `51.25 (number)`. Le date diventano stringhe `YYYY-MM-DD`.
- 🛠 **Helper `normalizeXlsxCell`** per la normalizzazione coerente in input: numeri/boolean restano nativi, Date diventa stringa ISO breve, null/undefined diventa stringa vuota.
- 🧮 **Helper `collectXlsxWarnings`** scansiona il workbook per le 3 casistiche e ritorna un array di stringhe HTML pronte per il dialog.

### Fixed
- 🐛 `xlsxItemExtraColumns` ora mostra `0` (zero) e altri valori falsy validi che prima venivano filtrati. I numeri vengono formattati con `fmtNumber()` per coerenza con l'item value.
- 🐛 `syncXlsxCategories` gestisce correttamente valori non-stringa nella colonna categoria (tipicamente numeri).

## [1.3.1] — Unreleased

### Fixed
- 🐛 **`exportXLSX` crash su workspace appena creato da template** (`TypeError: ws.name.toLowerCase is not a function`). Causa: quando il workspace nasce dal template `xlsx`, `ws.name` è l'oggetto i18n `{it:'Lista Excel', en:'Excel List'}` finché l'utente non rinomina il workspace. La costruzione del filename chiamava `.toLowerCase()` direttamente sull'oggetto. Fix: introdotti due helper `wsDisplayName(ws)` e `wsFilenameSlug(ws)` che gestiscono in modo sicuro stringa, oggetto i18n e undefined. Applicati anche ai title del PDF, all'header del report Markdown e al filename dell'export JSON single-workspace, dove esisteva la stessa fragilità latente.
- 🛡 **Validazione input in `exportXLSX`**: early-return con toast se `ws` non ha `items`/`statuses`/`itemStatus` (workspace corrotto o passato sbagliato).

## [1.3.0] — Unreleased

> **Major refocus**: da 8 a 3 template. Sembra una perdita, non lo è — il valore di un prodotto si misura dalle feature che funzionano davvero, non da quante ce ne sono. Cf. `FACT_CHECK_v1.2.6.md`.

### BREAKING

- 🗑 **Rimossi 6 template senza automazione vera**: `email`, `leads`, `tickets`, `catalog`, `hr`, `ideas`. Erano shell ben presentate (config + micro-guida) ma sostituibili da `blank` + 5 minuti di setup. Il template `tickets` aveva inoltre categorie hardcoded sull'attività dell'autore (equilibratrici, smontagomme): un domain-leak inservibile per il 99% degli utenti.
- 📦 **Migration soft**: i workspace ESISTENTI dei 6 template rimossi NON vengono toccati. Restano nel localStorage e sono accessibili come workspace cards normali. Solo il template non è più creabile da zero dalla galleria.
- 📋 **README riposizionato**: claim "7 template precaricati" → "3 template focalizzati con automazione vera". Meta description e `<title>` aggiornati.

### Added

- 📊 **Nuovo template Lista Excel** (`xlsx`) — l'unico nuovo template post-fact-check, scelto perché ha automazione vera (parser Excel reale, non solo config):
  - 📥 **File picker nativo** per `.xlsx`, `.xls`, `.csv`, `.tsv`. Niente upload, file letto solo client-side.
  - 🔧 **Parser SheetJS 0.20.3** (Apache 2.0, ~950KB), bundlato localmente in `xlsx.full.min.js` e precachato dal Service Worker per offline-first. Niente CDN.
  - 🤖 **Auto-detect mapping**: la prima colonna diventa il nome dell'item. Tutte le altre colonne vengono salvate in `item.xlsxData` per la visualizzazione.
  - 🔧 **Dialog "Mapping colonne"** (toolbar `🔧`): cambia colonna nome, scegli colonna categoria (raggruppa item per il valore), rinomina colonne, nascondi colonne. Persistito in `ws.xlsxMapping`.
  - 📊 **Export Excel organizzato** in due modalità: foglio unico con colonna "Stato" aggiunta in coda, o 3 fogli separati (Da tenere / Da archiviare / Da cestinare). Workspace name → filename slug. Output `.xlsx` standard apribile in Excel/Numbers/LibreOffice.
  - 🃏 **Item card con dettagli espandibili**: ogni riga mostra il nome dalla colonna mappata + un `<details>` con tutte le altre colonne visibili usando i nomi rinominati.
  - 📚 Micro-guida `xlsx` IT + EN, sezione "Tutorial Excel" nel manuale in-app, badge dedicato nella galleria.

### Changed

- 🎯 **Galleria template ora mostra 3 entry** invece di 8. Una decisione editoriale, non una limitazione tecnica.
- 🔄 **Service Worker `CORE_ASSETS`** include `xlsx.full.min.js` (precache, asset critico per il template xlsx).
- 📖 **Manuale in-app**: sezione 5 "Gli 8 template" → "I 3 template"; nuova sezione 4b "Tutorial: smistare un Excel in 10 minuti" / "Tutorial: triage an Excel in 10 minutes".

### Notes for users

- I tuoi workspace Email/Lead/Ticket/Listino/HR/Idee esistenti continuano a funzionare. Non perdi nulla. Se vuoi crearne uno nuovo simile, parti da `⚪ Vuoto` e personalizza categorie e stati come preferisci.
- Il file `FACT_CHECK_v1.2.6.md` (committato in v1.2.6) documenta il ragionamento dietro a questa riduzione.

## [1.2.6] — Unreleased

### Changed
- 🌍 **Documenti esportati universali multi-OS**: i report PDF, Word (.rtf), Testo e Markdown del template **Pulizia file & Desktop** ora contengono SEMPRE le istruzioni complete per macOS, Windows e Linux. Le sezioni "Modo veloce", "Come spostare nelle cartelle" e "Come cestinare velocemente" hanno tre sotto-sezioni dedicate, una per OS. Un report scaricato su Mac e condiviso a un collega Windows è ora immediatamente utile, senza dover rigenerare il file.
- 🧹 **Rimosso il branching `navigator.userAgent` dal report builder**: i documenti esportati non sono più condizionati dall'OS rilevato. Il detect rimane solo per UI a schermo (banner workspace, micro-guide, qualora se ne aggiunga uso futuro).
- 🗑 **Rimossa la funzione `detectOS()`** (dead code): non aveva più chiamanti dopo il refactor.

### Added
- 💡 **Sezione "Suggerimenti operativi" per il template Email**: appendice cross-platform al report con shortcut tastiera (`Cmd + R` su macOS, `Ctrl + R` su Windows/Linux per "rispondi"; `Cmd/Ctrl + Shift + R` per "rispondi a tutti") e promemoria che le azioni concrete (rispondere, archiviare, cancellare) avvengono nel client mail (Gmail, Outlook, Apple Mail, Thunderbird).

## [1.2.5] — Unreleased

### Added
- 📄 **Export PDF (consigliato)**: nuovo bottone primario nel dialog Esporta. Apre la finestra di stampa nativa del browser dentro un iframe nascosto: l'utente sceglie "Salva come PDF" e ottiene un documento stampabile, leggibile su qualsiasi dispositivo, anche offline. Niente librerie esterne (jsPDF/html2pdf), solo `window.print()` + CSS `@media print`.
- 📝 **Export Word (.rtf)**: file Rich Text Format generato in vanilla JS, compatibile con Microsoft Word, Pages e LibreOffice. Conversione markdown → RTF con escape Unicode (`\uNNNN?`) per emoji e caratteri non-ASCII, supporto per heading, grassetto, corsivo, code, liste e link.
- 📃 **Export Testo semplice (.txt)**: report leggibile ovunque, anche dal Blocco note. Mantiene la struttura visiva (titoli con underline `===` / `---`, separatori).
- 🔧 **Sottomenu "Avanzato (per sviluppatori)"** nel dialog Esporta: collassa i formati tecnici (JSON, CSV, Markdown) sotto un `<details>` espandibile, riducendo la frizione per gli utenti non tecnici.

### Changed
- 🎨 **Dialog Esporta riprogettato**: layout a card verticali invece di pulsanti orizzontali, con titolo grande + descrizione esplicativa per ogni formato. Il PDF è il formato consigliato (bordo accent, sfondo tenue).
- 📚 **Micro-guide aggiornate**: il template Pulizia Desktop ora consiglia "📄 PDF" al posto di Markdown nello step 4. Anche l'Email guide menziona PDF come formato per la to-do quotidiana.
- 📖 **Manuale in-app aggiornato** (sezioni 4 "Tutorial Pulizia Desktop" e 6 "Importare ed esportare"): documenta i 3 nuovi formati user-friendly + il sottomenu Avanzato.
- 💡 **Banner promemoria cleanup**: ora dice "↑ Esporta → 📄 PDF" invece di "↑ Esporta → Markdown".
- 🧱 **Refactor interno**: estratta la funzione `buildMarkdownReport(ws)` come single source of truth per tutti gli export (PDF/Word/Text/MD condividono lo stesso markdown sorgente). Aggiunte `markdownToHTML`, `markdownToRTF`, `markdownToText` come converter puri.

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
