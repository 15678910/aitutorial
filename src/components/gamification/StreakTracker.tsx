import { useEffect, useState } from 'react'

function getStreak(): { current: number; lastDate: string } {
  try {
    const data = localStorage.getItem('ai-learning-streak')
    if (data) return JSON.parse(data)
  } catch {}
  return { current: 0, lastDate: '' }
}

function updateStreak(): number {
  const today = new Date().toISOString().split('T')[0]
  const streak = getStreak()

  if (streak.lastDate === today) return streak.current

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const newStreak = streak.lastDate === yesterday ? streak.current + 1 : 1

  localStorage.setItem('ai-learning-streak', JSON.stringify({ current: newStreak, lastDate: today }))
  return newStreak
}

export default function StreakTracker() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(updateStreak())
  }, [])

  if (streak === 0) return null

  const flames = streak >= 7 ? '🔥🔥🔥' : streak >= 3 ? '🔥🔥' : '🔥'

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
      <span className="text-lg">{flames}</span>
      <span className="text-sm font-bold text-orange-700">{streak}일 연속 학습!</span>
    </div>
  )
}

export { getStreak, updateStreak }
