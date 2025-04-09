import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

// Get vote counts for a solution
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters from the request
    const solutionId = searchParams.get('solution_id');
    
    if (!solutionId) {
      return NextResponse.json(
        { error: 'Solution ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get all votes for the solution
    const { data, error } = await supabase
      .from('votes')
      .select('value')
      .eq('solution_id', solutionId);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch votes' }, 
        { status: 500 }
      );
    }
    
    // Calculate total votes
    const upvotes = data?.filter(vote => vote.value > 0).length || 0;
    const downvotes = data?.filter(vote => vote.value < 0).length || 0;
    const total = data?.reduce((sum, vote) => sum + vote.value, 0) || 0;
    
    return NextResponse.json({ 
      upvotes,
      downvotes,
      total,
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
}

// Add or update a vote
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the required fields
    if (!body.solution_id || !body.user_id || body.value === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Validate vote value
    if (body.value !== 1 && body.value !== -1 && body.value !== 0) {
      return NextResponse.json(
        { error: 'Vote value must be 1, -1, or 0 (to remove vote)' }, 
        { status: 400 }
      );
    }
    
    // Check if user has already voted
    const { data: existingVote, error: lookupError } = await supabase
      .from('votes')
      .select('*')
      .eq('solution_id', body.solution_id)
      .eq('user_id', body.user_id)
      .maybeSingle();
    
    if (lookupError) {
      console.error('Supabase error:', lookupError);
      return NextResponse.json(
        { error: 'Failed to check existing vote' }, 
        { status: 500 }
      );
    }
    
    let result;
    
    if (existingVote) {
      // User already voted, update or delete the vote
      if (body.value === 0) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json(
            { error: 'Failed to remove vote' }, 
            { status: 500 }
          );
        }
        
        result = { message: 'Vote removed successfully' };
      } else {
        // Update vote
        const { data, error } = await supabase
          .from('votes')
          .update({ value: body.value })
          .eq('id', existingVote.id)
          .select();
        
        if (error) {
          console.error('Supabase error:', error);
          return NextResponse.json(
            { error: 'Failed to update vote' }, 
            { status: 500 }
          );
        }
        
        result = { 
          data: data[0],
          message: 'Vote updated successfully' 
        };
      }
    } else if (body.value !== 0) {
      // User hasn't voted yet and is not trying to remove a non-existent vote
      const { data, error } = await supabase
        .from('votes')
        .insert({
          solution_id: body.solution_id,
          user_id: body.user_id,
          value: body.value
        })
        .select();
      
      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json(
          { error: 'Failed to create vote' }, 
          { status: 500 }
        );
      }
      
      result = { 
        data: data[0],
        message: 'Vote created successfully' 
      };
    } else {
      // Trying to remove a non-existent vote, just return success
      result = { message: 'No vote to remove' };
    }
    
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' }, 
      { status: 500 }
    );
  }
} 