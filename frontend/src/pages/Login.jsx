import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState(null)
  const { login, error, isLoading } = useLogin()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

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
      const redirect = searchParams.get('redirect')
      if (redirect && redirect.startsWith('/')) {
        const rest = new URLSearchParams(searchParams)
        rest.delete('redirect')
        const query = rest.toString()
        navigate(redirect + (query ? '?' + query : ''))
      } else {
        navigate('/')
      }
    }
  }

  return (
    <div className="page auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <p className="muted">Welcome back to Airbnb</p>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="phillia@gmail.com"
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
        <p className="hint">Guest: phillia@gmail.com / password123</p>
      </form>
    </div>
  )
}

export default Login
