import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Cloud, Search } from "lucide-react";
import heroImage from "@/assets/hero-cyber.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-cyber opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-gradient-primary">Securing Your</span>
                <br />
                <span className="text-foreground">Digital Future</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                One Layer at a Time. Professional cybersecurity services led by certified expert Kevin.
              </p>
              
              <div className="flex gap-4">
                <Button size="lg" className="glow-primary text-lg px-8">
                  Get Started
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:border-primary">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl" />
              <img 
                src={heroImage} 
                alt="Cybersecurity Defense" 
                className="relative rounded-lg shadow-cyber animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="text-gradient-primary">Our Services</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Penetration Testing", desc: "Ethical hacking to identify vulnerabilities" },
              { icon: Lock, title: "Network Security", desc: "Protect your infrastructure" },
              { icon: Cloud, title: "Cloud Protection", desc: "Secure cloud environments" },
              { icon: Search, title: "Vulnerability Assessment", desc: "Comprehensive security audits" }
            ].map((service, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group">
                <service.icon className="h-12 w-12 text-primary mb-4 group-hover:animate-glow" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
