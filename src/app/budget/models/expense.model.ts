import { BudgetCategoryId } from './budget-category-id.model';

export interface Expense {
  id: string;
  categoryId: BudgetCategoryId;
  name: string;
  vendor: string;
  estimatedCost: number;
  actualCost: number | null;
  paid: boolean;
  notes: string;
}
