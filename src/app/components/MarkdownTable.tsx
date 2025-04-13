'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownTableProps {
  content: string;
  className?: string;
  title?: string;
}

export function MarkdownTable({ content, className, title }: MarkdownTableProps) {
  // Extract the table rows and headers
  const [tableData, setTableData] = useState<{
    headers: string[];
    rows: string[][];
  }>({ headers: [], rows: [] });

  useEffect(() => {
    // Parse the markdown table
    const lines = content.trim().split('\n');
    
    // Filter out empty lines and make sure we have at least header and separator
    const validLines = lines.filter(line => line.trim() !== '');
    if (validLines.length < 2) return;

    // First line should be the header
    const headerLine = validLines[0];
    const headers = headerLine
      .split('|')
      .map(cell => cell.trim())
      .filter(cell => cell !== '');

    // Skip the separator line (line with dashes)
    const rows = validLines.slice(2).map(line => 
      line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '')
    );

    setTableData({ headers, rows });
  }, [content]);

  if (tableData.headers.length === 0) {
    // If we couldn't parse the table properly, fall back to standard ReactMarkdown
    return (
      <div className={cn("overflow-x-auto", className)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700", className)}>
      {title && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {tableData.headers.map((header, i) => (
                <th 
                  key={i} 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {tableData.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {row.map((cell, cellIndex) => {
                  const isNumeric = !isNaN(Number(cell.replace(/[,%$]/g, '')));
                  return (
                    <td 
                      key={cellIndex} 
                      className={cn(
                        "px-4 py-3 text-sm text-gray-900 dark:text-gray-200",
                        isNumeric ? "text-right" : "text-left",
                        // Responsive styling - reduce padding on small screens
                        "md:px-4 sm:px-3 xs:px-2"
                      )}
                      data-content-length={
                        cell.length > 50 ? 'large' : 
                        cell.length > 20 ? 'medium' : 
                        'small'
                      }
                    >
                      {/* Auto-scale the text size based on content length */}
                      <span className={cn(
                        cell.length > 50 ? "text-xs" : 
                        cell.length > 20 ? "text-sm" : 
                        "text-base"
                      )}>
                        {cell}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 