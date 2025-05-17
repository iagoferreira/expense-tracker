import { createFileRoute } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (error) return 'An error has occurred: ' + error.message;

  return <div>
    {isPending ? 'Loading...' :
      <div>
        <div className="mb-2">{`Hello, ${data.user.given_name}`}</div>
        <Button asChild variant="outline">
          <a href="/api/auth/logout">Logout</a>
        </Button>
      </div>
    }
  </div>
}
