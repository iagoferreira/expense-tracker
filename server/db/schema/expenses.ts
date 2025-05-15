import { serial, text, numeric, index, pgTable, timestamp } from "drizzle-orm/pg-core";

export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
}, (expenses) => [
  index('user_id_index').on(expenses.userId),
]);
