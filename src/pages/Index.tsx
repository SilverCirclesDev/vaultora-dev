import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Cloud, Search } from "lucide-react";
import { Link } from "react-router-dom";
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
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button size="lg" className="glow-primary text-lg px-8 w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:border-primary w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
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

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}

<section className="py-20 bg-card/30">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12">
      Trusted by <span className="text-gradient-primary">Kenyan Industry Leaders</span>
    </h2>
    
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[
        {
          quote:
            "SentinelLock helped us strengthen our data infrastructure and pass multiple compliance audits. Their professionalism and attention to detail is unmatched.",
          author: "Franklin Kipchirchir",
          role: "Director, RiftWormanship Limited"
        },
        {
          quote:
            "A big thank you to Kevin’s team provided exceptional penetration testing and vulnerability assessments that secured our fintech operations. Highly reliable and responsive experts.",
          author: "Alice Wanjiku",
          role: "CTO, PaySure Technologies (Nairobi)"
        },
        {
          quote:
            "We’ve seen a dramatic reduction in cybersecurity risks since engaging SentinelLock. Excellent communication, top-tier expertise, and real measurable results.",
          author: "Brian Otieno",
          role: "IT Manager, EastNet Solutions Kenya"
        }
      ].map((testimonial, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <p className="text-muted-foreground mb-4 italic">
            "{testimonial.quote}"
          </p>
          <div>
            <p className="font-semibold text-foreground">{testimonial.author}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-cyber rounded-lg p-8 lg:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Ready to Get <span className="text-gradient-primary">Secured?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start with a free consultation and discover how we can protect your digital assets
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="glow-primary text-lg px-8 w-full sm:w-auto">
                  Get Free Consultation
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary/50 hover:border-primary w-full sm:w-auto">
                  View Pricing
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
