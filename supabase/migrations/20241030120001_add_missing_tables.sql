-- Add missing tables for complete CMS functionality
-- This migration adds tables that were missing from the initial setup

-- Contact form submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table for dynamic service management
CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  icon TEXT,
  features TEXT[],
  price_range TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing plans table
CREATE TABLE IF NOT EXISTS public.pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  author_company TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Analytics/metrics table for tracking
CREATE TABLE IF NOT EXISTS public.site_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (metric_name, metric_date)
);

-- Enable RLS on new tables
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;

-- Function to make any user admin (for initial setup)
-- Only create if it doesn't exist
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $
DECLARE
  user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO user_id FROM auth.users WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Insert admin role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Confirm email if not confirmed
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = user_id AND email_confirmed_at IS NULL;
  
  RETURN 'Successfully made ' || user_email || ' an admin!';
END;
$;

-- Add triggers for new tables
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for new tables

-- CONTACT_SUBMISSIONS POLICIES
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- SERVICES POLICIES
CREATE POLICY "Active services are viewable by everyone"
  ON public.services
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all services"
  ON public.services
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert services"
  ON public.services
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
  ON public.services
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
  ON public.services
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- PRICING_PLANS POLICIES
CREATE POLICY "Active pricing plans are viewable by everyone"
  ON public.pricing_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all pricing plans"
  ON public.pricing_plans
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert pricing plans"
  ON public.pricing_plans
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update pricing plans"
  ON public.pricing_plans
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pricing plans"
  ON public.pricing_plans
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- TESTIMONIALS POLICIES
CREATE POLICY "Active testimonials are viewable by everyone"
  ON public.testimonials
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update testimonials"
  ON public.testimonials
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- NEWSLETTER_SUBSCRIPTIONS POLICIES
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- SITE_METRICS POLICIES
CREATE POLICY "Admins can view all site metrics"
  ON public.site_metrics
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site metrics"
  ON public.site_metrics
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site metrics"
  ON public.site_metrics
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default pricing plans
INSERT INTO public.pricing_plans (name, price, period, description, features, is_popular, display_order) VALUES
('Essential', '$499', 'per month', 'Perfect for small businesses starting their security journey', ARRAY['Monthly vulnerability scans', 'Basic security assessments', 'Email support', 'Security incident reporting', 'Quarterly security reviews'], false, 1),
('Professional', '$1,299', 'per month', 'Comprehensive protection for growing businesses', ARRAY['Weekly vulnerability scans', 'Advanced penetration testing', '24/7 priority support', 'Real-time threat monitoring', 'Monthly security audits', 'Compliance consulting', 'Incident response support'], true, 2),
('Enterprise', 'Custom', 'tailored pricing', 'Full-scale security solutions for large organizations', ARRAY['Daily automated scans', 'Dedicated security team', '24/7 emergency support', 'Custom security solutions', 'Advanced threat intelligence', 'Complete compliance management', 'On-site security assessments', 'Executive security briefings'], false, 3)
ON CONFLICT DO NOTHING;

-- Insert default services
INSERT INTO public.services (name, description, short_description, icon, features, price_range, display_order) VALUES
('Penetration Testing & Ethical Hacking', 'Comprehensive security assessments that simulate real-world attacks to identify vulnerabilities before malicious actors do.', 'Ethical hacking to identify vulnerabilities', 'Shield', ARRAY['Network penetration testing', 'Web application security testing', 'Social engineering assessments', 'Wireless network testing', 'Physical security assessments'], '$2,500 - $10,000', 1),
('Network & Endpoint Security', 'Protect your infrastructure with advanced security measures designed to prevent unauthorized access and data breaches.', 'Protect your infrastructure', 'Lock', ARRAY['Firewall configuration & management', 'Intrusion detection systems', 'Endpoint protection solutions', 'Network segmentation', 'Security monitoring & alerts'], '$1,500 - $5,000', 2),
('Cloud Infrastructure Protection', 'Secure your cloud environments across AWS, Azure, and Google Cloud with industry-leading best practices.', 'Secure cloud environments', 'Cloud', ARRAY['Cloud security architecture review', 'Configuration management', 'Identity & access management', 'Data encryption solutions', 'Compliance & governance'], '$2,000 - $8,000', 3)
ON CONFLICT DO NOTHING;

-- Insert default testimonials
INSERT INTO public.testimonials (author_name, author_role, author_company, content, rating, is_featured, display_order) VALUES
('Michael Rodriguez', 'Director', 'TechSecure Solutions', 'SentinelLock helped us strengthen our data infrastructure and pass multiple compliance audits. Their professionalism and attention to detail is unmatched.', 5, true, 1),
('Sarah Johnson', 'CTO', 'FinanceGuard Technologies', 'The team provided exceptional penetration testing and vulnerability assessments that secured our fintech operations. Highly reliable and responsive experts.', 5, true, 2),
('David Chen', 'IT Manager', 'DataShield Corp', 'We''ve seen a dramatic reduction in cybersecurity risks since engaging SentinelLock. Excellent communication, top-tier expertise, and real measurable results.', 5, true, 3)
ON CONFLICT DO NOTHING;