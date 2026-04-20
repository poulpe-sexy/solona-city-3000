import { useEffect } from 'react'
import { useMap, Marker } from 'react-leaflet'
import L from 'leaflet'
import type { City } from '../types'

const redIcon = L.divIcon({
  className: '',
  html: '<div style="width:18px;height:18px;background:#ef4444;border-radius:50%;border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.45)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

interface Props {
  selectedCity: City | null
}

export default function MapController({ selectedCity }: Props) {
  const map = useMap()

  useEffect(() => {
    if (selectedCity) {
      map.flyTo([selectedCity.lat, selectedCity.lng], 11)
    }
  }, [selectedCity, map])

  if (!selectedCity) return null

  return (
    <Marker
      position={[selectedCity.lat, selectedCity.lng]}
      icon={redIcon}
    />
  )
}
