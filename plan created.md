## Resum de l'arquitectura i flux de l'aplicació

L'aplicació **Travel Expense Calculator** segueix una arquitectura de **separació de responsabilitats** en 3 capes:

```
index.html  ───→  style.css   (presentació)
    │
    └──────→  main.ts  ──→  budgetCalculator.ts    (lògica de negoci)
                            expenseTracker.ts
```

---

## 1️⃣ index.html — L'estructura (el "esquelet")

L'HTML defineix **tres seccions principals** dins de `<main>`:

### Secció 1: Banner
```html
<section class="banner">
  <h1>Travel Expense Calculator</h1>
</section>
```
Només visual. El CSS li dona el gradient lila-blau.

### Secció 2: Calculadora de pressupost (`.grid-container`)
Dues columnes:
- **Columna esquerra**: inputs `#totExpenses` + `#budget` + botó `#calculateBudget`
- **Columna dreta**: `#response` — aquí es mostra el resultat (ex: "Sota pressupost ✈️")

### Secció 3: Rastrejador de despeses (`.grid-container-expenses`)
Dues columnes:
- **Columna esquerra (introducció)**: input `#expense-amount` + botó `#add-expense` per afegir despeses individuals + input `#daily-budget` + botó `#generate-report` per generar l'informe
- **Columna dreta (visualització)**: `#expenses-list` (llista de despeses) + `#expenses-response` (targeta amb l'informe complet)

**Punts clau de connexió HTML ↔ TypeScript:**
- Els `id` dels elements HTML (`#response`, `#expense-amount`, `#add-expense`, etc.) són els **selectors que `main.ts` utilitza** amb `document.getElementById()`.
- El `<script type="module" src="/src/main.ts">` carrega el TypeScript.

---

## 2️⃣ style.css — La presentació (el "vestit")

Defineix **estils graduals**:

| Secció CSS | Què estilitza |
|------------|---------------|
| Variables CSS (`:root`) | Colors, ombres, radius — reutilitzats a tot el projecte |
| `.banner` | Gradient de fons, text centrat |
| `main` | Ample màxim 960px, centrat amb `margin: 0 auto` |
| `.grid-container` | Grid de 2 columnes per la calculadora de pressupost |
| `input[type="number"]`, `button` | Estils globals per tots els inputs i botons |
| `#response` | Caixa on es mostra el resultat del pressupost |
| `.grid-container-expenses` | Grid de 2 columnes per la secció d'expenses |
| `#expenses-list li` | Elements de llista amb barra lateral blava |
| `.report-card` | Targeta d'informe amb colors segons `rating-1/2/3` |
| `@media (max-width: 640px)` | Responsive: les columnes passen a 1 |

**Exemple de connexió CSS ↔ TypeScript:**
Quan `main.ts` fa `displayReport(report)`, genera HTML amb classe dinàmica:
```html
<div class="report-card rating-3">...</div>
```
El CSS aplica el color verd (`--success`) gràcies a `.report-card.rating-3 { border-color: var(--success); background: #e6fcf5; }`

---

## 3️⃣ Els fitxers TypeScript — La lògica (el "cervell")

### budgetCalculator.ts → Lògica pura
```typescript
export type BudgetStatus = "Sota pressupost ✈️" | "Dins pressupost ✅" | "Sobre pressupost ⚠️";

export function calculateBudgetStatus(totalExpenses: number, budget: number): BudgetStatus
```
- **Entrada**: total despeses + pressupost
- **Càlcul**: `ratio = totalExpenses / budget`
- **Sortida**: un dels 3 missatges (`BudgetStatus`)
- **No toca el DOM** — és lògica de negoci pura, testejable de forma aïllada

### expenseTracker.ts → Lògica pura
```typescript
export interface ExpenseReport {
  travelDays: number;
  expenseDays: number;
  dailyBudget: number;
  averageDailyExpense: number;
  underBudget: boolean;
  rating: 1 | 2 | 3;
  feedback: string;
}

export function generateExpenseReport(dailyExpenses: number[], dailyBudget: number): ExpenseReport
```
- **Entrada**: array de despeses diàries + pressupost diari
- **Càlculs**: 
  - `averageDailyExpense = suma total / nombre de dies`
  - `expenseDays = dies amb despesa > 0`
  - `rating = 3` (mitjana ≤ pressupost), `2` (≤ pressupost×1.2), `1` (supera)
- **Sortida**: objecte `ExpenseReport` complet
- **Control d'errors**: `throw new Error("Expenses cannot be negative")` si hi ha valors negatius
- **No toca el DOM**

### main.ts → El controlador (pont entre DOM i lògica)

**Funció** | **Què fa** | **Connexió**
---|---|---
`calcBudget()` | Llegeix `#totExpenses` i `#budget`, crida `calculateBudgetStatus()`, mostra resultat a `#response` | HTML ↔ budgetCalculator
`addExpense()` | Llegeix `#expense-amount`, valida, afegeix a `myExpenses: number[]`, crida `renderExpensesList()` | HTML → array TS
`renderExpensesList()` | Recorre `myExpenses` i crea elements `<li>` dins `#expenses-list` | array TS → HTML
`handleGenerateReport()` | Valida que hi hagi despeses i pressupost, crida `generateExpenseReport()`, passa resultat a `displayReport()` | HTML → expenseTracker
`displayReport(report)` | Genera HTML dinàmic amb les dades de l'`ExpenseReport` i l'insereix a `#expenses-response` | expenseTracker → HTML

---

## 🔄 Flux complet pas a pas

### Flux A — Afegir una despesa
```
1. L'usuari escriu "50" a #expense-amount
2. Clica "Add expense"
3. main.ts: addExpense()
   └─ valida: parseFloat("50") = 50, > 0 ✅
   └─ myExpenses.push(50)   → array = [50]
   └─ renderExpensesList()
4. main.ts: renderExpensesList()
   └─ crea <li>Day 1: $50.00</li>
   └─ l'insereix a #expenses-list
5. CSS: el <li> es mostra amb fons gris clar i barra blava a l'esquerra
```

### Flux B — Generar l'informe
```
1. L'usuari ha afegit [50, 0, 120, 85]
2. Escriu "100" a #daily-budget
3. Clica "Generate report"
4. main.ts: handleGenerateReport()
   └─ valida: myExpenses.length > 0 ✅, dailyBudget = 100 ✅
   └─ crida generateExpenseReport([50, 0, 120, 85], 100)
5. expenseTracker.ts:
   └─ travelDays = 4
   └─ expenseDays = 3 (50, 120, 85 — el 0 no compta)
   └─ averageDailyExpense = (50+0+120+85)/4 = 63.75
   └─ 63.75 <= 100 → underBudget = true, rating = 3
   └─ retorna ExpenseReport
6. main.ts: displayReport(report)
   └─ genera HTML amb classe "report-card rating-3"
   └─ l'insereix a #expenses-response
7. CSS: .report-card.rating-3 aplica fons verd clar i borda verda
```

### Flux C — Calcular pressupost global
```
1. L'usuari escriu "255" a #totExpenses, "1000" a #budget
2. Clica "Calculate budget"
3. main.ts: calcBudget()
   └─ crida calculateBudgetStatus(255, 1000)
4. budgetCalculator.ts:
   └─ ratio = 255/1000 = 0.255
   └─ 0.255 < 0.8 → retorna "Sota pressupost ✈️"
5. main.ts: mostra el text a #response
6. CSS: el text es mostra en verd (resultat positiu)
```

---

## 📌 Principis aplicats

| Principi | On s'aplica |
|----------|-------------|
| **Separació de responsabilitats** | `budgetCalculator.ts` i `expenseTracker.ts` = només lògica. `main.ts` = només DOM. |
| **Tipat fort** | `number[]`, `ExpenseReport`, `BudgetStatus`, `rating: 1 \| 2 \| 3` |
| **Control d'errors** | `try/catch` a `handleGenerateReport()`, validacions d'input a cada funció |
| **DOM segur** | Totes les referències al DOM fan servir `if (element)` abans d'accedir-hi, mai `!` |
| **CSS modular** | Variables CSS per consistència, classes semàntiques, transitions suaus |