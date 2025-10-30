import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <button 
              onClick={() => scrollToSection('hero')} 
              className="flex items-center gap-2 mb-4"
            >
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gradient-primary">SentinelLock</span>
            </button>
            <p className="text-sm text-muted-foreground mb-4">
              Securing Your Digital Future, One Layer at a Time.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Professional cybersecurity services by certified security experts. Trusted by 500+ companies across the United States.
            </p>
            
            {/* Social Media Links */}
            <div className="flex gap-4">
              <a 
                href="https://twitter.com/SentinelLockSec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://linkedin.com/company/sentinellock-cyber-defense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Connect with us on LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://facebook.com/SentinelLockSecurity" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Like us on Facebook"
              >
                <Facebook className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="https://instagram.com/sentinellocksec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => scrollToSection('hero')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('services')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Penetration Testing</li>
              <li>Network Security</li>
              <li>Cloud Protection</li>
              <li>Data Privacy</li>
              <li>Vulnerability Assessment</li>
              <li>Security Audits</li>
              <li>Compliance Consulting</li>
              <li>Incident Response</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@sentinellock.com" className="text-muted-foreground hover:text-primary transition-colors">
                  contact@sentinellock.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-8900
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  1234 Cyber Security Drive<br />
                  Austin, TX 78701
                </span>
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-muted-foreground">
                🔒 24/7 Emergency Support Available
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SentinelLock Cyber Defense. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="/security-policy" className="hover:text-primary transition-colors">Security Policy</a>
            </div>
          </div>
          
          {/* Additional SEO Footer Content */}
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Professional cybersecurity services in Austin, Texas and nationwide. Certified ethical hackers providing penetration testing, 
              network security, cloud protection, vulnerability assessments, and compliance consulting for businesses of all sizes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
