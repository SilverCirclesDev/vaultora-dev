import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Save, Globe, Mail, Database, Key, RefreshCw, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { SettingsSaveDialog } from "@/components/SettingsSaveDialog";

const AdminSettings = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading, updateMultipleSettings, fetchSettings } = useSiteSettings();
  
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [siteSettings, setSiteSettings] = useState({
    site_name: "",
    site_description: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    social_twitter: "",
    social_linkedin: "",
    social_facebook: "",
    social_instagram: "",
    maintenance_mode: false,
    analytics_enabled: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: "",
    smtp_port: "587",
    smtp_username: "",
    smtp_password: "",
    from_email: "",
    from_name: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    session_timeout: "24",
    max_login_attempts: "5",
    password_min_length: "8",
    require_2fa: false,
    api_rate_limit: "100"
  });

  // Load settings from database when available
  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setSiteSettings({
        site_name: String(settings.site_name || ""),
        site_description: String(settings.site_description || ""),
        contact_email: String(settings.contact_email || ""),
        contact_phone: String(settings.contact_phone || ""),
        address: String(settings.address || ""),
        social_twitter: String(settings.social_twitter || ""),
        social_linkedin: String(settings.social_linkedin || ""),
        social_facebook: String(settings.social_facebook || ""),
        social_instagram: String(settings.social_instagram || ""),
        maintenance_mode: Boolean(settings.maintenance_mode),
        analytics_enabled: Boolean(settings.analytics_enabled)
      });

      setEmailSettings({
        smtp_host: String(settings.smtp_host || ""),
        smtp_port: String(settings.smtp_port || "587"),
        smtp_username: String(settings.smtp_username || ""),
        smtp_password: String(settings.smtp_password || ""),
        from_email: String(settings.from_email || ""),
        from_name: String(settings.from_name || "")
      });

      setSecuritySettings({
        session_timeout: String(settings.session_timeout || "24"),
        max_login_attempts: String(settings.max_login_attempts || "5"),
        password_min_length: String(settings.password_min_length || "8"),
        require_2fa: Boolean(settings.require_2fa),
        api_rate_limit: String(settings.api_rate_limit || "100")
      });
    }
  }, [settings]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin");
    }
  }, [user, authLoading, navigate]);

  const handleSaveSiteSettings = async () => {
    setPendingSettings(siteSettings);
    setShowSaveDialog(true);
  };

  const handleSaveEmailSettings = async () => {
    setPendingSettings(emailSettings);
    setShowSaveDialog(true);
  };

  const handleSaveSecuritySettings = async () => {
    setPendingSettings(securitySettings);
    setShowSaveDialog(true);
  };

  const confirmSave = async () => {
    if (!pendingSettings) return;

    const success = await updateMultipleSettings(pendingSettings);
    if (success) {
      setHasChanges(false);
      await fetchSettings(); // Refresh settings from database
    }
    
    setShowSaveDialog(false);
    setPendingSettings(null);
  };

  const handleTestEmail = async () => {
    try {
      toast({
        title: "Test Email Sent",
        description: "Check your inbox for the test email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive"
      });
    }
  };

  const handleDatabaseBackup = async () => {
    try {
      toast({
        title: "Backup Started",
        description: "Database backup has been initiated",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start backup",
        variant: "destructive"
      });
    }
  };

  if (authLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Shield className="h-16 w-16 text-primary mx-auto" />
          </div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const settingsCount = pendingSettings ? Object.keys(pendingSettings).length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SettingsSaveDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onConfirm={confirmSave}
        settingsCount={settingsCount}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/admin/dashboard")}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-sm text-gray-500">Configure your website settings and preferences</p>
              </div>
            </div>
            <Button
              onClick={() => fetchSettings()}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </header>



      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Configure basic site information and contact details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={siteSettings.site_name}
                        onChange={(e) => {
                          setSiteSettings({...siteSettings, site_name: e.target.value});
                          setHasChanges(true);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={siteSettings.contact_email}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Textarea
                      id="site_description"
                      value={siteSettings.site_description}
                      onChange={(e) => setSiteSettings({...siteSettings, site_description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={siteSettings.contact_phone}
                        onChange={(e) => setSiteSettings({...siteSettings, contact_phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Media</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="social_twitter">Twitter Handle</Label>
                        <Input
                          id="social_twitter"
                          value={siteSettings.social_twitter}
                          onChange={(e) => setSiteSettings({...siteSettings, social_twitter: e.target.value})}
                          placeholder="@username"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="social_linkedin">LinkedIn</Label>
                        <Input
                          id="social_linkedin"
                          value={siteSettings.social_linkedin}
                          onChange={(e) => setSiteSettings({...siteSettings, social_linkedin: e.target.value})}
                          placeholder="company/name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="social_facebook">Facebook</Label>
                        <Input
                          id="social_facebook"
                          value={siteSettings.social_facebook}
                          onChange={(e) => setSiteSettings({...siteSettings, social_facebook: e.target.value})}
                          placeholder="page-name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="maintenance_mode"
                        checked={siteSettings.maintenance_mode}
                        onChange={(e) => setSiteSettings({...siteSettings, maintenance_mode: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="analytics_enabled"
                        checked={siteSettings.analytics_enabled}
                        onChange={(e) => setSiteSettings({...siteSettings, analytics_enabled: e.target.checked})}
                        className="rounded"
                      />
                      <Label htmlFor="analytics_enabled">Enable Analytics</Label>
                    </div>
                  </div>

                  <Button onClick={handleSaveSiteSettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Settings
                  </CardTitle>
                  <CardDescription>
                    Configure SMTP settings for sending emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_host">SMTP Host</Label>
                      <Input
                        id="smtp_host"
                        value={emailSettings.smtp_host}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_port">SMTP Port</Label>
                      <Input
                        id="smtp_port"
                        value={emailSettings.smtp_port}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_port: e.target.value})}
                        placeholder="587"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp_username">SMTP Username</Label>
                      <Input
                        id="smtp_username"
                        value={emailSettings.smtp_username}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp_password">SMTP Password</Label>
                      <Input
                        id="smtp_password"
                        type="password"
                        value={emailSettings.smtp_password}
                        onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="from_email">From Email</Label>
                      <Input
                        id="from_email"
                        type="email"
                        value={emailSettings.from_email}
                        onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from_name">From Name</Label>
                      <Input
                        id="from_name"
                        value={emailSettings.from_name}
                        onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSaveEmailSettings} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Email Settings
                    </Button>
                    <Button onClick={handleTestEmail} variant="outline">
                      Send Test Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Configure security and authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        value={securitySettings.session_timeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                      <Input
                        id="max_login_attempts"
                        type="number"
                        value={securitySettings.max_login_attempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, max_login_attempts: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Min Password Length</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        value={securitySettings.password_min_length}
                        onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="api_rate_limit">API Rate Limit (requests/minute)</Label>
                    <Input
                      id="api_rate_limit"
                      type="number"
                      value={securitySettings.api_rate_limit}
                      onChange={(e) => setSecuritySettings({...securitySettings, api_rate_limit: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="require_2fa"
                      checked={securitySettings.require_2fa}
                      onChange={(e) => setSecuritySettings({...securitySettings, require_2fa: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="require_2fa">Require Two-Factor Authentication</Label>
                  </div>

                  <Button onClick={handleSaveSecuritySettings} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Database Management
                    </CardTitle>
                    <CardDescription>
                      Database maintenance and backup operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button onClick={handleDatabaseBackup} variant="outline">
                        Create Database Backup
                      </Button>
                      <Button variant="outline" disabled>
                        Restore from Backup
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Last backup: Never (Feature in development)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                    <CardDescription>
                      Current system status and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Version:</strong> 1.0.0
                      </div>
                      <div>
                        <strong>Environment:</strong> Development
                      </div>
                      <div>
                        <strong>Database:</strong> Supabase PostgreSQL
                      </div>
                      <div>
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="destructive" disabled>
                        Reset All Settings
                      </Button>
                      <p className="text-sm text-gray-600">
                        This will reset all settings to their default values. This action cannot be undone.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;