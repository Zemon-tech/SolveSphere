import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Get a specific solution by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Solution ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get the solution with problem and user details
    const { data, error } = await supabase
      .from('solutions')
      .select(`
        *,
        problems:problem_id (id, title, category, difficulty),
        users:user_id (id, display_name, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch solution' }, 
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Update a solution
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Solution ID is required' }, 
        { status: 400 }
      );
    }
    
    // Validate the fields to update
    const updates: any = {};
    const allowedFields = [
      'title', 'content', 'attachments', 'is_public'
    ];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' }, 
        { status: 400 }
      );
    }
    
    // Update the solution
    const { data, error } = await supabase
      .from('solutions')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update solution' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data: data[0],
      message: 'Solution updated successfully' 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Delete a solution
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Solution ID is required' }, 
        { status: 400 }
      );
    }
    
    // Delete the solution
    const { error } = await supabase
      .from('solutions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete solution' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Solution deleted successfully' 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 