import React from 'react';
import { useSignUp } from '../../hooks/useSignUp';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface Props {
  onToggleMode: () => void;
}

export const SignUpForm: React.FC<Props> = ({ onToggleMode }) => {
  const { formData, errors, loading, handleChange, handleSubmit } = useSignUp();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        <Input
          id="name"
          type="text"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          id="phone"
          type="tel"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
        />

        <Input
          id="company_name"
          type="text"
          label="Company Name (Optional)"
          value={formData.company_name}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
      </div>

      <Button type="submit" loading={loading}>
        Create Account
      </Button>

      <div className="text-sm text-center">
        <button
          type="button"
          onClick={onToggleMode}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};