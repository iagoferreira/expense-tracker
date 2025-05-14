import { hc } from 'hono/client';
import { type ApiRoutes } from "@server/app";
import { queryOptions } from '@tanstack/react-query';

const client = hc<ApiRoutes>('/');

export const api = client.api;

async function getCurrentUser() {
  await new Promise((r) => setTimeout(r, 1000));
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
