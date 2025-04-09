import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Fetch all solutions with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters from the request
    const problemId = searchParams.get('problem_id');
    const userId = searchParams.get('user_id');
    const limit = searchParams.get('limit') ? 
      parseInt(searchParams.get('limit') as string) : 10;
    const offset = searchParams.get('offset') ? 
      parseInt(searchParams.get('offset') as string) : 0;
    
    // Initialize query with join to get problem and user details
    let query = supabase
      .from('solutions')
      .select(`
        *,
        problems:problem_id (id, title, category, difficulty),
        users:user_id (id, display_name, avatar_url)
      `);
    
    // Apply filters if provided
    if (problemId) {
      query = query.eq('problem_id', problemId);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    // Only return public solutions unless user is requesting their own
    if (!userId) {
      query = query.eq('is_public', true);
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
        { error: 'Failed to fetch solutions' }, 
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

// Create a new solution
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the required fields
    if (!body.problem_id || !body.user_id || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Insert the new solution
    const { data, error } = await supabase
      .from('solutions')
      .insert({
        problem_id: body.problem_id,
        user_id: body.user_id,
        title: body.title,
        content: body.content,
        attachments: body.attachments || null,
        is_public: body.is_public !== undefined ? body.is_public : false,
      })
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create solution' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data: data[0],
      message: 'Solution created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 