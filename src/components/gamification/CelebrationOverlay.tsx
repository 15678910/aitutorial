import { useEffect, useState } from 'react'

interface CelebrationOverlayProps {
  show: boolean
  message: string
  emoji?: string
  onDone?: () => void
}

export default function CelebrationOverlay({ show, message, emoji = '🎉', onDone }: CelebrationOverlayProps) {
  const [visible, setVisible] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([])

  useEffect(() => {
    if (show) {
      setVisible(true)
      const emojis = ['🎉', '⭐', '🎊', '✨', '💫', '🌟', '🏆', '🎯']
      setParticles(
        Array.from({ length: 20 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          delay: Math.random() * 0.5,
        }))
      )
      setTimeout(() => {
        setVisible(false)
        onDone?.()
      }, 3000)
    }
  }, [show, onDone])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute text-2xl animate-bounce"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: '1s',
          }}
        >
          {p.emoji}
        </div>
      ))}
      {/* Central message */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl px-10 py-8 shadow-2xl text-center animate-bounce pointer-events-auto" style={{ animationDuration: '0.5s', animationIterationCount: '1' }}>
        <div className="text-6xl mb-4">{emoji}</div>
        <div className="text-2xl font-extrabold text-gray-900">{message}</div>
      </div>
    </div>
  )
}
