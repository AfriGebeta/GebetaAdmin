import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from './data-table-pagination'
import Loader from '@/components/loader.tsx'
import { DataTableRowActions } from './data-table-row-actions'

import useLocalStorage from '@/hooks/use-local-storage'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  fetching: boolean
  onEdit: (profile: TData) => void
  onDelete: (profile: TData) => void
  onSetToken: () => void
  onUpdateDate: () => void
  count: number
  pagination: PaginationState
  onPaginationChange: (value: PaginationState) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  fetching,
  count,
  pagination,
  onPaginationChange,
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(count / pagination.pageSize),
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: onPaginationChange as OnChangeFn<PaginationState>,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {fetching ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 items-center justify-center text-center'
                >
                  <Loader />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DataTableRowActions
                      row={row}
                      apiAccessToken={String(apiAccessToken)}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 items-center justify-center text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} count={count} />
    </div>
  )
}
