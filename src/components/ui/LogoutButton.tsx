import React from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '../../lib/auth';

export const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 rounded-md"
    >
      <LogOut className="w-5 h-5 mr-2" />
      Sign Out
    </button>
  );
};