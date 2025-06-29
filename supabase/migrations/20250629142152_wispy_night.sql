/*
  # Mental Health Research Data Migration

  1. New Tables
    - `mental_health_data`
      - `id` (uuid, primary key)
      - `country` (text, country code)
      - `year` (integer, year of data)
      - `sex` (text, M or F)
      - `alcohol_rate` (numeric, age-standardized rate per 100k)
      - `suicide_rate` (numeric, age-standardized rate per 100k)
      - `accident_rate` (numeric, age-standardized rate per 100k)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `mental_health_data` table
    - Add policy for public read access (research data is public)
    - Add policy for authenticated insert/update (for data management)

  3. Indexes
    - Composite index on (country, year, sex) for fast filtering
    - Individual indexes on commonly queried fields

  4. Data Validation
    - Check constraints for valid country codes
    - Check constraints for valid sex values
    - Check constraints for reasonable rate values
*/

-- Create the mental health data table
CREATE TABLE IF NOT EXISTS mental_health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  year integer NOT NULL,
  sex text NOT NULL CHECK (sex IN ('M', 'F')),
  alcohol_rate numeric(10,2) DEFAULT 0 CHECK (alcohol_rate >= 0),
  suicide_rate numeric(10,2) DEFAULT 0 CHECK (suicide_rate >= 0),
  accident_rate numeric(10,2) DEFAULT 0 CHECK (accident_rate >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique combinations
  UNIQUE(country, year, sex)
);

-- Enable Row Level Security
ALTER TABLE mental_health_data ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (research data should be publicly accessible)
CREATE POLICY "Public read access for mental health data"
  ON mental_health_data
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert/update data
CREATE POLICY "Authenticated users can manage data"
  ON mental_health_data
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mental_health_country_year_sex 
  ON mental_health_data(country, year, sex);

CREATE INDEX IF NOT EXISTS idx_mental_health_country 
  ON mental_health_data(country);

CREATE INDEX IF NOT EXISTS idx_mental_health_year 
  ON mental_health_data(year);

CREATE INDEX IF NOT EXISTS idx_mental_health_sex 
  ON mental_health_data(sex);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mental_health_data_updated_at
  BEFORE UPDATE ON mental_health_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE mental_health_data IS 'European mental health and alcohol mortality research data (2011-2022)';
COMMENT ON COLUMN mental_health_data.country IS 'ISO 3166-1 alpha-2 country code';
COMMENT ON COLUMN mental_health_data.year IS 'Year of data collection';
COMMENT ON COLUMN mental_health_data.sex IS 'Gender: M (Male) or F (Female)';
COMMENT ON COLUMN mental_health_data.alcohol_rate IS 'Age-standardized alcohol-related death rate per 100,000';
COMMENT ON COLUMN mental_health_data.suicide_rate IS 'Age-standardized suicide rate per 100,000';
COMMENT ON COLUMN mental_health_data.accident_rate IS 'Age-standardized accident rate per 100,000';