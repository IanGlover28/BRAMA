'use client';

import { useRouter } from 'next/navigation';
import { 
  Package, 
  Mail, 
  Star, 
  Tag, 
  Heart, 
  CreditCard, 
  MapPin, 
  Settings, 
  XCircle,
  LogOut,
  LogIn,
  ChevronRight
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useClerk } from '@clerk/nextjs';

function getInitials(name?: string, email?: string): string {
  if (name) {
    return name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  return (email?.[0] ?? 'B').toUpperCase();
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useCurrentUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut({ redirectUrl: "/" });
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Profile hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-pink-700 to-pink-900 text-white pt-[200px] md:pt-[175px] pb-24">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-16 left-1/4 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white/15 border-2 border-white/30 text-2xl font-extrabold backdrop-blur-sm shrink-0">
            {getInitials(user?.name, user?.email)}
          </div>
          <div className="text-center sm:text-left min-w-0">
            <p className="text-xs uppercase tracking-widest text-pink-200 font-semibold mb-1">
              My .BRAMA Account
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold truncate">
              Welcome, {user?.name || 'Guest'}!
            </h1>
            {user?.email && (
              <p className="text-sm text-pink-100 truncate mt-1">{user.email}</p>
            )}
          </div>
          <div className="sm:ml-auto shrink-0">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-white text-pink-700 px-5 py-2.5 rounded-full hover:bg-pink-50 transition font-semibold text-sm shadow-lg"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-2 bg-white text-pink-700 px-5 py-2.5 rounded-full hover:bg-pink-50 transition font-semibold text-sm shadow-lg"
              >
                <LogIn size={18} />
                Sign In
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-14 relative z-10 space-y-6">
        {/* My Account */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-pink-600" />
            My Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AccountMenuItem
              icon={Package}
              label="Orders"
              description="Track, return, or buy again"
              onClick={() => router.push('/orders')}
            />
            <AccountMenuItem
              icon={Mail}
              label="Inbox"
              description="View messages and notifications"
              onClick={() => router.push('/inbox')}
            />
            <AccountMenuItem
              icon={Star}
              label="Ratings & Reviews"
              description="View and manage your reviews"
              onClick={() => router.push('/reviews')}
            />
            <AccountMenuItem
              icon={Tag}
              label="Vouchers"
              description="View available vouchers"
              onClick={() => router.push('/vouchers')}
            />
            <AccountMenuItem
              icon={Heart}
              label="Wishlist"
              description="Your saved items"
              onClick={() => router.push('/wishlist')}
            />
          </div>
        </section>

        {/* My Settings */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="h-6 w-1 rounded-full bg-pink-600" />
            Settings
          </h2>
          <div className="space-y-3">
            <SettingsMenuItem
              icon={CreditCard}
              label="Payment Settings"
              onClick={() => router.push('/settings/payment')}
            />
            <SettingsMenuItem
              icon={MapPin}
              label="Address Book"
              onClick={() => router.push('/settings/address')}
            />
            <SettingsMenuItem
              icon={Settings}
              label="Account Management"
              onClick={() => router.push('/settings/account')}
            />
            <SettingsMenuItem
              icon={XCircle}
              label="Close Account"
              onClick={() => router.push('/settings/close-account')}
              danger
            />
          </div>
        </section>
      </div>
    </main>
  );
}

interface AccountMenuItemProps {
  icon: React.ElementType;
  label: string;
  description: string;
  onClick: () => void;
}

function AccountMenuItem({ icon: Icon, label, description, onClick }: AccountMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:border-pink-400 hover:bg-white hover:shadow-md transition-all group text-left"
    >
      <span className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
        <Icon size={22} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-semibold text-gray-900">{label}</span>
        <span className="block text-sm text-gray-500">{description}</span>
      </span>
      <ChevronRight size={18} className="text-gray-300 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all shrink-0" />
    </button>
  );
}

interface SettingsMenuItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function SettingsMenuItem({ icon: Icon, label, onClick, danger }: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${
        danger
          ? 'border-red-100 hover:border-red-300 hover:bg-red-50'
          : 'border-gray-100 hover:border-pink-300 hover:bg-pink-50/50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex items-center justify-center h-10 w-10 rounded-full ${
            danger ? 'bg-red-50 text-red-600' : 'bg-pink-50 text-pink-600'
          }`}
        >
          <Icon size={18} />
        </span>
        <span className={`font-medium ${danger ? 'text-red-700' : 'text-gray-900'}`}>
          {label}
        </span>
      </div>
      <ChevronRight size={18} className={danger ? 'text-red-300' : 'text-gray-300'} />
    </button>
  );
}