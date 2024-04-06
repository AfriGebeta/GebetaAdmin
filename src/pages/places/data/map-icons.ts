import { Icon, Point } from 'leaflet'
import { PlaceType } from '@/model'

export const iconDwelling = new Icon({
  iconUrl: 'https://img.icons8.com/color/48/home--v1.png',
  iconRetinaUrl: 'https://img.icons8.com/color/48/home--v1.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconBank = new Icon({
  iconUrl: 'https://img.icons8.com/dusk/48/bank.png',
  iconRetinaUrl: 'https://img.icons8.com/dusk/48/bank.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconSupermarket = new Icon({
  iconUrl: 'https://img.icons8.com/arcade/48/grocery-store.png',
  iconRetinaUrl: 'https://img.icons8.com/arcade/48/grocery-store.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconHospital = new Icon({
  iconUrl:
    'https://img.icons8.com/office/48/hospital.pnghttps://img.icons8.com/office/48/hospital.png',
  iconRetinaUrl:
    'https://img.icons8.com/office/48/hospital.pnghttps://img.icons8.com/office/48/hospital.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconClinic = new Icon({
  iconUrl: 'https://img.icons8.com/officel/48/clinic.png',
  iconRetinaUrl: 'https://img.icons8.com/officel/48/clinic.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconPharmacy = new Icon({
  iconUrl: 'https://img.icons8.com/arcade/48/pharmacy-shop.png',
  iconRetinaUrl: 'https://img.icons8.com/arcade/48/pharmacy-shop.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconSchool = new Icon({
  iconUrl: 'https://img.icons8.com/plasticine/48/school.png',
  iconRetinaUrl: 'https://img.icons8.com/plasticine/48/school.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconRestaurant = new Icon({
  iconUrl: 'https://img.icons8.com/officel/48/restaurant-building.png',
  iconRetinaUrl: 'https://img.icons8.com/officel/48/restaurant-building.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconPark = new Icon({
  iconUrl: 'https://img.icons8.com/color/48/national-park.png',
  iconRetinaUrl: 'https://img.icons8.com/color/48/national-park.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconOffice = new Icon({
  iconUrl: 'https://img.icons8.com/color/48/link-company-parent.png',
  iconRetinaUrl: 'https://img.icons8.com/color/48/link-company-parent.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconTransportationStation = new Icon({
  iconUrl:
    'https://img.icons8.com/external-flaticons-flat-flat-icons/48/external-station-weather-flaticons-flat-flat-icons.png',
  iconRetinaUrl:
    'https://img.icons8.com/external-flaticons-flat-flat-icons/48/external-station-weather-flaticons-flat-flat-icons.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconOther = new Icon({
  iconUrl: 'https://img.icons8.com/fluency/48/map-pin.png',
  iconRetinaUrl: 'https://img.icons8.com/fluency/48/map-pin.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconCurrent = new Icon({
  iconUrl: 'https://img.icons8.com/3d-fluency/48/map-pin.png',
  iconRetinaUrl: 'https://img.icons8.com/3d-fluency/48/map-pin.png',
  crossOrigin: true,
  iconSize: new Point(48, 48),
})

export const iconMap: { [key: PlaceType]: Icon } = {
  [PlaceType.DWELLING]: iconDwelling,
  [PlaceType.BANK]: iconBank,
  [PlaceType.SUPERMARKET]: iconSupermarket,
  [PlaceType.HOSPITAL]: iconHospital,
  [PlaceType.CLINIC]: iconClinic,
  [PlaceType.PHARMACY]: iconPharmacy,
  [PlaceType.SCHOOL]: iconSchool,
  [PlaceType.RESTAURANT]: iconRestaurant,
  [PlaceType.PARK]: iconPark,
  [PlaceType.OFFICE]: iconOffice,
  [PlaceType.TRANSPORTATION_STATION]: iconTransportationStation,
  [PlaceType.OTHER]: iconOther,
}
