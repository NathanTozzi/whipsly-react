// Affiliate partner URLs and tracking IDs by state/region
export const AFFILIATE_PARTNERS = {
  // Primary partners
  cargurus: {
    name: 'CarGurus',
    baseUrl: 'https://www.cargurus.com',
    trackingParam: 'src=whipsly',
    priority: 1
  },
  
  cars: {
    name: 'Cars.com',
    baseUrl: 'https://www.cars.com',
    trackingParam: 'aff=whipsly',
    priority: 2
  },
  
  autotrader: {
    name: 'AutoTrader',
    baseUrl: 'https://www.autotrader.com',
    trackingParam: 'ref=whipsly',
    priority: 3
  },
  
  carmax: {
    name: 'CarMax',
    baseUrl: 'https://www.carmax.com',
    trackingParam: 'utm_source=whipsly',
    priority: 4
  },
  
  vroom: {
    name: 'Vroom',
    baseUrl: 'https://www.vroom.com',
    trackingParam: 'utm_source=whipsly&utm_medium=referral',
    priority: 5
  }
};

// Regional preferences (some partners work better in certain regions)
export const REGIONAL_PREFERENCES = {
  // West Coast states
  CA: ['cargurus', 'cars', 'vroom', 'autotrader', 'carmax'],
  WA: ['cargurus', 'cars', 'vroom', 'autotrader', 'carmax'],
  OR: ['cargurus', 'cars', 'vroom', 'autotrader', 'carmax'],
  
  // East Coast states
  NY: ['cars', 'cargurus', 'autotrader', 'carmax', 'vroom'],
  NJ: ['cars', 'cargurus', 'autotrader', 'carmax', 'vroom'],
  MA: ['cars', 'cargurus', 'autotrader', 'carmax', 'vroom'],
  FL: ['cars', 'cargurus', 'autotrader', 'carmax', 'vroom'],
  
  // Texas
  TX: ['autotrader', 'cars', 'cargurus', 'carmax', 'vroom'],
  
  // Midwest
  IL: ['cars', 'autotrader', 'cargurus', 'carmax', 'vroom'],
  OH: ['cars', 'autotrader', 'cargurus', 'carmax', 'vroom'],
  MI: ['cars', 'autotrader', 'cargurus', 'carmax', 'vroom'],
  
  // Default fallback
  DEFAULT: ['cargurus', 'cars', 'autotrader', 'carmax', 'vroom']
};

// Dealer-specific affiliate links
export const DEALER_AFFILIATES = {
  // Local dealer networks
  sonic: {
    name: 'Sonic Automotive',
    baseUrl: 'https://www.sonicautomotive.com',
    trackingParam: 'ref=whipsly',
    states: ['TX', 'CA', 'FL', 'GA', 'NC', 'SC', 'TN', 'AL', 'CO', 'NV']
  },
  
  autonation: {
    name: 'AutoNation',
    baseUrl: 'https://www.autonation.com',
    trackingParam: 'utm_source=whipsly',
    states: ['FL', 'TX', 'CA', 'AZ', 'CO', 'NV', 'GA', 'MD', 'VA', 'NJ']
  },
  
  lithia: {
    name: 'Lithia Motors',
    baseUrl: 'https://www.lithia.com',
    trackingParam: 'source=whipsly',
    states: ['OR', 'WA', 'CA', 'ID', 'MT', 'ND', 'NV', 'TX', 'AK']
  }
};

// Vehicle type specific affiliates (some partners are better for certain vehicle types)
export const VEHICLE_TYPE_AFFILIATES = {
  luxury: ['cars', 'autotrader', 'cargurus'],
  electric: ['vroom', 'cargurus', 'cars'],
  truck: ['autotrader', 'cars', 'cargurus'],
  sports: ['autotrader', 'cargurus', 'cars'],
  economy: ['cargurus', 'cars', 'vroom']
};

// Financing partners
export const FINANCING_PARTNERS = {
  capital_one: {
    name: 'Capital One Auto Navigator',
    url: 'https://www.capitalone.com/cars/?external_id=WWW_XXX_XXX_XXXXX_XXXXXXX&target_id=whipsly',
    description: 'Pre-qualify with no impact to your credit score'
  },
  
  lightstream: {
    name: 'LightStream Auto Loans',
    url: 'https://www.lightstream.com/auto-loans?utm_source=whipsly&utm_medium=referral',
    description: 'Low rates for qualified borrowers'
  },
  
  myautoloan: {
    name: 'myAutoloan',
    url: 'https://www.myautoloan.com/?ref=whipsly',
    description: 'Get pre-approved in minutes'
  }
};

// Insurance partners
export const INSURANCE_PARTNERS = {
  progressive: {
    name: 'Progressive',
    url: 'https://www.progressive.com/auto/?code=whipsly',
    description: 'Compare auto insurance quotes'
  },
  
  geico: {
    name: 'GEICO',
    url: 'https://www.geico.com/?ref=whipsly',
    description: '15 minutes could save you 15% or more'
  }
};

// Commission rates (for internal tracking)
export const COMMISSION_RATES = {
  cargurus: 0.02, // 2%
  cars: 0.015, // 1.5%
  autotrader: 0.025, // 2.5%
  carmax: 0.01, // 1%
  vroom: 0.02 // 2%
};

// Default affiliate link (fallback)
export const DEFAULT_AFFILIATE = 'cargurus';