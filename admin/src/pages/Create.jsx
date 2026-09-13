import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingForm from '../components/ListingForm'
import { useAuthContext } from '../hooks/useAuthContext'
import { API_URL } from '../api'

const Create = () => {
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const onSubmit = async (formData) => {
    setBusy(true)
    setError(null)
    const res = await fetch(API_URL + '/api/accommodations', {
      method: 'POST',
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
      <h1>Create Listing</h1>
      <ListingForm onSubmit={onSubmit} submitLabel="Create" busy={busy} error={error} />
    </div>
  )
}

export default Create