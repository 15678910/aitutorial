import { describe, it, expect } from 'vitest'
import { findMiniLab, miniLabsData, defaultMiniLab } from '../miniLabs'
import type { MiniLabEntry, MiniLabType } from '../miniLabs'

describe('miniLabs', () => {
  describe('findMiniLab', () => {
    it('should find mini lab by keyword in section title', () => {
      const result = findMiniLab('ai-intro', '인공지능의 정의할까', '')
      expect(result).not.toBeNull()
      expect(result!.id).toBe('lab-ai-abilities')
      expect(result!.type).toBe('slider')
    })

    it('should return lab with valid type', () => {
      const validTypes: MiniLabType[] = ['slider', 'toggle', 'drag-sort', 'comparison', 'poll']
      const result = findMiniLab('ml-basics', '머신러닝 배우기', '')
      expect(result).not.toBeNull()
      expect(validTypes).toContain(result!.type)
    })

    it('should return null when no match found', () => {
      const result = findMiniLab('nonexistent-course', '무작위', '섹션')
      expect(result).toBeNull()
    })

    it('should find slider lab by "정의" keyword in section title', () => {
      const result = findMiniLab('ai-intro', 'AI를 어떻게 정의할까', 'AI란 무엇인가')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('slider')
      expect(result!.config.type).toBe('slider')
      if (result!.config.type === 'slider') {
        expect(result!.config.sliders.length).toBeGreaterThan(0)
        expect(result!.config.resultLabel).toBeTruthy()
      }
    })

    it('should find poll lab by "머신러닝" keyword', () => {
      const result = findMiniLab('ml-basics', '머신러닝 개요', '')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('poll')
      expect(result!.config.type).toBe('poll')
      if (result!.config.type === 'poll') {
        expect(result!.config.question).toBeTruthy()
        expect(result!.config.options.length).toBeGreaterThan(0)
      }
    })

    it('should find toggle lab by "신경망" keyword', () => {
      const result = findMiniLab('deep-learning', '신경망 기초', '')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('toggle')
      expect(result!.config.type).toBe('toggle')
      if (result!.config.type === 'toggle') {
        expect(result!.config.toggles.length).toBeGreaterThan(0)
        expect(result!.config.scenarios.length).toBeGreaterThan(0)
      }
    })

    it('should find comparison lab by "딥러닝" keyword', () => {
      const result = findMiniLab('deep-learning', '딥러닝의 세계', '')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('comparison')
      expect(result!.config.type).toBe('comparison')
      if (result!.config.type === 'comparison') {
        expect(result!.config.leftTitle).toBeTruthy()
        expect(result!.config.rightTitle).toBeTruthy()
        expect(result!.config.leftItems.length).toBeGreaterThan(0)
        expect(result!.config.rightItems.length).toBeGreaterThan(0)
      }
    })

    it('should find drag-sort lab by "CNN" keyword', () => {
      const result = findMiniLab('deep-learning', 'CNN 이미지 인식', '')
      expect(result).not.toBeNull()
      expect(result!.type).toBe('drag-sort')
      expect(result!.config.type).toBe('drag-sort')
      if (result!.config.type === 'drag-sort') {
        expect(result!.config.items.length).toBeGreaterThan(0)
        expect(result!.config.correctOrder.length).toBeGreaterThan(0)
        expect(result!.config.question).toBeTruthy()
      }
    })

    it('should find temperature slider lab by "LLM" keyword', () => {
      const result = findMiniLab('generative-ai', 'LLM 모델', '')
      expect(result).not.toBeNull()
      expect(result!.id).toBe('lab-temperature')
      expect(result!.type).toBe('slider')
    })

    it('should find data quality drag-sort lab by "데이터" keyword', () => {
      const result = findMiniLab('ml-basics', '데이터 처리', '')
      expect(result).not.toBeNull()
      expect(result!.id).toBe('lab-data-quality')
      expect(result!.type).toBe('drag-sort')
    })

    it('should find ethics poll lab by "윤리" keyword', () => {
      const result = findMiniLab('ai-intro', 'AI 윤리와 편향', '')
      expect(result).not.toBeNull()
      expect(result!.id).toBe('lab-ethics-poll')
      expect(result!.type).toBe('poll')
    })

    it('should find reward toggle lab by "강화학습" keyword', () => {
      const result = findMiniLab('ml-basics', '강화학습 기초', '')
      expect(result).not.toBeNull()
      expect(result!.id).toBe('lab-reward-toggle')
      expect(result!.type).toBe('toggle')
    })

    it('should match keywords case-insensitively', () => {
      const result = findMiniLab('deep-learning', 'CNN 모델', '')
      expect(result).not.toBeNull()
      expect(result!.keywords.some(k => k.toUpperCase().includes('CNN'))).toBe(true)
    })

    it('should NOT match on chapter title (only section title)', () => {
      // "관련 분야들" section should NOT match lab-ai-abilities via chapter title "AI란 무엇인가"
      const result = findMiniLab('ai-intro', '관련 분야들', 'AI란 무엇인가')
      // Should be null since "관련 분야들" doesn't contain any lab keywords
      expect(result).toBeNull()
    })

    it('should respect courseSlug when specified', () => {
      const entryWithCourseSlug = miniLabsData.find(e => e.courseSlug)
      if (entryWithCourseSlug) {
        const wrongCourseResult = findMiniLab(
          'wrong-course',
          entryWithCourseSlug.keywords[0],
          ''
        )
        expect(wrongCourseResult).not.toBe(entryWithCourseSlug)
      }
    })

    it('should have all required fields in each lab', () => {
      const result = findMiniLab('ai-intro', '인공지능 정의', '')
      expect(result).not.toBeNull()
      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('title')
      expect(result).toHaveProperty('description')
      expect(result).toHaveProperty('type')
      expect(result).toHaveProperty('config')
      expect(result).toHaveProperty('feedbackMessage')
      expect(result!.feedbackMessage.length).toBeGreaterThan(0)
    })

    it('should have valid structure in all miniLabsData entries', () => {
      miniLabsData.forEach((entry: MiniLabEntry) => {
        expect(entry.id).toBeTruthy()
        expect(Array.isArray(entry.keywords)).toBe(true)
        expect(entry.keywords.length).toBeGreaterThan(0)
        expect(entry.title).toBeTruthy()
        expect(entry.description).toBeTruthy()
        expect(['slider', 'toggle', 'drag-sort', 'comparison', 'poll']).toContain(entry.type)
        expect(entry.config).toBeDefined()
        expect(entry.feedbackMessage).toBeTruthy()
      })
    })

    it('should have matching type in config and entry type', () => {
      miniLabsData.forEach((entry: MiniLabEntry) => {
        expect(entry.config.type).toBe(entry.type)
      })
    })

    it('slider config should have valid structure', () => {
      const sliderLab = miniLabsData.find(lab => lab.type === 'slider')
      expect(sliderLab).toBeDefined()
      if (sliderLab && sliderLab.config.type === 'slider') {
        expect(sliderLab.config.sliders.length).toBeGreaterThan(0)
        sliderLab.config.sliders.forEach(slider => {
          expect(slider.label).toBeTruthy()
          expect(slider.min).toBeDefined()
          expect(slider.max).toBeDefined()
          expect(slider.max).toBeGreaterThan(slider.min)
          expect(slider.step).toBeGreaterThan(0)
          expect(slider.defaultValue).toBeGreaterThanOrEqual(slider.min)
          expect(slider.defaultValue).toBeLessThanOrEqual(slider.max)
          expect(slider.unit).toBeDefined()
        })
      }
    })

    it('toggle config should have valid structure', () => {
      const toggleLab = miniLabsData.find(lab => lab.type === 'toggle')
      expect(toggleLab).toBeDefined()
      if (toggleLab && toggleLab.config.type === 'toggle') {
        const toggleConfig = toggleLab.config
        expect(toggleConfig.toggles.length).toBeGreaterThan(0)
        toggleConfig.toggles.forEach(toggle => {
          expect(toggle.label).toBeTruthy()
          expect(toggle.onLabel).toBeTruthy()
          expect(toggle.offLabel).toBeTruthy()
          expect(typeof toggle.defaultOn).toBe('boolean')
        })
        expect(toggleConfig.scenarios.length).toBeGreaterThan(0)
        toggleConfig.scenarios.forEach(scenario => {
          expect(Array.isArray(scenario.combination)).toBe(true)
          expect(scenario.combination.length).toBe(toggleConfig.toggles.length)
          expect(scenario.result).toBeTruthy()
          expect(scenario.emoji).toBeTruthy()
        })
      }
    })

    it('drag-sort config should have valid structure', () => {
      const dragSortLab = miniLabsData.find(lab => lab.type === 'drag-sort')
      expect(dragSortLab).toBeDefined()
      if (dragSortLab && dragSortLab.config.type === 'drag-sort') {
        const dragSortConfig = dragSortLab.config
        expect(dragSortConfig.items.length).toBeGreaterThan(0)
        dragSortConfig.items.forEach(item => {
          expect(item.id).toBeTruthy()
          expect(item.label).toBeTruthy()
          expect(item.emoji).toBeTruthy()
        })
        expect(dragSortConfig.correctOrder.length).toBe(dragSortConfig.items.length)
        expect(dragSortConfig.question).toBeTruthy()
        // Verify all correctOrder IDs exist in items
        dragSortConfig.correctOrder.forEach(id => {
          expect(dragSortConfig.items.some((item: { id: string }) => item.id === id)).toBe(true)
        })
      }
    })

    it('comparison config should have valid structure', () => {
      const comparisonLab = miniLabsData.find(lab => lab.type === 'comparison')
      expect(comparisonLab).toBeDefined()
      if (comparisonLab && comparisonLab.config.type === 'comparison') {
        expect(comparisonLab.config.leftTitle).toBeTruthy()
        expect(comparisonLab.config.rightTitle).toBeTruthy()
        expect(comparisonLab.config.leftItems.length).toBeGreaterThan(0)
        expect(comparisonLab.config.rightItems.length).toBeGreaterThan(0)
        expect(comparisonLab.config.leftEmoji).toBeTruthy()
        expect(comparisonLab.config.rightEmoji).toBeTruthy()
      }
    })

    it('poll config should have valid structure', () => {
      const pollLab = miniLabsData.find(lab => lab.type === 'poll')
      expect(pollLab).toBeDefined()
      if (pollLab && pollLab.config.type === 'poll') {
        expect(pollLab.config.question).toBeTruthy()
        expect(pollLab.config.options.length).toBeGreaterThan(1) // Polls need at least 2 options
        pollLab.config.options.forEach(option => {
          expect(option.id).toBeTruthy()
          expect(option.label).toBeTruthy()
          expect(option.emoji).toBeTruthy()
        })
      }
    })
  })

  describe('defaultMiniLab', () => {
    it('should be a poll type', () => {
      expect(defaultMiniLab.type).toBe('poll')
      expect(defaultMiniLab.config.type).toBe('poll')
    })

    it('should have valid structure', () => {
      expect(defaultMiniLab.id).toBe('lab-default-poll')
      expect(defaultMiniLab.title).toBeTruthy()
      expect(defaultMiniLab.description).toBeTruthy()
      expect(defaultMiniLab.feedbackMessage).toBeTruthy()
      if (defaultMiniLab.config.type === 'poll') {
        expect(defaultMiniLab.config.question).toBeTruthy()
        expect(defaultMiniLab.config.options.length).toBeGreaterThan(0)
      }
    })
  })
})
