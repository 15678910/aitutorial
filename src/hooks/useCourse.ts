import { useState, useEffect } from 'react'
import { coursesData, loadCourse } from '../content/courses'
import type { Course } from '../types'

export function useCourseList(): (Course & { icon: string })[] {
  return coursesData
}

// Updated hook for async course loading with chapters
export function useCourseBySlug(slug: string): (Course & { icon: string }) | undefined {
  const [course, setCourse] = useState<(Course & { icon: string }) | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    loadCourse(slug).then(loadedCourse => {
      if (mounted) {
        setCourse(loadedCourse || undefined)
        setLoading(false)
      }
    })

    return () => { mounted = false }
  }, [slug])

  // Return loading state if still loading, otherwise return course
  if (loading) {
    // Return meta-only version from coursesData for immediate rendering
    return coursesData.find(c => c.slug === slug)
  }

  return course
}
