import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Mail, Phone, Building, MessageSquare, Calendar, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const AdminContacts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate("/admin");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact submissions",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (contactId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact status updated successfully",
      });

      fetchContacts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact submission deleted successfully",
      });

      fetchContacts();
      setSelectedContact(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border border-amber-300';
      case 'completed': return 'bg-emerald-100 text-emerald-800 border border-emerald-300';
      case 'archived': return 'bg-slate-100 text-slate-700 border border-slate-300';
      default: return 'bg-slate-100 text-slate-700 border border-slate-300';
    }
  };

  const filteredContacts = statusFilter === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.status === statusFilter);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
                <p className="text-sm text-gray-500">Manage customer inquiries and submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Contacts List */}
            <div className="lg:col-span-2 space-y-4 min-h-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Contact Submissions ({filteredContacts.length})
                </h2>
              </div>

              {filteredContacts.length === 0 ? (
                <Card className="bg-white border-gray-200">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 mb-2 font-medium">No contact submissions found</p>
                    <p className="text-sm text-gray-500">
                      {statusFilter !== 'all' ? `No ${statusFilter} submissions` : 'Submissions will appear here when customers contact you'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <Card 
                      key={contact.id} 
                      className={`cursor-pointer transition-all duration-200 bg-white ${
                        selectedContact?.id === contact.id 
                          ? 'ring-2 ring-primary border-primary shadow-lg' 
                          : 'hover:shadow-md hover:border-primary/30 border-gray-200'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-gray-900 text-lg">{contact.name}</h3>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(contact.status)}`}>
                                {contact.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="text-gray-900 font-medium">{contact.email}</span>
                              </div>
                              {contact.company && (
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4 text-emerald-600" />
                                  <span className="text-gray-900 font-medium">{contact.company}</span>
                                </div>
                              )}
                              {contact.service && (
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-4 w-4 text-slate-600" />
                                  <span className="text-gray-800 font-medium">{contact.service}</span>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 line-clamp-2 mb-3 bg-slate-50 p-3 rounded-md border border-slate-200">
                              "{contact.message}"
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(contact.created_at).toLocaleDateString()} at {new Date(contact.created_at).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedContact(contact);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Details */}
            <div className="lg:col-span-1 lg:max-h-screen lg:overflow-hidden">
              {selectedContact ? (
                <Card className="sticky top-24 bg-white border-gray-200 shadow-sm">
                  <CardHeader className="border-b border-gray-100 pb-3">
                    <CardTitle className="flex items-center justify-between text-gray-900 text-lg">
                      Contact Details
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContact(selectedContact.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Name</label>
                      <p className="text-gray-900 text-sm mt-1">{selectedContact.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Email</label>
                      <p className="text-gray-900 text-sm mt-1">{selectedContact.email}</p>
                    </div>

                    {selectedContact.company && (
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Company</label>
                        <p className="text-gray-900 text-sm mt-1">{selectedContact.company}</p>
                      </div>
                    )}

                    {selectedContact.phone && (
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Phone</label>
                        <p className="text-gray-900 text-sm mt-1">{selectedContact.phone}</p>
                      </div>
                    )}

                    {selectedContact.service && (
                      <div>
                        <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Service</label>
                        <p className="text-gray-900 text-sm mt-1">{selectedContact.service}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Message</label>
                      <p className="text-gray-900 text-sm mt-1 whitespace-pre-wrap max-h-24 overflow-y-auto">{selectedContact.message}</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Status</label>
                      <select
                        value={selectedContact.status}
                        onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                        className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Submitted</label>
                      <p className="text-gray-900 text-xs mt-1">
                        {new Date(selectedContact.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: Your inquiry&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for contacting Vaultora Cyber Defense.%0D%0A%0D%0A`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      {selectedContact.phone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => window.open(`tel:${selectedContact.phone}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white border-gray-200">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-700 font-medium">Select a contact to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContacts;