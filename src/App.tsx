import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { AuthContainer } from './components/auth/AuthContainer';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import Navbar from './components/Navbar';
import Clients from './pages/Clients';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import { ClientProvider } from './context/ClientContext';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" className="border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <AuthContainer />;
  }

  return (
    <BrowserRouter>
      <ClientProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Clients />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </ClientProvider>
    </BrowserRouter>
  );
}