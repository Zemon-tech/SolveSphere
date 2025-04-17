# Database Schema Migrations

This directory contains SQL migration scripts to update the database schema when necessary.

## Running the Schema Update Script

The `update_schema.sql` script fixes schema issues by:

1. Creating the `ai_conversations` table if it doesn't exist
2. Updating the `solutions` table to match the expected schema:
   - Removing `content` column if it exists
   - Adding `stage` column if missing
   - Adding `final_pdf_url` column if missing
   - Making `title` column nullable
   - Removing `attachments` column if it exists
3. Updating the `problems` table to match the expected schema:
   - Converting `category` column from text to text array if needed
   - Adding `detailed_description` column if missing

### To run with the Supabase CLI:

1. Install the Supabase CLI if you haven't already:
   ```
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```
   supabase login
   ```

3. Run the migration against your project:
   ```
   supabase db execute --project-ref your-project-ref --file ./sql_migrations/update_schema.sql
   ```

### To run in the Supabase Dashboard:

1. Log in to the Supabase Dashboard
2. Go to your project
3. Select "SQL Editor" from the left navigation
4. Copy the contents of `update_schema.sql`
5. Paste it into the SQL Editor
6. Click "Run" to execute the script

## Troubleshooting

If you encounter any issues running the migration:

1. Check that you have the appropriate permissions to modify the database schema
2. Look for any specific error messages in the output
3. Ensure your Supabase project is on a paid plan as some schema modifications are limited on the free tier
4. If needed, run individual statements from the script one by one to identify which one is causing issues 