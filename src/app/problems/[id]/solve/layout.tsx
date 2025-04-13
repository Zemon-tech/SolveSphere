"use client"

import { useEffect } from "react";

export default function SolveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hide the nav and footer using CSS when in solve mode
  useEffect(() => {
    // Add a class to the body to hide nav and footer
    document.body.classList.add('solve-page');
    
    // Add the CSS to the document if it doesn't exist
    if (!document.getElementById('solve-page-styles')) {
      const style = document.createElement('style');
      style.id = 'solve-page-styles';
      style.innerHTML = `
        body.solve-page {
          overflow: hidden;
          height: 100vh;
          margin: 0;
          padding: 0;
        }
        body.solve-page header,
        body.solve-page footer,
        body.solve-page nav {
          display: none !important;
        }
        .solve-page-wrapper {
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up
      document.body.classList.remove('solve-page');
      const style = document.getElementById('solve-page-styles');
      if (style) style.remove();
    };
  }, []);

  return (
    <div className="solve-page-wrapper">
      {children}
    </div>
  );
} 