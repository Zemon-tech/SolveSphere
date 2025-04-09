import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Fetch all comments with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters from the request
    const solutionId = searchParams.get('solution_id');
    const userId = searchParams.get('user_id');
    const parentId = searchParams.get('parent_id');
    const limit = searchParams.get('limit') ? 
      parseInt(searchParams.get('limit') as string) : 10;
    const offset = searchParams.get('offset') ? 
      parseInt(searchParams.get('offset') as string) : 0;
    
    // Initialize query with join to get user details
    let query = supabase
      .from('comments')
      .select(`
        *,
        users:user_id (id, display_name, avatar_url)
      `);
    
    // Apply filters if provided
    if (solutionId) {
      query = query.eq('solution_id', solutionId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      // If no parent_id is specified, return only top-level comments
      query = query.is('parent_id', null);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' }, 
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

// Create a new comment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the required fields
    if (!body.solution_id || !body.user_id || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Insert the new comment
    const { data, error } = await supabase
      .from('comments')
      .insert({
        solution_id: body.solution_id,
        user_id: body.user_id,
        parent_id: body.parent_id || null,
        content: body.content,
      })
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create comment' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data: data[0],
      message: 'Comment created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 