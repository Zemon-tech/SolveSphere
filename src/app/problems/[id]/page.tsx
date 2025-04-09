import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

// Function to format date
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function ProblemPage({ params }: { params: { id: string } }) {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/problems" className="text-blue-600 hover:underline flex items-center gap-1">
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
          Back to Problems
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
          <div className="flex gap-2 mb-4">
            <CategoryBadge category={problem.category} />
            <DifficultyBadge level={problem.difficulty} />
            <span className="text-gray-500 text-sm">Posted on {formatDate(problem.created_at)}</span>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">{problem.description}</p>
        </div>
        <div className="md:w-64 shrink-0">
          <Button asChild className="w-full mb-4">
            <Link href={`/problems/${problem.id}/solve`}>Start Solving</Link>
          </Button>
          <Button variant="outline" className="w-full mb-4">Save for Later</Button>
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-2">Problem Stats</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>Solutions:</span>
              <span>24</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Attempts:</span>
              <span>128</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Success Rate:</span>
              <span>19%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: problem.detailed_description.replace(/\n/g, '<br>') }} />
      </div>
      
      <div className="mt-10 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Related Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockProblems
            .filter(p => p.id !== problem.id && p.category === problem.category)
            .slice(0, 2)
            .map(p => (
              <div key={p.id} className="border rounded-lg p-4">
                <div className="flex gap-2 mb-2">
                  <CategoryBadge category={p.category} />
                  <DifficultyBadge level={p.difficulty} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {p.description.length > 100 ? `${p.description.substring(0, 100)}...` : p.description}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/problems/${p.id}`}>View Problem</Link>
                </Button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
} 