import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LocalSubmission {
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  status: string;
}

const LocalSubmissions = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<LocalSubmission[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    loadLocalSubmissions();
  }, []);

  const loadLocalSubmissions = () => {
    const stored = localStorage.getItem('pendingContactSubmissions');
    if (stored) {
      setSubmissions(JSON.parse(stored));
    }
  };

  const retrySubmissions = async () => {
    if (submissions.length === 0) return;

    setIsRetrying(true);
    let successCount = 0;
    let failedSubmissions: LocalSubmission[] = [];

    for (const submission of submissions) {
      try {
        const { error } = await supabase
          .from('contact_submissions')
          .insert([{
            name: submission.name,
            email: submission.email,
            company: submission.company || null,
            phone: submission.phone || null,
            service: submission.service || null,
            message: submission.message,
            status: 'new'
          }]);

        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error('Failed to retry submission:', error);
        failedSubmissions.push(submission);
      }
    }

    // Update local storage with only failed submissions
    localStorage.setItem('pendingContactSubmissions', JSON.stringify(failedSubmissions));
    setSubmissions(failedSubmissions);

    toast({
      title: `Retry Complete`,
      description: `${successCount} submissions sent successfully. ${failedSubmissions.length} still pending.`,
      variant: successCount > 0 ? "default" : "destructive"
    });

    setIsRetrying(false);
  };

  const clearSubmissions = () => {
    localStorage.removeItem('pendingContactSubmissions');
    setSubmissions([]);
    toast({
      title: "Cleared",
      description: "Local submissions cleared",
    });
  };

  if (submissions.length === 0) {
    return null;
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="text-yellow-800">
          Pending Contact Submissions ({submissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-yellow-700 mb-4">
          These contact form submissions were stored locally due to connection issues.
        </p>

        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
          {submissions.map((submission, index) => (
            <div key={index} className="text-xs bg-white p-2 rounded border">
              <strong>{submission.name}</strong> ({submission.email})
              <br />
              <span className="text-gray-500">
                {new Date(submission.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={retrySubmissions}
            disabled={isRetrying}
            size="sm"
          >
            {isRetrying ? "Retrying..." : "Retry Sending"}
          </Button>
          <Button
            onClick={clearSubmissions}
            variant="outline"
            size="sm"
          >
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalSubmissions;