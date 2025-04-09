-- Enable Row Level Security for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Users Policies
-- Anyone can read public user profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON users FOR SELECT 
  USING (true);

-- Only the user can update their own profile
CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Problems Policies
-- Anyone can view problems
CREATE POLICY "Problems are viewable by everyone" 
  ON problems FOR SELECT 
  USING (true);

-- Only administrators can create, update, or delete problems
-- (Replace 'is_admin()' with your admin check function or use specific user IDs for now)
CREATE POLICY "Only admins can create problems" 
  ON problems FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT id FROM users WHERE email = 'admin@solvesphere.com'
  ));

CREATE POLICY "Only admins can update problems" 
  ON problems FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM users WHERE email = 'admin@solvesphere.com'
  ));

CREATE POLICY "Only admins can delete problems" 
  ON problems FOR DELETE 
  USING (auth.uid() IN (
    SELECT id FROM users WHERE email = 'admin@solvesphere.com'
  ));

-- Solutions Policies
-- Public solutions are viewable by everyone
CREATE POLICY "Public solutions are viewable by everyone" 
  ON solutions FOR SELECT 
  USING (is_public = true);

-- Users can view their own solutions regardless of public status
CREATE POLICY "Users can view own solutions" 
  ON solutions FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own solutions
CREATE POLICY "Users can create own solutions" 
  ON solutions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own solutions
CREATE POLICY "Users can update own solutions" 
  ON solutions FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own solutions
CREATE POLICY "Users can delete own solutions" 
  ON solutions FOR DELETE 
  USING (auth.uid() = user_id);

-- Comments Policies
-- Comments on public solutions are viewable by everyone
CREATE POLICY "Comments on public solutions are viewable by everyone" 
  ON comments FOR SELECT 
  USING (
    solution_id IN (
      SELECT id FROM solutions WHERE is_public = true
    )
  );

-- Users can view comments on their own solutions
CREATE POLICY "Users can view comments on own solutions" 
  ON comments FOR SELECT 
  USING (
    solution_id IN (
      SELECT id FROM solutions WHERE user_id = auth.uid()
    )
  );

-- Users can create comments on public solutions or their own solutions
CREATE POLICY "Users can create comments on public solutions" 
  ON comments FOR INSERT 
  WITH CHECK (
    solution_id IN (
      SELECT id FROM solutions WHERE is_public = true
    )
  );

CREATE POLICY "Users can create comments on own solutions" 
  ON comments FOR INSERT 
  WITH CHECK (
    solution_id IN (
      SELECT id FROM solutions WHERE user_id = auth.uid()
    )
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments" 
  ON comments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments" 
  ON comments FOR DELETE 
  USING (auth.uid() = user_id);

-- Votes Policies
-- Votes on public solutions are viewable by everyone
CREATE POLICY "Votes on public solutions are viewable by everyone" 
  ON votes FOR SELECT 
  USING (
    solution_id IN (
      SELECT id FROM solutions WHERE is_public = true
    )
  );

-- Users can view votes on their own solutions
CREATE POLICY "Users can view votes on own solutions" 
  ON votes FOR SELECT 
  USING (
    solution_id IN (
      SELECT id FROM solutions WHERE user_id = auth.uid()
    )
  );

-- Users can create/update votes on public solutions
CREATE POLICY "Users can vote on public solutions" 
  ON votes FOR INSERT 
  WITH CHECK (
    solution_id IN (
      SELECT id FROM solutions WHERE is_public = true
    )
  );

-- Users can update their own votes
CREATE POLICY "Users can update own votes" 
  ON votes FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" 
  ON votes FOR DELETE 
  USING (auth.uid() = user_id); 