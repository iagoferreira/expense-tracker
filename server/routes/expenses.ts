import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getUser } from '../kinde';
import { db } from '../db';
import { expensesTable } from '../db/schema/expenses';
import { and, desc, eq, sum } from 'drizzle-orm';

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
        .orderBy(desc(expensesTable.createdAt))
        .limit(100);

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
    async (c) => {
      const user = c.var.user;
      const result = await db
        .select({ total: sum(expensesTable.amount) })
        .from(expensesTable)
        .where(
          eq(expensesTable.userId, user.id)
        )
        .limit(1)
        .then((res) => res[0]);

      return c.json(result);
    }
  )
  .get(
    '/:id{[0-9]+}',
    getUser,
    async (c) => {
      const id = Number.parseInt(c.req.param('id'));
      const user = c.var.user;
      const expense = await db
        .select()
        .from(expensesTable)
        .where(
          and(
            eq(expensesTable.userId, user.id),
            eq(expensesTable.id, id)
          )
        ).
        then((res) => res[0]);

      if (!expense) {
        return c.notFound();
      }
      return c.json({ expense });
    }
  )
  .delete(
    '/:id{[0-9]+}',
    getUser,
    async (c) => {
      const id = Number.parseInt(c.req.param('id'));
      const user = c.var.user;
      const expense = await db
        .delete(expensesTable)
        .where(
          and(
            eq(expensesTable.userId, user.id),
            eq(expensesTable.id, id)
          )
        )
        .returning()
        .then((res) => res[0])

      if (!expense) {
        return c.notFound();
      }

      return c.json({ expense });
    }
  )

export default expensesRoute;
