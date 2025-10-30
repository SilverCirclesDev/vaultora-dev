-- =====================================================
-- SentinelLock - Clean Database Setup (Handles Existing Objects)
-- =====================================================
-- Run this script in Supabase SQL Editor
-- This script safely handles all existing objects

-- =====================================================
-- 1. DROP EXISTING OBJECTS (SAFE)
-- =====================================================

-- Drop existing policies (safe if they don't exist)
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Active services are viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Admins can view all services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "Active pricing plans are viewable by everyone" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can view all pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can insert pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can update pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Admins can delete pricing plans" ON public.pricing_plans;
DROP POLICY IF EXISTS "Active testimonials are viewable by everyone" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can update newsletter subscriptions" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Admins can view all site metrics" ON public.site_metrics;
DROP POLICY IF EXISTS "Admins can insert site metrics" ON public.site_metrics;
DROP POLICY IF EXISTS "Admins can update site metrics" ON public.site_metrics;

-- =====================================================
-- 2. CREATE ENUM (ONLY IF NOT EXISTS)
-- =====================================================

-- Check if enum exists and create only if it doesn't
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

-- =====================================================
-- 3. CREATE TABLES (SAFE)
-- =====================================================

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[]
);

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

-- Services table
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

-- Site metrics table
CREATE TABLE IF NOT EXISTS public.site_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (metric_name, metric_date)
);

-- =====================================================
-- 4. ENABLE RLS (SAFE)
-- =====================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. CREATE FUNCTIONS (SAFE)
-- =====================================================

-- Function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Function to make user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RETURN 'User not found with email: ' || user_email;
  END IF;
  
  -- Insert admin role (ignore if already exists)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin'::public.app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Confirm email if not confirmed
  UPDATE auth.users 
  SET email_confirmed_at = NOW()
  WHERE id = target_user_id AND email_confirmed_at IS NULL;
  
  RETURN 'Successfully made ' || user_email || ' an admin!';
END;
$$;

-- =====================================================
-- 6. CREATE TRIGGERS (SAFE)
-- =====================================================

-- Drop existing triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON public.pricing_plans;
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;

-- Create triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

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

-- =====================================================
-- 7. CREATE RLS POLICIES
-- =====================================================

-- USER_ROLES POLICIES
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- BLOG_POSTS POLICIES
CREATE POLICY "Published blog posts are viewable by everyone"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

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

-- =====================================================
-- 8. INSERT COMPREHENSIVE TEST DATA
-- =====================================================

-- Clear existing data first (safe)
DELETE FROM public.pricing_plans;
DELETE FROM public.services;
DELETE FROM public.testimonials;
DELETE FROM public.blog_posts;
DELETE FROM public.contact_submissions;
DELETE FROM public.newsletter_subscriptions;
DELETE FROM public.site_metrics;

-- Insert pricing plans (exactly 3 plans)
INSERT INTO public.pricing_plans (name, price, period, description, features, is_popular, display_order) VALUES
('Essential', '$499', 'per month', 'Perfect for small businesses starting their security journey', ARRAY['Monthly vulnerability scans', 'Basic security assessments', 'Email support', 'Security incident reporting', 'Quarterly security reviews'], false, 1),
('Professional', '$1,299', 'per month', 'Comprehensive protection for growing businesses', ARRAY['Weekly vulnerability scans', 'Advanced penetration testing', '24/7 priority support', 'Real-time threat monitoring', 'Monthly security audits', 'Compliance consulting', 'Incident response support'], true, 2),
('Enterprise', 'Custom', 'tailored pricing', 'Full-scale security solutions for large organizations', ARRAY['Daily automated scans', 'Dedicated security team', '24/7 emergency support', 'Custom security solutions', 'Advanced threat intelligence', 'Complete compliance management', 'On-site security assessments', 'Executive security briefings'], false, 3);

-- Insert comprehensive test services
INSERT INTO public.services (name, description, short_description, icon, features, price_range, display_order) VALUES
('Penetration Testing & Ethical Hacking', 'Comprehensive security assessments that simulate real-world attacks to identify vulnerabilities before malicious actors do. Our certified ethical hackers use industry-standard methodologies to test your defenses.', 'Ethical hacking to identify vulnerabilities', 'Shield', ARRAY['Network penetration testing', 'Web application security testing', 'Social engineering assessments', 'Wireless network testing', 'Physical security assessments', 'API security testing', 'Mobile app security testing'], '$2,500 - $10,000', 1),
('Network & Endpoint Security', 'Protect your infrastructure with advanced security measures designed to prevent unauthorized access and data breaches. We implement multi-layered defense strategies.', 'Protect your infrastructure', 'Lock', ARRAY['Firewall configuration & management', 'Intrusion detection systems', 'Endpoint protection solutions', 'Network segmentation', 'Security monitoring & alerts', 'VPN setup and management', 'Access control systems'], '$1,500 - $5,000', 2),
('Cloud Infrastructure Protection', 'Secure your cloud environments across AWS, Azure, and Google Cloud with industry-leading best practices. Ensure your cloud migration is secure from day one.', 'Secure cloud environments', 'Cloud', ARRAY['Cloud security architecture review', 'Configuration management', 'Identity & access management', 'Data encryption solutions', 'Compliance & governance', 'Container security', 'Serverless security'], '$2,000 - $8,000', 3),
('Data Privacy & Compliance', 'Navigate complex regulatory requirements with our expert compliance consulting. We help you meet GDPR, HIPAA, SOX, and other critical standards.', 'Compliance consulting and auditing', 'Database', ARRAY['GDPR compliance consulting', 'HIPAA security assessments', 'SOX compliance audits', 'Data protection impact assessments', 'Privacy policy development', 'Employee training programs', 'Incident response planning'], '$1,800 - $6,000', 4),
('Vulnerability Assessment & Management', 'Continuous monitoring and assessment to identify and fix security weaknesses in your systems before attackers can exploit them.', 'Comprehensive security audits', 'Search', ARRAY['Automated vulnerability scanning', 'Manual security reviews', 'Patch management consulting', 'Risk prioritization', 'Remediation guidance', 'Security metrics reporting', 'Continuous monitoring'], '$1,200 - $4,000', 5),
('Security Awareness Training', 'Educate your employees to become your first line of defense against cyber threats. Reduce human error and improve security culture.', 'Employee security education', 'Users', ARRAY['Phishing simulation campaigns', 'Security awareness workshops', 'Custom training materials', 'Progress tracking and reporting', 'Policy development', 'Incident response training', 'Executive briefings'], '$800 - $3,000', 6);

-- Insert comprehensive test testimonials
INSERT INTO public.testimonials (author_name, author_role, author_company, content, rating, is_featured, display_order) VALUES
('Michael Rodriguez', 'Director of IT Security', 'TechSecure Solutions', 'SentinelLock helped us strengthen our data infrastructure and pass multiple compliance audits. Their professionalism and attention to detail is unmatched. The team identified critical vulnerabilities we never knew existed.', 5, true, 1),
('Sarah Johnson', 'Chief Technology Officer', 'FinanceGuard Technologies', 'The team provided exceptional penetration testing and vulnerability assessments that secured our fintech operations. Highly reliable and responsive experts who understand the financial sector requirements.', 5, true, 2),
('David Chen', 'IT Manager', 'DataShield Corp', 'We''ve seen a dramatic reduction in cybersecurity risks since engaging SentinelLock. Excellent communication, top-tier expertise, and real measurable results. Their 24/7 monitoring gives us peace of mind.', 5, true, 3),
('Jennifer Martinez', 'CISO', 'HealthTech Innovations', 'Outstanding HIPAA compliance consulting and implementation. SentinelLock guided us through complex healthcare regulations and helped us achieve full compliance ahead of schedule.', 5, false, 4),
('Robert Kim', 'Security Analyst', 'CloudFirst Enterprises', 'Their cloud security assessment was thorough and actionable. We implemented all their recommendations and haven''t had a single security incident since. Highly recommend their services.', 4, false, 5),
('Amanda Foster', 'VP of Operations', 'RetailSecure Inc', 'The security awareness training transformed our company culture. Employees are now proactive about security, and we''ve reduced phishing incidents by 95%. Excellent ROI on this investment.', 5, false, 6),
('Thomas Wilson', 'Lead Developer', 'StartupTech Solutions', 'As a growing startup, we needed cost-effective security solutions. SentinelLock provided exactly what we needed without breaking the bank. Their Essential plan is perfect for companies like ours.', 4, false, 7),
('Lisa Thompson', 'Compliance Officer', 'Manufacturing Plus', 'The team helped us navigate complex industrial compliance requirements. Their expertise in both cybersecurity and manufacturing regulations is impressive. We passed our audit with flying colors.', 5, false, 8);

-- Insert test contact submissions
INSERT INTO public.contact_submissions (name, email, company, phone, service, message, status, created_at) VALUES
('John Smith', 'john.smith@techcorp.com', 'TechCorp Industries', '+1-555-0123', 'Penetration Testing', 'We need a comprehensive penetration test for our e-commerce platform. We process about 10,000 transactions daily and want to ensure our customer data is secure.', 'new', NOW() - INTERVAL '2 hours'),
('Maria Garcia', 'maria.garcia@healthplus.com', 'HealthPlus Medical', '+1-555-0456', 'HIPAA Compliance', 'Our medical practice needs help with HIPAA compliance. We are transitioning to a new EHR system and want to ensure we meet all regulatory requirements.', 'in_progress', NOW() - INTERVAL '1 day'),
('Robert Johnson', 'r.johnson@financefirst.com', 'FinanceFirst Bank', '+1-555-0789', 'Cloud Security', 'We are migrating our core banking systems to AWS and need expert guidance on cloud security best practices and compliance requirements.', 'completed', NOW() - INTERVAL '3 days'),
('Lisa Chen', 'lisa.chen@startup.io', 'StartupTech Solutions', '+1-555-0321', 'Security Assessment', 'As a growing startup, we need an affordable security assessment to identify potential vulnerabilities in our web application and infrastructure.', 'new', NOW() - INTERVAL '5 hours'),
('David Wilson', 'david.wilson@manufacturing.com', 'Wilson Manufacturing', '+1-555-0654', 'Network Security', 'Our manufacturing facility needs help securing our industrial control systems and implementing proper network segmentation.', 'in_progress', NOW() - INTERVAL '2 days'),
('Sarah Thompson', 'sarah.t@retailchain.com', 'RetailChain Stores', '+1-555-0987', 'PCI Compliance', 'We operate 50+ retail locations and need help achieving and maintaining PCI DSS compliance for our payment processing systems.', 'new', NOW() - INTERVAL '8 hours'),
('Michael Brown', 'mbrown@lawfirm.com', 'Brown & Associates Law', '+1-555-0147', 'Data Protection', 'Our law firm handles sensitive client information and needs comprehensive data protection measures and staff training.', 'completed', NOW() - INTERVAL '1 week'),
('Jennifer Davis', 'j.davis@nonprofit.org', 'Community Nonprofit', '+1-555-0258', 'Security Training', 'We need affordable security awareness training for our staff and volunteers. Budget is limited but security is important to us.', 'new', NOW() - INTERVAL '12 hours');

-- Insert newsletter subscriptions
INSERT INTO public.newsletter_subscriptions (email, status, subscribed_at) VALUES
('subscriber1@example.com', 'active', NOW() - INTERVAL '1 week'),
('subscriber2@example.com', 'active', NOW() - INTERVAL '2 weeks'),
('subscriber3@example.com', 'active', NOW() - INTERVAL '3 weeks'),
('subscriber4@example.com', 'unsubscribed', NOW() - INTERVAL '1 month'),
('subscriber5@example.com', 'active', NOW() - INTERVAL '5 days'),
('subscriber6@example.com', 'active', NOW() - INTERVAL '10 days'),
('subscriber7@example.com', 'active', NOW() - INTERVAL '15 days');

-- Insert test blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, published, published_at, meta_title, meta_description, tags) VALUES
('Top 10 Cybersecurity Threats Facing Businesses in 2025', 'top-10-cybersecurity-threats-2025', 'Discover the most critical security threats organizations need to protect against this year, from ransomware to supply chain attacks.', 'As we move through 2025, the cybersecurity landscape continues to evolve at an unprecedented pace. Organizations worldwide are facing increasingly sophisticated threats that require robust defense strategies and constant vigilance.

## 1. Advanced Ransomware Attacks

Ransomware has evolved beyond simple file encryption. Modern ransomware groups now employ double and triple extortion tactics, threatening to leak sensitive data and targeting backup systems. The average ransom demand has increased by 300% since 2023.

## 2. Supply Chain Compromises

Attackers are increasingly targeting software supply chains, compromising trusted vendors to gain access to multiple organizations simultaneously. The SolarWinds attack was just the beginning of this trend.

## 3. AI-Powered Social Engineering

Artificial intelligence is being weaponized to create more convincing phishing emails, deepfake videos, and voice clones that can bypass traditional security awareness training.

## 4. Cloud Misconfigurations

As organizations accelerate cloud adoption, misconfigurations remain a leading cause of data breaches. Default settings and inadequate access controls continue to expose sensitive information.

## 5. IoT Device Vulnerabilities

The proliferation of Internet of Things devices in corporate environments creates new attack vectors. Many IoT devices lack proper security controls and are difficult to patch.

## Conclusion

Staying ahead of these threats requires a comprehensive security strategy that includes regular assessments, employee training, and continuous monitoring. Contact SentinelLock to learn how we can help protect your organization.', true, NOW() - INTERVAL '5 days', 'Top 10 Cybersecurity Threats 2025 | SentinelLock Security Blog', 'Learn about the most critical cybersecurity threats facing businesses in 2025, including ransomware, supply chain attacks, and AI-powered social engineering.', ARRAY['cybersecurity', 'threats', 'ransomware', 'security trends']),

('How to Implement Zero Trust Architecture', 'implement-zero-trust-architecture', 'A comprehensive guide to transitioning from perimeter-based security to a zero trust security model for enhanced protection.', 'Zero Trust Architecture represents a fundamental shift in cybersecurity strategy, moving away from the traditional "castle and moat" approach to a model where trust is never assumed and verification is required from everyone.

## Understanding Zero Trust Principles

The core principle of Zero Trust is "never trust, always verify." This means that no user or device, whether inside or outside the network perimeter, should be trusted by default.

### Key Components:

1. **Identity Verification**: Every user and device must be authenticated and authorized
2. **Least Privilege Access**: Users get only the minimum access required for their role
3. **Micro-segmentation**: Network is divided into small, isolated segments
4. **Continuous Monitoring**: All activities are monitored and analyzed in real-time

## Implementation Steps

### Phase 1: Assessment and Planning
- Inventory all assets and data flows
- Identify critical resources and access patterns
- Assess current security controls

### Phase 2: Identity and Access Management
- Implement multi-factor authentication
- Deploy privileged access management
- Establish identity governance

### Phase 3: Network Segmentation
- Create micro-segments based on data sensitivity
- Implement software-defined perimeters
- Deploy next-generation firewalls

### Phase 4: Monitoring and Analytics
- Deploy SIEM and SOAR solutions
- Implement user and entity behavior analytics
- Establish security orchestration

## Benefits of Zero Trust

Organizations implementing Zero Trust typically see:
- 50% reduction in security incidents
- Improved compliance posture
- Better visibility into network activities
- Reduced impact of breaches

Ready to implement Zero Trust? Contact SentinelLock for expert guidance and implementation support.', true, NOW() - INTERVAL '10 days', 'Zero Trust Architecture Implementation Guide | SentinelLock', 'Learn how to implement Zero Trust Architecture with our comprehensive guide. Improve your security posture with expert strategies and best practices.', ARRAY['zero trust', 'network security', 'architecture', 'implementation']),

('The Ultimate Guide to Penetration Testing', 'ultimate-guide-penetration-testing', 'Learn about the penetration testing methodology, tools, and techniques used by ethical hackers to identify vulnerabilities.', 'Penetration testing, or "pen testing," is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. This comprehensive guide covers everything you need to know about penetration testing.

## What is Penetration Testing?

Penetration testing is an authorized simulated attack performed on a computer system to evaluate its security. The test is performed to identify both weaknesses and strengths of the system''s security.

## Types of Penetration Testing

### 1. Network Penetration Testing
- External network testing
- Internal network testing
- Wireless network testing

### 2. Web Application Testing
- OWASP Top 10 vulnerabilities
- Authentication and session management
- Input validation testing

### 3. Social Engineering Testing
- Phishing campaigns
- Physical security testing
- Phone-based attacks

## Penetration Testing Methodology

### Phase 1: Planning and Reconnaissance
- Define scope and goals
- Gather intelligence on target systems
- Identify potential attack vectors

### Phase 2: Scanning
- Static analysis of application code
- Dynamic analysis of running applications
- Network scanning and enumeration

### Phase 3: Gaining Access
- Exploit vulnerabilities
- Escalate privileges
- Maintain persistence

### Phase 4: Analysis and Reporting
- Document findings
- Assess business impact
- Provide remediation recommendations

## Common Tools Used

- **Nmap**: Network discovery and security auditing
- **Metasploit**: Penetration testing framework
- **Burp Suite**: Web application security testing
- **Wireshark**: Network protocol analyzer
- **John the Ripper**: Password cracking tool

## Benefits of Regular Penetration Testing

1. **Identify Vulnerabilities**: Find security weaknesses before attackers do
2. **Compliance Requirements**: Meet regulatory standards
3. **Security Awareness**: Educate staff about security risks
4. **Incident Response**: Test your response procedures

## Choosing a Penetration Testing Provider

When selecting a penetration testing provider, consider:
- Certifications (CISSP, CEH, OSCP)
- Experience in your industry
- Methodology and reporting quality
- Post-test support and remediation guidance

SentinelLock''s certified ethical hackers use industry-standard methodologies to provide comprehensive penetration testing services. Contact us to schedule your security assessment.', true, NOW() - INTERVAL '15 days', 'Ultimate Penetration Testing Guide | SentinelLock Cybersecurity', 'Complete guide to penetration testing methodology, tools, and techniques. Learn how ethical hacking can improve your security posture.', ARRAY['penetration testing', 'ethical hacking', 'security assessment', 'vulnerability testing']),

('Cloud Security Best Practices for 2025', 'cloud-security-best-practices-2025', 'Essential security configurations and practices to protect your cloud infrastructure across major cloud platforms.', 'As organizations continue their digital transformation journey, cloud security remains a top priority. This guide outlines the essential best practices for securing your cloud infrastructure in 2025.

## The Shared Responsibility Model

Understanding the shared responsibility model is crucial for cloud security:

### Cloud Provider Responsibilities:
- Physical security of data centers
- Infrastructure security
- Network controls
- Host operating system patching

### Customer Responsibilities:
- Data encryption
- Identity and access management
- Network traffic protection
- Operating system updates

## Essential Cloud Security Practices

### 1. Identity and Access Management (IAM)

**Multi-Factor Authentication (MFA)**
- Enable MFA for all user accounts
- Use hardware tokens for privileged accounts
- Implement conditional access policies

**Principle of Least Privilege**
- Grant minimum necessary permissions
- Regularly review and audit access rights
- Use role-based access control (RBAC)

### 2. Data Protection

**Encryption at Rest**
- Encrypt all sensitive data stored in the cloud
- Use customer-managed encryption keys
- Implement proper key management practices

**Encryption in Transit**
- Use TLS 1.3 for all data transmissions
- Implement end-to-end encryption
- Secure API communications

### 3. Network Security

**Virtual Private Clouds (VPCs)**
- Isolate workloads using VPCs
- Implement proper subnet segmentation
- Use security groups and NACLs effectively

**Zero Trust Network Access**
- Implement software-defined perimeters
- Use micro-segmentation
- Monitor all network traffic

### 4. Monitoring and Logging

**Comprehensive Logging**
- Enable logging for all cloud services
- Centralize log collection and analysis
- Implement real-time monitoring

**Security Information and Event Management (SIEM)**
- Deploy cloud-native SIEM solutions
- Create custom detection rules
- Automate incident response

## Platform-Specific Recommendations

### Amazon Web Services (AWS)
- Use AWS CloudTrail for audit logging
- Implement AWS Config for compliance
- Leverage AWS Security Hub for centralized security

### Microsoft Azure
- Enable Azure Security Center
- Use Azure Sentinel for SIEM
- Implement Azure Policy for governance

### Google Cloud Platform (GCP)
- Use Cloud Security Command Center
- Implement Cloud Asset Inventory
- Leverage Cloud DLP for data protection

## Common Cloud Security Mistakes

1. **Default Configurations**: Never use default security settings
2. **Overprivileged Access**: Avoid granting excessive permissions
3. **Unencrypted Data**: Always encrypt sensitive information
4. **Poor Key Management**: Implement proper key rotation and storage
5. **Inadequate Monitoring**: Monitor all cloud activities continuously

## Compliance Considerations

Ensure your cloud security practices align with relevant regulations:
- **GDPR**: Data protection and privacy requirements
- **HIPAA**: Healthcare data security standards
- **SOX**: Financial reporting controls
- **PCI DSS**: Payment card industry standards

## Conclusion

Cloud security requires a comprehensive approach that combines technology, processes, and people. Regular security assessments and continuous monitoring are essential for maintaining a strong security posture.

Need help securing your cloud infrastructure? SentinelLock''s cloud security experts can help you implement these best practices and more. Contact us for a comprehensive cloud security assessment.', true, NOW() - INTERVAL '20 days', 'Cloud Security Best Practices 2025 | AWS Azure GCP Security Guide', 'Essential cloud security best practices for AWS, Azure, and GCP. Learn how to protect your cloud infrastructure with expert guidance from SentinelLock.', ARRAY['cloud security', 'AWS', 'Azure', 'GCP', 'best practices']),

('Understanding GDPR Compliance in 2025', 'gdpr-compliance-guide-2025', 'Navigate the complexities of GDPR compliance and learn how to protect customer data while meeting regulatory requirements.', 'The General Data Protection Regulation (GDPR) continues to evolve, with new interpretations and enforcement actions shaping how organizations handle personal data. This updated guide covers everything you need to know about GDPR compliance in 2025.

## GDPR Overview

GDPR is a comprehensive data protection law that applies to all organizations processing personal data of EU residents, regardless of where the organization is located.

### Key Principles:
1. **Lawfulness, fairness, and transparency**
2. **Purpose limitation**
3. **Data minimization**
4. **Accuracy**
5. **Storage limitation**
6. **Integrity and confidentiality**
7. **Accountability**

## Recent GDPR Developments in 2025

### New Enforcement Trends
- Increased focus on data breach notifications
- Higher fines for repeat offenders
- Greater scrutiny of international data transfers

### Technology Considerations
- AI and machine learning compliance requirements
- Cookie consent evolution
- Privacy-enhancing technologies adoption

## Essential GDPR Compliance Steps

### 1. Data Mapping and Inventory
- Identify all personal data processing activities
- Document data flows and storage locations
- Maintain records of processing activities

### 2. Legal Basis Assessment
- Determine lawful basis for each processing activity
- Implement consent mechanisms where required
- Establish legitimate interest assessments

### 3. Privacy by Design Implementation
- Integrate privacy considerations into system design
- Implement data protection impact assessments (DPIAs)
- Establish privacy-enhancing technologies

### 4. Individual Rights Management
- Implement processes for handling data subject requests
- Establish identity verification procedures
- Create systems for data portability and erasure

## Data Subject Rights Under GDPR

### Right to Information
- Provide clear privacy notices
- Explain processing purposes and legal basis
- Inform about data retention periods

### Right of Access
- Respond to subject access requests within 30 days
- Provide copy of personal data being processed
- Include information about processing activities

### Right to Rectification
- Correct inaccurate personal data
- Complete incomplete data
- Notify third parties of corrections

### Right to Erasure ("Right to be Forgotten")
- Delete personal data when no longer necessary
- Honor withdrawal of consent
- Consider public interest exceptions

## International Data Transfers

### Adequacy Decisions
- Transfer data to countries with adequacy decisions
- Monitor changes in adequacy status
- Implement additional safeguards when necessary

### Standard Contractual Clauses (SCCs)
- Use updated SCCs for international transfers
- Conduct transfer impact assessments
- Implement supplementary measures when required

## Data Breach Management

### Detection and Assessment
- Implement monitoring systems
- Establish breach detection procedures
- Assess breach severity and impact

### Notification Requirements
- Notify supervisory authority within 72 hours
- Inform data subjects when high risk exists
- Document all breach incidents

## GDPR Compliance Checklist

- [ ] Conduct data protection impact assessments
- [ ] Appoint Data Protection Officer (if required)
- [ ] Update privacy policies and notices
- [ ] Implement consent management systems
- [ ] Establish data subject request procedures
- [ ] Create breach response procedures
- [ ] Train staff on GDPR requirements
- [ ] Conduct regular compliance audits

## Common GDPR Violations and Fines

Recent enforcement actions show common violations:
1. **Inadequate consent mechanisms** - €50M+ fines
2. **Excessive data collection** - €35M+ fines
3. **Poor breach notification** - €20M+ fines
4. **Insufficient security measures** - €15M+ fines

## Working with Third Parties

### Data Processing Agreements (DPAs)
- Establish clear contractual terms
- Define roles and responsibilities
- Include security requirements

### Vendor Due Diligence
- Assess third-party security measures
- Monitor ongoing compliance
- Establish audit rights

## Conclusion

GDPR compliance is an ongoing process that requires continuous attention and adaptation. Organizations must stay informed about regulatory developments and maintain robust data protection practices.

Need help with GDPR compliance? SentinelLock''s privacy experts can conduct comprehensive assessments and help you implement effective compliance programs. Contact us for a consultation.', true, NOW() - INTERVAL '25 days', 'GDPR Compliance Guide 2025 | Data Protection Regulation Help', 'Complete GDPR compliance guide for 2025. Learn about data protection requirements, individual rights, and how to avoid costly fines.', ARRAY['GDPR', 'data protection', 'compliance', 'privacy', 'regulation']),

('Incident Response Planning: A Complete Guide', 'incident-response-planning-guide', 'Build a robust incident response plan to minimize damage and recover quickly from security breaches.', 'A well-designed incident response plan is crucial for minimizing the impact of security incidents and ensuring rapid recovery. This comprehensive guide will help you build an effective incident response capability.

## What is Incident Response?

Incident response is the organized approach to addressing and managing the aftermath of a security breach or cyberattack. The goal is to handle the situation in a way that limits damage and reduces recovery time and costs.

## The Incident Response Lifecycle

### 1. Preparation
- Develop incident response policies and procedures
- Establish an incident response team
- Implement monitoring and detection tools
- Conduct regular training and exercises

### 2. Identification
- Detect potential security incidents
- Analyze and validate incidents
- Document initial findings
- Determine incident severity

### 3. Containment
- Implement short-term containment measures
- Develop long-term containment strategy
- Preserve evidence for analysis
- Maintain business operations

### 4. Eradication
- Remove malware and other artifacts
- Patch vulnerabilities
- Update security controls
- Strengthen defenses

### 5. Recovery
- Restore systems to normal operations
- Monitor for signs of weakness
- Implement additional monitoring
- Validate system integrity

### 6. Lessons Learned
- Conduct post-incident review
- Document lessons learned
- Update incident response procedures
- Improve security controls

## Building Your Incident Response Team

### Core Team Members

**Incident Response Manager**
- Overall incident coordination
- Communication with stakeholders
- Decision-making authority

**Security Analysts**
- Technical investigation
- Threat analysis
- Evidence collection

**IT Operations**
- System administration
- Network management
- Infrastructure support

**Legal Counsel**
- Regulatory compliance
- Legal implications
- Evidence handling

**Communications**
- Internal communications
- External communications
- Media relations

### Extended Team Members
- Human Resources
- Physical Security
- Business Unit Representatives
- External Consultants

## Incident Classification and Prioritization

### Severity Levels

**Critical (P1)**
- Significant business impact
- Data breach involving sensitive information
- Complete system compromise
- Response time: Immediate

**High (P2)**
- Moderate business impact
- Potential data exposure
- Partial system compromise
- Response time: 2 hours

**Medium (P3)**
- Limited business impact
- Security control bypass
- Suspicious activity
- Response time: 8 hours

**Low (P4)**
- Minimal business impact
- Policy violations
- Informational alerts
- Response time: 24 hours

## Communication Procedures

### Internal Communications
- Establish communication channels
- Define escalation procedures
- Create status update templates
- Maintain communication logs

### External Communications
- Regulatory notification requirements
- Customer communication plans
- Media response procedures
- Law enforcement coordination

## Tools and Technologies

### Detection and Monitoring
- Security Information and Event Management (SIEM)
- Intrusion Detection Systems (IDS)
- Endpoint Detection and Response (EDR)
- Network Traffic Analysis

### Investigation and Analysis
- Digital forensics tools
- Malware analysis platforms
- Threat intelligence feeds
- Log analysis tools

### Communication and Coordination
- Incident tracking systems
- Secure communication platforms
- Conference bridges
- Documentation repositories

## Legal and Regulatory Considerations

### Evidence Handling
- Chain of custody procedures
- Evidence preservation techniques
- Legal admissibility requirements
- Documentation standards

### Regulatory Notifications
- GDPR breach notification (72 hours)
- HIPAA breach notification (60 days)
- State breach notification laws
- Industry-specific requirements

## Testing and Exercises

### Tabletop Exercises
- Scenario-based discussions
- Process validation
- Team coordination practice
- Decision-making exercises

### Simulation Exercises
- Technical response testing
- Tool validation
- Communication testing
- Full-scale response practice

## Metrics and Improvement

### Key Performance Indicators
- Mean Time to Detection (MTTD)
- Mean Time to Response (MTTR)
- Mean Time to Recovery (MTTR)
- Incident recurrence rate

### Continuous Improvement
- Regular plan updates
- Training program enhancement
- Tool and technology upgrades
- Process optimization

## Common Incident Response Mistakes

1. **Lack of preparation** - No documented procedures
2. **Poor communication** - Inadequate stakeholder notification
3. **Evidence destruction** - Improper system handling
4. **Inadequate containment** - Allowing incident spread
5. **Insufficient documentation** - Poor record keeping

## Conclusion

Effective incident response requires preparation, practice, and continuous improvement. Organizations that invest in robust incident response capabilities can significantly reduce the impact of security incidents.

Ready to build or improve your incident response capability? SentinelLock''s incident response experts can help you develop comprehensive plans and provide 24/7 response services. Contact us to learn more.', true, NOW() - INTERVAL '30 days', 'Incident Response Planning Guide | Cybersecurity Emergency Response', 'Complete guide to incident response planning. Learn how to build effective incident response capabilities and minimize security breach impact.', ARRAY['incident response', 'cybersecurity', 'emergency response', 'security planning']);

-- Insert site metrics for analytics
INSERT INTO public.site_metrics (metric_name, metric_value, metric_date) VALUES
('page_views', 1250, CURRENT_DATE),
('unique_visitors', 890, CURRENT_DATE),
('contact_form_submissions', 12, CURRENT_DATE),
('newsletter_signups', 8, CURRENT_DATE),
('blog_views', 340, CURRENT_DATE),
('pricing_page_views', 180, CURRENT_DATE),
('page_views', 1180, CURRENT_DATE - INTERVAL '1 day'),
('unique_visitors', 820, CURRENT_DATE - INTERVAL '1 day'),
('contact_form_submissions', 15, CURRENT_DATE - INTERVAL '1 day'),
('newsletter_signups', 6, CURRENT_DATE - INTERVAL '1 day'),
('blog_views', 290, CURRENT_DATE - INTERVAL '1 day'),
('pricing_page_views', 165, CURRENT_DATE - INTERVAL '1 day'),
('page_views', 1320, CURRENT_DATE - INTERVAL '2 days'),
('unique_visitors', 950, CURRENT_DATE - INTERVAL '2 days'),
('contact_form_submissions', 18, CURRENT_DATE - INTERVAL '2 days'),
('newsletter_signups', 10, CURRENT_DATE - INTERVAL '2 days'),
('blog_views', 380, CURRENT_DATE - INTERVAL '2 days'),
('pricing_page_views', 200, CURRENT_DATE - INTERVAL '2 days'),
('page_views', 1100, CURRENT_DATE - INTERVAL '3 days'),
('unique_visitors', 780, CURRENT_DATE - INTERVAL '3 days'),
('contact_form_submissions', 9, CURRENT_DATE - INTERVAL '3 days'),
('newsletter_signups', 4, CURRENT_DATE - INTERVAL '3 days'),
('blog_views', 250, CURRENT_DATE - INTERVAL '3 days'),
('pricing_page_views', 140, CURRENT_DATE - INTERVAL '3 days');

-- =====================================================
-- 9. SUCCESS MESSAGE
-- =====================================================

SELECT 
  '🎉 Database setup complete!' as status,
  'All tables, functions, policies, and test data created successfully!' as message,
  'Next: Create your account and run: SELECT public.make_user_admin(''your-email@example.com'');' as next_step;