import { describe, it, expect } from 'vitest'
import { findWhyItMatters, whyItMattersData, fallbackByCourseSlugs, defaultFallback } from '../whyItMatters'
import type { WhyItMattersEntry } from '../whyItMatters'

describe('whyItMatters', () => {
  describe('findWhyItMatters', () => {
    it('should find entry by keyword match', () => {
      const result = findWhyItMatters('ml-basics', '머신러닝 기초', '지도학습')
      expect(result.emoji).toBe('🧠')
      expect(result.title).toContain('경험')
      expect(result.realLifeExamples).toHaveLength(3)
      expect(result.studentQuestion).toBeTruthy()
    })

    it('should match section title to find appropriate entry', () => {
      const result = findWhyItMatters('ai-intro', 'AI 기초', '인공지능이란')
      expect(result.emoji).toBe('🤖')
      expect(result.title).toContain('AI')
      expect(result.realLifeExamples.length).toBeGreaterThan(0)
    })

    it('should find entry by courseSlug fallback when no keyword matches', () => {
      const result = findWhyItMatters('ai-intro', '무작위 섹션', '무작위 챕터')
      expect(result).toBe(fallbackByCourseSlugs['ai-intro'])
      expect(result.emoji).toBe('🌟')
      expect(result.title).toContain('미래')
    })

    it('should return default fallback when no match found', () => {
      const result = findWhyItMatters('nonexistent-course', '무작위 섹션', '무작위 챕터')
      expect(result).toBe(defaultFallback)
      expect(result.emoji).toBe('💡')
      expect(result.title).toContain('중요한 이유')
    })

    it('should return all required fields', () => {
      const result = findWhyItMatters('ai-intro', 'AI', '인공지능')
      expect(result).toHaveProperty('emoji')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('realLifeExamples')
      expect(result).toHaveProperty('studentQuestion')
      expect(Array.isArray(result.realLifeExamples)).toBe(true)
      expect(typeof result.studentQuestion).toBe('string')

      // Validate realLifeExamples structure
      result.realLifeExamples.forEach((example) => {
        expect(example).toHaveProperty('title')
        expect(example).toHaveProperty('description')
        expect(example).toHaveProperty('icon')
      })
    })

    it('should find CNN entry by "이미지 인식" keyword', () => {
      const result = findWhyItMatters('deep-learning', 'CNN', '이미지 인식')
      expect(result.emoji).toBe('👁️')
      expect(result.keywords).toContain('이미지 인식')
      expect(result.realLifeExamples.length).toBeGreaterThan(0)
    })

    it('should find LLM entry by "GPT" keyword', () => {
      const result = findWhyItMatters('generative-ai', 'LLM', 'GPT')
      expect(result.emoji).toBe('🚀')
      expect(result.keywords.some(k => k.toLowerCase().includes('gpt'))).toBe(true)
    })

    it('should find ethics entry by "윤리" keyword', () => {
      const result = findWhyItMatters('ai-intro', 'AI 윤리', '윤리적 고려사항')
      expect(result.emoji).toBe('⚠️')
      expect(result.keywords).toContain('윤리')
      expect(result.title).toContain('실수')
    })

    it('should match keywords case-insensitively', () => {
      const result = findWhyItMatters('ai-intro', 'PYTHON', 'python 기초')
      expect(result.emoji).toBe('🐍')
      expect(result.keywords.some(k => k.toLowerCase().includes('python'))).toBe(true)
    })

    it('should respect courseSlug when specified in entry', () => {
      // Find an entry with courseSlug restriction
      const entryWithCourseSlug = whyItMattersData.find(e => e.courseSlug)
      if (entryWithCourseSlug) {
        const wrongCourseResult = findWhyItMatters(
          'wrong-course',
          entryWithCourseSlug.keywords[0],
          ''
        )
        // Should not match the restricted entry
        expect(wrongCourseResult).not.toBe(entryWithCourseSlug)
      }
    })

    it('should have valid structure in all whyItMattersData entries', () => {
      whyItMattersData.forEach((entry: WhyItMattersEntry) => {
        expect(Array.isArray(entry.keywords)).toBe(true)
        expect(entry.keywords.length).toBeGreaterThan(0)
        expect(typeof entry.emoji).toBe('string')
        expect(typeof entry.title).toBe('string')
        expect(Array.isArray(entry.realLifeExamples)).toBe(true)
        expect(entry.realLifeExamples.length).toBeGreaterThan(0)
        expect(typeof entry.studentQuestion).toBe('string')
        expect(entry.studentQuestion.length).toBeGreaterThan(0)
      })
    })
  })

  describe('fallbackByCourseSlugs', () => {
    it('should have fallbacks for known courses', () => {
      expect(fallbackByCourseSlugs['ai-intro']).toBeDefined()
      expect(fallbackByCourseSlugs['ml-basics']).toBeDefined()
      expect(fallbackByCourseSlugs['deep-learning']).toBeDefined()
      expect(fallbackByCourseSlugs['generative-ai']).toBeDefined()
    })

    it('should have valid structure in fallback entries', () => {
      Object.values(fallbackByCourseSlugs).forEach((entry) => {
        expect(entry.emoji).toBeTruthy()
        expect(entry.title).toBeTruthy()
        expect(entry.realLifeExamples.length).toBeGreaterThan(0)
        expect(entry.studentQuestion).toBeTruthy()
      })
    })
  })

  describe('defaultFallback', () => {
    it('should have valid structure', () => {
      expect(defaultFallback.emoji).toBe('💡')
      expect(defaultFallback.title).toBeTruthy()
      expect(defaultFallback.realLifeExamples.length).toBeGreaterThan(0)
      expect(defaultFallback.studentQuestion).toBeTruthy()
    })
  })
})
