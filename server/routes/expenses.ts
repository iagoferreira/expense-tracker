import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { getUser } from '../kinde';
import { db } from '../db';
import { expensesTable, expenseInsertSchema } from '../db/schema/expenses';
import { and, desc, eq, sum } from 'drizzle-orm';
import { expenseSchema } from '../../shared/types';

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
      expenseSchema
    ),
    async (c) => {
      const user = c.var.user;
      const expense = c.req.valid('json');

      const validatedExpense = expenseInsertSchema.parse({
        ...expense,
        userId: user.id
      });

      const res = await db
        .insert(expensesTable)
        .values(validatedExpense)
        .returning()
        .then((res) => res[0]);

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
