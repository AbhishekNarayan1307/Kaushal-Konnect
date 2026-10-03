// frontend/src/hooks/useLocations.ts
import { useState, useEffect } from 'react'
import { API_BASE_URL } from '@/lib/api'
import { toast } from 'sonner'

export interface SavedLocation {
  id: string
  name: string
  address?: string
  latitude?: number
  longitude?: number
}

export function useLocations(userId: string | null) {
  const [locations, setLocations] = useState<SavedLocation[]>([])
  const [loading, setLoading] = useState(false)

  const fetchLocations = async () => {
  if (!userId) {
    setLocations([])
    setLoading(false)
    return
  }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/locations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
      })
      if (!res.ok) throw new Error('Failed to fetch locations')
      const data = await res.json()
      setLocations(data)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [userId])

  const addLocation = async (payload: Omit<SavedLocation, 'id'>) => {
    const res = await fetch(`${API_BASE_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to add location')
    await fetchLocations()
  }

  const updateLocation = async (id: string, payload: Omit<SavedLocation, 'id'>) => {
    const res = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update location')
    await fetchLocations()
  }

  const deleteLocation = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/locations/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
    })
    if (!res.ok) throw new Error('Failed to delete location')
    await fetchLocations()
  }

  return {
    locations,
    loading,
    addLocation,
    updateLocation,
    deleteLocation,
    refresh: fetchLocations,
  }
}
