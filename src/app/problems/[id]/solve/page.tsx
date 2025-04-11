"use client"

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SolutionWorkspace } from '@/app/components/SolutionWorkspace';
import { AIAssistantChat } from '@/app/components/AIAssistantChat';

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

export default function SolveProblemPage() {
  // Get params using useParams hook
  const params = useParams();
  const id = params.id as string;
  
  // In a real app, this would fetch data from an API
  const problem = mockProblems.find(p => p.id === id);
  
  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Problem not found</h1>
        <p>The problem you're looking for doesn't exist.</p>
      </div>
    );
  }
  
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