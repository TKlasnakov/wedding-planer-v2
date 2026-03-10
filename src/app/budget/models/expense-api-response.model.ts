import { BudgetCategoryId } from './budget-category-id.model';

export interface ExpenseApiResponse {
  id: string;
  category: BudgetCategoryId;
  itemName: string;
  vendorName: string;
  actual: number | null;
  isPaid: boolean;
  notes?: string;
}
