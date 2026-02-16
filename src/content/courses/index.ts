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
