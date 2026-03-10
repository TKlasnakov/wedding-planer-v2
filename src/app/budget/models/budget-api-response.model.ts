import { ExpenseApiResponse } from './expense-api-response.model';

export interface BudgetApiResponse {
  id: string;
  totalBudget: number;
  expenses: ExpenseApiResponse[];
}
