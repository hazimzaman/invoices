import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { SettingsForm } from '../components/settings/SettingsForm';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import type { SettingsFormData } from '../types/settings';

export default function Settings() {
  const { settings, loading, error, updateSettings } = useSettings();
  const [formData, setFormData] = useState<SettingsFormData>({
    next_invoice_number: '1',
    company_name: '',
    name: '',
    phone: '',
    email: '',
    wise_email: '',
    logo_url: ''
  });
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        next_invoice_number: String(settings.next_invoice_number),
        company_name: settings.company_name || '',
        name: settings.name || '',
        phone: settings.phone || '',
        email: settings.email || '',
        wise_email: settings.wise_email || '',
        logo_url: settings.logo_url || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');

    try {
      await updateSettings({
        ...formData,
        next_invoice_number: parseInt(formData.next_invoice_number, 10)
      });
      setSuccessMessage('Settings saved successfully!');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Global Settings</h1>
      <SettingsForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        saving={saving}
        successMessage={successMessage}
      />
    </div>
  );
}