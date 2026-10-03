// frontend/src/components/LocationPicker.tsx
import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner' // we assume a simple spinner

export interface LocationPicked {
  lat: number
  lng: number
  address: string
}

export interface LocationPickerProps {
  onSelect: (loc: LocationPicked) => void
  placeholder?: string
  label?: string
}

export default function LocationPicker({
  onSelect,
  placeholder = 'Search for a place…',
  label = 'Location',
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)

  // Load Google Maps script only once
  useEffect(() => {
    if (document.getElementById('google-maps')) return
    const script = document.createElement('script')
    script.id = 'google-maps'
    // The Vite env var is exposed as VITE_GOOGLE_MAPS_API_KEY during build.
    // The key is required only for Places autocomplete, no billing is forced.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setLoading(false)
    script.onerror = () => console.error('Google Maps script failed to load')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (loading || !inputRef.current || !window.google) return

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ['geocode'] },
    )

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry) return
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const address = place.formatted_address || place.name
      onSelect({ lat, lng, address })
    })
  }, [loading, onSelect])

  return (
    <div>
      {label && <label className='text-sm text-muted-foreground'>{label}</label>}
      <Input ref={inputRef} placeholder={placeholder} className='mt-1' />
      {loading && <Spinner size='sm' className='mt-2' />}
    </div>
  )
}
