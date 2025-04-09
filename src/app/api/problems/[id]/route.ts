import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Get a specific problem by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get the problem
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch problem' }, 
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

// Update a problem
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' }, 
        { status: 400 }
      );
    }
    
    // Validate the fields to update
    const updates: any = {};
    const allowedFields = [
      'title', 'description', 'category', 
      'difficulty', 'source_url', 'source_platform', 'constraints'
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
    
    // Update the problem
    const { data, error } = await supabase
      .from('problems')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update problem' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data: data[0],
      message: 'Problem updated successfully' 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Delete a problem
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Problem ID is required' }, 
        { status: 400 }
      );
    }
    
    // Delete the problem
    const { error } = await supabase
      .from('problems')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to delete problem' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Problem deleted successfully' 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 