'use client';

import { Toaster } from 'react-hot-toast';
import React from 'react';

interface ProviderProps {
  children: React.ReactNode; 
}

export default function ToastProvider({ children }: ProviderProps) {
  return (
    <>
      {children} 
      <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  );
}