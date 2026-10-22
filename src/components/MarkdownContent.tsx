// Reusable markdown renderer for all AI-generated text in SomoPal.
// Uses react-markdown + remark-gfm for full GFM support (tables, bold,
// code blocks, lists, blockquotes, strikethrough, etc.)
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface MarkdownContentProps {
  /** Raw markdown string to render */
  content: string
  /** Optional extra CSS classes for the wrapper */
  className?: string
  /** Use compact sizing (e.g. inside quiz cards) */
  compact?: boolean
}

const makeComponents = (compact: boolean): Components => ({
  // Headings
  h1: ({ children }) => (
    <h1 className={`font-display font-bold text-[var(--text-main)] ${compact ? 'mb-1.5 text-base' : 'mb-2 text-lg'}`}>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className={`font-display font-bold text-[var(--text-main)] ${compact ? 'mb-1 mt-2 text-sm' : 'mb-1.5 mt-3 text-base'}`}>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className={`font-semibold text-[var(--text-main)] ${compact ? 'mb-1 mt-1.5 text-xs' : 'mb-1 mt-2.5 text-sm'}`}>
      {children}
    </h3>
  ),

  // Paragraphs
  p: ({ children }) => (
    <p className={`text-[var(--text-main)] leading-relaxed ${compact ? 'mb-1 text-xs' : 'mb-2 text-sm'}`}>
      {children}
    </p>
  ),

  // Bold / Italic
  strong: ({ children }) => (
    <strong className="font-semibold text-[var(--text-main)]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[var(--text-muted)]">{children}</em>
  ),

  // Unordered list
  ul: ({ children }) => (
    <ul className={`list-disc pl-4 text-[var(--text-main)] ${compact ? 'mb-1 space-y-0.5 text-xs' : 'mb-2 space-y-1 text-sm'}`}>
      {children}
    </ul>
  ),

  // Ordered list
  ol: ({ children }) => (
    <ol className={`list-decimal pl-4 text-[var(--text-main)] ${compact ? 'mb-1 space-y-0.5 text-xs' : 'mb-2 space-y-1 text-sm'}`}>
      {children}
    </ol>
  ),

  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),

  // Blockquote (used for analogies / callouts)
  blockquote: ({ children }) => (
    <blockquote className={`my-2 border-l-4 border-teal-500 pl-3 italic text-[var(--text-muted)] ${compact ? 'text-xs' : 'text-sm'}`}>
      {children}
    </blockquote>
  ),

  // Inline code
  code: ({ children, className }) => {
    const isBlock = className?.startsWith('language-')
    if (isBlock) {
      return (
        <pre className={`my-2 overflow-x-auto rounded-xl bg-[var(--bg-surface)] p-3 font-mono ${compact ? 'text-[10px]' : 'text-xs'}`}>
          <code className="text-teal-700 dark:text-teal-300">{children}</code>
        </pre>
      )
    }
    return (
      <code className="rounded bg-teal-100/70 px-1 py-0.5 font-mono text-[0.8em] text-teal-800 dark:bg-teal-900/50 dark:text-teal-200">
        {children}
      </code>
    )
  },

  // Horizontal rule
  hr: () => <hr className="my-3 border-[var(--border-subtle)]" />,

  // Table (GFM)
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
      <table className="w-full text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[var(--bg-surface)] text-[var(--text-muted)]">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-[var(--border-subtle)]">{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th className={`px-3 py-2 font-semibold ${compact ? 'text-[10px]' : 'text-xs'}`}>{children}</th>
  ),
  td: ({ children }) => (
    <td className={`px-3 py-2 text-[var(--text-main)] ${compact ? 'text-[10px]' : 'text-xs'}`}>{children}</td>
  ),

  // Links — open externally, never navigate away from app
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-teal-600 underline underline-offset-2 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200"
    >
      {children}
    </a>
  ),
})

export function MarkdownContent({ content, className = '', compact = false }: MarkdownContentProps) {
  return (
    <div className={`markdown-content leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={makeComponents(compact)}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
