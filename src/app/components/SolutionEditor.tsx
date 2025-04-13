"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bold, Italic, List, ListOrdered, Image, Link as LinkIcon, Code, Save, Download } from 'lucide-react';

interface SolutionEditorProps {
  problemId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

export function SolutionEditor({ problemId, initialContent = '', onSave }: SolutionEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave(content);
      }
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      <Card className="flex flex-col h-full min-h-0 overflow-hidden border-0 shadow-none">
        <CardHeader className="p-3 border-b shrink-0 bg-white dark:bg-gray-900 z-10">
          <CardTitle className="text-base">Your Solution</CardTitle>
        </CardHeader>
        
        <div className="p-1.5 border-b bg-gray-50 dark:bg-gray-900 flex flex-wrap gap-1 shrink-0 z-10">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Image className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Code className="h-4 w-4" />
          </Button>
        </div>
        
        <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full px-4 py-3 resize-none border-0 focus:outline-none focus:ring-0 dark:bg-gray-950 overflow-auto"
            placeholder="Start writing your solution here..."
          ></textarea>
        </CardContent>
        
        <CardFooter className="p-3 border-t flex justify-between items-center shrink-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center text-xs text-gray-500">
            <span>Auto-saving draft</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button 
              size="sm"
              className="flex items-center gap-1"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 