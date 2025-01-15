import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Client } from '../../types';
import { EditClientForm } from './EditClientForm';
import { api } from '../../lib/api';

interface Props {
  clients: Client[];
  onClientUpdate: () => void;
}

export const ClientList: React.FC<Props> = ({ clients, onClientUpdate }) => {
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleDelete = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.deleteClient(clientId);
        onClientUpdate(); // Refresh the list
      } catch (error) {
        console.error('Error deleting client:', error);
        alert('Failed to delete client');
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setEditingClient(client)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
                title="Edit client"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(client.id)}
                className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-gray-100"
                title="Delete client"
              >
                <Trash2 size={16} />
              </button>
            </div>

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
                <span className="font-medium">Preferred Currency:</span>{" "}
                {client["currency-selector"]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {editingClient && (
        <EditClientForm
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onUpdate={onClientUpdate}
        />
      )}
    </>
  );
};