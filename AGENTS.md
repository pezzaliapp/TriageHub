# TriageHub — Briefing per AI Assistant

> Questo file è un briefing tecnico per qualunque AI (Cursor, Copilot o altri strumenti tecnici, ecc.)
> chiamato a lavorare su questo repo. Leggilo prima di toccare il codice.

## Contesto progetto

**TriageHub** è una PWA generica per il triage di item in 3 stati personalizzabili.
Fa parte dell'**ecosistema [pezzaliapp](https://github.com/pezzaliapp)** di Alessandro Pezzali, che conta oltre 200 PWA pubblicate su GitHub Pages + dominio `alessandropezzali.it`.

### Posizionamento nell'ecosistema

TriageHub copre il "livello decisionale" che mancava nel portfolio di Alessandro. L'ecosistema esistente fa:
- **Confronto listini**: CheckappExcel, FINDNMATCH, XCompare
- **Ricerca prodotti**: ExelCFR, CSVXpress
- **Calcolo prezzi**: FleXiPrice, FastSale, EasyPrice, PriceXpress, MCINV
- **Preventivi**: quoteflow, EnterpriceAPP, Sales-Canvas
- **Provvigioni**: ProvX, CMProvX
- **Trasporti**: Trasporti-Use-Friendly

TriageHub aggiunge: **"di tutto questo, cosa lavoro?"** — il gesto di smistamento in 3 categorie decisionali.

## Filosofia tecnica (rispettare)

Tutte le PWA dell'ecosistema condividono questi principi. Se proponi modifiche, allineati a questi:

1. **Singolo file HTML** quando possibile. Un file = un repo = un dominio. Niente bundler, niente build step.
2. **Vanilla JS, zero dipendenze runtime**. L'unica eccezione è Google Fonts (Instrument Serif) caricato da CDN.
3. **Privacy-first, client-side al 100%**. Nessun backend, nessuna API, nessun cookie, nessun tracking. Tutto in `localStorage`.
4. **Offline-first via Service Worker**. La PWA deve funzionare senza connessione dopo il primo caricamento.
5. **Bilingue IT/EN** con switch in toolbar, scelta persistita in `localStorage`.
6. **Estetica Apple-clean** + tocco distintivo *Instrument Serif* italica per titoli e numeri.
7. **Compatibilità**: deve funzionare su Safari iOS 14+, Chrome Android 90+, browser desktop moderni.

## Architettura del codice

### Struttura file

```
TriageHub/
├── index.html          ← TUTTO il codice (HTML+CSS+JS in un file)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
├── icons/              ← Icone PWA (192, 512, maskable, apple-touch)
├── README.md
├── CHANGELOG.md
├── LICENSE             ← MIT
├── .gitignore
└── AGENTS.md           ← questo file
```

### Sezioni di `index.html` (ordinate)

1. `<head>` — meta PWA, link manifest, link Google Fonts
2. `<style>` — CSS con variabili in `:root`, mobile-first responsive
3. `<body>` — markup HTML (header, toolbar, main, dialog, toast)
4. `<script>` — sezioni commentate:
   - `I18N` — dizionario IT/EN + funzione `t()` + `applyI18n()`
   - `TEMPLATES` — array dei 6 template precaricati
   - `STATE` — schema dati + load/save su `localStorage`
   - `HELPERS` — `uid()`, `escapeHtml()`, `toast()`, `localized()`, `fmtNumber()`, ecc.
   - `RENDER` — `renderStats()`, `renderChips()`, `renderItems()`, `renderAll()`
   - `DIALOG` helpers
   - `TEMPLATES DIALOG`, `ITEM DIALOG`, `CATEGORIES DIALOG`, `STATUSES DIALOG`
   - `SEARCH`, `IMPORT CSV`, `IMPORT JSON`, `EXPORT`, `CLEAR`
   - `SERVICE WORKER` registration
   - `INIT` — bootstrap

### Schema dati (in `localStorage`)

```js
// Key: 'triagehub-v1'
{
  items: [
    {
      id: "uuid",
      name: "string (required)",
      desc: "string",
      cat: "category-id | null",
      tag: "string short label",
      value: number | null,    // campo numerico opzionale (prezzo, score, ecc.)
      links: [{ label, url }],
      created: "ISO date"
    }
  ],
  categories: [
    { id: "uuid", name: "string OR { it, en }", emoji: "string" }
  ],
  statuses: [
    // sempre 3, ordine fisso
    { id: "s1|s2|s3", label: "string OR { it, en }", emoji: "string", color: "#hex" }
  ],
  itemStatus: { "item-id": "status-id" },  // mappa
  valueUnit: "string"   // es. "€", "pcs", "score"
}

// Key: 'triagehub-lang'
"it" | "en"

// Key: 'triagehub-onboarded'
"1" se l'utente ha già visto la galleria template al primo avvio
```

**Nota importante sui campi `name`/`label`**: possono essere stringhe semplici (utente li ha modificati) oppure oggetti `{it, en}` (provengono da template). La funzione `localized(v)` gestisce entrambi i casi.

### Pattern fondamentali

- **Idempotenza dei render**: `renderAll()` ricostruisce stato → DOM. Niente DOM diff manuale.
- **Event delegation minima**: i listener si rebindano dopo ogni render. Funziona perché il dataset è piccolo (centinaia di item, non migliaia).
- **localStorage save sincrono dopo ogni mutation**. Niente debounce: sono pochi byte.
- **Toast per feedback** invece di alert: `toast(msg)` mostra un pillolone in basso.
- **Dialog HTML nativo** (`<dialog>` + `showModal()`), non custom modal.

## Limiti noti e tradeoff

- **localStorage ~5MB** = circa 3.000–5.000 item. Per dataset più grandi serve IndexedDB (v1.3 in roadmap).
- **Nessun multi-device sync**: voluto, è la promessa privacy. L'utente esporta JSON e si arrangia con Drive/Dropbox/iCloud manualmente.
- **CSV parser interno**, non gestisce edge case esotici (multiline cells dentro virgolette con virgolette doppiate complesse). Funziona bene per il 99% dei CSV reali.
- **No drag&drop reorder degli item**: in roadmap v2.0.

## Convenzioni di stile

- **Indentazione**: 2 spazi
- **Stringhe**: apici singoli `'` per JS, doppi `"` per HTML attributes
- **Naming**: camelCase per JS, kebab-case per ID HTML/CSS, PascalCase per costanti top-level (`I18N`, `TEMPLATES`, `DEFAULT_STATUSES`)
- **Commenti**: sezioni separate da banner `// =====`. Spiegano il **perché**, non il **cosa**.
- **CSS**: variabili in `:root`, mobile-first, breakpoint a 640px, niente preprocessori

## Quando aggiorni qualcosa

1. **Bump versione** in `CHANGELOG.md` seguendo SemVer
2. **Aggiorna `CACHE_VERSION`** in `sw.js` per forzare update agli utenti esistenti
3. **Verifica i 6 template** funzionino ancora (è la prima cosa che vede l'utente al primo avvio)
4. **Test mobile**: l'80% dell'uso è da iPhone/Android, controlla che il layout regga
5. **Test bilingue**: cambia lingua e verifica che tutti i testi si traducano

## Roadmap (vedi anche `CHANGELOG.md` e README)

| Versione | Feature | Note |
|----------|---------|------|
| v1.2 *(in corso)* | Workspaces multipli, galleria flottante draggabile, workspace cards, template Pulizia file & Desktop | Refactor schema → container per flusso |
| v1.3 | Web Share Target API | "Condividi → TriageHub" da OS mobile |
| v1.4 | IndexedDB per dataset > 5k item per workspace | Migration path da localStorage |
| v1.5 | Sync manuale via JSON cloud | Drag&drop file da Drive/Dropbox/iCloud |
| v2.0 | Custom fields, drag&drop reorder | Refactor schema item |

## Pubblicazione

Coerente col resto del portfolio Alessandro:

1. Push su `main` di `pezzaliapp/TriageHub`
2. **GitHub Pages**: Settings → Pages → Source `main` branch, root → live su `pezzaliapp.github.io/TriageHub/`
3. **Alias dominio**: copia/sync su `alessandropezzali.it/TriageHub/` (workflow esistente di Alessandro)
4. **Aggiungi a PezzaliHub**: una riga JSON nel file dati di `pezzalihub`, categoria `🌐 Hub` o `⏱️ Produttività`

## Contatti

- Owner: Alessandro Pezzali — [@pezzaliapp](https://github.com/pezzaliapp) · [alessandropezzali.it](https://www.alessandropezzali.it)
- Issues: [github.com/pezzaliapp/TriageHub/issues](https://github.com/pezzaliapp/TriageHub/issues)
