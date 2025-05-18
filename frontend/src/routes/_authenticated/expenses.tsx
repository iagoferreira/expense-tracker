import { createFileRoute } from '@tanstack/react-router'
import {
  deleteExpense,
  getAllExpenses,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions
} from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'


export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function DeleteButton({ id }: { id: number }) {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: (e) => {
      console.log(e);
      toast("Error", {
        description: `Failed to delete expense: ${id}`,
      })
    },
    onSuccess: () => {
      toast("Success", {
        description: `Successfully deleted expense: ${id}`,
      })
      queryClient.setQueryData(
        getAllExpensesQueryOptions.queryKey,
        (existingExpenses) => ({
          ...existingExpenses,
          expenses: existingExpenses!.expenses.filter((e) => e.id !== id)
        }))
    },
  })

  return <Button
    disabled={mutation.isPending}
    variant="outline"
    size="icon"
    onClick={() => { mutation.mutate({ id }) }}
  >
    {mutation.isPending
      ? <Skeleton className="h-9 w-9 rounded-lg py-1">
        ...
      </Skeleton>
      : <Trash />
    }
  </Button >
    ;
}

function Expenses() {
  const { isPending, error, data } = useQuery(getAllExpensesQueryOptions);
  const {
    data: loadingCreateExpense,
  } = useQuery(loadingCreateExpenseQueryOptions);

  type GetAllExpensesReturnType = Awaited<ReturnType<typeof getAllExpenses>>;
  type Expense = GetAllExpensesReturnType['expenses'][number];

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'delete',
      header: 'Delete',
      cell: ({ row }) => <DeleteButton id={row.original.id} />
    }
  ];

  const table = useReactTable({
    data: data?.expenses ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return 'An error has occurred: ' + error.message;

  return <div className="rounded-md border max-w-3xl m-auto">
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {loadingCreateExpense?.expense && (
          <TableRow>
            <TableCell className='w-24'>
              <Skeleton className="h-4" />
            </TableCell>
            <TableCell>
              {loadingCreateExpense.expense.title}
            </TableCell>
            <TableCell>
              {loadingCreateExpense.expense.amount}
            </TableCell>
            <TableCell>
              {loadingCreateExpense.expense.date.split('T')[0]}
            </TableCell>
            <TableCell className='w-24'>
              <Skeleton className="h-4" />
            </TableCell>
          </TableRow>
        )}
        {isPending ? (
          Array(6).fill(0).map((_, i) => (
            <TableRow key={i}>
              <TableCell className='w-24'>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4" />
              </TableCell>
            </TableRow>
          ))
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
}
