# Glossary System

An interactive glossary system that automatically highlights IT/AI terms in course content and provides definitions via clickable tooltips.

## Components

### 1. `glossary.ts` (Data)
Contains 70+ comprehensive IT/AI terms with:
- Korean and English term variants
- Concise 1-2 sentence definitions
- Category tags (ai, ml, dev, data, web)
- Case-insensitive matching via `findGlossaryEntry()`

### 2. `GlossaryTooltip.tsx`
Visual tooltip component that displays:
- Term name (bold)
- Color-coded category badge
- Definition text
- Alternative terms (aliases)
- Click-outside-to-close behavior

**Visual Features:**
- Dotted green underline on terms
- 📖 book icon indicator
- Smooth fade-in animation
- Responsive popover below term

### 3. `GlossaryHighlighter.tsx`
Automatic text processor that:
- Scans React children for glossary terms
- Wraps first occurrence with GlossaryTooltip
- Preserves code blocks and headings (no highlighting)
- Handles word boundaries correctly
- Supports nested React elements

## Usage

### Basic Usage
```tsx
import { GlossaryHighlighter } from '@/components/glossary'

function LessonContent() {
  return (
    <GlossaryHighlighter>
      <p>
        AI는 머신러닝과 딥러닝 기술을 활용합니다.
        GPT와 같은 LLM은 자연어 처리에 특화되어 있습니다.
      </p>
    </GlossaryHighlighter>
  )
}
```

### With Complex Content
```tsx
<GlossaryHighlighter>
  <div className="lesson-content">
    <h2>AI 기초</h2>
    <p>인공지능(AI)은 머신러닝을 기반으로...</p>
    <pre><code>// Code blocks are NOT highlighted</code></pre>
    <p>딥러닝은 신경망을 사용하여...</p>
  </div>
</GlossaryHighlighter>
```

## Features

- **70+ Terms**: Comprehensive coverage of AI, ML, Dev, Data, Web terms
- **Smart Matching**: Case-insensitive, whole-word matching with aliases
- **First-Only**: Each term highlighted only once per block
- **Category Colors**:
  - AI (blue)
  - ML (purple)
  - Dev (green)
  - Data (orange)
  - Web (cyan)
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **No Code Highlighting**: Preserves code blocks and headings

## Category Breakdown

| Category | Terms | Examples |
|----------|-------|----------|
| AI | 19 | AI, LLM, GPT, Transformer, NLP, 생성형 AI |
| ML | 37 | 머신러닝, 딥러닝, CNN, RNN, 지도학습, 경사 하강법 |
| Dev | 8 | Git, GitHub, Conventional Commits, CI/CD |
| Data | 5 | 데이터셋, 피처, 레이블, 정규화 |
| Web | 10 | React, TypeScript, REST API, SPA, SSR |

## Implementation Details

### Word Boundary Detection
The highlighter uses regex to ensure terms are matched as complete words:
```typescript
/[\s\n\r.,;:!?()[\]{}'"<>]/
```

### Performance
- Terms sorted by length (longest first) to prioritize multi-word matches
- Single-pass processing with early termination
- Memoized highlighting set to prevent duplicates

### Tooltip Positioning
- Appears below the term
- Centered horizontally
- Auto-dismisses on outside click
- Z-index: 50 (above most content)

## Demo

See `GlossaryDemo.tsx` for interactive examples showing:
- AI 기초 강의 (AI basics lesson)
- 웹 개발 강의 (Web development lesson)
- 데이터 과학 강의 (Data science lesson)

## Extending

### Adding New Terms
Edit `src/lib/glossary.ts`:

```typescript
{
  term: '새 용어',
  aliases: ['New Term', '다른 이름'],
  definition: '간단한 1-2문장 설명입니다.',
  category: 'ai' // or ml, dev, data, web
}
```

### Customizing Styles
Modify category colors in `GlossaryTooltip.tsx`:

```typescript
const categoryColors = {
  ai: 'bg-blue-100 text-blue-700 border-blue-200',
  // ... add your custom colors
}
```

## Browser Support

- Modern browsers with ES6+ support
- React 18+
- Tailwind CSS 4+

## License

Part of the AI Tutorial Platform project.
