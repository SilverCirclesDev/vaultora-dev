import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Users, 
  MessageSquare, 
  LogOut, 
  BarChart, 
  FileText, 
  Settings, 
  Mail, 
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Trash2,
  Star,
  Globe,
  DollarSign,
  Calendar,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalUsers: 0,
    blogPosts: 0,
    contactSubmissions: 0,
    newsletterSubscribers: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentActivity();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get blog posts count
      const { count: blogCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Get contact submissions count
      const { count: contactCount } = await supabase
        .from('contact_submissions')
        .select('*', { count: 'exact', head: true });

      // Get newsletter subscribers count
      const { count: newsletterCount } = await supabase
        .from('newsletter_subscriptions')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalUsers: userCount || 0,
        blogPosts: blogCount || 0,
        contactSubmissions: contactCount || 0,
        newsletterSubscribers: newsletterCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Get recent blog posts
      const { data: recentPosts } = await supabase
        .from('blog_posts')
        .select('title, created_at, published')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get recent contact submissions
      const { data: recentContacts } = await supabase
        .from('contact_submissions')
        .select('name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const activity = [
        ...(recentPosts || []).map(post => ({
          type: 'blog',
          title: `Blog post: ${post.title}`,
          time: post.created_at,
          status: post.published ? 'published' : 'draft'
        })),
        ...(recentContacts || []).map(contact => ({
          type: 'contact',
          title: `New contact from ${contact.name}`,
          time: contact.created_at,
          status: 'new'
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

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

  if (!user) {
    return null;
  }

  const dashboardStats = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers.toString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: null,
      changeType: null
    },
    {
      icon: FileText,
      label: "Blog Posts",
      value: stats.blogPosts.toString(),
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: null,
      changeType: null
    },
    {
      icon: MessageSquare,
      label: "Contact Submissions",
      value: stats.contactSubmissions.toString(),
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: null,
      changeType: null
    },
    {
      icon: Mail,
      label: "Newsletter Subscribers",
      value: stats.newsletterSubscribers.toString(),
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: null,
      changeType: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SentinelLock CMS</h1>
                <p className="text-sm text-gray-500">Professional Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                size="sm"
              >
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user.email?.split('@')[0]}
            </h2>
            <p className="text-gray-600">
              Manage your cybersecurity website content and monitor performance.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-500">
                        Total count
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => navigate("/admin/blog")}
                        className="h-20 flex-col gap-2"
                        variant="outline"
                      >
                        <Plus className="h-6 w-6" />
                        New Blog Post
                      </Button>
                      <Button
                        onClick={() => {
                          if ((window as any).LiveChatWidget) {
                            (window as any).LiveChatWidget.call('maximize');
                          }
                        }}
                        className="h-20 flex-col gap-2"
                        variant="outline"
                      >
                        <MessageSquare className="h-6 w-6" />
                        Live Chat
                      </Button>
                      <Button
                        onClick={() => navigate("/admin/pricing")}
                        className="h-20 flex-col gap-2"
                        variant="outline"
                      >
                        <DollarSign className="h-6 w-6" />
                        Manage Pricing
                      </Button>
                      <Button
                        onClick={() => navigate("/")}
                        className="h-20 flex-col gap-2"
                        variant="outline"
                      >
                        <Globe className="h-6 w-6" />
                        View Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`p-2 rounded-full ${
                              activity.type === 'blog' ? 'bg-blue-100' : 'bg-green-100'
                            }`}>
                              {activity.type === 'blog' ? (
                                <FileText className="h-4 w-4 text-blue-600" />
                              ) : (
                                <MessageSquare className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.time).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              activity.status === 'published' ? 'bg-green-100 text-green-800' :
                              activity.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {activity.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No recent activity</p>
                          <p className="text-sm">Activity will appear here as you manage content</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Management Tab */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Content Management</CardTitle>
                  <CardDescription>Manage your website content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Button
                      onClick={() => navigate("/admin/blog")}
                      className="h-32 flex-col gap-4"
                      variant="outline"
                    >
                      <FileText className="h-8 w-8" />
                      <div className="text-center">
                        <p className="font-semibold">Blog Posts</p>
                        <p className="text-sm text-muted-foreground">{stats.blogPosts} posts</p>
                      </div>
                    </Button>
                    <Button
                      onClick={() => navigate("/admin/pricing")}
                      className="h-32 flex-col gap-4"
                      variant="outline"
                    >
                      <DollarSign className="h-8 w-8" />
                      <div className="text-center">
                        <p className="font-semibold">Pricing Plans</p>
                        <p className="text-sm text-muted-foreground">Manage pricing</p>
                      </div>
                    </Button>
                    <Button
                      onClick={() => navigate("/admin/testimonials")}
                      className="h-32 flex-col gap-4"
                      variant="outline"
                    >
                      <Star className="h-8 w-8" />
                      <div className="text-center">
                        <p className="font-semibold">Testimonials</p>
                        <p className="text-sm text-muted-foreground">Customer reviews</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Management</CardTitle>
                  <CardDescription>View and manage customer inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Contact Management</h3>
                    <p className="text-gray-600 mb-4">
                      Contact submissions: {stats.contactSubmissions}
                    </p>
                    <Button onClick={() => navigate("/admin/contacts")}>
                      View All Contacts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle>Services Management</CardTitle>
                  <CardDescription>Manage your cybersecurity services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Services Management</h3>
                    <p className="text-gray-600 mb-4">
                      Manage your service offerings and pricing
                    </p>
                    <Button onClick={() => navigate("/admin/services")}>
                      Manage Services
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>Track your website performance and user engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                        <p className="text-sm text-blue-600">Total Users</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{stats.blogPosts}</p>
                        <p className="text-sm text-green-600">Blog Posts</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">{stats.contactSubmissions}</p>
                        <p className="text-sm text-orange-600">Contacts</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{stats.newsletterSubscribers}</p>
                        <p className="text-sm text-purple-600">Subscribers</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <Button onClick={() => navigate("/admin/analytics")} className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        View Detailed Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>Configure your CMS settings and manage users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User Management
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">Manage admin users and permissions</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate("/admin/users")}
                        >
                          Manage Users
                        </Button>
                      </div>
                      <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          Site Configuration
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">Configure site settings and preferences</p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate("/admin/settings")}
                        >
                          Site Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
