// Affiliate partner configurations
export const AFFILIATE_PARTNERS = {
  cargurus: {
    name: 'CarGurus',
    baseUrl: 'https://www.cargurus.com',
    trackingParam: 'src=whipsly',
    priority: 1,
    regions: ['US', 'CA']
  },
  cars: {
    name: 'Cars.com',
    baseUrl: 'https://www.cars.com',
    trackingParam: 'aff=whipsly&utm_source=whipsly',
    priority: 2,
    regions: ['US']
  },
  autotrader: {
    name: 'AutoTrader',
    baseUrl: 'https://www.autotrader.com',
    trackingParam: 'ref=whipsly',
    priority: 3,
    regions: ['US']
  },
  carmax: {
    name: 'CarMax',
    baseUrl: 'https://www.carmax.com',
    trackingParam: 'utm_source=whipsly&utm_medium=referral',
    priority: 4,
    regions: ['US']
  }
};

// Regional preferences for affiliate routing
export const REGIONAL_PREFERENCES = {
  // US States
  'CA': ['cargurus', 'cars', 'autotrader'], // California
  'TX': ['autotrader', 'cars', 'cargurus'], // Texas
  'FL': ['cars', 'cargurus', 'autotrader'], // Florida
  'NY': ['cars', 'autotrader', 'cargurus'], // New York
  'DEFAULT': ['cargurus', 'cars', 'autotrader', 'carmax']
};

// Vehicle-specific affiliate preferences
export const VEHICLE_TYPE_AFFILIATES = {
  luxury: ['autotrader', 'cars', 'cargurus'],
  economy: ['cargurus', 'cars', 'carmax'],
  suv: ['cars', 'autotrader', 'cargurus'],
  truck: ['autotrader', 'cars', 'cargurus'],
  electric: ['cars', 'cargurus', 'autotrader']
};

// Commission tracking (internal use)
export const COMMISSION_RATES = {
  cargurus: 0.025, // 2.5%
  cars: 0.02, // 2%
  autotrader: 0.03, // 3%
  carmax: 0.015 // 1.5%
};

export const DEFAULT_AFFILIATE = 'cargurus';