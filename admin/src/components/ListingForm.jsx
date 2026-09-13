import { useState } from 'react'

const empty = {
  title: '',
  location: '',
  description: '',
  bedrooms: '',
  bathrooms: '',
  guests: '',
  type: 'Entire home',
  price: '',
  amenities: 'Wifi, Kitchen, TV',
  weeklyDiscount: '10',
  cleaningFee: '100',
  serviceFee: '80',
  occupancyTaxes: '40'
}

const ListingForm = ({ initial, onSubmit, submitLabel, busy, error }) => {
  const [form, setForm] = useState({ ...empty, ...(initial || {}) })
  const [files, setFiles] = useState(null)
  const [localError, setLocalError] = useState(null)

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError(null)

    const required = ['title', 'location', 'description', 'bedrooms', 'bathrooms', 'guests', 'type', 'price']
    for (const key of required) {
      if (!form[key] && form[key] !== 0) {
        setLocalError('Please fill in ' + key)
        return
      }
    }

    const data = new FormData()
    Object.keys(form).forEach((key) => {
      if (key === 'images') return
      data.append(key, form[key])
    })
    if (files) {
      Array.from(files).forEach((file) => data.append('images', file))
    }

    onSubmit(data)
  }

  return (
    <form className="listing-form" onSubmit={handleSubmit}>
      <label>Title
        <input name="title" value={form.title} onChange={change} />
      </label>
      <label>Location
        <input name="location" value={form.location} onChange={change} placeholder="Cape Town" />
      </label>
      <label>Description
        <textarea name="description" value={form.description} onChange={change} rows="4" />
      </label>
      <div className="form-row">
        <label>Bedrooms
          <input type="number" min="1" name="bedrooms" value={form.bedrooms} onChange={change} />
        </label>
        <label>Bathrooms
          <input type="number" min="1" name="bathrooms" value={form.bathrooms} onChange={change} />
        </label>
        <label>Guests
          <input type="number" min="1" name="guests" value={form.guests} onChange={change} />
        </label>
      </div>
      <div className="form-row">
        <label>Type
          <select name="type" value={form.type} onChange={change}>
            <option>Entire home</option>
            <option>Apartment</option>
            <option>Private room</option>
            <option>Guest suite</option>
            <option>Unique stay</option>
          </select>
        </label>
        <label>Price per night
          <input type="number" min="1" name="price" value={form.price} onChange={change} />
        </label>
      </div>
      <label>Amenities (comma separated)
        <input name="amenities" value={form.amenities} onChange={change} />
      </label>
      <label>Images
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      </label>
      <div className="form-row">
        <label>Weekly discount %
          <input type="number" min="0" name="weeklyDiscount" value={form.weeklyDiscount} onChange={change} />
        </label>
        <label>Cleaning fee
          <input type="number" min="0" name="cleaningFee" value={form.cleaningFee} onChange={change} />
        </label>
      </div>
      <div className="form-row">
        <label>Service fee
          <input type="number" min="0" name="serviceFee" value={form.serviceFee} onChange={change} />
        </label>
        <label>Occupancy taxes
          <input type="number" min="0" name="occupancyTaxes" value={form.occupancyTaxes} onChange={change} />
        </label>
      </div>
      <button className="coral-btn" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
      {(localError || error) && <p className="error">{localError || error}</p>}
    </form>
  )
}

export default ListingForm