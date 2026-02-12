import { Fragment, type ReactNode, cloneElement } from 'react'
import { glossary } from '../../lib/glossary'
import GlossaryTooltip from './GlossaryTooltip'

interface GlossaryHighlighterProps {
  children: ReactNode
}

export default function GlossaryHighlighter({ children }: GlossaryHighlighterProps) {
  // Track which terms have been highlighted to avoid duplicates
  const highlightedTerms = new Set<string>()

  function processText(text: string): ReactNode[] {
    if (!text || typeof text !== 'string') {
      return [text]
    }

    const parts: ReactNode[] = []
    let remainingText = text
    let searchIndex = 0

    // Sort glossary by term length (longest first) to prioritize longer matches
    const sortedGlossary = [...glossary].sort((a, b) => {
      const aMaxLength = Math.max(
        a.term.length,
        ...(a.aliases?.map((alias) => alias.length) || [])
      )
      const bMaxLength = Math.max(
        b.term.length,
        ...(b.aliases?.map((alias) => alias.length) || [])
      )
      return bMaxLength - aMaxLength
    })

    while (searchIndex < remainingText.length) {
      let foundMatch = false

      // Try to find a match starting at the current search index
      for (const entry of sortedGlossary) {
        const termsToCheck = [entry.term, ...(entry.aliases || [])]

        for (const termToCheck of termsToCheck) {
          const lowerTerm = termToCheck.toLowerCase()
          const lowerRemaining = remainingText.slice(searchIndex).toLowerCase()

          // Check if the term appears at the current position
          if (lowerRemaining.startsWith(lowerTerm)) {
            // Check if we've already highlighted this term
            const normalizedTerm = entry.term.toLowerCase()
            if (highlightedTerms.has(normalizedTerm)) {
              // Skip this match and continue searching
              continue
            }

            // Check if this is a whole word match (not part of a larger word)
            const charBefore = searchIndex > 0 ? remainingText[searchIndex - 1] : ' '
            const charAfter =
              searchIndex + termToCheck.length < remainingText.length
                ? remainingText[searchIndex + termToCheck.length]
                : ' '

            const isWordBoundaryBefore = /[\s\n\r.,;:!?()[\]{}'"<>]/.test(charBefore)
            const isWordBoundaryAfter = /[\s\n\r.,;:!?()[\]{}'"<>]/.test(charAfter)

            if (isWordBoundaryBefore && isWordBoundaryAfter) {
              // Add the text before the match
              if (searchIndex > 0) {
                parts.push(remainingText.slice(0, searchIndex))
              }

              // Add the matched term as a tooltip
              const matchedText = remainingText.slice(searchIndex, searchIndex + termToCheck.length)
              parts.push(
                <GlossaryTooltip
                  key={`${entry.term}-${parts.length}`}
                  term={matchedText}
                  entry={entry}
                >
                  {matchedText}
                </GlossaryTooltip>
              )

              // Mark this term as highlighted
              highlightedTerms.add(normalizedTerm)

              // Update the remaining text and search index
              remainingText = remainingText.slice(searchIndex + termToCheck.length)
              searchIndex = 0
              foundMatch = true
              break
            }
          }
        }

        if (foundMatch) {
          break
        }
      }

      // If no match was found, advance the search index
      if (!foundMatch) {
        searchIndex++
      }
    }

    // Add any remaining text
    if (remainingText.length > 0) {
      parts.push(remainingText)
    }

    return parts.length > 0 ? parts : [text]
  }

  function processNode(node: ReactNode): ReactNode {
    // Handle null, undefined, boolean
    if (node == null || typeof node === 'boolean') {
      return node
    }

    // Handle string - process for glossary terms
    if (typeof node === 'string') {
      return <Fragment>{processText(node)}</Fragment>
    }

    // Handle number
    if (typeof node === 'number') {
      return node
    }

    // Handle array of children
    if (Array.isArray(node)) {
      return <Fragment>{node.map((child, idx) => <Fragment key={idx}>{processNode(child)}</Fragment>)}</Fragment>
    }

    // Handle React elements
    if (typeof node === 'object' && node !== null && 'type' in node && 'props' in node) {
      const element = node as React.ReactElement

      // Don't process code blocks or headings
      if (
        typeof element.type === 'string' &&
        (element.type === 'code' ||
          element.type === 'pre' ||
          element.type === 'h1' ||
          element.type === 'h2' ||
          element.type === 'h3' ||
          element.type === 'h4' ||
          element.type === 'h5' ||
          element.type === 'h6')
      ) {
        return element
      }

      // Process children of other elements
      const props = element.props as Record<string, unknown>
      if (props && 'children' in props) {
        return cloneElement(element, props, processNode(props.children as ReactNode))
      }
    }

    return node
  }

  return <>{processNode(children)}</>
}
