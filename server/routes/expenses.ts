import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

type Expense = z.infer<typeof expenseSchema>;

const expensePostSchema = expenseSchema.omit({id: true});

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50.25 },
  { id: 2, title: 'Electricity Bill', amount: 75.0 },
  { id: 3, title: 'Internet Subscription', amount: 30.0 },
  { id: 4, title: 'Gym Membership', amount: 40.0 },
  { id: 5, title: 'Dining Out', amount: 60.5 }
];

const expensesRoute = new Hono()
  .get(
    '/',
    (c) => {
      return c.json({ expenses: fakeExpenses});
    }
  )
  .post(
    '/',
    zValidator(
      'json',
      expensePostSchema
    ),
    (c) => {
      const expense = c.req.valid('json');;
      fakeExpenses.push({...expense, id: fakeExpenses.length + 1});
      c.status(201);
      return c.json(expense);
    }
  )
  .get(
    '/:id{[0-9]+}',
    (c) => {
      const id = Number.parseInt(c.req.param('id'));
      const expense = fakeExpenses.find((e) => e.id === id);
      if (!expense) {
        return c.notFound();
      }
      return c.json({expense});
    }
  )
  .delete(
    '/:id{[0-9]+}',
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
