import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
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

const Blog = () => {
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      console.log('Fetching blog posts from database...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }
      
      console.log('Blog posts fetched:', data?.length || 0, 'posts');
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      console.log('Using fallback articles...');
      // Fallback to default articles if database fetch fails
      setArticles([
        {
          id: '1',
          title: "Top 10 Cybersecurity Threats Facing Businesses in 2025",
          excerpt: "Discover the most critical security threats organizations need to protect against this year, from ransomware to supply chain attacks.",
          content: "As we move through 2025, the cybersecurity landscape continues to evolve at an unprecedented pace. Organizations worldwide are facing increasingly sophisticated threats that require robust defense strategies and constant vigilance. This comprehensive guide covers the top 10 threats every business should be aware of, including advanced ransomware attacks, supply chain compromises, AI-powered social engineering, cloud misconfigurations, and IoT device vulnerabilities. Understanding these threats is the first step in building effective defenses.",
          published_at: "2025-03-15T00:00:00Z",
          tags: ["Threat Intelligence"],
          featured_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
        },
        {
          id: '2',
          title: "How to Implement Zero Trust Architecture in Your Organization",
          excerpt: "A comprehensive guide to transitioning from perimeter-based security to a zero trust security model for enhanced protection.",
          content: "Zero Trust Architecture represents a fundamental shift in cybersecurity strategy, moving away from the traditional castle and moat approach to a model where trust is never assumed and verification is required from everyone. This guide covers the key principles of Zero Trust, implementation phases, and the benefits organizations can expect to see. Learn about identity verification, least privilege access, micro-segmentation, and continuous monitoring strategies that form the foundation of a robust Zero Trust implementation.",
          published_at: "2025-03-10T00:00:00Z",
          tags: ["Best Practices"],
          featured_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
        },
        {
          id: '3',
          title: "The Ultimate Guide to Penetration Testing",
          excerpt: "Learn about the penetration testing methodology, tools, and techniques used by ethical hackers to identify vulnerabilities.",
          content: "Penetration testing, or pen testing, is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. This comprehensive guide covers everything you need to know about penetration testing, including different types of testing, methodologies, common tools, and how to choose the right penetration testing provider. Whether you're looking to understand network testing, web application testing, or social engineering assessments, this guide provides the insights you need to make informed decisions about your security testing strategy.",
          published_at: "2025-03-05T00:00:00Z",
          tags: ["Penetration Testing"],
          featured_image_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80"
        }
      ]);
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
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  const getDefaultImage = (index: number) => {
    const images = [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80"
    ];
    return images[index % images.length];
  };

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
          {loading ? (
            <div className="max-w-6xl mx-auto mb-20">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto bg-gray-200 animate-pulse" />
                  <div className="p-8 flex flex-col justify-center">
                    <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse" />
                    <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded mb-6 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ) : articles.length > 0 ? (
            <div className="max-w-6xl mx-auto mb-20">
              <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
                <div className="grid md:grid-cols-2 gap-0">
                  <div 
                    className="h-64 md:h-auto bg-cover bg-center"
                    style={{ backgroundImage: `url(${articles[0].featured_image_url || getDefaultImage(0)})` }}
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
                        {formatDate(articles[0].published_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {estimateReadTime(articles[0].content)}
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
          ) : null}

          {/* Articles Grid */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length > 1 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.slice(1).map((article, index) => (
                  <article 
                    key={article.id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-cyber group"
                  >
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${article.featured_image_url || getDefaultImage(index + 1)})` }}
                    />
                    <div className="p-6">
                      {article.tags && article.tags.length > 0 && (
                        <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
                          {article.tags[0]}
                        </div>
                      )}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.published_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {estimateReadTime(article.content)}
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No blog posts available yet.</p>
                <p className="text-sm text-muted-foreground">Check back soon for cybersecurity insights and updates!</p>
              </div>
            )}
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
