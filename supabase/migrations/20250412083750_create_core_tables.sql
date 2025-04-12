/* 
 * Migration: 20250412083750_create_core_tables.sql
 * Purpose: Create core tables for SolveSphere application
 * Tables: users, problems, solutions, solution_contents, solution_assets
 */

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Enable pgcrypto for gen_random_uuid() function
create extension if not exists "pgcrypto";

-- Create enum types
create type solution_stage as enum ('draft', 'final');
create type content_type as enum ('text', 'graph', 'image', 'table', 'url','formula');
create type asset_type as enum ('graph', 'image', 'formula');
create type asset_source as enum ('ai', 'user');

-- Users table (extending auth.users)
create table public.users (
  id uuid primary key references auth.users(id),
  display_name text not null,
  email text not null unique,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.users is 'Profile information for authenticated users. Extends Supabase auth.users.';

-- Create indexes for users table
create index idx_users_email on users(email);
create index idx_users_created_at on users(created_at);

-- Problems table
create table public.problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text[] not null,
  difficulty integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
comment on table public.problems is 'Collection of problems users can solve on the platform.';

-- Create indexes for problems table
create index idx_problems_category on problems(category);
create index idx_problems_difficulty on problems(difficulty);

-- Solutions table
create table public.solutions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  problem_id uuid not null references problems(id) on delete cascade,
  final_pdf_url text,
  stage solution_stage not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Unique constraint to ensure one draft and one final solution per user per problem
  unique(user_id, problem_id, stage)
);
comment on table public.solutions is 'User solutions to problems, can be in draft or final stage.';

-- Create indexes for solutions table
create index idx_solutions_user_id on solutions(user_id);
create index idx_solutions_problem_id on solutions(problem_id);
create index idx_solutions_user_problem on solutions(user_id, problem_id);

-- Solution Contents table
create table public.solution_contents (
  id uuid primary key default gen_random_uuid(),
  solution_id uuid not null references solutions(id) on delete cascade,
  type content_type not null,
  content_or_asset_id text not null,
  position integer not null,
  created_at timestamptz default now()
);
comment on table public.solution_contents is 'Content sections within a solution, ordered by position.';

-- Create indexes for solution_contents table
create index idx_solution_contents_solution_id on solution_contents(solution_id);
create index idx_solution_contents_type on solution_contents(type);
create index idx_solution_contents_solution_position on solution_contents(solution_id, position);

-- Solution Assets table
create table public.solution_assets (
  id uuid primary key default gen_random_uuid(),
  type asset_type not null,
  caption text,
  source asset_source not null,
  url text not null,
  created_at timestamptz default now()
);
comment on table public.solution_assets is 'Assets used within solutions such as images, graphs, and formulas.';

-- Create indexes for solution_assets table
create index idx_solution_assets_type on solution_assets(type);
create index idx_solution_assets_source on solution_assets(source);

-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.problems enable row level security;
alter table public.solutions enable row level security;
alter table public.solution_contents enable row level security;
alter table public.solution_assets enable row level security; 