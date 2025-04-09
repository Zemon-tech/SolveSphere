import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '../lib/utils';

// Mock data for community posts (would come from API in a real app)
const mockPosts = [
  {
    id: '1',
    title: 'Introduction to Phase-Change Materials in Energy Systems',
    user: {
      id: 'user1',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    category: 'Technical Discussion',
    content: 'I recently completed a solution for optimizing solar panels in extreme climates and wanted to share some insights about phase-change materials (PCMs) that might help others...',
    likes: 24,
    comments: 9,
    created_at: new Date('2023-07-25'),
  },
  {
    id: '2',
    title: 'Looking for teammates: Urban development challenge',
    user: {
      id: 'user2',
      name: 'Priya Sharma',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    category: 'Collaboration',
    content: "Hi everyone! I'm working on the sustainable urban development problem and looking for team members with experience in financial modeling and urban planning...",
    likes: 16,
    comments: 11,
    created_at: new Date('2023-08-12'),
  },
  {
    id: '3',
    title: 'Resources for learning orbital mechanics',
    user: {
      id: 'user3',
      name: 'Jordan Williams',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    category: 'Resources',
    content: "I've compiled a list of resources that were really helpful when I was working on the spacecraft docking simulation problem. Sharing here in case it helps others...",
    likes: 42,
    comments: 15,
    created_at: new Date('2023-09-05'),
  },
  {
    id: '4',
    title: 'Career transition: From finance to technology',
    user: {
      id: 'user4',
      name: 'Maria Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    category: 'Career',
    content: "I wanted to share my experience using SolveSphere to help transition from finance to a technical role. The problems here helped me build a portfolio that demonstrated...",
    likes: 37,
    comments: 22,
    created_at: new Date('2023-10-18'),
  },
];

// Helper function to render category badge
function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    'Technical Discussion': 'bg-blue-100 text-blue-800',
    'Collaboration': 'bg-green-100 text-green-800',
    'Resources': 'bg-purple-100 text-purple-800',
    'Career': 'bg-orange-100 text-orange-800',
    'Question': 'bg-yellow-100 text-yellow-800',
    'Announcement': 'bg-red-100 text-red-800',
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[category]}`}>
      {category}
    </span>
  );
}

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Community</h1>
        <Button>Create Post</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Community Sidebar */}
        <div className="md:col-span-1 order-2 md:order-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Technical Discussion</span>
                <span className="text-xs text-gray-500">128</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Collaboration</span>
                <span className="text-xs text-gray-500">86</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Resources</span>
                <span className="text-xs text-gray-500">74</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Career</span>
                <span className="text-xs text-gray-500">53</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Questions</span>
                <span className="text-xs text-gray-500">92</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Announcements</span>
                <span className="text-xs text-gray-500">21</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?img=1" alt="User" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">Alex Chen</div>
                    <div className="text-xs text-gray-500">42 contributions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?img=2" alt="User" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">Priya Sharma</div>
                    <div className="text-xs text-gray-500">38 contributions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?img=3" alt="User" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">Jordan Williams</div>
                    <div className="text-xs text-gray-500">35 contributions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://i.pravatar.cc/150?img=4" alt="User" className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="text-sm font-medium">Maria Rodriguez</div>
                    <div className="text-xs text-gray-500">29 contributions</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3 order-1 md:order-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-700">All</Button>
              <Button variant="outline" size="sm">Technical</Button>
              <Button variant="outline" size="sm">Collaboration</Button>
              <Button variant="outline" size="sm">Resources</Button>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Latest
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {post.user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(post.created_at)}
                    </span>
                    <CategoryBadge category={post.category} />
                  </div>
                  
                  <CardTitle>
                    <Link href={`/community/posts/${post.id}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.content}
                  </p>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex justify-between items-center">
                  <div className="flex items-center gap-6">
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
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                      <span>{post.likes} likes</span>
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
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                  
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/community/posts/${post.id}`}>View Post</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-8">
            <Button variant="outline">Load More</Button>
          </div>
        </div>
      </div>
    </div>
  );
} 