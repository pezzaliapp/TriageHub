# Brief TriageHub v1.5 — "Smart Scan"

> Specifiche complete per il prossimo upgrade. Da usare come brief tecnico dentro la cartella `~/Desktop/TriageHub`.

## Contesto

Sei dentro il repo `pezzaliapp/TriageHub`, attualmente alla v1.4.0 (vedi CHANGELOG.md). La v1.4 ha introdotto la cancellazione vera dei file via File System Access API e l'export ZIP organizzato. Funziona bene per cartelle piccole, ma su un Desktop con 500+ file è ancora ingestibile perché:

- Mostra solo il primo livello (no sottocartelle)
- Smistamento uno-per-uno
- Nessun raggruppamento intelligente
- Nessun suggerimento automatico

La v1.5 risolve tutto questo introducendo lo "Smart Scan".

## Obiettivo

Quando l'utente clicca "📁 Apri cartella" nel workspace Cleanup, l'app deve:

1. Chiedere se scansionare anche le sottocartelle (dialog di conferma)
2. Mostrare una barra di avanzamento durante la scansione
3. Presentare i risultati in una **dashboard di gruppi** (vista primaria) con toggle "📋 Vista lista" per chi preferisce la modalità classica v1.4
4. Pre-marcare automaticamente come "Cestinare" i file che corrispondono a regole di suggerimento (screenshot vecchi, duplicati per nome+dimensione, ecc.) — ma SENZA cancellare nulla finché l'utente non conferma esplicitamente
5. Permettere bulk action per intero gruppo o selezione multipla

## Specifiche dettagliate

### 1. Dialog "Scansione ricorsiva?"

All'apertura della cartella, dopo `showDirectoryPicker()` e prima della scansione:

```
📁 Hai selezionato: ~/Desktop
   Contiene N sottocartelle e M file nel primo livello

[ ] Scansiona anche tutte le sottocartelle
    ⚠ Pu� richiedere tempo su cartelle con migliaia di file

[Annulla]  [Scansiona]
```

Se l'utente spunta "scansiona sottocartelle", esplora ricorsivamente con un limite di sicurezza: **max 5 livelli di profondità** e **max 10.000 file totali** (oltre, fermati e mostra avviso "cartella troppo grande, dividi in parti").

### 2. Progress bar durante scansione

Una piccola UI in overlay tipo:

```
Sto scansionando...
[████████░░░░░░░░] 47%

3.421 file trovati · 12.3 GB
Sottocartella corrente: Documents/2023/foto
```

Cancellabile con un bottone "Annulla".

### 3. Dashboard di gruppi (vista primaria)

Dopo la scansione, sostituisce la solita lista item con questa vista:

```
┌─ Riepilogo ─────────────────────────────────────────┐
│ 3.421 file · 24.5 GB · da 47 sottocartelle           │
│ [🔄 Riscansiona] [📋 Vista lista] [▼ Esporta]       │
└──────────────────────────────────────────────────────┘

┌─ Gruppi ─────────────────────────────────────────────┐
│ 🖼  Foto              1.247 file · 4.8 GB    [Esplora →] │
│ 🎬  Video                89 file · 12.1 GB   [Esplora →] │
│ 📄  Documenti           456 file · 230 MB    [Esplora →] │
│ 🎵  Audio                12 file · 145 MB    [Esplora →] │
│ 📦  Archivi              23 file · 1.2 GB    [Esplora →] │
│ ❓  Altro                34 file · 89 MB     [Esplora →] │
└──────────────────────────────────────────────────────┘

┌─ 💡 Suggerimenti TriageHub ──────────────────────────┐
│ ⚠ I file sotto sono PRE-MARCATI come "Cestinare".   │
│   Non saranno cancellati finch� non confermi con    │
│   "⚡ Applica al disco" o "📦 Esporta ZIP".         │
│                                                       │
│ • 423 screenshot più vecchi di 2 anni                │
│   → 1.1 GB recuperabili    [Esplora] [Deseleziona]   │
│                                                       │
│ • 87 duplicati per nome+dimensione                   │
│   → 340 MB recuperabili    [Esplora] [Deseleziona]   │
│                                                       │
│ • 12 file > 500 MB                                   │
│   → 8.4 GB se non servono  [Esplora] [Deseleziona]   │
│                                                       │
│ • 31 file "untitled" / "Senza titolo"                │
│   → 45 MB recuperabili     [Esplora] [Deseleziona]   │
└──────────────────────────────────────────────────────┘

[⚡ Applica al disco]  [📦 Esporta ZIP organizzato]
```

### 4. Vista "Esplora gruppo"

Cliccando "Esplora →" su un gruppo (es. Foto), entri in una vista filtrabile:

```
🖼 Foto · 1.247 file · 4.8 GB

Filtri:
📅 Data:       [Tutte] [Oggi] [Settimana] [Mese] [+1 anno] [+2 anni]
📂 Origine:    [Tutte] [Desktop] [Downloads/foto] [Documents/old]
📏 Dimensione: [Tutte] [>10MB] [>50MB] [>100MB]
🏷  Sotto-tipo: [Tutte] [Screenshot] [Foto fotocamera] [Modificate]

[← Torna ai gruppi]   Visualizzati: 47   Selezionati: 12
[✓ Seleziona tutti i visibili] [Deseleziona tutto]
[Per i selezionati: Tenere] [Archiviare] [Cestinare]

☐ Screenshot 2024-03-15 alle 14:22.png · 2.1 MB · 2 anni fa · ~/Desktop
☑ Screenshot 2024-03-15 alle 14:25.png · 1.8 MB · 2 anni fa · ~/Desktop  [🗑 pre-marcato]
☐ IMG_4521.HEIC · 4.2 MB · 1 anno fa · ~/Downloads/foto
...
```

Per ogni file mostra: nome, dimensione, data (relativa: "2 anni fa"), path relativo all'origine, e badge se è pre-marcato dai suggerimenti.

### 5. Logica di raggruppamento per tipo

Heuristics basate su estensione + MIME type. Funzione `detectFileGroup(file)`:

- **Foto**: `image/*` — sotto-tipi:
  - **Screenshot**: nome matcha `/screen.?shot|schermata|cattura/i` OR risoluzione tipica schermo (se leggibile, opzionale)
  - **Foto fotocamera**: nome matcha `/^IMG_\d+|^DSC\d+|^DSCN\d+|^P\d{7}/`
  - **Altre**: tutto il resto
- **Video**: `video/*`
- **Documenti**: pdf, doc, docx, txt, md, pages, odt, rtf, key, ppt, pptx
- **Audio**: `audio/*`
- **Archivi**: zip, rar, 7z, tar, gz, dmg, iso
- **Altro**: tutto il resto

### 6. Regole di suggerimento (pre-marca come Cestinare)

Ogni regola scansiona i file e li aggiunge a una lista di "candidati cestino". L'utente vede il conteggio aggregato e può espandere/deselezionare.

1. **Screenshot vecchi**: gruppo Foto, sotto-tipo Screenshot, `lastModified` > 2 anni fa
2. **Duplicati per nome+dimensione**: file con stesso `name` E stesso `size`. Per ogni cluster, mantieni il più recente come "Tenere" e marca gli altri come "Cestinare".
3. **File giganti**: `size` > 500 MB. Non li pre-marca aggressivo come trash, ma li evidenzia con un "controlla se ti serve ancora" (status pre-marcato: nessuno, solo flagged).
4. **File "untitled"**: nome matcha `/^(untitled|senza titolo|nuovo documento|new document)( ?\(\d+\))?\.?\w*$/i`

Tutte le regole sono **opt-in disattivabili** dal pannello suggerimenti.

### 7. Bulk actions

Per gruppo intero ("Cestina tutti i 423 screenshot vecchi"): un click.
Per selezione multipla dentro un gruppo: checkbox a sinistra di ogni file, poi tre bottoni "Tenere / Archiviare / Cestinare" sopra la lista.
"Seleziona tutti i visibili" rispetta i filtri attivi (es. solo i file > 10MB selezionati).

### 8. Persistenza e performance

- Tutti i risultati della scansione stanno in memoria (Map già usata in v1.4 `cleanupFileRegistry`). Non serializzare su localStorage.
- Per cartelle grandi (5000+ file), usa rendering virtualizzato: mostra max 100 item visibili, "Carica altri 100" in fondo. Stesso pattern già usato dalla galleria flottante.
- Calcolo dei suggerimenti: fatto al termine della scansione, una volta sola. Risultati in memoria.
- Toggle "Vista lista" / "Dashboard a gruppi" salvato in localStorage (preferenza utente).

### 9. Internazionalizzazione

Tutte le nuove stringhe vanno in i18n (IT + EN), seguendo il pattern esistente nelle costanti `TRANSLATIONS`.

### 10. Service Worker

Bump cache version a `triagehub-v1.5.0`.

### 11. CHANGELOG e README

Aggiorna entrambi con la sezione v1.5. Stile coerente con le entry precedenti (markdown, emoji, esempi concreti, niente marketing-speak).

## Vincoli tecnici

- **Vanilla JS, no framework, no build step**. Tutto in `index.html` come ora.
- **Niente librerie aggiuntive** se possibile. Se necessarie, bundle locale come SheetJS/JSZip e licensia MIT/Apache compatibile.
- **Compatibilità**: la dashboard deve funzionare su Chrome/Edge desktop (con file reali) e mostrare lo stesso layout su Safari/iPhone (con file caricati via picker — niente azione su disco lì, solo ZIP).
- **Privacy invariata**: zero server, zero analytics, tutto offline.

## Definition of done

1. `git status` pulito dopo i commit
2. App funziona offline: ricarica con DevTools "Offline" mode, deve continuare a girare
3. Test end-to-end manuale:
   - Apro una cartella con 100+ file, alcuni screenshot vecchi, alcuni duplicati
   - Vedo dashboard con gruppi corretti
   - Vedo suggerimenti coerenti
   - Esploro gruppo Foto, applico filtro "+2 anni", seleziono tutti i visibili, marco Cestinare
   - Torno alla dashboard, applico al disco
   - I file sono effettivamente cancellati / spostati / inclusi nello ZIP
4. CHANGELOG.md e README.md aggiornati con la sezione v1.5
5. Commit con messaggio descrittivo, push su origin/main
6. Verifica che GitHub Pages serva la nuova versione (potrebbe richiedere 1-2 minuti)

## Come iniziare

Dentro la cartella `~/Desktop/TriageHub`:

1. Leggi `index.html`, `CHANGELOG.md`, `README.md` per capire l'architettura attuale (v1.4)
2. Leggi questo brief
3. Proponi un piano di modifica in step (es. "Step 1: scansione ricorsiva. Step 2: raggruppamento. Step 3: dashboard. Step 4: suggerimenti. Step 5: filtri. Step 6: i18n + docs.")
4. Procedi step by step, mostrando le diff e chiedendo conferma sui punti dubbi
5. Alla fine, commit + push

Buon lavoro.
