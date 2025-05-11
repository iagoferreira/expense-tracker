import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
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


export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

function Expenses() {
  async function getAllExpenses() {
    await new Promise((r) => setTimeout(r, 1000));
    const response = await api.expenses.$get();

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    return data;
  }

  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses
  });

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
