import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnqriusbnzozimeiahyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRucXJpdXNibnpvemltZWlhaHlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjkwMTgsImV4cCI6MjA3Njc0NTAxOH0.oENUbwdLDtLaPC52JrUFShvPAi79BqG4Qs9pQJVtKzI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at?: string;
  updated_at?: string;
}

export async function submitContactForm(data: Omit<ContactSubmission, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('contact_submissions')
    .insert([data])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return result;
}