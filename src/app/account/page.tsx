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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* My BRAMA Account Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                Welcome, {user?.name || 'Guest'}!
              </h2>
              {user?.email && (
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              )}
            </div>
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-full hover:bg-pink-700 transition font-semibold text-sm sm:text-base self-start sm:self-auto"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center gap-2 bg-pink-600 text-white px-5 py-2.5 rounded-full hover:bg-pink-700 transition font-semibold text-sm sm:text-base self-start sm:self-auto"
              >
                <LogIn size={18} />
                Sign In
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        {/* My Settings Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Settings</h2>
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
        </div>
      </div>
    </div>
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
      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group text-left"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition">
          <Icon size={24} className="text-pink-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400 group-hover:text-pink-600 transition flex-shrink-0 mt-1" />
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
      className={`flex items-center justify-between w-full p-4 rounded-lg border transition-all ${
        danger
          ? 'border-red-200 hover:border-red-500 hover:bg-red-50'
          : 'border-gray-200 hover:border-pink-500 hover:bg-pink-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={danger ? 'text-red-600' : 'text-pink-600'} />
        <span className={`font-medium ${danger ? 'text-red-900' : 'text-gray-900'}`}>
          {label}
        </span>
      </div>
      <ChevronRight size={20} className={danger ? 'text-red-400' : 'text-gray-400'} />
    </button>
  );
}