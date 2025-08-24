import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseNaturalLanguageQuery, generateSearchSuggestions } from '../utils/naturalLanguageSearch';

const EnhancedSearchBar = ({ 
  onSearch, 
  onFilterUpdate, 
  placeholder = "Try: 'reliable family SUV under $30k' or 'fuel efficient Toyota'",
  initialQuery = '' 
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAiMode, setIsAiMode] = useState(true);
  
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Generate suggestions based on partial query
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim() && isAiMode) {
        // Parse the query and show insights
        const parsed = parseNaturalLanguageQuery(query);
        setParsedResult(parsed);
        
        // Generate contextual suggestions
        const newSuggestions = generateSearchSuggestions(query);
        setSuggestions(newSuggestions);
        
        // Show AI insights if confidence is high enough
        setShowAiInsights(parsed.confidence > 20);
      } else {
        setParsedResult(null);
        setShowAiInsights(false);
        if (query.length === 0) {
          setSuggestions(generateSearchSuggestions(''));
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isAiMode]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setShowSuggestions(true);
    
    // Trigger regular search for immediate results
    if (onSearch) {
      onSearch(newQuery);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  const executeSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setShowSuggestions(false);
    setShowAiInsights(false);
    
    if (isAiMode) {
      // Use AI parsing to extract structured parameters
      const parsed = parseNaturalLanguageQuery(searchQuery);
      
      // Apply the parsed filters
      if (onFilterUpdate && Object.keys(parsed.parsedParams).length > 0) {
        onFilterUpdate(parsed.parsedParams);
      }
    }
    
    // Also trigger regular search
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    executeSearch(suggestion);
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    setShowAiInsights(false);
    setParsedResult(null);
    if (onSearch) onSearch('');
    if (onFilterUpdate) onFilterUpdate({});
  };

  const toggleAiMode = () => {
    setIsAiMode(!isAiMode);
    if (!isAiMode) {
      // Re-parse current query when enabling AI mode
      if (query.trim()) {
        const parsed = parseNaturalLanguageQuery(query);
        setParsedResult(parsed);
        setShowAiInsights(parsed.confidence > 20);
      }
    } else {
      setShowAiInsights(false);
      setParsedResult(null);
    }
  };

  return (
    <div className="relative w-full">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className={`w-full pl-12 pr-24 py-4 text-lg border-2 rounded-xl transition-all duration-200 ${
              isAiMode 
                ? 'border-purple-200 focus:border-purple-500 focus:ring-purple-200' 
                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
            } focus:outline-none focus:ring-4`}
          />
          
          <div className="absolute right-2 flex items-center space-x-2">
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
            
            <button
              type="button"
              onClick={toggleAiMode}
              className={`p-2 rounded-lg transition-all ${
                isAiMode 
                  ? 'bg-purple-100 text-purple-600 hover:bg-purple-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isAiMode ? 'AI Search Enabled' : 'Enable AI Search'}
            >
              <Sparkles className={`h-4 w-4 ${isAiMode ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>
      </form>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {showAiInsights && parsedResult && isAiMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 z-40 shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-900">AI Understanding</h4>
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                    {parsedResult.confidence}% confident
                  </span>
                </div>
                
                {parsedResult.suggestions.length > 0 && (
                  <div className="space-y-1">
                    {parsedResult.suggestions.map((suggestion, index) => (
                      <div key={index} className="text-sm text-purple-700 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
                
                {parsedResult.intent && (
                  <div className="mt-2 text-xs text-purple-600">
                    Search Intent: <span className="font-medium">{parsedResult.intent.replace('_', ' ')}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (suggestions.length > 0 || query.length === 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-30 max-h-80 overflow-y-auto"
          >
            {query.length === 0 ? (
              <>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  Try these natural language searches
                </div>
                {generateSearchSuggestions('').map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                  >
                    <div className="text-gray-900">{suggestion}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="px-4 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                  Suggested searches
                </div>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 flex items-center"
                  >
                    <Search className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="text-gray-900">{suggestion}</div>
                  </div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {(showSuggestions || showAiInsights) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowSuggestions(false);
            setShowAiInsights(false);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedSearchBar;