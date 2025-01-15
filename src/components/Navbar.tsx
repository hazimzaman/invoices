import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, FileText, Settings } from 'lucide-react';
import { LogoutButton } from './ui/LogoutButton';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex space-x-4 bg-slate-600">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium  ${isActive('/')}`}
            >
              <Users className="w-5 h-5 mr-2" />
              Clients
            </Link>
            <Link
              to="/invoices"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/invoices')}`}
            >
              <FileText className="w-5 h-5 mr-2  bg-red" />
              Invoices Hazimmm
            </Link>
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/settings')}`}
            >
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Link>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}