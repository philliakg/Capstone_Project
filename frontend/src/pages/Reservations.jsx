import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL } from '../api'

const Reservations = () => {
  const { user, authIsReady } = useAuthContext()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authIsReady) return
    if (!user) {
      navigate('/login')
      return
    }
    const load = async () => {
      const res = await fetch(API_URL + '/api/reservations/user', {
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
  }, [user, authIsReady, navigate])

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

  const fmt = (d) => new Date(d).toLocaleDateString()

  if (!authIsReady) return <div className="page">Loading…</div>

  return (
    <div className="page">
      <h1>My reservations</h1>
      {error && <p className="error">{error}</p>}
      {rows.length === 0 && <p>You have no reservations yet.</p>}
      {rows.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Check in</th>
                <th>Check out</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id}>
                  <td>{r.accommodation ? r.accommodation.location : 'Listing removed'}</td>
                  <td>{fmt(r.checkIn)}</td>
                  <td>{fmt(r.checkOut)}</td>
                  <td>
                    <button type="button" className="text-btn" onClick={() => cancel(r._id)}>Remove</button>
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
