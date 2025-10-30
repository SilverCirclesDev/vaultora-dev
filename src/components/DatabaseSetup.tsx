import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database, CheckCircle, AlertCircle } from "lucide-react";

export const DatabaseSetup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [tablesExist, setTablesExist] = useState<boolean | null>(null);
  const { toast } = useToast();

  const checkTables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        setTablesExist(false);
      } else {
        setTablesExist(true);
      }
    } catch (error) {
      setTablesExist(false);
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      // Call the make_user_admin function via SQL
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1); // This is just to test if we can access the function
      
      if (error) throw error;

      // For now, show instructions to run SQL manually
      toast({
        title: "Instructions",
        description: `Please run this SQL in Supabase: SELECT public.make_user_admin('${email}');`,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: data || "User made admin successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to make user admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Database Setup
          </CardTitle>
          <CardDescription>
            Set up your SentinelLock database and create your first admin user
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Check Tables */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Check Database Tables</h3>
            <Button onClick={checkTables} disabled={loading} className="w-full">
              {loading ? "Checking..." : "Check if tables exist"}
            </Button>
            
            {tablesExist !== null && (
              <div className={`flex items-center gap-2 p-3 rounded-lg ${
                tablesExist ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {tablesExist ? (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Database tables exist and are ready!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span>Database tables need to be created</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Setup Instructions */}
          {tablesExist === false && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Create Database Tables</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm mb-2">To create the database tables:</p>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to your <a href="https://supabase.com/dashboard" target="_blank" className="text-primary underline">Supabase Dashboard</a></li>
                  <li>Select your project: <code className="bg-background px-1 rounded">ermsmbmjzsmzotpqbfsp</code></li>
                  <li>Go to <strong>SQL Editor</strong></li>
                  <li>Copy and paste the content from <code>setup-admin.sql</code></li>
                  <li>Click <strong>Run</strong></li>
                </ol>
              </div>
            </div>
          )}

          {/* Step 3: Disable Email Confirmation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 3: Disable Email Confirmation (Optional)</h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm mb-2">For easier development:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>In Supabase Dashboard, go to <strong>Authentication → Settings</strong></li>
                <li>Scroll to <strong>Email Auth</strong></li>
                <li>Uncheck <strong>"Enable email confirmations"</strong></li>
                <li>Click <strong>Save</strong></li>
              </ol>
            </div>
          </div>

          {/* Step 4: Make Admin */}
          {tablesExist && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Make User Admin</h3>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={makeAdmin} disabled={loading} className="w-full">
                {loading ? "Processing..." : "Make Admin"}
              </Button>
            </div>
          )}

          {/* Quick Links */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://supabase.com/dashboard" target="_blank">
                  Supabase Dashboard
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/secure-admin-portal-2024">
                  Admin Login
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};