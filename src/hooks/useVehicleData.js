import { useState, useEffect } from 'react';
import { MOCK_VEHICLES, MAKES, POPULAR_SEARCHES } from '../data/mockVehicles';

const useVehicleData = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    priceMin: 0,
    priceMax: 100000,
    mileageMax: 999999,
    year: '',
    fuelType: '',
    transmission: ''
  });
  
  const [sortBy, setSortBy] = useState('price-asc'); // price-asc, price-desc, mileage-asc, year-desc

  // Load initial vehicle data
  useEffect(() => {
    loadVehicles();
  }, []);

  // Apply filters whenever search query or filters change
  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, sortBy, vehicles]);

  const loadVehicles = async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call
      // const response = await fetch('/api/vehicles', { params: searchParams });
      // const data = await response.json();
      
      // For now, use mock data
      let data = [...MOCK_VEHICLES];
      
      // Apply basic search if provided
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        data = data.filter(vehicle => 
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(query)
        );
      }
      
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load vehicles:', err);
      setError('Failed to load vehicles. Please try again.');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...vehicles];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.trim.toLowerCase().includes(query) ||
        `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.make) {
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase() === filters.make.toLowerCase()
      );
    }
    
    if (filters.priceMin > 0) {
      filtered = filtered.filter(vehicle => vehicle.price >= filters.priceMin);
    }
    
    if (filters.priceMax < 100000) {
      filtered = filtered.filter(vehicle => vehicle.price <= filters.priceMax);
    }
    
    if (filters.mileageMax < 999999) {
      filtered = filtered.filter(vehicle => vehicle.mileage <= filters.mileageMax);
    }
    
    if (filters.year) {
      filtered = filtered.filter(vehicle => vehicle.year.toString() === filters.year);
    }
    
    if (filters.fuelType) {
      filtered = filtered.filter(vehicle => vehicle.fuelType === filters.fuelType);
    }
    
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission);
    }
    
    // Apply sorting
    filtered = sortVehicles(filtered, sortBy);
    
    setFilteredVehicles(filtered);
  };

  const sortVehicles = (vehicleList, sortMethod) => {
    const sorted = [...vehicleList];
    
    switch (sortMethod) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'mileage-asc':
        return sorted.sort((a, b) => a.mileage - b.mileage);
      case 'mileage-desc':
        return sorted.sort((a, b) => b.mileage - a.mileage);
      case 'year-desc':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-asc':
        return sorted.sort((a, b) => a.year - b.year);
      case 'best-deals':
        return sorted.sort((a, b) => {
          // Sort by best deals first (highest savings %), then by price
          const aSavings = ((a.marketPrice - a.price) / a.marketPrice) * 100;
          const bSavings = ((b.marketPrice - b.price) / b.marketPrice) * 100;
          if (aSavings !== bSavings) {
            return bSavings - aSavings;
          }
          return a.price - b.price;
        });
      default:
        return sorted;
    }
  };

  const searchVehicles = (query) => {
    setSearchQuery(query);
    // Optionally trigger new API call for server-side search
    // loadVehicles({ query });
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      priceMin: 0,
      priceMax: 100000,
      mileageMax: 999999,
      year: '',
      fuelType: '',
      transmission: ''
    });
    setSearchQuery('');
    setSortBy('price-asc');
  };

  const getVehicleById = (id) => {
    return vehicles.find(vehicle => vehicle.id === id);
  };

  const getSuggestedSearches = (query) => {
    if (!query || query.length < 2) {
      return POPULAR_SEARCHES.slice(0, 8);
    }
    
    const lowerQuery = query.toLowerCase();
    
    // Get matching makes
    const matchingMakes = MAKES.filter(make => 
      make.toLowerCase().includes(lowerQuery)
    );
    
    // Get matching vehicles from current dataset
    const matchingVehicles = vehicles
      .filter(vehicle => 
        vehicle.make.toLowerCase().includes(lowerQuery) ||
        vehicle.model.toLowerCase().includes(lowerQuery)
      )
      .map(vehicle => `${vehicle.make} ${vehicle.model}`)
      .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
      .slice(0, 5);
    
    return [...matchingMakes, ...matchingVehicles].slice(0, 8);
  };

  const getFilteredCount = () => {
    return filteredVehicles.length;
  };

  const getBestDeals = (limit = 4) => {
    return vehicles
      .filter(vehicle => vehicle.isBestDeal)
      .sort((a, b) => {
        const aSavings = ((a.marketPrice - a.price) / a.marketPrice) * 100;
        const bSavings = ((b.marketPrice - b.price) / b.marketPrice) * 100;
        return bSavings - aSavings;
      })
      .slice(0, limit);
  };

  const getFeaturedVehicles = (limit = 6) => {
    // Get a mix of best deals and popular vehicles
    const bestDeals = getBestDeals(3);
    const remaining = vehicles
      .filter(vehicle => !bestDeals.includes(vehicle))
      .sort((a, b) => b.year - a.year)
      .slice(0, limit - bestDeals.length);
    
    return [...bestDeals, ...remaining];
  };

  return {
    vehicles,
    filteredVehicles,
    loading,
    error,
    searchQuery,
    filters,
    sortBy,
    
    // Actions
    loadVehicles,
    searchVehicles,
    updateFilters,
    clearFilters,
    setSortBy,
    
    // Utilities
    getVehicleById,
    getSuggestedSearches,
    getFilteredCount,
    getBestDeals,
    getFeaturedVehicles,
    
    // Constants
    makes: MAKES,
    popularSearches: POPULAR_SEARCHES
  };
};

export default useVehicleData;