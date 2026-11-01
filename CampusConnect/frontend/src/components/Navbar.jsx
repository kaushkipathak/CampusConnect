import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  Sparkles, 
  Calendar, 
  Compass, 
  Award, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X,
  PlusCircle,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isStudent, isOrganizer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-brand-warm/90 backdrop-blur-md border-b border-brand-lavender/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-coral flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-2xl tracking-tight text-brand-charcoal">
                  Campus<span className="text-brand-violet">Connect</span>
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-violet/80 block -mt-0.5">
                Discover • Participate • Connect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/events"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive('/events')
                  ? 'bg-brand-violet text-white shadow-soft'
                  : 'text-brand-charcoal hover:bg-brand-lavender/20'
              }`}
            >
              Explore Events
            </Link>

            {/* Student Navigation */}
            {isStudent && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/student/dashboard')
                      ? 'bg-brand-violet text-white shadow-soft'
                      : 'text-brand-charcoal hover:bg-brand-lavender/20'
                  }`}
                >
                  My Hub
                </Link>
                <Link
                  to="/student/registrations"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/student/registrations')
                      ? 'bg-brand-violet text-white shadow-soft'
                      : 'text-brand-charcoal hover:bg-brand-lavender/20'
                  }`}
                >
                  My Registrations
                </Link>
                <Link
                  to="/student/passport"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    isActive('/student/passport')
                      ? 'bg-gradient-to-r from-brand-violet to-brand-coral text-white shadow-soft'
                      : 'text-brand-charcoal hover:bg-brand-lavender/20'
                  }`}
                >
                  <Award className="w-4 h-4 text-brand-coral" />
                  <span>Campus Passport</span>
                </Link>
              </>
            )}

            {/* Organizer Navigation */}
            {isOrganizer && (
              <Link
                to="/organizer/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  isActive('/organizer/dashboard')
                    ? 'bg-brand-violet text-white shadow-soft'
                    : 'text-brand-charcoal hover:bg-brand-lavender/20'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Organizer Dashboard</span>
              </Link>
            )}

            {/* Admin Navigation */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  isActive('/admin/dashboard')
                    ? 'bg-brand-violet text-white shadow-soft'
                    : 'text-brand-charcoal hover:bg-brand-lavender/20'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-brand-coral" />
                <span>Admin Administration</span>
              </Link>
            )}
          </nav>

          {/* Right Header Controls (Auth / Notifications / Profile) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <NotificationBell />

                <div className="flex items-center pl-3 border-l border-brand-lavender/40 space-x-3">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-violet/30"
                    />
                    <div className="text-left">
                      <div className="text-xs font-bold text-brand-charcoal leading-tight">
                        {user.fullName}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider inline-block mt-0.5 ${
                        isAdmin ? 'bg-amber-100 text-amber-800' :
                        isOrganizer ? 'bg-purple-100 text-purple-800' :
                        'bg-brand-lavender/30 text-brand-violet'
                      }`}>
                        {user.role === 'COLLEGE_ADMIN' ? 'Administration' : user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Log out"
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-brand-violet hover:bg-brand-lavender/20 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-violet hover:bg-brand-violet/90 rounded-xl shadow-soft hover:shadow-elevated transition-all"
                >
                  Join Campus
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {user && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-charcoal hover:bg-brand-lavender/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-brand-lavender/30 bg-brand-warm px-4 py-4 space-y-2">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2.5 rounded-xl font-medium text-brand-charcoal hover:bg-brand-lavender/20"
          >
            Explore Events
          </Link>
          {isStudent && (
            <>
              <Link
                to="/student/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-medium text-brand-charcoal hover:bg-brand-lavender/20"
              >
                My Hub
              </Link>
              <Link
                to="/student/registrations"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-medium text-brand-charcoal hover:bg-brand-lavender/20"
              >
                My Registrations
              </Link>
              <Link
                to="/student/passport"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-medium text-brand-violet font-semibold hover:bg-brand-lavender/20"
              >
                Campus Passport
              </Link>
            </>
          )}
          {isOrganizer && (
            <Link
              to="/organizer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-brand-charcoal hover:bg-brand-lavender/20"
            >
              Organizer Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl font-medium text-brand-charcoal hover:bg-brand-lavender/20"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-brand-lavender/30">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-brand-charcoal">{user.fullName}</div>
                    <div className="text-xs text-brand-violet">{user.role}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs text-red-600 bg-red-50 rounded-lg font-medium"
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-brand-violet bg-brand-lavender/20 rounded-xl"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold text-white bg-brand-violet rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
