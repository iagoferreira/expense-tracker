import { z } from 'zod';
import { expenseInsertSchema } from '../server/db/schema/expenses';

export const expenseSchema = expenseInsertSchema.omit({
  userId: true,
  createdAt: true
});
