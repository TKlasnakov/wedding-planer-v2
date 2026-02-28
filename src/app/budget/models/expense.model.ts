export interface Expense {
  id: string;
  categoryId: string;
  name: string;
  vendor: string;
  estimatedCost: number;
  actualCost: number | null;
  paid: boolean;
  notes: string;
}
