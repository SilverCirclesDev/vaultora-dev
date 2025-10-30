import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const Blog = () => {
  const articles = [
    {
      id: 1,
      title: "Top 10 Cybersecurity Threats Facing Businesses in 2025",
      excerpt: "Discover the most critical security threats organizations need to protect against this year, from ransomware to supply chain attacks.",
      category: "Threat Intelligence",
      date: "March 15, 2025",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    },
    {
      id: 2,
      title: "How to Implement Zero Trust Architecture in Your Organization",
      excerpt: "A comprehensive guide to transitioning from perimeter-based security to a zero trust security model for enhanced protection.",
      category: "Best Practices",
      date: "March 10, 2025",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
    },
    {
      id: 3,
      title: "The Ultimate Guide to Penetration Testing",
      excerpt: "Learn about the penetration testing methodology, tools, and techniques used by ethical hackers to identify vulnerabilities.",
      category: "Penetration Testing",
      date: "March 5, 2025",
      readTime: "15 min read",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
    },
    {
      id: 4,
      title: "Cloud Security Best Practices for AWS, Azure, and GCP",
      excerpt: "Essential security configurations and practices to protect your cloud infrastructure across major cloud platforms.",
      category: "Cloud Security",
      date: "February 28, 2025",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"
    },
    {
      id: 5,
      title: "Understanding GDPR and Data Privacy Compliance",
      excerpt: "Navigate the complexities of GDPR compliance and learn how to protect customer data while meeting regulatory requirements.",
      category: "Compliance",
      date: "February 20, 2025",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80"
    },
    {
      id: 6,
      title: "Incident Response: Creating an Effective Cybersecurity Plan",
      excerpt: "Build a robust incident response plan to minimize damage and recover quickly from security breaches.",
      category: "Incident Response",
      date: "February 15, 2025",
      readTime: "11 min read",
      image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80"
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
              Cybersecurity <span className="text-gradient-primary">Insights & News</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Stay informed with the latest cybersecurity trends, best practices, and threat intelligence from industry experts.
            </p>
          </div>

          {/* Featured Article */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
              <div className="grid md:grid-cols-2 gap-0">
                <div 
                  className="h-64 md:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${articles[0].image})` }}
                />
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 w-fit">
                    Featured
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{articles[0].title}</h2>
                  <p className="text-muted-foreground mb-6">{articles[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {articles[0].date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {articles[0].readTime}
                    </div>
                  </div>
                  <Link 
                    to="#" 
                    className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold"
                  >
                    Read Full Article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.slice(1).map((article) => (
                <article 
                  key={article.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-cyber group"
                >
                  <div 
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="p-6">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                      {article.category}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                    <Link 
                      to="#" 
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all text-sm font-semibold"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="max-w-4xl mx-auto mt-20 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for weekly cybersecurity insights and updates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
