import React from 'react';

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, className = '' }) => {
  const currencies = [
    { code: 'USD', label: 'USD - US Dollar' },
    { code: 'EUR', label: 'EUR - Euro' },
    { code: 'GBP', label: 'GBP - British Pound' },
    { code: 'JPY', label: 'JPY - Japanese Yen' },
    { code: 'AUD', label: 'AUD - Australian Dollar' },
    { code: 'CAD', label: 'CAD - Canadian Dollar' },
    { code: 'CHF', label: 'CHF - Swiss Franc' },
    { code: 'CNY', label: 'CNY - Chinese Yuan' },
  ];

  return (
    <div className="mb-4">
      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
        Currency
      </label>
      <select
        id="currency"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 ${className}`}
      >
        <option value="">Select a currency</option>
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 