"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SolutionWorkspace } from '@/app/components/SolutionWorkspace';
import { AIAssistantChat } from '@/app/components/AIAssistantChat';
import { supabase } from '@/app/lib/supabase';
import { Spinner } from '@/components/ui/spinner';

// Type for Problem
type Problem = {
  id: string;
  title: string;
  description: string;
  category: string | string[];
  difficulty: number;
  created_at: string | Date;
  detailed_description?: string;
};

export default function SolveProblemPage() {
  const params = useParams();
  const problemId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProblem() {
      if (!problemId) {
        setError("No problem ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the problem from Supabase
        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .eq('id', problemId)
          .single();
        
        if (error) {
          console.error('Error fetching problem:', error);
          setError("Failed to load the problem. Please try again.");
        } else if (data) {
          setProblem(data);
        } else {
          setError("Problem not found");
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchProblem();
  }, [problemId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2">Loading problem...</span>
      </div>
    );
  }

  // Show error statetable is already made is supabase and u need to 
  if (error || !problem) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">
          {error || "Problem not found"}
        </h2>
        <p className="mb-4">
          We couldn't load the problem you're looking for.
        </p>
        <a 
          href="/problems" 
          className="text-blue-500 hover:underline"
        >
          Return to problems list
        </a>
      </div>
    );
  }

  // Render solution workspace with the actual problem data
  return (
    <SolutionWorkspace 
      problemId={problem.id} 
      problem={problem} 
      backUrl={`/problems/${problem.id}`}
    >
      <AIAssistantChat 
        problemId={problem.id} 
        problemTitle={problem.title} 
      />
    </SolutionWorkspace>
  );
} 