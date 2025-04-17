"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SolutionWorkspace } from '@/app/components/SolutionWorkspace';
import { AIAssistantChat } from '@/app/components/AIAssistantChat';
import { supabase } from '@/app/lib/supabase';
import { Spinner } from '@/components/ui/spinner';
import { v4 as uuidv4 } from 'uuid';

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
  const router = useRouter();
  const problemId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [solutionId, setSolutionId] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      if (!problemId) {
        setError("No problem ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          router.push(`/auth/login?redirect=/problems/${problemId}/solve`);
          return;
        }

        // Check if solution exists
        const { data: existingSolution, error: solutionError } = await supabase
          .from('solutions')
          .select('id')
          .eq('problem_id', problemId)
          .eq('user_id', session.user.id)
          .single();

        if (solutionError && solutionError.code !== 'PGRST116') {
          console.error('Error checking solution:', solutionError);
          setError("Failed to check solution status");
          setIsLoading(false);
          return;
        }

        if (existingSolution) {
          setSolutionId(existingSolution.id);
        } else {
          // Create new solution
          const newSolutionId = uuidv4();
          const { error: createError } = await supabase
            .from('solutions')
            .insert({
              id: newSolutionId,
              problem_id: problemId,
              user_id: session.user.id,
              stage: 'draft',
              is_public: false
            });

          if (createError) {
            console.error('Error creating solution:', createError);
            setError("Failed to create solution");
            setIsLoading(false);
            return;
          }

          // Create AI conversation
          const conversationId = uuidv4();
          await supabase
            .from('ai_conversations')
            .insert({
              id: conversationId,
              solution_id: newSolutionId,
              messages: []
            });

          setSolutionId(newSolutionId);
        }
        
        // Fetch the problem
        const { data: problemData, error: problemError } = await supabase
          .from('problems')
          .select('*')
          .eq('id', problemId)
          .single();
        
        if (problemError) {
          console.error('Error fetching problem:', problemError);
          setError("Failed to load the problem");
        } else if (problemData) {
          setProblem(problemData);
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

    initialize();
  }, [problemId, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2">Loading problem...</span>
      </div>
    );
  }

  // Show error state
  if (error || !problem || !solutionId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">
          {error || "Problem not found"}
        </h2>
        <p className="mb-4">
          We could not load the problem you&apos;re looking for.
        </p>
        <Link 
          href="/problems" 
          className="text-blue-500 hover:underline"
        >
          Return to problems list
        </Link>
      </div>
    );
  }

  // Render solution workspace with the actual problem data
  return (
    <SolutionWorkspace 
      problemId={problem.id} 
      problem={problem} 
      backUrl={`/problems/${problem.id}`}
      solutionId={solutionId}
    >
      <AIAssistantChat 
        problemId={problem.id} 
        problemTitle={problem.title} 
        solutionId={solutionId}
      />
    </SolutionWorkspace>
  );
} 