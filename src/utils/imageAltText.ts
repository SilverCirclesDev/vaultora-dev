/**
 * Image Alt Text Configuration
 * Centralized alt text management for accessibility and SEO
 */

export const imageAltText = {
  // Logo and branding
  logo: "Vaultora Cyber Defense - Professional Cybersecurity Services",
  logoIcon: "Vaultora shield icon",
  
  // Service icons
  services: {
    penetrationTesting: "Penetration testing and ethical hacking services icon",
    networkSecurity: "Network and endpoint security services icon",
    cloudProtection: "Cloud infrastructure protection services icon",
    dataPrivacy: "Data privacy and compliance consulting icon",
    vulnerabilityAssessment: "Vulnerability assessment and remediation icon",
    securityAudit: "Security audits and consulting services icon"
  },
  
  // Team and testimonials
  team: {
    placeholder: "Vaultora cybersecurity team member",
    ceo: "Vaultora CEO and founder",
    cto: "Vaultora Chief Technology Officer",
    securityExpert: "Certified cybersecurity expert"
  },
  
  testimonials: {
    client: (name: string, company: string) => 
      `${name}, satisfied client from ${company}`,
    avatar: (name: string) => 
      `Profile picture of ${name}`
  },
  
  // Blog and content
  blog: {
    featuredImage: (title: string) => 
      `Featured image for blog post: ${title}`,
    thumbnail: (title: string) => 
      `Thumbnail for ${title}`,
    placeholder: "Cybersecurity blog post illustration"
  },
  
  // UI elements
  ui: {
    placeholder: "Placeholder image",
    loading: "Loading content",
    error: "Image failed to load",
    decorative: "" // Empty alt for decorative images
  },
  
  // Certifications and badges
  certifications: {
    ceh: "Certified Ethical Hacker (CEH) certification badge",
    oscp: "Offensive Security Certified Professional (OSCP) badge",
    cissp: "Certified Information Systems Security Professional (CISSP) badge",
    sans: "SANS Security certification badge"
  },
  
  // Social proof
  social: {
    rating: (stars: number) => `${stars} star rating`,
    verified: "Verified customer badge",
    featured: "Featured in publication"
  }
};

/**
 * Validates that an image has proper alt text
 * @param alt - The alt text to validate
 * @returns boolean indicating if alt text is valid
 */
export function validateAltText(alt: string | undefined): boolean {
  if (!alt) return false;
  if (alt.trim().length === 0) return false;
  if (alt.length < 3) return false;
  if (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture')) {
    console.warn('Alt text should describe the content, not mention "image" or "picture"');
  }
  return true;
}

/**
 * Audit images on the page for missing or poor alt text
 * Run this in development to check accessibility
 */
export function auditImageAltText(): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const images = document.querySelectorAll('img');
  const issues: string[] = [];
  
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const src = img.getAttribute('src');
    
    if (!alt) {
      issues.push(`Image ${index + 1} (${src}) is missing alt text`);
    } else if (alt.trim().length === 0 && !img.hasAttribute('role')) {
      issues.push(`Image ${index + 1} (${src}) has empty alt text but no decorative role`);
    } else if (!validateAltText(alt)) {
      issues.push(`Image ${index + 1} (${src}) has invalid alt text: "${alt}"`);
    }
  });
  
  if (issues.length > 0) {
    console.group('🔍 Image Alt Text Audit');
    console.warn(`Found ${issues.length} accessibility issues:`);
    issues.forEach(issue => console.warn(`- ${issue}`));
    console.groupEnd();
  } else {
    console.log('✅ All images have proper alt text');
  }
}

/**
 * React hook to run alt text audit on mount (development only)
 */
export function useImageAltAudit(): void {
  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => auditImageAltText(), 1000);
  }
}
