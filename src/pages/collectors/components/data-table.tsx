//@ts-nocheck
import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  PaginationState,
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
import { DataTableToolbar } from './data-table-toolbar'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/button.tsx'
import Loader from '@/components/loader.tsx'
import { DataTableRowActions } from './data-table-row-actions'

import useLocalStorage from '@/hooks/use-local-storage'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onFetch,
  fetching,
  onToggleActivation,
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue> & {
  fetching: boolean
  onFetch: () => Promise<void>
  onToggleActivation: (id: string, isActive: boolean) => void
  onEdit: (profile: TData) => void
  onDelete: (profile: TData) => void
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const [apiAccessToken, __] = useLocalStorage({
    key: 'apiAccessToken',
    defaultValue: null,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                      apiAccessToken={apiAccessToken}
                      onToggleActivation={onToggleActivation}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    ></DataTableRowActions>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 items-center justify-center text-center'
                >
                  No results. <br />
                  <Button
                    variant={'outline'}
                    className={'mt-1'}
                    disabled={fetching}
                    onClick={onFetch}
                  >
                    Try to fetch
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
