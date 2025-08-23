import { useState, useEffect } from 'react';
import { 
  AFFILIATE_PARTNERS, 
  REGIONAL_PREFERENCES, 
  VEHICLE_TYPE_AFFILIATES,
  DEFAULT_AFFILIATE 
} from '../data/affiliates';

const useAffiliateLink = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationLoaded, setIsLocationLoaded] = useState(false);

  // Fetch user location on hook initialization
  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    try {
      // Try to get location from localStorage first (cache for 24 hours)
      const cachedLocation = localStorage.getItem('whipsly-user-location');
      if (cachedLocation) {
        const { location, timestamp } = JSON.parse(cachedLocation);
        const dayInMs = 24 * 60 * 60 * 1000;
        
        if (Date.now() - timestamp < dayInMs) {
          setUserLocation(location);
          setIsLocationLoaded(true);
          return;
        }
      }

      // Fetch fresh location data using ipapi.co (free tier)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const location = {
        state: data.region_code || 'DEFAULT',
        country: data.country_code || 'US',
        city: data.city || 'Unknown',
        zip: data.postal || null,
        lat: data.latitude || null,
        lng: data.longitude || null
      };
      
      // Cache the location
      localStorage.setItem('whipsly-user-location', JSON.stringify({
        location,
        timestamp: Date.now()
      }));
      
      setUserLocation(location);
      setIsLocationLoaded(true);
    } catch (error) {
      console.error('Failed to fetch user location:', error);
      // Fallback to default
      setUserLocation({ 
        state: 'DEFAULT', 
        country: 'US', 
        city: 'Unknown', 
        zip: null 
      });
      setIsLocationLoaded(true);
    }
  };

  // Get the best affiliate partner for the user's location and vehicle type
  const getBestAffiliate = (vehicleType = null, vehicleInfo = {}) => {
    if (!userLocation) {
      return DEFAULT_AFFILIATE;
    }

    // Check vehicle type preferences first
    if (vehicleType && VEHICLE_TYPE_AFFILIATES[vehicleType.toLowerCase()]) {
      const typePreferences = VEHICLE_TYPE_AFFILIATES[vehicleType.toLowerCase()];
      const regionalPrefs = REGIONAL_PREFERENCES[userLocation.state] || REGIONAL_PREFERENCES.DEFAULT;
      
      // Find the intersection of type preferences and regional preferences
      for (const affiliate of typePreferences) {
        if (regionalPrefs.includes(affiliate)) {
          return affiliate;
        }
      }
    }

    // Fall back to regional preferences
    const regionalPrefs = REGIONAL_PREFERENCES[userLocation.state] || REGIONAL_PREFERENCES.DEFAULT;
    return regionalPrefs[0] || DEFAULT_AFFILIATE;
  };

  // Generate affiliate link with proper tracking
  const getAffiliateLink = (vehicleInfo = {}, customUrl = null) => {
    const vehicleType = determineVehicleType(vehicleInfo);
    const bestAffiliate = getBestAffiliate(vehicleType, vehicleInfo);
    const partner = AFFILIATE_PARTNERS[bestAffiliate];
    
    if (!partner) {
      return customUrl || '#';
    }

    // If custom URL provided, add tracking to it
    if (customUrl) {
      try {
        const url = new URL(customUrl);
        const trackingParams = partner.trackingParam.split('&');
        
        trackingParams.forEach(param => {
          const [key, value] = param.split('=');
          url.searchParams.set(key, value);
        });
        
        return url.toString();
      } catch (error) {
        console.error('Invalid URL provided:', customUrl);
        return customUrl;
      }
    }

    // Create search URL with vehicle parameters
    let searchUrl = partner.baseUrl;
    
    // Add vehicle-specific search parameters
    if (vehicleInfo.make || vehicleInfo.model || vehicleInfo.year) {
      const searchParams = new URLSearchParams();
      
      if (vehicleInfo.make) searchParams.append('make', vehicleInfo.make);
      if (vehicleInfo.model) searchParams.append('model', vehicleInfo.model);
      if (vehicleInfo.year) searchParams.append('year', vehicleInfo.year);
      if (userLocation && userLocation.zip) searchParams.append('zip', userLocation.zip);
      
      searchUrl += '/cars/?' + searchParams.toString();
    }
    
    // Add tracking parameters
    const separator = searchUrl.includes('?') ? '&' : '?';
    return `${searchUrl}${separator}${partner.trackingParam}`;
  };

  // Determine vehicle type based on make/model
  const determineVehicleType = (vehicleInfo) => {
    const { make, model } = vehicleInfo;
    
    if (!make || !model) return null;
    
    const luxuryBrands = ['bmw', 'mercedes-benz', 'audi', 'lexus', 'infiniti', 'acura'];
    const electricModels = ['model s', 'model 3', 'model x', 'model y', 'leaf', 'bolt'];
    const truckModels = ['f-150', 'silverado', 'ram', 'tundra', 'titan'];
    const suvModels = ['x3', 'x5', 'rx', 'cx-5', 'cr-v', 'rav4', 'equinox'];
    
    if (luxuryBrands.includes(make.toLowerCase())) {
      return 'luxury';
    }
    
    if (electricModels.some(model => model.includes(model.toLowerCase()))) {
      return 'electric';
    }
    
    if (truckModels.some(truck => model.toLowerCase().includes(truck))) {
      return 'truck';
    }
    
    if (suvModels.some(suv => model.toLowerCase().includes(suv))) {
      return 'suv';
    }
    
    return 'economy';
  };

  // Track affiliate click for analytics
  const trackAffiliateClick = (affiliatePartner, vehicleInfo = {}) => {
    try {
      // Track the click event
      if (window.gtag) {
        window.gtag('event', 'affiliate_click', {
          affiliate_partner: affiliatePartner,
          user_state: userLocation?.state,
          vehicle_make: vehicleInfo.make,
          vehicle_model: vehicleInfo.model,
          vehicle_year: vehicleInfo.year
        });
      }
      
      // Store in localStorage for internal tracking
      const clickData = {
        partner: affiliatePartner,
        timestamp: Date.now(),
        location: userLocation,
        vehicle: vehicleInfo
      };
      
      const existingClicks = JSON.parse(localStorage.getItem('whipsly-affiliate-clicks') || '[]');
      existingClicks.push(clickData);
      
      // Keep only last 100 clicks
      if (existingClicks.length > 100) {
        existingClicks.splice(0, existingClicks.length - 100);
      }
      
      localStorage.setItem('whipsly-affiliate-clicks', JSON.stringify(existingClicks));
    } catch (error) {
      console.error('Failed to track affiliate click:', error);
    }
  };

  return {
    userLocation,
    isLocationLoaded,
    getBestAffiliate,
    getAffiliateLink,
    trackAffiliateClick,
    refreshLocation: fetchUserLocation
  };
};

export default useAffiliateLink;