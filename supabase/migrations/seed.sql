-- Insert admin user
INSERT INTO users (id, email, display_name, bio)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'admin@solvesphere.com',
  'SolveSphere Admin',
  'Platform administrator for SolveSphere'
);

-- Insert test users
INSERT INTO users (email, display_name, bio)
VALUES 
  ('user1@example.com', 'Test User 1', 'Just a test user solving problems'),
  ('user2@example.com', 'Test User 2', 'Problem-solving enthusiast'),
  ('user3@example.com', 'Test User 3', 'Software engineer exploring problem-solving techniques');

-- Insert problems
INSERT INTO problems (title, description, category, difficulty, constraints)
VALUES 
  (
    'Optimize Solar Panel Array',
    'Design an algorithm to optimize the arrangement of solar panels on a given rooftop area to maximize energy capture throughout the day, taking into account shadows and sun movement.',
    'Engineering',
    3,
    '{"time_constraint": "30 minutes", "tools": ["Python", "mathematical modeling"]}'
  ),
  (
    'Financial Portfolio Balancer',
    'Create an algorithm that balances a financial portfolio by reallocating assets to maintain desired risk levels while minimizing transaction costs.',
    'Finance',
    2,
    '{"time_constraint": "45 minutes", "tools": ["Excel", "Python", "risk modeling"]}'
  ),
  (
    'Satellite Communication Network',
    'Design a communication system for a constellation of low-orbit satellites to maintain consistent coverage across remote geographic areas.',
    'Space',
    4,
    '{"time_constraint": "60 minutes", "tools": ["network modeling", "Python", "simulation"]}'
  ),
  (
    'Urban Traffic Flow Optimization',
    'Create a system that optimizes traffic light timing across a city grid to minimize congestion during rush hours.',
    'Technology',
    3,
    '{"time_constraint": "45 minutes", "tools": ["graph algorithms", "simulation"]}'
  ),
  (
    'Smart Grid Load Balancing',
    'Develop an algorithm to balance electrical load across a smart grid during peak usage times, accounting for renewable energy sources with variable output.',
    'Engineering',
    3,
    '{"time_constraint": "60 minutes", "tools": ["optimization algorithms", "Python"]}'
  );

-- Get IDs for reference
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  problem1_id UUID;
  problem2_id UUID;
  solution1_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO user1_id FROM users WHERE email = 'user1@example.com';
  SELECT id INTO user2_id FROM users WHERE email = 'user2@example.com';
  
  -- Get problem IDs
  SELECT id INTO problem1_id FROM problems WHERE title = 'Optimize Solar Panel Array';
  SELECT id INTO problem2_id FROM problems WHERE title = 'Financial Portfolio Balancer';
  
  -- Insert solutions
  INSERT INTO solutions (problem_id, user_id, title, content, is_public)
  VALUES 
    (
      problem1_id,
      user1_id,
      'Solar Optimization with Genetic Algorithm',
      'This solution uses a genetic algorithm approach to optimize solar panel placement...\n\n```python\nimport numpy as np\n\ndef fitness_function(layout):\n    # Calculate energy capture based on panel positions\n    return energy_capture\n\ndef genetic_algorithm(population_size, generations):\n    # Implementation of genetic algorithm\n    pass\n```\n\nThe key insight was to model shadow patterns across different times of day and seasons, then use this as a constraint in the optimization process.',
      true
    ),
    (
      problem2_id,
      user2_id,
      'Modern Portfolio Theory Implementation',
      'I approached this using Modern Portfolio Theory with a custom optimization to minimize transaction costs...\n\n```python\nimport pandas as pd\nimport numpy as np\nfrom scipy.optimize import minimize\n\ndef objective_function(weights, returns, cov_matrix, risk_tolerance):\n    portfolio_return = np.sum(returns * weights)\n    portfolio_risk = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))\n    return -portfolio_return + risk_tolerance * portfolio_risk\n```\n\nThe solution balances between target allocation and minimizing unnecessary transactions when the portfolio drifts from target allocations.',
      true
    );
  
  -- Get solution ID for comments and votes
  SELECT id INTO solution1_id FROM solutions WHERE title = 'Solar Optimization with Genetic Algorithm';
  
  -- Insert comments
  INSERT INTO comments (solution_id, user_id, content)
  VALUES 
    (solution1_id, user2_id, 'Have you considered using a particle swarm optimization instead? It might be more efficient for this specific problem.'),
    (solution1_id, user1_id, 'I did look into PSO, but found the genetic approach handled the discrete nature of panel placement better.');
  
  -- Insert votes
  INSERT INTO votes (solution_id, user_id, value)
  VALUES 
    (solution1_id, user2_id, 1);
    
END $$;

-- Add sample problem_analysis data

-- For the first problem
INSERT INTO problem_analysis (problem_id, section_id, section_title) 
VALUES 
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '1', 'Key Constraints'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '2', 'Performance Metrics'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '3', 'Stakeholders');

-- Add items to the Key Constraints section
INSERT INTO problem_analysis_items (problem_id, section_id, item_id, content)
VALUES
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '1', '1-1', 'Temperature range: -40°C to +60°C'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '1', '1-2', 'Minimum 85% efficiency across range'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '1', '1-3', 'Cost-effective (within 20% premium)'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '1', '1-4', 'Minimal maintenance');

-- Add items to the Performance Metrics section
INSERT INTO problem_analysis_items (problem_id, section_id, item_id, content)
VALUES
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '2', '2-1', 'Energy output consistency'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '2', '2-2', 'Thermal cycling durability'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '2', '2-3', 'Installation complexity'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '2', '2-4', 'Maintenance frequency');

-- Add items to the Stakeholders section
INSERT INTO problem_analysis_items (problem_id, section_id, item_id, content)
VALUES
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '3', '3-1', 'End-users'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '3', '3-2', 'Manufacturers'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '3', '3-3', 'Environmental agencies'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), '3', '3-4', 'Regulatory bodies');

-- For the second problem
INSERT INTO problem_analysis (problem_id, section_id, section_title) 
VALUES 
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '1', 'Key Requirements'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '2', 'Success Metrics'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '3', 'Key Stakeholders');

-- Add items to the sections for the second problem
INSERT INTO problem_analysis_items (problem_id, section_id, item_id, content)
VALUES
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '1', '1-1', 'Must include 20-year projection'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '1', '1-2', 'Must account for environmental remediation costs'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '2', '2-1', 'ROI timeline'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '2', '2-2', 'Social impact metrics'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '3', '3-1', 'Investors'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '3', '3-2', 'Community members'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), '3', '3-3', 'Local government');

-- Add sample problem_resources data

-- For the first problem (Solar Panel)
INSERT INTO problem_resources (problem_id, title, type, url, description) 
VALUES 
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), 'Solar Panel Efficiency Guide', 'document', 'https://example.com/solar-efficiency', 'Comprehensive guide to solar panel efficiency factors and optimization techniques'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), 'Extreme Climate Materials Research', 'website', 'https://example.com/materials', 'Research on materials suitable for extreme temperature conditions'),
  ((SELECT id FROM problems WHERE title LIKE '%Solar Panel%' LIMIT 1), 'Thermal Management Techniques', 'video', 'https://example.com/thermal-video', 'Video tutorial on passive thermal management systems for solar panels');

-- For the second problem (Financial Model)
INSERT INTO problem_resources (problem_id, title, type, url, description) 
VALUES 
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), 'Urban Development Economics', 'document', 'https://example.com/urban-economics', 'Economic principles and models for sustainable urban development'),
  ((SELECT id FROM problems WHERE title LIKE '%Financial Model%' LIMIT 1), 'Brownfield Redevelopment Dataset', 'dataset', 'https://example.com/brownfield-data', 'Historical data on successful brownfield redevelopment projects');

-- For the third problem (Spacecraft Docking)
INSERT INTO problem_resources (problem_id, title, type, url, description) 
VALUES 
  ((SELECT id FROM problems WHERE title LIKE '%Spacecraft%' LIMIT 1), 'Orbital Mechanics Primer', 'document', 'https://example.com/orbital-mechanics', 'Fundamental principles of orbital mechanics and spacecraft rendezvous'),
  ((SELECT id FROM problems WHERE title LIKE '%Spacecraft%' LIMIT 1), 'NASA Docking Systems', 'website', 'https://example.com/nasa-docking', 'NASA documentation on spacecraft docking mechanisms and protocols'); 