"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Download, Trash2, Copy, Search } from 'lucide-react';
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

// Type for accumulated content - matching the AIAssistantChat type
type ContentItem = {
  id: string;
  type: 'image' | 'formula' | 'graph' | 'table' | 'research' | 'flowchart' | 'note';
  content: string;
  title?: string;
  timestamp: Date;
  sourceMessageId?: string;
};

// External resource type
type ExternalResource = {
  id: string;
  title: string;
  type: 'document' | 'website' | 'video' | 'dataset';
  url: string;
  description?: string;
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
  
  // Sample external resources - in a real app, these would come from an API
  const [externalResources] = useState<ExternalResource[]>([
    {
      id: '1',
      title: 'Technical Reference Guide',
      type: 'document',
      url: '#',
      description: 'Comprehensive guide to technical specifications and standards.'
    },
    {
      id: '2',
      title: 'Case Studies',
      type: 'document',
      url: '#',
      description: 'Real-world examples of similar problems and their solutions.'
    },
    {
      id: '3',
      title: 'Industry Standards',
      type: 'document',
      url: '#',
      description: 'Relevant industry standards and best practices.'
    },
    {
      id: '4',
      title: 'Research Papers Collection',
      type: 'dataset',
      url: '#',
      description: 'Collection of academic papers related to this problem domain.'
    }
  ]);

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
    const element = document.createElement('a');
    const file = new Blob([item.content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${item.title || 'content'}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Card className="flex flex-col h-full overflow-hidden border-0 shadow-none">
        <CardHeader className="p-3 border-b shrink-0 bg-white dark:bg-gray-900 z-10">
          <CardTitle className="text-base">Resources</CardTitle>
          <CardDescription>Access problem-related resources and your saved content</CardDescription>
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
        
        <Tabs defaultValue="my-content" className="flex-1 min-h-0 flex flex-col">
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
                          <DropdownMenuItem onClick={() => handleCopyContent(item.content)}>
                            <Copy className="h-3.5 w-3.5 mr-2" />
                            <span>Copy</span>
                          </DropdownMenuItem>
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
                      {formatDate(item.timestamp)} · {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    {item.type === 'formula' ? (
                      <div className="bg-white dark:bg-gray-800 p-2 rounded border">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {`$$${item.content}$$`}
                        </ReactMarkdown>
                      </div>
                    ) : item.type === 'table' ? (
                      <div className="overflow-x-auto">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="text-sm prose dark:prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {item.content}
                        </ReactMarkdown>
                      </div>
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
                <Card key={resource.id}>
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