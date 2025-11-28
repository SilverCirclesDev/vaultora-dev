import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user, isAdmin, loading, checkAdminRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user exists but we haven't checked admin role yet, check it now
    if (!loading && user && !isAdmin) {
      checkAdminRole();
    }
    
    // If user is admin, redirect to dashboard
    if (!loading && user && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, loading, navigate, checkAdminRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(email, password, fullName);
        // After signup, redirect to dashboard (they'll need to be made admin separately)
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      } else {
        await signIn(email, password);
        // Force redirect after successful login
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Shield className="h-16 w-16 text-primary mx-auto" />
          </div>
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-card border border-border rounded-xl p-8 shadow-2xl">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mb-4 shadow-lg">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Portal
            </h1>
            <p className="text-muted-foreground">Vaultora Cyber Defense</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className="bg-background"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vaultora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    alert("Please contact your system administrator to reset your password.");
                  }}
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full glow-primary text-lg py-6">
              {isSignUp ? "Create Account" : "Sign In to Dashboard"}
            </Button>

            <div className="text-center space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFullName("");
                  setPassword("");
                }}
                className="text-sm text-primary hover:underline block w-full font-medium"
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Need an account? Contact administrator"}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">
                  Secure Admin Access
                </p>
                <p className="text-xs text-muted-foreground">
                  This portal is protected by enterprise-grade security. All access attempts are logged and monitored for unauthorized activity.
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Contact{" "}
              <a href="mailto:support@vaultora.com" className="text-primary hover:underline">
                support@vaultora.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
