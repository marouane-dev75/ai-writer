import React from 'react';
import Markdown from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

/**
 * Component for rendering markdown content with proper formatting
 * Supports headings, lists, code blocks, bold, italic, links, etc.
 */
export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`markdown-preview ${className}`}>
      <Markdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-bold mb-1.5 text-gray-900 dark:text-gray-100">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold mb-1.5 text-gray-900 dark:text-gray-100">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm font-bold mb-1 text-gray-900 dark:text-gray-100">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-xs font-bold mb-1 text-gray-900 dark:text-gray-100">
              {children}
            </h6>
          ),
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-2 text-gray-800 dark:text-gray-200 last:mb-0">
              {children}
            </p>
          ),
          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-200">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-800 dark:text-gray-200">{children}</li>
          ),
          // Code
          code: ({ className, children }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className="block p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm font-mono overflow-x-auto">
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="mb-2 overflow-x-auto">{children}</pre>
          ),
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-400 dark:border-gray-600 pl-3 mb-2 italic text-gray-700 dark:text-gray-300">
              {children}
            </blockquote>
          ),
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          // Strong (bold)
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 dark:text-gray-100">
              {children}
            </strong>
          ),
          // Emphasis (italic)
          em: ({ children }) => (
            <em className="italic text-gray-800 dark:text-gray-200">
              {children}
            </em>
          ),
          // Horizontal rule
          hr: () => (
            <hr className="my-3 border-gray-300 dark:border-gray-600" />
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
