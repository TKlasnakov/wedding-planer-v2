import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Expense } from '../models/expense.model';
import { BudgetApiResponse } from '../models/budget-api-response.model';
import { ExpenseApiResponse } from '../models/expense-api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private readonly http = inject(HttpClient);
  private readonly budgetUrl = `${environment.apiUrl}/budget`;
  private _loaded = false;
  private _budgetId: string | null = null;

  private readonly _totalBudget = signal<number>(0);
  private readonly _expenses = signal<Expense[]>([]);

  readonly totalBudget = this._totalBudget.asReadonly();
  readonly expenses = this._expenses.asReadonly();

  readonly totalCost = computed(() =>
    this._expenses().reduce((sum, expense) => sum + (expense.cost ?? 0), 0),
  );

  readonly totalPaid = computed(() =>
    this._expenses()
      .filter(expense => expense.paid)
      .reduce((sum, expense) => sum + (expense.cost ?? 0), 0),
  );

  readonly remaining = computed(() => this._totalBudget() - this.totalCost());

  ensureBudget(): Observable<BudgetApiResponse | object> {
    if (this._loaded) return of({});
    return this.fetchBudget();
  }

  private fetchBudget(): Observable<BudgetApiResponse | object> {
    return this.http.get<BudgetApiResponse | object>(this.budgetUrl).pipe(
      tap(response => {
        this._loaded = true;
        if ('id' in response) {
          this._budgetId = response.id;
          this._totalBudget.set(response.totalBudget);
          this._expenses.set(response.expenses.map(expense => this.mapExpense(expense)));
        }
      }),
    );
  }

  setTotalBudget(amount: number): Observable<BudgetApiResponse> {
    const body = this._budgetId
      ? { id: this._budgetId, totalBudget: amount }
      : { totalBudget: amount };

    return this.http.post<BudgetApiResponse>(this.budgetUrl, body).pipe(
      tap(response => {
        this._budgetId = response.id;
        this._totalBudget.set(response.totalBudget);
      }),
    );
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<ExpenseApiResponse> {
    const body = {
      category: expense.categoryId,
      itemName: expense.name,
      vendorName: expense.vendor,
      estimated: 0,
      actual: expense.cost,
      isPaid: expense.paid,
      notes: expense.notes,
      budgetId: this._budgetId,
    };

    return this.http.post<ExpenseApiResponse>(`${this.budgetUrl}/expenses`, body).pipe(
      tap(response => {
        this._expenses.update(expenses => [...expenses, this.mapExpense(response)]);
      }),
    );
  }

  updateExpense(id: string, expense: Omit<Expense, 'id'>): Observable<ExpenseApiResponse> {
    const body = {
      category: expense.categoryId,
      itemName: expense.name,
      vendorName: expense.vendor,
      estimated: 0,
      actual: expense.cost,
      isPaid: expense.paid,
      notes: expense.notes,
    };

    return this.http.patch<ExpenseApiResponse>(`${this.budgetUrl}/expenses/${id}`, body).pipe(
      tap(response => {
        this._expenses.update(expenses =>
          expenses.map(existing => (existing.id === id ? this.mapExpense(response) : existing)),
        );
      }),
    );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.budgetUrl}/expenses/${id}`).pipe(
      tap(() => {
        this._expenses.update(expenses => expenses.filter(expense => expense.id !== id));
      }),
    );
  }

  private mapExpense(response: ExpenseApiResponse): Expense {
    return {
      id: response.id,
      categoryId: response.category,
      name: response.itemName,
      vendor: response.vendorName ?? '',
      cost: response.actual,
      paid: response.isPaid,
      notes: response.notes ?? '',
    };
  }
}
