import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BUDGET_CATEGORIES } from '../budget.constants';
import { Expense } from '../models/expense.model';

export interface ExpenseFormData {
  expense?: Expense;
}

@Component({
  selector: 'app-expense-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.scss',
})
export class ExpenseFormComponent {
  protected readonly data = inject<ExpenseFormData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ExpenseFormComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly categories = BUDGET_CATEGORIES;

  protected readonly form = this.fb.nonNullable.group({
    categoryId: [this.data.expense?.categoryId ?? '', Validators.required],
    name: [this.data.expense?.name ?? '', Validators.required],
    vendor: [this.data.expense?.vendor ?? ''],
    estimatedCost: [this.data.expense?.estimatedCost ?? 0, [Validators.required, Validators.min(0)]],
    actualCost: [this.data.expense?.actualCost ?? null as number | null, Validators.min(0)],
    paid: [this.data.expense?.paid ?? false],
    notes: [this.data.expense?.notes ?? ''],
  });

  protected save(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    this.dialogRef.close({
      categoryId: raw.categoryId,
      name: raw.name,
      vendor: raw.vendor ?? '',
      estimatedCost: Number(raw.estimatedCost),
      actualCost: raw.actualCost !== null && raw.actualCost !== undefined && raw.actualCost !== ('' as unknown as number)
        ? Number(raw.actualCost)
        : null,
      paid: raw.paid,
      notes: raw.notes ?? '',
    } satisfies Omit<Expense, 'id'>);
  }
}
