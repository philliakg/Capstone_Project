import { useEffect, useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL } from '../api'

const fmt = (d) => {
  const x = new Date(d)
  if (Number.isNaN(x.getTime())) return ''
  const dd = String(x.getDate()).padStart(2, '0')
  const mm = String(x.getMonth() + 1).padStart(2, '0')
  return dd + '/' + mm + '/' + x.getFullYear()
}

const Reservations = () => {
  const { user } = useAuthContext()
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(API_URL + '/api/reservations/host', {
        headers: { Authorization: 'Bearer ' + user.token }
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error)
      } else {
        setRows(json)
      }
    }
    load()
  }, [user])

  const cancel = async (id) => {
    const res = await fetch(API_URL + '/api/reservations/' + id, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + user.token }
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
    } else {
      setRows((prev) => prev.filter((r) => r._id !== id))
    }
  }

  return (
    <div className="page">
      <h1>My Reservations</h1>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && <p>No reservations on your listings yet.</p>}
      {rows.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booked by</th>
                <th>Property</th>
                <th>Checkin</th>
                <th>Checkout</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.user ? r.user.username : 'Guest'}</td>
                  <td>{r.accommodation ? r.accommodation.title : 'Removed'}</td>
                  <td>{fmt(r.checkIn)}</td>
                  <td>{fmt(r.checkOut)}</td>
                  <td>
                    <button type="button" className="coral-btn small" onClick={() => cancel(r._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Reservations
