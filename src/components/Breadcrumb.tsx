import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

export const Breadcrumb = ({ items, currentPage }: BreadcrumbProps) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs from URL if not provided
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);
  const current = currentPage || breadcrumbItems[breadcrumbItems.length - 1]?.label;

  useEffect(() => {
    // Add Breadcrumb Schema to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    
    const itemListElement = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${window.location.origin}/`
      },
      ...breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": item.label,
        "item": `${window.location.origin}${item.path}`
      }))
    ];

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": itemListElement
    });

    // Remove existing breadcrumb schema if present
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
      document.head.removeChild(existing);
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById('breadcrumb-schema');
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, [breadcrumbItems]);

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
        <li className="flex items-center gap-2">
          <Link 
            to="/" 
            className="hover:text-primary transition-colors flex items-center gap-1"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4" />
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center gap-2">
            {index < breadcrumbItems.length - 1 ? (
              <>
                <Link 
                  to={item.path} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {current}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  const pathMap: Record<string, string> = {
    'blog': 'Blog',
    'pricing': 'Pricing',
    'admin': 'Admin',
    'dashboard': 'Dashboard',
    'contacts': 'Contacts',
    'services': 'Services',
    'testimonials': 'Testimonials',
    'users': 'Users',
    'settings': 'Settings',
    'analytics': 'Analytics'
  };

  let currentPath = '';
  paths.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    // Skip the last segment as it will be shown as current page
    if (index < paths.length - 1) {
      breadcrumbs.push({
        label: pathMap[segment] || capitalize(segment),
        path: currentPath
      });
    }
  });

  return breadcrumbs;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
