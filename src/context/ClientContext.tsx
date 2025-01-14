import React, { createContext, useContext, useState } from 'react';

interface Client {
  name: string;
  companyName?: string;
  vat?: string;
  phone: string;
  email: string;
  address: string;
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Client) => void;
}

const ClientContext = createContext<ClientContextType>({
  clients: [],
  addClient: () => {},
});

export const useClient = () => useContext(ClientContext);

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  const addClient = (client: Client) => {
    setClients([...clients, client]);
  };

  return (
    <ClientContext.Provider value={{ clients, addClient }}>
      {children}
    </ClientContext.Provider>
  );
};