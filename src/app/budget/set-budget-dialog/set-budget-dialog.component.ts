import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface SetBudgetDialogData {
  form: FormGroup;
  currentAmount: number;
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
  templateUrl: './set-budget-dialog.component.html',
  styleUrl: './set-budget-dialog.component.scss',
})
export class SetBudgetDialogComponent {
  protected readonly data = inject<SetBudgetDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<SetBudgetDialogComponent>);

  protected cancel(): void {
    this.dialogRef.close(this.data.currentAmount);
  }

  protected save(): void {
    if (this.data.form.invalid) return;
    this.dialogRef.close(Number(this.data.form.getRawValue().amount) || 0);
  }
}
