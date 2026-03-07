import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BudgetSummaryComponent } from './budget-summary/budget-summary.component';
import { ExpenseTableComponent } from './expense-table/expense-table.component';

@Component({
  selector: 'app-budget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BudgetSummaryComponent, ExpenseTableComponent],
  template: `<app-budget-summary /><app-expense-table />`,
})
export class BudgetComponent {}
