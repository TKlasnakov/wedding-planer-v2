import { Injectable, computed, signal } from '@angular/core';
import { Expense } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly _totalBudget = signal<number>(0);
  private readonly _expenses = signal<Expense[]>([]);

  readonly totalBudget = this._totalBudget.asReadonly();
  readonly expenses = this._expenses.asReadonly();

  readonly totalEstimated = computed(() =>
    this._expenses().reduce((sum, expense) => sum + expense.estimatedCost, 0),
  );

  readonly totalActual = computed(() =>
    this._expenses().reduce(
      (sum, expense) => sum + (expense.actualCost ?? 0),
      0,
    ),
  );

  readonly totalPaid = computed(() =>
    this._expenses()
      .filter(expense => expense.paid)
      .reduce((sum, expense) => sum + (expense.actualCost ?? 0), 0),
  );

  readonly remaining = computed(() => {
    const budget = this._totalBudget();
    const actual = this.totalActual();
    const estimated = this.totalEstimated();
    return actual > 0 ? budget - actual : budget - estimated;
  });

  setTotalBudget(amount: number): void {
    this._totalBudget.set(amount);
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID() };
    this._expenses.update(expenses => [...expenses, newExpense]);
  }

  updateExpense(id: string, expense: Omit<Expense, 'id'>): void {
    this._expenses.update(expenses =>
      expenses.map(existing => (existing.id === id ? { ...expense, id } : existing)),
    );
  }

  deleteExpense(id: string): void {
    this._expenses.update(expenses => expenses.filter(expense => expense.id !== id));
  }
}
