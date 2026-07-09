export type BudgetStatus = "Sota pressupost ✈️" | "Dins pressupost ✅" | "Sobre pressupost ⚠️";

export function calculateBudgetStatus(totalExpenses: number, budget: number): BudgetStatus {
  const ratio = totalExpenses / budget;
  if (ratio < 0.8) {
    return "Sota pressupost ✈️";
  } else if (ratio > 0.8 && ratio < 1) {
    return "Dins pressupost ✅";
  } else {
    return "Sobre pressupost ⚠️";
  }
}


