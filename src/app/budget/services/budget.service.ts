import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map } from 'rxjs';
import { BudgetCategoryId } from '../models/budget-category-id.model';
import { Expense } from '../models/expense.model';

interface ExpenseApiResponse {
  id: string;
  category: BudgetCategoryId;
  itemName: string;
  vendorName: string;
  estimated: number;
  actual: number | null;
  isPaid: boolean;
  notes?: string;
}

interface BudgetApiResponse {
  id: string;
  totalBudget: number;
  expenses: ExpenseApiResponse[];
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly http = inject(HttpClient);
  private _loaded = false;
  private _budgetId: string | null = null;

  private readonly _totalBudget = signal<number>(0);
  private readonly _expenses = signal<Expense[]>([]);

  readonly totalBudget = this._totalBudget.asReadonly();
  readonly expenses = this._expenses.asReadonly();

  readonly totalEstimated = computed(() =>
    this._expenses().reduce((sum, expense) => sum + expense.estimatedCost, 0),
  );

  readonly totalActual = computed(() =>
    this._expenses().reduce((sum, expense) => sum + (expense.actualCost ?? 0), 0),
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

  ensureBudget(): Observable<BudgetApiResponse | object> {
    if (this._loaded) return of({});
    return this.fetchBudget();
  }

  private fetchBudget(): Observable<BudgetApiResponse | object> {
    return this.http.get<BudgetApiResponse | object>('http://localhost:3000/budget').pipe(
      tap(response => {
        console.log('[BudgetService] GET /budget:', response);
        this._loaded = true;
        if ('id' in response) {
          this._budgetId = response.id;
          this._totalBudget.set(response.totalBudget);
          this._expenses.set(response.expenses.map(expense => this.mapExpense(expense)));
        }
      }),
    );
  }

  setTotalBudget(amount: number): Observable<void> {
    const body = this._budgetId
      ? { id: this._budgetId, totalBudget: amount }
      : { totalBudget: amount };

    return this.http.post<BudgetApiResponse>('http://localhost:3000/budget', body).pipe(
      tap(response => {
        console.log('[BudgetService] POST /budget:', response);
        this._budgetId = response.id;
        this._totalBudget.set(response.totalBudget);
      }),
      map(() => undefined),
    );
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    const body = {
      category: expense.categoryId,
      itemName: expense.name,
      vendorName: expense.vendor,
      estimated: expense.estimatedCost,
      actual: expense.actualCost,
      isPaid: expense.paid,
      notes: expense.notes,
      budgetId: this._budgetId,
    };

    this.http.post<ExpenseApiResponse>('http://localhost:3000/budget/expenses', body).pipe(
      tap(response => {
        console.log('[BudgetService] POST /budget/expenses:', response);
        this._expenses.update(expenses => [...expenses, this.mapExpense(response)]);
      }),
    ).subscribe();
  }

  updateExpense(id: string, expense: Omit<Expense, 'id'>): void {
    this._expenses.update(expenses =>
      expenses.map(existing => (existing.id === id ? { ...expense, id } : existing)),
    );
  }

  deleteExpense(id: string): void {
    this._expenses.update(expenses => expenses.filter(expense => expense.id !== id));
  }

  private mapExpense(response: ExpenseApiResponse): Expense {
    return {
      id: response.id,
      categoryId: response.category,
      name: response.itemName,
      vendor: response.vendorName ?? '',
      estimatedCost: response.estimated,
      actualCost: response.actual,
      paid: response.isPaid,
      notes: response.notes ?? '',
    };
  }
}
