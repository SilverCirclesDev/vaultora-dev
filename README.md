# Vaultora Cyber Defense

A professional cybersecurity website with comprehensive admin CMS, built with modern web technologies.

## 🛡️ About Vaultora

Vaultora Cyber Defense is a full-featured cybersecurity company website offering:

- **Professional Services**: Penetration testing, network security, cloud protection
- **Content Management**: Full-featured admin CMS for managing content
- **Contact System**: Robust contact form with admin management
- **Blog Platform**: SEO-optimized blog with rich content management
- **Responsive Design**: Mobile-first, modern UI/UX

## 🚀 Features

### Public Website
- ✅ **Landing Page** - Professional hero section with services overview
- ✅ **Services** - Detailed cybersecurity service offerings
- ✅ **Pricing Plans** - Essential, Professional, and Enterprise tiers
- ✅ **Blog** - SEO-optimized articles with individual post pages
- ✅ **Contact Form** - Robust form with local storage fallback
- ✅ **Testimonials** - Customer reviews and social proof
- ✅ **Mobile Responsive** - Optimized for all devices

### Admin CMS
- ✅ **Dashboard** - Comprehensive admin overview with analytics
- ✅ **Blog Management** - Create, edit, and publish blog posts
- ✅ **Contact Management** - View and manage customer inquiries
- ✅ **User Management** - Admin user roles and permissions
- ✅ **Content Management** - Manage services, pricing, testimonials
- ✅ **Analytics** - Track website performance and metrics

### Technical Features
- ✅ **Authentication** - Secure admin login with role-based access
- ✅ **Database** - Supabase backend with Row Level Security
- ✅ **SEO Optimized** - Meta tags, structured data, sitemap
- ✅ **Performance** - Optimized builds and caching strategies
- ✅ **Security** - HTTPS, secure headers, input validation

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account for database

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your Supabase credentials to .env

# Start development server
npm run dev
```

### Database Setup

1. **Create Supabase Project** at [supabase.com](https://supabase.com)
2. **Copy SQL Migration** from `supabase/migrations/00000000000000_complete_setup.sql`
3. **Run in Supabase SQL Editor** - Creates all tables, policies, and sample data
4. **Create Admin Account** - Sign up on your site, then run:
   ```sql
   SELECT public.make_user_admin('your-email@example.com');
   ```

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions.

### Environment Variables

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time subscriptions** - Live data updates
- **Authentication** - Built-in auth with role management

### Deployment & DevOps
- **Netlify** - Static site hosting with CI/CD
- **Environment Variables** - Secure configuration management
- **SEO Optimization** - Meta tags, structured data, sitemap

## 📁 Project Structure

```
vaultora-cyber-defense/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Navbar.tsx      # Navigation component
│   │   └── Footer.tsx      # Footer component
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Landing page
│   │   ├── Blog.tsx        # Blog listing
│   │   ├── BlogPost.tsx    # Individual blog posts
│   │   ├── Pricing.tsx     # Pricing page
│   │   └── Admin*.tsx      # Admin pages
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client and types
│   └── utils/              # Utility functions
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
├── netlify.toml           # Netlify configuration
└── DATABASE_SETUP.md      # Database setup guide
```

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository** to Netlify
2. **Set Environment Variables** in Netlify dashboard
3. **Deploy** - Automatic builds on git push

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

### Environment Variables for Production

Set these in your hosting provider's dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🔧 Configuration

### Netlify Configuration
The `netlify.toml` file includes:
- SPA routing fallback
- Security headers
- Asset optimization
- Build settings

### Database Configuration
- Complete schema in migration file
- Row Level Security policies
- Admin role management
- Sample data included

## 📝 Content Management

### Adding Blog Posts
1. Login to `/admin`
2. Navigate to Blog Management
3. Create new post with rich content
4. Publish when ready

### Managing Services & Pricing
1. Access Admin Dashboard
2. Use Content Management sections
3. Update pricing plans and service offerings
4. Changes reflect immediately on site

### Handling Contact Submissions
1. View submissions in Admin Contacts
2. Update status and manage inquiries
3. Export data as needed

## 🛡️ Security Features

- **Row Level Security** - Database-level access control
- **Role-based Authentication** - Admin/user role separation
- **Input Validation** - Form validation and sanitization
- **HTTPS Enforcement** - Secure connections only
- **Security Headers** - XSS protection, content security
- **Environment Variables** - Secure credential management

## 🎯 SEO & Performance

- **Meta Tags** - Comprehensive SEO meta data
- **Structured Data** - Schema.org markup
- **Sitemap** - XML sitemap for search engines
- **Performance** - Optimized builds and lazy loading
- **Mobile First** - Responsive design principles
- **Core Web Vitals** - Optimized for Google metrics

## 📞 Support

For questions about setup or customization:
1. Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for database issues
2. Review the code comments for implementation details
3. Test locally before deploying to production

## 📄 License

This project is ready for production use and customization for your cybersecurity business needs.
