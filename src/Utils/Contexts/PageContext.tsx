// src/Utils/Contexts/PagerContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface PagerContextType {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const PagerContext = createContext<PagerContextType | undefined>(
  undefined,
);

interface PagerProviderProps {
  children: ReactNode;
}

export function PagerProvider({ children }: PagerProviderProps) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <PagerContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PagerContext.Provider>
  );
}
