import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Terminal, LogOut, Activity, Radio, User, Info, LayoutDashboard } from 'lucide-react';
import { authService } from '../services/auth';

export default function Navbar({ user: propUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
    } else {
      const stored = authService.getUser() || JSON.parse(localStorage.getItem('stenox_user') || 'null');
      setCurrentUser(stored);
    }
  }, [propUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    if (typeof onLogout === 'function') {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('stenox_token');
      localStorage.removeItem('user');
      localStorage.removeItem('stenox_user');
      navigate('/login');
    }
  };

  const isLoggedIn = authService.isAuthenticated() || !!localStorage.getItem('stenox_token');

  return (
    <header className="sticky top-0 z-50 px-4 py-3 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* Brand with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => isLoggedIn && setDropdownOpen(!dropdownOpen)}
            className={`flex items-center space-x-3 text-left focus:outline-none group ${!isLoggedIn ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 shadow-glow-emerald group-hover:border-emerald-400 transition-all">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                  STENOX
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tracking-widest">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">Enterprise Event Ingestion</p>
            </div>
          </button>

          {/* Fitted Navigation Dropdown */}
          {isLoggedIn && dropdownOpen && (
            <div className="absolute left-0 top-12 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-100">
              <Link
                to="/landing"
                onClick={() => setDropdownOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${location.pathname === '/landing' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </Link>
              <Link
                to="/inspector"
                onClick={() => setDropdownOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${location.pathname === '/inspector' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Inspector</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${location.pathname === '/profile' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setDropdownOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 transition-colors ${location.pathname === '/about' ? 'bg-emerald-500/10 text-emerald-400 font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>About</span>
              </Link>
              <div className="border-t border-white/10 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

        {/* User Context & Action */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-xs">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Ingestion Engine Active</span>
            </div>

            <div className="flex items-center space-x-3 pl-2 border-l border-white/10">
              <Link to="/profile" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 group-hover:ring-emerald-400 transition-all">
                  {currentUser?.profile_picture_url ? (
                    <img src={currentUser.profile_picture_url} alt={currentUser.full_name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser?.full_name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">{currentUser?.full_name || 'Operator'}</p>
                  <p className="text-slate-400 text-[10px]">{currentUser?.email}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono hover:bg-emerald-500/20 transition-all">
            Sign In / Register
          </Link>
        )}

      </div>
    </header>
  );
}