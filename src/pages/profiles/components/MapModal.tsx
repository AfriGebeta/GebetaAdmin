//@ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import { useEffect, useMemo } from 'react'
import 'leaflet/dist/leaflet.css'

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  coordinates: string[]
}

const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  coordinates,
}) => {
  const polylinePositions = useMemo(
    () =>
      coordinates.map((coord) => {
        const [latitude, longitude] = coord.split(' ').map(Number)
        return [latitude, longitude]
      }),
    [coordinates]
  )

  // Calculate the center of the polyline
  const center = useMemo(() => {
    if (polylinePositions.length === 0) return [0, 0]

    const total = polylinePositions.reduce(
      (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
      [0, 0]
    )

    return [
      total[0] / polylinePositions.length,
      total[1] / polylinePositions.length,
    ]
  }, [polylinePositions])

  const MapContent = () => {
    const map = useMap()

    useEffect(() => {
      if (polylinePositions.length > 0) {
        const bounds = polylinePositions.map((pos) => [pos[0], pos[1]])
        map.fitBounds(bounds)
      }
    }, [map, polylinePositions])

    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Map View</DialogTitle>
        </DialogHeader>
        <div className='h-64'>
          <MapContainer
            center={center}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={polylinePositions} color='blue' />
            <MapContent />
          </MapContainer>
        </div>
        <Button onClick={onClose} className='mt-4'>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default MapModal
