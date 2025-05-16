import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import type { AnyFieldApi } from '@tanstack/react-form'
import { api } from '@/lib/api'
import { expenseSchema } from '@shared/types'
import { Calendar } from "@/components/ui/calendar"

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
  const navigate = useNavigate()
  const form = useForm({
    defaultValues: {
      title: '',
      amount: '0',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const res = await api.expenses.$post({ json: value })
      if (!res.ok) {
        throw new Error('Failed to create expense')
      }
      navigate({ to: '/expenses' })
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
