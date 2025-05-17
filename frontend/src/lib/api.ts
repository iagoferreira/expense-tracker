import { hc } from 'hono/client';
import { type ApiRoutes } from "@server/app";
import { queryOptions } from '@tanstack/react-query';

const client = hc<ApiRoutes>('/');

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
