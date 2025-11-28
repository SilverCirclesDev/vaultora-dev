import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SITE_URL = process.env.VITE_SITE_URL || 'https://vaultora.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

async function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let blogPosts: any[] = [];
  
  // Only fetch blog posts if Supabase credentials are available
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) {
        console.warn('⚠️  Could not fetch blog posts from Supabase:', error.message);
      } else {
        blogPosts = data || [];
      }
    } catch (err) {
      console.warn('⚠️  Supabase connection failed, generating sitemap without blog posts');
    }
  } else {
    console.warn('⚠️  Supabase credentials not found, generating sitemap without blog posts');
  }

  // Build sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Pricing Page -->
  <url>
    <loc>${SITE_URL}/pricing</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog -->
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Service Pages (Virtual URLs for SEO) -->
  <url>
    <loc>${SITE_URL}/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${SITE_URL}/#contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

  // Add blog posts
  if (blogPosts && blogPosts.length > 0) {
    sitemap += '\n  <!-- Blog Posts -->\n';
    blogPosts.forEach((post) => {
      const lastmod = post.updated_at || post.published_at || currentDate;
      const formattedDate = new Date(lastmod).toISOString().split('T')[0];
      
      sitemap += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${formattedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
    });
  }

  sitemap += '\n</urlset>';

  // Write sitemap to public directory
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  
  console.log(`✅ Sitemap generated successfully with ${blogPosts?.length || 0} blog posts`);
  console.log(`📍 Location: ${sitemapPath}`);
}

generateSitemap().catch(console.error);
