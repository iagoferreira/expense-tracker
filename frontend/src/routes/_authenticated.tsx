import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button';

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

    return (
      <div>
        <div className="mb-2">You have to login or register</div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <a href="/api/auth/login">Login</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/api/auth/register">Register</a>
          </Button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
