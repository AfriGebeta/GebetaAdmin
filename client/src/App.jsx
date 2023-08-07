import React from 'react'
import { MapArea, SideBar, SigninLeftImage, SigninRightForm } from './components'
import {Dashboard, SigninPage} from "./pages"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';



const App = () => {
  return (
    <div>
      <MapArea/>
    </div>
  );
};

export default App