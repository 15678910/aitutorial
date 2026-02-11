import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import InlineQuiz from '../quiz/InlineQuiz'
import type { Quiz } from '../../types'

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
            <p className="text-[1.15rem] text-gray-700 leading-[2.1] mb-7 tracking-wide">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="my-8 space-y-4 pl-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-8 space-y-4 pl-2 list-none [counter-reset:item]">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[1.1rem] text-gray-700 leading-[2] flex items-start gap-3 tracking-wide">
              <span className="mt-[0.7rem] flex-shrink-0 w-2 h-2 rounded-full bg-accent" />
              <span className="flex-1">{children}</span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-extrabold text-primary bg-accent/5 px-1 rounded">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-10 pl-7 border-l-4 border-accent bg-gradient-to-r from-accent/8 to-transparent py-6 pr-7 rounded-r-2xl">
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
              <code className="bg-accent/10 text-primary px-2.5 py-1 rounded-lg text-[1rem] font-mono font-bold">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className="my-10 bg-[#1e1e2e] rounded-2xl p-7 overflow-x-auto text-[0.95rem] leading-relaxed text-[#cdd6f4] shadow-xl border border-gray-700/50 [&_code]:!text-[#cdd6f4] [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!rounded-none">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-10 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
              <table className="w-full text-[1rem]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1e1e2e] text-white">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left font-bold text-sm tracking-wide text-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 border-t border-gray-200 text-gray-800 bg-white">{children}</td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-surface hover:bg-accent/5 transition-colors">{children}</tr>
          ),
          a: ({ href, children }) => (
            <a href={href} className="text-accent font-bold underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          hr: () => <hr className="my-14 border-t-2 border-gray-100" />,
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
