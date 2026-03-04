import { useXPStore } from '../store/xpStore'
import { useProgressStore } from '../store/progressStore'

/**
 * Thin wrapper around useXPStore that exposes all XP state plus
 * convenience methods for earning XP from specific learning actions.
 *
 * Deduplication is enforced by checking progressStore.completedSections
 * before granting section/quiz XP – the XP is only awarded the first time
 * an action is recorded (matching how progressStore.markComplete works).
 */
export function useXP() {
  const xpStore = useXPStore()
  const { completedSections, quizScores } = useProgressStore()

  /**
   * Grant +15 XP for reading a section for the first time.
   * No-op if the section is already in completedSections.
   */
  const earnSectionXP = (sectionId: string) => {
    if (completedSections.has(sectionId)) return
    xpStore.addXP(15, `섹션 완료: ${sectionId}`)
  }

  /**
   * Grant quiz XP for a section:
   *   - 100점 → +20 XP (perfect score bonus, replaces the base +10)
   *   - 60점 이상 → +10 XP
   *   - 60점 미만 → no XP
   *
   * Deduplicates by checking whether the section already has a stored
   * quiz score (i.e. the user has already passed and earned XP before).
   */
  const earnQuizXP = (sectionId: string, score: number) => {
    // Only award XP when the quiz is passed (60+)
    if (score < 60) return

    // Deduplicate: if there is already a passing score recorded, skip
    const existingScore = quizScores.get(sectionId)
    if (existingScore !== undefined && existingScore >= 60) return

    if (score === 100) {
      xpStore.addXP(20, `퀴즈 만점: ${sectionId}`)
    } else {
      xpStore.addXP(10, `퀴즈 통과: ${sectionId}`)
    }
  }

  /**
   * Grant +30 XP bonus for completing all sections in a chapter.
   * Callers are responsible for checking that the chapter is actually
   * complete before calling this (to avoid double-awarding).
   */
  const earnChapterXP = (courseSlug: string, chapterSlug: string) => {
    xpStore.addXP(30, `챕터 완료: ${courseSlug}/${chapterSlug}`)
  }

  /**
   * Grant +100 XP bonus for completing an entire course.
   * Callers are responsible for triggering this only once per course.
   */
  const earnCourseXP = (courseSlug: string) => {
    xpStore.addXP(100, `코스 완료: ${courseSlug}`)
  }

  return {
    // All XP store state
    totalXP: xpStore.totalXP,
    level: xpStore.level,
    levelTitle: xpStore.levelTitle,
    levelEmoji: xpStore.levelEmoji,
    xpToNextLevel: xpStore.xpToNextLevel,
    currentLevelXP: xpStore.currentLevelXP,
    nextLevelXP: xpStore.nextLevelXP,
    recentXPGains: xpStore.recentXPGains,
    lastDailyBonus: xpStore.lastDailyBonus,

    // Actions from store
    addXP: xpStore.addXP,
    checkDailyBonus: xpStore.checkDailyBonus,
    getProgressPercent: xpStore.getProgressPercent,

    // Convenience methods
    earnSectionXP,
    earnQuizXP,
    earnChapterXP,
    earnCourseXP,
  }
}
