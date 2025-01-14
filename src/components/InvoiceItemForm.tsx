import React from 'react';

export interface InvoiceItem {
  name: string;
  price: number;
  currency: string;
}

interface Props {
  items: InvoiceItem[];
  onUpdateItem: (index: number, field: keyof InvoiceItem, value: string) => void;
  onAddItem: () => void;
}

const currencies = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'JPY', symbol: '¥' },
  { code: 'INR', symbol: '₹' },
];

export const InvoiceItemForm: React.FC<Props> = ({ items, onUpdateItem, onAddItem }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
      {items.map((item, index) => (
        <div key={index} className="flex space-x-4 mb-2">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdateItem(index, 'name', e.target.value)}
            placeholder="Item name"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <div className="flex w-48">
            <input
              type="number"
              value={item.price}
              onChange={(e) => onUpdateItem(index, 'price', e.target.value)}
              placeholder="Price"
              className="w-32 rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <select
              value={item.currency}
              onChange={(e) => onUpdateItem(index, 'currency', e.target.value)}
              className="rounded-r-md border-l-0 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddItem}
        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
      >
        + Add Item
      </button>
    </div>
  );
};