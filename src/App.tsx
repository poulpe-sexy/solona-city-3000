import { useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import FranceMap from './components/FranceMap'
import DartAnimation from './components/DartAnimation'
import HudCard from './components/HudCard'
import CityModal from './components/CityModal'
import { useCities } from './hooks/useCities'
import type { City } from './types'

function pickWeightedRandom(cities: City[]): City {
  const weights = cities.map(c => Math.sqrt(c.population))
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < cities.length; i++) {
    r -= weights[i]
    if (r <= 0) return cities[i]
  }
  return cities[cities.length - 1]
}

interface AnimState {
  city: City
  from: { x: number; y: number }
  to: { x: number; y: number }
}

export default function App() {
  const { cities, isLoading } = useCities()
  const mapRef = useRef<LeafletMap | null>(null)
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [animState, setAnimState] = useState<AnimState | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const isAnimating = animState !== null

  function handleLaunch() {
    const map = mapRef.current
    if (!map) return
    const city = pickWeightedRandom(cities)
    map.setView([46.5, 2.5], 6, { animate: false })
    const containerPt = map.latLngToContainerPoint([city.lat, city.lng])
    const rect = map.getContainer().getBoundingClientRect()
    setModalOpen(false)
    setAnimState({
      city,
      from: { x: window.innerWidth / 2, y: 60 },
      to: { x: containerPt.x + rect.left, y: containerPt.y + rect.top },
    })
  }

  function handleAnimComplete() {
    if (!animState) return
    setSelectedCity(animState.city)
    setAnimState(null)
  }

  function handleFlyComplete() {
    setModalOpen(true)
  }

  function handleModalClose() {
    setSelectedCity(null)
    setModalOpen(false)
  }

  return (
    <div className="relative h-screen w-screen">
      <FranceMap
        selectedCity={selectedCity}
        mapRef={mapRef}
        onFlyComplete={handleFlyComplete}
      />

      {animState && (
        <DartAnimation
          from={animState.from}
          to={animState.to}
          onComplete={handleAnimComplete}
        />
      )}

      {modalOpen && selectedCity && (
        <CityModal city={selectedCity} onClose={handleModalClose} />
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <HudCard
          selectedCity={selectedCity}
          cityCount={cities.length}
          isDisabled={isLoading || isAnimating || modalOpen}
          isAnimating={isAnimating}
          onLaunch={handleLaunch}
        />
      </div>
    </div>
  )
}
