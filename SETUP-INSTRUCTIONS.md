    q# 🚀 SentinelLock Setup Instructions

## Quick Setup Guide

### 1. 📊 **Set Up Database Tables**

**Option A: Use the Setup Page (Recommended)**
1. Go to `/setup-database` on your website
2. Follow the step-by-step instructions

**Option B: Manual Setup**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `ermsmbmjzsmzotpqbfsp`
3. Go to **SQL Editor**
4. Copy and paste the entire content from `setup-simple.sql`
5. Click **Run**

### 2. 🔧 **Disable Email Confirmation (Recommended for Development)**

1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Scroll down to **Email Auth**
3. **Uncheck** "Enable email confirmations"
4. Click **Save**

### 3. 👤 **Create Your Admin Account**

**Option A: Through Admin Portal**
1. Go to `/admin`
2. Click "Need an account? Sign up"
3. Create your account
4. Continue to Step 4

**Option B: Through Supabase Dashboard**
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter email and password
4. Set **Email Confirm** to `true`
5. Click **Create user**

### 4. 🔑 **Make Yourself Admin**

**Option A: Using Setup Page**
1. Go to `/setup-database`
2. Enter your email in the "Make User Admin" section
3. Click "Make Admin"

**Option B: Using SQL**
1. Go to **SQL Editor** in Supabase
2. Run this query (replace with your email):
```sql
SELECT public.make_user_admin('your-email@example.com');
```

### 5. ✅ **Test Your Setup**

1. Go to `/admin`
2. Log in with your credentials
3. You should see the admin dashboard
4. Test the blog management at `/admin/blog`
5. Test the pricing management at `/admin/pricing`

---

## 🔗 Important URLs

- **Homepage**: `/`
- **Admin Portal**: `/admin` (professional admin login)
- **Admin Dashboard**: `/admin/dashboard`
- **Blog Management**: `/admin/blog`
- **Pricing Management**: `/admin/pricing`
- **Database Setup**: `/setup-database`
- **Public Pricing**: `/pricing`
- **Public Blog**: `/blog`

---

## 🛠️ Troubleshooting

### "Email not confirmed" error
1. Go to **Authentication** → **Users** in Supabase
2. Find your user and click **...** menu
3. Select **Confirm email**

### Can't access admin features
1. Check that tables exist: Go to `/setup-database`
2. Verify admin role: Run this SQL query:
```sql
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'your-email@example.com';
```

### Tables don't exist
1. Run the complete `setup-admin.sql` script
2. Check for any error messages
3. Ensure you have the correct project selected

---

## 📋 Database Schema

The setup creates these tables:
- **`user_roles`** - Admin/user permissions
- **`profiles`** - User profile information  
- **`blog_posts`** - Blog content management

All tables have Row Level Security (RLS) enabled.

---

## 🎯 Features Ready

✅ **Authentication System** - Login/signup with role-based access  
✅ **Admin Dashboard** - Complete admin interface  
✅ **Blog Management** - Full CRUD blog system  
✅ **Live Chat Integration** - Payment discussions via LiveChat  
✅ **SEO Optimization** - Complete meta tags and structured data  
✅ **Social Media Integration** - All social handles configured  
✅ **Modern SaaS UI** - Single-page application with smooth scrolling  

---

## 🚨 Security Notes

- Admin portal is at `/admin` with secure authentication
- All database operations use Row Level Security (RLS)
- Role-based access control for admin features
- Social media handles are configured but you'll need to create the actual accounts
- LiveChat integration is disabled by default (to enable, configure a valid license in index.html)

---

## 📞 Need Help?

If you encounter any issues:
1. Check the `/setup-database` page for diagnostics
2. Review the Supabase logs in your dashboard
3. Ensure all environment variables are correct
4. Verify your Supabase project ID matches: `ermsmbmjzsmzotpqbfsp`