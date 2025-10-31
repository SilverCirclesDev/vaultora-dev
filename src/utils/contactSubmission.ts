import { supabase } from "@/integrations/supabase/client";

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  const insertData = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    company: formData.company?.trim() || null,
    phone: formData.phone?.trim() || null,
    service: formData.service?.trim() || null,
    message: formData.message.trim(),
    status: 'new'
  };

  // Try multiple approaches
  const approaches = [
    // Approach 1: Simple insert without select
    async () => {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([insertData]);
      
      if (error) throw error;
      return { success: true, method: 'simple_insert' };
    },
    
    // Approach 2: Insert with select
    async () => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([insertData])
        .select();
      
      if (error) throw error;
      return { success: true, data, method: 'insert_select' };
    }
  ];

  // Try each approach with timeout
  for (let i = 0; i < approaches.length; i++) {
    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Approach ${i + 1} timeout`)), 8000);
      });
      
      const result = await Promise.race([approaches[i](), timeoutPromise]);
      return result;
      
    } catch (error: any) {
      if (i === approaches.length - 1) {
        // Last approach failed, throw the error
        throw error;
      }
      // Continue to next approach
    }
  }
  
  throw new Error('All submission approaches failed');
};