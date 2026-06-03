import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // 1. Import the helper
import Courts from './pages/Courts';
import Members from './pages/Members';
// Import Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Coaches from './pages/Coaches';
import Dupr from './pages/Dupr';
import Marketplace from './pages/Marketplace';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
function App() {
  return (
    <Router>
      <ScrollToTop /> {/* 2. Place it here! It will now watch every route change */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/dupr" element={<Dupr />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/members" element={<Members />} /> 
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;