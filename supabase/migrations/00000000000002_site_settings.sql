-- =====================================================
-- Site Settings Table
-- =====================================================
-- This migration creates a table to store site-wide settings
-- that can be managed through the admin panel.
-- =====================================================

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
  description TEXT,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'email', 'security', 'social', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to update timestamps
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description, category) VALUES
-- General Settings
('site_name', 'Vaultora Cyber Defense', 'string', 'Website name', 'general'),
('site_description', 'Professional cybersecurity services including penetration testing, network security, and vulnerability assessments.', 'string', 'Website description', 'general'),
('contact_email', 'contact@vaultora.com', 'string', 'Primary contact email', 'general'),
('contact_phone', '+1-234-567-8900', 'string', 'Primary contact phone', 'general'),
('address', '1234 Cyber Security Drive, Austin, TX 78701', 'string', 'Business address', 'general'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 'general'),
('analytics_enabled', 'true', 'boolean', 'Enable analytics tracking', 'general'),

-- Social Media Settings
('social_twitter', '@VaultoraSec', 'string', 'Twitter handle', 'social'),
('social_linkedin', 'company/vaultora-cyber-defense', 'string', 'LinkedIn company page', 'social'),
('social_facebook', 'VaultoraSecurit', 'string', 'Facebook page name', 'social'),
('social_instagram', 'vaultorasec', 'string', 'Instagram handle', 'social'),

-- Email Settings
('smtp_host', '', 'string', 'SMTP server host', 'email'),
('smtp_port', '587', 'number', 'SMTP server port', 'email'),
('smtp_username', '', 'string', 'SMTP username', 'email'),
('smtp_password', '', 'string', 'SMTP password (encrypted)', 'email'),
('from_email', 'noreply@vaultora.com', 'string', 'From email address', 'email'),
('from_name', 'Vaultora Cyber Defense', 'string', 'From name', 'email'),

-- Security Settings
('session_timeout', '24', 'number', 'Session timeout in hours', 'security'),
('max_login_attempts', '5', 'number', 'Maximum login attempts', 'security'),
('password_min_length', '8', 'number', 'Minimum password length', 'security'),
('require_2fa', 'false', 'boolean', 'Require two-factor authentication', 'security'),
('api_rate_limit', '100', 'number', 'API rate limit per minute', 'security')

ON CONFLICT (setting_key) DO NOTHING;

-- Helper function to get a setting value
CREATE OR REPLACE FUNCTION public.get_setting(key TEXT)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT setting_value FROM public.site_settings WHERE setting_key = key LIMIT 1;
$$;

-- Helper function to update a setting value
CREATE OR REPLACE FUNCTION public.update_setting(key TEXT, value TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.site_settings 
  SET setting_value = value, updated_at = NOW()
  WHERE setting_key = key;
  
  RETURN FOUND;
END;
$$;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Site Settings Table Created!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Table created: site_settings ✓';
    RAISE NOTICE 'Default settings inserted ✓';
    RAISE NOTICE 'Helper functions created ✓';
    RAISE NOTICE '';
    RAISE NOTICE 'You can now manage site settings from the admin panel!';
    RAISE NOTICE '==============================================';
END $$;
