//@ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import { useEffect, useMemo, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

import { Fullscreen } from 'lucide-react'

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
  const mapRef = useRef(null)

  const polylinePositions = useMemo(
    () =>
      coordinates.map((coord) => {
        const [latitude, longitude] = coord.split(' ').map(Number)
        return [latitude, longitude]
      }),
    [coordinates]
  )

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

  const handleFullScreen = () => {
    if (mapRef.current) {
      if (!document.fullscreenElement) {
        mapRef.current.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-fit w-1/2'>
        <DialogHeader>
          <DialogTitle>Map View</DialogTitle>
        </DialogHeader>
        <div className='relative h-64' ref={mapRef}>
          <MapContainer
            center={center}
            zoom={18}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={polylinePositions} color='#ffa818' />
            <MapContent />
          </MapContainer>
          <button
            onClick={handleFullScreen}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 1000,
              background: 'white',
              borderRadius: '10px',
              border: 'none',
              padding: '10px',
              cursor: 'pointer',
            }}
          >
            <Fullscreen size={20} />
          </button>
        </div>
        <Button onClick={onClose} className='mt-4'>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default MapModal
