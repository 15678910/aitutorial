import aiIntroMeta from './ai-intro/meta.json'
import aiIntroCh1 from './ai-intro/ch1.json'
import aiIntroCh2 from './ai-intro/ch2.json'
import aiIntroCh3 from './ai-intro/ch3.json'
import aiIntroCh4 from './ai-intro/ch4.json'
import aiIntroCh5 from './ai-intro/ch5.json'
import aiIntroCh6 from './ai-intro/ch6.json'
import mlBasics from './ml-basics/meta.json'
import deepLearning from './deep-learning/meta.json'
import generativeAi from './generative-ai/meta.json'
import makingAiMeta from './making-ai/meta.json'
import makingAiCh1 from './making-ai/ch1.json'
import makingAiCh2 from './making-ai/ch2.json'
import makingAiCh3 from './making-ai/ch3.json'
import makingAiCh4 from './making-ai/ch4.json'
import makingAiCh5 from './making-ai/ch5.json'
import claudeCodeMeta from './claude-code/meta.json'
import claudeCodeCh1 from './claude-code/ch1.json'
import claudeCodeCh2 from './claude-code/ch2.json'
import claudeCodeCh3 from './claude-code/ch3.json'
import claudeCodeCh4 from './claude-code/ch4.json'
import claudeCodeCh5 from './claude-code/ch5.json'
import type { Course } from '../../types'

interface CourseWithIcon extends Course {
  icon: string
}

const aiIntro = {
  ...aiIntroMeta,
  chapters: [aiIntroCh1, aiIntroCh2, aiIntroCh3, aiIntroCh4, aiIntroCh5, aiIntroCh6]
}

const makingAi = {
  ...makingAiMeta,
  chapters: [makingAiCh1, makingAiCh2, makingAiCh3, makingAiCh4, makingAiCh5]
}

const claudeCode = {
  ...claudeCodeMeta,
  chapters: [claudeCodeCh1, claudeCodeCh2, claudeCodeCh3, claudeCodeCh4, claudeCodeCh5]
}

export const coursesData: CourseWithIcon[] = [aiIntro, mlBasics, deepLearning, generativeAi, makingAi, claudeCode] as CourseWithIcon[]
