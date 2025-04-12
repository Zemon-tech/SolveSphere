"use client";

import { useState } from 'react';
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
  // Initial analysis sections - in a real app, these would come from an API or be generated
  const [sections, setSections] = useState<AnalysisSection[]>([
    {
      id: '1',
      title: 'Key Constraints',
      items: [
        { id: '1-1', content: 'Temperature range: -40°C to +60°C' },
        { id: '1-2', content: 'Minimum 85% efficiency across range' },
        { id: '1-3', content: 'Cost-effective (within 20% premium)' },
        { id: '1-4', content: 'Minimal maintenance' },
      ],
      collapsed: false
    },
    {
      id: '2',
      title: 'Performance Metrics',
      items: [
        { id: '2-1', content: 'Energy output consistency' },
        { id: '2-2', content: 'Thermal cycling durability' },
        { id: '2-3', content: 'Installation complexity' },
        { id: '2-4', content: 'Maintenance frequency' },
      ],
      collapsed: false
    },
    {
      id: '3',
      title: 'Stakeholders',
      items: [
        { id: '3-1', content: 'End-users' },
        { id: '3-2', content: 'Manufacturers' },
        { id: '3-3', content: 'Environmental agencies' },
        { id: '3-4', content: 'Regulatory bodies' },
      ],
      collapsed: false
    }
  ]);
  
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
  
  // Add a new section
  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    
    const newSection: AnalysisSection = {
      id: Date.now().toString(),
      title: newSectionTitle,
      items: [],
      collapsed: false
    };
    
    setSections([...sections, newSection]);
    setNewSectionTitle('');
    setIsAddSectionDialogOpen(false);
  };
  
  // Delete a section
  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };
  
  // Add a new item to a section
  const handleAddItem = () => {
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
    
    setNewItemContent('');
    setIsAddItemDialogOpen(false);
  };
  
  // Start editing an item
  const handleStartEditItem = (item: AnalysisItem) => {
    setEditingItemId(item.id);
    setEditingContent(item.content);
  };
  
  // Save edited item
  const handleSaveEditItem = (sectionId: string) => {
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
    
    setEditingItemId(null);
  };
  
  // Delete an item
  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    }));
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Card className="flex flex-col h-full overflow-hidden border-0 shadow-none">
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
                  <ul className="divide-y">
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
            onClick={() => {
              // In a real app, this would save to backend
              console.log('Saving analysis:', sections);
              // You could add a toast notification here
            }}
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Analysis</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 