export interface ExpenseReport {
  travelDays: number;
  expenseDays: number;
  dailyBudget: number;
  averageDailyExpense: number;
  underBudget: boolean;
  rating: 1 | 2 | 3;
  feedback: string;
}

export function generateExpenseReport(
  dailyExpenses: number[],
  dailyBudget: number,
): ExpenseReport {

  const negativeExpenses = dailyExpenses.some((expense) => expense < 0);
  if (negativeExpenses) {
    throw new Error("Expenses cannot be negative");
  }
  // Calculs
  const numDaysTraveled = dailyExpenses.length; // dis viajados
  const daysWithExpense = dailyExpenses.filter((dwe) => dwe !== 0).length; // numero de dias con gasto
  const totEx = dailyExpenses.reduce((acc, curr) => acc + curr, 0); // gastos del viaje
  const avDailyExp = totEx / numDaysTraveled; // Gasto promedio
  const underBudget = avDailyExp <= dailyBudget ? true : false;

  let myRating: 1 | 2 | 3;
  let myfFeedback: string;

  if (avDailyExp <= dailyBudget) {
    myRating = 3;
    myfFeedback = "Excel·lent gestió!";
  } else if (avDailyExp <= dailyBudget * 1.2) {
    myRating = 2;
    myfFeedback = "Bona gestió, però es pot millorar!";
  } else {
    myRating = 1;
    myfFeedback = "Gestió acceptable, però cal millorar!";
  }

  // Objecte de retorn
  return {
    travelDays: numDaysTraveled,
    expenseDays: daysWithExpense,
    dailyBudget: dailyBudget,
    averageDailyExpense: avDailyExp,
    underBudget: underBudget,
    rating: myRating,
    feedback: myfFeedback,
  };
}


