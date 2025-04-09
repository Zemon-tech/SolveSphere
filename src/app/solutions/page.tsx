import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../lib/utils';

// Mock data for solutions (would come from API in a real app)
const mockSolutions = [
  {
    id: '1',
    title: 'Thermal Regulation System for Solar Panels',
    user: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    problemId: '1',
    problemTitle: 'Solar Panel Optimization for Extreme Climates',
    votes: 42,
    comments: 8,
    created_at: new Date('2023-07-12'),
    excerpt: 'This solution implements a passive thermal regulation system using phase-change materials and selective surface coatings to maintain optimal temperature ranges in extreme environments.'
  },
  {
    id: '2',
    title: 'Urban Redevelopment ROI Analysis',
    user: {
      id: 'user2',
      name: 'Priya Sharma',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    problemId: '2',
    problemTitle: 'Financial Model for Sustainable Urban Development',
    votes: 28,
    comments: 12,
    created_at: new Date('2023-08-05'),
    excerpt: 'A comprehensive financial model integrating environmental remediation costs, phased development timelines, and multiple revenue streams from mixed-use spaces.'
  },
  {
    id: '3',
    title: 'Microgravity Docking Simulation Framework',
    user: {
      id: 'user3',
      name: 'Jordan Williams',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    problemId: '3',
    problemTitle: 'Spacecraft Docking System Simulation',
    votes: 34,
    comments: 6,
    created_at: new Date('2023-09-18'),
    excerpt: 'A physics-based simulation framework addressing orbital mechanics, contact dynamics, and sensor measurement uncertainties for reliable autonomous docking procedures.'
  },
  {
    id: '4',
    title: 'Scalable Traffic Analysis Pipeline',
    user: {
      id: 'user4',
      name: 'Maria Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    problemId: '4',
    problemTitle: 'Data Pipeline for Real-time Traffic Analysis',
    votes: 19,
    comments: 4,
    created_at: new Date('2023-10-07'),
    excerpt: 'A distributed stream processing architecture that scales horizontally to handle variable city traffic data volumes while maintaining sub-second processing latency.'
  },
];

export default function SolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community Solutions</h1>
        <div className="flex gap-4">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort by: Most Recent
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {mockSolutions.map((solution) => (
          <Card key={solution.id} className="hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={solution.user.avatar} 
                      alt={solution.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {solution.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(solution.created_at)}
                    </span>
                  </div>
                  
                  <CardTitle>
                    <Link href={`/solutions/${solution.id}`} className="hover:text-blue-600 transition-colors">
                      {solution.title}
                    </Link>
                  </CardTitle>
                  
                  <CardDescription className="mt-1">
                    <Link href={`/problems/${solution.problemId}`} className="text-blue-600 hover:underline">
                      {solution.problemTitle}
                    </Link>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {solution.excerpt}
                  </p>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex items-center gap-6">
                  <div className="flex items-center gap-1 text-gray-600">
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
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                    <span>{solution.votes} votes</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-600">
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>{solution.comments} comments</span>
                  </div>
                </CardFooter>
              </div>
              
              <div className="md:flex md:items-center md:p-6 md:pl-0">
                <Button asChild size="sm">
                  <Link href={`/solutions/${solution.id}`}>View Solution</Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
} 