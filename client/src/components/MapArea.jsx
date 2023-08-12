import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
const default_latitude = 9.02151;
const default_longitude = 38.80115;

const MapArea = () => (
    <div className='w-[400px] h-[400px] ss:w-[600px] ss:h-[450px] md:w-[1000px] rounded-[20px]'>
      <div className="leaflet-container">
        <MapContainer center={[default_latitude, default_longitude]} zoom={18}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
)

export default MapArea