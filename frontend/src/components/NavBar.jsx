// components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  Settings, 
  Wallet, 
  Video, 
  Award,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Film,
  Users,
  Home,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.log('Error parsing user data');
      }
    }

    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        try {
          setUser(JSON.parse(updatedUser));
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get user avatar color based on name
  const getAvatarColor = () => {
    if (!user || !user.name) return 'from-blue-500 to-purple-500';
    
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-blue-500',
      'from-pink-500 to-rose-500',
    ];
    
    const hash = user.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Get dashboard link based on role
  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              VidCash
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
              by Zayn Ali
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#how-it-works">How It Works</NavLink>
            <NavLink href="#plans">Plans</NavLink>
            <NavLink href="#reviews">Reviews</NavLink>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {user ? (
              // User Menu for logged in users
              <div className="relative user-menu">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none group"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getAvatarColor()} flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-105 transition-transform`}>
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {user.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Award className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {user.role === 'admin' ? 'Administrator' : 'Member'}
                          </span>
                        </div>
                      </div>

                      {/* Menu Items - Role Based */}
                      <div className="py-2">
                        {/* Dashboard - Different for admin/user */}
                        <DropdownLink 
                          to={getDashboardLink()} 
                          icon={<LayoutDashboard className="w-4 h-4" />}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Dashboard
                        </DropdownLink>
                        
                        {/* User-specific options */}
                        {user.role !== 'admin' && (
                          <>
                            <DropdownLink 
                              to="/user/wallet" 
                              icon={<Wallet className="w-4 h-4" />}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              My Wallet
                            </DropdownLink>
                            
                            <DropdownLink 
                              to="/user/videos" 
                              icon={<Film className="w-4 h-4" />}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              My Videos
                            </DropdownLink>
                            
                            <DropdownLink 
                              to="/user/earnings" 
                              icon={<Award className="w-4 h-4" />}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Earnings
                            </DropdownLink>
                          </>
                        )}
                        
                        {/* Admin-specific options */}
                        {user.role === 'admin' && (
                          <>
                            <DropdownLink 
                              to="/admin/users" 
                              icon={<Users className="w-4 h-4" />}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Manage Users
                            </DropdownLink>
                            
                            <DropdownLink 
                              to="/admin/videos" 
                              icon={<Film className="w-4 h-4" />}
                              onClick={() => setUserMenuOpen(false)}
                            >
                              Manage Videos
                            </DropdownLink>
                          </>
                        )}
                        
                        {/* Settings - Same for both */}
                        <DropdownLink 
                          to="/settings" 
                          icon={<Settings className="w-4 h-4" />}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Settings
                        </DropdownLink>
                        
                        {/* Help & Support */}
                        <DropdownLink 
                          to="/help" 
                          icon={<HelpCircle className="w-4 h-4" />}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Help & Support
                        </DropdownLink>
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Login/Register buttons for guests
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition transform"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
                <MobileNavLink href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                  How It Works
                </MobileNavLink>
                <MobileNavLink href="#plans" onClick={() => setMobileMenuOpen(false)}>
                  Plans
                </MobileNavLink>
                <MobileNavLink href="#reviews" onClick={() => setMobileMenuOpen(false)}>
                  Reviews
                </MobileNavLink>

                {/* Dark Mode Toggle for Mobile */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition flex items-center gap-3"
                >
                  {darkMode ? (
                    <>
                      <Sun className="w-4 h-4" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" />
                      Dark Mode
                    </>
                  )}
                </button>

                {user ? (
                  // Mobile view for logged in users
                  <>
                    <div className="pt-4 pb-2">
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-lg">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getAvatarColor()} flex items-center justify-center text-white font-semibold`}>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Dashboard Link */}
                    <MobileNavLink to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </MobileNavLink>
                    
                    {/* User-specific mobile options */}
                    {user.role !== 'admin' && (
                      <>
                        <MobileNavLink to="/user/wallet" onClick={() => setMobileMenuOpen(false)}>
                          <Wallet className="w-4 h-4" />
                          My Wallet
                        </MobileNavLink>
                        
                        <MobileNavLink to="/user/videos" onClick={() => setMobileMenuOpen(false)}>
                          <Film className="w-4 h-4" />
                          My Videos
                        </MobileNavLink>
                        
                        <MobileNavLink to="/user/earnings" onClick={() => setMobileMenuOpen(false)}>
                          <Award className="w-4 h-4" />
                          Earnings
                        </MobileNavLink>
                      </>
                    )}
                    
                    {/* Admin-specific mobile options */}
                    {user.role === 'admin' && (
                      <>
                        <MobileNavLink to="/admin/users" onClick={() => setMobileMenuOpen(false)}>
                          <Users className="w-4 h-4" />
                          Manage Users
                        </MobileNavLink>
                        
                        <MobileNavLink to="/admin/videos" onClick={() => setMobileMenuOpen(false)}>
                          <Film className="w-4 h-4" />
                          Manage Videos
                        </MobileNavLink>
                      </>
                    )}
                    
                    {/* Settings - Same for both */}
                    <MobileNavLink to="/settings" onClick={() => setMobileMenuOpen(false)}>
                      <Settings className="w-4 h-4" />
                      Settings
                    </MobileNavLink>
                    
                    <MobileNavLink to="/help" onClick={() => setMobileMenuOpen(false)}>
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </MobileNavLink>

                    {/* Mobile Logout */}
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  // Mobile view for guests
                  <>
                    <div className="pt-4 flex flex-col space-y-3">
                      <Link
                        to="/login"
                        className="w-full text-center px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="w-full text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

// NavLink Component
const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition font-medium"
  >
    {children}
  </a>
);

// DropdownLink Component
const DropdownLink = ({ to, icon, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
  >
    <span className="text-gray-500 dark:text-gray-400">{icon}</span>
    {children}
  </Link>
);

// MobileNavLink Component
const MobileNavLink = ({ href, to, onClick, children }) => {
  const content = (
    <div className="flex items-center gap-3">
      {children}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
    >
      {content}
    </a>
  );
};

export default Navbar;