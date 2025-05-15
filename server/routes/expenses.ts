import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getUser } from '../kinde';
import { db } from '../db';
import { expensesTable } from '../db/schema/expenses';
import { eq } from 'drizzle-orm';

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.string(),
});

type Expense = z.infer<typeof expenseSchema>;

const expensePostSchema = expenseSchema.omit({ id: true });

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: '50.25' },
  { id: 2, title: 'Electricity Bill', amount: '75.0' },
  { id: 3, title: 'Internet Subscription', amount: '30.0' },
  { id: 4, title: 'Gym Membership', amount: '40.0' },
  { id: 5, title: 'Dining Out', amount: '60.5' }
];

const expensesRoute = new Hono()
  .get(
    '/',
    getUser,
    async (c) => {
      const user = c.var.user;
      const expenses = await db
        .select()
        .from(expensesTable)
        .where(
          eq(expensesTable.userId, user.id)
        )

      return c.json({ expenses: expenses });
    }
  )
  .post(
    '/',
    getUser,
    zValidator(
      'json',
      expensePostSchema
    ),
    async (c) => {
      const user = c.var.user;
      const expense = c.req.valid('json');
      const res = await db
        .insert(expensesTable)
        .values({
          ...expense,
          userId: user.id
        })
        .returning()

      c.status(201);

      return c.json(res);
    }
  )
  .get(
    '/total-spent',
    getUser,
    (c) => {
      const total = fakeExpenses.reduce((acc, expense) => acc + +expense.amount, 0);
      return c.json({ total });
    }
  )
  .get(
    '/:id{[0-9]+}',
    getUser,
    (c) => {
      const id = Number.parseInt(c.req.param('id'));
      const expense = fakeExpenses.find((e) => e.id === id);
      if (!expense) {
        return c.notFound();
      }
      return c.json({ expense });
    }
  )
  .delete(
    '/:id{[0-9]+}',
    getUser,
    (c) => {
      const id = Number.parseInt(c.req.param('id'));
      const index = fakeExpenses.findIndex((e) => e.id === id);
      if (index === -1) {
        return c.notFound();
      }
      fakeExpenses.splice(index, 1);
      return c.json({ message: 'Expense deleted' });
    }
  )

export default expensesRoute;
