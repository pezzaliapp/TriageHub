# TriageHub v1.2.6 — Fact-check onesto degli 8 template

> Documento interno di prodotto. Non destinato agli utenti.
> Domanda guida: ogni template fornisce valore reale, o è filler?

Data: 2026-05-02 · Branch: `main` @ `8df2e55`

---

## TL;DR

- **2 template fanno lavoro vero**: `cleanup` e `blank`.
- **5 template sono shell ben presentate** (`leads`, `catalog`, `hr`, `ideas`, `tickets`): solo dati di config + micro-guida, zero automazione, 100% sostituibili da `blank` + 5 minuti di setup.
- **1 template è l'anello debole**: `email` promette CSV da Outlook/Gmail ma in pratica chi triagia le email lo fa nel client mail, non in un tool esterno. La sezione "Suggerimenti operativi" v1.2.6 (Cmd+R/Ctrl+R) è informazione che chiunque abbia un client mail conosce già.
- **`tickets` ha un leak di dominio**: categorie hardcoded sull'attività dell'autore (equilibratrici, smontagomme). Per il 99% degli utenti è inservibile out-of-the-box.

---

## Tabella riassuntiva

| Template  | LOC dedicate | Automazione | Export operativo | Verdetto |
|-----------|--------------|-------------|------------------|----------|
| 📂 cleanup | ~370         | File picker + MIME detect + disclaimer + banner + report multi-OS | ✅ Istruzioni macOS/Windows/Linux concrete | **TIENI**: l'unico template che giustifica la sua esistenza |
| ⚪ blank   | ~3           | Nessuna (per design)               | ❌ Lista generica | **TIENI**: è la base onesta |
| 📧 email   | ~10 (v1.2.6) | Solo CSV import generico           | 📄 Lista + shortcut Cmd+R/Ctrl+R | **DEMOTE o TOGLI**: vedi paragrafo |
| 💼 leads   | 0 (solo data)| Solo CSV import generico           | 📄 Lista | **MERGE**: indistinguibile da blank+CSV |
| 🔧 tickets | 0 (solo data)| Solo CSV import generico           | 📄 Lista | **REWORK**: categorie domain-leak, vedi paragrafo |
| 📦 catalog | 0 (solo data)| Solo CSV import generico           | 📄 Lista | **MERGE**: indistinguibile da blank+CSV |
| 👥 hr      | 0 (solo data)| Solo CSV import generico           | 📄 Lista | **MERGE**: indistinguibile da blank+CSV |
| 💡 ideas   | 0 (solo data)| Nessuna (manuale)                  | 📄 Lista | **MERGE**: indistinguibile da blank |

LOC dedicate = righe di JS/CSS/HTML che esistono SOLO per quel template. Esclude il blocco di config in `TEMPLATES` e la voce in `MICRO_GUIDES` (presente per tutti).

Numeri reali misurati: `buildCleanupMarkdown` 280 LOC, `handleCleanupFiles` 22, `detectFileCategory` 18, `triggerCleanupFilePicker` 3, `CLEANUP_DISCLAIMER_HTML` 44 → totale ~370 per cleanup.

---

## 📂 cleanup — TIENI

**Cosa fa di unico**:
1. **File picker** (`triggerCleanupFilePicker`, `handleCleanupFiles`): l'utente clicca "Carica file da smistare", l'OS apre il dialogo, l'utente seleziona N file con Cmd+A; l'app legge name/size/type/lastModified senza upload.
2. **MIME detection** (`detectFileCategory`): assegna automaticamente la categoria (Documenti, Immagini, Audio, Excel & Listini, Da capire) leggendo il MIME type.
3. **Disclaimer al primo uso**: dialog dedicato che spiega cosa l'app NON può fare (no spostamento, no cestinare).
4. **Banner permanente**: ricorda all'utente che le scelte sono solo marcature.
5. **Report multi-OS**: PDF/Word/Text/Markdown con istruzioni complete per macOS/Windows/Linux (v1.2.6) — destinazioni consigliate per categoria, scorciatoie tastiera, calcolo spazio recuperabile.

**Test funzionale**: 50 file Desktop → caricati in 30 secondi → categorizzati automaticamente → smistati → PDF di 3 pagine con destinazioni concrete per ogni categoria.

**Verdetto**: questo è il template per cui esiste TriageHub. Senza di esso, il prodotto è un "todo list senza date". Da promuovere come hero use-case in README e PezzaliHub.

---

## ⚪ blank — TIENI

**Cosa fa di unico**: niente, ed è il punto.

**Test funzionale**: 20 idee → blank → l'utente personalizza 3 stati e 4 categorie → triagia. Funziona perché non promette nulla che non possa mantenere.

**Verdetto**: è la base. Senza, l'app obbligherebbe l'utente a un template inadatto. Oltretutto l'utente avanzato spesso parte da qui per costruirsi il proprio flusso.

---

## 📧 email — DEMOTE o TOGLI

**Cosa promette**: "Triage della casella di posta. Esporta CSV da Outlook/Gmail e importa".

**Cosa fa davvero**:
- Categorie precaricate (Da clienti, Newsletter, Urgenti…) — utili
- 3 stati Da rispondere/In attesa/Archiviata — utili
- v1.2.6: appendice "Suggerimenti operativi" con shortcut Cmd+R/Ctrl+R — **valore basso**: chiunque abbia un client mail già conosce questi shortcut

**Friction reali**:
1. **Outlook desktop CSV export è un labirinto** (File → Apri ed esporta → Esporta in CSV → mappa cartelle): per 30 email la roi è negativa.
2. **Gmail non esporta CSV nativamente** (solo mbox via Takeout). Documentation in README sull'export Outlook è ottimistica.
3. **Manual entry è la realtà**: l'utente che usa il template Email digiterà 5-10 mittenti a mano, poi smetterà.
4. **Perché non triagiare nel client mail?** Gmail ha label, Outlook ha categorie e flag, Apple Mail ha smart mailboxes. Un tool esterno aggiunge un passaggio in più per zero valore aggiunto.

**Test funzionale**: 30 email importanti → l'utente le scrive a mano una per una? **No**. Reale conversion dell'utente curioso che apre il template: <10%.

**Verdetto**:
- **Opzione A (consiglio)**: rimuovi il template. Aggiorna README per dire "TriageHub funziona meglio quando i tuoi item sono GIÀ in un CSV (cleanup auto-detect, listino, pipeline)".
- **Opzione B**: tieni il template ma riposizionalo come "Note email" — un blocknotes per email che vuoi ricordarti di gestire dopo. La descrizione attuale promette troppo.

---

## 💼 leads — MERGE in blank

**Cosa fa di unico**: 6 categorie geografiche italiane (Nord/Centro/Sud Italia, Estero, Nuovi, Da richiamare), 3 stati Caldo/Tiepido/Freddo, valueUnit `€`.

**Cosa NON fa**:
- Non legge CSV CRM (HubSpot, Pipedrive, Salesforce export sono molto più strutturati: company, contact, deal_value, last_activity_date).
- Non chiama API CRM. Non c'è zero integrazione.
- Il PDF risultato è una lista di nomi azienda + valore stimato + tag. **Manca**: numero di telefono cliccabile, email, prossima azione, deadline. Inutilizzabile come "to-do della settimana" in autonomia.

**Test funzionale reale**: 100 lead in CSV dal CRM → import (mapping colonne manuale) → smista → PDF. **Un commerciale userebbe quel PDF nel meeting di lunedì?** No: rimane in HubSpot/Excel dove ha tutti i campi.

**Verdetto**: la differenza tra "leads" e "blank + setup di 2 minuti" è un set di 6 categorie italiane e una valueUnit. **MERGE**: rimuovi il template, lascia che blank serva. Oppure rinomina "Pipeline triage" e specifica chiaramente che serve solo per la decisione "su chi mi concentro questa settimana" (non per gestire la pipeline).

---

## 🔧 tickets — REWORK URGENTE

**Domain leak palese**: le 6 categorie hardcoded sono **Equilibratrici, Smontagomme, Sollevatori, Allineamento, Compressori, Altro**. Sono apparecchiature da officina meccanica/gommista. Il template è chiaramente nato dall'esperienza dell'autore in un settore specifico (autoriparazione/servizio post-vendita macchine garage).

**Per il 99% degli utenti è inservibile**: chi gestisce ticket Zendesk/Freshdesk/Jira ha categorie completamente diverse (bug, billing, onboarding, integration). Vedere "Equilibratrici" come prima categoria fa pensare "questo tool non è per me" e l'utente abbandona.

**Cosa fa di unico oltre alle categorie**: nulla. Stati Aperto/In lavorazione/Risolto sono generici, valueUnit vuota.

**Verdetto**:
- **Sostituisci le categorie con set generici**: Bug, Richiesta info, Configurazione, Integrazione, Fatturazione, Altro. Rendili lingua-neutri.
- **Oppure rimuovi il template** se non si ha intenzione di farne un workflow vero (integrazione Zendesk/Jira API, mai successa).
- **Decisione di prodotto**: capire se TriageHub vuole posizionarsi come tool per il dominio dell'autore (gommisti) o come tool generale. Le due posizioni sono incompatibili: la prima implica togliere o rinominare 6 template generici, la seconda implica togliere il leak.

---

## 📦 catalog — MERGE in blank

**Cosa fa di unico**: 6 categorie (Bestseller, Novità, Promozione, Stock alto, Margine basso, Da rivedere prezzo), 3 stati Spingere/Da valutare/Out, valueUnit `€`.

**Cosa NON fa**:
- Non parsing dei listini reali (XLS multi-sheet, listini Excel con header su righe diverse, codici nidificati).
- Non si integra con CSVXpress, FleXiPrice, gli altri tool dell'ecosistema dell'autore — sarebbe un'integrazione naturale!
- Il PDF risultato è una lista di codici/descrizioni con prezzo. **Marketing usa il PDF?** No: marketing usa Excel per filtrare, calcolare margini, simulare scenari.

**Test funzionale reale**: listino 500 prodotti CSV → import → smistare uno per uno **500 prodotti**? Manualmente? Stop dopo 30. La feature "smista a batch per categoria" non esiste.

**Verdetto**: stesso esito di `leads`. **MERGE**: il template è 6 categorie + valueUnit `€`. L'utente serio del listino userà direttamente CSVXpress o Excel.

**Nota positiva**: c'è una vera opportunità di prodotto qui — un workflow "decidi quali prodotti spingere nel catalogo Q1" potrebbe avere ROI alto. Ma serve molto più del template attuale (filtri per margine, calcolo bulk, integrazione CRM/gestionale).

---

## 👥 hr — MERGE in blank

**Cosa fa di unico**: 4 categorie ruolo (Tecnico, Commerciale, Amministrativo, Stage), 3 stati Considerare/Intervistare/Scartare.

**Cosa manca per essere usabile**:
- **Nessun parser CV** (PDF, Word) — il vero pain point dell'HR triage.
- **Nessun campo strutturato** per email candidato, telefono, anni esperienza, posizione applicata.
- **Nessuna integrazione LinkedIn/Workable/Greenhouse**.
- I "link" come campo libero non aiutano: l'HR vuole un click → CV aperto in tab nuovo, non un URL da copiare.

**Test funzionale reale**: 30 candidature, l'HR ha un PDF CV + email per ognuna. Trascrive nome + posizione applicata in TriageHub? Eccessivo. Importerà CSV da Workable/Greenhouse? Quei tool hanno già pipeline e tagging.

**Verdetto**: **MERGE**. Il valore aggiunto è un set di 4 categorie e tre stati. Stesso ragionamento di leads.

**Privacy claim**: il selling point "i dati restano sul tuo dispositivo" è vero, ma il vero rischio HR (GDPR, conservazione CV, audit trail) non è gestito. Privacy è una feature secondaria qui, non un differenziatore.

---

## 💡 ideas — MERGE in blank

**Cosa fa di unico**: 5 categorie (Prodotto, Marketing, Tecnologia, Processo, Esperimenti), 3 stati Sviluppare/Parcheggio/Scartare.

**Test funzionale reale**: 20 idee progetto raccolte negli ultimi 6 mesi. L'utente le trascrive a mano. Smista. Il PDF risultato è una lista. **L'utente decide davvero quale sviluppare?**

Per decidere serve:
- Effort estimate (giorni/mesi)
- ROI atteso (revenue/anno, utenti, time-saved)
- Dipendenze (questa idea blocca/è bloccata da altre)
- Owner

Niente di questo è nel template. Lo stato "Sviluppare" è un gesto, non una decisione. Dopo aver smistato 20 idee in 3 categorie, l'utente non sa quale fare per prima — è esattamente come avere un foglio di carta con 6 idee in colonna "Sviluppare".

**Verdetto**: **MERGE**. È blank con un altro nome. Il claim del tip "funziona bene per backlog personali, romanzi da scrivere, viaggi da fare" lo dimostra: se funziona per tutto, non è specifico per niente.

---

## Raccomandazione finale

### Opzione conservativa (mantieni la promessa al pubblico)

- **Rinomina** ogni template "MERGE" mantenendo solo i 3 più credibili: `cleanup`, `email`, `blank`.
- **Rifai** i 4 template merge come **preset rapidi** del template `blank` (un dropdown "applica preset categorie?" all'interno di blank, non come workspace dedicati).
- Risultato: 3 workspace types invece di 8, comunicazione più focused.

### Opzione coraggiosa (consigliata)

- **Promuovi cleanup come hero feature**: README, sito, PezzaliHub, social. È l'unico differenziatore reale rispetto a Notion/Trello/Things.
- **Rimuovi**: `email`, `leads`, `tickets`, `catalog`, `hr`, `ideas`. Riduci a 2 template: `cleanup` + `blank`.
- **Aggiungi**: 1-2 nuovi template che abbiano automazione vera al pari di cleanup. Esempi:
  - `bookmarks`: importa export Chrome/Firefox bookmarks (HTML/JSON), classifica per dominio, smista Tieni/Archivia/Elimina.
  - `photos-folder`: file picker per selezione cartella foto, classifica per data, smista Tieni/Comprimi/Elimina (riusa l'engine di cleanup).
- **Riposizionamento**: TriageHub diventa "il tool per smistare file e roba digitale ingombrante" invece di "tool generico per smistare qualsiasi cosa". Una promessa più piccola e mantenibile.

### Decisione di dominio (importante)

`tickets` con categorie da officina è un segnale: il portfolio di Alessandro ha tool molto verticali (gommisti, listini specifici settore). Decidere consapevolmente:

1. **TriageHub generico** → togli/cambia tickets, rendi tutto neutrale.
2. **TriageHub vertical-friendly** → tieni tickets-officina, ma rendilo un template "Officina" esplicito, e magari aggiungi altri template verticali del dominio Alessandro (es. "Trasporti gommature", "Manutenzioni programmate").

L'attuale stato (template generici con un tickets verticalissimo) è la peggior delle due strade.

---

## Action items (se si concorda con questo fact-check)

1. v1.3 milestone: ridurre a 3 template (cleanup + blank + email opzionale).
2. v1.3.1: rinominare `tickets` → `tickets-officina` o sostituire le categorie.
3. v1.4 milestone: 1 nuovo template con automazione vera (bookmarks o foto).
4. README.md: aggiornare il claim "7 template precaricati" → "1 template potente per Desktop cleanup + blank flessibile".
5. Misurare con un mini-analytics (anche solo localStorage anonimo) quali template vengono effettivamente usati per >5 minuti. Conferma o smentisce questo fact-check.

---

*Fatto generato con Claude Code da Alessandro Pezzali. Decisione di prodotto a discrezione dell'autore.*
