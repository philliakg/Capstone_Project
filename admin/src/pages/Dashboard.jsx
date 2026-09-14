import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL, imgUrl } from '../api'

const Dashboard = () => {
  const { user } = useAuthContext()
  const [listings, setListings] = useState([])
  const [error, setError] = useState(null)

  const load = async () => {
    const res = await fetch(API_URL + '/api/accommodations')
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      const mine = json.filter((item) => String(item.host_id) === String(user._id) || item.host === user.username)
      setListings(mine)
    }
  }

  useEffect(() => {
    load()
  }, [user])

  const remove = async (id) => {
    if (!window.confirm('Delete this listing?')) return
    const res = await fetch(API_URL + '/api/accommodations/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + user.token }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      setListings((prev) => prev.filter((item) => item._id !== id))
    }
  }

  return (
    <div className="page">
      <h1>Your listings</h1>
      {error && <p className="error">{error}</p>}
      <div className="listing-list">
        {listings.map((item) => (
          <article key={item._id} className="listing-card">
            <img src={imgUrl(item.images && item.images[0])} alt={item.title} />
            <div className="listing-body">
              <p className="eyebrow">{item.type} in {item.location}</p>
              <h3>{item.title}</h3>
              <p className="meta-line">{item.guests} guests · {item.bedrooms} beds · {item.bathrooms} baths</p>
              <div className="listing-foot">
                <p className="stars">{item.rating} <span className="star">★</span> <span className="muted">({item.reviews} reviews)</span></p>
                <p className="price"><strong>${item.price}</strong> <span className="muted">/night</span></p>
              </div>
              <div className="row-actions">
                <Link to={'/update/' + item._id}>Update</Link>
                <button type="button" onClick={() => remove(item._id)}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {listings.length === 0 && <p>No listings yet. Create your first stay.</p>}
    </div>
  )
}

export default Dashboard
