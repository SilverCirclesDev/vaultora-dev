import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string | null;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
}

const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // Fallback to default plans if database fetch fails
      setPlans([
        {
          id: '1',
          name: "Essential",
          price: "$499",
          period: "per month",
          description: "Perfect for small businesses starting their security journey",
          features: [
            "Monthly vulnerability scans",
            "Basic security assessments",
            "Email support",
            "Security incident reporting",
            "Quarterly security reviews"
          ],
          is_popular: false,
          is_active: true,
          display_order: 1
        },
        {
          id: '2',
          name: "Professional",
          price: "$1,299",
          period: "per month",
          description: "Comprehensive protection for growing businesses",
          features: [
            "Weekly vulnerability scans",
            "Advanced penetration testing",
            "24/7 priority support",
            "Real-time threat monitoring",
            "Monthly security audits",
            "Compliance consulting",
            "Incident response support"
          ],
          is_popular: true,
          is_active: true,
          display_order: 2
        },
        {
          id: '3',
          name: "Enterprise",
          price: "Custom",
          period: "tailored pricing",
          description: "Full-scale security solutions for large organizations",
          features: [
            "Daily automated scans",
            "Dedicated security team",
            "24/7 emergency support",
            "Custom security solutions",
            "Advanced threat intelligence",
            "Complete compliance management",
            "On-site security assessments",
            "Executive security briefings"
          ],
          is_popular: false,
          is_active: true,
          display_order: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const oneTimeServices = [
    {
      name: "Security Audit",
      price: "$2,500",
      description: "Comprehensive assessment of your security posture"
    },
    {
      name: "Penetration Test",
      price: "$3,500",
      description: "Full-scale ethical hacking engagement"
    },
    {
      name: "Compliance Review",
      price: "$1,800",
      description: "GDPR, ISO 27001, or other compliance assessments"
    },
    {
      name: "Incident Response",
      price: "$5,000",
      description: "Emergency breach investigation and remediation"
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
              Simple, <span className="text-gradient-primary">Transparent Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that fits your security needs. No hidden fees.
            </p>
          </div>

          {/* Monthly Plans */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Monthly Plans</h2>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan) => (
                  <div 
                    key={plan.id}
                    className={`bg-card border rounded-lg p-8 relative ${
                      plan.is_popular 
                        ? 'border-primary shadow-cyber scale-105' 
                        : 'border-border hover:border-primary/50'
                    } transition-all`}
                  >
                    {plan.is_popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-4xl font-bold text-gradient-primary mb-1">{plan.price}</div>
                      <p className="text-sm text-muted-foreground">{plan.period}</p>
                    </div>
                    
                    {plan.description && (
                      <p className="text-muted-foreground text-center mb-6">{plan.description}</p>
                    )}
                    
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => {
                        if ((window as any).LiveChatWidget) {
                          (window as any).LiveChatWidget.call('maximize');
                        }
                      }}
                      className={`w-full ${plan.is_popular ? 'glow-primary' : ''}`}
                      variant={plan.is_popular ? 'default' : 'outline'}
                    >
                      Get Started
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* One-Time Services */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">One-Time Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {oneTimeServices.map((service, index) => (
                <div 
                  key={index}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="text-2xl font-bold text-primary mb-2">{service.price}</div>
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button 
                    onClick={() => {
                      if ((window as any).LiveChatWidget) {
                        (window as any).LiveChatWidget.call('maximize');
                      }
                    }}
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    Request Quote
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, bank transfers, and support integration with Paystack for secure online payments."
                },
                {
                  q: "Can I upgrade or downgrade my plan?",
                  a: "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle."
                },
                {
                  q: "Do you offer custom enterprise solutions?",
                  a: "Absolutely. Our Enterprise plan is fully customizable to meet your specific security requirements. Contact us for a personalized quote."
                },
                {
                  q: "What's included in the free consultation?",
                  a: "Our free consultation includes a preliminary security assessment, discussion of your specific needs, and recommendations for the best security approach for your business."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl font-bold mb-4">Not sure which plan is right for you?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Schedule a free consultation with our security experts
            </p>
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
