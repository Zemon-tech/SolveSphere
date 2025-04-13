/* 
 * Migration: 20250412130000_problem_resources_table.sql
 * Purpose: Create table for problem resources feature
 * Tables: problem_resources
 */

-- Create enum type for resource types
create type resource_type as enum ('document', 'website', 'video', 'dataset');

-- Problem Resources table
create table public.problem_resources (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems(id) on delete cascade,
  title text not null,
  type resource_type not null,
  url text not null,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.problem_resources is 'External resources related to specific problems';

-- Create indexes for problem_resources table
create index idx_problem_resources_problem_id on problem_resources(problem_id);
create index idx_problem_resources_type on problem_resources(type);

-- Enable Row Level Security on problem_resources table
alter table public.problem_resources enable row level security;

-- RLS policies for problem_resources table
-- Allow users to view resources for problems they can access
create policy "Users can view any problem resources"
  on problem_resources for select
  to authenticated
  using (true);

-- Allow admin users to manage resources
create policy "Admins can manage problem resources"
  on problem_resources for all
  to authenticated
  using (
    -- Replace with your actual admin role check
    exists (
      select 1 from users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  ); 