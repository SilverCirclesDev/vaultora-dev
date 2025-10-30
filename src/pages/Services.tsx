import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Cloud, Search, Database, FileCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Services = () => {
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
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-gradient-primary">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive cybersecurity solutions designed to protect your digital assets
            </p>
          </div>

          {/* Services Grid */}
          <div className="space-y-12">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-lg p-8 lg:p-12 hover:border-primary/50 transition-all group"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    <service.icon className="h-16 w-16 text-primary mb-4 group-hover:animate-glow" />
                    <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <Button 
                      className="w-full lg:w-auto"
                      onClick={() => {
                        if ((window as any).LiveChatWidget) {
                          (window as any).LiveChatWidget.call('maximize');
                        }
                      }}
                    >
                      Request Service
                    </Button>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">What's Included:</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-cyber rounded-lg p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Business?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get started with a free consultation to discuss your security needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="glow-primary"
                onClick={() => {
                  if ((window as any).LiveChatWidget) {
                    (window as any).LiveChatWidget.call('maximize');
                  }
                }}
              >
                Get Free Consultation
              </Button>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
