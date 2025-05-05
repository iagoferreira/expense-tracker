import { Hono } from 'hono';

type Expense = {
  id: number;
  title: string;
  amount: number;
};

const fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50.25 },
  { id: 2, title: 'Electricity Bill', amount: 75.0 },
  { id: 3, title: 'Internet Subscription', amount: 30.0 },
  { id: 4, title: 'Gym Membership', amount: 40.0 },
  { id: 5, title: 'Dining Out', amount: 60.5 }
];

const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses: fakeExpenses});
  })
  .post('/', async (c) => {
    const data = await c.req.json();
    console.log(data);
    return c.json(data);
  })

export default expensesRoute;
