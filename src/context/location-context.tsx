'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  location: string | null;
  setLocation: (loc: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user_location');
    if (saved) setLocation(saved);
  }, []);

  const handleSetLocation = (loc: string) => {
    localStorage.setItem('user_location', loc);
    setLocation(loc);
  };

  return (
    <LocationContext.Provider value={{ location, setLocation: handleSetLocation }}>
      {children}
    </LocationContext.Provider>
  );
}
