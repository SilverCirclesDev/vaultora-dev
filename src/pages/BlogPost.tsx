import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string;
  tags: string[] | null;
  featured_image_url: string | null;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  const fetchBlogPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .eq('published', true)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      // Fallback to default articles if database fetch fails
      const fallbackArticles = [
        {
          id: '1',
          title: "Top 10 Cybersecurity Threats Facing Businesses in 2025",
          excerpt: "Discover the most critical security threats organizations need to protect against this year, from ransomware to supply chain attacks.",
          content: `<h2>The Evolving Threat Landscape</h2>
          
          <p>As we move through 2025, the cybersecurity landscape continues to evolve at an unprecedented pace. Organizations worldwide are facing increasingly sophisticated threats that require robust defense strategies and constant vigilance.</p>
          
          <h3>1. Advanced Ransomware Attacks</h3>
          <p>Ransomware continues to be one of the most devastating threats facing businesses today. Modern ransomware groups are employing double and triple extortion tactics, not only encrypting data but also threatening to leak sensitive information and targeting business partners.</p>
          
          <h3>2. Supply Chain Compromises</h3>
          <p>Supply chain attacks have become increasingly common, with attackers targeting trusted vendors and software providers to gain access to multiple organizations simultaneously. The SolarWinds attack demonstrated the far-reaching impact of these sophisticated campaigns.</p>
          
          <h3>3. AI-Powered Social Engineering</h3>
          <p>Artificial intelligence is being weaponized to create more convincing phishing emails, deepfake videos, and voice cloning attacks. These AI-enhanced social engineering attacks are becoming increasingly difficult to detect.</p>
          
          <h3>4. Cloud Misconfigurations</h3>
          <p>As organizations continue their digital transformation journey, cloud misconfigurations remain a significant security risk. Improperly configured cloud services can expose sensitive data and provide attackers with easy access to corporate networks.</p>
          
          <h3>5. IoT Device Vulnerabilities</h3>
          <p>The proliferation of Internet of Things (IoT) devices in corporate environments has created new attack vectors. Many IoT devices lack proper security controls and are difficult to patch, making them attractive targets for cybercriminals.</p>
          
          <h2>Building Effective Defenses</h2>
          <p>Understanding these threats is the first step in building effective defenses. Organizations should implement a comprehensive security strategy that includes regular security assessments, employee training, incident response planning, and continuous monitoring.</p>
          
          <p>At Vaultora, we help organizations identify and mitigate these threats through comprehensive penetration testing, vulnerability assessments, and security consulting services. Contact us today to learn how we can help protect your organization.</p>`,
          published_at: "2025-03-15T00:00:00Z",
          tags: ["Threat Intelligence", "Cybersecurity", "Risk Management"],
          featured_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
        },
        {
          id: '2',
          title: "How to Implement Zero Trust Architecture in Your Organization",
          excerpt: "A comprehensive guide to transitioning from perimeter-based security to a zero trust security model for enhanced protection.",
          content: `<h2>Understanding Zero Trust Architecture</h2>
          
          <p>Zero Trust Architecture represents a fundamental shift in cybersecurity strategy, moving away from the traditional castle and moat approach to a model where trust is never assumed and verification is required from everyone.</p>
          
          <h3>Core Principles of Zero Trust</h3>
          <ul>
            <li><strong>Never Trust, Always Verify:</strong> Every user and device must be authenticated and authorized before accessing resources</li>
            <li><strong>Least Privilege Access:</strong> Users should only have access to the minimum resources necessary for their role</li>
            <li><strong>Assume Breach:</strong> Design security controls assuming that attackers are already inside the network</li>
          </ul>
          
          <h3>Implementation Phases</h3>
          
          <h4>Phase 1: Assessment and Planning</h4>
          <p>Begin by conducting a comprehensive assessment of your current security posture. Identify all users, devices, applications, and data flows within your organization. This inventory will serve as the foundation for your Zero Trust implementation.</p>
          
          <h4>Phase 2: Identity and Access Management</h4>
          <p>Implement strong identity verification mechanisms, including multi-factor authentication (MFA) and single sign-on (SSO). Establish clear policies for user access and regularly review permissions.</p>
          
          <h4>Phase 3: Network Segmentation</h4>
          <p>Implement micro-segmentation to limit lateral movement within your network. Create secure zones for different types of resources and applications.</p>
          
          <h4>Phase 4: Continuous Monitoring</h4>
          <p>Deploy comprehensive monitoring and analytics tools to detect anomalous behavior and potential security incidents in real-time.</p>
          
          <h2>Benefits of Zero Trust</h2>
          <p>Organizations that successfully implement Zero Trust Architecture typically see improved security posture, better compliance, reduced risk of data breaches, and enhanced visibility into their network activities.</p>
          
          <p>Ready to implement Zero Trust in your organization? Contact Vaultora for expert guidance and support throughout your Zero Trust journey.</p>`,
          published_at: "2025-03-10T00:00:00Z",
          tags: ["Zero Trust", "Network Security", "Best Practices"],
          featured_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80"
        },
        {
          id: '3',
          title: "The Ultimate Guide to Penetration Testing",
          excerpt: "Learn about the penetration testing methodology, tools, and techniques used by ethical hackers to identify vulnerabilities.",
          content: `<h2>What is Penetration Testing?</h2>
          
          <p>Penetration testing, or pen testing, is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. It's an essential component of a comprehensive security program that helps organizations identify weaknesses before malicious actors can exploit them.</p>
          
          <h3>Types of Penetration Testing</h3>
          
          <h4>Network Penetration Testing</h4>
          <p>Network pen testing focuses on identifying vulnerabilities in network infrastructure, including firewalls, routers, switches, and network protocols. This type of testing helps ensure that your network perimeter is secure.</p>
          
          <h4>Web Application Testing</h4>
          <p>Web application penetration testing examines web-based applications for security vulnerabilities such as SQL injection, cross-site scripting (XSS), and authentication bypass issues.</p>
          
          <h4>Wireless Network Testing</h4>
          <p>Wireless penetration testing assesses the security of wireless networks, including Wi-Fi networks, Bluetooth connections, and other wireless communication protocols.</p>
          
          <h4>Social Engineering Assessments</h4>
          <p>Social engineering tests evaluate how susceptible your employees are to manipulation tactics used by cybercriminals, including phishing emails, phone calls, and physical security breaches.</p>
          
          <h3>The Penetration Testing Methodology</h3>
          
          <h4>1. Planning and Reconnaissance</h4>
          <p>The first phase involves gathering information about the target system, including network topology, system architecture, and potential entry points.</p>
          
          <h4>2. Scanning and Enumeration</h4>
          <p>Penetration testers use various tools to scan for open ports, services, and potential vulnerabilities in the target systems.</p>
          
          <h4>3. Vulnerability Assessment</h4>
          <p>Identified vulnerabilities are analyzed and prioritized based on their potential impact and exploitability.</p>
          
          <h4>4. Exploitation</h4>
          <p>Testers attempt to exploit identified vulnerabilities to gain unauthorized access or escalate privileges within the system.</p>
          
          <h4>5. Post-Exploitation</h4>
          <p>Once access is gained, testers explore what data and systems can be accessed and what damage could potentially be done.</p>
          
          <h4>6. Reporting</h4>
          <p>A comprehensive report is prepared detailing all findings, including vulnerabilities discovered, exploitation methods used, and recommendations for remediation.</p>
          
          <h3>Choosing the Right Penetration Testing Provider</h3>
          <p>When selecting a penetration testing provider, consider their certifications, experience, methodology, and ability to provide actionable recommendations. Look for providers with certified ethical hackers (CEH), OSCP, or similar credentials.</p>
          
          <p>At Vaultora, our team of certified penetration testers uses industry-standard methodologies and cutting-edge tools to provide comprehensive security assessments. Contact us to learn more about our penetration testing services.</p>`,
          published_at: "2025-03-05T00:00:00Z",
          tags: ["Penetration Testing", "Ethical Hacking", "Security Assessment"],
          featured_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80"
        }
      ];
      
      const fallbackArticle = fallbackArticles.find(a => a.id === postId);
      if (fallbackArticle) {
        setArticle(fallbackArticle);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded mb-4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded mb-8 animate-pulse" />
              <div className="h-64 bg-gray-200 rounded mb-8 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
              <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
              <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back to Blog */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Article Header */}
            <header className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">{article.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.published_at)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {estimateReadTime(article.content)}
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {article.featured_image_url && (
                <div className="mb-8">
                  <img 
                    src={article.featured_image_url} 
                    alt={article.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}
            </header>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>

            {/* Call to Action */}
            <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Need Cybersecurity Help?</h3>
              <p className="text-muted-foreground mb-6">
                Our team of certified security experts is ready to help protect your organization.
              </p>
              <Link 
                to="/#contact" 
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPost;