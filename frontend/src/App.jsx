import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Location from './pages/Location'
import Details from './pages/Details'
import Login from './pages/Login'
import Reservations from './pages/Reservations'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location/:location" element={<Location />} />
          <Route path="/accommodations/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
          
export default App
