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
            background: 'rgb(var(--surface))',
            color: 'rgb(var(--ink-900))',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: '16px',
            padding: '12px 16px',
            border: '1px solid rgb(var(--brand-100))',
            boxShadow: '0 10px 30px -10px rgba(163, 74, 72, 0.3), 0 2px 10px rgba(0, 0, 0, 0.06)',
            maxWidth: '340px',
          },
          iconTheme: { primary: 'rgb(var(--brand-600))', secondary: '#ffffff' },
          success: { iconTheme: { primary: 'rgb(var(--brand-600))', secondary: '#ffffff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
        }}
      />
    </>
  );
}