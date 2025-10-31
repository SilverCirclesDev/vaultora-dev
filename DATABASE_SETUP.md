# Vaultora Database Setup

This guide will help you set up the complete database for the Vaultora cybersecurity website.

## Quick Setup (Recommended)

### Option 1: Using the Complete Setup File

1. **Go to your Supabase project dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `supabase/migrations/00000000000000_complete_setup.sql`**
4. **Click "Run"**

This single file contains everything you need:
- ✅ All database tables and relationships
- ✅ Security policies (RLS)
- ✅ Initial data (pricing plans, services, testimonials, blog posts)
- ✅ Admin functions and triggers

### Option 2: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Run migrations
supabase db push
```

## After Database Setup

### 1. Create Your Admin Account

1. **Sign up** on your website at `/admin`
2. **Note your email address**

### 2. Make Yourself Admin

In Supabase SQL Editor, run:

```sql
SELECT public.make_user_admin('your-email@example.com');
```

Replace `your-email@example.com` with your actual email.

### 3. Verify Setup

You should now be able to:
- ✅ Access the admin dashboard at `/admin`
- ✅ Manage blog posts, pricing, testimonials
- ✅ View contact form submissions
- ✅ See the website with all content loaded

## What's Included

### Database Tables
- **user_roles** - Admin access control
- **profiles** - User profile information
- **blog_posts** - Blog content management
- **services** - Service offerings
- **pricing_plans** - Pricing tiers
- **testimonials** - Customer reviews
- **contact_submissions** - Contact form data
- **newsletter_subscriptions** - Email subscribers
- **site_metrics** - Analytics data

### Initial Data
- **3 Pricing Plans**: Essential ($499), Professional ($1,299), Enterprise (Custom)
- **3 Services**: Penetration Testing, Network Security, Cloud Protection
- **3 Testimonials**: Customer reviews from different companies
- **3 Blog Posts**: Sample cybersecurity articles

### Security Features
- **Row Level Security (RLS)** on all tables
- **Role-based access control** (admin, moderator, user)
- **Secure functions** for admin operations
- **Automatic profile creation** on user signup

## Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Troubleshooting

### Can't Access Admin Dashboard?
1. Make sure you ran the `make_user_admin` function
2. Check that your email is confirmed in Supabase Auth
3. Try logging out and back in

### Contact Form Not Working?
1. Verify the `contact_submissions` table exists
2. Check RLS policies allow anonymous inserts
3. Test with the debug tools (in development mode)

### Missing Data?
1. Check if the initial data INSERT statements ran successfully
2. Verify tables have the correct structure
3. Re-run the complete setup file if needed

## Production Deployment

For production deployment:
1. ✅ Database is ready (this setup)
2. ✅ Environment variables configured
3. ✅ Admin account created
4. ✅ Deploy to Netlify/Vercel

Your Vaultora website is now ready for production! 🚀