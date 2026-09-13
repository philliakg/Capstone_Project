import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

const Logo = () => (
  <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true">
    <path
      fill="#FF385C"
      d="M16 1c2.1 3.6 6.4 10.7 8.7 15.2 1.6 3.1 2.3 5.5 2.3 7.4 0 4.5-3.4 8.4-8.1 8.4-2.5 0-4.6-1.1-6-2.8C11.5 30.9 9.4 32 6.9 32 2.2 32-1.2 28.1-1.2 23.6c0-1.9.7-4.3 2.3-7.4C3.4 11.7 7.7 4.6 9.8 1 11.7-2.1 14.1-2.1 16 1z"
      transform="translate(2 0)"
    />
  </svg>
)

const Navbar = () => {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setOpen(false)
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to={user ? '/dashboard' : '/login'} className="logo">
          <Logo />
          <span>airbnb</span>
        </Link>

        <div className="nav-right">
          {!user && (
            <Link to="/login" className="become-host">Become a Host</Link>
          )}
          {user && (
            <>
              <span className="nav-username">{user.username}</span>
              <div className="profile-wrap">
                <button type="button" className="profile-btn" onClick={() => setOpen(!open)}>
                  <span className="burger">☰</span>
                  <span className="avatar-circle" />
                </button>
                {open && (
                  <div className="dropdown">
                    <Link to="/reservations" onClick={() => setOpen(false)}>Reservations</Link>
                    <button type="button" onClick={handleLogout}>Log out</button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {user && (
        <nav className="subnav">
          <div className="subnav-inner">
            <NavLink to="/reservations">View Reservations</NavLink>
            <NavLink to="/dashboard">View Listings</NavLink>
            <NavLink to="/create">Create Listing</NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export default Navbar
