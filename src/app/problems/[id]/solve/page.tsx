"use client"

import { Button } from '@/components/ui/button';
import { AIAssistant } from '../../../components/AIAssistant';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, Plus, Code, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

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

export default function SolveProblemPage() {
  // Get params using useParams hook
  const params = useParams();
  const id = params.id as string;
  
  // In a real app, this would fetch data from an API
  const problem = mockProblems.find(p => p.id === id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Hide the nav and footer using CSS
  useEffect(() => {
    // Add a class to the body to hide nav and footer
    document.body.classList.add('solve-page');
    
    // Add the CSS to the document if it doesn't exist
    if (!document.getElementById('solve-page-styles')) {
      const style = document.createElement('style');
      style.id = 'solve-page-styles';
      style.innerHTML = `
        body.solve-page {
          overflow: hidden;
          height: 100vh;
        }
        body.solve-page header,
        body.solve-page footer,
        body.solve-page nav {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up
      document.body.classList.remove('solve-page');
      const style = document.getElementById('solve-page-styles');
      if (style) style.remove();
    };
  }, []);
  
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
    <div className="fixed inset-0 z-50 bg-gray-950 text-white overflow-hidden flex flex-col">
      {/* Title Bar with Toggle and Back Link */}
      <div className="border-b border-gray-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} className={sidebarOpen ? "" : "rotate-180"} />
          </Button>
          <h1 className="text-xl font-semibold">{problem.title}</h1>
        </div>
        <Link href={`/problems/${problem.id}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
          <ChevronLeft size={16} />
          <span>Back to Problem</span>
        </Link>
      </div>
      
      {/* Main Content Area - Not Scrollable (fixed height) */}
      <div className="flex flex-1 overflow-hidden h-full">
        {/* Left: Collapsible Key Points Sidebar */}
        <div className={`bg-gray-900 border-r border-gray-700/50 overflow-hidden flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-80' : 'w-0'}`}>
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Key Points</h2>
          </div>
          
          {/* Key Points List - Not Scrollable */}
          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-3">
              <li className="p-3 rounded-lg bg-gray-800/70 border border-gray-700/50 shadow-sm">
                Challenge 1: Maintain 85% efficiency (-40°C to +60°C).
              </li>
              <li className="p-3 rounded-lg bg-gray-800/70 border border-gray-700/50 shadow-sm">
                Idea: Passive thermal management focus.
              </li>
              <li className="p-3 rounded-lg bg-gray-800/70 border border-gray-700/50 shadow-sm">
                Constraint: Use commercially available tech.
              </li>
            </ul>
          </div>
          
          <div className="p-4 border-t border-gray-800 flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full gap-1 border-gray-700 hover:border-gray-600 transition-colors">
              <Plus size={14} /> Add Key Point
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-1 border-gray-700 hover:border-gray-600 transition-colors">
                <Code size={14} /> Compile Solution
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1 border-gray-700 hover:border-gray-600 transition-colors">
                <Save size={14} /> Save Progress
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right: Chat Area */}
        <div className="flex-1 flex flex-col h-full bg-gray-950">
          {/* Scrollable Message Area - The ONLY scrollable part */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex justify-start">
                <div className="bg-gray-800/70 rounded-lg p-4 max-w-[80%] shadow-sm">
                  <p>I'm your AI problem-solving assistant. How can I assist you with "{problem.title}"?</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-blue-900/80 text-white rounded-lg p-4 max-w-[80%] shadow-sm">
                  <p>Okay, let's start by outlining the main challenges.</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-gray-800/70 rounded-lg p-4 max-w-[80%] shadow-sm">
                  <p>Great idea. The main challenges are maintaining efficiency in extreme temperatures, thermal management, durability, and cost-effectiveness. Which one should we tackle first?</p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          {/* Fixed Input Area */}
          <div className="p-4 border-t border-gray-800/70 bg-gray-900/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Textarea
                placeholder="Ask the AI assistant for guidance..."
                className="flex-grow resize-none bg-gray-800/80 border-gray-700/50 focus:border-blue-500/70 rounded-lg transition-colors shadow-sm"
                rows={2}
              />
              <Button className="bg-blue-600 hover:bg-blue-700 transition-colors h-auto">Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 