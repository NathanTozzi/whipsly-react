import React from 'react';
import { useLocation } from 'react-router-dom';
import VehicleSearch from '../components/VehicleSearch';

const SearchPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  return (
    <div>
      <VehicleSearch initialQuery={initialQuery} showHeader={true} />
    </div>
  );
};

export default SearchPage;