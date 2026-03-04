import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BudgetService } from './services/budget.service';

export const budgetResolver: ResolveFn<unknown> = () =>
  inject(BudgetService).ensureBudget();
