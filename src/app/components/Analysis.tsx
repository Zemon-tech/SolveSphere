"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Share, Plus, Trash2, Edit, Save, Check, ChevronRight, ChevronDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/app/lib/supabase';
import { Spinner } from '@/components/ui/spinner';

// Analysis section type
type AnalysisSection = {
  id: string;
  title: string;
  items: AnalysisItem[];
  collapsed?: boolean;
};

// Analysis item type
type AnalysisItem = {
  id: string;
  content: string;
};

interface AnalysisProps {
  problemId: string;
}

export function Analysis({ problemId }: AnalysisProps) {
  const [sections, setSections] = useState<AnalysisSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for new section dialog
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  // State for new item dialog
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItemContent, setNewItemContent] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // State for editing
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Fetch analysis data from Supabase
  useEffect(() => {
    async function fetchAnalysis() {
      if (!problemId) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // Here, you would fetch the actual analysis from your database
        // For example:
        const { data, error } = await supabase
          .from('problem_analysis')
          .select('*')
          .eq('problem_id', problemId);
          
        if (error) {
          console.error('Error fetching analysis:', error);
          setError('Failed to load analysis data');
        } else if (data && data.length > 0) {
          // Transform the data into our section/item format
          // This will depend on your actual database structure
          
          // Example transformation assuming a flat structure:
          const transformedData = transformAnalysisData(data);
          setSections(transformedData);
        } else {
          // If no data, initialize with some empty default sections
          setSections([
            {
              id: '1',
              title: 'Key Constraints',
              items: [],
              collapsed: false
            },
            {
              id: '2',
              title: 'Performance Metrics',
              items: [],
              collapsed: false
            },
            {
              id: '3',
              title: 'Stakeholders',
              items: [],
              collapsed: false
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

    fetchAnalysis();
  }, [problemId]);

  // Helper function to transform data from database to our format
  // This will need to be adjusted based on your actual database schema
  const transformAnalysisData = (data: any[]): AnalysisSection[] => {
    // Example transformation logic - adjust as needed
    const sectionMap = new Map<string, AnalysisSection>();
    
    data.forEach(item => {
      const sectionId = item.section_id || item.id;
      const sectionTitle = item.section_title || 'Untitled Section';
      
      if (!sectionMap.has(sectionId)) {
        sectionMap.set(sectionId, {
          id: sectionId,
          title: sectionTitle,
          items: [],
          collapsed: false
        });
      }
      
      // Add items if they exist
      if (item.content) {
        const section = sectionMap.get(sectionId)!;
        section.items.push({
          id: `${sectionId}-item-${section.items.length + 1}`,
          content: item.content
        });
      }
    });
    
    return Array.from(sectionMap.values());
  };
  
  // Add a new section
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection: AnalysisSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      items: [],
      collapsed: false
    };
    
    setSections([...sections, newSection]);
    
    // Save to Supabase
    try {
      await supabase.from('problem_analysis').insert({
        problem_id: problemId,
        section_id: newSection.id,
        section_title: newSection.title,
      });
    } catch (error) {
      console.error('Error saving section:', error);
    }
    
    setNewSectionTitle('');
    setIsAddSectionDialogOpen(false);
  };
  
  // Delete a section
  const handleDeleteSection = async (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    
    // Delete from Supabase
    try {
      await supabase
        .from('problem_analysis')
        .delete()
        .match({ 
          problem_id: problemId,
          section_id: sectionId 
        });
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };
  
  // Add a new item to a section
  const handleAddItem = async () => {
    if (!newItemContent.trim() || !activeSection) return;
    
    const newItem: AnalysisItem = {
      id: `${activeSection}-${Date.now()}`,
      content: newItemContent
    };
    
    setSections(sections.map(section => {
      if (section.id === activeSection) {
        return {
          ...section,
          items: [...section.items, newItem]
        };
      }
      return section;
    }));
    
    // Save to Supabase
    try {
      await supabase.from('problem_analysis_items').insert({
        problem_id: problemId,
        section_id: activeSection,
        item_id: newItem.id,
        content: newItem.content
      });
    } catch (error) {
      console.error('Error saving item:', error);
    }
    
    setNewItemContent('');
    setIsAddItemDialogOpen(false);
  };
  
  // Start editing an item
  const handleStartEditItem = (item: AnalysisItem) => {
    setEditingItemId(item.id);
    setEditingContent(item.content);
  };
  
  // Save edited item
  const handleSaveEditItem = async (sectionId: string) => {
    if (!editingItemId) return;
    
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === editingItemId) {
              return {
                ...item,
                content: editingContent
              };
            }
            return item;
          })
        };
      }
      return section;
    }));
    
    // Update in Supabase
    try {
      await supabase
        .from('problem_analysis_items')
        .update({ content: editingContent })
        .match({ 
          problem_id: problemId,
          section_id: sectionId,
          item_id: editingItemId 
        });
    } catch (error) {
      console.error('Error updating item:', error);
    }
    
    setEditingItemId(null);
  };
  
  // Delete an item
  const handleDeleteItem = async (sectionId: string, itemId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
    
    // Delete from Supabase
    try {
      await supabase
        .from('problem_analysis_items')
        .delete()
        .match({ 
          problem_id: problemId,
          section_id: sectionId,
          item_id: itemId 
        });
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  
  // Toggle section collapse
  const handleToggleSection = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          collapsed: !section.collapsed
        };
      }
      return section;
    }));
  };

  // Save all analysis data
  const handleSaveAnalysis = async () => {
    try {
      // You could save the entire analysis state here if needed
      console.log('Saving analysis:', sections);
      
      // Example approach to save all sections and items
      for (const section of sections) {
        // Upsert the section
        await supabase
          .from('problem_analysis')
          .upsert({
            problem_id: problemId,
            section_id: section.id,
            section_title: section.title,
          });
          
        // Handle items
        for (const item of section.items) {
          await supabase
            .from('problem_analysis_items')
            .upsert({
              problem_id: problemId,
              section_id: section.id,
              item_id: item.id,
              content: item.content
            });
        }
      }
      
      // Show success notification (you could add a toast here)
    } catch (error) {
      console.error('Error saving analysis:', error);
      // Show error notification
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
        <span className="ml-2">Loading analysis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">{error}</h2>
        <p className="mb-4">We couldn't load the analysis data.</p>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Problem Analysis</CardTitle>
              <CardDescription>Break down the problem into components and track key aspects</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Section</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Analysis Section</DialogTitle>
                    <DialogDescription>
                      Create a new section to organize your problem analysis.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="section-title">Section Title</Label>
                    <Input 
                      id="section-title" 
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="e.g., Technical Requirements"
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddSectionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSection}>
                      Add Section
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Share className="h-3.5 w-3.5" />
                <span>Share Analysis</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.id} className="border rounded-lg overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800">
                  <button 
                    className="flex-1 flex items-center text-left font-medium"
                    onClick={() => handleToggleSection(section.id)}
                  >
                    <h3 className="text-sm font-medium">{section.title}</h3>
                    {section.collapsed ? (
                      <ChevronRight className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <Dialog open={activeSection === section.id && isAddItemDialogOpen} onOpenChange={(open) => {
                      setIsAddItemDialogOpen(open);
                      if (open) setActiveSection(section.id);
                      else setActiveSection(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Item to {section.title}</DialogTitle>
                          <DialogDescription>
                            Add a new item to this analysis section.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="item-content">Item Content</Label>
                          <textarea 
                            id="item-content" 
                            value={newItemContent}
                            onChange={(e) => setNewItemContent(e.target.value)}
                            placeholder="Enter item content..."
                            className="w-full rounded-md border border-gray-300 p-2 mt-2 min-h-[100px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddItem}>
                            Add Item
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 text-red-500 dark:text-red-400"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                
                {!section.collapsed && (
                  <ul className="divide-y max-h-[300px] overflow-y-auto">
                    {section.items.map((item) => (
                      <li key={item.id} className="p-3 flex items-start gap-3">
                        {editingItemId === item.id ? (
                          <>
                            <div className="flex-1">
                              <textarea 
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="text-sm min-h-[60px] w-full rounded-md border border-gray-300 p-2"
                              />
                            </div>
                            <div className="flex items-center gap-1 shrink-0 mt-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-green-500"
                                onClick={() => handleSaveEditItem(section.id)}
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 text-sm">{item.content}</div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleStartEditItem(item)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 w-7 p-0 text-red-500 dark:text-red-400"
                                onClick={() => handleDeleteItem(section.id, item.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                    {section.items.length === 0 && (
                      <li className="p-3 text-sm text-gray-500 italic">
                        No items in this section. Add some using the + button.
                      </li>
                    )}
                  </ul>
                )}
              </div>
            ))}
          </div>
          
          {sections.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                No analysis sections yet. Add some to start breaking down the problem.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddSectionDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add First Section</span>
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-3 border-t shrink-0 bg-white dark:bg-gray-900 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Analysis helps you break down complex problems
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleSaveAnalysis}
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Analysis</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 