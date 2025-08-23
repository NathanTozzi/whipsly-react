import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, TrendingUp, Star, Users, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useVehicleData from '../hooks/useVehicleData';
import SearchDropdown from './SearchDropdown';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchDropdownRef = useRef(null);

  const handleSearch = (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsLoading(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion) => {
    const searchTerm = typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion;
    setSearchQuery(searchTerm);
    setShowSuggestions(false);
    handleSearch(searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const stats = [
    { icon: TrendingUp, label: '50K+ Cars Listed', value: '50,000+' },
    { icon: Star, label: '4.8 Average Rating', value: '4.8/5' },
    { icon: Users, label: 'Happy Customers', value: '25,000+' },
    { icon: MapPin, label: 'Nationwide Coverage', value: '50 States' }
  ];

  return (
    <section className="relative min-h-screen flex items-center hero-pattern overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-whipsly-navy/90 via-whipsly-navy/70 to-whipsly-blue/80"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-whipsly-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-whipsly-navy/20 rounded-full blur-3xl animate-bounce-gentle"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 text-shadow-lg">
              Smart Car Search
              <span className="block text-whipsly-blue">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Find your perfect vehicle with AI-powered search, expert reviews, 
              and instant financing options from trusted dealers nationwide.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search by make, model, or year..."
                  className="w-full pl-6 pr-16 py-5 text-lg rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-whipsly-blue focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  className="absolute right-2 p-3 bg-whipsly-blue hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <SearchDropdown
                    ref={searchDropdownRef}
                    searchTerm={searchQuery}
                    onSelectSuggestion={handleSuggestionClick}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {['Toyota Camry', 'Honda Accord', 'BMW 3 Series', 'Tesla Model 3'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSuggestionClick(term)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-all duration-200 border border-white/20"
                >
                  {term}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => navigate('/search')}
              className="flex items-center space-x-2 bg-whipsly-blue hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="text-lg">Browse All Cars</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 border border-white/20"
            >
              <span className="text-lg">Get Expert Help</span>
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                  <stat.icon className="h-6 w-6 text-whipsly-blue" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
        </div>
        <p className="text-white/70 text-xs mt-2">Scroll to explore</p>
      </motion.div>
    </section>
  );
};

export default HeroSection;