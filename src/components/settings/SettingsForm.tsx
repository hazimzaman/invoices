import React from 'react';
import { ImageUpload } from '../ui/ImageUpload';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { uploadFile } from '../../utils/fileUpload';
import type { SettingsFormData } from '../../types/settings';

interface Props {
  formData: SettingsFormData;
  onChange: (data: SettingsFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
  successMessage?: string;
}

export const SettingsForm: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit,
  saving,
  successMessage
}) => {
  const handleLogoUpload = async (file: File) => {
    try {
      const logoUrl = await uploadFile(file);
      onChange({ ...formData, logo_url: logoUrl });
    } catch (error) {
      console.error('Failed to upload logo:', error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded">
          {successMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Logo
        </label>
        <ImageUpload
          currentImageUrl={formData.logo_url}
          onImageUpload={handleLogoUpload}
        />
      </div>

      <Input
        id="company_name"
        type="text"
        label="Company Name"
        value={formData.company_name}
        onChange={(e) => onChange({ ...formData, company_name: e.target.value })}
      />

      <Input
        id="name"
        type="text"
        label="Your Name"
        value={formData.name}
        onChange={(e) => onChange({ ...formData, name: e.target.value })}
      />

      <Input
        id="phone"
        type="tel"
        label="Phone Number"
        value={formData.phone}
        onChange={(e) => onChange({ ...formData, phone: e.target.value })}
      />

      <Input
        id="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={(e) => onChange({ ...formData, email: e.target.value })}
      />

      <Input
        id="wise_email"
        type="email"
        label="Wise Email (Optional)"
        value={formData.wise_email}
        onChange={(e) => onChange({ ...formData, wise_email: e.target.value })}
      />

      <Button type="submit" loading={saving}>
        Save Settings
      </Button>
    </form>
  );
};