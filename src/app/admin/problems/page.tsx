'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/app/lib/supabase';
import { useSupabase } from '../../providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { X, Edit, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// Problem type based on the image showing table structure
type Problem = {
  id: string;
  title: string;
  description: string;
  category: string[];
  difficulty: number;
  created_at: string;
  updated_at: string;
};

// Helper function to render category badges
function CategoryBadge({ category }: { category: string }) {
  const colors = {
    'Engineering': 'bg-blue-100 text-blue-800',
    'Finance': 'bg-purple-100 text-purple-800',
    'Technology': 'bg-indigo-100 text-indigo-800',
    'Space': 'bg-gray-100 text-gray-800',
    'Default': 'bg-slate-100 text-slate-800',
  };
  
  const colorClass = colors[category as keyof typeof colors] || colors['Default'];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {category}
    </span>
  );
}

export default function AdminProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    category: [''],
    difficulty: 1,
  });
  const [categoryInput, setCategoryInput] = useState('');
  const { user, isLoading } = useSupabase();
  const router = useRouter();
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Only redirect if not loading and user is not authenticated
    if (!isLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    // Only fetch problems if user is authenticated and loading is complete
    if (!isLoading && user) {
      fetchProblems();
    }
  }, [user, isLoading, router]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProblems(data || []);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProblem({
      ...newProblem,
      [name]: name === 'difficulty' ? parseInt(value) : value,
    });
  };

  const handleCategoryInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryInput(e.target.value);
  };

  const addCategory = () => {
    if (categoryInput.trim()) {
      setNewProblem({
        ...newProblem,
        category: [...newProblem.category, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const removeCategory = (index: number) => {
    setNewProblem({
      ...newProblem,
      category: newProblem.category.filter((_, i) => i !== index)
    });
  };

  const handleAddProblem = async () => {
    try {
      // Clean up empty categories
      const cleanedCategories = newProblem.category.filter(cat => cat.trim() !== '');
      
      // Ensure we always have at least one category - use "General" as default if none provided
      const categoriesToSave = cleanedCategories.length > 0 ? cleanedCategories : ["General"];
      
      const { error } = await supabase
        .from('problems')
        .insert([
          {
            title: newProblem.title,
            description: newProblem.description,
            category: categoriesToSave,
            difficulty: newProblem.difficulty,
          },
        ]);

      if (error) {
        console.error('Error adding problem:', error);
        throw error;
      }
      
      // Show success toast
      toast.success('Problem added successfully!');
      
      // Reset form and refresh problems
      setNewProblem({
        title: '',
        description: '',
        category: [''],
        difficulty: 1,
      });
      setCategoryInput('');
      
      fetchProblems();
    } catch (error) {
      console.error('Error adding problem:', error);
      toast.error('Failed to add problem. Please try again.');
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to get difficulty label
  const getDifficultyLabel = (level: number) => {
    const labels = {
      1: 'Beginner',
      2: 'Easy',
      3: 'Intermediate',
      4: 'Advanced',
      5: 'Expert',
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  };

  const handleDeleteClick = (id: string) => {
    setProblemToDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (!problemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('problems')
        .delete()
        .eq('id', problemToDelete);

      if (error) throw error;
      
      // Remove the problem from the state
      setProblems(problems.filter(problem => problem.id !== problemToDelete));
      
      // Show success toast
      toast.success('Problem deleted successfully!');
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('Failed to delete problem. Please try again.');
    } finally {
      // Clear the problemToDelete state
      setProblemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setProblemToDelete(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Problem Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Problem</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Problem</DialogTitle>
              <DialogDescription>
                Fill out the form below to create a new problem for users to solve.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-5 items-start gap-4">
                <Label htmlFor="title" className="text-right mt-2">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={newProblem.title}
                  onChange={handleInputChange}
                  className="col-span-4"
                />
              </div>
              <div className="grid grid-cols-5 items-start gap-4">
                <Label htmlFor="description" className="text-right mt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newProblem.description}
                  onChange={handleInputChange}
                  className="col-span-4 min-h-[200px]"
                />
              </div>
              <div className="grid grid-cols-5 items-start gap-4">
                <Label htmlFor="category" className="text-right mt-2">
                  Categories
                </Label>
                <div className="col-span-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      id="category"
                      value={categoryInput}
                      onChange={handleCategoryInputChange}
                      placeholder="Add a category"
                      className="flex-grow"
                    />
                    <Button type="button" onClick={addCategory} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProblem.category.map((cat, index) => 
                      cat.trim() && (
                        <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                          <span>{cat}</span>
                          <button 
                            type="button" 
                            onClick={() => removeCategory(index)} 
                            className="ml-2 text-blue-800 hover:text-blue-900"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-5 items-start gap-4">
                <Label htmlFor="difficulty" className="text-right mt-2">
                  Difficulty (1-5)
                </Label>
                <div className="col-span-4">
                  <Input
                    id="difficulty"
                    name="difficulty"
                    type="number"
                    min="1"
                    max="5"
                    value={newProblem.difficulty}
                    onChange={handleInputChange}
                    className="w-24"
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    1 = Beginner, 2 = Easy, 3 = Intermediate, 4 = Advanced, 5 = Expert
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-auto pt-4 border-t">
              <Button onClick={handleAddProblem} size="lg">Save Problem</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!problemToDelete} onOpenChange={(open) => !open && setProblemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this problem. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4">Loading problems...</p>
        </div>
      ) : (
        <>
          {problems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No problems found</p>
              <p className="text-gray-400 mt-2">Click 'Add Problem' to create your first problem challenge</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <Card key={problem.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div className="flex gap-2 flex-wrap mb-2">
                        {Array.isArray(problem.category) 
                          ? problem.category.map((cat, index) => (
                              <CategoryBadge key={index} category={cat} />
                            ))
                          : problem.category && <CategoryBadge category={problem.category} />
                        }
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          {
                            1: 'bg-green-100 text-green-800',
                            2: 'bg-green-100 text-green-800',
                            3: 'bg-yellow-100 text-yellow-800',
                            4: 'bg-orange-100 text-orange-800',
                            5: 'bg-red-100 text-red-800',
                          }[problem.difficulty] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {getDifficultyLabel(problem.difficulty)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {problem.id}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{problem.title}</CardTitle>
                    <CardDescription>
                      {problem.description.length > 150
                        ? `${problem.description.substring(0, 150)}...`
                        : problem.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      <div>Created: {formatDate(problem.created_at)}</div>
                      <div>Updated: {formatDate(problem.updated_at)}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 mt-auto">
                    <div className="flex w-full gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit size={16} className="mr-2" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(problem.id)}
                      >
                        <Trash size={16} className="mr-2" /> Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
} 