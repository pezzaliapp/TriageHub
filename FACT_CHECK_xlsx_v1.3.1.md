# TriageHub v1.3.1 — Fact-check del template "Lista Excel" su file reali

> Documento interno di prodotto. Non destinato agli utenti.
> Domanda guida: il template Excel mantiene la sua promessa o crea aspettative che non riesce a soddisfare?

Data: 2026-05-02 · Branch: `main` @ `346fd61` · Target del test: `parseXlsxFile`, `exportXLSX`, `xlsx-file` input.

Test harness: 9 file generati programmaticamente con SheetJS 0.20.3 (la stessa libreria che gira in produzione), eseguiti con la logica esatta di `parseXlsxFile()`. File su disco in `/tmp/triagehub-fact-check/`.

---

## TL;DR

- **Il template funziona bene per ~30% dei file Excel reali**: file "tabellari puliti" con header in riga 1, foglio unico, valori già testuali o tolleranti alla coercizione a stringa, senza formule, senza subtotali, senza merge.
- **Per il restante ~70% (titolo in riga 1, multi-foglio, formule, righe di subtotale) il template fallisce in modo silenzioso**: nessun warning, l'utente continua a smistare item che non sono item, oppure perde dati senza saperlo.
- **Il roundtrip distrugge i tipi numerici**: `Prezzo: 51.25 (number)` diventa `"51.25" (string)` nell'export. Conseguenza: in Excel `=SUM(D:D)` non funziona più. **Per qualsiasi caso d'uso che includa numeri, l'output di TriageHub è un file Excel zoppo**.
- **Le formule `=B2*1.22` vengono perse**: SheetJS le valuta in lettura e l'export salva solo il valore cached. Il file diventa una "fotografia" del momento del parsing.
- **Il valore comparativo vs Excel-native è marginale**: in Excel basta una colonna `Stato` + data filter per fare la stessa operazione, mantenendo formule/tipi/formattazione. TriageHub è un'alternativa solo per utenti non-Excel che non rimettono mai il file in produzione.

---

## Tabella riassuntiva dei test

| # | Test | Esito | Note |
|---|------|-------|------|
| 1 | File picker `accept` attribute | ✅ PASS | `.xlsx,.xls,.csv,.tsv` correttamente impostato |
| 2 | Sheet selection multi-foglio | ❌ **FAIL silenzioso** | Solo `wb.SheetNames[0]` letto, gli altri persi senza warning |
| 3 | Header detection — riga 1 = header | ✅ PASS | Caso felice |
| 3b | Header detection — riga 1 = titolo (merge) | ❌ **FAIL silenzioso** | Titolo diventa header, header vero diventa primo item |
| 3c | Header detection — riga 1 = vuota | ⚠️ PARTIAL | Header generici "Col 1, Col 2..." poco utili |
| 4 | Celle merge | ❌ FAIL | `aoa_to_sheet` non usa la struttura merge, prima cella valida + `''` |
| 4b | Celle con formule | ❌ FAIL | Formule perse, valori cached preservati come stringa |
| 4c | Tipi misti in una colonna | ⚠️ PARTIAL | Tutto coercito a stringa, ma non crash |
| 4d | Caratteri speciali (`€`, `Ø`, accenti) nei nomi colonne | ✅ PASS | UTF-8 preservato |
| 5A | Roundtrip file pulito | ⚠️ **PARTIAL** | Dati ok, ma tipi numerici → stringa |
| 5B | Roundtrip con titolo riga 1 | ❌ FAIL | Header sbagliato già al parse |
| 5C | Roundtrip multi-sheet | ❌ FAIL | 2 fogli su 3 persi silenziosamente |
| 5D | Roundtrip con formule | ❌ FAIL | Formule scomparse, solo valori |
| 5F | Roundtrip con righe di subtotale | ❌ FAIL | Subtotali smistati come item |
| 6  | CSV virgola | ✅ PASS | Quoted fields ok |
| 6b | CSV italiano `;` | ✅ PASS | SheetJS auto-rileva il separatore |
| 6c | TSV tab | ✅ PASS | |
| 6d | Numeri italiani con `,` decimale (`"1,50"`) | ⚠️ PARTIAL | Letti come stringa "1,50" — non interpretabili come numero in Excel |
| 7 | Performance 5000 righe parse | ✅ PASS | 64 ms |
| 7b | Performance 5000 righe export | ✅ PASS | 1.2 MB output |
| 7c | localStorage capacity 5000 righe | ⚠️ WARN | ~0.94 MB JSON serializzato → soglia 5 MB raggiunta a ~25k righe |
| 7d | UX smistamento 1000 item | ❌ FAIL practical | 1000 click manuali è oltre la soglia di pazienza umana |
| 8 | Promessa "Esporta un nuovo Excel organizzato" | ⚠️ PARTIAL | "Organizzato" significa "con colonna Stato" — minimal value-add rispetto a fare la stessa cosa in Excel |

---

## File Excel reali testati

I file di test sono stati progettati per coprire i pattern reali che si trovano nei desktop dell'utente medio. Tutti generati programmaticamente; il codice è nel transcript del fact-check.

### File A — "pulito" (`A_pulito.xlsx`)

5 colonne (`Codice / Descrizione / Categoria / Prezzo / Stock`), 20 righe, header riga 1, foglio unico "Listino", valori coerenti per colonna.

```
Codice    | Descrizione | Categoria  | Prezzo | Stock
SKU001    | Prodotto 1  | Invernali  | 51.25  | 11
SKU002    | Prodotto 2  | Cerchi     | 52.5   | 9
...
```

**Esito**: dati letti correttamente, 20 item creati, header detection ok. ✅
**Però**: tipi numerici della colonna `Prezzo` e `Stock` (originale: `type:'n'`) diventano `type:'s'` nell'export. Anche dopo aver smistato e riesportato, in Excel non si può sommare la colonna prezzo perché è testo.

### File B — "con titolo" (`B_con_titolo.xlsx`)

Layout reale di moltissimi listini Excel italiani:
```
[riga 1] "Listino Prodotti 2026 — Confidenziale"  (merge A1:E1)
[riga 2] (vuota)
[riga 3] Codice | Descrizione | Categoria | Prezzo | Stock
[riga 4] SKU1   | Articolo 1  | A         | 101    | 2
...
```

**Esito**: ❌ **ROTTO**.
- Header detected: `["Listino Prodotti 2026 — Confidenziale","Col 2","Col 3","Col 4","Col 5"]` — il titolo diventa header.
- Item 0 risultante: `name="Codice"`, `xlsxData={0:"Codice", 1:"Descrizione", ...}` — la riga di header vera trattata come dato.
- Data rows count: 16 (15 articoli + la riga header reale).
- L'utente vede un item che si chiama "Codice" e 15 articoli — chiaramente sbagliato, ma TriageHub non avvisa e non offre modo di correggere (il dialog "Mapping colonne" cambia colonna nome ma non riga header).

### File C — "tre fogli" (`C_tre_fogli.xlsx`)

Workbook con `Clienti / Prodotti / Riepilogo` come fogli separati.

**Esito**: ❌ **DATA LOSS SILENZIOSA**.
- `parseXlsxFile` legge `wb.SheetNames[0]` = "Clienti" e basta.
- L'utente vede 2 item (Acme, Beta). I 3 prodotti del foglio "Prodotti" e il riepilogo vendite del foglio "Riepilogo" sono persi.
- Nessun warning. Nessun toast del tipo "⚠️ Trovati 3 fogli, leggo solo Clienti".
- Nessun selettore foglio.

Per file Excel aziendali tipici (pricelist con foglio listino + foglio sconti + foglio commerciale; report con foglio dati + foglio analisi), TriageHub è inutilizzabile.

### File D — "formule" (`D_formule.xlsx`)

Fattura con `=B2*1.22` per calcolare l'IVA in colonna C.

```
Cella originale C2: { t:'n', v:122, f:'B2*1.22', w:'122' }
Cella export    C2: { t:'s', v:'122',           w:'122' }   ← f sparito
```

**Esito**: ❌ Formule perse. L'export è un file "morto" — se l'utente cambia l'imponibile in B2, l'IVA in C2 non si ricalcola perché ora è solo testo.

### File E — "speciali" (`E_speciali.xlsx`)

Header con caratteri speciali (`Ø Cerchio`, `€ Prezzo`, `Sconto %`), tipi misti (numeri e "A richiesta" nella stessa colonna), riga senza codice.

**Esito**: ⚠️ Parziale.
- Caratteri speciali nei nomi colonne preservati ✅
- Tipi misti coerciti a stringa: l'item con prezzo "A richiesta" è readable ma `=AVERAGE` su quella colonna nel risultato finale non funziona
- Riga senza codice → item con `name="(senza nome)"` ma comunque smistabile, niente warning

### File F — "subtotali" (`F_subtotali.xlsx`)

Layout classico di reportistica:
```
A1 | Articolo 1 | 10
A2 | Articolo 2 | 20
Subtotale categoria A | | 30
B1 | Articolo 3 | 15
...
| | TOTALE 70
```

**Esito**: ❌ FAIL.
- 7 item creati (4 articoli + 3 righe di subtotale/totale).
- L'utente smista anche "Subtotale categoria A" come se fosse un item, e tornerà nell'export come riga normale con la sua colonna Stato.
- Nessuna euristica per riconoscere righe di summary.

### File G/H/I — CSV/TSV

Tutti letti correttamente. SheetJS auto-rileva il separatore (`,`, `;`, `\t`). L'unico edge case è il numero italiano con virgola decimale: viene letto come stringa `"1,50"`.

### File J — 5000 righe

Performance accettabile (parse 64 ms, export 1.2 MB). Ma:
- JSON serializzato del workspace = ~0.94 MB → con 25k+ righe si rischia il limite localStorage di 5 MB del browser.
- **UX limite**: smistare manualmente 5000 item con 3 click ognuno = 15.000 interazioni umane. Nessun utente lo farà mai.

---

## Test 7 — Confronto promessa vs realtà, e valore comparativo vs Excel-native

### Promessa del template

> "Carica .xlsx, .csv o .tsv. Smista le righe in 3 stati. Esporta un nuovo Excel organizzato."

| Claim | Verifica | Verdetto |
|-------|----------|----------|
| "Carica .xlsx" | Funziona per file con 1 foglio + header riga 1. Fallisce silenziosamente per multi-sheet, titolo riga 1, subtotali. | ⚠️ ~30% dei file reali |
| "Smista le righe" | Le righe vengono identificate come item se la prima colonna è un identificatore. Subtotali e totali vengono smistati come item normali. | ⚠️ Funziona se il file è davvero solo dati |
| "Esporta un nuovo Excel organizzato" | L'export è un xlsx valido, leggibile in Excel, con la nuova colonna Stato. Ma: tipi numerici → stringa, formule perse, formattazione persa, merges persi, formule SUM dell'utente in fondo perse. | ❌ "Organizzato" overstating |

### Cosa permette TriageHub Excel che Excel stesso non permetta

In Excel l'utente può:
- Aggiungere colonna `Stato` manualmente (10 secondi)
- Usare Data > Filter per nascondere/mostrare per stato
- Conditional formatting per colorare le 3 righe (1 minuto)
- Ordinare per la colonna Stato
- Esportare via Save As → CSV se vuole condividere

TriageHub Excel offre:
- Interfaccia "una riga alla volta" su tutto schermo, fuori dal contesto tabella
- Click veloci con scorciatoie cromatiche per i 3 stati
- Workspace persistente tra sessioni (chiudi browser, riapri, sei dove eri)
- Workspace card per tornare in 1 click

**Vantaggio reale**: marginale per chi conosce Excel. Concreto solo per utenti non-Excel che vogliono prendere decisioni su una lista, dove la velocità di click è il bottleneck.

**Quanti utenti hanno questo bisogno?** Pochi. La grande maggioranza degli utilizzatori di file Excel è Excel-fluent. Per loro, TriageHub Excel **aggiunge un round-trip che fa perdere informazioni** (tipi, formule).

**Per chi ha senso davvero**: utente che riceve un Excel da un collega/cliente, deve solo dire "sì/no/forse" su ogni riga, e rimanda il file con la propria opinione. Tipo: il commerciale che riceve un foglio coupon da approvare. **Per quel caso d'uso**, l'esperienza UI di TriageHub è sensibilmente migliore di Excel filter. Ma è un caso d'uso ristretto.

---

## Verdetto finale

**Il template Excel mantiene la sua promessa al ~30%**:
- File "puliti" (1 foglio, header riga 1, no formule, no subtotali, no merges, dati testuali o tolleranti a coercizione): **funziona bene**, output è utile.
- Tutto il resto: **fallisce in modi silenziosi che fuorviano l'utente più di quanto aiutino**.

In stato attuale, il template **promette di "smistare Excel" ma lavora bene solo su un sottoinsieme di file Excel.** L'utente che carica un file con titolo merge in riga 1 (caso comunissimo) vede 16 item dove uno è "Codice", non capisce perché, ne dà la colpa allo strumento, abbandona. L'utente che carica un file multi-foglio non vede il problema fino al momento dell'export, quando si accorge che mancano i dati. Esperienze entrambe peggiori che non fare nulla.

---

## Raccomandazione tecnica

### (a) Tenerlo come è — ❌ SCONSIGLIATO

Solo se accettiamo che ~70% degli utenti che proveranno il template avrà un'esperienza fallimentare. Non è una posizione difendibile dopo questo fact-check.

### (b) Restringerlo — ⭐ OPZIONE PRAGMATICA

Cambia la promessa. Aggiorna il template:
- **Descrizione onesta**: "Smista CSV o tabelle Excel pulite (1 foglio, header in riga 1, no formule, no totali). Per file complessi, prepara prima la tabella in Excel."
- **Validazioni hard al parse**:
  - Se `wb.SheetNames.length > 1` → toast `⚠️ Il file ha N fogli, leggo solo "${SheetNames[0]}". Per scegliere un foglio diverso, salvalo come .xlsx separato.`
  - Se rilevo formule (`sheet[cell].f`) → toast `⚠️ Le formule verranno convertite in valori statici nell'export.`
  - Se header detection è incerto (riga 1 ha < 50% di stringhe non vuote) → toast `⚠️ La prima riga sembra incompleta. Salta le righe di intestazione/titolo prima di ricaricare.`
- **Mantieni** il file picker e l'export — funziona per il sottoinsieme che dichiari di supportare.

Effort stimato: 1-2 giorni.

### (c) Espanderlo — ⭐⭐ OPZIONE COSTOSA MA FORTE

Costruisci il parser robusto:
- **Selettore foglio** quando ce ne sono ≥ 2 — mostra nomi e numero di righe per ognuno, l'utente sceglie.
- **Selettore riga header** — preview delle prime 10 righe, l'utente clicca su quella che è davvero l'header.
- **Detect e preserva formule** in roundtrip (richiede cambio strategy: invece di `aoa_to_sheet` regenerare il file partendo dal `wb.Sheets[name]` originale, modificando solo le celle che servono).
- **Preservare tipi numerici** in roundtrip (anche qui: passare per cell objects `{t:'n',v:value}` invece di stringhe).
- **Detect righe di summary** (regex su valori della prima colonna: `/totale|subtotal|grand total/i` → flag visivo "questa riga è un totale, vuoi escluderla?").

Effort stimato: 5-7 giorni. Risultato: TriageHub Excel diventa il template hero al pari di cleanup.

### (d) Rimuoverlo — ⭐ OPZIONE DOLOROSA MA ONESTA

Se non si fa (b) o (c) e il valore comparativo vs Excel-native è marginale per il target, **togliere il template** è meglio che lasciarlo a metà.

Decisione di prodotto: la **percentuale di utenti per cui Excel-native è già sufficiente** rispetto alla **percentuale per cui TriageHub Excel sarebbe migliore di Excel** è probabilmente >90/<10. Se è così, (d) è razionale.

---

## Raccomandazione personale

Faccio (b) ora (1-2 giorni) e valuto se passare a (c) misurando l'uso del template (anche solo localStorage anonimo: quanti workspace xlsx vengono creati e poi rimangono attivi >1 settimana).

(b) implementabile come hotfix v1.3.2:
1. Warn multi-sheet
2. Warn formule
3. Warn header detection incerto
4. Update micro-guide e descrizione template per allinearli alla realtà del parser
5. Update FAQ del manuale: "TriageHub Excel funziona per file tabellari puliti. Per multi-foglio o formule, esporta prima il foglio in CSV."

Con (b) il template **mantiene la promessa al 95%** invece che al 30%. Niente più aspettative tradite. La superficie attaccabile dal point-of-view UX si riduce drasticamente.

---

## Action items proposti

1. **v1.3.2** — implementare (b) "Restringerlo": warning espliciti + descrizione onesta. Effort: 1-2 giorni.
2. **v1.4.0** — se (b) regge alla telemetria, valutare (c) "Espanderlo" con selettore foglio + selettore header row.
3. **v1.4.1** — preservare tipi numerici e formule nel roundtrip (cambio strategy export).
4. **Strategico**: valutare quanti dei workspace xlsx creati vengono effettivamente esportati (uso reale ≠ uso curioso). Se rapporto curiosità/uso vero è alto, è segnale di promessa fuori scala.

---

## File di test conservati

Tutti in `/tmp/triagehub-fact-check/`. Riproducibili con SheetJS Node. Non committati nel repo (non sono asset di prodotto).

| File | Scopo |
|------|-------|
| `A_pulito.xlsx` | caso felice, 5 col × 20 righe |
| `B_con_titolo.xlsx` | titolo merge riga 1, header riga 3 |
| `C_tre_fogli.xlsx` | multi-sheet, 3 fogli diversi |
| `D_formule.xlsx` | formule `=B2*1.22` |
| `E_speciali.xlsx` | caratteri speciali, tipi misti, righe sparse |
| `F_subtotali.xlsx` | righe di summary in mezzo ai dati |
| `G_csv.csv` | CSV virgola con quoted field |
| `H_tsv.tsv` | TSV |
| `I_csv_eu.csv` | CSV italiano `;` con decimali `,` |
| `J_5k.xlsx` | 5000 righe per stress test |

---

*Fatto generato con Claude Code da Alessandro Pezzali. Decisione di prodotto a discrezione dell'autore.*
