import type { Course } from '../../types'

// Meta-only imports (small, needed for course listing)
import aiIntroMeta from './ai-intro/meta.json'
import mlBasicsMeta from './ml-basics/meta.json'
import deepLearningMeta from './deep-learning/meta.json'
import generativeAiMeta from './generative-ai/meta.json'
import makingAiMeta from './making-ai/meta.json'
import claudeCodeMeta from './claude-code/meta.json'
import claudeCodeIntermediateMeta from './claude-code-intermediate/meta.json'
import claudeCodeAdvancedMeta from './claude-code-advanced/meta.json'
import claudeConstitutionMeta from './claude-constitution/meta.json'
import claudeCoworkMeta from './claude-cowork/meta.json'
import agentSkillsMeta from './agent-skills/meta.json'
import pythonMlMeta from './python-ml-practice/meta.json'
import aiPortfolioMeta from './ai-portfolio/meta.json'
import ragVectorDbMeta from './rag-vector-db/meta.json'
import aiBusinessMeta from './ai-business/meta.json'
import promptEngineeringMeta from './prompt-engineering/meta.json'
import mcpMasteryMeta from './mcp-mastery/meta.json'
import claudeToolUseMeta from './claude-tool-use/meta.json'
import extendedThinkingMeta from './extended-thinking/meta.json'
import claudeVisionMeta from './claude-vision/meta.json'
import aiEvaluationMeta from './ai-evaluation/meta.json'

type CourseWithIcon = Course & { icon: string }

// Course metadata for listing (no chapters loaded)
const courseMetas: CourseWithIcon[] = [
  aiIntroMeta,
  mlBasicsMeta,
  deepLearningMeta,
  generativeAiMeta,
  makingAiMeta,
  claudeCodeMeta,
  claudeCodeIntermediateMeta,
  claudeCodeAdvancedMeta,
  claudeConstitutionMeta,
  claudeCoworkMeta,
  agentSkillsMeta,
  pythonMlMeta,
  aiPortfolioMeta,
  ragVectorDbMeta,
  aiBusinessMeta,
  promptEngineeringMeta,
  mcpMasteryMeta,
  claudeToolUseMeta,
  extendedThinkingMeta,
  claudeVisionMeta,
  aiEvaluationMeta,
] as CourseWithIcon[]

// Chapter loader map - lazy imports
const chapterLoaders: Record<string, () => Promise<any[]>> = {
  'ai-intro': async () => {
    const [ch1, ch2, ch3, ch4, ch5, ch6] = await Promise.all([
      import('./ai-intro/ch1.json'),
      import('./ai-intro/ch2.json'),
      import('./ai-intro/ch3.json'),
      import('./ai-intro/ch4.json'),
      import('./ai-intro/ch5.json'),
      import('./ai-intro/ch6.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default, ch6.default]
  },
  'ml-basics': async () => {
    // ml-basics has chapters embedded in meta.json
    return mlBasicsMeta.chapters
  },
  'deep-learning': async () => {
    // deep-learning has chapters embedded in meta.json
    return deepLearningMeta.chapters
  },
  'generative-ai': async () => {
    // generative-ai has chapters embedded in meta.json
    return generativeAiMeta.chapters
  },
  'making-ai': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./making-ai/ch1.json'),
      import('./making-ai/ch2.json'),
      import('./making-ai/ch3.json'),
      import('./making-ai/ch4.json'),
      import('./making-ai/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'claude-code': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./claude-code/ch1.json'),
      import('./claude-code/ch2.json'),
      import('./claude-code/ch3.json'),
      import('./claude-code/ch4.json'),
      import('./claude-code/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'claude-code-intermediate': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./claude-code-intermediate/ch1.json'),
      import('./claude-code-intermediate/ch2.json'),
      import('./claude-code-intermediate/ch3.json'),
      import('./claude-code-intermediate/ch4.json'),
      import('./claude-code-intermediate/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'claude-code-advanced': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./claude-code-advanced/ch1.json'),
      import('./claude-code-advanced/ch2.json'),
      import('./claude-code-advanced/ch3.json'),
      import('./claude-code-advanced/ch4.json'),
      import('./claude-code-advanced/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'claude-constitution': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./claude-constitution/ch1.json'),
      import('./claude-constitution/ch2.json'),
      import('./claude-constitution/ch3.json'),
      import('./claude-constitution/ch4.json'),
      import('./claude-constitution/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'claude-cowork': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./claude-cowork/ch1.json'),
      import('./claude-cowork/ch2.json'),
      import('./claude-cowork/ch3.json'),
      import('./claude-cowork/ch4.json'),
      import('./claude-cowork/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'agent-skills': async () => {
    const [ch1, ch2, ch3, ch4, ch5, ch6, ch7, ch8] = await Promise.all([
      import('./agent-skills/ch1.json'),
      import('./agent-skills/ch2.json'),
      import('./agent-skills/ch3.json'),
      import('./agent-skills/ch4.json'),
      import('./agent-skills/ch5.json'),
      import('./agent-skills/ch6.json'),
      import('./agent-skills/ch7.json'),
      import('./agent-skills/ch8.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default, ch6.default, ch7.default, ch8.default]
  },
  'python-ml-practice': async () => {
    const [ch1, ch2, ch3, ch4, ch5, ch6] = await Promise.all([
      import('./python-ml-practice/ch1.json'),
      import('./python-ml-practice/ch2.json'),
      import('./python-ml-practice/ch3.json'),
      import('./python-ml-practice/ch4.json'),
      import('./python-ml-practice/ch5.json'),
      import('./python-ml-practice/ch6.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default, ch6.default]
  },
  'ai-portfolio': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./ai-portfolio/ch1.json'),
      import('./ai-portfolio/ch2.json'),
      import('./ai-portfolio/ch3.json'),
      import('./ai-portfolio/ch4.json'),
      import('./ai-portfolio/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'rag-vector-db': async () => {
    const [ch1, ch2, ch3, ch4, ch5, ch6] = await Promise.all([
      import('./rag-vector-db/ch1.json'),
      import('./rag-vector-db/ch2.json'),
      import('./rag-vector-db/ch3.json'),
      import('./rag-vector-db/ch4.json'),
      import('./rag-vector-db/ch5.json'),
      import('./rag-vector-db/ch6.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default, ch6.default]
  },
  'ai-business': async () => {
    const [ch1, ch2, ch3, ch4, ch5] = await Promise.all([
      import('./ai-business/ch1.json'),
      import('./ai-business/ch2.json'),
      import('./ai-business/ch3.json'),
      import('./ai-business/ch4.json'),
      import('./ai-business/ch5.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default, ch5.default]
  },
  'prompt-engineering': async () => {
    const [ch1, ch2, ch3, ch4] = await Promise.all([
      import('./prompt-engineering/ch1.json'),
      import('./prompt-engineering/ch2.json'),
      import('./prompt-engineering/ch3.json'),
      import('./prompt-engineering/ch4.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default]
  },
  'mcp-mastery': async () => {
    const [ch1, ch2, ch3, ch4] = await Promise.all([
      import('./mcp-mastery/ch1.json'),
      import('./mcp-mastery/ch2.json'),
      import('./mcp-mastery/ch3.json'),
      import('./mcp-mastery/ch4.json'),
    ])
    return [ch1.default, ch2.default, ch3.default, ch4.default]
  },
  'claude-tool-use': async () => {
    const [ch1, ch2, ch3] = await Promise.all([
      import('./claude-tool-use/ch1.json'),
      import('./claude-tool-use/ch2.json'),
      import('./claude-tool-use/ch3.json'),
    ])
    return [ch1.default, ch2.default, ch3.default]
  },
  'extended-thinking': async () => {
    const [ch1, ch2, ch3] = await Promise.all([
      import('./extended-thinking/ch1.json'),
      import('./extended-thinking/ch2.json'),
      import('./extended-thinking/ch3.json'),
    ])
    return [ch1.default, ch2.default, ch3.default]
  },
  'claude-vision': async () => {
    const [ch1, ch2, ch3] = await Promise.all([
      import('./claude-vision/ch1.json'),
      import('./claude-vision/ch2.json'),
      import('./claude-vision/ch3.json'),
    ])
    return [ch1.default, ch2.default, ch3.default]
  },
  'ai-evaluation': async () => {
    const [ch1, ch2, ch3] = await Promise.all([
      import('./ai-evaluation/ch1.json'),
      import('./ai-evaluation/ch2.json'),
      import('./ai-evaluation/ch3.json'),
    ])
    return [ch1.default, ch2.default, ch3.default]
  },
}

// Cache for loaded courses
const courseCache = new Map<string, CourseWithIcon>()

// Load full course with chapters
export async function loadCourse(slug: string): Promise<CourseWithIcon | null> {
  if (courseCache.has(slug)) return courseCache.get(slug)!

  const meta = courseMetas.find(c => c.slug === slug)
  if (!meta) return null

  const loader = chapterLoaders[slug]
  if (!loader) return null

  const chapters = await loader()
  const course = { ...meta, chapters } as CourseWithIcon
  courseCache.set(slug, course)
  return course
}

// For backward compatibility - export meta-only list
// Pages that need chapters should use loadCourse() instead
export const coursesData: CourseWithIcon[] = courseMetas
