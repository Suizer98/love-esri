import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import './App.css'
import About from './components/About'
import Home from './components/Home'
import Map from './components/Map'

// import Map from './pages/Map'

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/map">Map</Link>
          <Link to="/about">About</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<Map />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
