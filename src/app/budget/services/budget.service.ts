import { Injectable, computed, inject, signal } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { Expense } from '../models/expense.model';

const BUDGET_SETTINGS_KEY = 'wedding_budget_settings';
const EXPENSES_KEY = 'wedding_expenses';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly storageService = inject(StorageService);

  private readonly _totalBudget = signal<number>(
    this.storageService.get<number>(BUDGET_SETTINGS_KEY) ?? 0,
  );
  private readonly _expenses = signal<Expense[]>(
    this.storageService.get<Expense[]>(EXPENSES_KEY) ?? [],
  );

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
    this.storageService.set(BUDGET_SETTINGS_KEY, amount);
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID() };
    this._expenses.update(expenses => [...expenses, newExpense]);
    this.persistExpenses();
  }

  updateExpense(id: string, expense: Omit<Expense, 'id'>): void {
    this._expenses.update(expenses =>
      expenses.map(existing => (existing.id === id ? { ...expense, id } : existing)),
    );
    this.persistExpenses();
  }

  deleteExpense(id: string): void {
    this._expenses.update(expenses => expenses.filter(expense => expense.id !== id));
    this.persistExpenses();
  }

  private persistExpenses(): void {
    this.storageService.set(EXPENSES_KEY, this._expenses());
  }
}
