import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, SlidersHorizontal, MapPin, Heart, ExternalLink,
  Car, Fuel, Calendar, DollarSign, Eye, ChevronDown, X, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useVehicleData from '../hooks/useVehicleData';
import useAffiliateLink from '../hooks/useAffiliateLink';
import EnhancedSearchBar from './EnhancedSearchBar';

const VehicleSearch = ({ initialQuery = '', showHeader = true }) => {
  const {
    filteredVehicles,
    loading,
    searchQuery,
    filters,
    sortBy,
    searchVehicles,
    updateFilters,
    updateFiltersFromAI,
    clearFilters,
    setSortBy,
    getFilteredCount,
    makes
  } = useVehicleData();

  const { getAffiliateLink, trackAffiliateClick } = useAffiliateLink();

  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Initialize with query from URL or props
  useEffect(() => {
    if (initialQuery) {
      searchVehicles(initialQuery);
    }
  }, [initialQuery]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('whipsly-favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const handleSearch = (query) => {
    searchVehicles(query);
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const toggleFavorite = (vehicleId) => {
    const newFavorites = favorites.includes(vehicleId)
      ? favorites.filter(id => id !== vehicleId)
      : [...favorites, vehicleId];
    
    setFavorites(newFavorites);
    localStorage.setItem('whipsly-favorites', JSON.stringify(newFavorites));
  };

  const handleVehicleClick = (vehicle) => {
    const affiliateUrl = getAffiliateLink({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year
    });
    
    trackAffiliateClick(vehicle.affiliate, {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price
    });
    
    window.open(affiliateUrl, '_blank');
  };

  const calculateSavings = (price, marketPrice) => {
    const savings = marketPrice - price;
    const percentage = ((savings / marketPrice) * 100).toFixed(1);
    return { amount: savings, percentage };
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const sortOptions = [
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'mileage-asc', label: 'Mileage: Low to High' },
    { value: 'year-desc', label: 'Year: Newest First' },
    { value: 'best-deals', label: 'Best Deals First' }
  ];

  const priceRanges = [
    { label: 'Any Price', min: 0, max: 100000 },
    { label: 'Under $20k', min: 0, max: 20000 },
    { label: '$20k - $30k', min: 20000, max: 30000 },
    { label: '$30k - $40k', min: 30000, max: 40000 },
    { label: '$40k - $50k', min: 40000, max: 50000 },
    { label: 'Over $50k', min: 50000, max: 100000 }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-whipsly-navy mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-gray-600 text-lg">
              Browse thousands of vehicles with smart filters and instant results
            </p>
          </div>
        )}

        {/* Enhanced AI Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* AI-Powered Main Search */}
            <div className="flex-1">
              <EnhancedSearchBar
                onSearch={handleSearch}
                onFilterUpdate={updateFiltersFromAI}
                initialQuery={searchQuery}
                placeholder="Try: 'reliable family SUV under $30k' or 'fuel efficient Toyota'"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-3 pr-10 focus:border-whipsly-blue focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-whipsly-navy">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-whipsly-blue hover:text-blue-600"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Make Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <select
                    value={filters.make}
                    onChange={(e) => handleFilterChange('make', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-whipsly-blue focus:outline-none"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    {priceRanges.map((range, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceMin === range.min && filters.priceMax === range.max}
                          onChange={() => handleFilterChange('priceMin', range.min) || handleFilterChange('priceMax', range.max)}
                          className="mr-2 text-whipsly-blue focus:ring-whipsly-blue"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Mileage: {filters.mileageMax.toLocaleString()} miles
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={filters.mileageMax}
                    onChange={(e) => handleFilterChange('mileageMax', parseInt(e.target.value))}
                    className="w-full slider"
                  />
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:border-whipsly-blue focus:outline-none"
                  >
                    <option value="">All Types</option>
                    <option value="gas">Gas</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-whipsly-navy">Filters</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  {/* Same filter content as desktop */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-whipsly-navy">
                  {loading ? 'Searching...' : `${getFilteredCount()} Cars Found`}
                </h2>
                {searchQuery && (
                  <p className="text-gray-600 mt-1">Results for "{searchQuery}"</p>
                )}
              </div>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="btn-ghost lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}

            {/* Vehicle Grid */}
            {!loading && (
              <div className="grid gap-6">
                {filteredVehicles.map((vehicle, index) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="card card-hover cursor-pointer"
                    onClick={() => handleVehicleClick(vehicle)}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Vehicle Image */}
                      <div className="md:w-1/3 relative">
                        <img
                          src={vehicle.image}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-64 md:h-full object-cover"
                          loading="lazy"
                        />
                        {vehicle.isBestDeal && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Best Deal
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(vehicle.id);
                          }}
                          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                            favorites.includes(vehicle.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                        >
                          <Heart className={`h-4 w-4 ${favorites.includes(vehicle.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Vehicle Details */}
                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-whipsly-navy mb-1">
                                {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
                              </h3>
                              <div className="flex items-center text-gray-600 text-sm">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{vehicle.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-whipsly-blue">
                                {formatPrice(vehicle.price)}
                              </div>
                              {vehicle.marketPrice > vehicle.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  {formatPrice(vehicle.marketPrice)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Specs */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-gray-600 text-sm">
                              <Car className="h-4 w-4 mr-2" />
                              <span>{vehicle.mileage.toLocaleString()} miles</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Fuel className="h-4 w-4 mr-2" />
                              <span>{vehicle.mpgCity}/{vehicle.mpgHighway} MPG</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{vehicle.transmission}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Star className="h-4 w-4 mr-2 text-yellow-500" />
                              <span>{vehicle.drivetrain.toUpperCase()}</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {vehicle.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                              {vehicle.features.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  +{vehicle.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="text-sm text-gray-600">
                              at {vehicle.dealer}
                            </div>
                            <div className="flex items-center space-x-3">
                              {vehicle.isBestDeal && (
                                <div className="text-sm text-green-600 font-medium">
                                  Save {calculateSavings(vehicle.price, vehicle.marketPrice).percentage}%
                                </div>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleVehicleClick(vehicle);
                                }}
                                className="flex items-center space-x-2 bg-whipsly-blue hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                              >
                                <span>View Details</span>
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredVehicles.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters to find more results.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSearch;