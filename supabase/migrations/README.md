# Supabase Setup for SolveSphere

This directory contains the database migrations and seed files for setting up the SolveSphere database in Supabase.

## Directory Structure

- `migrations/` - Contains SQL migration files to create and modify the database schema
  - `00001_initial_schema.sql` - Creates the initial tables
  - `00002_rls_policies.sql` - Sets up Row Level Security policies
- `seed.sql` - Contains sample data to populate the database for development

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up for Supabase at [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key for configuration

### 2. Set Environment Variables

Create or update your `.env.local` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Apply Migrations

You can apply migrations using the Supabase web interface or the CLI.

#### Using the Web Interface:

1. Go to your project in the Supabase dashboard
2. Navigate to SQL Editor
3. Paste and execute the contents of each migration file in order

#### Using the Supabase CLI:

1. Install the Supabase CLI: 
   ```
   npm install -g supabase
   ```
2. Login to Supabase:
   ```
   supabase login
   ```
3. Link your project:
   ```
   supabase link --project-ref your-project-ref
   ```
4. Apply migrations:
   ```
   supabase db push
   ```

### 4. Seed the Database

Use the Supabase SQL Editor to run the `seed.sql` file, which will create sample data for development.

## Database Schema

The database consists of the following tables:

1. `users` - User profiles
2. `problems` - Problem definitions
3. `solutions` - User-submitted solutions to problems
4. `comments` - Comments on solutions
5. `votes` - Upvotes/downvotes on solutions

See `migrations/00001_initial_schema.sql` for detailed schema information.

## Security Policies

Row Level Security (RLS) is enabled on all tables to ensure proper access control. The policies are defined in `migrations/00002_rls_policies.sql` and implement the following rules:

- All users can view public profiles and problems
- Users can only update their own profiles
- Only admins can create, update or delete problems
- Users can create, update and delete their own solutions
- Public solutions are viewable by everyone
- Users can only view their private solutions
- Comments and votes on public solutions are visible to everyone
- Users can only create, update or delete their own comments and votes

## Development Workflow

### Modifying the Schema

1. Create a new migration file in the `migrations` directory with a sequential number prefix
2. Apply the migration locally using the Supabase CLI or web interface
3. Test your changes
4. Commit the migration file to the repository

### Accessing Supabase in the Application

Use the Supabase client from `@/app/lib/supabase.ts` to interact with the database:

```typescript
import { supabase } from '@/app/lib/supabase';

// Example query
const { data, error } = await supabase
  .from('problems')
  .select('*')
  .order('created_at', { ascending: false });
```

### Supabase MCP

To check tables and policies, you can use the Supabase Management API through the CLI:

```
npx supabase mcp tables
npx supabase mcp policies
``` 