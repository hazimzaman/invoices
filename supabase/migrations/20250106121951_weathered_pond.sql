-- Enable Storage 
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'logos' AND 
  auth.uid() = owner
);

CREATE POLICY "Authenticated users can update their logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.uid() = owner
)
WITH CHECK (
  bucket_id = 'logos' AND 
  auth.uid() = owner
);

CREATE POLICY "Anyone can view logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can delete their logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'logos' AND 
  auth.uid() = owner
);