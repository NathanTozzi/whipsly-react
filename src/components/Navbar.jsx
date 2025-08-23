import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Phone, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Search Cars', path: '/search' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActivePath = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="group-hover:scale-105 transition-all duration-200">
              <img 
                src="/whipsly-logo-transparent.png" 
                alt="Whipsly Logo" 
                className="h-10 w-auto"
              />
            </div>
            <span className="text-2xl font-display font-bold gradient-text hidden sm:block">
              Whipsly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'text-whipsly-blue'
                    : 'text-gray-700 hover:text-whipsly-blue'
                }`}
              >
                {item.name}
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-whipsly-blue rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-gray-600 hover:text-whipsly-blue transition-colors duration-200"
              title="Favorites"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-whipsly-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Phone */}
            <a
              href="tel:(555) 123-4567"
              className="flex items-center space-x-2 text-gray-600 hover:text-whipsly-blue transition-colors duration-200"
              title="Call Us"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm font-medium">(555) 123-4567</span>
            </a>

            {/* CTA Button */}
            <Link
              to="/search"
              className="btn-primary"
            >
              Find Cars
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-whipsly-blue transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md"
            >
              <div className="py-4 space-y-4">
                {/* Mobile Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'text-whipsly-blue bg-whipsly-blue/10'
                        : 'text-gray-700 hover:text-whipsly-blue hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Actions */}
                <div className="px-4 pt-4 border-t border-gray-100 space-y-3">
                  {/* Favorites */}
                  <Link
                    to="/favorites"
                    className="flex items-center space-x-3 text-gray-600 hover:text-whipsly-blue transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favorites (3)</span>
                  </Link>

                  {/* Phone */}
                  <a
                    href="tel:(555) 123-4567"
                    className="flex items-center space-x-3 text-gray-600 hover:text-whipsly-blue transition-colors duration-200"
                  >
                    <Phone className="h-5 w-5" />
                    <span>(555) 123-4567</span>
                  </a>

                  {/* CTA Button */}
                  <Link
                    to="/search"
                    className="btn-primary w-full text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Find Cars
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;