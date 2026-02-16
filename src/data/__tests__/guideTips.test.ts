import { describe, it, expect } from 'vitest'
import { findGuideTips, guideTipsData, defaultGuideTips } from '../guideTips'
import type { GuideTipEntry } from '../guideTips'

describe('guideTips', () => {
  describe('findGuideTips', () => {
    it('should find tips by keyword', () => {
      const result = findGuideTips('ai-intro', 'AI 기초', '인공지능')
      expect(result.tips).toHaveLength(4)
      expect(result.keywords.some(k => k.includes('인공지능'))).toBe(true)
    })

    it('should return tips with all 4 types', () => {
      const result = findGuideTips('ml-basics', '머신러닝', '기계학습')
      expect(result.tips).toHaveLength(4)

      const types = result.tips.map(t => t.type)
      expect(types).toContain('think')
      expect(types).toContain('try')
      expect(types).toContain('discuss')
      expect(types).toContain('connect')
    })

    it('should return default tips when no match found', () => {
      const result = findGuideTips('nonexistent-course', '무작위', '섹션')
      expect(result).toBe(defaultGuideTips)
      expect(result.tips).toHaveLength(4)
    })

    it('should find neural network tips by "신경망" keyword', () => {
      const result = findGuideTips('deep-learning', '신경망', '뉴런')
      expect(result.keywords.some(k => k.includes('신경망'))).toBe(true)
      expect(result.tips.length).toBe(4)
    })

    it('should find deep learning tips by "딥러닝" keyword', () => {
      const result = findGuideTips('deep-learning', '딥러닝', '심층학습')
      expect(result.keywords.some(k => k.includes('딥러닝'))).toBe(true)
      expect(result.tips.every(t => t.prompt.length > 0)).toBe(true)
    })

    it('should find CNN tips by "CNN" keyword', () => {
      const result = findGuideTips('deep-learning', 'CNN', '합성곱')
      expect(result.keywords.some(k => k.toUpperCase().includes('CNN'))).toBe(true)
      expect(result.tips.length).toBe(4)
    })

    it('should find generative AI tips by "생성형" keyword', () => {
      const result = findGuideTips('generative-ai', '생성형 AI', 'GAN')
      expect(result.keywords.some(k => k.includes('생성형'))).toBe(true)
    })

    it('should find data tips by "데이터" keyword', () => {
      const result = findGuideTips('ml-basics', '데이터', '분류')
      expect(result.keywords.some(k => k.includes('데이터'))).toBe(true)
    })

    it('should find ethics tips by "윤리" keyword', () => {
      const result = findGuideTips('ai-intro', 'AI 윤리', '편향')
      expect(result.keywords.some(k => k.includes('윤리'))).toBe(true)
    })

    it('should find prompt tips by "프롬프트" keyword', () => {
      const result = findGuideTips('generative-ai', '프롬프트', '질문법')
      expect(result.keywords.some(k => k.includes('프롬프트'))).toBe(true)
    })

    it('should find reinforcement learning tips by "강화학습" keyword', () => {
      const result = findGuideTips('ml-basics', '강화학습', '보상')
      expect(result.keywords.some(k => k.includes('강화학습'))).toBe(true)
    })

    it('should match keywords case-insensitively', () => {
      const result = findGuideTips('ai-intro', 'PYTHON', 'python')
      expect(result.keywords.some(k => k.toLowerCase().includes('python'))).toBe(true)
    })

    it('should respect courseSlug when specified', () => {
      const entryWithCourseSlug = guideTipsData.find(e => e.courseSlug)
      if (entryWithCourseSlug) {
        const wrongCourseResult = findGuideTips(
          'wrong-course',
          entryWithCourseSlug.keywords[0],
          ''
        )
        expect(wrongCourseResult).not.toBe(entryWithCourseSlug)
      }
    })

    it('should have valid structure in each tip', () => {
      const result = findGuideTips('ai-intro', 'AI', '인공지능')
      result.tips.forEach((tip) => {
        expect(tip).toHaveProperty('type')
        expect(tip).toHaveProperty('icon')
        expect(tip).toHaveProperty('label')
        expect(tip).toHaveProperty('prompt')
        expect(['think', 'try', 'discuss', 'connect']).toContain(tip.type)
        expect(tip.icon.length).toBeGreaterThan(0)
        expect(tip.label.length).toBeGreaterThan(0)
        expect(tip.prompt.length).toBeGreaterThan(0)
      })
    })

    it('should have valid structure in all guideTipsData entries', () => {
      guideTipsData.forEach((entry: GuideTipEntry) => {
        expect(Array.isArray(entry.keywords)).toBe(true)
        expect(entry.keywords.length).toBeGreaterThan(0)
        expect(Array.isArray(entry.tips)).toBe(true)
        expect(entry.tips.length).toBe(4) // Should always have 4 tip types
      })
    })
  })

  describe('defaultGuideTips', () => {
    it('should have 4 tips with all types', () => {
      expect(defaultGuideTips.tips).toHaveLength(4)
      const types = defaultGuideTips.tips.map(t => t.type)
      expect(types).toContain('think')
      expect(types).toContain('try')
      expect(types).toContain('discuss')
      expect(types).toContain('connect')
    })

    it('should have valid structure', () => {
      defaultGuideTips.tips.forEach((tip) => {
        expect(tip.icon).toBeTruthy()
        expect(tip.label).toBeTruthy()
        expect(tip.prompt).toBeTruthy()
      })
    })
  })
})
