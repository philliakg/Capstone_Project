import { Link } from 'react-router-dom'
import { imgUrl } from '../api'

const ListingCard = ({ listing, queryString }) => {
  const photo = imgUrl(listing.images && listing.images[0])
  const amenityText = (listing.amenities || []).slice(0, 4).join(' · ')
  const extra = queryString ? '?' + queryString : ''
  const beds = listing.bedrooms || 1
  const baths = listing.bathrooms || 1
  const guests = listing.guests || 1

  return (
    <Link to={'/accommodations/' + listing._id + extra} className="listing-card">
      <img src={photo} alt={listing.title} />
      <div className="listing-body">
        <span className="heart" aria-hidden="true">♡</span>
        <p className="eyebrow">{listing.type} in {listing.location}</p>
        <h3>{listing.title}</h3>
        <span className="tiny-rule" />
        <p className="meta-line">{guests} guests · {listing.type} · {beds} bed{beds === 1 ? '' : 's'} · {baths} bath{baths === 1 ? '' : 's'}</p>
        <p className="amenities">{amenityText}</p>
        <div className="listing-foot">
          <p className="stars">{listing.rating} <span className="star">★</span> <span className="muted">({listing.reviews} reviews)</span></p>
          <p className="price"><strong>${listing.price}</strong> <span className="muted">/night</span></p>
        </div>
      </div>
    </Link>
  )
}

export default ListingCard
