-- Sample data for development and testing
-- This will create a demo project with sample risks

-- Note: This assumes you have a user account created
-- Replace the user_id values with your actual user ID after signing up

-- Insert a sample profile (this will be created automatically by Supabase Auth)
-- Just keeping this as reference for the structure

-- Insert sample projects
INSERT INTO projects (id, name, description, owner_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'E-Commerce Platform', 'Security assessment for our main e-commerce application', (SELECT id FROM profiles LIMIT 1)),
  ('550e8400-e29b-41d4-a716-446655440002', 'Mobile Banking App', 'Risk management for mobile banking application', (SELECT id FROM profiles LIMIT 1))
ON CONFLICT (id) DO NOTHING;

-- Insert sample risks for the first project
INSERT INTO risks (project_id, title, description, severity, status, cvss_score, cwe_id, affected_component, created_by) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'SQL Injection in Login Form',
    'The login form is vulnerable to SQL injection attacks. User input is not properly sanitized before being used in database queries.',
    'critical',
    'identified',
    9.8,
    'CWE-89',
    'Authentication Module',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Missing CSRF Protection',
    'Critical endpoints lack CSRF token validation, allowing potential cross-site request forgery attacks.',
    'high',
    'in_progress',
    8.1,
    'CWE-352',
    'Payment Gateway',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Weak Password Policy',
    'Current password policy allows weak passwords (minimum 6 characters, no complexity requirements).',
    'medium',
    'identified',
    5.3,
    'CWE-521',
    'User Management',
    (SELECT id FROM profiles LIMIT 1)
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Outdated Dependencies',
    'Several npm packages are using outdated versions with known vulnerabilities.',
    'medium',
    'mitigated',
    6.5,
    'CWE-1104',
    'Frontend Dependencies',
    (SELECT id FROM profiles LIMIT 1)
  )
ON CONFLICT DO NOTHING;
