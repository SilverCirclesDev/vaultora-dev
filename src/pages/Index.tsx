import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Lock, 
  Cloud, 
  Search, 
  Award, 
  Users, 
  Target,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Database,
  FileCheck,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import LocalSubmissions from "@/components/LocalSubmissions";
import { submitContactForm } from "@/utils/contactSubmission";
import { FAQ } from "@/components/FAQ";
import { useImageAltAudit } from "@/utils/imageAltText";

const Index = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    service: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SEO: Update page title and meta description dynamically
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    document.title = "Vaultora Cyber Defense | Professional Cybersecurity Services | Penetration Testing & Security Audits";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Leading cybersecurity company providing penetration testing, network security, cloud protection, vulnerability assessments, and compliance consulting. Trusted by 500+ businesses across the US. 24/7 support available.');
    }
  }, []);

  // Audit image alt text in development
  useImageAltAudit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use the new utility function
      const result = await submitContactForm(formData);

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        message: ""
      });
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      // If it's a timeout error, provide specific guidance
      if (error.message.includes('timeout')) {
        toast({
          title: "Connection Timeout",
          description: "Please check your internet connection or try again later. Your message has been logged locally.",
          variant: "destructive"
        });
        
        // Store locally as fallback
        const localSubmissions = JSON.parse(localStorage.getItem('pendingContactSubmissions') || '[]');
        localSubmissions.push({
          ...formData,
          timestamp: new Date().toISOString(),
          status: 'pending'
        });
        localStorage.setItem('pendingContactSubmissions', JSON.stringify(localSubmissions));
        
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to send message. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    {
      icon: Shield,
      title: "Penetration Testing & Ethical Hacking",
      description: "Comprehensive security assessments that simulate real-world attacks to identify vulnerabilities before malicious actors do.",
      features: [
        "Network penetration testing",
        "Web application security testing",
        "Social engineering assessments",
        "Wireless network testing",
        "Physical security assessments"
      ]
    },
    {
      icon: Lock,
      title: "Network & Endpoint Security",
      description: "Protect your infrastructure with advanced security measures designed to prevent unauthorized access and data breaches.",
      features: [
        "Firewall configuration & management",
        "Intrusion detection systems",
        "Endpoint protection solutions",
        "Network segmentation",
        "Security monitoring & alerts"
      ]
    },
    {
      icon: Cloud,
      title: "Cloud Infrastructure Protection",
      description: "Secure your cloud environments across AWS, Azure, and Google Cloud with industry-leading best practices.",
      features: [
        "Cloud security architecture review",
        "Configuration management",
        "Identity & access management",
        "Data encryption solutions",
        "Compliance & governance"
      ]
    },
    {
      icon: Database,
      title: "Data Privacy & Compliance",
      description: "Ensure your organization meets regulatory requirements and protects sensitive customer information.",
      features: [
        "GDPR compliance consulting",
        "Data protection impact assessments",
        "Privacy policy development",
        "Incident response planning",
        "Employee training programs"
      ]
    },
    {
      icon: Search,
      title: "Vulnerability Assessment & Remediation",
      description: "Continuous monitoring and assessment to identify and fix security weaknesses in your systems.",
      features: [
        "Automated vulnerability scanning",
        "Manual security reviews",
        "Patch management consulting",
        "Risk prioritization",
        "Remediation guidance"
      ]
    },
    {
      icon: FileCheck,
      title: "Security Audits & Consulting",
      description: "Expert guidance to develop and implement comprehensive security strategies tailored to your business.",
      features: [
        "Security posture assessments",
        "Policy & procedure development",
        "Incident response planning",
        "Security awareness training",
        "Vendor risk assessments"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" className="relative pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Trusted by 500+ Businesses
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gradient-primary">Securing Your Business</span>
              <br />
              <span className="text-foreground">From Cyber Threats</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              Work with our certified cybersecurity specialists to get full-spectrum protection for your business, safeguard your digital assets, prevent cyber threats, and ensure uninterrupted operations.”
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="glow-primary text-lg px-8"
                onClick={() => {
                  if ((window as any).LiveChatWidget) {
                    (window as any).LiveChatWidget.call('maximize');
                  }
                }}
              >
                Get Started now!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
             /* <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-primary/50 hover:border-primary"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Services
              </Button>*/
            </div>

            {/* Hero Visual */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20 shadow-cyber">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                  <div className="text-center">
                    <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm text-muted-foreground">Clients</div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm text-muted-foreground">Secure</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Comprehensive <span className="text-gradient-primary">Security Services</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                From penetration testing to compliance consulting, we provide end-to-end cybersecurity solutions.
              </p>
            </div>
          
            <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all group hover:shadow-lg"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <service.icon className="h-8 w-8 text-primary group-hover:animate-glow" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-primary/10"
                  onClick={() => {
                    if ((window as any).LiveChatWidget) {
                      (window as any).LiveChatWidget.call('maximize');
                    }
                  }}
                >
                  Request Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

            <div className="text-center mt-12">
              <Link to="/pricing">
                <Button size="lg" className="glow-primary">
                  View All Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="text-gradient-primary">Vaultora?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We are committed to protecting your digital assets through comprehensive security solutions. 
                Our mission is to provide world-class cybersecurity services that safeguard businesses against evolving threats.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: Shield,
                    title: "Security First",
                    desc: "Your protection is our top priority in everything we do"
                  },
                  {
                    icon: Award,
                    title: "Excellence",
                    desc: "Delivering the highest quality cybersecurity services"
                  },
                  {
                    icon: Users,
                    title: "Partnership",
                    desc: "Building lasting relationships with our clients"
                  },
                  {
                    icon: Target,
                    title: "Precision",
                    desc: "Targeted, effective solutions for your specific needs"
                  }
                ].map((value, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <value.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Our Team Certifications:</h3>
                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Certified Ethical Hacker (CEH)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Offensive Security Certified Professional (OSCP)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Certified Information Systems Security Professional (CISSP)
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    SANS Security Certifications
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl" />
              <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-primary/20">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                    V
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vaultora Team</h3>
                  <p className="text-primary text-sm">Certified Cybersecurity Professionals</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="text-sm">Projects Completed</span>
                    <span className="font-bold text-primary">1,200+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="text-sm">Years Experience</span>
                    <span className="font-bold text-primary">10+</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="font-bold text-primary">99.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="text-gradient-primary">Industry Leaders</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our clients say about our cybersecurity services.
            </p>
            </div>
          
            <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Vaultora helped us strengthen our data infrastructure and pass multiple compliance audits. Their professionalism and attention to detail is unmatched.",
                author: "Michael Rodriguez",
                role: "Director, TechSecure Solutions",
                rating: 5
              },
              {
                quote: "The team provided exceptional penetration testing and vulnerability assessments that secured our fintech operations. Highly reliable and responsive experts.",
                author: "Sarah Johnson",
                role: "CTO, FinanceGuard Technologies",
                rating: 5
              },
              {
                quote: "We've seen a dramatic reduction in cybersecurity risks since engaging Vaultora. Excellent communication, top-tier expertise, and real measurable results.",
                author: "David Chen",
                role: "IT Manager, DataShield Corp",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our <span className="text-gradient-primary">Expert Team</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Certified cybersecurity professionals dedicated to protecting your business
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  name: "Alex Rodriguez",
                  role: "Chief Security Officer",
                  bio: "15+ years in cybersecurity with expertise in enterprise security architecture and threat intelligence. Former security lead at Fortune 500 companies.",
                  certifications: ["CISSP", "OSCP"],
                  linkedin: "https://linkedin.com/in/alex-rodriguez-security",
                  image: "AR"
                },
                {
                  name: "Sarah Chen",
                  role: "Lead Penetration Tester",
                  bio: "Specialized in offensive security and ethical hacking. Discovered critical vulnerabilities in major platforms and contributed to open-source security tools.",
                  certifications: ["CEH", "GPEN"],
                  linkedin: "https://linkedin.com/in/sarah-chen-pentester",
                  image: "SC"
                },
                {
                  name: "Michael Johnson",
                  role: "Security Architect",
                  bio: "Expert in designing secure cloud infrastructures and zero-trust architectures. Helped 200+ organizations transition to secure cloud environments.",
                  certifications: ["CISSP", "CISM"],
                  linkedin: "https://linkedin.com/in/michael-johnson-architect",
                  image: "MJ"
                },
                {
                  name: "Emily Davis",
                  role: "Compliance Specialist",
                  bio: "Specializes in regulatory compliance including GDPR, HIPAA, and SOC 2. Guided numerous organizations through successful compliance audits.",
                  certifications: ["CISA", "CRISC"],
                  linkedin: "https://linkedin.com/in/emily-davis-compliance",
                  image: "ED"
                }
              ].map((member, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg group"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {member.image}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-center">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-3 text-center">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.certifications.map((cert, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get In <span className="text-gradient-primary">Touch</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Ready to secure your digital future? Let's discuss your security needs.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <LocalSubmissions />
                <div>
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <a href="mailto:contact@vaultora.com" className="text-muted-foreground hover:text-primary transition-colors">
                          contact@vaultora.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <a href="tel:+15125550147" className="text-muted-foreground hover:text-primary transition-colors">
                          +1 (512) 555-0147
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Office</p>
                        <p className="text-muted-foreground">
                          1234 Cyber Security Drive<br />
                          Austin, TX 78701
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h4 className="font-semibold mb-3">Business Hours</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <p className="text-primary font-semibold">24/7 Emergency Support Available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-8">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="john@company.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          placeholder="Your Company"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="+1 (512) 555-0147"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Service Interest</Label>
                      <Input
                        id="service"
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        placeholder="e.g., Penetration Testing, Network Security"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tell us about your security needs..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="submit" size="lg" className="glow-primary flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button 
                        type="button"
                        size="lg" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if ((window as any).LiveChatWidget) {
                            (window as any).LiveChatWidget.call('maximize');
                          }
                        }}
                      >
                        Live Chat Now
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Follow Section */}
      <section className="py-10 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Connected & <span className="text-gradient-primary">Stay Secure</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Follow us for the latest cybersecurity insights, threat alerts, and industry updates
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              <a 
                href="https://twitter.com/VaultoraSec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Twitter</span>
                <span className="text-xs text-muted-foreground">@VaultoraSec</span>
              </a>
              
              <a 
                href="https://linkedin.com/company/vaultora-cyber-defense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">LinkedIn</span>
                <span className="text-xs text-muted-foreground">Company Page</span>
              </a>
              
              <a 
                href="https://facebook.com/VaultoraSecurit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <span className="text-sm font-medium">Facebook</span>
                <span className="text-xs text-muted-foreground">VaultoraSecurit</span>
              </a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Join 10,000+ security professionals following our updates
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Final CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get <span className="text-gradient-primary">Secured?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Start with a free consultation and discover how we can protect your digital assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="glow-primary text-lg px-8"
                onClick={() => {
                  if ((window as any).LiveChatWidget) {
                    (window as any).LiveChatWidget.call('maximize');
                  }
                }}
              >
                Get Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:border-primary">
                  View Pricing Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
