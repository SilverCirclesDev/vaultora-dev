import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            {isAdminRoute 
              ? "The admin page you're looking for doesn't exist or you don't have permission to access it."
              : "The page you're looking for doesn't exist or has been moved."
            }
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button 
            onClick={() => navigate(isAdminRoute ? "/admin" : "/")}
            className="w-full"
          >
            <Home className="h-4 w-4 mr-2" />
            {isAdminRoute ? "Admin Login" : "Return Home"}
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 404</p>
          <p>Path: {location.pathname}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
