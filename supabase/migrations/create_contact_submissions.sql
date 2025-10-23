-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert contact submissions
CREATE POLICY "Allow anonymous contact submissions" ON contact_submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated users to view their own submissions
CREATE POLICY "Users can view own submissions" ON contact_submissions
  FOR SELECT TO authenticated
  USING (true);

-- Grant permissions to anon role for inserting
GRANT INSERT ON contact_submissions TO anon;

-- Grant permissions to authenticated role for selecting
GRANT SELECT ON contact_submissions TO authenticated;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);