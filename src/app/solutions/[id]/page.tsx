import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDate } from '../../lib/utils';

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
    commentsCount: 8,
    created_at: new Date('2023-07-12'),
    content: `
# Thermal Regulation System for Solar Panels in Extreme Climates

## Executive Summary
This solution addresses the challenge of maintaining solar panel efficiency across extreme temperature ranges (-40°C to +60°C) through a combination of passive thermal management techniques and specialized materials selection. The design achieves 87% efficiency retention across the temperature range while staying within the cost constraints.

## Technical Approach

### 1. Phase-Change Material (PCM) Integration
I've designed a layered PCM system beneath the solar panels that absorbs excess heat during high temperatures and releases it during cold periods.

- **Material Selection**: Paraffin-based PCMs with melting points at 25°C and -10°C
- **Encapsulation**: Aluminum honeycomb structure containing PCM mixture
- **Integration**: Mounted directly to the panel back surface with thermal adhesive

### 2. Selective Surface Coatings
A specialized coating system that balances solar absorption and thermal emission properties:

- **Hot Climate Configuration**: High solar absorptivity (α = 0.95) with higher thermal emissivity (ε = 0.92)
- **Cold Climate Configuration**: High solar absorptivity (α = 0.95) with lower thermal emissivity (ε = 0.65)

### 3. Insulation System
A variable thickness insulation layer that provides:

- Thermal barrier using aerogel-based material (thermal conductivity = 0.013 W/m·K)
- Edge insulation to prevent thermal bridging
- Weather-sealed to prevent moisture infiltration

## Performance Analysis

| Temperature | Standard Panel Efficiency | Enhanced System Efficiency | Improvement |
|-------------|---------------------------|----------------------------|-------------|
| -40°C       | 68%                      | 85%                        | +17%        |
| -20°C       | 74%                      | 88%                        | +14%        |
| 0°C         | 82%                      | 91%                        | +9%         |
| 25°C        | 100%                     | 100%                       | 0%          |
| 40°C        | 85%                      | 92%                        | +7%         |
| 60°C        | 72%                      | 86%                        | +14%        |

## Cost Analysis
The total system cost is approximately 18% higher than standard installations, falling within the 20% premium constraint. The additional costs are primarily associated with the PCM system and selective coatings, with expected payback period of 3.2 years in extreme climate regions due to efficiency gains.

## Implementation Recommendations
1. Pilot installation in three test locations: Arctic research station, desert solar farm, and temperate region (control)
2. Three-month monitoring period with automated temperature and performance logging
3. Refinement of PCM mixture ratios based on field performance
`,
    comments: [
      {
        id: 'c1',
        user: {
          id: 'user5',
          name: 'David Park',
          avatar: 'https://i.pravatar.cc/150?img=5'
        },
        content: 'Have you considered the weight implications of the PCM system? Might be concerning for rooftop installations.',
        created_at: new Date('2023-07-15'),
        replies: []
      },
      {
        id: 'c2',
        user: {
          id: 'user6',
          name: 'Elena Martinez',
          avatar: 'https://i.pravatar.cc/150?img=6'
        },
        content: 'Excellent approach with the selective coatings. Did you evaluate any commercial products that come close to the specifications you mentioned?',
        created_at: new Date('2023-07-16'),
        replies: [
          {
            id: 'r1',
            user: {
              id: 'user1',
              name: 'Alex Chen',
              avatar: 'https://i.pravatar.cc/150?img=1'
            },
            content: 'Yes, I looked at CoolPV and SolarShield coatings. The SolarShield product comes within 5% of the target specifications, but would need customization for the extreme cold end.',
            created_at: new Date('2023-07-16')
          }
        ]
      }
    ]
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
    commentsCount: 12,
    created_at: new Date('2023-08-05'),
    content: 'Detailed solution for problem 2...',
    comments: []
  }
];

export default function SolutionDetailPage({ params }: { params: { id: string } }) {
  // In a real app, this would fetch data from an API
  const solution = mockSolutions.find(s => s.id === params.id);
  
  if (!solution) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Solution not found</h1>
        <p>The solution you're looking for doesn't exist.</p>
        <Button asChild className="mt-4">
          <Link href="/solutions">Back to Solutions</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/solutions" className="text-blue-600 hover:underline flex items-center gap-1">
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
          Back to Solutions
        </Link>
      </div>
      
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 mb-4">
            <img 
              src={solution.user.avatar}
              alt={solution.user.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="font-medium">{solution.user.name}</div>
              <div className="text-gray-500 text-sm">Posted on {formatDate(solution.created_at)}</div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{solution.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-700 dark:text-gray-300">Solution for:</span>
            <Link href={`/problems/${solution.problemId}`} className="text-blue-600 hover:underline">
              {solution.problemTitle}
            </Link>
          </div>
          
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
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
            
            <div className="flex items-center gap-1">
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
              <span>{solution.comments.length} comments</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: solution.content.replace(/\n/g, '<br>') }} />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
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
              Upvote
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
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
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              </svg>
              Add Comment
            </Button>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
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
              <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4"/>
              <path d="M17 8l-5-5-5 5"/>
              <path d="M12 3v12"/>
            </svg>
            Save
          </Button>
        </div>
      </div>
      
      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Comments ({solution.comments.length})</h2>
        {solution.comments.length > 0 ? (
          <div className="space-y-6">
            {solution.comments.map(comment => (
              <div key={comment.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{comment.user.name}</div>
                    <div className="text-gray-500 text-xs">{formatDate(comment.created_at)}</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{comment.content}</p>
                
                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {comment.replies.map(reply => (
                      <div key={reply.id}>
                        <div className="flex items-center gap-3 mb-1">
                          <img 
                            src={reply.user.avatar} 
                            alt={reply.user.name}
                            className="w-6 h-6 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-sm">{reply.user.name}</div>
                            <div className="text-gray-500 text-xs">{formatDate(reply.created_at)}</div>
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-3 flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-xs h-7">Reply</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
        
        {/* Add Comment Form */}
        <div className="mt-8 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <h3 className="font-medium mb-2">Add your comment</h3>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 min-h-[100px]"
            placeholder="Share your thoughts on this solution..."
          ></textarea>
          <div className="flex justify-end mt-4">
            <Button>Post Comment</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 