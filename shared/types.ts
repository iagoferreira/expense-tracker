import { expenseInsertSchema } from '../server/db/schema/expenses';
import { z } from 'zod';

export const expenseSchema = expenseInsertSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
});

export type Expense = z.infer<typeof expenseSchema>
