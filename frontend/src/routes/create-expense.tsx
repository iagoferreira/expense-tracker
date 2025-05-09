import { createFileRoute } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {

  return (
    <div>
      <h2>Create Expense</h2>
      <form className='max-w-xl m-auto'>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input type="text" id="title" placeholder="Title" />
          <Label htmlFor="amount">Amount</Label>
          <Input type="number" id="amount" placeholder="Amount" />
          <Button type="submit" className='mt-4'>Create Expense</Button>
        </div>
      </form>
    </div>
  )
}
