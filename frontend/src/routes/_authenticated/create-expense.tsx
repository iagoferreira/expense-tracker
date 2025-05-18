import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { createExpense, getAllExpensesQueryOptions, loadingCreateExpenseQueryOptions } from '@/lib/api'
import { expenseSchema } from '@shared/types'
import { Calendar } from "@/components/ui/calendar"
import { useQueryClient } from "@tanstack/react-query";
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/create-expense')({
  component: CreateExpense,
})

type FieldError = string | { message: string };

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>
          {field.state.meta.errors
            .map((err: FieldError) =>
              typeof err === "string" ? err : err?.message
            )
            .join(", ")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function CreateExpense() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: '0',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingExpenses = await queryClient.ensureQueryData(getAllExpensesQueryOptions);

      navigate({ to: '/expenses' })

      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, { expense: value });

      try {
        const createdExpense = await createExpense({ value });

        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
          ...existingExpenses,
          expenses: [createdExpense, ...existingExpenses.expenses]
        })

        toast("Expense created", {
          description: `Successfully created expense with id ${createdExpense.id}`,
        })
      } catch (e) {
        console.error(e);
        toast("Error", {
          description: "Failed to create expense",
        })
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {});
      }
    },
  })

  return (
    <div>
      <form className='max-w-xl m-auto'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <form.Field
            name="title"
            validators={{ onChange: expenseSchema.shape.title }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Title</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
          <form.Field
            name="amount"
            validators={{ onChange: expenseSchema.shape.amount }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <>
                  <Label htmlFor={field.name}>Amount</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    type="number"
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )
            }}
          />
          <form.Field
            name="date"
            validators={{ onChange: expenseSchema.shape.date }}
            children={(field) => {
              // Avoid hasty abstractions. Render props are great!
              return (
                <div className="flex flex-col items-center mt-4">
                  <Calendar
                    mode="single"
                    selected={new Date(field.state.value)}
                    onSelect={(date) =>
                      field.handleChange((date ?? new Date()).toISOString())
                    }
                    className="rounded-md border shadow"
                  />
                  <FieldInfo field={field} />
                </div>
              )
            }}
          />
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isFieldsValidating
            ]}
            children={([
              canSubmit,
              isSubmitting,
              isFieldsValidating
            ]) => (
              <Button className='mt-4' type="submit" disabled={!canSubmit}>
                {isFieldsValidating ?
                  'Validating...'
                  : isSubmitting
                    ? 'Submitting...'
                    : 'Create Expense'}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  )
}
