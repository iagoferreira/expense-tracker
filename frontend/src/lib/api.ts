import { hc } from 'hono/client';
import { type ApiRoutes } from "@server/app";
import { queryOptions } from '@tanstack/react-query';
import { Expense } from '@shared/types';

const client = hc('/') as ReturnType<typeof hc<ApiRoutes>>;

export const api = client.api;

async function getCurrentUser() {
  const response = await api.auth.me.$get();

  if (!response.ok) {
    console.error('Network response was not ok');
  }

  const data = await response.json();

  return data;
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity
})

export async function getAllExpenses() {
  const response = await api.expenses.$get();

  if (!response.ok) throw new Error('Network response was not ok');

  const data = await response.json();

  return data;
}

export const getAllExpensesQueryOptions = queryOptions({
  queryKey: ['get-all-expenses'],
  queryFn: getAllExpenses,
  staleTime: 1000 * 60 * 5,
});

export async function createExpense({ value }: { value: Expense }) {
  await new Promise((r) => setTimeout(r, 3000));

  const res = await api.expenses.$post({ json: value });

  if (!res.ok) {
    throw new Error('Failed to create expense')
  }

  const createdExpense = await res.json();

  return createdExpense;
}

export const loadingCreateExpenseQueryOptions = queryOptions<{
  expense?: | Expense
}>({
  queryKey: ['loading-create-expense'],
  queryFn: () => ({}),
  staleTime: Infinity
})

export async function deleteExpense({ id }: { id: number }) {
  await new Promise((r) => setTimeout(r, 3000));
  const res = await api.expenses[":id{[0-9]+}"].$delete({
    param: {
      id: id.toString()
    }
  });

  if (!res.ok) {
    throw new Error('Failed to delete expense')
  }

  const deletedExpense = await res.json();

  return deletedExpense;
}
