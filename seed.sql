-- Sample data for testing the Animal Type Classification system

-- Insert sample users (field personnel)
INSERT OR IGNORE INTO users (username, email, full_name, role, location) VALUES 
  ('admin', 'admin@cattle-atc.gov.in', 'System Administrator', 'admin', 'Delhi'),
  ('vet_mumbai', 'vet.mumbai@cattle-atc.gov.in', 'Dr. Priya Sharma', 'veterinarian', 'Mumbai'),
  ('field_punjab', 'field.punjab@cattle-atc.gov.in', 'Rajesh Kumar', 'field_officer', 'Punjab'),
  ('field_gujarat', 'field.gujarat@cattle-atc.gov.in', 'Arjun Patel', 'field_officer', 'Gujarat');

-- Insert sample animals for testing
INSERT OR IGNORE INTO animals (tag_number, name, species, breed, age_months, sex, owner_name, location) VALUES 
  ('IN001', 'Ganga', 'cattle', 'Gir', 48, 'female', 'Ram Singh', 'Gujarat'),
  ('IN002', 'Yamuna', 'cattle', 'Red Sindhi', 36, 'female', 'Mohan Lal', 'Rajasthan'),
  ('IN003', 'Saraswati', 'buffalo', 'Murrah', 42, 'female', 'Suresh Kumar', 'Haryana'),
  ('IN004', 'Narmada', 'cattle', 'Sahiwal', 40, 'female', 'Vikram Singh', 'Punjab'),
  ('IN005', 'Godavari', 'buffalo', 'Jaffarabadi', 50, 'female', 'Ahmed Khan', 'Gujarat');

-- Insert sample body measurements (simulated AI extraction results)
INSERT OR IGNORE INTO body_measurements (
  animal_id, body_length, height_at_withers, chest_width, chest_depth, chest_girth,
  rump_length, rump_width, pin_bone_width, thurl_width, rump_angle, foot_angle,
  rear_leg_set, frame_score, capacity_score, feet_legs_score, dairy_character_score,
  confidence_score
) VALUES 
  (1, 165.2, 128.5, 45.3, 68.7, 198.4, 52.1, 48.9, 18.2, 45.6, 22.5, 45.0, 15.2, 85.5, 78.3, 82.1, 79.8, 0.87),
  (2, 158.7, 125.2, 42.8, 65.3, 185.6, 49.7, 46.2, 17.5, 42.8, 25.1, 47.5, 16.8, 82.3, 75.6, 80.4, 77.2, 0.91),
  (3, 172.4, 135.8, 48.6, 72.1, 215.3, 55.8, 52.3, 19.8, 48.2, 20.8, 43.2, 14.5, 88.7, 85.2, 83.9, 82.4, 0.89),
  (4, 162.1, 130.4, 44.2, 67.8, 195.7, 51.3, 47.8, 18.0, 44.1, 23.7, 46.3, 15.9, 84.1, 79.8, 81.7, 78.9, 0.85),
  (5, 178.9, 142.6, 51.2, 75.4, 228.1, 58.4, 55.1, 21.2, 50.8, 19.2, 41.8, 13.7, 92.3, 88.7, 85.6, 84.2, 0.93);

-- Insert sample classification results
INSERT OR IGNORE INTO classification_results (
  animal_id, measurement_id, frame_score, dairy_capacity_score, feet_legs_score,
  mammary_system_score, overall_grade, final_score, measurement_confidence,
  classification_confidence, reviewed_by, review_status, bpa_sync_status
) VALUES 
  (1, 1, 85, 78, 82, 80, 'Very Good', 81, 0.87, 0.89, 'vet_mumbai', 'approved', 'pending'),
  (2, 2, 82, 76, 80, 77, 'Good', 79, 0.91, 0.88, 'vet_mumbai', 'approved', 'pending'),
  (3, 3, 89, 85, 84, 86, 'Excellent', 86, 0.89, 0.92, 'vet_mumbai', 'approved', 'pending'),
  (4, 4, 84, 80, 82, 79, 'Very Good', 81, 0.85, 0.87, 'vet_mumbai', 'pending', 'pending'),
  (5, 5, 92, 89, 86, 88, 'Excellent', 89, 0.93, 0.95, 'vet_mumbai', 'approved', 'pending');

-- Insert sample activity logs
INSERT OR IGNORE INTO activity_logs (user_id, animal_id, action, details) VALUES 
  (2, 1, 'classification_completed', 'AI classification completed with confidence 0.87'),
  (2, 2, 'classification_completed', 'AI classification completed with confidence 0.91'),
  (2, 3, 'classification_completed', 'AI classification completed with confidence 0.89'),
  (2, 4, 'classification_pending', 'Classification requires manual review'),
  (2, 5, 'classification_completed', 'AI classification completed with confidence 0.93'),
  (1, 1, 'result_approved', 'Classification result approved by veterinarian'),
  (1, 2, 'result_approved', 'Classification result approved by veterinarian'),
  (1, 3, 'result_approved', 'Classification result approved by veterinarian'),
  (1, 5, 'result_approved', 'Classification result approved by veterinarian');