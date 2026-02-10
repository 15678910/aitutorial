import { coursesData } from '../content/courses'
import type { Course } from '../types'

export function useCourseList(): (Course & { icon: string })[] {
  return coursesData
}

export function useCourseBySlug(slug: string): (Course & { icon: string }) | undefined {
  return coursesData.find(c => c.slug === slug)
}
