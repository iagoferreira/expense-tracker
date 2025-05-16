import { serial, text, numeric, index, pgTable, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (expenses) => [
  index('user_id_index').on(expenses.userId),
]);

export const expenseInsertSchema = createInsertSchema(expensesTable, {
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' }),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Amount must be a valid number' }),
});

export const expenseSelectSchema = createSelectSchema(expensesTable);
