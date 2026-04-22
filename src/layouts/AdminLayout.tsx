import { Outlet, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { HiOutlineViewGrid, HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineTag, HiOutlineLogout, HiOutlineHome, HiMenuAlt2, HiOutlineUser, HiOutlinePencil, HiOutlineLockClosed, HiOutlineChevronDown } from 'react-icons/hi';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useState, useRef, useEffect } from 'react';

const sidebarLinks = [
  { to: '/admin', icon: HiOutlineViewGrid, label: 'Dashboard', exact: true },
  { to: '/admin/books', icon: HiOutlineBookOpen, label: 'Books', exact: false },
  { to: '/admin/authors', icon: HiOutlineUserGroup, label: 'Authors', exact: false },
  { to: '/admin/categories', icon: HiOutlineTag, label: 'Categories', exact: false },
];

export default function AdminLayout() {
  const { isAuthenticated, username, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-surface-700">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          {!collapsed && <span className="text-lg font-bold text-gradient">Admin</span>}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map(link => {
          const Icon = link.icon;
          const active = isActive(link.to, link.exact);
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'gradient-primary text-white shadow-md shadow-primary-500/25'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-surface-700 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all"
        >
          <HiOutlineHome className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Back to Store</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full
            text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
        >
          <HiOutlineLogout className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-surface-950">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-surface-900
        border-r border-gray-200 dark:border-surface-800 transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-surface-900 flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-surface-900 border-b border-gray-200 dark:border-surface-800
          flex items-center justify-between px-4 lg:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => { setCollapsed(c => !c); setMobileOpen(m => !m); }}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
              <HiMenuAlt2 className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
              {sidebarLinks.find(l => isActive(l.to, l.exact))?.label || 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
              {isDark ? <HiSun className="w-5 h-5" /> : <HiMoon className="w-5 h-5" />}
            </button>
            {/* User dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-surface-800 transition-all"
              >
                <div className="w-8 h-8 gradient-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">
                    {username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {username || 'Admin'}
                </span>
                <HiOutlineChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-surface-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-surface-950/50 border border-gray-100 dark:border-surface-700 overflow-hidden z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-surface-700">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 gradient-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-sm font-bold">
                          {username?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{username || 'Admin'}</p>
                        <p className="text-xs text-gray-400">Administrator</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    <button onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                      <HiOutlineUser className="w-4 h-4 text-gray-400" />
                      View Profile
                    </button>
                    <button onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                      <HiOutlinePencil className="w-4 h-4 text-gray-400" />
                      Edit Profile
                    </button>
                    <button onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-800 transition-all">
                      <HiOutlineLockClosed className="w-4 h-4 text-gray-400" />
                      Change Password
                    </button>
                  </div>
                  <div className="p-1.5 border-t border-gray-100 dark:border-surface-700">
                    <button onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                      <HiOutlineLogout className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
