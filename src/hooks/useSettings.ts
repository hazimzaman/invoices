import { useState, useEffect } from 'react';
import { settingsApi } from '../lib/api/settings';
import { APIError } from '../lib/api/base';
import type { Settings, UpdateSettingsData } from '../types/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsApi.getSettings();
      setSettings(data);
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to load settings';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (data: UpdateSettingsData): Promise<boolean> => {
    try {
      setError(null);
      const updatedSettings = await settingsApi.updateSettings(data);
      setSettings(updatedSettings);
      return true;
    } catch (err) {
      const message = err instanceof APIError ? err.message : 'Failed to save settings';
      setError(message);
      return false;
    }
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings: loadSettings
  };
};