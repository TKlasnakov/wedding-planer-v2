import { BudgetCategoryId } from './budget-category-id.model';

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: string;
  color: string;
}
