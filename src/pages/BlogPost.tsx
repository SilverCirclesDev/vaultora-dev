import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { imageAltText } from "@/utils/imageAltText";
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
  IconButton,
  Divider,
  Avatar,
  Button,
  Skeleton,
  Paper,
  Tooltip,
  Fade,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  ArrowBack,
  Share,
  Twitter,
  LinkedIn,
  Facebook,
  Link as LinkIcon,
  BookmarkBorder,
  TrendingUp,
  FormatListBulleted,
} from '@mui/icons-material';
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  published_at: string;
  tags: string[] | null;
  featured_image_url: string | null;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (id) {
      fetchBlogPost(id);
    }
  }, [id]);

  // Extract headings for table of contents
  useEffect(() => {
    if (article && contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h2, h3');
      const tocItems: TocItem[] = [];
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        tocItems.push({
          id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        });
      });
      
      setToc(tocItems);
    }
  }, [article]);

  // Track active heading on scroll
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

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
      // Fallback articles
      const fallbackArticles = [
        {
          id: '1',
          title: "Top 10 Cybersecurity Threats Facing Businesses in 2025",
          excerpt: "Discover the most critical security threats organizations need to protect against this year.",
          content: `
            <h2>The Evolving Threat Landscape</h2>
            <p>As we move through 2025, the cybersecurity landscape continues to evolve at an unprecedented pace. Organizations worldwide are facing increasingly sophisticated threats that require robust defense strategies and constant vigilance.</p>
            
            <h3>1. Advanced Ransomware Attacks</h3>
            <p><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80" alt="Cybersecurity threat monitoring" align="right" width="400" />Ransomware continues to be one of the most devastating threats facing businesses today. Modern ransomware groups are employing double and triple extortion tactics, not only encrypting data but also threatening to leak sensitive information and targeting business partners. The sophistication of these attacks has increased dramatically, with attackers using advanced techniques to evade detection and maximize their impact on organizations.</p>
            
            <h3>2. Supply Chain Compromises</h3>
            <p>Supply chain attacks have become increasingly common, with attackers targeting trusted vendors and software providers to gain access to multiple organizations simultaneously. The SolarWinds attack demonstrated the far-reaching impact of these sophisticated campaigns, affecting thousands of organizations worldwide.</p>
            
            <h3>3. AI-Powered Social Engineering</h3>
            <p><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" alt="Network security infrastructure" align="left" width="400" />Artificial intelligence is being weaponized to create more convincing phishing emails, deepfake videos, and voice cloning attacks. These AI-enhanced social engineering attacks are becoming increasingly difficult to detect, as they can mimic human behavior and communication patterns with remarkable accuracy. Organizations must invest in advanced detection systems and employee training to combat these evolving threats.</p>
            
            <h3>4. Cloud Misconfigurations</h3>
            <p>As organizations continue their digital transformation journey, cloud misconfigurations remain a significant security risk. Improperly configured cloud services can expose sensitive data and provide attackers with easy access to corporate networks. Regular security audits and automated configuration management tools are essential for maintaining a secure cloud environment.</p>
            
            <h3>5. IoT Device Vulnerabilities</h3>
            <p>The proliferation of Internet of Things (IoT) devices in corporate environments has created new attack vectors. Many IoT devices lack proper security controls and are difficult to patch, making them attractive targets for cybercriminals.</p>
            
            <h2>Building Effective Defenses</h2>
            <p>Understanding these threats is the first step in building effective defenses. Organizations should implement a comprehensive security strategy that includes regular security assessments, employee training, incident response planning, and continuous monitoring.</p>
            
            <p>At Vaultora, we help organizations identify and mitigate these threats through comprehensive penetration testing, vulnerability assessments, and security consulting services.</p>
          `,
          published_at: "2025-03-15T00:00:00Z",
          tags: ["Threat Intelligence", "Cybersecurity", "Risk Management"],
          featured_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"
        },
        {
          id: '2',
          title: "How to Implement Zero Trust Architecture",
          excerpt: "A comprehensive guide to transitioning to a zero trust security model.",
          content: `
            <h2>Understanding Zero Trust Architecture</h2>
            <p><img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80" alt="Zero trust network architecture" align="right" width="400" />Zero Trust Architecture represents a fundamental shift in cybersecurity strategy, moving away from the traditional castle and moat approach to a model where trust is never assumed and verification is required from everyone. This paradigm shift recognizes that threats can come from both outside and inside the network perimeter, requiring a more comprehensive approach to security.</p>
            
            <h3>Core Principles of Zero Trust</h3>
            <ul>
              <li><strong>Never Trust, Always Verify:</strong> Every user and device must be authenticated and authorized before accessing resources</li>
              <li><strong>Least Privilege Access:</strong> Users should only have access to the minimum resources necessary for their role</li>
              <li><strong>Assume Breach:</strong> Design security controls assuming that attackers are already inside the network</li>
            </ul>
            
            <h3>Implementation Phases</h3>
            <p><img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" alt="Security implementation planning" align="left" width="400" />Begin by conducting a comprehensive assessment of your current security posture. Identify all users, devices, applications, and data flows within your organization. This inventory will serve as the foundation for your Zero Trust implementation, helping you understand where sensitive data resides and how it flows through your systems.</p>
            
            <p>Implement strong identity verification mechanisms, including multi-factor authentication (MFA) and single sign-on (SSO). Establish clear policies for user access and regularly review permissions to ensure they align with the principle of least privilege.</p>
            
            <h2>Benefits of Zero Trust</h2>
            <p>Organizations that successfully implement Zero Trust Architecture typically see improved security posture, better compliance, reduced risk of data breaches, and enhanced visibility into their network activities. The investment in Zero Trust pays dividends through reduced incident response costs and improved regulatory compliance.</p>
          `,
          published_at: "2025-03-10T00:00:00Z",
          tags: ["Zero Trust", "Network Security"],
          featured_image_url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=80"
        },
        {
          id: '3',
          title: "The Ultimate Guide to Penetration Testing",
          excerpt: "Learn about penetration testing methodology and techniques.",
          content: `
            <h2>What is Penetration Testing?</h2>
            <p><img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" alt="Ethical hacker performing penetration testing" align="right" width="400" />Penetration testing, or pen testing, is a simulated cyber attack against your computer system to check for exploitable vulnerabilities. It's an essential component of a comprehensive security program that helps organizations identify weaknesses before malicious actors can exploit them. Professional penetration testers use the same tools and techniques as real attackers, but with permission and in a controlled manner.</p>
            
            <h3>Types of Penetration Testing</h3>
            
            <h4>Network Penetration Testing</h4>
            <p>Network pen testing focuses on identifying vulnerabilities in network infrastructure, including firewalls, routers, switches, and network protocols. This type of testing helps ensure that your network perimeter is secure and that internal segmentation is properly configured.</p>
            
            <h4>Web Application Testing</h4>
            <p><img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" alt="Web application security testing" align="left" width="400" />Web application penetration testing examines web-based applications for security vulnerabilities such as SQL injection, cross-site scripting (XSS), and authentication bypass issues. With the increasing complexity of modern web applications, this type of testing has become crucial for protecting sensitive data and maintaining customer trust.</p>
            
            <h4>Wireless Network Testing</h4>
            <p>Wireless penetration testing assesses the security of wireless networks, including Wi-Fi networks, Bluetooth connections, and other wireless communication protocols. This testing identifies weak encryption, rogue access points, and other vulnerabilities that could allow unauthorized access.</p>
            
            <h3>The Penetration Testing Methodology</h3>
            <p>The process involves planning and reconnaissance, scanning and enumeration, vulnerability assessment, exploitation, post-exploitation, and comprehensive reporting. Each phase builds upon the previous one, providing a thorough assessment of your security posture.</p>
            
            <p>At Vaultora, our team of certified penetration testers uses industry-standard methodologies and cutting-edge tools to provide comprehensive security assessments. We deliver actionable insights that help you prioritize remediation efforts and strengthen your overall security posture.</p>
          `,
          published_at: "2025-03-05T00:00:00Z",
          tags: ["Penetration Testing", "Ethical Hacking"],
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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied!",
          description: "Article link copied to clipboard",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ pt: 16, pb: 10 }}>
          <Skeleton variant="rectangular" height={400} sx={{ mb: 4, borderRadius: 2 }} />
          <Skeleton width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton width="100%" height={100} sx={{ mb: 4 }} />
          <Stack spacing={1}>
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} width="100%" height={24} />
            ))}
          </Stack>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!article) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ pt: 16, pb: 10, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Article Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The article you're looking for doesn't exist or has been removed.
          </Typography>
          <Button
            component={Link}
            to="/blog"
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{ mt: 2 }}
          >
            Back to Blog
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />

      {/* Article Content with TOC */}
      <Box sx={{ pt: 16, pb: 10 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', gap: 4, position: 'relative' }}>
            {/* Table of Contents - Left Sidebar */}
            {!loading && article && toc.length > 0 && (
              <Box
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  width: 250,
                  flexShrink: 0,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    position: 'sticky',
                    top: 100,
                    p: 3,
                    bgcolor: 'grey.50',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    maxHeight: 'calc(100vh - 120px)',
                    overflow: 'auto',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <FormatListBulleted sx={{ fontSize: 20, color: 'primary.main' }} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Table of Contents
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <List dense disablePadding>
                    {toc.map((item) => (
                      <ListItem key={item.id} disablePadding>
                        <ListItemButton
                          onClick={() => scrollToHeading(item.id)}
                          selected={activeId === item.id}
                          sx={{
                            pl: item.level === 3 ? 3 : 1,
                            py: 0.5,
                            borderRadius: 1,
                            '&.Mui-selected': {
                              bgcolor: 'primary.light',
                              color: 'primary.main',
                              fontWeight: 600,
                              '&:hover': {
                                bgcolor: 'primary.light',
                              }
                            },
                            '&:hover': {
                              bgcolor: 'grey.100',
                            }
                          }}
                        >
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: {
                                fontSize: item.level === 3 ? '0.8125rem' : '0.875rem',
                                lineHeight: 1.4,
                              }
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            {/* Main Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Back Button */}
        <Button
          component={Link}
          to="/blog"
          startIcon={<ArrowBack />}
          sx={{
            mb: 4,
            color: 'text.secondary',
            '&:hover': {
              color: 'primary.main',
              transform: 'translateX(-4px)',
            },
            transition: 'all 0.3s',
          }}
        >
          Back to Blog
        </Button>

        {/* Article Header */}
        <Box sx={{ mb: 6 }}>
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap" gap={1}>
              {article.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Title */}
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              lineHeight: 1.2,
              color: 'text.primary',
            }}
          >
            {article.title}
          </Typography>

          {/* Excerpt */}
          {article.excerpt && (
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                mb: 4,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {article.excerpt}
            </Typography>
          )}

          {/* Meta Info & Share */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            sx={{ 
              py: 3,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* Author & Date */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  width: 48, 
                  height: 48,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  fontWeight: 700,
                }}
              >
                V
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  Vaultora Team
                </Typography>
                <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(article.published_at)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {estimateReadTime(article.content)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>

            {/* Share Buttons */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Share on Twitter">
                <IconButton 
                  size="small"
                  onClick={() => handleShare('twitter')}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      borderColor: '#1DA1F2',
                      color: '#1DA1F2',
                      bgcolor: 'rgba(29, 161, 242, 0.1)',
                    }
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on LinkedIn">
                <IconButton 
                  size="small"
                  onClick={() => handleShare('linkedin')}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      borderColor: '#0A66C2',
                      color: '#0A66C2',
                      bgcolor: 'rgba(10, 102, 194, 0.1)',
                    }
                  }}
                >
                  <LinkedIn fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share on Facebook">
                <IconButton 
                  size="small"
                  onClick={() => handleShare('facebook')}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      borderColor: '#1877F2',
                      color: '#1877F2',
                      bgcolor: 'rgba(24, 119, 242, 0.1)',
                    }
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy Link">
                <IconButton 
                  size="small"
                  onClick={() => handleShare('copy')}
                  sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { 
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      bgcolor: 'primary.light',
                    }
                  }}
                >
                  <LinkIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Box>

        {/* Article Content - No Visible Borders */}
        <Box
          ref={contentRef}
          sx={{
            '& h2': {
              fontSize: { xs: '1.75rem', md: '2rem' },
              fontWeight: 700,
              mt: 6,
              mb: 3,
              color: 'text.primary',
              lineHeight: 1.3,
            },
            '& h3': {
              fontSize: { xs: '1.5rem', md: '1.75rem' },
              fontWeight: 600,
              mt: 5,
              mb: 2,
              color: 'text.primary',
            },
            '& p': {
              fontSize: '1.125rem',
              lineHeight: 1.8,
              mb: 3,
              color: 'text.secondary',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 3,
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              transition: 'box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              },
              // Support for aligned images
              '&[align="left"]': {
                float: 'left',
                marginRight: 3,
                marginLeft: 0,
                maxWidth: '45%',
              },
              '&[align="right"]': {
                float: 'right',
                marginLeft: 3,
                marginRight: 0,
                maxWidth: '45%',
              },
              // Support for width attribute
              '&[width]': {
                width: 'auto',
                maxWidth: '100%',
              }
            },
            '& figure': {
              margin: '2rem 0',
              clear: 'both',
              '& img': {
                width: '100%',
                borderRadius: 2,
                marginLeft: 0,
                marginRight: 0,
              },
              '& figcaption': {
                fontSize: '0.875rem',
                color: 'text.secondary',
                textAlign: 'center',
                mt: 1,
                fontStyle: 'italic',
              }
            },
            // Clear floats after paragraphs with floated images
            '& p:has(img[align])': {
              overflow: 'auto',
            },
            '& ul, & ol': {
              pl: 3,
              mb: 3,
              '& li': {
                fontSize: '1.125rem',
                lineHeight: 1.8,
                mb: 1,
                color: 'text.secondary',
              }
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'none',
              fontWeight: 500,
              '&:hover': {
                textDecoration: 'underline',
              }
            },
            '& code': {
              bgcolor: 'grey.100',
              color: 'primary.main',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              bgcolor: 'grey.900',
              color: 'grey.100',
              p: 3,
              borderRadius: 2,
              overflow: 'auto',
              my: 3,
              '& code': {
                bgcolor: 'transparent',
                color: 'inherit',
                p: 0,
              }
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 3,
              py: 1,
              my: 3,
              bgcolor: 'grey.50',
              fontStyle: 'italic',
              color: 'text.secondary',
            },
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Article Footer - CTA */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 6,
            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <BookmarkBorder sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h4" gutterBottom fontWeight={700}>
            Need Expert{' '}
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cybersecurity Help?
            </Box>
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Our team of certified security experts is ready to help protect your organization from evolving cyber threats. Get a free consultation today.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={Link}
              to="/#contact"
              variant="contained"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Get Free Consultation
            </Button>
            <Button
              component={Link}
              to="/#services"
              variant="outlined"
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              View Our Services
            </Button>
          </Stack>
        </Paper>

        {/* Related Topics */}
        {article.tags && article.tags.length > 0 && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Related Topics
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {article.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  component={Link}
                  to={`/blog?tag=${encodeURIComponent(tag)}`}
                  clickable
                  variant="outlined"
                  sx={{
                    '&:hover': {
                      bgcolor: 'primary.light',
                      borderColor: 'primary.main',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default BlogPost;
