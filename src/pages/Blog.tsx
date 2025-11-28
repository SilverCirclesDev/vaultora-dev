import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  TextField, 
  InputAdornment,
  Stack,
  Button,
  Skeleton,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Search as SearchIcon, 
  CalendarToday, 
  AccessTime, 
  ArrowForward,
  FilterList,
  TrendingUp
} from '@mui/icons-material';

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
  const [filteredArticles, setFilteredArticles] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedTag]);

  const filterArticles = () => {
    let filtered = [...articles];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(article =>
        article.tags?.includes(selectedTag)
      );
    }

    setFilteredArticles(filtered);
  };

  const getAllTags = () => {
    const tagsSet = new Set<string>();
    articles.forEach(article => {
      article.tags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet);
  };

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

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles;
  const allTags = getAllTags();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      
      <Container 
        maxWidth="lg" 
        component="main" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          pt: 16, 
          pb: 10,
          gap: 6
        }}
      >
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              fontWeight: 700,
              mb: 2
            }}
          >
            Cybersecurity{' '}
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Insights & News
            </Box>
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}
          >
            Stay informed with the latest cybersecurity trends, best practices, and threat intelligence from industry experts.
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ minWidth: { xs: '100%', md: '150px' } }}
            >
              Filter
            </Button>
          </Stack>

          {/* Tags */}
          {allTags.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              <Chip
                label="All"
                onClick={() => setSelectedTag(null)}
                color={selectedTag === null ? 'primary' : 'default'}
                sx={{ cursor: 'pointer' }}
              />
              {allTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  color={selectedTag === tag ? 'primary' : 'default'}
                  variant={selectedTag === tag ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Stack>
          )}

          {/* Results count */}
          {searchQuery && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Found {displayArticles.length} article{displayArticles.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Featured Article */}
        {loading ? (
          <Card sx={{ mb: 6 }}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Skeleton variant="rectangular" height={400} />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Skeleton width={100} height={32} sx={{ mb: 2 }} />
                  <Skeleton width="100%" height={40} sx={{ mb: 2 }} />
                  <Skeleton width="100%" height={60} sx={{ mb: 3 }} />
                  <Skeleton width={200} height={24} />
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ) : displayArticles.length > 0 && !searchQuery && !selectedTag ? (
          <Card 
            sx={{ 
              mb: 6,
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-4px)',
              }
            }}
          >
            <Grid container>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="400"
                  image={displayArticles[0].featured_image_url || getDefaultImage(0)}
                  alt={displayArticles[0].title}
                  sx={{ height: { xs: 250, md: 400 }, objectFit: 'cover' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Chip 
                    icon={<TrendingUp />}
                    label="Featured" 
                    color="primary" 
                    size="small"
                    sx={{ mb: 2, width: 'fit-content' }}
                  />
                  <Typography 
                    component={Link}
                    to={`/blog/${displayArticles[0].id}`}
                    variant="h3" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: 'text.primary',
                      cursor: 'pointer',
                      transition: 'color 0.3s',
                      display: 'block',
                      '&:hover': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {displayArticles[0].title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {displayArticles[0].excerpt}
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(displayArticles[0].published_at)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {estimateReadTime(displayArticles[0].content)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Button
                    component={Link}
                    to={`/blog/${displayArticles[0].id}`}
                    variant="contained"
                    endIcon={<ArrowForward />}
                    size="large"
                    sx={{ width: 'fit-content' }}
                  >
                    Read Full Article
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ) : null}

        {/* Articles Grid */}
        <Box>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
            {searchQuery || selectedTag ? 'Search Results' : 'Latest Articles'}
          </Typography>
          
          {loading ? (
            <Grid container spacing={4}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton width={80} height={24} sx={{ mb: 2 }} />
                      <Skeleton width="100%" height={32} sx={{ mb: 1 }} />
                      <Skeleton width="100%" height={60} sx={{ mb: 2 }} />
                      <Skeleton width={150} height={20} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : displayArticles.length > 0 ? (
            <Grid container spacing={4}>
              {(searchQuery || selectedTag ? displayArticles : displayArticles.slice(1)).map((article, index) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                      }
                    }}
                  >
                    <CardMedia
                      component={Link}
                      to={`/blog/${article.id}`}
                      sx={{
                        height: 200,
                        backgroundImage: `url(${article.featured_image_url || getDefaultImage(index + 1)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {article.tags && article.tags.length > 0 && (
                        <Chip 
                          label={article.tags[0]} 
                          size="small" 
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 2, width: 'fit-content' }}
                        />
                      )}
                      <Typography 
                        component={Link}
                        to={`/blog/${article.id}`}
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'text.primary',
                          cursor: 'pointer',
                          transition: 'color 0.3s',
                          '&:hover': {
                            color: 'primary.main',
                          }
                        }}
                      >
                        {article.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph
                        sx={{ 
                          flexGrow: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {article.excerpt}
                      </Typography>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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
                      <Button
                        component={Link}
                        to={`/blog/${article.id}`}
                        variant="text"
                        endIcon={<ArrowForward />}
                        sx={{ width: 'fit-content', p: 0 }}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No articles found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery ? 'Try adjusting your search terms' : 'Check back soon for cybersecurity insights and updates!'}
              </Typography>
              {(searchQuery || selectedTag) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                  }}
                  sx={{ mt: 2 }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          )}
        </Box>

        {/* Newsletter CTA */}
        <Box 
          sx={{ 
            mt: 8,
            p: 6,
            background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
            borderRadius: 4,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Stay Updated
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Subscribe to our newsletter for weekly cybersecurity insights and updates
          </Typography>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            <TextField
              fullWidth
              placeholder="Your email address"
              type="email"
              sx={{ bgcolor: 'white' }}
            />
            <Button 
              variant="contained" 
              size="large"
              sx={{ minWidth: { xs: '100%', sm: 150 } }}
            >
              Subscribe
            </Button>
          </Stack>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Blog;
