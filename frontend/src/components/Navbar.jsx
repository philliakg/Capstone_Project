import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'
import SearchBar from './SearchBar'

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const showSearch = location.pathname === '/' || location.pathname.startsWith('/location/')

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <img src="/images/AirbnbNav.png" alt="Airbnb" className="logo-img" />
        </Link>

        {showSearch ? (
          <SearchBar />
        ) : (
          <Link to="/" className="search-pill">
            <span>Start your search</span>
            <span className="search-mini" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="12" height="12">
                <circle cx="14" cy="14" r="8" fill="none" stroke="#fff" strokeWidth="3" />
                <path d="M20 20 L27 27" fill="none" stroke="#fff" strokeWidth="3" />
              </svg>
            </span>
          </Link>
        )}

        <div className="nav-right">
          <Link to={user ? '/' : '/login'} className="become-host">Become a Host</Link>
          <span className="globe" aria-hidden="true">🌐</span>
          <div className="profile-wrap">
            {!user && (
              <Link to="/login" className="profile-btn">
                <span className="burger">☰</span>
                <span className="avatar-circle" />
              </Link>
            )}
            {user && (
              <>
                <button type="button" className="profile-btn" onClick={() => setOpen(!open)}>
                  <span className="burger">☰</span>
                  <span className="avatar-circle" />
                </button>
                {open && (
                  <div className="dropdown">
                    <p className="dropdown-name">Hi, {user.username.split(' ')[0]}</p>
                    <Link to="/reservations" onClick={() => setOpen(false)}>My reservations</Link>
                    <button type="button" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
