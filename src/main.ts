import { calculateBudgetStatus } from "./budgetCalculator";
import { generateExpenseReport } from "./expenseTracker";

const result = calculateBudgetStatus(101, 100);
console.log(result)

const expenseReport = generateExpenseReport([50, 0, 120, 85], 100);
console.log(expenseReport);