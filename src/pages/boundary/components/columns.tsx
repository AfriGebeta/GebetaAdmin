//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Boundary } from '@/model'
import MapModal from './MapModal'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const columns: ColumnDef<Boundary>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p>{row.original?.name}</p>
    },
  },
  {
    accessorKey: 'bounds',
    header: 'Bounds',
    cell: ({ row }) => {
      const [showMap, setShowMap] = useState(false)
      const handleShowMap = () => setShowMap(true)
      const handleCloseMap = () => setShowMap(false)
      return (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={handleShowMap}
                  disabled={!row.original?.bounds}
                >
                  Map
                </Button>
              </TooltipTrigger>
              {
                <TooltipContent>
                  {!row.original?.bounds
                    ? 'No bounds available'
                    : 'View on map'}
                </TooltipContent>
              }
            </Tooltip>
          </TooltipProvider>

          {showMap && (
            <MapModal
              isOpen={showMap}
              onClose={handleCloseMap}
              coordinates={row.original.bounds || []}
            />
          )}
        </>
      )
    },
  },
  {
    accessorKey: 'center',
    header: 'Center',
  },
  {
    accessorKey: 'radius',
    header: 'Radius',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
]
