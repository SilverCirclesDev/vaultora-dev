# Site Settings Implementation

## Overview
Implemented a complete site settings management system that stores configuration in Supabase and can be managed through the admin panel.

## What Was Created

### 1. Database Migration (`supabase/migrations/00000000000002_site_settings.sql`)
- **site_settings table** with columns:
  - `setting_key` (unique identifier)
  - `setting_value` (stored as text)
  - `setting_type` (string, number, boolean, json)
  - `description` (what the setting does)
  - `category` (general, email, security, social, advanced)
  - Timestamps (created_at, updated_at)

- **Row Level Security (RLS)**:
  - Anyone can view settings (public read)
  - Only admins can insert/update/delete settings

- **Helper Functions**:
  - `get_setting(key)` - Get a single setting value
  - `update_setting(key, value)` - Update a single setting

- **Default Settings Inserted**:
  - Site name, description, contact info
  - Social media handles
  - Email/SMTP configuration
  - Security settings

### 2. React Hook (`src/hooks/useSiteSettings.ts`)
Custom hook for managing settings:
- `fetchSettings()` - Load all settings from database
- `updateSetting(key, value)` - Update single setting
- `updateMultipleSettings(updates)` - Batch update
- `getSetting(key, default)` - Get setting with fallback
- Automatic type conversion (string/number/boolean)

### 3. Warning Dialog (`src/components/SettingsSaveDialog.tsx`)
Professional confirmation dialog that shows:
- Number of settings being changed
- What will happen (database write, immediate effect)
- Important recommendations (backup first!)
- Clear call-to-action buttons

### 4. Updated AdminSettings Page
- Loads settings from Supabase on mount
- Shows warning banner about database changes
- Refresh button to reload settings
- Save buttons trigger confirmation dialog
- Real-time change tracking

## How to Use

### Step 1: Run the Migration
```sql
-- In Supabase SQL Editor, run:
supabase/migrations/00000000000002_site_settings.sql
```

### Step 2: Access Admin Settings
1. Go to `/admin/settings`
2. Modify any settings
3. Click "Save" button
4. Review the warning dialog
5. Confirm to save to database

### Step 3: Use Settings in Your App
```typescript
import { useSiteSettings } from '@/hooks/useSiteSettings';

function MyComponent() {
  const { settings, getSetting } = useSiteSettings();
  
  const siteName = getSetting('site_name', 'Default Name');
  const contactEmail = getSetting('contact_email');
  
  return <div>{siteName}</div>;
}
```

## Settings Categories

### General Settings
- `site_name` - Website name
- `site_description` - Website description
- `contact_email` - Primary contact email
- `contact_phone` - Primary contact phone
- `address` - Business address
- `maintenance_mode` - Enable/disable maintenance mode
- `analytics_enabled` - Enable/disable analytics

### Social Media
- `social_twitter` - Twitter handle
- `social_linkedin` - LinkedIn company page
- `social_facebook` - Facebook page name
- `social_instagram` - Instagram handle

### Email Settings
- `smtp_host` - SMTP server host
- `smtp_port` - SMTP server port
- `smtp_username` - SMTP username
- `smtp_password` - SMTP password
- `from_email` - From email address
- `from_name` - From name

### Security Settings
- `session_timeout` - Session timeout in hours
- `max_login_attempts` - Maximum login attempts
- `password_min_length` - Minimum password length
- `require_2fa` - Require two-factor authentication
- `api_rate_limit` - API rate limit per minute

## Security Features

### Database Security
- Row Level Security (RLS) enabled
- Only admins can modify settings
- All changes are logged with timestamps
- Settings are validated before saving

### UI Security
- Confirmation dialog before saving
- Warning banner on settings page
- Backup recommendation
- Clear indication of database writes

## Next Steps

### Recommended Enhancements
1. **Use Settings Throughout App**:
   - Replace hardcoded contact info with settings
   - Use social media links from settings
   - Implement maintenance mode check

2. **Add More Settings**:
   - Logo URL
   - Theme colors
   - Feature flags
   - API keys (encrypted)

3. **Backup System**:
   - Implement database backup functionality
   - Export/import settings as JSON
   - Version history for settings

4. **Validation**:
   - Email format validation
   - URL validation for social media
   - Number range validation

## Example: Using Settings in Footer

```typescript
// src/components/Footer.tsx
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer = () => {
  const { getSetting } = useSiteSettings();
  
  return (
    <footer>
      <p>{getSetting('site_name')}</p>
      <a href={`mailto:${getSetting('contact_email')}`}>
        {getSetting('contact_email')}
      </a>
      <a href={`https://twitter.com/${getSetting('social_twitter')}`}>
        Twitter
      </a>
    </footer>
  );
};
```

## Troubleshooting

### Settings Not Loading
- Check if migration was run successfully
- Verify RLS policies are correct
- Check browser console for errors

### Can't Save Settings
- Ensure user has admin role
- Check Supabase connection
- Verify RLS policies allow admin updates

### TypeScript Errors
- The hook uses `as any` for Supabase types
- This is temporary until types are regenerated
- Run `npx supabase gen types typescript` to update types

## Important Notes

⚠️ **Always backup your database before making changes**
⚠️ **Test in development environment first**
⚠️ **Settings changes are immediate and affect production**
⚠️ **SMTP passwords should be encrypted in production**

---

**Status**: ✅ Fully Implemented and Ready for Use
**Last Updated**: November 28, 2025
