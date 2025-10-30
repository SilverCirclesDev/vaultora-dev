import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Award, Users, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              About <span className="text-gradient-primary">SentinelLock</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Leading the charge in cybersecurity excellence, one layer at a time.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-card border border-border rounded-lg p-8 lg:p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At SentinelLock Cyber Defense, we are committed to protecting your digital assets 
                  through comprehensive security solutions. Our mission is to provide world-class 
                  cybersecurity services that safeguard businesses against evolving threats.
                </p>
                <p className="text-muted-foreground">
                  We believe in a proactive approach to security, identifying vulnerabilities 
                  before they become problems and ensuring your infrastructure remains resilient 
                  against sophisticated attacks.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <Shield className="relative w-full h-64 text-primary animate-glow" />
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our <span className="text-gradient-primary">Leadership</span>
            </h2>
            <div className="bg-card border border-border rounded-lg p-8 lg:p-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center text-4xl font-bold mx-auto mb-6">
                  SL
                </div>
                <h3 className="text-2xl font-bold mb-2">SentinelLock Team</h3>
                <p className="text-primary mb-4">Certified Cybersecurity Professionals</p>
                <p className="text-muted-foreground mb-4">
                  Our team consists of certified cybersecurity professionals with extensive experience in 
                  penetration testing, network security, and threat analysis. We are dedicated to 
                  protecting digital infrastructures and delivering enterprise-grade security solutions 
                  to businesses of all sizes across the United States.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">Team Certifications:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>Certified Ethical Hacker (CEH)</li>
                    <li>Offensive Security Certified Professional (OSCP)</li>
                    <li>Certified Information Systems Security Professional (CISSP)</li>
                    <li>Cloud Security Alliance (CSA) Certifications</li>
                    <li>SANS Security Certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">
              Our <span className="text-gradient-primary">Core Values</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div key={i} className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
