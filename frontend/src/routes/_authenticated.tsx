import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'

export const Route = createFileRoute('/_authenticated')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const { queryClient } = context;

    try {
      const data = queryClient.fetchQuery(userQueryOptions);

      return data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return { user: null };
    }
  },
})

function RouteComponent() {
  const { user } = Route.useRouteContext();

  if (!user) {
    return <a href="/api/auth/login">Login</a>
  }

  return <Outlet />
}
