import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../api'

const FALLBACK = ['New York', 'Paris', 'Tokyo', 'Cape Town', 'Thailand']

const SearchBar = () => {
  const navigate = useNavigate()
  const [locations, setLocations] = useState(FALLBACK)
  const [location, setLocation] = useState('all')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)

  useEffect(() => {
    fetch(API_URL + '/api/accommodations')
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return
        const unique = [...new Set(data.map((item) => item.location).filter(Boolean))]
        if (unique.length) setLocations(unique)
      })
      .catch(() => {})
  }, [])

  const runSearch = (placeValue) => {
    const place = placeValue || location || 'all'
    const qs = new URLSearchParams()
    if (checkIn) qs.set('checkIn', checkIn)
    if (checkOut) qs.set('checkOut', checkOut)
    if (guests) qs.set('guests', String(guests))
    const query = qs.toString()
    navigate('/location/' + encodeURIComponent(place) + (query ? '?' + query : ''))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    runSearch(location)
  }

  const onLocationChange = (e) => {
    const nextLocation = e.target.value
    setLocation(nextLocation)
    runSearch(nextLocation)
  }

  return (
    <form className="search-bar" onSubmit={onSubmit}>
      <label className="search-field">
        Location
        <select value={location} onChange={onLocationChange} aria-label="Location">
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </label>
      <label className="search-field">
        Check in
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
      </label>
      <label className="search-field">
        Check out
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
      </label>
      <div className="search-field guests-field">
        <span>Guests</span>
        <div className="guest-stepper">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, Number(g) - 1))} aria-label="Fewer guests">−</button>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
            aria-label="Guests"
          />
          <button type="button" onClick={() => setGuests((g) => Number(g) + 1)} aria-label="More guests">+</button>
        </div>
      </div>
      <button type="submit" className="search-go" aria-label="Search">
        <svg viewBox="0 0 32 32" width="16" height="16" aria-hidden="true">
          <circle cx="14" cy="14" r="8" fill="none" stroke="#fff" strokeWidth="3" />
          <path d="M20 20 L27 27" fill="none" stroke="#fff" strokeWidth="3" />
        </svg>
      </button>
    </form>
  )
}

export default SearchBar
