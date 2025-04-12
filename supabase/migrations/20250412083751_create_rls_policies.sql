/* 
 * Migration: 20250412083751_create_rls_policies.sql
 * Purpose: Create Row Level Security policies for SolveSphere tables
 * Tables: users, problems, solutions, solution_contents, solution_assets
 */

-- RLS Policies for users table

-- Policy: Users can read any profile
create policy "Users can read any profile"
on users
for select
to authenticated, anon
using (true);

-- Policy: Users can update their own profile
create policy "Users can update their own profile"
on users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Policy: Users can insert their own profile
create policy "Users can insert their own profile"
on users
for insert
to authenticated
with check (auth.uid() = id);

-- RLS Policies for problems table

-- Policy: Anyone can read problems
create policy "Anyone can read problems"
on problems
for select
to authenticated, anon
using (true);

-- Policy: Only admins can insert problems (implementation TBD)
-- For MVP, we'll use supabase dashboard to manage problems

-- RLS Policies for solutions table

-- Policy: Users can read their own solutions
create policy "Users can read their own solutions"
on solutions
for select
to authenticated
using (auth.uid() = user_id);

-- Policy: Users can insert their own solutions
create policy "Users can insert their own solutions"
on solutions
for insert
to authenticated
with check (auth.uid() = user_id);

-- Policy: Users can update their own solutions
create policy "Users can update their own solutions"
on solutions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: Users can delete their own solutions
create policy "Users can delete their own solutions"
on solutions
for delete
to authenticated
using (auth.uid() = user_id);

-- RLS Policies for solution_contents table

-- Policy: Users can read contents of solutions they own
create policy "Users can read contents of solutions they own"
on solution_contents
for select
to authenticated
using (
  auth.uid() = (
    select user_id 
    from solutions 
    where solutions.id = solution_contents.solution_id
  )
);

-- Policy: Users can insert contents into solutions they own
create policy "Users can insert contents into solutions they own"
on solution_contents
for insert
to authenticated
with check (
  auth.uid() = (
    select user_id 
    from solutions 
    where solutions.id = solution_contents.solution_id
  )
);

-- Policy: Users can update contents of solutions they own
create policy "Users can update contents of solutions they own"
on solution_contents
for update
to authenticated
using (
  auth.uid() = (
    select user_id 
    from solutions 
    where solutions.id = solution_contents.solution_id
  )
)
with check (
  auth.uid() = (
    select user_id 
    from solutions 
    where solutions.id = solution_contents.solution_id
  )
);

-- Policy: Users can delete contents of solutions they own
create policy "Users can delete contents of solutions they own"
on solution_contents
for delete
to authenticated
using (
  auth.uid() = (
    select user_id 
    from solutions 
    where solutions.id = solution_contents.solution_id
  )
);

-- RLS Policies for solution_assets table

-- Policy: Anyone can read assets
create policy "Anyone can read assets"
on solution_assets
for select
to authenticated, anon
using (true);

-- Policy: Authenticated users can insert assets
create policy "Authenticated users can insert assets"
on solution_assets
for insert
to authenticated
with check (auth.uid() is not null);

-- We don't allow updating assets - they should be immutable
-- If an asset needs to change, create a new one and reference it

-- Policy: Users can delete their own assets (implementation TBD)
-- For MVP, assets will be managed separately or cleaned up by background jobs 