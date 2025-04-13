"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Download, Trash2, Copy, Search, ImagePlus, GitBranch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/app/lib/supabase';
import { Spinner } from '@/components/ui/spinner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MermaidDiagram } from './MermaidDiagram';
import { MarkdownTable } from './MarkdownTable';

// Type for accumulated content - matching the AIAssistantChat type
type ContentItem = {
  id: string;
  type: 'image' | 'formula' | 'graph' | 'table' | 'research' | 'flowchart' | 'note' | 'diagram';
  content: string;
  title?: string;
  timestamp: Date;
  sourceMessageId?: string;
  imageUrl?: string;
  base64Data?: string;
};

// External resource type
type ExternalResource = {
  id: string;
  title: string;
  type: 'document' | 'website' | 'video' | 'dataset';
  url: string;
  description?: string;
  problem_id?: string;
};

interface ResourcesProps {
  problemId: string;
  accumulatedContent: ContentItem[];
  setAccumulatedContent: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}

export function Resources({ 
  problemId, 
  accumulatedContent = [], 
  setAccumulatedContent 
}: ResourcesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [externalResources, setExternalResources] = useState<ExternalResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // New state for image generation dialog
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
  
  // New state for diagram creation dialog
  const [diagramCode, setDiagramCode] = useState(`graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Result 1]
    D --> F[Result 2]`);
  const [diagramTitle, setDiagramTitle] = useState('Flowchart');
  const [diagramType, setDiagramType] = useState('flowchart');
  const [diagramError, setDiagramError] = useState<string | null>(null);
  
  // Fetch external resources from Supabase
  useEffect(() => {
    async function fetchResources() {
      if (!problemId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch resources related to this problem
        const { data, error } = await supabase
          .from('problem_resources')
          .select('*')
          .eq('problem_id', problemId);
          
        if (error) {
          console.error('Error fetching resources:', error);
          setError('Failed to load resources');
        } else if (data && data.length > 0) {
          setExternalResources(data);
        } else {
          // If no resources found, provide some default resources
          setExternalResources([
            {
              id: '1',
              title: 'Technical Reference Guide',
              type: 'document',
              url: '#',
              description: 'Comprehensive guide to technical specifications and standards.',
              problem_id: problemId
            },
            {
              id: '2',
              title: 'Case Studies',
              type: 'document',
              url: '#',
              description: 'Real-world examples of similar problems and their solutions.',
              problem_id: problemId
            }
          ]);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchResources();
  }, [problemId]);

  // Format date consistently
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter content based on search query
  const filteredContent = accumulatedContent.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter resources based on search query
  const filteredResources = externalResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete a content item
  const handleDeleteContent = (id: string) => {
    setAccumulatedContent(prev => prev.filter(item => item.id !== id));
  };

  // Copy content to clipboard
  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  // Download content as a text file
  const handleDownloadContent = (item: ContentItem) => {
    if (item.type === 'image' && item.base64Data) {
      // For base64 images, create a download link
      const element = document.createElement('a');
      element.href = `data:image/png;base64,${item.base64Data}`;
      element.download = `${item.title || 'generated-image'}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else if (item.type === 'image' && item.imageUrl) {
      // For images with URLs, create a download link
      const element = document.createElement('a');
      element.href = item.imageUrl;
      element.download = `${item.title || 'image'}-${new Date().toISOString().slice(0, 10)}.png`;
      element.target = '_blank';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // For text content
      const element = document.createElement('a');
      const file = new Blob([item.content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${item.title || 'content'}-${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // Generate image directly from Resources
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    try {
      setIsGeneratingImage(true);
      setImageGenerationError(null);
      
      // Add a placeholder initially
      const imageId = `image-${Date.now()}`;
      const imageItem: ContentItem = {
        id: imageId,
        type: 'image',
        content: imagePrompt,
        title: `Generated Image: ${imagePrompt.substring(0, 30)}${imagePrompt.length > 30 ? '...' : ''}`,
        timestamp: new Date()
      };
      
      setAccumulatedContent(prev => [...prev, imageItem]);
      
      // Generate the image with Stability AI
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          width: 1024,
          height: 1024,
          numOutputs: 1
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }
      
      const data = await response.json();
      if (data.images && data.images.length > 0) {
        // Update the content item with the image data
        setAccumulatedContent(prev => prev.map(item => 
          item.id === imageId 
            ? { 
                ...item, 
                base64Data: data.images[0].base64,
                content: `Generated from prompt: ${imagePrompt}`
              } 
            : item
        ));
        
        // Reset image prompt after successful generation
        setImagePrompt('');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setImageGenerationError('Failed to generate image. Please try again later.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Generate diagram directly from Resources
  const handleCreateDiagram = () => {
    if (!diagramCode.trim()) return;
    
    try {
      // Create a new diagram content item
      const diagramItem: ContentItem = {
        id: `diagram-${Date.now()}`,
        type: 'diagram',
        content: diagramCode.trim(),
        title: diagramTitle || 'Diagram',
        timestamp: new Date()
      };
      
      // Add to accumulated content
      setAccumulatedContent(prev => [...prev, diagramItem]);
      
      // Reset diagram error
      setDiagramError(null);
      
    } catch (error) {
      console.error('Error creating diagram:', error);
      setDiagramError('Failed to create diagram. Please check the syntax and try again.');
    }
  };
  
  // Load template based on diagram type
  const loadDiagramTemplate = (type: string) => {
    setDiagramType(type);
    
    switch (type) {
      case 'flowchart':
        setDiagramTitle('Flowchart');
        setDiagramCode(`graph TD
    A[Start] --> B{Decision?}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[Result 1]
    D --> F[Result 2]`);
        break;
      case 'sequence':
        setDiagramTitle('Sequence Diagram');
        setDiagramCode(`sequenceDiagram
    participant U as User
    participant S as System
    participant D as Database
    U->>S: Request Data
    S->>D: Query Data
    D->>S: Return Results
    S->>U: Display Results`);
        break;
      case 'class':
        setDiagramTitle('Class Diagram');
        setDiagramCode(`classDiagram
    class Entity {
      +id: string
      +name: string
      +getData()
    }
    class RelatedEntity {
      +entityId: string
      +value: number
      +processData()
    }
    Entity <-- RelatedEntity`);
        break;
      case 'er':
        setDiagramTitle('ER Diagram');
        setDiagramCode(`erDiagram
    ENTITY1 ||--o{ ENTITY2 : has
    ENTITY1 {
        string id
        string name
    }
    ENTITY2 {
        string id
        string entity1Id
        number value
    }`);
        break;
      case 'gantt':
        setDiagramTitle('Gantt Chart');
        setDiagramCode(`gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Research           :a1, 2023-01-01, 10d
    Design             :a2, after a1, 7d
    section Implementation
    Development        :a3, after a2, 15d
    Testing            :a4, after a3, 5d`);
        break;
      case 'pie':
        setDiagramTitle('Pie Chart');
        setDiagramCode(`pie
    title Distribution
    "Category A" : 42
    "Category B" : 28
    "Category C" : 30`);
        break;
      case 'state':
        setDiagramTitle('State Diagram');
        setDiagramCode(`stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Success
    Processing --> Error: Failure
    Complete --> [*]
    Error --> Idle: Retry`);
        break;
      default:
        setDiagramTitle('Flowchart');
        setDiagramCode(`graph TD
    A[Start] --> B[Process]
    B --> C[End]`);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2">Loading resources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">{error}</h2>
        <p className="mb-4">We couldn't load the resources data.</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <Card className="flex flex-col h-full min-h-0 overflow-hidden border-0 shadow-none">
        <CardHeader className="p-3 border-b shrink-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-base">Resources</CardTitle>
              <CardDescription>Access problem-related resources and your saved content</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    <span>Create Diagram</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Diagram with Mermaid</DialogTitle>
                    <DialogDescription>
                      Create diagrams, charts, and visualizations using Mermaid syntax.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-1/3">
                        <label htmlFor="title" className="text-sm font-medium">
                          Diagram Title
                        </label>
                        <Input
                          id="title"
                          value={diagramTitle}
                          onChange={(e) => setDiagramTitle(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="w-2/3">
                        <label htmlFor="type" className="text-sm font-medium">
                          Diagram Type
                        </label>
                        <select
                          id="type"
                          value={diagramType}
                          onChange={(e) => loadDiagramTemplate(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm dark:bg-gray-800"
                        >
                          <option value="flowchart">Flowchart</option>
                          <option value="sequence">Sequence Diagram</option>
                          <option value="class">Class Diagram</option>
                          <option value="er">ER Diagram</option>
                          <option value="gantt">Gantt Chart</option>
                          <option value="pie">Pie Chart</option>
                          <option value="state">State Diagram</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label htmlFor="diagram-code" className="text-sm font-medium">
                          Diagram Code
                        </label>
                        <a 
                          href="https://mermaid.js.org/syntax/flowchart.html" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Mermaid Syntax Help
                        </a>
                      </div>
                      <Textarea
                        id="diagram-code"
                        value={diagramCode}
                        onChange={(e) => setDiagramCode(e.target.value)}
                        rows={10}
                        className="font-mono text-sm"
                        placeholder="Enter Mermaid diagram code here..."
                      />
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md border">
                      <p className="text-sm font-medium mb-2">Preview</p>
                      {diagramCode ? (
                        <div className="bg-white dark:bg-gray-900 p-3 rounded-md border">
                          <MermaidDiagram content={diagramCode} />
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No diagram code to preview</div>
                      )}
                    </div>
                    
                    {diagramError && (
                      <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {diagramError}
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={handleCreateDiagram}
                      disabled={!diagramCode.trim()}
                      className="w-full sm:w-auto"
                    >
                      Create Diagram
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ImagePlus className="w-4 h-4" />
                    <span>Generate Image</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Image with AI</DialogTitle>
                    <DialogDescription>
                      Create an image using Stability AI's Stable Diffusion. Be descriptive for best results.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="prompt" className="text-sm font-medium">
                        Image Description
                      </label>
                      <Textarea
                        id="prompt"
                        placeholder="Describe the image you want to generate..."
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        For best results, be specific about the style, content, and context of the image.
                      </p>
                    </div>
                    
                    {imageGenerationError && (
                      <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {imageGenerationError}
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !imagePrompt.trim()}
                      className="w-full sm:w-auto"
                    >
                      {isGeneratingImage ? (
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                          Generating...
                        </>
                      ) : 'Generate Image'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <div className="p-3 border-b shrink-0 bg-gray-50 dark:bg-gray-900">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="pl-8 h-9"
            />
          </div>
        </div>
        
        <Tabs defaultValue="my-content" className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TabsList className="px-3 pt-2 bg-white dark:bg-gray-900 shrink-0">
            <TabsTrigger value="my-content">My Content</TabsTrigger>
            <TabsTrigger value="external-resources">External Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent 
            value="my-content" 
            className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
          >
            {filteredContent.length > 0 ? (
              filteredContent.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <FileText className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {item.type !== 'image' && (
                            <DropdownMenuItem onClick={() => handleCopyContent(item.content)}>
                              <Copy className="h-3.5 w-3.5 mr-2" />
                              <span>Copy</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDownloadContent(item)}>
                            <Download className="h-3.5 w-3.5 mr-2" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-500 dark:text-red-400"
                            onClick={() => handleDeleteContent(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="text-xs">
                      {formatDate(new Date(item.timestamp))} · {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xs text-gray-500 mb-2">{formatDate(new Date(item.timestamp))}</div>
                    
                    {item.type === 'image' && item.base64Data ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={`data:image/png;base64,${item.base64Data}`} 
                          alt={item.title || 'Generated image'} 
                          className="rounded-md max-h-80 w-auto object-contain" 
                        />
                        <p className="text-xs text-gray-500 mt-2">{item.content}</p>
                      </div>
                    ) : item.type === 'image' && item.imageUrl ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title || 'Generated image'} 
                          className="rounded-md max-h-80 w-auto object-contain" 
                        />
                        <p className="text-xs text-gray-500 mt-2">{item.content}</p>
                      </div>
                    ) : item.type === 'formula' ? (
                      <div className="bg-white dark:bg-gray-900 p-2 rounded border">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {`$$${item.content}$$`}
                        </ReactMarkdown>
                      </div>
                    ) : item.type === 'table' ? (
                      <div className="overflow-hidden rounded border">
                        <MarkdownTable 
                          content={item.content} 
                          title={item.title} 
                        />
                      </div>
                    ) : item.type === 'diagram' ? (
                      <div className="bg-white dark:bg-gray-900 p-2 rounded border overflow-x-auto">
                        <MermaidDiagram content={item.content} />
                      </div>
                    ) : item.type === 'research' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">No saved content yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Content you save from the AI assistant will appear here. Use the "Save as note" option in the chat.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent 
            value="external-resources" 
            className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3"
          >
            {filteredResources.length > 0 ? (
              filteredResources.map(resource => (
                <Card key={resource.id} className="overflow-hidden">
                  <CardHeader className="p-3 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">{resource.title}</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        asChild
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                    <CardDescription className="text-xs">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="p-3 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs"
                      asChild
                    >
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ExternalLink className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">No matching resources</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                  Try a different search term or check back later for additional resources.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 