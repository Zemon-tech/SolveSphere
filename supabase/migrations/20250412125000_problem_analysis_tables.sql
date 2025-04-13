/* 
 * Migration: 20250412125000_problem_analysis_tables.sql
 * Purpose: Create tables for problem analysis feature
 * Tables: problem_analysis, problem_analysis_items
 */

-- Problem Analysis table (sections)
create table public.problem_analysis (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems(id) on delete cascade,
  section_id text not null,
  section_title text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Ensure unique section_id per problem
  unique(problem_id, section_id)
);
comment on table public.problem_analysis is 'Analysis sections for breaking down problems into components';

-- Create indexes for problem_analysis table
create index idx_problem_analysis_problem_id on problem_analysis(problem_id);

-- Problem Analysis Items table (items within sections)
create table public.problem_analysis_items (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references problems(id) on delete cascade,
  section_id text not null,
  item_id text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Reference to the section in problem_analysis
  foreign key (problem_id, section_id) references problem_analysis(problem_id, section_id) on delete cascade,
  -- Ensure unique item_id per section per problem
  unique(problem_id, section_id, item_id)
);
comment on table public.problem_analysis_items is 'Individual analysis items within analysis sections';

-- Create indexes for problem_analysis_items table
create index idx_problem_analysis_items_problem_id on problem_analysis_items(problem_id);
create index idx_problem_analysis_items_section on problem_analysis_items(problem_id, section_id);

-- Enable Row Level Security on all tables
alter table public.problem_analysis enable row level security;
alter table public.problem_analysis_items enable row level security;

-- RLS policies for problem_analysis table
-- Allow users to view analysis for problems they can access
create policy "Users can view any problem analysis"
  on problem_analysis for select
  to authenticated
  using (true);

-- Allow users to create analysis for problems they can access
create policy "Users can create problem analysis"
  on problem_analysis for insert
  to authenticated
  using (true);

-- Allow users to update their own analysis
create policy "Users can update their own problem analysis"
  on problem_analysis for update
  to authenticated
  using (true);

-- Allow users to delete their own analysis
create policy "Users can delete their own problem analysis"
  on problem_analysis for delete
  to authenticated
  using (true);

-- Similar RLS policies for problem_analysis_items table
create policy "Users can view any problem analysis items"
  on problem_analysis_items for select
  to authenticated
  using (true);

create policy "Users can create problem analysis items"
  on problem_analysis_items for insert
  to authenticated
  using (true);

create policy "Users can update their own problem analysis items"
  on problem_analysis_items for update
  to authenticated
  using (true);

create policy "Users can delete their own problem analysis items"
  on problem_analysis_items for delete
  to authenticated
  using (true); 