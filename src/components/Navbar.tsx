import { Link, useLocation } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineSearch, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const totalItems = useCartStore(s => s.getTotalItems());
  const { isAuthenticated, username, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Books' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-surface-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center
                          group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">BookHaven</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-surface-800'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname.startsWith('/admin')
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-surface-800'
                  }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <Link to="/books" className="p-2 rounded-lg text-gray-600 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200">
              <HiOutlineSearch className="w-5 h-5" />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200">
              <HiOutlineShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-primary
                  rounded-full text-white text-xs font-bold flex items-center justify-center
                  animate-scale-in">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {username}
                </span>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                    hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 transition-all duration-200"
                  title="Logout"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-lg text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-surface-800 transition-all duration-200">
                <HiOutlineUser className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-surface-800"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600'
                    : 'text-gray-600 dark:text-gray-400'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Admin Panel
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
