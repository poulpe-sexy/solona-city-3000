import { useEffect } from 'react'
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet'
import type { LatLngBoundsExpression, Map as LeafletMap } from 'leaflet'
import MapController from './MapController'
import type { City } from '../types'

const FRANCE_CENTER: [number, number] = [46.5, 2.5]
const FRANCE_BOUNDS: LatLngBoundsExpression = [[41, -5.5], [51.5, 10]]

function MapRefSetter({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap()
  useEffect(() => { mapRef.current = map }, [map, mapRef])
  return null
}

interface Props {
  selectedCity: City | null
  mapRef: React.MutableRefObject<LeafletMap | null>
  onFlyComplete: () => void
}

export default function FranceMap({ selectedCity, mapRef, onFlyComplete }: Props) {
  return (
    <MapContainer
      center={FRANCE_CENTER}
      zoom={6}
      minZoom={5}
      maxZoom={12}
      maxBounds={FRANCE_BOUNDS}
      maxBoundsViscosity={1.0}
      zoomControl={false}
      className="h-screen w-screen"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="bottomright" />
      <MapRefSetter mapRef={mapRef} />
      <MapController selectedCity={selectedCity} onFlyComplete={onFlyComplete} />
    </MapContainer>
  )
}
