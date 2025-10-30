import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TestDatabase = () => {
  const [status, setStatus] = useState("Testing...");
  const [tables, setTables] = useState<string[]>([]);
  const [envVars, setEnvVars] = useState<any>({});

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ? 'Present' : 'Missing',
      VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    });
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (testError) {
        setStatus(`Connection Error: ${testError.message}`);
        return;
      }

      // Test blog_posts table
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('id, title, published')
        .limit(5);

      if (blogError) {
        setStatus(`Blog Posts Error: ${blogError.message}`);
        return;
      }

      // Test other tables
      const tableTests = [
        'pricing_plans',
        'services', 
        'testimonials',
        'contact_submissions'
      ];

      const tableResults = [];
      for (const table of tableTests) {
        try {
          const { data, error } = await supabase
            .from(table as any)
            .select('id')
            .limit(1);
          
          if (error) {
            tableResults.push(`${table}: ERROR - ${error.message}`);
          } else {
            tableResults.push(`${table}: OK (${data?.length || 0} records)`);
          }
        } catch (err) {
          tableResults.push(`${table}: FAILED`);
        }
      }

      setTables(tableResults);
      setStatus(`Connection OK! Blog posts found: ${blogData?.length || 0}`);

    } catch (error: any) {
      setStatus(`Failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>VITE_SUPABASE_URL: {envVars.VITE_SUPABASE_URL || 'Missing'}</div>
            <div>VITE_SUPABASE_PUBLISHABLE_KEY: {envVars.VITE_SUPABASE_PUBLISHABLE_KEY}</div>
            <div>VITE_SUPABASE_PROJECT_ID: {envVars.VITE_SUPABASE_PROJECT_ID || 'Missing'}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className={`text-lg ${status.includes('OK') ? 'text-green-600' : 'text-red-600'}`}>
            {status}
          </p>
        </div>

        {tables.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Table Status</h2>
            <div className="space-y-2">
              {tables.map((table, index) => (
                <div key={index} className={`p-2 rounded ${
                  table.includes('ERROR') || table.includes('FAILED') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}>
                  {table}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <button 
            onClick={testConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestDatabase;