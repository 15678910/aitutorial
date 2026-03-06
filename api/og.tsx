import { ImageResponse } from '@vercel/og'

export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #29264c 0%, #3b3870 40%, #4f46e5 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.3)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex' }} />

        {/* Logo area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #34d399, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 'bold', color: 'white',
          }}>
            AI
          </div>
          <span style={{ fontSize: '42px', fontWeight: 800, color: 'white' }}>
            AI 학습 플랫폼
          </span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '28px', color: 'rgba(255,255,255,0.8)',
          marginBottom: '40px', textAlign: 'center', display: 'flex',
        }}>
          누구나 배울 수 있는 인공지능
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '48px' }}>
          {[
            { num: '21', label: '코스' },
            { num: '4', label: '학습 경로' },
            { num: '100%', label: '무료' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '48px', fontWeight: 800, color: '#34d399' }}>
                {stat.num}
              </span>
              <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div style={{
          position: 'absolute', bottom: '32px',
          fontSize: '18px', color: 'rgba(255,255,255,0.5)',
          display: 'flex',
        }}>
          AI 입문부터 딥러닝, 생성형 AI, Claude API까지
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
