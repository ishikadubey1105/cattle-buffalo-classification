-- Animal Type Classification Database Schema

-- Animals table - stores basic animal information
CREATE TABLE IF NOT EXISTS animals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tag_number TEXT UNIQUE NOT NULL,
  name TEXT,
  species TEXT NOT NULL CHECK (species IN ('cattle', 'buffalo')),
  breed TEXT,
  age_months INTEGER,
  sex TEXT CHECK (sex IN ('male', 'female')),
  owner_name TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Body measurements table - stores extracted measurements
CREATE TABLE IF NOT EXISTS body_measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id INTEGER NOT NULL,
  
  -- Linear measurements (in cm)
  body_length REAL,
  height_at_withers REAL,
  chest_width REAL,
  chest_depth REAL,
  chest_girth REAL,
  rump_length REAL,
  rump_width REAL,
  pin_bone_width REAL,
  thurl_width REAL,
  
  -- Angular measurements (in degrees)
  rump_angle REAL,
  foot_angle REAL,
  rear_leg_set REAL,
  
  -- Composite scores
  frame_score REAL,
  capacity_score REAL,
  feet_legs_score REAL,
  dairy_character_score REAL,
  
  -- Image metadata
  image_url TEXT,
  image_width INTEGER,
  image_height INTEGER,
  confidence_score REAL,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
);

-- Classification results table - stores final ATC scores
CREATE TABLE IF NOT EXISTS classification_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  animal_id INTEGER NOT NULL,
  measurement_id INTEGER NOT NULL,
  
  -- Standard ATC scores (0-100 scale)
  frame_score INTEGER CHECK (frame_score >= 0 AND frame_score <= 100),
  dairy_capacity_score INTEGER CHECK (dairy_capacity_score >= 0 AND dairy_capacity_score <= 100),
  feet_legs_score INTEGER CHECK (feet_legs_score >= 0 AND feet_legs_score <= 100),
  mammary_system_score INTEGER CHECK (mammary_system_score >= 0 AND mammary_system_score <= 100),
  
  -- Overall classification grade
  overall_grade TEXT CHECK (overall_grade IN ('Excellent', 'Very Good', 'Good', 'Fair', 'Poor')),
  final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
  
  -- Quality indicators
  measurement_confidence REAL,
  classification_confidence REAL,
  
  -- Reviewer information
  reviewed_by TEXT,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  
  -- BPA integration
  bpa_sync_status TEXT DEFAULT 'pending' CHECK (bpa_sync_status IN ('pending', 'synced', 'failed')),
  bpa_reference_id TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (measurement_id) REFERENCES body_measurements(id) ON DELETE CASCADE
);

-- Users table - for field personnel authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'field_officer' CHECK (role IN ('admin', 'veterinarian', 'field_officer')),
  location TEXT,
  active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity log table - for audit trail
CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  animal_id INTEGER,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (animal_id) REFERENCES animals(id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_animals_tag_number ON animals(tag_number);
CREATE INDEX IF NOT EXISTS idx_animals_species ON animals(species);
CREATE INDEX IF NOT EXISTS idx_animals_breed ON animals(breed);
CREATE INDEX IF NOT EXISTS idx_animals_location ON animals(location);

CREATE INDEX IF NOT EXISTS idx_body_measurements_animal_id ON body_measurements(animal_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_created_at ON body_measurements(created_at);

CREATE INDEX IF NOT EXISTS idx_classification_results_animal_id ON classification_results(animal_id);
CREATE INDEX IF NOT EXISTS idx_classification_results_grade ON classification_results(overall_grade);
CREATE INDEX IF NOT EXISTS idx_classification_results_bpa_sync ON classification_results(bpa_sync_status);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_animal_id ON activity_logs(animal_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);