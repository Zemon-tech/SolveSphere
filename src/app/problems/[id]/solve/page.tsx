import { Button } from '@/components/ui/button';
import { AIAssistant } from '../../../components/AIAssistant';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for problems (would come from API in a real app)
const mockProblems = [
  {
    id: '1',
    title: 'Solar Panel Optimization for Extreme Climates',
    description: 'Design a solar panel system that can operate efficiently in extreme temperature conditions ranging from -40°C to +60°C.',
    category: 'Engineering',
    difficulty: 3,
    created_at: new Date('2023-06-15'),
    detailed_description: `
## Background
Solar panels are a critical renewable energy technology, but their efficiency is significantly affected by temperature. In extreme climates, both very cold and very hot temperatures can reduce performance and durability.

## Challenge
Design a solar panel system that can:
1. Maintain at least 85% efficiency across the temperature range of -40°C to +60°C
2. Include thermal management solutions that are passive where possible to reduce energy consumption
3. Be durable enough to withstand thermal cycling (daily and seasonal temperature changes)
4. Be cost-effective and practical for implementation in remote areas

## Constraints
- The design should use commercially available materials and technologies
- The solution should require minimal maintenance
- Total system cost should be competitive with standard solar installations (within 20% premium)

## Deliverables
- Detailed system design with technical specifications
- Thermal management strategy explanation
- Performance analysis across the temperature range
- Cost estimation and comparison to standard solutions
- Implementation plan for a pilot installation
    `,
  },
  {
    id: '2',
    title: 'Financial Model for Sustainable Urban Development',
    description: 'Create a financial model that evaluates the economic viability of converting an abandoned industrial area into a sustainable urban community.',
    category: 'Finance',
    difficulty: 4,
    created_at: new Date('2023-07-22'),
    detailed_description: 'Full description for problem 2...',
  },
  {
    id: '3',
    title: 'Spacecraft Docking System Simulation',
    description: 'Develop a physics-based simulation of a spacecraft docking system that accounts for microgravity and orbital mechanics.',
    category: 'Space',
    difficulty: 5,
    created_at: new Date('2023-08-10'),
    detailed_description: 'Full description for problem 3...',
  },
];

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

export default function SolveProblemPage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch data from an API
  const problem = mockProblems.find(p => p.id === params.id);
  
  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Problem not found</h1>
        <p>The problem you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/problems">Back to Problems</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-theme_header_height)] flex flex-col">
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <Link href={`/problems/${problem.id}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Problem
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{problem.title}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <CategoryBadge category={problem.category} />
            <DifficultyBadge level={problem.difficulty} />
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm">Save Progress</Button>
           <Button size="sm">Compile Solution</Button>
        </div>
      </div>

      <div className="flex-grow flex gap-8 overflow-hidden">
        <div className="flex-grow flex flex-col border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-white dark:bg-gray-950 overflow-hidden">
           <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
             <h2 className="text-lg font-semibold text-center">AI Assistant Chat</h2>
           </div>

          <ScrollArea className="flex-grow p-4 space-y-4">
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[75%]">
                <p className="text-sm">I'm your AI problem-solving assistant. How can I assist you with "{problem.title}"?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[75%]">
                <p className="text-sm">Okay, let's start by outlining the main challenges.</p>
              </div>
            </div>
             <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 max-w-[75%]">
                <p className="text-sm">Great idea. The main challenges are maintaining efficiency in extreme temperatures, thermal management, durability, and cost-effectiveness. Which one should we tackle first?</p>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask the AI assistant for guidance..."
                className="flex-grow resize-none"
                rows={1}
              />
              <Button>Send</Button>
            </div>
          </div>
        </div>

        <div className="w-1/3 lg:w-1/4 flex-shrink-0 flex flex-col gap-6 overflow-y-auto">
           <Card>
             <CardHeader>
               <CardTitle className="text-lg">Problem Description</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4">
                  {problem.description}
                </p>
                 <Button variant="link" size="sm" className="p-0 h-auto mt-1">Show full description</Button>
             </CardContent>
           </Card>

           <Card className="flex-grow flex flex-col">
             <CardHeader>
               <CardTitle className="text-lg">Key Points</CardTitle>
               <CardDescription>Important notes from your chat.</CardDescription>
             </CardHeader>
             <CardContent className="flex-grow overflow-y-auto">
               <ScrollArea className="h-full pr-3">
                 <ul className="space-y-2 text-sm">
                   <li className="border-b pb-1 mb-1 dark:border-gray-700">Challenge 1: Maintain 85% efficiency (-40°C to +60°C).</li>
                   <li className="border-b pb-1 mb-1 dark:border-gray-700">Idea: Passive thermal management focus.</li>
                   <li>Constraint: Use commercially available tech.</li>
                 </ul>
               </ScrollArea>
             </CardContent>
             <CardFooter>
                <Button variant="outline" size="sm" className="w-full">Add Key Point Manually</Button>
             </CardFooter>
           </Card>
        </div>
      </div>
    </div>
  );
} 