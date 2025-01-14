import { supabase } from '../supabase';
import { handleError } from './base';
import type { Settings, UpdateSettingsData } from '../../types/settings';

export const settingsApi = {
  getSettings: async (): Promise<Settings> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('settings')
            .insert({
              user_id: user.id,
              email: user.email,
              next_invoice_number: 1
            })
            .select()
            .single();

          if (insertError) throw insertError;
          return newData as Settings;
        }
        throw error;
      }

      return data as Settings;
    } catch (error) {
      throw handleError(error);
    }
  },

  updateSettings: async (settings: UpdateSettingsData): Promise<Settings> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Settings;
    } catch (error) {
      throw handleError(error);
    }
  }
};