Calculadora de Despeses de Viatge
Configura un entorn TypeScript per crear un sistema que gestioni despeses de viatges. Calcula l'estat del pressupost i genera informes de despeses diàries.

Objectiu
» Crear un projecte TypeScript des de zero.
» Implementar tipus, interfícies i unions.
» Gestionar errors de compilació.
» Utilitzar ESM (mòduls) amb tipat.
Passos a seguir
Configuració de TypeScript
Instal·la TypeScript globalment
npm install -g typescript
Inicialitza el projecte
» Crea un projecte amb Vite anomenat travel-expenses de tipus Vanilla Typescript:
npm create vite@latest
» Segueix l'instruccions d'instal·lació
Estructura inicial del projecte
» Esborra tots els fitxers que no apareguin a la següent estructura:
travel-expenses/
├── public/
├── src/
│   ├── main.ts
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
└── tsconfig.json
» Esborra el contingut del fitxers main.ts
» initialitza git i fes commit d'aquesta primera versió.
Iteració 1: Pressupost de Viatge
Crea una branca a git: feature/budget-calculator-impl
Canvia a la nova branca i crea el fitxer src/budgetCalculator.ts
Crea una funció calculateBudgetStatus que:
» Rebi dos paràmetres: totalExpenses (despeses totals) i budget (pressupost inicial)
» Retorni un missatge segons el percentatge de despeses:
<80%: "Sota pressupost ✈️"
80%-100%: "Dins pressupost ✅"
100%: "Sobre pressupost ⚠️"
Exemple:

 console.log(calculateBudgetStatus(850, 1000)) // "Dins pressupost ✅"
    
» Fes les proves amb:
npx vite-node src/budgetCalculator.ts
Estableix els següents criteris de tipats:

» Defineix un tipus unió per als missatges
» Firma la funció amb un tipus de retorn
Quan tinguis finalitzat l'exercici fes un merge a la branca main del repositori.

Iteració 2: Rastrejador de Despeses
Crea una branca a git: feature/expense-tracker-impl
Canvia a la nova branca i crea el fitxer src/expenseTracker.ts
Crea una funció generateExpenseReport que:
» Rebi dos paràmetres:
dailyExpenses: array de despeses diàries (ex: [50, 0, 120])
dailyBudget: pressupost diari ideal
» Retorni un objecte amb:
travelDays: dies totals del viatge
expenseDays: dies amb despesa >0
dailyBudget: pressupost rebut
averageDailyExpense: mitjana de despesa diària
underBudget: true si mitjana <= pressupost
rating: valoració (1, 2 o 3)
feedback: missatge descriptiu
» Criteris de valoració:
Mitjana <= pressupost → "Excel·lent gestió!"
Mitjana <= pressupost * 1.2 → "Correcte, però ajustat"
Altres casos → "Pot millorar"
Exemple:
console.log(generateExpenseReport([50, 0, 120, 85], 100))
    
/* Retorna:
{
travelDays: 4,
expenseDays: 3,
dailyBudget: 100,
averageDailyExpense: 63.75,
underBudget: true,
rating: 3,
feedback: "Excel·lent gestió!"
}
*/
    
  
» Fes les proves amb:
   npx vite-node src/expenseTracker.ts
  
Estableix els següents criteris de tipats:

» Defineix una interfície per a l'informe amb el nom ExpenseReport
» Firma el tipus de retorn de la funció
» Introdueix control d'errors: "Les despeses no poden ser negatives"
Quan tinguis finalitzat l'exercici fes un merge a la branca main del repositori.

 Consells:

Control d'errors:

» A generateExpenseReport, gestiona valors negatius amb throw new Error()
» Utilitza some() per verificar despeses vàlides
Tipat avançat:

» Usa type per a valors fixos (BudgetStatus)
» Usa interface per a objectes estructurats (ExpenseReport)
» Defineix rating com a unió de literals: 1 | 2 | 3
Càlculs:

» Per a averageDailyExpense: suma total / nombre de dies
» Per a expenseDays: filtra valors >0 amb .filter()
Iteració 3: Interfície de la calculadora (BONUS-TRACK)
Crear la interfície per a les dues calculadores utilitzant el DOM, mantenint la lògica de càlcul completament separada.

Utilitza una nova branca feature/ui-implementation

Consells:

Separació de responsabilitats:

» budgetCalculator.ts i expenseTracker.ts: Contenen només lògica de negoci
» main.ts: Gestiona el DOM i interaccions d'usuari
Tipat en el DOM:

// Asercions de tipus per elements del DOM
const input = document.getElementById('my-input');
  
Gestió d'errors:

try {
// Codi que pot fallar
} catch (error) {
if (error instanceof Error) {
   // Gestió estructurada d'errors
}
}
    
  
Validació d'entrada:

// Abans de processar dades
if (dailyExpenses.some(isNaN)) {
throw new Error("Les despeses contenen valors no numèrics");
}
  
Exportació de tipus:

// Exporta interfícies per a ús en altres mòduls
export interface ExpenseReport { ... }
  
Executa l'aplicació amb npm run vite

Flux de prova:

» Introduir valors vàlids i invàlids a les calculadores
» Verificar missatges d'error
» Comprovar renderització d'informes
» Validar comportament en cas de dades buides