import { useState, type ReactNode } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import InlineQuiz from '../quiz/InlineQuiz'
import GlossaryHighlighter from '../glossary/GlossaryHighlighter'
import type { Quiz } from '../../types'

function CodeBlockWithCopy({ code, children }: { code: string; children: ReactNode }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    // Filter out comment lines (starting with #) and empty lines, copy only commands
    const commandsOnly = code
      .trim()
      .split('\n')
      .filter(line => {
        const trimmed = line.trimStart()
        return trimmed.length > 0 && !trimmed.startsWith('#') && !trimmed.startsWith('//')
      })
      .join('\n')
      .trim()

    const textToCopy = commandsOnly || code.trim()

    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = textToCopy
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="group relative my-10">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600"
        aria-label="코드 복사"
      >
        {copied ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            복사됨!
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            복사
          </>
        )}
      </button>
      <pre className="bg-[#1e1e2e] rounded-2xl p-7 overflow-x-auto text-[0.95rem] leading-relaxed text-[#cdd6f4] shadow-xl border border-gray-700/50 [&_code]:!text-[#cdd6f4] [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!rounded-none">
        {children}
      </pre>
    </div>
  )
}

interface SectionContentProps {
  content: string
  quizzes?: Quiz[]
}

export default function SectionContent({ content, quizzes = [] }: SectionContentProps) {
  // Split content by quiz markers <!-- QUIZ:quiz_id -->
  const quizPattern = /<!-- QUIZ:(\S+) -->/g
  const parts: Array<{ type: 'text'; content: string } | { type: 'quiz'; quizId: string }> = []
  let lastIndex = 0
  let match

  while ((match = quizPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: content.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'quiz', quizId: match[1] })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'text', content: content.slice(lastIndex) })
  }

  // If no markers found, render as before (single text block)
  if (parts.length === 0) {
    parts.push({ type: 'text', content })
  }

  const quizMap = new Map(quizzes.map(q => [q.id, q]))

  const renderMarkdown = (text: string, key: number) => (
    <article key={key} className="max-w-none" role="article">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="text-[2rem] font-extrabold text-primary mt-20 mb-8 pb-4 border-b-3 border-accent/20">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[1.4rem] font-extrabold text-gray-900 mt-14 mb-5 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-accent rounded-full inline-block flex-shrink-0" />
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-[1.2rem] font-bold text-gray-800 mt-10 mb-4">{children}</h4>
          ),
          p: ({ children }) => (
            <p className="text-[1.1rem] text-gray-600 leading-[2] mb-8 tracking-normal">
              <GlossaryHighlighter>{children}</GlossaryHighlighter>
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-8 space-y-4 pl-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-8 space-y-4 pl-2 list-none [counter-reset:item]">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[1.05rem] text-gray-600 leading-[1.9] flex items-start gap-3 tracking-normal">
              <span className="mt-[0.7rem] flex-shrink-0 w-2 h-2 rounded-full bg-accent" />
              <span className="flex-1">
                <GlossaryHighlighter>{children}</GlossaryHighlighter>
              </span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900 bg-amber-50 px-1.5 py-0.5 rounded-md">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-10 pl-7 border-l-4 border-accent/60 bg-accent/5 py-6 pr-7 rounded-r-2xl shadow-sm">
              <div className="text-gray-600 text-[1.1rem] italic leading-relaxed">{children}</div>
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            // Check if this code is inside a pre (block code) by checking node's parent
            const node = (props as any).node
            const isInsidePre = node?.parent?.tagName === 'pre' || node?.parentNode?.tagName === 'pre'
            const isBlock = className?.includes('language-') || isInsidePre
            if (isBlock) {
              return <code className={`${className || ''} block text-[#cdd6f4]`}>{children}</code>
            }
            return (
              <code className="bg-gray-100 text-rose-600 px-2 py-0.5 rounded-md text-[0.95rem] font-mono font-semibold border border-gray-200">
                {children}
              </code>
            )
          },
          pre: ({ children }) => {
            const extractText = (node: any): string => {
              if (typeof node === 'string') return node
              if (Array.isArray(node)) return node.map(extractText).join('')
              if (node?.props?.children) return extractText(node.props.children)
              return ''
            }
            const codeText = extractText(children)
            return <CodeBlockWithCopy code={codeText}>{children}</CodeBlockWithCopy>
          },
          table: ({ children }) => (
            <div className="my-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-[1rem]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 text-gray-900 border-b-2 border-gray-200">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left font-semibold text-sm tracking-wide text-gray-700">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 border-t border-gray-200 text-gray-800 bg-white">
              <GlossaryHighlighter>{children}</GlossaryHighlighter>
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-surface hover:bg-accent/5 transition-colors">{children}</tr>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-accent font-bold underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          hr: () => <hr className="my-16 border-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />,
        }}
      >
        {text}
      </Markdown>
    </article>
  )

  return (
    <div>
      {parts.map((part, i) => {
        if (part.type === 'text') {
          return renderMarkdown(part.content, i)
        }
        const quiz = quizMap.get(part.quizId)
        if (!quiz) return null
        return <InlineQuiz key={i} quiz={quiz} />
      })}
    </div>
  )
}
