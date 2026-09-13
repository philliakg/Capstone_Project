import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ListingForm from '../components/ListingForm'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL } from '../api'

const Update = () => {
  const { id } = useParams()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [initial, setInitial] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(API_URL + '/api/accommodations/' + id)
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.error)
        } else {
          setInitial({
            ...json,
            amenities: (json.amenities || []).join(', ')
          })
        }
      })
  }, [id])

  const onSubmit = async (formData) => {
    setBusy(true)
    setError(null)
    const res = await fetch(API_URL + '/api/accommodations/' + id, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + user.token },
      body: formData
    })
    const json = await res.json()
    setBusy(false)
    if (!res.ok) {
      setError(json.error)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="page">
      <h1>Update listing</h1>
      {!initial && !error && <p>Loading…</p>}
      {error && !initial && <p className="error">{error}</p>}
      {initial && (
        <ListingForm
          initial={initial}
          onSubmit={onSubmit}
          submitLabel="Save changes"
          busy={busy}
          error={error}
        />
      )}
    </div>
  )
}

export default Update
