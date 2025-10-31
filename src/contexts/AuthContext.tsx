import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  checkAdminRole: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkAdminRole = async (userId?: string) => {
    const userIdToCheck = userId || user?.id;
    if (!userIdToCheck) {
      setIsAdmin(false);
      return;
    }

    try {
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Admin role check timeout')), 5000);
      });
      
      const rolePromise = supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userIdToCheck)
        .eq("role", "admin")
        .maybeSingle();

      const { data, error } = await Promise.race([rolePromise, timeoutPromise]) as any;

      if (error) throw error;
      
      const hasAdminRole = !!data;
      setIsAdmin(hasAdminRole);
    } catch (error) {
      // For development, allow bypass if there's a connection issue
      const isDev = import.meta.env.DEV;
      if (isDev && error.message?.includes('timeout')) {
        setIsAdmin(true); // Allow admin access in dev mode when there are connection issues
      } else {
        setIsAdmin(false);
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Don't check admin role automatically - only when needed
        if (!session?.user) {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session with timeout
    const sessionTimeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(sessionTimeout);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Don't check admin role automatically - only when accessing admin routes
      if (!session?.user) {
        setIsAdmin(false);
      }
      
      setLoading(false);
    }).catch((error) => {
      clearTimeout(sessionTimeout);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email Not Confirmed",
            description: "Please check your email and click the confirmation link, or contact support if you need help.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Account Created",
          description: "Please check your email for a confirmation link. If email confirmation is disabled, you can log in immediately.",
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading, checkAdminRole, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
