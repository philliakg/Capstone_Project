import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'
import { useAuthContext } from '../hooks/useAuthContext'

const Login = () => {
  const { user } = useAuthContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const { login, error, isLoading } = useLogin()
  const navigate = useNavigate()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!email || !password) {
      setFormError('Please fill in email and password')
      return
    }
    if (!email.includes('@')) {
      setFormError('Please enter a valid email')
      return
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters')
      return
    }

    const ok = await login(email, password)
    if (ok) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Host log in</h1>
        <p className="muted">Manage your listings and reservations</p>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kgabo@gmail.com"
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
        />
        <button disabled={isLoading} className="coral-btn">
          {isLoading ? 'Logging in…' : 'Continue'}
        </button>
        {(formError || error) && <p className="error">{formError || error}</p>}
        <p className="hint">Host: kgabo@gmail.com / password321</p>
      </form>
    </div>
  )
}

export default Login
