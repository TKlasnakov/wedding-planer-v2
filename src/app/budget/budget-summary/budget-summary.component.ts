import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, switchMap } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BudgetService } from '../services/budget.service';
import { SetBudgetDialogComponent, SetBudgetDialogData } from '../set-budget-dialog/set-budget-dialog.component';
import { StatCardComponent } from '../../shared/stat-card/stat-card.component';

@Component({
  selector: 'app-budget-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, StatCardComponent],
  templateUrl: './budget-summary.component.html',
  styleUrl: './budget-summary.component.scss',
})
export class BudgetSummaryComponent {
  protected readonly budgetService = inject(BudgetService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

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
}
