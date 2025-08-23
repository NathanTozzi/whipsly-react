import React, { useState, useEffect, forwardRef } from 'react';
import { Clock, Search, Car, Calendar, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchDropdown = forwardRef(({ searchTerm, onSelectSuggestion }, ref) => {
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);

  // Popular searches data
  const defaultPopularSearches = [
    { text: 'Toyota Camry', icon: '🚗', category: 'Popular' },
    { text: 'Honda Civic', icon: '🚗', category: 'Popular' },
    { text: 'Tesla Model 3', icon: '⚡', category: 'Popular' },
    { text: 'BMW X3', icon: '🏎️', category: 'Popular' },
    { text: 'Mercedes C-Class', icon: '🏎️', category: 'Popular' },
    { text: 'Ford F-150', icon: '🚛', category: 'Popular' },
    { text: 'Luxury cars', icon: '⭐', category: 'Category' },
    { text: 'Electric cars', icon: '🔋', category: 'Category' },
  ];

  // Car makes and models for autocomplete
  const carData = {
    makes: ['Toyota', 'Honda', 'Ford', 'Tesla', 'BMW', 'Mercedes-Benz', 'Chevrolet', 'Audi', 'Nissan', 'Hyundai'],
    models: {
      'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
      'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'],
      'Ford': ['F-150', 'Explorer', 'Escape', 'Mustang', 'Focus'],
      'Tesla': ['Model 3', 'Model Y', 'Model S', 'Model X'],
      'BMW': ['X3', '3 Series', '5 Series', 'X5', 'i3'],
    }
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('whipsly-search-history');
    if (saved) {
      try {
        const history = JSON.parse(saved);
        setRecentSearches(history.slice(0, 5));
      } catch (error) {
        setRecentSearches([]);
      }
    }
    setPopularSearches(defaultPopularSearches);
  }, []);

  // Generate autocomplete suggestions based on search term
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setAutocompleteSuggestions([]);
      setSpellingSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const suggestions = [];

    // Search makes
    carData.makes.forEach(make => {
      if (make.toLowerCase().includes(term)) {
        suggestions.push({
          text: make,
          type: 'Make',
          icon: '🏭'
        });
      }
    });

    // Search models
    Object.entries(carData.models).forEach(([make, models]) => {
      models.forEach(model => {
        if (model.toLowerCase().includes(term) || make.toLowerCase().includes(term)) {
          suggestions.push({
            text: `${make} ${model}`,
            type: 'Model',
            icon: '🔧'
          });
        }
      });
    });

    // Search years
    if (/^\d{1,4}$/.test(term)) {
      const year = parseInt(term);
      if (year >= 1990 && year <= 2024) {
        suggestions.push({
          text: `${year}`,
          type: 'Year',
          icon: '📅'
        });
      }
    }

    setAutocompleteSuggestions(suggestions.slice(0, 6));

    // Simple spell checking for common terms
    const spellCheck = generateSpellingSuggestions(term);
    setSpellingSuggestions(spellCheck);
  }, [searchTerm]);

  // Simple spelling suggestion generator
  const generateSpellingSuggestions = (term) => {
    const commonTerms = [
      ...carData.makes.map(m => m.toLowerCase()),
      'camry', 'civic', 'accord', 'corolla', 'prius', 'mustang', 'f-150',
      'luxury', 'electric', 'hybrid', 'sedan', 'suv', 'truck'
    ];

    const suggestions = [];
    commonTerms.forEach(commonTerm => {
      if (levenshteinDistance(term.toLowerCase(), commonTerm) <= 2 && 
          term.length > 2 && 
          commonTerm !== term.toLowerCase()) {
        suggestions.push({
          text: commonTerm.charAt(0).toUpperCase() + commonTerm.slice(1),
          type: 'Suggestion',
          icon: '💡'
        });
      }
    });

    return suggestions.slice(0, 3);
  };

  // Simple Levenshtein distance calculation
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const handleSuggestionClick = (suggestion) => {
    // Save to search history
    const currentHistory = recentSearches.filter(item => 
      typeof item === 'string' ? item !== suggestion : item.text !== suggestion
    );
    const newHistory = [suggestion, ...currentHistory].slice(0, 10);
    
    localStorage.setItem('whipsly-search-history', JSON.stringify(newHistory));
    setRecentSearches(newHistory.slice(0, 5));
    
    onSelectSuggestion(suggestion);
  };

  const SuggestionItem = ({ suggestion, icon: defaultIcon }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 group"
      onClick={() => handleSuggestionClick(typeof suggestion === 'string' ? suggestion : suggestion.text)}
    >
      <span className="text-lg group-hover:scale-110 transition-transform duration-150">
        {typeof suggestion === 'object' ? suggestion.icon : defaultIcon}
      </span>
      <div className="flex-1">
        <div className="font-medium text-gray-900">
          {typeof suggestion === 'string' ? suggestion : suggestion.text}
        </div>
        {typeof suggestion === 'object' && suggestion.type && (
          <div className="text-xs text-gray-500">{suggestion.type}</div>
        )}
      </div>
      <Search className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </motion.div>
  );

  const SuggestionGroup = ({ title, suggestions, icon, show = true }) => {
    if (!show || suggestions.length === 0) return null;

    return (
      <div className="border-b border-gray-100 last:border-b-0">
        <div className="px-4 py-2 bg-gray-50 text-sm font-semibold text-gray-700 flex items-center gap-2">
          {icon}
          {title}
        </div>
        {suggestions.map((suggestion, index) => (
          <SuggestionItem 
            key={index} 
            suggestion={suggestion} 
            icon={icon}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
    >
      <SuggestionGroup
        title="Popular Searches"
        suggestions={popularSearches}
        icon={<TrendingUp className="h-4 w-4" />}
        show={searchTerm.length === 0}
      />

      <SuggestionGroup
        title="Recent Searches"
        suggestions={recentSearches}
        icon={<Clock className="h-4 w-4" />}
        show={searchTerm.length === 0 && recentSearches.length > 0}
      />

      <SuggestionGroup
        title="Suggestions"
        suggestions={autocompleteSuggestions}
        icon={<Car className="h-4 w-4" />}
        show={autocompleteSuggestions.length > 0}
      />

      <SuggestionGroup
        title="Did you mean?"
        suggestions={spellingSuggestions}
        icon={<span className="text-sm">💡</span>}
        show={spellingSuggestions.length > 0}
      />
    </motion.div>
  );
});

SearchDropdown.displayName = 'SearchDropdown';

export default SearchDropdown;