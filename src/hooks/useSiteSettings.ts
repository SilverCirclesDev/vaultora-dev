import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description: string | null;
  category: 'general' | 'email' | 'security' | 'social' | 'advanced';
  created_at: string;
  updated_at: string;
}

interface SettingsObject {
  [key: string]: string | number | boolean;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SettingsObject>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .rpc('get_all_settings');

      if (error) {
        // Fallback to direct query if RPC doesn't exist
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('site_settings' as any)
          .select('*')
          .order('setting_key');
        
        if (fallbackError) throw fallbackError;
        
        // Convert array to object for easier access
        const settingsObj: SettingsObject = {};
        (fallbackData as any)?.forEach((setting: SiteSetting) => {
          let value: string | number | boolean = setting.setting_value;
          
          // Convert based on type
          if (setting.setting_type === 'boolean') {
            value = setting.setting_value === 'true';
          } else if (setting.setting_type === 'number') {
            value = parseFloat(setting.setting_value);
          }
          
          settingsObj[setting.setting_key] = value;
        });

        setSettings(settingsObj);
        return;
      }

      // If RPC exists, data is already formatted
      setSettings(data || {});
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load site settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string | number | boolean) => {
    try {
      const stringValue = String(value);
      
      const { error } = await supabase
        .from('site_settings' as any)
        .update({ 
          setting_value: stringValue,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) throw error;

      // Update local state
      setSettings(prev => ({ ...prev, [key]: value }));

      return true;
    } catch (error: any) {
      console.error('Error updating setting:', error);
      throw error;
    }
  };

  const updateMultipleSettings = async (updates: SettingsObject) => {
    try {
      const promises = Object.entries(updates).map(([key, value]) =>
        updateSetting(key, value)
      );

      await Promise.all(promises);
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getSetting = (key: string, defaultValue: any = '') => {
    return settings[key] ?? defaultValue;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    updateMultipleSettings,
    getSetting,
  };
};
