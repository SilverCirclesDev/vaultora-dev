import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, Users, MessageSquare, LogOut, BarChart } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <Shield className="h-16 w-16 text-primary" />
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: "0",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      label: "Live Chats",
      value: "0",
      color: "text-secondary"
    },
    {
      icon: BarChart,
      label: "Services Sold",
      value: "0",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">SentinelLock Cyber Defense</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your cybersecurity services today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => {
                if ((window as any).LiveChatWidget) {
                  (window as any).LiveChatWidget.call('maximize');
                }
              }}
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <MessageSquare className="h-6 w-6" />
              Open Live Chat
            </Button>
            <Button
              onClick={() => navigate("/services")}
              variant="outline"
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <BarChart className="h-6 w-6" />
              View Services
            </Button>
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <Shield className="h-6 w-6" />
              Manage Blog
            </Button>
            <Button
              onClick={() => navigate("/pricing")}
              variant="outline"
              className="w-full h-auto py-6 flex-col gap-2"
            >
              <Users className="h-6 w-6" />
              View Pricing
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="text-center py-8 text-muted-foreground">
            <p>No recent activity to display</p>
            <p className="text-sm mt-2">Activity will appear here as users interact with your services</p>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-2">Admin Features</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>✅ Secure role-based authentication</li>
            <li>✅ Live chat integration with my.livechatinc.com</li>
            <li>✅ User management and analytics</li>
            <li>✅ Service and pricing management</li>
            <li>🔒 All data protected with Row-Level Security (RLS)</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
