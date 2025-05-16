import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  async function getTotalSpent() {
    const response = await api.expenses['total-spent'].$get();

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    return data;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: getTotalSpent
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? 'Loading...' : data.total}</CardContent>
    </Card>
  )
}
