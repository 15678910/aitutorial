import { describe, it, expect } from 'vitest'
import { getMissionsForCourse, getCourseSlugsWithMissions, groupMissionsData } from '../groupMissions'
import type { GroupMission } from '../../types/studyGroup'

describe('groupMissions', () => {
  describe('getMissionsForCourse', () => {
    it('should return missions for ai-intro course', () => {
      const missions = getMissionsForCourse('ai-intro')
      expect(missions.length).toBeGreaterThan(0)
      expect(missions.every(m => m.courseSlug === 'ai-intro')).toBe(true)
    })

    it('should return empty array for nonexistent course', () => {
      const missions = getMissionsForCourse('nonexistent-course')
      expect(missions).toEqual([])
      expect(missions.length).toBe(0)
    })

    it('should return missions for ml-basics course', () => {
      const missions = getMissionsForCourse('ml-basics')
      expect(missions.length).toBeGreaterThan(0)
      expect(missions.every(m => m.courseSlug === 'ml-basics')).toBe(true)
    })

    it('should return missions for generative-ai course', () => {
      const missions = getMissionsForCourse('generative-ai')
      expect(missions.length).toBeGreaterThan(0)
      expect(missions.every(m => m.courseSlug === 'generative-ai')).toBe(true)
    })

    it('each mission should have required fields', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(mission).toHaveProperty('id')
        expect(mission).toHaveProperty('title')
        expect(mission).toHaveProperty('description')
        expect(mission).toHaveProperty('type')
        expect(mission).toHaveProperty('courseSlug')
        expect(mission).toHaveProperty('difficulty')
        expect(mission).toHaveProperty('estimatedMinutes')
        expect(mission).toHaveProperty('steps')
        expect(mission).toHaveProperty('rewardPoints')
      })
    })

    it('each mission should have valid steps array', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(Array.isArray(mission.steps)).toBe(true)
        expect(mission.steps.length).toBeGreaterThan(0)
        mission.steps.forEach(step => {
          expect(step).toHaveProperty('id')
          expect(step).toHaveProperty('title')
          expect(step).toHaveProperty('description')
          expect(step).toHaveProperty('type')
          expect(step).toHaveProperty('isCompleted')
          expect(typeof step.isCompleted).toBe('boolean')
          expect(['write', 'discuss', 'try', 'present']).toContain(step.type)
        })
      })
    })

    it('each mission should have valid rewardPoints', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(typeof mission.rewardPoints).toBe('number')
        expect(mission.rewardPoints).toBeGreaterThan(0)
      })
    })

    it('each mission should have valid difficulty', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(['easy', 'medium', 'hard']).toContain(mission.difficulty)
      })
    })

    it('each mission should have valid type', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(['discussion', 'experiment', 'research', 'presentation']).toContain(mission.type)
      })
    })

    it('each mission should have valid estimatedMinutes', () => {
      const missions = getMissionsForCourse('ai-intro')
      missions.forEach((mission: GroupMission) => {
        expect(typeof mission.estimatedMinutes).toBe('number')
        expect(mission.estimatedMinutes).toBeGreaterThan(0)
        expect(mission.estimatedMinutes).toBeLessThanOrEqual(120) // Reasonable upper limit
      })
    })
  })

  describe('getCourseSlugsWithMissions', () => {
    it('should return array of course slugs', () => {
      const slugs = getCourseSlugsWithMissions()
      expect(Array.isArray(slugs)).toBe(true)
      expect(slugs.length).toBeGreaterThan(0)
    })

    it('should return unique course slugs', () => {
      const slugs = getCourseSlugsWithMissions()
      const uniqueSlugs = [...new Set(slugs)]
      expect(slugs.length).toBe(uniqueSlugs.length)
    })

    it('should include ai-intro course', () => {
      const slugs = getCourseSlugsWithMissions()
      expect(slugs).toContain('ai-intro')
    })

    it('should include ml-basics course', () => {
      const slugs = getCourseSlugsWithMissions()
      expect(slugs).toContain('ml-basics')
    })

    it('should include generative-ai course', () => {
      const slugs = getCourseSlugsWithMissions()
      expect(slugs).toContain('generative-ai')
    })

    it('every returned slug should have at least one mission', () => {
      const slugs = getCourseSlugsWithMissions()
      slugs.forEach(slug => {
        const missions = getMissionsForCourse(slug)
        expect(missions.length).toBeGreaterThan(0)
      })
    })
  })

  describe('groupMissionsData', () => {
    it('should have multiple missions', () => {
      expect(groupMissionsData.length).toBeGreaterThan(0)
    })

    it('all missions should have unique IDs', () => {
      const ids = groupMissionsData.map(m => m.id)
      const uniqueIds = [...new Set(ids)]
      expect(ids.length).toBe(uniqueIds.length)
    })

    it('all step IDs should be unique within each mission', () => {
      groupMissionsData.forEach((mission: GroupMission) => {
        const stepIds = mission.steps.map(s => s.id)
        const uniqueStepIds = [...new Set(stepIds)]
        expect(stepIds.length).toBe(uniqueStepIds.length)
      })
    })

    it('should have valid structure for all missions', () => {
      groupMissionsData.forEach((mission: GroupMission) => {
        expect(mission.id).toBeTruthy()
        expect(mission.title).toBeTruthy()
        expect(mission.description).toBeTruthy()
        expect(mission.type).toBeTruthy()
        expect(mission.courseSlug).toBeTruthy()
        expect(mission.difficulty).toBeTruthy()
        expect(typeof mission.estimatedMinutes).toBe('number')
        expect(Array.isArray(mission.steps)).toBe(true)
        expect(typeof mission.rewardPoints).toBe('number')
      })
    })

    it('should have missions with different difficulty levels', () => {
      const difficulties = groupMissionsData.map(m => m.difficulty)
      expect(difficulties).toContain('easy')
      expect(difficulties).toContain('medium')
      expect(difficulties).toContain('hard')
    })

    it('should have missions with different types', () => {
      const types = groupMissionsData.map(m => m.type)
      const uniqueTypes = [...new Set(types)]
      expect(uniqueTypes.length).toBeGreaterThan(1) // At least 2 different types
    })

    it('reward points should generally increase with difficulty', () => {
      const easyMissions = groupMissionsData.filter(m => m.difficulty === 'easy')
      const hardMissions = groupMissionsData.filter(m => m.difficulty === 'hard')

      if (easyMissions.length > 0 && hardMissions.length > 0) {
        const avgEasyPoints = easyMissions.reduce((sum, m) => sum + m.rewardPoints, 0) / easyMissions.length
        const avgHardPoints = hardMissions.reduce((sum, m) => sum + m.rewardPoints, 0) / hardMissions.length
        expect(avgHardPoints).toBeGreaterThan(avgEasyPoints)
      }
    })

    it('all missions should start with steps marked as not completed', () => {
      groupMissionsData.forEach((mission: GroupMission) => {
        mission.steps.forEach(step => {
          expect(step.isCompleted).toBe(false)
        })
      })
    })

    it('should have missions with various step types', () => {
      const allSteps = groupMissionsData.flatMap(m => m.steps)
      const stepTypes = [...new Set(allSteps.map(s => s.type))]
      expect(stepTypes.length).toBeGreaterThan(1) // Multiple step types used
      stepTypes.forEach(type => {
        expect(['write', 'discuss', 'try', 'present']).toContain(type)
      })
    })

    it('missions should have between 2 and 6 steps', () => {
      groupMissionsData.forEach((mission: GroupMission) => {
        expect(mission.steps.length).toBeGreaterThanOrEqual(2)
        expect(mission.steps.length).toBeLessThanOrEqual(6)
      })
    })

    it('mission titles should be descriptive and unique', () => {
      const titles = groupMissionsData.map(m => m.title)
      const uniqueTitles = [...new Set(titles)]
      expect(titles.length).toBe(uniqueTitles.length)
      titles.forEach(title => {
        expect(title.length).toBeGreaterThan(5)
      })
    })
  })
})
