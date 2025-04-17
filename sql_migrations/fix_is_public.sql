-- Fix the is_public column issue
BEGIN;

-- First, check if the column exists and drop it if it does
ALTER TABLE solutions DROP COLUMN IF EXISTS is_public;

-- Recreate the column with the correct definition
ALTER TABLE solutions ADD COLUMN is_public BOOLEAN DEFAULT false;

-- Force Supabase to refresh the schema cache
SELECT pg_catalog.pg_refresh_view('pg_catalog.pg_class');
SELECT pg_catalog.pg_refresh_view('pg_catalog.pg_attribute');
SELECT pg_catalog.pg_refresh_view('information_schema.columns');
SELECT pg_catalog.pg_refresh_view('pg_catalog.pg_namespace');

COMMIT; 