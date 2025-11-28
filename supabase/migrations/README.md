# Vaultora Database Migrations

This directory contains the SQL migration files for setting up the Vaultora Cyber Defense database.

## Migration Files

### 1. `00000000000000_initial_setup.sql`
**Complete Database Schema Setup**

This file creates:
- All database tables (user_roles, profiles, blog_posts, services, pricing_plans, testimonials, contact_submissions, newsletter_subscriptions, site_metrics)
- All functions (has_role, handle_new_user, update_updated_at_column, make_user_admin)
- All triggers (profile creation, timestamp updates)
- Row Level Security (RLS) policies for all tables
- Proper security definer functions to prevent RLS recursion

**Run this first** in your Supabase SQL Editor.

### 2. `00000000000001_sample_data.sql`
**Sample Data with Professional Content**

This file inserts:
- 3 pricing plans (Essential, Professional, Enterprise)
- 3 core services (Penetration Testing, Network Security, Cloud Protection)
- 3 testimonials from satisfied clients
- 3 professional blog posts with embedded images:
  - Top 10 Cybersecurity Threats 2025
  - Zero Trust Architecture Implementation Guide
  - Ultimate Guide to Penetration Testing

**Run this second** after the initial setup is complete.

## Setup Instructions

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Save your project URL and API keys

### Step 2: Run Initial Setup
1. Open Supabase SQL Editor
2. Copy the entire contents of `00000000000000_initial_setup.sql`
3. Paste and execute
4. Wait for completion message

### Step 3: Run Sample Data
1. In Supabase SQL Editor
2. Copy the entire contents of `00000000000001_sample_data.sql`
3. Paste and execute
4. Wait for completion message

### Step 4: Create Admin User
1. Sign up on your website (creates a regular user)
2. In Supabase SQL Editor, run:
   ```sql
   SELECT public.make_user_admin('your-email@example.com');
   ```
3. You now have admin access!

## Database Structure

### Core Tables
- **user_roles** - Role-based access control (admin, moderator, user)
- **profiles** - Extended user profile information
- **blog_posts** - Blog content with SEO metadata
- **services** - Dynamic service offerings
- **pricing_plans** - Pricing tier information
- **testimonials** - Customer testimonials
- **contact_submissions** - Contact form submissions
- **newsletter_subscriptions** - Newsletter subscriber list
- **site_metrics** - Analytics and metrics tracking

### Security Features
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure functions with SECURITY DEFINER
- Automatic profile creation on user signup
- Automatic timestamp updates

## Troubleshooting

### "relation already exists" errors
These are safe to ignore - the migrations use `IF NOT EXISTS` and `ON CONFLICT` clauses to be idempotent (safe to run multiple times).

### "permission denied" errors
Make sure you're running the SQL as a Supabase admin user in the SQL Editor, not through the API.

### Can't log in as admin
1. Verify user exists: `SELECT * FROM auth.users WHERE email = 'your-email@example.com';`
2. Check admin role: `SELECT * FROM user_roles WHERE user_id = 'user-uuid';`
3. Re-run: `SELECT public.make_user_admin('your-email@example.com');`

## Resetting the Database

If you need to start fresh:

```sql
-- WARNING: This will delete ALL data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Then re-run both migration files
```

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [DATABASE_SETUP.md](../../DATABASE_SETUP.md) - Detailed setup guide
- [SECURITY.md](../../SECURITY.md) - Security best practices

## Support

For issues with database setup:
1. Check the Supabase logs in your dashboard
2. Review the error messages carefully
3. Ensure you're using the latest migration files
4. Contact support if needed

---

**Last Updated**: November 28, 2025
**Database Version**: 1.0
