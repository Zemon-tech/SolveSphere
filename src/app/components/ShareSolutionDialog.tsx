"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { 
  Share, 
  Lock, 
  Globe, 
  Users, 
  Eye, 
  Download,
  Check
} from "lucide-react";

interface ShareSolutionDialogProps {
  problemId: string;
  problemTitle: string;
  trigger?: React.ReactNode;
}

export function ShareSolutionDialog({ 
  problemId, 
  problemTitle,
  trigger 
}: ShareSolutionDialogProps) {
  const [isPublic, setIsPublic] = React.useState(false);
  const [isSharingComplete, setIsSharingComplete] = React.useState(false);
  const [isSharing, setIsSharing] = React.useState(false);
  
  const handleShare = () => {
    setIsSharing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSharing(false);
      setIsSharingComplete(true);
    }, 1500);
  };
  
  const resetDialog = () => {
    setIsSharingComplete(false);
    setIsPublic(false);
  };
  
  return (
    <Dialog onOpenChange={(open) => !open && resetDialog()}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-1">
            <Share className="h-4 w-4" />
            <span>Share Solution</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!isSharingComplete ? (
          <>
            <DialogHeader>
              <DialogTitle>Share your solution</DialogTitle>
              <DialogDescription>
                Share your solution to "{problemTitle}" with the SolveSphere community.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="solution-visibility" className="text-left">
                    Make solution public
                  </Label>
                  <p className="text-xs text-gray-500">
                    Allow other users to view and learn from your solution
                  </p>
                </div>
                <Switch
                  id="solution-visibility"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <span>Visibility:</span>
                  {isPublic ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Globe className="h-3.5 w-3.5" />
                      Public
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600">
                      <Lock className="h-3.5 w-3.5" />
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {isPublic 
                    ? "Your solution will be visible to all SolveSphere users and can appear in community rankings."
                    : "Your solution will only be visible to you and platform administrators."
                  }
                </p>
              </div>
              
              {isPublic && (
                <div className="space-y-3">
                  <Label htmlFor="solution-title">Solution Title</Label>
                  <Input
                    id="solution-title"
                    placeholder="Enter a title for your solution"
                    defaultValue={`Solution to ${problemTitle}`}
                  />
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <Eye className="h-3.5 w-3.5 mr-1" />
                <span>Community solutions help everyone learn</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" type="button">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  {isSharing ? "Sharing..." : "Share Solution"}
                </Button>
              </div>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Solution shared successfully!</DialogTitle>
              <DialogDescription>
                {isPublic 
                  ? "Your solution is now available to the SolveSphere community."
                  : "Your solution has been saved privately."
                }
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                className="w-full"
                onClick={() => {
                  // Close dialog after completion
                  const closeButton = document.querySelector('[data-state="open"] button[data-state="closed"]');
                  if (closeButton && closeButton instanceof HTMLElement) {
                    closeButton.click();
                  }
                }}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
} 