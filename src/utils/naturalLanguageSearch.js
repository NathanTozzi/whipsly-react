// Natural Language Search Parser for Vehicle Queries
// This module parses natural language queries and converts them to structured search parameters

// Keywords and synonyms for different vehicle attributes
const KEYWORDS = {
  vehicleTypes: {
    sedan: ['sedan', 'car'],
    suv: ['suv', 'crossover', 'cuv', 'sport utility'],
    truck: ['truck', 'pickup', 'f-150', 'silverado', 'ram'],
    hatchback: ['hatchback', 'hatch'],
    coupe: ['coupe', 'sports car', 'sport'],
    wagon: ['wagon', 'estate'],
    convertible: ['convertible', 'cabriolet', 'roadster']
  },
  
  priceTerms: {
    budget: ['budget', 'cheap', 'affordable', 'low cost', 'inexpensive'],
    luxury: ['luxury', 'premium', 'high-end', 'expensive', 'upscale'],
    under: ['under', 'below', 'less than', 'maximum', 'max'],
    over: ['over', 'above', 'more than', 'minimum', 'min'],
    around: ['around', 'about', 'approximately', 'roughly', 'near']
  },
  
  fuelTypes: {
    gas: ['gas', 'gasoline', 'petrol', 'regular'],
    electric: ['electric', 'ev', 'battery', 'tesla', 'plug-in'],
    hybrid: ['hybrid', 'prius', 'eco', 'fuel efficient'],
    diesel: ['diesel', 'tdi']
  },
  
  qualities: {
    reliable: ['reliable', 'dependable', 'trustworthy', 'proven', 'solid'],
    sporty: ['sporty', 'fast', 'performance', 'quick', 'powerful'],
    efficient: ['efficient', 'eco', 'economy', 'fuel-efficient', 'mpg'],
    family: ['family', 'family-friendly', 'kids', 'spacious', 'roomy'],
    compact: ['compact', 'small', 'city', 'parking'],
    new: ['new', 'latest', 'newest', 'recent', '2024', '2023'],
    used: ['used', 'pre-owned', 'second-hand', 'older']
  },
  
  brands: {
    toyota: ['toyota', 'lexus'],
    honda: ['honda', 'acura'],
    ford: ['ford', 'lincoln'],
    gm: ['chevrolet', 'chevy', 'cadillac', 'gmc', 'buick'],
    nissan: ['nissan', 'infiniti'],
    hyundai: ['hyundai', 'genesis', 'kia'],
    bmw: ['bmw', 'mini'],
    mercedes: ['mercedes', 'mercedes-benz', 'benz'],
    audi: ['audi'],
    volkswagen: ['volkswagen', 'vw'],
    mazda: ['mazda'],
    subaru: ['subaru'],
    tesla: ['tesla'],
    volvo: ['volvo'],
    jaguar: ['jaguar'],
    porsche: ['porsche']
  }
};

// Extract price information from query
const extractPriceInfo = (query) => {
  const lowerQuery = query.toLowerCase();
  const priceInfo = { min: null, max: null, range: null };
  
  // Look for price patterns like "$30k", "$30,000", "30000"
  const priceRegexes = [
    /\$?(\d{1,3}),?(\d{3})/g, // $30,000 or 30,000
    /\$?(\d+)k/g, // $30k or 30k
    /\$?(\d+)/g // $30000 or 30000
  ];
  
  const prices = [];
  priceRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(lowerQuery)) !== null) {
      let price;
      if (match[2]) {
        // Handle comma-separated numbers like 30,000
        price = parseInt(match[1] + match[2]);
      } else if (lowerQuery.includes('k')) {
        // Handle k notation like 30k
        price = parseInt(match[1]) * 1000;
      } else {
        price = parseInt(match[1]);
      }
      
      if (price > 1000) { // Filter out years and other small numbers
        prices.push(price);
      }
    }
  });
  
  // Determine if it's a min, max, or range based on context
  if (prices.length > 0) {
    if (lowerQuery.includes('under') || lowerQuery.includes('below') || lowerQuery.includes('max')) {
      priceInfo.max = Math.max(...prices);
    } else if (lowerQuery.includes('over') || lowerQuery.includes('above') || lowerQuery.includes('min')) {
      priceInfo.min = Math.max(...prices);
    } else if (prices.length >= 2) {
      priceInfo.min = Math.min(...prices);
      priceInfo.max = Math.max(...prices);
    } else {
      // Default to treating single price as maximum
      priceInfo.max = prices[0];
    }
  }
  
  return priceInfo;
};

// Extract year information
const extractYearInfo = (query) => {
  const yearRegex = /(19|20)\d{2}/g;
  const years = [];
  let match;
  
  while ((match = yearRegex.exec(query)) !== null) {
    const year = parseInt(match[0]);
    if (year >= 1990 && year <= new Date().getFullYear() + 1) {
      years.push(year);
    }
  }
  
  if (years.length > 0) {
    if (query.toLowerCase().includes('newer') || query.toLowerCase().includes('after')) {
      return { min: Math.max(...years) };
    } else if (query.toLowerCase().includes('older') || query.toLowerCase().includes('before')) {
      return { max: Math.min(...years) };
    } else {
      return { exact: years[0] };
    }
  }
  
  return null;
};

// Find matching keywords in query
const findKeywordMatches = (query, keywordCategory) => {
  const lowerQuery = query.toLowerCase();
  const matches = [];
  
  Object.entries(keywordCategory).forEach(([key, synonyms]) => {
    synonyms.forEach(synonym => {
      if (lowerQuery.includes(synonym.toLowerCase())) {
        matches.push(key);
      }
    });
  });
  
  return [...new Set(matches)]; // Remove duplicates
};

// Main natural language parsing function
export const parseNaturalLanguageQuery = (query) => {
  if (!query || query.trim().length < 3) {
    return {
      originalQuery: query,
      parsedParams: {},
      confidence: 0,
      suggestions: []
    };
  }
  
  const lowerQuery = query.toLowerCase().trim();
  const parsedParams = {};
  let confidence = 0;
  const suggestions = [];
  
  // Extract price information
  const priceInfo = extractPriceInfo(query);
  if (priceInfo.min || priceInfo.max) {
    if (priceInfo.min) parsedParams.priceMin = priceInfo.min;
    if (priceInfo.max) parsedParams.priceMax = priceInfo.max;
    confidence += 30;
    suggestions.push(`Price range: ${priceInfo.min ? '$' + priceInfo.min.toLocaleString() + ' - ' : ''}${priceInfo.max ? '$' + priceInfo.max.toLocaleString() : ''}`);
  }
  
  // Extract year information
  const yearInfo = extractYearInfo(query);
  if (yearInfo) {
    if (yearInfo.exact) {
      parsedParams.year = yearInfo.exact.toString();
      confidence += 20;
      suggestions.push(`Year: ${yearInfo.exact}`);
    } else if (yearInfo.min) {
      parsedParams.yearMin = yearInfo.min;
      confidence += 15;
      suggestions.push(`${yearInfo.min} or newer`);
    } else if (yearInfo.max) {
      parsedParams.yearMax = yearInfo.max;
      confidence += 15;
      suggestions.push(`${yearInfo.max} or older`);
    }
  }
  
  // Find vehicle types
  const vehicleTypes = findKeywordMatches(lowerQuery, KEYWORDS.vehicleTypes);
  if (vehicleTypes.length > 0) {
    parsedParams.bodyStyle = vehicleTypes[0];
    confidence += 25;
    suggestions.push(`Vehicle type: ${vehicleTypes[0].toUpperCase()}`);
  }
  
  // Find fuel types
  const fuelTypes = findKeywordMatches(lowerQuery, KEYWORDS.fuelTypes);
  if (fuelTypes.length > 0) {
    parsedParams.fuelType = fuelTypes[0];
    confidence += 20;
    suggestions.push(`Fuel type: ${fuelTypes[0]}`);
  }
  
  // Find brands
  const brands = findKeywordMatches(lowerQuery, KEYWORDS.brands);
  if (brands.length > 0) {
    // Convert brand groups to actual make names
    const brandMap = {
      toyota: 'Toyota', honda: 'Honda', ford: 'Ford', gm: 'Chevrolet',
      nissan: 'Nissan', hyundai: 'Hyundai', bmw: 'BMW', mercedes: 'Mercedes-Benz',
      audi: 'Audi', volkswagen: 'Volkswagen', mazda: 'Mazda', subaru: 'Subaru',
      tesla: 'Tesla', volvo: 'Volvo', jaguar: 'Jaguar', porsche: 'Porsche'
    };
    parsedParams.make = brandMap[brands[0]] || brands[0];
    confidence += 35;
    suggestions.push(`Brand: ${parsedParams.make}`);
  }
  
  // Find qualities and adjust other parameters accordingly
  const qualities = findKeywordMatches(lowerQuery, KEYWORDS.qualities);
  if (qualities.includes('family')) {
    if (!parsedParams.bodyStyle) {
      parsedParams.bodyStyle = 'suv';
      suggestions.push('Family-friendly: SUV recommended');
    }
    confidence += 15;
  }
  
  if (qualities.includes('efficient')) {
    if (!parsedParams.fuelType) {
      parsedParams.fuelType = 'hybrid';
      suggestions.push('Fuel efficient: Hybrid recommended');
    }
    confidence += 15;
  }
  
  if (qualities.includes('reliable')) {
    if (!parsedParams.make) {
      parsedParams.make = 'Toyota';
      suggestions.push('Reliable: Toyota recommended');
    }
    confidence += 10;
  }
  
  // Handle budget constraints
  const budgetTerms = findKeywordMatches(lowerQuery, KEYWORDS.priceTerms.budget);
  const luxuryTerms = findKeywordMatches(lowerQuery, KEYWORDS.priceTerms.luxury);
  
  if (budgetTerms.length > 0 && !parsedParams.priceMax) {
    parsedParams.priceMax = 25000;
    confidence += 10;
    suggestions.push('Budget-friendly: Under $25,000');
  }
  
  if (luxuryTerms.length > 0 && !parsedParams.priceMin) {
    parsedParams.priceMin = 40000;
    confidence += 10;
    suggestions.push('Luxury: $40,000+');
  }
  
  // Extract specific model mentions
  const commonModels = [
    'camry', 'accord', 'civic', 'corolla', 'prius', 'rav4', 'cr-v',
    'f-150', 'silverado', 'tahoe', 'suburban', 'model 3', 'model y',
    'x3', 'x5', '3 series', '5 series', 'c-class', 'e-class'
  ];
  
  commonModels.forEach(model => {
    if (lowerQuery.includes(model)) {
      parsedParams.model = model;
      confidence += 40;
      suggestions.push(`Model: ${model}`);
    }
  });
  
  return {
    originalQuery: query,
    parsedParams,
    confidence: Math.min(confidence, 100),
    suggestions,
    intent: determineSearchIntent(lowerQuery, parsedParams)
  };
};

// Determine the user's search intent
const determineSearchIntent = (query, params) => {
  if (query.includes('compare') || query.includes('vs')) {
    return 'compare';
  }
  if (query.includes('best') || query.includes('top') || query.includes('recommend')) {
    return 'recommendation';
  }
  if (query.includes('deal') || query.includes('sale') || query.includes('discount')) {
    return 'deals';
  }
  if (Object.keys(params).length > 0) {
    return 'filtered_search';
  }
  return 'general_search';
};

// Generate search suggestions based on partial query
export const generateSearchSuggestions = (partialQuery) => {
  if (!partialQuery || partialQuery.length < 2) {
    return [
      'Reliable family SUV under $30k',
      'Fuel efficient hybrid cars',
      'Luxury sedans over $40k',
      'Electric vehicles 2023 or newer',
      'Budget-friendly trucks under $25k',
      'Small cars for city driving',
      'Best deals on Toyota vehicles'
    ];
  }
  
  const parsed = parseNaturalLanguageQuery(partialQuery);
  const suggestions = [];
  
  // Add completion suggestions
  if (partialQuery.toLowerCase().includes('reliable')) {
    suggestions.push('reliable family SUV under $30k');
    suggestions.push('reliable Honda or Toyota sedan');
  }
  
  if (partialQuery.toLowerCase().includes('family')) {
    suggestions.push('family SUV with good safety ratings');
    suggestions.push('family-friendly 7-seater vehicles');
  }
  
  if (partialQuery.toLowerCase().includes('budget')) {
    suggestions.push('budget cars under $20k');
    suggestions.push('budget SUVs with low mileage');
  }
  
  return suggestions.length > 0 ? suggestions : [
    `${partialQuery} with low mileage`,
    `${partialQuery} 2022 or newer`,
    `${partialQuery} under $40k`
  ];
};

export default parseNaturalLanguageQuery;