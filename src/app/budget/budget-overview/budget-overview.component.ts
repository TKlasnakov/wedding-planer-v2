import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BUDGET_CATEGORIES } from '../budget.constants';
import { BudgetService } from '../services/budget.service';
import { ExpenseFormComponent, ExpenseFormData } from '../expense-form/expense-form.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Expense } from '../models/expense.model';
import { BudgetCategory } from '../models/budget-category.model';

// ── Inline Set Budget Dialog ─────────────────────────────────────────────────

interface SetBudgetDialogData {
  form: FormGroup;
}

@Component({
  selector: 'app-set-budget-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Set Total Budget</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form" class="set-budget-form">
        <mat-form-field appearance="outline">
          <mat-label>Total Budget (€)</mat-label>
          <input matInput type="number" formControlName="amount" min="0" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="data.form.invalid"
        (click)="save()"
      >Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.set-budget-form { padding-top: 8px; } mat-form-field { width: 100%; }`],
})
export class SetBudgetDialogComponent {
  protected readonly data = inject<SetBudgetDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SetBudgetDialogComponent>);

  protected save(): void {
    if (this.data.form.invalid) return;
    this.dialogRef.close(Number(this.data.form.getRawValue().amount));
  }
}

// ── Budget Overview Page ─────────────────────────────────────────────────────

@Component({
  selector: 'app-budget-overview',
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
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './budget-overview.component.html',
  styleUrl: './budget-overview.component.scss',
})
export class BudgetOverviewComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  protected readonly budgetService = inject(BudgetService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = BUDGET_CATEGORIES;
  protected readonly categoryFilter = signal<string>('all');

  protected readonly displayedColumns = ['category', 'name', 'vendor', 'estimatedCost', 'actualCost', 'paid', 'actions'];
  protected readonly dataSource = new MatTableDataSource<Expense>([]);

  protected readonly categoryMap = new Map<string, BudgetCategory>(
    BUDGET_CATEGORIES.map(category => [category.id, category]),
  );

  constructor() {
    effect(() => {
      const filter = this.categoryFilter();
      const expenses = this.budgetService.expenses();
      this.dataSource.data = filter === 'all'
        ? expenses
        : expenses.filter(expense => expense.categoryId === filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  protected getCategoryColor(categoryId: string): string {
    return this.categoryMap.get(categoryId)?.color ?? '#9e9e9e';
  }

  protected getCategoryName(categoryId: string): string {
    return this.categoryMap.get(categoryId)?.name ?? categoryId;
  }

  protected openSetBudget(): void {
    const budgetForm = this.fb.nonNullable.group({
      amount: [this.budgetService.totalBudget(), [Validators.required, Validators.min(0)]],
    });

    this.dialog
      .open<SetBudgetDialogComponent, SetBudgetDialogData>(SetBudgetDialogComponent, {
        data: { form: budgetForm },
        width: '320px',
      })
      .afterClosed()
      .subscribe((amount: number | undefined) => {
        if (amount !== undefined) {
          this.budgetService.setTotalBudget(amount);
        }
      });
  }

  protected openAddExpense(): void {
    this.dialog
      .open<ExpenseFormComponent, ExpenseFormData>(ExpenseFormComponent, {
        data: {},
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) this.budgetService.addExpense(result);
      });
  }

  protected openEditExpense(expense: Expense): void {
    this.dialog
      .open<ExpenseFormComponent, ExpenseFormData>(ExpenseFormComponent, {
        data: { expense },
        maxWidth: '95vw',
      })
      .afterClosed()
      .subscribe(result => {
        if (result) this.budgetService.updateExpense(expense.id, result);
      });
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
      .subscribe(confirmed => {
        if (confirmed) this.budgetService.deleteExpense(expense.id);
      });
  }
}
