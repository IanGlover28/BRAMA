'use client';

import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { applyTheme, readThemePreference, type ThemePreference } from '@/lib/theme';

const NEXT: Record<ThemePreference, ThemePreference> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const LABEL: Record<ThemePreference, string> = {
  system: 'Theme: matches your device',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

export default function ThemeToggle({ className = '' }: { className?: string }) {
  // Starts as "system" on the server; the real choice is read after mount.
  const [preference, setPreference] = useState<ThemePreference>('system');

  useEffect(() => {
    setPreference(readThemePreference());
  }, []);

  const cycle = () => {
    const next = NEXT[preference];
    applyTheme(next);
    setPreference(next);
  };

  const Icon = preference === 'light' ? Sun : preference === 'dark' ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`${LABEL[preference]}. Click to change.`}
      title={LABEL[preference]}
      className={`flex items-center justify-center h-9 w-9 rounded-full text-white hover:bg-white/15 transition-colors ${className}`}
    >
      <Icon size={18} />
    </button>
  );
}
