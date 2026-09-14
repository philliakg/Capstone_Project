import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext'
import { useLogout } from '../hooks/useLogout'

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
          <img src="/images/AirbnbNav.png" alt="Airbnb" className="logo-img" />
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
