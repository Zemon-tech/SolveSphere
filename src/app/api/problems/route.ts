import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Fetch all problems with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters from the request
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty') ? 
      parseInt(searchParams.get('difficulty') as string) : null;
    const limit = searchParams.get('limit') ? 
      parseInt(searchParams.get('limit') as string) : 10;
    const offset = searchParams.get('offset') ? 
      parseInt(searchParams.get('offset') as string) : 0;
    
    // Initialize query
    let query = supabase
      .from('problems')
      .select('*');
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch problems' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data, 
      count, 
      limit, 
      offset 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 