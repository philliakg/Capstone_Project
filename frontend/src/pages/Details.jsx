import { useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL, imgUrl } from '../api'

const nightCount = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  const ms = b - a
  if (ms <= 0) return 0
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

const Details = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const { data: listing, error, loading } = useFetch(API_URL + '/api/accommodations/' + id)
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '')
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '')
  const [guests, setGuests] = useState(Number(searchParams.get('guests')) || 1)
  const [message, setMessage] = useState(null)
  const [busy, setBusy] = useState(false)

  const nights = nightCount(checkIn, checkOut)

  const calc = useMemo(() => {
    if (!listing || listing.error) {
      return { subtotal: 0, discount: 0, total: 0 }
    }
    const subtotal = listing.price * nights
    const discount = nights >= 7 ? Math.round(subtotal * (listing.weeklyDiscount / 100)) : 0
    const total = subtotal - discount + listing.cleaningFee + listing.serviceFee + listing.occupancyTaxes
    return { subtotal, discount, total }
  }, [listing, nights])

  const loginRedirect = () => {
    const qs = new URLSearchParams()
    qs.set('redirect', '/accommodations/' + id)
    if (checkIn) qs.set('checkIn', checkIn)
    if (checkOut) qs.set('checkOut', checkOut)
    if (guests) qs.set('guests', String(guests))
    navigate('/login?' + qs.toString())
  }

  const reserve = async (e) => {
    e.preventDefault()
    setMessage(null)

    if (!user) {
      setMessage('Please log in to make a reservation')
      window.alert('Please log in to make a reservation')
      loginRedirect()
      return
    }
    if (!nights) {
      setMessage('Please choose valid check-in and check-out dates')
      return
    }
    if (guests < 1) {
      setMessage('Please add at least 1 guest')
      return
    }
    if (listing && guests > listing.guests) {
      setMessage('This stay allows up to ' + listing.guests + ' guests')
      return
    }

    setBusy(true)
    const res = await fetch(API_URL + '/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user.token
      },
      body: JSON.stringify({
        accommodation: listing._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        nights,
        price: listing.price,
        weeklyDiscount: calc.discount,
        cleaningFee: listing.cleaningFee,
        serviceFee: listing.serviceFee,
        occupancyTaxes: listing.occupancyTaxes,
        grandTotal: calc.total
      })
    })
    const json = await res.json()
    setBusy(false)
    if (!res.ok) {
      setMessage(json.error)
    } else {
      window.alert('Reservation created')
      navigate('/reservations')
    }
  }

  if (loading) return <div className="page">Loading…</div>
  if (error || !listing || listing.error) return <div className="page error">{error || (listing && listing.error) || 'Not found'}</div>

  const photos = (listing.images || []).map(imgUrl)
  while (photos.length < 5) photos.push(photos[0] || '/images/RoomImage1.png')

  const beds = listing.bedrooms || 1
  const baths = listing.bathrooms || 1

  return (
    <div className="page details">
      <div className="details-title-row">
        <div>
          <h1>{listing.title}</h1>
          <p className="details-meta">
            <span className="star">★</span> {listing.rating} · <u>{listing.reviews} reviews</u> · <u>{listing.location}</u>
          </p>
        </div>
        <div className="share-save">
          <button type="button">Share</button>
          <button type="button">♡ Save</button>
        </div>
      </div>

      <div className="gallery">
        <img className="gallery-main" src={photos[0]} alt={listing.title} />
        <div className="gallery-grid">
          <img src={photos[1]} alt="" />
          <img src={photos[2]} alt="" />
          <img src={photos[3]} alt="" />
          <img src={photos[4]} alt="" />
        </div>
        <button type="button" className="show-photos">Show all photos</button>
      </div>

      <div className="details-layout">
        <div className="details-left">
          <div className="host-head">
            <div>
              <p className="host-line">{listing.type} hosted by {listing.host}</p>
              <p className="muted">{listing.guests} guests · {listing.bedrooms} bedroom{listing.bedrooms === 1 ? '' : 's'} · {beds} bed{beds === 1 ? '' : 's'} · {baths} bath{baths === 1 ? '' : 's'}</p>
            </div>
            <img className="host-avatar" src="/images/Avatar.png" alt="" />
          </div>

          <section className="feature-list">
            <div className="feature">
              <span className="feature-ico" aria-hidden="true">⌂</span>
              <div>
                <strong>Entire home</strong>
                <p>You'll have the place to yourself</p>
              </div>
            </div>
            {listing.enhancedCleaning && (
              <div className="feature">
                <span className="feature-ico" aria-hidden="true">✦</span>
                <div>
                  <strong>Enhanced Clean</strong>
                  <p>This host committed to Airbnb's enhanced cleaning process. <span className="show-more">Show more</span></p>
                </div>
              </div>
            )}
            {listing.selfCheckIn && (
              <div className="feature">
                <span className="feature-ico" aria-hidden="true">🔑</span>
                <div>
                  <strong>Self check-in</strong>
                  <p>Check yourself in with the keypad.</p>
                </div>
              </div>
            )}
          </section>

          <section>
            <p>{listing.description}</p>
            <p className="show-more">Show more ›</p>
          </section>

          <section>
            <img src="/images/WhereYoullSleep.png" alt="Where you'll sleep" />
          </section>

          <section>
            <img src="/images/WhereYoullSleep1.png" alt="What this place offers" />
          </section>

          <section>
            <img src="/images/Reviews.png" alt="Reviews" />
          </section>

          <section>
            <img src="/images/AboutTheHost.png" alt="About the host" />
          </section>

          <section>
            <img src="/images/ThingsToKnow.png" alt="Things to know" />
          </section>
        </div>

        <div className="cost-col">
          <aside className="cost-card">
            <div className="cost-top">
              <p className="price-line"><strong>${listing.price}</strong> <span className="per">/ night</span></p>
              <p className="cost-rating"><span className="star">★</span> {listing.rating} · <u>{listing.reviews} reviews</u></p>
            </div>
            <form onSubmit={reserve}>
              <div className="book-box">
                <div className="date-row">
                  <label>
                    CHECK-IN
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </label>
                  <label>
                    CHECKOUT
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </label>
                </div>
                <label className="guests-box">
                  GUESTS
                  <input type="number" min="1" max={listing.guests} value={guests} onChange={(e) => setGuests(e.target.value)} />
                </label>
              </div>
              <button className="coral-btn" disabled={busy}>{busy ? 'Reserving…' : 'Reserve'}</button>
            </form>
            <p className="not-charged">You won't be charged yet</p>
            {nights > 0 && (
              <ul className="cost-list">
                <li><span>${listing.price} x {nights} nights</span><span>${calc.subtotal}</span></li>
                {calc.discount > 0 && <li className="discount"><span>Weekly discount</span><span>-${calc.discount}</span></li>}
                <li><span>Cleaning fee</span><span>${listing.cleaningFee}</span></li>
                <li><span>Service fee</span><span>${listing.serviceFee}</span></li>
                <li><span>Occupancy taxes and fees</span><span>${listing.occupancyTaxes}</span></li>
                <li className="total"><span>Total</span><span>${calc.total}</span></li>
              </ul>
            )}
            {message && (
              <p className={message === 'Please log in to make a reservation' ? 'reserve-warning' : 'error'}>
                {message}
              </p>
            )}
          </aside>
          <p className="report-listing">⚑ Report this listing</p>
        </div>
      </div>
    </div>
  )
}

export default Details
