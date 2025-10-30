# Database Setup Guide

## Step 1: Create Tables in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `ermsmbmjzsmzotpqbfsp`
3. Go to **SQL Editor** in the left sidebar
4. Copy and paste the entire content from `supabase/migrations/20241030120000_initial_setup.sql`
5. Click **Run** to execute the migration

## Step 2: Disable Email Confirmation (for development)

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Scroll down to **Email Auth**
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

## Step 3: Create Your First Admin User

### Option A: Through the Admin Portal (Recommended)
1. Go to `/secure-admin-portal-2024` on your website
2. Click "Need an account? Sign up"
3. Fill in your details and create an account
4. After signup, follow Step 4 below to make yourself admin

### Option B: Through Supabase Dashboard
1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user**
3. Enter your email and password
4. Set **Email Confirm** to `true`
5. Click **Create user**

## Step 4: Make Yourself Admin

After creating your user account, you need to assign admin role:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query (replace `your-email@example.com` with your actual email):

```sql
-- Find your user ID and assign admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users 
WHERE email = 'your-email@example.com';
```

## Step 5: Test Admin Access

1. Go to `/secure-admin-portal-2024`
2. Log in with your credentials
3. You should now have access to the admin dashboard

## Troubleshooting

### If you get "email not confirmed" error:
1. Go to **Authentication** → **Users** in Supabase
2. Find your user and click the **...** menu
3. Select **Confirm email**

### If you can't access admin features:
1. Check that the `user_roles` table exists
2. Verify your user has an admin role entry
3. Make sure RLS policies are properly set up

### To check your admin status:
```sql
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

## Database Schema Created

The setup creates these tables:
- `user_roles` - Manages admin/user permissions
- `profiles` - User profile information
- `blog_posts` - Blog content management

All tables have Row Level Security (RLS) enabled for security.