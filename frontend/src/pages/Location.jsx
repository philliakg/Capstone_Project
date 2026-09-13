import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import { useFetch } from '../hooks/useFetch'
import { API_URL } from '../api'

const Location = () => {
  const { location } = useParams()
  const [searchParams] = useSearchParams()
  const isAll = (location || '').toLowerCase() === 'all'
  const url = isAll
    ? API_URL + '/api/accommodations'
    : API_URL + '/api/accommodations?location=' + encodeURIComponent(location)
  const { data, error, loading } = useFetch(url)
  const [maxPrice, setMaxPrice] = useState('')
  const queryString = searchParams.toString()

  const listings = (data || []).filter((item) => {
    if (!maxPrice) return true
    return item.price <= Number(maxPrice)
  })

  const placeName = isAll ? 'All locations' : location
  const count = listings.length
  const heading = loading
    ? 'Loading stays…'
    : count + ' stay' + (count === 1 ? '' : 's') + ' in ' + placeName

  return (
    <div className="page location-page">
      <h1 className="stays-heading">{heading}</h1>
      <div className="filter-pills">
        <button type="button" className="filter-pill">Free cancellation</button>
        <button type="button" className="filter-pill">Type of place</button>
        <label className="filter-pill price-pill">
          Price
          <input
            type="number"
            min="0"
            placeholder="Any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Max price"
          />
        </label>
        <button type="button" className="filter-pill">Instant Book</button>
        <button type="button" className="filter-pill">More filters</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="listing-list">
        {listings.map((listing) => (
          <ListingCard key={listing._id} listing={listing} queryString={queryString} />
        ))}
      </div>
      {!loading && listings.length === 0 && <p>No stays found for this location.</p>}
    </div>
  )
}

export default Location