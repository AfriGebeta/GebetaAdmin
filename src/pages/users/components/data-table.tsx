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
  onSetToken: (profile: any) => void
  onUpdateDate: (profile: any) => void
  onResetPassword: (profile: any) => void
  onBuyBundle: (profile: any) => void
  onShowUsage: (profile: any) => void
  onUpdateScope: (profile: any) => void
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
  onSetToken,
  onUpdateDate,
  onResetPassword,
  onShowUsage,
  onBuyBundle,
  onUpdateScope,
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
                      onUpdateDate={onUpdateDate}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onSetToken={onSetToken}
                      onResetPassword={onResetPassword}
                      onShowUsage={onShowUsage}
                      onBuyBundle={onBuyBundle}
                      onUpdateScope={onUpdateScope}
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
