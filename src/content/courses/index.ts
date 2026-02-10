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
import buildingAiMeta from './building-ai/meta.json'
import buildingAiCh1 from './building-ai/ch1.json'
import buildingAiCh2 from './building-ai/ch2.json'
import buildingAiCh3 from './building-ai/ch3.json'
import buildingAiCh4 from './building-ai/ch4.json'
import buildingAiCh5 from './building-ai/ch5.json'
import type { Course } from '../../types'

interface CourseWithIcon extends Course {
  icon: string
}

const aiIntro = {
  ...aiIntroMeta,
  chapters: [aiIntroCh1, aiIntroCh2, aiIntroCh3, aiIntroCh4, aiIntroCh5, aiIntroCh6]
}

const buildingAi = {
  ...buildingAiMeta,
  chapters: [buildingAiCh1, buildingAiCh2, buildingAiCh3, buildingAiCh4, buildingAiCh5]
}

export const coursesData: CourseWithIcon[] = [aiIntro, mlBasics, deepLearning, generativeAi, buildingAi] as CourseWithIcon[]
