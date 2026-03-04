import { BudgetCategory } from './models/budget-category.model';
import { BudgetCategoryId } from './models/budget-category-id.model';

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  { id: BudgetCategoryId.Venue, name: 'Venue', color: '#e91e63' },
  { id: BudgetCategoryId.Catering, name: 'Catering', color: '#ff5722' },
  { id: BudgetCategoryId.Music, name: 'Music', color: '#9c27b0' },
  { id: BudgetCategoryId.Photography, name: 'Photography', color: '#3f51b5' },
  { id: BudgetCategoryId.Flowers, name: 'Flowers & Decor', color: '#4caf50' },
  { id: BudgetCategoryId.Attire, name: 'Attire', color: '#00bcd4' },
  { id: BudgetCategoryId.Transport, name: 'Transport', color: '#795548' },
  { id: BudgetCategoryId.Other, name: 'Other', color: '#9e9e9e' },
];
