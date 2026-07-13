import { calculateBudgetStatus } from "./budgetCalculator";
import { generateExpenseReport, type ExpenseReport } from "./expenseTracker";

// ============================================================
// Budget Calculator (ja existent, millorat)
// ============================================================
const responseElement = document.getElementById("response");
const calculateBudgetButton = document.getElementById("calculateBudget");

calculateBudgetButton?.addEventListener("click", calcBudget);

function calcBudget() {
  const myExpense = document.getElementById("totExpenses") as HTMLInputElement;
  const myBudget = document.getElementById("budget") as HTMLInputElement;

  // Verificar que els inputs tenen valor
  if (!myExpense.value || !myBudget.value) {
    if (responseElement) {
      responseElement.textContent = "Please enter a valid value for expenses and budget.";
    }
    return;
  }

  const result = calculateBudgetStatus(
    parseFloat(myExpense.value),
    parseFloat(myBudget.value),
  );

  if (responseElement) {
    responseElement.textContent = result;
  }
}

// ============================================================
// Expenses Tracker (NOU)
// ============================================================

// Array tipat per guardar les despeses diàries
const myExpenses: number[] = [];

// Elements del DOM
const expenseInput = document.getElementById("expense-amount") as HTMLInputElement;
const addExpenseButton = document.getElementById("add-expense");
const dailyBudgetInput = document.getElementById("daily-budget") as HTMLInputElement;
const generateReportButton = document.getElementById("generate-report");
const expensesListElement = document.getElementById("expenses-list");
const expensesResponseElement = document.getElementById("expenses-response");

// --- Afegir una despesa ---
function addExpense() {
  const value = parseFloat(expenseInput.value);

  if (isNaN(value) || value <= 0) {
    alert("Introduce un valor numérico válido mayor que 0");
    return;
  }

  myExpenses.push(value);
  expenseInput.value = "";
  expenseInput.focus();

  renderExpensesList();
}

// --- Renderitzar la llista de despeses ---
function renderExpensesList() {
  if (!expensesListElement) return;

  if (myExpenses.length === 0) {
    expensesListElement.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

  const list = document.createElement("ul");
  myExpenses.forEach((expense, index) => {
    const item = document.createElement("li");
    item.textContent = `Day ${index + 1}: $${expense.toFixed(2)}`;
    list.appendChild(item);
  });
  expensesListElement.innerHTML = "";
  expensesListElement.appendChild(list);
}

// --- Generar l'informe de despeses ---
function handleGenerateReport() {
  if (myExpenses.length === 0) {
    alert("Add at least one expense first.");
    return;
  }

  const dailyBudget = parseFloat(dailyBudgetInput.value);

  if (isNaN(dailyBudget) || dailyBudget <= 0) {
    alert("Please enter a valid daily budget.");
    return;
  }

  try {
    const report = generateExpenseReport(myExpenses, dailyBudget);
    displayReport(report);
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("An unexpected error occurred.");
    }
  }
}

// --- Mostrar l'informe al DOM ---
function displayReport(report: ExpenseReport) {
  if (!expensesResponseElement) return;

  expensesResponseElement.innerHTML = `
    <div class="report-card rating-${report.rating}">
      <h3>Expense Report</h3>
      <p><strong>Travel days:</strong> ${report.travelDays}</p>
      <p><strong>Days with expenses:</strong> ${report.expenseDays}</p>
      <p><strong>Daily budget:</strong> $${report.dailyBudget.toFixed(2)}</p>
      <p><strong>Average daily expense:</strong> $${report.averageDailyExpense.toFixed(2)}</p>
      <p><strong>Under budget:</strong> ${report.underBudget ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Rating:</strong> ${"⭐".repeat(report.rating)}</p>
      <p><strong>Feedback:</strong> ${report.feedback}</p>
    </div>
  `;
}

// --- Event Listeners ---
addExpenseButton?.addEventListener("click", addExpense);
generateReportButton?.addEventListener("click", handleGenerateReport);

// --- Render inicial ---
renderExpensesList();