import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is penetration testing and why do I need it?",
    answer: "Penetration testing (pen testing) is a simulated cyber attack against your system to identify vulnerabilities before malicious hackers do. It's essential for protecting sensitive data, meeting compliance requirements, and preventing costly security breaches. We recommend annual pen tests or after major system changes."
  },
  {
    question: "How long does a security assessment take?",
    answer: "The duration varies based on scope and complexity. A basic network security assessment typically takes 1-2 weeks, while comprehensive penetration testing can take 2-4 weeks. We provide a detailed timeline during our initial consultation based on your specific needs."
  },
  {
    question: "Do you offer 24/7 security monitoring?",
    answer: "Yes, we provide 24/7 security monitoring and incident response services. Our Security Operations Center (SOC) continuously monitors your infrastructure for threats, with immediate alerts and response protocols in place to address any security incidents."
  },
  {
    question: "What industries do you serve?",
    answer: "We serve a wide range of industries including healthcare, finance, e-commerce, technology, manufacturing, and government sectors. Our team has experience with industry-specific compliance requirements like HIPAA, PCI-DSS, SOC 2, and GDPR."
  },
  {
    question: "How much do your cybersecurity services cost?",
    answer: "Pricing varies based on your organization's size, infrastructure complexity, and specific security needs. Our Essential plan starts at $499/month, Professional at $1,299/month, and we offer custom Enterprise solutions. Contact us for a personalized quote and free security consultation."
  },
  {
    question: "What certifications does your team hold?",
    answer: "Our security experts hold industry-leading certifications including Certified Ethical Hacker (CEH), Offensive Security Certified Professional (OSCP), Certified Information Systems Security Professional (CISSP), and various SANS Security certifications. We maintain continuous training to stay current with evolving threats."
  },
  {
    question: "Can you help with compliance requirements?",
    answer: "Absolutely. We provide comprehensive compliance consulting for HIPAA, PCI-DSS, SOC 2, GDPR, NIST, and other regulatory frameworks. Our services include gap assessments, policy development, implementation support, and ongoing compliance monitoring."
  },
  {
    question: "What happens if you find vulnerabilities in our systems?",
    answer: "We provide a detailed report prioritizing vulnerabilities by severity, along with actionable remediation recommendations. Our team works with you to develop a remediation plan and can assist with implementation. We also offer re-testing to verify fixes are effective."
  }
];

export const FAQ = () => {
  useEffect(() => {
    // Add FAQ Schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqData.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked <span className="text-gradient-primary">Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common questions about our cybersecurity services
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help.
            </p>
            <a 
              href="#contact" 
              className="text-primary hover:underline font-semibold"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact our security experts →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
