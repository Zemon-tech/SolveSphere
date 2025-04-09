import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Get user profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get user profile
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' }, 
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    // Remove sensitive information if applicable
    const safeUserData = {
      id: data.id,
      display_name: data.display_name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      created_at: data.created_at
    };
    
    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }
    
    // Validate the fields to update
    const updates: any = {};
    
    if (body.display_name !== undefined) {
      updates.display_name = body.display_name;
    }
    
    if (body.avatar_url !== undefined) {
      updates.avatar_url = body.avatar_url;
    }
    
    if (body.bio !== undefined) {
      updates.bio = body.bio;
    }
    
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' }, 
        { status: 400 }
      );
    }
    
    // Update the user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', body.id)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      data: data[0],
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 