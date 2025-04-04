-- Create admin_credentials table
CREATE TABLE admin_credentials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default admin password (you should change this in production)
INSERT INTO admin_credentials (password) VALUES ('your-secure-password-here');

-- Enable Row Level Security
ALTER TABLE admin_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only authenticated users to read
CREATE POLICY "Allow authenticated users to read admin_credentials"
  ON admin_credentials
  FOR SELECT
  TO authenticated
  USING (true); 