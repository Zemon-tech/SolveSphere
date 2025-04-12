"use client";

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SidebarSeparator } from '@/components/ui/sidebar';
import { ChevronLeft, Lightbulb, BookOpen, FileText, Layers, Database, ExternalLink, Download, Save, Edit, List, PanelLeft, PanelLeftClose, Menu } from 'lucide-react';
import { SolutionEditor } from './SolutionEditor';
import { Analysis } from './Analysis';
import { Resources } from './Resources';
import { ShareSolutionDialog } from './ShareSolutionDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Type for accumulated content
type ContentItem = {
  id: string;
  type: 'image' | 'formula' | 'graph' | 'table' | 'research' | 'flowchart' | 'note';
  content: string;
  title?: string;
  timestamp: Date;
  sourceMessageId?: string;
};

interface Tab {
  id: string;
  label: string;
  icon: ReactNode;
  content: ReactNode;
}

interface SolutionWorkspaceProps {
  problemId: string;
  problem: any; // Replace with proper type
  backUrl: string;
  children?: ReactNode;
}

export function SolutionWorkspace({ problemId, problem, backUrl, children }: SolutionWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<string>('ai-assistant');
  const [minimizedProblem, setMinimizedProblem] = useState<boolean>(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // State for accumulated content shared between components
  const [accumulatedContent, setAccumulatedContent] = useState<ContentItem[]>([]);
  
  // Handler to toggle problem description
  const toggleProblemDescription = () => {
    setMinimizedProblem(!minimizedProblem);
  };
  
  // Handler to toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Pass accumulated content to children (primarily AIAssistantChat)
  const childrenWithProps = children && React.isValidElement(children) 
    ? React.cloneElement(children, {
        accumulatedContent,
        setAccumulatedContent
      }) 
    : children;
  
  // Sidebar sections configuration
  const mainSections: Tab[] = [
    {
      id: 'ai-assistant',
      label: 'AI Assistant',
      icon: <Lightbulb className="h-5 w-5" />,
      content: childrenWithProps
    },
    {
      id: 'solution-editor',
      label: 'Solution Editor',
      icon: <Edit className="h-5 w-5" />,
      content: (
        <SolutionEditor problemId={problemId} />
      )
    },
    {
      id: 'problem-details',
      label: 'Problem Details',
      icon: <BookOpen className="h-5 w-5" />,
      content: (
        <div className="h-full overflow-y-auto p-4 space-y-4">
          <h2 className="text-xl font-semibold">{problem.title}</h2>
          <div className="prose dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: problem.detailed_description }} />
          </div>
        </div>
      )
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <Database className="h-5 w-5" />,
      content: (
        <Resources 
          problemId={problemId}
          accumulatedContent={accumulatedContent}
          setAccumulatedContent={setAccumulatedContent}
        />
      )
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <Layers className="h-5 w-5" />,
      content: (
        <Analysis problemId={problemId} />
      )
    },
    {
      id: 'community',
      label: 'Community',
      icon: <List className="h-5 w-5" />,
      content: (
        <div className="h-full overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Community Solutions</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6">
            <p className="text-sm text-yellow-800">
              Community solutions will be available after you submit your own solution or after the problem's deadline has passed.
            </p>
          </div>
          <Button className="w-full" variant="outline">
            Browse Community Solutions
          </Button>
        </div>
      )
    }
  ];

  const documentationSections = [
    {
      id: 'solution-notes',
      label: 'Solution Notes',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 'attachments',
      label: 'Attachments',
      icon: <FileText className="h-5 w-5" />
    }
  ];
  
  // Get the active section content
  const activeSectionContent = mainSections.find(section => section.id === activeSection)?.content;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Top navigation */}
      <div className="h-14 shrink-0 border-b flex items-center justify-between px-4 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2">
          <Link href={backUrl} className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <ChevronLeft className="h-5 w-5" />
            <span className="ml-1">Back to Problem</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => {
              // In a real app, this would save to backend
              console.log('Saving draft...');
              // You could add a toast notification here
            }}
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </Button>
          <ShareSolutionDialog 
            problemId={problem.id} 
            problemTitle={problem.title}
          />
          <Button 
            size="sm"
            onClick={() => {
              // In a real app, this would submit to backend
              console.log('Submitting solution...');
              // You could add a toast notification or redirect here
            }}
          >
            Submit Solution
          </Button>
        </div>
      </div>
      
      {/* Main content area - flex-1 to take remaining space */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex h-full w-full">
          {/* Left sidebar - collapsible */}
          <div className={`border-r flex flex-col bg-white dark:bg-gray-900 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 shrink-0 z-10`}>
            {/* Sidebar header with toggle button */}
            <div className="h-14 shrink-0 border-b flex items-center justify-between px-4">
              {!sidebarCollapsed && <h2 className="font-semibold">Problem Workspace</h2>}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 ml-auto" 
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
              </Button>
            </div>
            
            {/* Sidebar content */}
            <div className="p-2 flex-1 overflow-y-auto min-h-0">
              <TooltipProvider>
                {/* Main navigation items */}
                <div className="space-y-1">
                  {mainSections.map((section) => (
                    <Tooltip key={section.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={activeSection === section.id ? "secondary" : "ghost"}
                          className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} h-10`}
                          onClick={() => setActiveSection(section.id)}
                        >
                          {section.icon}
                          {!sidebarCollapsed && <span className="ml-2 text-sm">{section.label}</span>}
                        </Button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {section.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
                
                {/* Recent content section */}
                {!sidebarCollapsed && (
                  <>
                    <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                    <div className="mb-2">
                      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recent Content
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {accumulatedContent.slice(0, 5).map((item) => (
                        <div 
                          key={item.id} 
                          className="px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => {
                            // Switch to resources tab and possibly scroll to this item
                            setActiveSection('resources');
                          }}
                        >
                          <div className="font-medium truncate">{item.title || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                      {accumulatedContent.length === 0 && (
                        <div className="px-3 py-2 text-sm text-gray-500 italic">
                          No accumulated content yet
                        </div>
                      )}
                      {accumulatedContent.length > 5 && (
                        <Button 
                          variant="ghost" 
                          className="w-full text-xs justify-start h-8"
                          onClick={() => setActiveSection('resources')}
                        >
                          View all ({accumulatedContent.length})
                        </Button>
                      )}
                    </div>
                  </>
                )}
                
                {/* Documentation section */}
                {!sidebarCollapsed && (
                  <>
                    <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
                    <div className="mb-2">
                      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documentation
                      </h3>
                    </div>
                  </>
                )}
                
                <div className="space-y-1">
                  {documentationSections.map((section) => (
                    <Tooltip key={section.id} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`w-full ${sidebarCollapsed ? 'justify-center px-0' : 'justify-start'} h-10`}
                        >
                          {section.icon}
                          {!sidebarCollapsed && <span className="ml-2 text-sm">{section.label}</span>}
                        </Button>
                      </TooltipTrigger>
                      {sidebarCollapsed && (
                        <TooltipContent side="right">
                          {section.label}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Main content area */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Problem description area - collapsible */}
            <div className={`border-b bg-white dark:bg-gray-900 ${minimizedProblem ? 'h-12' : 'h-32'} transition-all duration-300 shrink-0`}>
              <div className="p-3 flex flex-col h-full">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold text-base">
                      {problem.title}
                    </h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {problem.category}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Difficulty: {problem.difficulty}/5
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleProblemDescription}
                    className="shrink-0"
                  >
                    {minimizedProblem ? 'Expand' : 'Minimize'}
                  </Button>
                </div>
                
                {!minimizedProblem && (
                  <div className="mt-2 flex-1 overflow-y-auto text-sm">
                    <p>{problem.description}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Main active content area - flex-1 to take remaining height */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {activeSectionContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 