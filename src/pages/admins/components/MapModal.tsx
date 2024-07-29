import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Boundary } from '@/model'
import { MapContainer, TileLayer, Polyline } from 'react-leaflet'

interface MapModalProps {
  isOpen: boolean
  onClose: () => void
  coordinates: Boundary
}

const MapModal: React.FC<MapModalProps> = ({
  isOpen,
  onClose,
  coordinates,
}) => {
  const polyline = coordinates.map((coord) => [coord.latitude, coord.longitude])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collection Boundary</DialogTitle>
        </DialogHeader>
        <div className='h-96'>
          <MapContainer center={polyline[0]} zoom={13} className='h-full'>
            <TileLayer
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline positions={polyline} />
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MapModal
