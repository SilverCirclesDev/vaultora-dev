/**
 * Third-Party Service Configuration
 * 
 * This file centralizes all third-party service configurations.
 * Never commit actual API keys or sensitive credentials to version control.
 */

export const LIVECHAT_CONFIG = {
  // LiveChat license ID - Get from https://www.livechat.com/
  // For production, set VITE_LIVECHAT_LICENSE in your environment variables
  license: import.meta.env.VITE_LIVECHAT_LICENSE || '19356281',
  integrationName: 'manual_onboarding',
  productName: 'livechat'
};

export const SITE_CONFIG = {
  // Site URL for canonical links and SEO
  url: import.meta.env.VITE_SITE_URL || 'https://vaultora.com',
  name: 'Vaultora Cyber Defense',
  description: 'Professional cybersecurity services including penetration testing, network security, and vulnerability assessments.'
};

// Social Media Handles (public information)
export const SOCIAL_MEDIA = {
  twitter: '@VaultoraSec',
  linkedin: 'company/vaultora-cyber-defense',
  facebook: 'VaultoraSecurit',
  instagram: 'vaultorasec'
};

// Contact Information (public information)
export const CONTACT_INFO = {
  email: 'contact@vaultora.com',
  phone: '+1-512-555-0147',
  address: {
    street: '1234 Cyber Security Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    country: 'US'
  }
};
