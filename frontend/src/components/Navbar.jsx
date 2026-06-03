import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; 
import logoImg from '../assets/images/cnpc-icon.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/10 shadow-lg py-3'
        : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">

        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoImg}
            alt="CNPC Logo"
            className="w-10 h-10 rounded-full border border-white/20 group-hover:border-cnpc-accent transition-colors object-cover"
          />
          <span className="text-white font-black tracking-widest text-xl uppercase group-hover:text-cnpc-accent transition-colors">
            CNPC
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${location.pathname === '/'
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Hub
          </Link>
          <Link
            to="/events"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/events')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Events
          </Link>
          <Link
            to="/courts"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/courts')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Courts
          </Link>
          <Link
            to="/coaches"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/coaches')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Coaches
          </Link>
          <Link
            to="/members"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/members')
              ? 'bg-white/10 text-white'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Roster
          </Link>
          <Link
            to="/dupr"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/dupr')
              ? 'bg-white/10 text-cnpc-gold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            DUPR
          </Link>
          <Link
            to="/marketplace"
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isActive('/marketplace')
              ? 'bg-white/10 text-cnpc-accent'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            Market
          </Link>
        </div>

        {/* Right: User Profile / Auth State */}
        <div className="hidden md:flex items-center">
          {user ? (
            <Link
              to="/profile"
              className={`flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full border transition-all ${isActive('/profile')
                ? 'bg-cnpc-accent/10 border-cnpc-accent text-cnpc-accent'
                : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30 hover:text-white'
                }`}
            >
              <span className="text-sm font-bold uppercase tracking-wider">{user.fullName.split(' ')[0]}</span>

              <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isActive('/profile') ? 'bg-cnpc-accent text-slate-950' : 'bg-slate-700 text-white'}`}>
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="bg-cnpc-accent text-slate-950 px-6 py-2 rounded-full font-bold uppercase tracking-widest text-sm hover:brightness-110 transition-all shadow-[0_0_15px_rgba(196,214,0,0.2)]"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white p-2 focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`lg:hidden absolute w-full bg-[#0B0F19] border-b border-white/10 transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          <Link
            to="/"
            className={`text-lg font-bold uppercase tracking-wider ${location.pathname === '/' ? 'text-white' : 'text-slate-400'}`}
          >
            Hub
          </Link>
          <Link
            to="/events"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/events') ? 'text-white' : 'text-slate-400'}`}
          >
            Events
          </Link>
          <Link
            to="/courts"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/courts') ? 'text-white' : 'text-slate-400'}`}
          >
            Courts
          </Link>
          <Link
            to="/coaches"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/coaches') ? 'text-white' : 'text-slate-400'}`}
          >
            Coaches
          </Link>
          <Link
            to="/members"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/members') ? 'text-white' : 'text-slate-400'}`}
          >
            Club Roster
          </Link>
          <Link
            to="/dupr"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/dupr') ? 'text-cnpc-gold' : 'text-slate-400'}`}
          >
            DUPR Ratings
          </Link>
          <Link
            to="/marketplace"
            className={`text-lg font-bold uppercase tracking-wider ${isActive('/marketplace') ? 'text-cnpc-accent' : 'text-slate-400'}`}
          >
            Marketplace
          </Link>

          <div className="h-px bg-white/10 my-2"></div>

          {/* Mobile Auth View */}
          {user ? (
            <Link
              to="/profile"
              className={`flex items-center gap-3 text-lg font-bold uppercase tracking-wider ${isActive('/profile') ? 'text-cnpc-accent' : 'text-slate-400'}`}
            >
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5" />
              )}
              {user.fullName.split(' ')[0]}'s Profile
            </Link>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-3 text-lg font-bold uppercase tracking-wider text-cnpc-accent"
            >
              <User className="w-5 h-5" />
              Log In / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;