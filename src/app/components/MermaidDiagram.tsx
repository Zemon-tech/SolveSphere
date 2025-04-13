'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  content: string;
  className?: string;
}

export function MermaidDiagram({ content, className = '' }: MermaidDiagramProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramId = useRef(`mermaid-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    // Initialize mermaid with default config
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif',
      fontSize: 14,
    });
    
    const renderDiagram = async () => {
      if (!content || !containerRef.current) return;
      
      try {
        setError(null);
        // Reset the container
        containerRef.current.innerHTML = '';
        
        // Clean the content (remove whitespace, etc.)
        const cleanedContent = content.trim();
        
        // Render the diagram
        const { svg } = await mermaid.render(diagramId.current, cleanedContent);
        setSvgContent(svg);
      } catch (err: any) {
        console.error('Error rendering Mermaid diagram:', err);
        setError(`Error rendering diagram: ${err.message || 'Unknown error'}`);
      }
    };

    renderDiagram();
  }, [content]);

  if (error) {
    return (
      <div className={`p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800 text-sm ${className}`}>
        <div className="font-medium mb-1">Diagram Rendering Error</div>
        <div className="text-xs">{error}</div>
        <pre className="mt-2 p-2 bg-white dark:bg-gray-800 rounded overflow-x-auto text-xs">
          {content}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`mermaid-diagram ${className}`}
      dangerouslySetInnerHTML={svgContent ? { __html: svgContent } : undefined}
    />
  );
} 