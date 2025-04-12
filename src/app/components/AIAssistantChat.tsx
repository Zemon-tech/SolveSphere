"use client";

import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, FileText, ArrowUp, Paperclip, ChevronDown, MoreVertical, Download, Copy, Trash2, Globe, Image, BarChart, Calculator, FileQuestion, BadgeInfo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import axios from 'axios';

// Optional prism.js for code highlighting
// import Prism from 'prismjs';
// import 'prismjs/themes/prism.css';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-bash';

interface AIAssistantChatProps {
  problemId?: string;
  problemTitle?: string;
  accumulatedContent?: ContentItem[];
  setAccumulatedContent?: React.Dispatch<React.SetStateAction<ContentItem[]>>;
}

// Type for message content
type MessageType = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isSearchResult?: boolean;
  attachments?: ContentItem[];
};

// Type for accumulated content
type ContentItem = {
  id: string;
  type: 'image' | 'formula' | 'graph' | 'table' | 'research' | 'flowchart' | 'note';
  content: string;
  title?: string;
  timestamp: Date;
  sourceMessageId?: string;
};

export function AIAssistantChat({ 
  problemId, 
  problemTitle,
  accumulatedContent: propAccumulatedContent,
  setAccumulatedContent: propSetAccumulatedContent
}: AIAssistantChatProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to SolveSphere AI Assistant',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'assistant',
      content: `I'm your AI problem-solving assistant for **${problemTitle || 'this problem'}**. I can help guide you through the problem without giving away the solution directly.

Some ways I can help:
- Break down complex problems into manageable parts
- Ask probing questions to help you think critically
- Suggest approaches to consider
- Provide relevant information when needed
- Help you evaluate your own solutions

How would you like to approach this problem?`,
      timestamp: new Date(),
    },
  ]);

  // State for accumulated content - use props if provided, otherwise use local state
  const [localAccumulatedContent, setLocalAccumulatedContent] = useState<ContentItem[]>([]);
  
  // Use either the prop functions or the local state functions
  const accumulatedContent = propAccumulatedContent !== undefined ? propAccumulatedContent : localAccumulatedContent;
  const setAccumulatedContent = propSetAccumulatedContent || setLocalAccumulatedContent;
  
  const [showAccumulationPanel, setShowAccumulationPanel] = useState<boolean>(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGeneratingSolution, setIsGeneratingSolution] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Format timestamp consistently for both server and client
  const formatTimestamp = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  // Handle file upload button
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      
      // Add a message about the uploaded files
      const fileNames = filesArray.map(file => file.name).join(', ');
      setInput(prev => prev + `\n\nI've uploaded: ${fileNames}`);
      
      // Reset the file input to allow uploading the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Extract content from AI responses
  const extractContent = (messageId: string, content: string) => {
    const newItems: ContentItem[] = [];
    
    // Extract formulas (text between $$ delimiters)
    const formulaRegex = /\$\$(.*?)\$\$/gs;
    const formulas = [...content.matchAll(formulaRegex)];
    formulas.forEach((match, index) => {
      newItems.push({
        id: `formula-${Date.now()}-${index}`,
        type: 'formula',
        content: match[1],
        title: `Formula ${index + 1}`,
        timestamp: new Date(),
        sourceMessageId: messageId
      });
    });
    
    // Extract tables (markdown tables)
    const tableRegex = /(\|.*\|[\r\n])+/g;
    const tables = [...content.matchAll(tableRegex)];
    tables.forEach((match, index) => {
      newItems.push({
        id: `table-${Date.now()}-${index}`,
        type: 'table',
        content: match[0],
        title: `Table ${index + 1}`,
        timestamp: new Date(),
        sourceMessageId: messageId
      });
    });
    
    // Extract research (paragraphs starting with "Research:" or "Study:")
    const researchRegex = /(Research:|Study:)([^\n]+(\n+[^\n#]+)*)/g;
    const research = [...content.matchAll(researchRegex)];
    research.forEach((match, index) => {
      newItems.push({
        id: `research-${Date.now()}-${index}`,
        type: 'research',
        content: match[0],
        title: `Research Summary ${index + 1}`,
        timestamp: new Date(),
        sourceMessageId: messageId
      });
    });
    
    // If there are new items, add them to the accumulated content
    if (newItems.length > 0) {
      setAccumulatedContent(prev => [...prev, ...newItems]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() && uploadedFiles.length === 0) return;
    
    // Add user message
    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    try {
      // Prepare messages for API (excluding system messages)
      const apiMessages = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role,
          content: m.content
        }));
      
      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: input
      });
      
      // Make API request to our chat endpoint
      const response = await axios.post('/api/chat', {
        messages: apiMessages,
        problemId,
        problemTitle,
        generateContent: true
      });
      
      const assistantMessageId = (Date.now() + 1).toString();
      
      // Add the AI response to the chat
      setMessages(prev => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date(),
        }
      ]);
      
      // Extract and accumulate content from the response
      extractContent(assistantMessageId, response.data.content);
      
    } catch (error) {
      console.error('Error fetching response:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsLoading(false);
      setUploadedFiles([]);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Generate final solution from chat and accumulated content
  const generateSolution = async () => {
    setIsGeneratingSolution(true);
    
    try {
      // Prepare data for solution generation
      const solutionData = {
        messages: messages.filter(m => m.role !== 'system'),
        accumulatedContent,
        problemId,
        problemTitle
      };
      
      // Call solution generation API
      const response = await axios.post('/api/generate-solution', solutionData);
      
      // Here, you would typically update the solution in the database
      // and possibly redirect to the solution view
      
      // For now, show a success message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I've generated a solution based on our discussion. You can now view it in the Solution Editor tab.",
          timestamp: new Date(),
        }
      ]);
      
    } catch (error) {
      console.error('Error generating solution:', error);
      
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "I'm sorry, I encountered an error while generating the solution. Please try again later.",
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsGeneratingSolution(false);
    }
  };

  // Toggle accumulation panel
  const toggleAccumulationPanel = () => {
    setShowAccumulationPanel(!showAccumulationPanel);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Chat header - fixed at top */}
      <div className="shrink-0 p-3 border-b flex items-center justify-between bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium">AI Problem-Solving Assistant</h3>
            <p className="text-xs text-gray-500">Guiding through problem-solving without giving away solutions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-blue-600 flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            Web-enabled
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={generateSolution}
            disabled={isGeneratingSolution}
          >
            {isGeneratingSolution ? 'Generating...' : 'Generate Solution'}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleAccumulationPanel}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content area with chat and accumulation panel */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Chat messages - scrollable area */}
        <div 
          ref={chatContainerRef}
          className={`flex-1 min-h-0 overflow-y-auto py-4 px-4 space-y-4 bg-gray-50 dark:bg-gray-900/50 ${showAccumulationPanel ? 'w-3/5' : 'w-full'}`}
        >
          {messages.filter(m => m.role !== 'system').map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border shadow-sm'
              }`}>
                <div className="p-3">
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose dark:prose-invert prose-sm max-w-none">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className={`flex items-center justify-between px-3 py-1.5 border-t ${
                  message.role === 'user'
                    ? 'border-blue-500'
                    : 'border-gray-100 dark:border-gray-700'
                }`}>
                  <span className="text-xs opacity-70">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  
                  {message.role === 'assistant' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          // You can add a toast notification here if you have a toast system
                        }}>
                          <Copy className="h-3.5 w-3.5 mr-2" />
                          <span>Copy text</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          // Add this message as a note in accumulated content
                          const newNote: ContentItem = {
                            id: `note-${Date.now()}`,
                            type: 'note',
                            content: message.content,
                            title: `Note from AI (${formatTimestamp(message.timestamp)})`,
                            timestamp: new Date(),
                            sourceMessageId: message.id
                          };
                          setAccumulatedContent(prev => [...prev, newNote]);
                          // You can add a toast notification here if you have a toast system
                        }}>
                          <Download className="h-3.5 w-3.5 mr-2" />
                          <span>Save as note</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-500 dark:text-red-400"
                          onClick={() => {
                            // Delete this message
                            setMessages(prev => prev.filter(m => m.id !== message.id));
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-2" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 border rounded-lg px-4 py-2 shadow-sm">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                  <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Accumulation panel */}
        {showAccumulationPanel && (
          <div className="w-2/5 border-l bg-white dark:bg-gray-900 flex flex-col h-full min-h-0">
            <div className="shrink-0 p-3 border-b">
              <h3 className="font-semibold text-sm">Accumulated Content</h3>
            </div>
            <Tabs defaultValue="visuals" className="flex-1 min-h-0 flex flex-col">
              <TabsList className="shrink-0 mx-3 mt-2 mb-1 grid grid-cols-4">
                <TabsTrigger value="visuals" className="text-xs flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  <span>Visuals</span>
                </TabsTrigger>
                <TabsTrigger value="data" className="text-xs flex items-center gap-1">
                  <BarChart className="h-3 w-3" />
                  <span>Data & Charts</span>
                </TabsTrigger>
                <TabsTrigger value="research" className="text-xs flex items-center gap-1">
                  <FileQuestion className="h-3 w-3" />
                  <span>Research</span>
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs flex items-center gap-1">
                  <BadgeInfo className="h-3 w-3" />
                  <span>Notes</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visuals" className="flex-1 overflow-y-auto p-3 space-y-3">
                {accumulatedContent.filter(item => item.type === 'image' || item.type === 'flowchart').length > 0 ? (
                  accumulatedContent
                    .filter(item => item.type === 'image' || item.type === 'flowchart')
                    .map(item => (
                      <div key={item.id} className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-sm text-gray-500 italic text-center mt-12">
                    No visuals yet. They'll appear here when generated.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="data" className="flex-1 overflow-y-auto p-3 space-y-3">
                {accumulatedContent.filter(item => item.type === 'graph' || item.type === 'table' || item.type === 'formula').length > 0 ? (
                  accumulatedContent
                    .filter(item => item.type === 'graph' || item.type === 'table' || item.type === 'formula')
                    .map(item => (
                      <div key={item.id} className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        {item.type === 'formula' ? (
                          <div className="bg-white dark:bg-gray-900 p-2 rounded border">
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
                          <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-sm text-gray-500 italic text-center mt-12">
                    No data or charts yet. They'll appear here when generated.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="research" className="flex-1 overflow-y-auto p-3 space-y-3">
                {accumulatedContent.filter(item => item.type === 'research').length > 0 ? (
                  accumulatedContent
                    .filter(item => item.type === 'research')
                    .map(item => (
                      <div key={item.id} className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        <div className="text-sm">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {item.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-sm text-gray-500 italic text-center mt-12">
                    No research summaries yet. They'll appear here when generated.
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="notes" className="flex-1 overflow-y-auto p-3 space-y-3">
                {accumulatedContent.filter(item => item.type === 'note').length > 0 ? (
                  accumulatedContent
                    .filter(item => item.type === 'note')
                    .map(item => (
                      <div key={item.id} className="border rounded-md p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        <div className="text-sm whitespace-pre-wrap">{item.content}</div>
                      </div>
                    ))
                ) : (
                  <div className="text-sm text-gray-500 italic text-center mt-12">
                    No notes yet. They'll appear here when saved.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      
      {/* Input area - fixed at bottom */}
      <div className="shrink-0 border-t bg-white dark:bg-gray-900 p-3 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative rounded-md border shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-800">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (I can search the web and generate content if needed)"
              className="block w-full resize-none px-3 py-2 pr-14 border-0 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0 sm:text-sm sm:leading-6 max-h-32"
              style={{ minHeight: '44px' }}
              rows={1}
            />
            <div className="absolute right-2 bottom-1.5 flex space-x-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onClick={handleFileUploadClick}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={(!input.trim() && uploadedFiles.length === 0) || isLoading}
                className="h-8 w-8 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700"
              >
                {isLoading ? (
                  <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
          
          <div className="mt-1.5 flex justify-between items-center px-1 text-xs text-gray-500">
            <span>
              Use <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border">Shift + Enter</kbd> for a new line
            </span>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 mr-1" />
              <span>Web search and content generation available</span>
            </div>
          </div>
          
          {/* File upload display */}
          {uploadedFiles.length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex flex-wrap gap-2 mt-1">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 