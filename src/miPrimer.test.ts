import { describe, it, expect } from "vitest";
import { calculateBudgetStatus } from "./budgetCalculator.js";

/**
 * Escenari: Les despeses són menys del 80% del pressupost
 *   Donat un pressupost de 1000
 *   I unes despeses de 700
 *   Quan calculo l'estat del pressupost
 *   Aleshores el resultat ha de ser "Sota pressupost ✈️"
 *
 * Lògica de calculateBudgetStatus:
 *   - ratio = totalExpenses / budget
 *   - Si ratio < 0.8   → "Sota pressupost ✈️"
 *   - Si ratio > 0.8 i < 1 → "Dins pressupost ✅"
 *   - En qualsevol altre cas (ratio >= 1) → "Sobre pressupost ⚠️"
 *
 * Per a expenses=700, budget=1000 → ratio = 0.7 → 0.7 < 0.8 → "Sota pressupost ✈️" ✓
 */
describe("Budget Calculator - Estat del pressupost", () => {
  it("ha de retornar 'Sota pressupost ✈️' quan les despeses són el 70% del pressupost", () => {
    const pressupost = 1000;
    const despeses = 700;

    const resultat = calculateBudgetStatus(despeses, pressupost);

    expect(resultat).toBe("Sota pressupost ✈️");
  });

  // Tests addicionals per cobrir els altres casos
  it("ha de retornar 'Dins pressupost ✅' quan les despeses estan entre el 80% i el 100%", () => {
    expect(calculateBudgetStatus(850, 1000)).toBe("Dins pressupost ✅");
  });

  it("ha de retornar 'Sobre pressupost ⚠️' quan les despeses superen el pressupost", () => {
    expect(calculateBudgetStatus(1200, 1000)).toBe("Sobre pressupost ⚠️");
  });
});