import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? 'text-amber-500' : 'text-slate-300 hover:text-white'}`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200 border-b border-white/10 ${isActive ? 'text-amber-500 bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`;

  return (
    <nav className="border-b border-slate-700/60 bg-black/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src='/icon.png' className="w-10 h-10 object-cover" />
            <span className="text-xl font-bold text-white">
              Quiz<span className="bg-amber-500 text-black px-1">Battle</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/leaderboard" className={navLinkClass}>
              Leaderboard
            </NavLink>

            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/rooms/join" className={navLinkClass}>
                  Join Room
                </NavLink>
                <NavLink to="/rooms/create" className={navLinkClass}>
                  Create Room
                </NavLink>
                {user.isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Admin
                  </NavLink>
                )}
                <div className="flex items-center gap-3 ml-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        user.username[0].toUpperCase()
                      )}
                    </div>
                    <span className="text-sm text-slate-300 hidden lg:block">{user.username}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-4">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: avatar + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-sm font-bold flex-shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  user.username[0].toUpperCase()
                )}
              </div>
            )}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                /* X icon */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-white/10"
          style={{ background: 'rgba(5,5,15,0.97)', backdropFilter: 'blur(12px)' }}
        >
          <NavLink to="/leaderboard" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
            🏆 Leaderboard
          </NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/rooms/join" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                🔑 Join Room
              </NavLink>
              <NavLink to="/rooms/create" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                🚀 Create Room
              </NavLink>
              {user.isAdmin && (
                <NavLink to="/admin" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  ⚙️ Admin
                </NavLink>
              )}
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-slate-400">{user.username}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-4">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                Login
              </NavLink>
              <div className="px-4 py-3">
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4 block text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
