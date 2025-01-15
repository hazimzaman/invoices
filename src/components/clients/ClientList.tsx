import React from 'react';
import type { Client } from '../../types';

interface Props {
  clients: Client[];
}

export const ClientList: React.FC<Props> = ({ clients }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <div key={client.id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">{client.name}</h3>
          {client.company_name && (
            <p className="text-gray-600">{client.company_name}</p>
          )}
          <div className="mt-4 space-y-2">
            {client.vat && (
              <p className="text-sm">
                <span className="font-medium">VAT:</span> {client.vat}
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Phone:</span> {client.phone}
            </p>
            <p className="text-sm">
              <span className="font-medium">Email:</span> {client.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Address:</span> {client.address}
            </p>
            <p className="text-sm">
              <span className="font-medium">Preferred Currency:</span> {client.currency_selector}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};