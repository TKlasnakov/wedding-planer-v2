import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { filter, switchMap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BUDGET_CATEGORIES } from './budget.constants';
import { BudgetService } from './services/budget.service';
import { ExpenseFormComponent, ExpenseFormData } from './expense-form/expense-form.component';
import { SetBudgetDialogComponent, SetBudgetDialogData } from './set-budget-dialog/set-budget-dialog.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../shared/confirm-dialog/confirm-dialog.component';
import { StatCardComponent } from '../shared/stat-card/stat-card.component';
import { Expense } from './models/expense.model';
import { BudgetCategory } from './models/budget-category.model';
import { BudgetCategoryId } from './models/budget-category-id.model';

@Component({
  selector: 'app-budget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    StatCardComponent,
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
})
export class BudgetComponent {
  protected readonly budgetService = inject(BudgetService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = BUDGET_CATEGORIES;
  protected readonly categoryFilter = signal<BudgetCategoryId | 'all'>('all');

  protected readonly displayedColumns = ['category', 'name', 'vendor', 'cost', 'paid', 'actions'];

  protected readonly categoryMap = new Map<BudgetCategoryId, BudgetCategory>(
    BUDGET_CATEGORIES.map(category => [category.id, category]),
  );

  protected readonly filteredExpenses = computed(() => {
    const filter = this.categoryFilter();
    const expenses = this.budgetService.expenses();
    return filter === 'all' ? expenses : expenses.filter(expense => expense.categoryId === filter);
  });

  protected getCategoryColor(categoryId: BudgetCategoryId): string {
    return this.categoryMap.get(categoryId)?.color ?? '#9e9e9e';
  }

  protected getCategoryName(categoryId: BudgetCategoryId): string {
    return this.categoryMap.get(categoryId)?.name ?? categoryId;
  }

  protected openSetBudget(): void {
    const budgetForm = this.fb.nonNullable.group({
      amount: [this.budgetService.totalBudget(), [Validators.required, Validators.min(0)]],
    });

    this.dialog
      .open<SetBudgetDialogComponent, SetBudgetDialogData>(SetBudgetDialogComponent, {
        data: { form: budgetForm, currentAmount: this.budgetService.totalBudget() },
        width: '320px',
      })
      .afterClosed()
      .pipe(
        filter(amount => amount != null),
        switchMap(amount => this.budgetService.setTotalBudget(amount)),
      )
      .subscribe();
  }

  protected openAddExpense(): void {
    this.dialog
      .open<ExpenseFormComponent, ExpenseFormData>(ExpenseFormComponent, {
        data: {},
        maxWidth: '95vw',
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.budgetService.addExpense(result)),
      )
      .subscribe();
  }

  protected openEditExpense(expense: Expense): void {
    this.dialog
      .open<ExpenseFormComponent, ExpenseFormData>(ExpenseFormComponent, {
        data: { expense },
        maxWidth: '95vw',
      })
      .afterClosed()
      .pipe(
        filter(result => !!result),
        switchMap(result => this.budgetService.updateExpense(expense.id, result)),
      )
      .subscribe();
  }

  protected deleteExpense(expense: Expense): void {
    this.dialog
      .open<ConfirmDialogComponent, ConfirmDialogData>(ConfirmDialogComponent, {
        data: {
          title: 'Remove Expense',
          message: `Remove "${expense.name}"?`,
          confirmLabel: 'Remove',
        },
      })
      .afterClosed()
      .pipe(
        filter(confirmed => !!confirmed),
        switchMap(() => this.budgetService.deleteExpense(expense.id)),
      )
      .subscribe();
  }
}
