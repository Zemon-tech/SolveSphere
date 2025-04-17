-- First check if ai_conversations table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_conversations') THEN
        -- Create AI Conversations Table
        CREATE TABLE ai_conversations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            solution_id UUID REFERENCES solutions(id) ON DELETE CASCADE,
            messages JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create index for performance
        CREATE INDEX idx_ai_conversations_solution_id ON ai_conversations(solution_id);
    END IF;
END
$$;

-- Update the solutions table schema if needed
DO $$
BEGIN
    -- Check if solutions table has a content column that needs to be removed
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'content'
    ) THEN
        -- Remove content column
        ALTER TABLE solutions DROP COLUMN IF EXISTS content;
    END IF;
    
    -- Add stage column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'stage'
    ) THEN
        ALTER TABLE solutions ADD COLUMN stage TEXT;
    END IF;
    
    -- Add final_pdf_url column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'final_pdf_url'
    ) THEN
        ALTER TABLE solutions ADD COLUMN final_pdf_url TEXT;
    END IF;
    
    -- Make title nullable if it's currently NOT NULL
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'title'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE solutions ALTER COLUMN title DROP NOT NULL;
    END IF;
    
    -- Drop attachments column if it exists
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'solutions' 
        AND column_name = 'attachments'
    ) THEN
        ALTER TABLE solutions DROP COLUMN IF EXISTS attachments;
    END IF;
END
$$;

-- Update the problems table schema if needed
DO $$
BEGIN
    -- Change category to text array if it's not already
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'problems' 
        AND column_name = 'category'
        AND data_type = 'text'
    ) THEN
        -- First create a temporary column
        ALTER TABLE problems ADD COLUMN category_array TEXT[] DEFAULT '{}'::text[];
        
        -- Update the temporary column with array values from existing category
        UPDATE problems SET category_array = ARRAY[category];
        
        -- Drop the original column
        ALTER TABLE problems DROP COLUMN category;
        
        -- Rename the temporary column to category
        ALTER TABLE problems RENAME COLUMN category_array TO category;
    END IF;
    
    -- Add detailed_description column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'problems' 
        AND column_name = 'detailed_description'
    ) THEN
        ALTER TABLE problems ADD COLUMN detailed_description TEXT;
    END IF;
END
$$; 