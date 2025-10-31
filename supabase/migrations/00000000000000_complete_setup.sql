-- =====================================================
-- Vaultora Cyber Defense - Complete Database Setup
-- =====================================================
-- This file contains the complete database schema and initial data
-- for the Vaultora cybersecurity website and CMS.
-- 
-- Run this file in your Supabase SQL Editor to set up everything.
-- =====================================================

-- Create enum for user roles
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- CORE TABLES
-- =====================================================

-- User roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- User profiles table for additional user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTENT MANAGEMENT TABLES
-- =====================================================

-- Blog posts table for content management
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

-- =====================================================
-- CUSTOMER INTERACTION TABLES
-- =====================================================

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

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- ANALYTICS TABLES
-- =====================================================

-- Site metrics table for tracking analytics
CREATE TABLE IF NOT EXISTS public.site_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (metric_name, metric_date)
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Security function to check user roles (prevents RLS recursion)
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

-- Admin utility function to make any user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers to update timestamps (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON public.pricing_plans;
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables (safe to run multiple times)
DO $$ 
BEGIN
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN
        -- RLS might already be enabled, continue
        NULL;
END $$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- USER_ROLES POLICIES
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- BLOG_POSTS POLICIES
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published blog posts are viewable by everyone"
  ON public.blog_posts
  FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins can view all blog posts" ON public.blog_posts;
CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert blog posts" ON public.blog_posts;
CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- CONTACT_SUBMISSIONS POLICIES
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;
CREATE POLICY "Anyone can insert contact submissions"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
CREATE POLICY "Admins can delete contact submissions"
  ON public.contact_submissions
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- SERVICES POLICIES
DROP POLICY IF EXISTS "Active services are viewable by everyone" ON public.services;
CREATE POLICY "Active services are viewable by everyone"
  ON public.services
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all services" ON public.services;
CREATE POLICY "Admins can view all services"
  ON public.services
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
CREATE POLICY "Admins can insert services"
  ON public.services
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update services" ON public.services;
CREATE POLICY "Admins can update services"
  ON public.services
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
CREATE POLICY "Admins can delete services"
  ON public.services
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- PRICING_PLANS POLICIES
DROP POLICY IF EXISTS "Active pricing plans are viewable by everyone" ON public.pricing_plans;
CREATE POLICY "Active pricing plans are viewable by everyone"
  ON public.pricing_plans
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all pricing plans" ON public.pricing_plans;
CREATE POLICY "Admins can view all pricing plans"
  ON public.pricing_plans
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert pricing plans" ON public.pricing_plans;
CREATE POLICY "Admins can insert pricing plans"
  ON public.pricing_plans
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update pricing plans" ON public.pricing_plans;
CREATE POLICY "Admins can update pricing plans"
  ON public.pricing_plans
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete pricing plans" ON public.pricing_plans;
CREATE POLICY "Admins can delete pricing plans"
  ON public.pricing_plans
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- TESTIMONIALS POLICIES
DROP POLICY IF EXISTS "Active testimonials are viewable by everyone" ON public.testimonials;
CREATE POLICY "Active testimonials are viewable by everyone"
  ON public.testimonials
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
CREATE POLICY "Admins can view all testimonials"
  ON public.testimonials
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
CREATE POLICY "Admins can insert testimonials"
  ON public.testimonials
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials"
  ON public.testimonials
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials"
  ON public.testimonials
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- NEWSLETTER_SUBSCRIPTIONS POLICIES
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscriptions;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can view all newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update newsletter subscriptions" ON public.newsletter_subscriptions;
CREATE POLICY "Admins can update newsletter subscriptions"
  ON public.newsletter_subscriptions
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- SITE_METRICS POLICIES
DROP POLICY IF EXISTS "Admins can view all site metrics" ON public.site_metrics;
CREATE POLICY "Admins can view all site metrics"
  ON public.site_metrics
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert site metrics" ON public.site_metrics;
CREATE POLICY "Admins can insert site metrics"
  ON public.site_metrics
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update site metrics" ON public.site_metrics;
CREATE POLICY "Admins can update site metrics"
  ON public.site_metrics
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default pricing plans (safe to run multiple times)
INSERT INTO public.pricing_plans (name, price, period, description, features, is_popular, display_order) VALUES
('Essential', '$499', 'per month', 'Perfect for small businesses starting their security journey', ARRAY['Monthly vulnerability scans', 'Basic security assessments', 'Email support', 'Security incident reporting', 'Quarterly security reviews'], false, 1),
('Professional', '$1,299', 'per month', 'Comprehensive protection for growing businesses', ARRAY['Weekly vulnerability scans', 'Advanced penetration testing', '24/7 priority support', 'Real-time threat monitoring', 'Monthly security audits', 'Compliance consulting', 'Incident response support'], true, 2),
('Enterprise', 'Custom', 'tailored pricing', 'Full-scale security solutions for large organizations', ARRAY['Daily automated scans', 'Dedicated security team', '24/7 emergency support', 'Custom security solutions', 'Advanced threat intelligence', 'Complete compliance management', 'On-site security assessments', 'Executive security briefings'], false, 3)
ON CONFLICT DO NOTHING;

-- Insert default services (safe to run multiple times)
INSERT INTO public.services (name, description, short_description, icon, features, price_range, display_order) VALUES
('Penetration Testing & Ethical Hacking', 'Comprehensive security assessments that simulate real-world attacks to identify vulnerabilities before malicious actors do.', 'Ethical hacking to identify vulnerabilities', 'Shield', ARRAY['Network penetration testing', 'Web application security testing', 'Social engineering assessments', 'Wireless network testing', 'Physical security assessments'], '$2,500 - $10,000', 1),
('Network & Endpoint Security', 'Protect your infrastructure with advanced security measures designed to prevent unauthorized access and data breaches.', 'Protect your infrastructure', 'Lock', ARRAY['Firewall configuration & management', 'Intrusion detection systems', 'Endpoint protection solutions', 'Network segmentation', 'Security monitoring & alerts'], '$1,500 - $5,000', 2),
('Cloud Infrastructure Protection', 'Secure your cloud environments across AWS, Azure, and Google Cloud with industry-leading best practices.', 'Secure cloud environments', 'Cloud', ARRAY['Cloud security architecture review', 'Configuration management', 'Identity & access management', 'Data encryption solutions', 'Compliance & governance'], '$2,000 - $8,000', 3)
ON CONFLICT DO NOTHING;

-- Insert default testimonials (safe to run multiple times)
INSERT INTO public.testimonials (author_name, author_role, author_company, content, rating, is_featured, display_order) VALUES
('Michael Rodriguez', 'Director', 'TechSecure Solutions', 'Vaultora helped us strengthen our data infrastructure and pass multiple compliance audits. Their professionalism and attention to detail is unmatched.', 5, true, 1),
('Sarah Johnson', 'CTO', 'FinanceGuard Technologies', 'The team provided exceptional penetration testing and vulnerability assessments that secured our fintech operations. Highly reliable and responsive experts.', 5, true, 2),
('David Chen', 'IT Manager', 'DataShield Corp', 'We''ve seen a dramatic reduction in cybersecurity risks since engaging Vaultora. Excellent communication, top-tier expertise, and real measurable results.', 5, true, 3)
ON CONFLICT DO NOTHING;

-- Insert sample blog posts (safe to run multiple times)
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, published, published_at, meta_title, meta_description, tags) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Top 10 Cybersecurity Threats Facing Businesses in 2025', 'top-10-cybersecurity-threats-2025', 'Discover the most critical security threats organizations need to protect against this year, from ransomware to supply chain attacks.', '<h2>The Evolving Threat Landscape</h2><p>As we move through 2025, the cybersecurity landscape continues to evolve at an unprecedented pace. Organizations worldwide are facing increasingly sophisticated threats that require robust defense strategies and constant vigilance.</p><h3>1. Advanced Ransomware Attacks</h3><p>Ransomware continues to be one of the most devastating threats facing businesses today. Modern ransomware groups are employing double and triple extortion tactics, not only encrypting data but also threatening to leak sensitive information and targeting business partners.</p><h3>2. Supply Chain Compromises</h3><p>Supply chain attacks have become increasingly common, with attackers targeting trusted vendors and software providers to gain access to multiple organizations simultaneously. The SolarWinds attack demonstrated the far-reaching impact of these sophisticated campaigns.</p><h3>3. AI-Powered Social Engineering</h3><p>Artificial intelligence is being weaponized to create more convincing phishing emails, deepfake videos, and voice cloning attacks. These AI-enhanced social engineering attacks are becoming increasingly difficult to detect.</p><h3>4. Cloud Misconfigurations</h3><p>As organizations continue their digital transformation journey, cloud misconfigurations remain a significant security risk. Improperly configured cloud services can expose sensitive data and provide attackers with easy access to corporate networks.</p><h3>5. IoT Device Vulnerabilities</h3><p>The proliferation of Internet of Things (IoT) devices in corporate environments has created new attack vectors. Many IoT devices lack proper security controls and are difficult to patch, making them attractive targets for cybercriminals.</p><h2>Building Effective Defenses</h2><p>Understanding these threats is the first step in building effective defenses. Organizations should implement a comprehensive security strategy that includes regular security assessments, employee training, incident response planning, and continuous monitoring.</p><p>At Vaultora, we help organizations identify and mitigate these threats through comprehensive penetration testing, vulnerability assessments, and security consulting services. Contact us today to learn how we can help protect your organization.</p>', true, '2025-03-15T00:00:00Z', 'Top 10 Cybersecurity Threats 2025 | Vaultora', 'Discover the most critical cybersecurity threats facing businesses in 2025. Learn how to protect your organization from ransomware, supply chain attacks, and more.', ARRAY['Threat Intelligence', 'Cybersecurity', 'Risk Management']),
('550e8400-e29b-41d4-a716-446655440002', 'How to Implement Zero Trust Architecture in Your Organization', 'zero-trust-architecture-implementation-guide', 'A comprehensive guide to transitioning from perimeter-based security to a zero trust security model for enhanced protection.', '<h2>Understanding Zero Trust Architecture</h2><p>Zero Trust Architecture represents a fundamental shift in cybersecurity strategy, moving away from the traditional castle and moat approach to a model where trust is never assumed and verification is required from everyone.</p><h3>Core Principles of Zero Trust</h3><ul><li><strong>Never Trust, Always Verify:</strong> Every user and device must be authenticated and authorized before accessing resources</li><li><strong>Least Privilege Access:</strong> Users should only have access to the minimum resources necessary for their role</li><li><strong>Assume Breach:</strong> Design security controls assuming that attackers are already inside the network</li></ul><h3>Implementation Phases</h3><h4>Phase 1: Assessment and Planning</h4><p>Begin by conducting a comprehensive assessment of your current security posture. Identify all users, devices, applications, and data flows within your organization. This inventory will serve as the foundation for your Zero Trust implementation.</p><h4>Phase 2: Identity and Access Management</h4><p>Implement strong identity verification mechanisms, including multi-factor authentication (MFA) and single sign-on (SSO). Establish clear policies for user access and regularly review permissions.</p><h4>Phase 3: Network Segmentation</h4><p>Implement micro-segmentation to limit lateral movement within your network. Create secure zones for different types of resources and applications.</p><h4>Phase 4: Continuous Monitoring</h4><p>Deploy comprehensive monitoring and analytics tools to detect anomalous behavior and potential security incidents in real-time.</p><h2>Benefits of Zero Trust</h2><p>Organizations that successfully implement Zero Trust Architecture typically see improved security posture, better compliance, reduced risk of data breaches, and enhanced visibility into their network activities.</p><p>Ready to implement Zero Trust in your organization? Contact Vaultora for expert guidance and support throughout your Zero Trust journey.</p>', true, '2025-03-10T00:00:00Z', 'Zero Trust Architecture Implementation Guide | Vaultora', 'Learn how to implement Zero Trust Architecture in your organization. Complete guide covering assessment, planning, and deployment strategies.', ARRAY['Zero Trust', 'Network Security', 'Best Practices']),
('550e8400-e29b-41d4-a716-446655440003', 'The Ultimate Guide to Penetration Testing', 'ultimate-guide-penetration-testing', 'Learn about the penetration testing methodology, tools, and techniques used by ethical hackers to identify vulnerabilities.', '<h2>What is Penetration Testing?</h2><p>Penetration testing, or pen testing, is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. It''s an essential component of a comprehensive security program that helps organizations identify weaknesses before malicious actors can exploit them.</p><h3>Types of Penetration Testing</h3><h4>Network Penetration Testing</h4><p>Network pen testing focuses on identifying vulnerabilities in network infrastructure, including firewalls, routers, switches, and network protocols. This type of testing helps ensure that your network perimeter is secure.</p><h4>Web Application Testing</h4><p>Web application penetration testing examines web-based applications for security vulnerabilities such as SQL injection, cross-site scripting (XSS), and authentication bypass issues.</p><h4>Wireless Network Testing</h4><p>Wireless penetration testing assesses the security of wireless networks, including Wi-Fi networks, Bluetooth connections, and other wireless communication protocols.</p><h4>Social Engineering Assessments</h4><p>Social engineering tests evaluate how susceptible your employees are to manipulation tactics used by cybercriminals, including phishing emails, phone calls, and physical security breaches.</p><h3>The Penetration Testing Methodology</h3><h4>1. Planning and Reconnaissance</h4><p>The first phase involves gathering information about the target system, including network topology, system architecture, and potential entry points.</p><h4>2. Scanning and Enumeration</h4><p>Penetration testers use various tools to scan for open ports, services, and potential vulnerabilities in the target systems.</p><h4>3. Vulnerability Assessment</h4><p>Identified vulnerabilities are analyzed and prioritized based on their potential impact and exploitability.</p><h4>4. Exploitation</h4><p>Testers attempt to exploit identified vulnerabilities to gain unauthorized access or escalate privileges within the system.</p><h4>5. Post-Exploitation</h4><p>Once access is gained, testers explore what data and systems can be accessed and what damage could potentially be done.</p><h4>6. Reporting</h4><p>A comprehensive report is prepared detailing all findings, including vulnerabilities discovered, exploitation methods used, and recommendations for remediation.</p><h3>Choosing the Right Penetration Testing Provider</h3><p>When selecting a penetration testing provider, consider their certifications, experience, methodology, and ability to provide actionable recommendations. Look for providers with certified ethical hackers (CEH), OSCP, or similar credentials.</p><p>At Vaultora, our team of certified penetration testers uses industry-standard methodologies and cutting-edge tools to provide comprehensive security assessments. Contact us to learn more about our penetration testing services.</p>', true, '2025-03-05T00:00:00Z', 'Ultimate Penetration Testing Guide | Vaultora', 'Complete guide to penetration testing methodology, tools, and techniques. Learn about network testing, web app testing, and social engineering assessments.', ARRAY['Penetration Testing', 'Ethical Hacking', 'Security Assessment'])
ON CONFLICT DO NOTHING;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Vaultora Database Setup Complete!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Tables created: ✓';
    RAISE NOTICE 'Security policies applied: ✓';
    RAISE NOTICE 'Initial data inserted: ✓';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Create your admin account by signing up';
    RAISE NOTICE '2. Run: SELECT public.make_user_admin(''your-email@example.com'');';
    RAISE NOTICE '3. Your website is ready to use!';
    RAISE NOTICE '==============================================';
END $$;