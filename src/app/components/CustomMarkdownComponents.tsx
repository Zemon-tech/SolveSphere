'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Custom components for ReactMarkdown
export const markdownComponents = {
  // Custom table component
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-4 w-full overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={cn("w-full border-collapse", className)} {...props} />
    </div>
  ),

  // Custom table head component
  thead: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("bg-gray-50 dark:bg-gray-800", className)} {...props} />
  ),

  // Custom table row component
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr 
      className={cn(
        "border-b border-gray-200 dark:border-gray-700 last:border-0",
        className
      )} 
      {...props} 
    />
  ),

  // Custom table header cell component
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
        className
      )}
      {...props}
    />
  ),

  // Custom table body component
  tbody: ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody 
      className={cn(
        "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800", 
        className
      )} 
      {...props} 
    />
  ),

  // Custom table cell component with automatic text sizing based on content
  td: ({ className, children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => {
    // Determine content length for responsive font sizing
    let content = '';
    if (typeof children === 'string') {
      content = children;
    } else if (Array.isArray(children)) {
      React.Children.forEach(children, child => {
        if (typeof child === 'string') {
          content += child;
        }
      });
    }
    
    const contentLength = content.length;
    const fontSize = contentLength > 50 ? 'text-xs' : 
                    contentLength > 20 ? 'text-sm' : 
                    'text-sm';
    
    // Check if content is numeric for right alignment
    const isNumeric = !isNaN(Number(content.replace(/[,%$]/g, '')));
    
    // Add data attribute for content length
    const contentLengthAttr = contentLength > 50 ? 'large' : 
                             contentLength > 20 ? 'medium' : 
                             'small';
    
    return (
      <td
        className={cn(
          "px-4 py-3",
          isNumeric ? "text-right" : "text-left",
          fontSize,
          "text-gray-900 dark:text-gray-200",
          // Responsive padding
          "md:px-4 sm:px-3 xs:px-2",
          className
        )}
        data-content-length={contentLengthAttr}
        {...props}
      >
        {children}
      </td>
    );
  },
}; 