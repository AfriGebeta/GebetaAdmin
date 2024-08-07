//@ts-nocheck
import { Button } from '@/components/ui/button'
import { Profile } from '@/model'
import MapModal from './MapModal'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      return <p>{row.original?.firstName + ' ' + row.original?.lastName}</p>
    },
  },
  {
    accessorKey: 'bounds',
    header: 'Bounds',
    cell: ({ row }) => {
      const [showMap, setShowMap] = useState(false)
      const handleShowMap = () => setShowMap(true)
      const handleCloseMap = () => setShowMap(false)
      console.lo
      return (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  onClick={handleShowMap}
                  disabled={!row.original?.collectionBoundary}
                >
                  Map
                </Button>
              </TooltipTrigger>
              {
                <TooltipContent>
                  {!row.original?.collectionBoundary
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
              coordinates={row.original.collectionBoundary?.bounds || []}
            />
          )}
        </>
      )
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'active',
    header: 'Active',
    cell: ({ row }) => {
      return <p>{row.original.active === true ? 'Active' : 'Inactive'}</p>
    },
  },
]
