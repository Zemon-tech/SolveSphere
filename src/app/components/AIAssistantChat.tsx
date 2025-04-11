"use client";

import { useState, useRef, useEffect } from 'react';
import { SendHorizonal, FileText, ArrowUp, Paperclip, ChevronDown, MoreVertical, Download, Copy, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
}

type MessageType = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isSearchResult?: boolean;
};

export function AIAssistantChat({ problemId, problemTitle }: AIAssistantChatProps) {
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

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
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
        problemTitle
      });
      
      // Add the AI response to the chat
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date(),
        }
      ]);
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
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 flex items-center">
            <Globe className="h-3 w-3 mr-1" />
            Web-enabled
          </span>
          <Button variant="ghost" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Chat messages - scrollable area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 min-h-0 overflow-y-auto py-4 px-4 space-y-4 bg-gray-50 dark:bg-gray-900/50"
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
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
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
                      <DropdownMenuItem>
                        <Copy className="h-3.5 w-3.5 mr-2" />
                        <span>Copy text</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-3.5 w-3.5 mr-2" />
                        <span>Save as note</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500 dark:text-red-400">
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
      
      {/* Input area - fixed at bottom */}
      <div className="shrink-0 border-t bg-white dark:bg-gray-900 p-3 z-10">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative rounded-md border shadow-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 dark:bg-gray-800">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (I can search the web if needed)"
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
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
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
          <div className="mt-1.5 flex justify-between items-center px-1 text-xs text-gray-500">
            <span>
              Use <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border">Shift + Enter</kbd> for a new line
            </span>
            <div className="flex items-center gap-1">
              <Globe className="h-3 w-3 mr-1" />
              <span>Web search available</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 