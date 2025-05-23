'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/app/lib/supabase';

// Fallback mock data in case no problems are found in the database
const mockProblems = [
  {
    id: '1',
    title: 'Solar Panel Optimization for Extreme Climates',
    description: 'Design a solar panel system that can operate efficiently in extreme temperature conditions ranging from -40°C to +60°C.',
    category: 'Engineering',
    difficulty: 3,
    created_at: new Date('2023-06-15'),
  },
  {
    id: '2',
    title: 'Financial Model for Sustainable Urban Development',
    description: 'Create a financial model that evaluates the economic viability of converting an abandoned industrial area into a sustainable urban community.',
    category: 'Finance',
    difficulty: 4,
    created_at: new Date('2023-07-22'),
  },
  {
    id: '3',
    title: 'Spacecraft Docking System Simulation',
    description: 'Develop a physics-based simulation of a spacecraft docking system that accounts for microgravity and orbital mechanics.',
    category: 'Space',
    difficulty: 5,
    created_at: new Date('2023-08-10'),
  },
  {
    id: '4',
    title: 'Data Pipeline for Real-time Traffic Analysis',
    description: 'Design a data processing pipeline that can analyze city traffic patterns in real-time and identify congestion patterns.',
    category: 'Technology',
    difficulty: 3,
    created_at: new Date('2023-09-05'),
  },
  {
    id: '5',
    title: 'Automated Medical Image Classification',
    description: 'Build a machine learning model to classify medical images for rapid preliminary diagnosis of common conditions.',
    category: 'Technology',
    difficulty: 4,
    created_at: new Date('2023-10-18'),
  },
  {
    id: '6',
    title: 'Water Conservation System for Agriculture',
    description: 'Design a smart irrigation system that optimizes water usage for agricultural applications based on soil and weather conditions.',
    category: 'Engineering',
    difficulty: 2,
    created_at: new Date('2023-11-30'),
  },
];

// Type for Problem
type Problem = {
  id: string;
  title: string;
  description: string;
  category: string[];
  difficulty: number;
  created_at: string;
  detailed_description?: string;
};

// Helper function to render difficulty level
function DifficultyBadge({ level }: { level: number }) {
  const colors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[level as keyof typeof colors]}`}>
      {level === 1 && 'Beginner'}
      {level === 2 && 'Easy'}
      {level === 3 && 'Intermediate'}
      {level === 4 && 'Advanced'}
      {level === 5 && 'Expert'}
    </span>
  );
}

// Helper function to render category badge
function CategoryBadge({ category }: { category: string }) {
  const colors = {
    'Engineering': 'bg-blue-100 text-blue-800',
    'Finance': 'bg-purple-100 text-purple-800',
    'Technology': 'bg-indigo-100 text-indigo-800',
    'Space': 'bg-gray-100 text-gray-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
      {category}
    </span>
  );
}

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch problems from the database
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('problems')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching problems:', error);
          // Use mock data as fallback
          setProblems(mockProblems as any);
        } else {
          // Use real data if available, otherwise fallback to mock data
          setProblems(data.length > 0 ? data : mockProblems as any);
        }
      } catch (error) {
        console.error('Error in fetching problems:', error);
        setProblems(mockProblems as any);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Problem Challenges</h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading problems...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem) => (
            <Card key={problem.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {Array.isArray(problem.category) 
                    ? problem.category.map((cat, index) => (
                        <CategoryBadge key={index} category={cat} />
                      ))
                    : problem.category && <CategoryBadge category={problem.category as string} />
                  }
                  <DifficultyBadge level={problem.difficulty} />
                </div>
                <CardTitle className="line-clamp-2">{problem.title}</CardTitle>
                <CardDescription>
                  {problem.description.length > 120
                    ? `${problem.description.substring(0, 120)}...`
                    : problem.description}
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter className="border-t pt-6 mt-auto">
                <Button asChild className="w-full">
                  <Link href={`/problems/${problem.id}`}>View Challenge</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 