import { supabase } from './supabase';
import type { ClientFormData } from '../types';

export const api = {
  // Clients
  getClients: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    return data || [];
  },
    
  createClient: async (clientData: ClientFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create client
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...clientData,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Client creation error:', error);
      throw new Error('Failed to create client');
    }

    return data;
  }
};