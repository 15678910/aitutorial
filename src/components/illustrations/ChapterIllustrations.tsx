import { getCourseTheme } from '../../lib/courseThemes'

interface ChapterIllustrationProps {
  courseSlug: string
  chapterIndex: number
  className?: string
}

// A friendly robot character for AI intro
function RobotCharacter({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Body */}
      <rect x="60" y="80" width="80" height="70" rx="15" fill={color} />
      {/* Head */}
      <rect x="65" y="30" width="70" height="55" rx="12" fill={color} />
      {/* Eyes */}
      <circle cx="85" cy="55" r="8" fill="white" />
      <circle cx="115" cy="55" r="8" fill="white" />
      <circle cx="87" cy="56" r="4" fill="#29264c" />
      <circle cx="117" cy="56" r="4" fill="#29264c" />
      {/* Smile */}
      <path d="M85 68 Q100 80 115 68" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      {/* Antenna */}
      <line x1="100" y1="30" x2="100" y2="15" stroke={color} strokeWidth="3" />
      <circle cx="100" cy="12" r="5" fill={color} opacity="0.7" />
      {/* Arms */}
      <rect x="35" y="90" width="25" height="12" rx="6" fill={color} opacity="0.8" />
      <rect x="140" y="90" width="25" height="12" rx="6" fill={color} opacity="0.8" />
      {/* Legs */}
      <rect x="75" y="150" width="15" height="25" rx="7" fill={color} opacity="0.8" />
      <rect x="110" y="150" width="15" height="25" rx="7" fill={color} opacity="0.8" />
      {/* Waving hand */}
      <circle cx="165" cy="85" r="8" fill={color} opacity="0.8" />
    </svg>
  )
}

// A brain with gears for core concepts
function BrainWithGears({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Brain shape */}
      <ellipse cx="100" cy="90" rx="55" ry="50" fill={color} opacity="0.2" />
      <ellipse cx="85" cy="80" rx="35" ry="35" fill={color} opacity="0.5" />
      <ellipse cx="115" cy="80" rx="35" ry="35" fill={color} opacity="0.5" />
      <ellipse cx="90" cy="100" rx="30" ry="25" fill={color} opacity="0.4" />
      <ellipse cx="110" cy="100" rx="30" ry="25" fill={color} opacity="0.4" />
      {/* Gear 1 */}
      <circle cx="90" cy="85" r="12" fill="white" stroke={color} strokeWidth="3" />
      <circle cx="90" cy="85" r="4" fill={color} />
      {/* Gear 2 */}
      <circle cx="115" cy="95" r="10" fill="white" stroke={color} strokeWidth="3" />
      <circle cx="115" cy="95" r="3" fill={color} />
      {/* Sparkles */}
      <text x="50" y="55" fontSize="16" fill={color}>✨</text>
      <text x="140" y="65" fontSize="14" fill={color}>💡</text>
      {/* Connection lines */}
      <path d="M100 130 L100 170" stroke={color} strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="100" cy="175" r="8" fill={color} opacity="0.3" />
    </svg>
  )
}

// Globe with connections for applications
function GlobalNetwork({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Globe */}
      <circle cx="100" cy="100" r="55" fill={color} opacity="0.15" />
      <circle cx="100" cy="100" r="45" fill={color} opacity="0.25" />
      {/* Grid lines */}
      <ellipse cx="100" cy="100" rx="45" ry="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="100" cy="100" rx="20" ry="45" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="55" y1="100" x2="145" y2="100" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <line x1="100" y1="55" x2="100" y2="145" stroke={color} strokeWidth="1.5" opacity="0.4" />
      {/* Connection dots */}
      <circle cx="75" cy="80" r="6" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="125" cy="85" r="6" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="100" cy="120" r="6" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="85" cy="65" r="4" fill={color} />
      <circle cx="120" cy="115" r="4" fill={color} />
      {/* Connection lines */}
      <line x1="75" y1="80" x2="125" y2="85" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <line x1="125" y1="85" x2="100" y2="120" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <line x1="100" y1="120" x2="75" y2="80" stroke={color} strokeWidth="1.5" opacity="0.5" />
      {/* Emoji icons around */}
      <text x="40" y="60" fontSize="16">🏥</text>
      <text x="145" y="70" fontSize="16">🚗</text>
      <text x="55" y="160" fontSize="16">🎵</text>
      <text x="130" y="150" fontSize="16">📱</text>
    </svg>
  )
}

// Data flowing into a funnel for ML overview
function DataFunnel({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Data points floating */}
      <circle cx="50" cy="30" r="8" fill={color} opacity="0.4" />
      <circle cx="100" cy="25" r="6" fill={color} opacity="0.6" />
      <circle cx="150" cy="35" r="7" fill={color} opacity="0.5" />
      <circle cx="70" cy="45" r="5" fill={color} opacity="0.7" />
      <circle cx="130" cy="40" r="9" fill={color} opacity="0.3" />
      {/* Funnel */}
      <path d="M40 60 L160 60 L120 120 L80 120 Z" fill={color} opacity="0.2" />
      <path d="M80 120 L120 120 L110 170 L90 170 Z" fill={color} opacity="0.4" />
      {/* Arrow coming out */}
      <path d="M100 175 L100 190" stroke={color} strokeWidth="3" />
      <polygon points="90,185 100,198 110,185" fill={color} />
      {/* Sparkle */}
      <text x="90" y="195" fontSize="12">⭐</text>
      {/* Labels */}
      <rect x="45" y="28" width="12" height="8" rx="2" fill="white" opacity="0.8" />
      <rect x="95" y="20" width="12" height="8" rx="2" fill="white" opacity="0.8" />
      <rect x="145" y="30" width="12" height="8" rx="2" fill="white" opacity="0.8" />
    </svg>
  )
}

// Decision tree / paths for supervised learning
function DecisionTree({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Root node */}
      <circle cx="100" cy="35" r="15" fill={color} opacity="0.8" />
      <text x="95" y="40" fill="white" fontSize="14" fontWeight="bold">?</text>
      {/* Branches */}
      <line x1="90" y1="48" x2="60" y2="80" stroke={color} strokeWidth="2.5" />
      <line x1="110" y1="48" x2="140" y2="80" stroke={color} strokeWidth="2.5" />
      {/* Second level */}
      <circle cx="60" cy="90" r="12" fill={color} opacity="0.6" />
      <circle cx="140" cy="90" r="12" fill={color} opacity="0.6" />
      {/* Third level branches */}
      <line x1="52" y1="100" x2="35" y2="130" stroke={color} strokeWidth="2" opacity="0.7" />
      <line x1="68" y1="100" x2="85" y2="130" stroke={color} strokeWidth="2" opacity="0.7" />
      <line x1="132" y1="100" x2="115" y2="130" stroke={color} strokeWidth="2" opacity="0.7" />
      <line x1="148" y1="100" x2="165" y2="130" stroke={color} strokeWidth="2" opacity="0.7" />
      {/* Leaf nodes */}
      <circle cx="35" cy="140" r="10" fill={color} opacity="0.3" />
      <text x="30" y="144" fontSize="12">🐱</text>
      <circle cx="85" cy="140" r="10" fill={color} opacity="0.3" />
      <text x="80" y="144" fontSize="12">🐶</text>
      <circle cx="115" cy="140" r="10" fill={color} opacity="0.3" />
      <text x="110" y="144" fontSize="12">🐟</text>
      <circle cx="165" cy="140" r="10" fill={color} opacity="0.3" />
      <text x="160" y="144" fontSize="12">🐦</text>
      {/* Ground line */}
      <line x1="20" y1="170" x2="180" y2="170" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

// Chart/graph for model evaluation
function ChartGraph({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Axes */}
      <line x1="40" y1="160" x2="175" y2="160" stroke={color} strokeWidth="2" />
      <line x1="40" y1="160" x2="40" y2="30" stroke={color} strokeWidth="2" />
      {/* Grid lines */}
      <line x1="40" y1="120" x2="175" y2="120" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="40" y1="80" x2="175" y2="80" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* Rising curve */}
      <path d="M45 150 Q80 145 95 110 Q110 75 140 55 Q160 42 170 40" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
      {/* Data points */}
      <circle cx="60" cy="145" r="5" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="95" cy="110" r="5" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="120" cy="75" r="5" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="145" cy="52" r="5" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="170" cy="40" r="5" fill={color} />
      {/* Target star */}
      <text x="162" y="35" fontSize="16">⭐</text>
      {/* Labels */}
      <text x="85" y="185" fontSize="10" fill={color} opacity="0.6">학습량</text>
      <text x="10" y="95" fontSize="10" fill={color} opacity="0.6" transform="rotate(-90, 20, 95)">성능</text>
    </svg>
  )
}

// Neural network nodes for deep learning
function NeuralNetworkFriendly({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Input layer */}
      <circle cx="40" cy="60" r="12" fill={color} opacity="0.4" />
      <circle cx="40" cy="100" r="12" fill={color} opacity="0.4" />
      <circle cx="40" cy="140" r="12" fill={color} opacity="0.4" />
      {/* Hidden layer */}
      <circle cx="100" cy="50" r="12" fill={color} opacity="0.6" />
      <circle cx="100" cy="100" r="12" fill={color} opacity="0.6" />
      <circle cx="100" cy="150" r="12" fill={color} opacity="0.6" />
      {/* Output layer */}
      <circle cx="160" cy="80" r="14" fill={color} opacity="0.8" />
      <circle cx="160" cy="120" r="14" fill={color} opacity="0.8" />
      {/* Connections input -> hidden */}
      {[60, 100, 140].map(y1 => [50, 100, 150].map(y2 => (
        <line key={`i${y1}-h${y2}`} x1="52" y1={y1} x2="88" y2={y2} stroke={color} strokeWidth="1" opacity="0.25" />
      )))}
      {/* Connections hidden -> output */}
      {[50, 100, 150].map(y1 => [80, 120].map(y2 => (
        <line key={`h${y1}-o${y2}`} x1="112" y1={y1} x2="146" y2={y2} stroke={color} strokeWidth="1" opacity="0.25" />
      )))}
      {/* Face on output node */}
      <circle cx="155" cy="77" r="2" fill="white" />
      <circle cx="165" cy="77" r="2" fill="white" />
      <path d="M155 84 Q160 88 165 84" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Sparkles */}
      <text x="170" y="65" fontSize="12">✨</text>
    </svg>
  )
}

// Image grid for CNN
function ImageGrid({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Image frame */}
      <rect x="30" y="30" width="80" height="80" rx="8" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      {/* Pixel grid */}
      {[0,1,2,3].map(r => [0,1,2,3].map(c => (
        <rect key={`p${r}${c}`} x={35+c*17} y={35+r*17} width="15" height="15" rx="2" fill={color} opacity={0.2 + Math.random() * 0.5} />
      )))}
      {/* Arrow */}
      <path d="M120 70 L145 70" stroke={color} strokeWidth="3" markerEnd="url(#arrowCNN)" />
      <defs>
        <marker id="arrowCNN" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <polygon points="0,0 8,4 0,8" fill={color} />
        </marker>
      </defs>
      {/* Feature maps */}
      <rect x="150" y="40" width="30" height="30" rx="4" fill={color} opacity="0.4" />
      <rect x="155" y="55" width="30" height="30" rx="4" fill={color} opacity="0.5" />
      <rect x="160" y="70" width="30" height="30" rx="4" fill={color} opacity="0.6" />
      {/* Result */}
      <text x="155" y="130" fontSize="20">🐱</text>
      <text x="90" y="145" fontSize="10" fill={color} opacity="0.6">= 고양이!</text>
    </svg>
  )
}

// Speech bubbles for RNN & NLP
function SpeechBubbles({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Character */}
      <circle cx="50" cy="130" r="20" fill={color} opacity="0.3" />
      <circle cx="50" cy="110" r="14" fill={color} opacity="0.5" />
      <circle cx="45" cy="107" r="3" fill="white" />
      <circle cx="55" cy="107" r="3" fill="white" />
      <circle cx="46" cy="108" r="1.5" fill="#29264c" />
      <circle cx="56" cy="108" r="1.5" fill="#29264c" />
      <path d="M45 115 Q50 119 55 115" fill="none" stroke="white" strokeWidth="1.5" />
      {/* Speech bubble 1 */}
      <rect x="80" y="30" width="100" height="40" rx="15" fill={color} opacity="0.2" />
      <polygon points="85,70 80,80 95,68" fill={color} opacity="0.2" />
      <text x="95" y="55" fontSize="12" fill={color} fontWeight="bold">안녕하세요! 👋</text>
      {/* Speech bubble 2 - robot response */}
      <rect x="70" y="90" width="110" height="40" rx="15" fill={color} opacity="0.4" />
      <polygon points="165,125 175,135 160,128" fill={color} opacity="0.4" />
      <text x="85" y="115" fontSize="11" fill="white" fontWeight="bold">반갑습니다! 🤖</text>
      {/* Robot */}
      <rect x="155" y="140" width="25" height="20" rx="5" fill={color} opacity="0.6" />
      <rect x="158" y="130" width="19" height="14" rx="4" fill={color} opacity="0.6" />
      <circle cx="164" cy="136" r="2" fill="white" />
      <circle cx="172" cy="136" r="2" fill="white" />
      {/* Connection dots (sequence) */}
      <circle cx="60" cy="170" r="3" fill={color} opacity="0.3" />
      <circle cx="80" cy="170" r="3" fill={color} opacity="0.4" />
      <circle cx="100" cy="170" r="3" fill={color} opacity="0.5" />
      <circle cx="120" cy="170" r="3" fill={color} opacity="0.6" />
      <circle cx="140" cy="170" r="3" fill={color} opacity="0.7" />
      <line x1="63" y1="170" x2="137" y2="170" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

// Magic wand for GenAI basics
function MagicWand({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Wand */}
      <line x1="40" y1="160" x2="120" y2="60" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="120" cy="60" r="8" fill={color} />
      {/* Sparkles around tip */}
      <text x="130" y="45" fontSize="14">✨</text>
      <text x="110" y="35" fontSize="12">⭐</text>
      <text x="140" y="65" fontSize="10">💫</text>
      {/* Generated items */}
      <rect x="135" y="80" width="45" height="35" rx="6" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <text x="148" y="102" fontSize="16">🖼️</text>
      <rect x="140" y="125" width="40" height="25" rx="6" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <text x="145" y="143" fontSize="9" fill={color}>Hello!</text>
      <rect x="125" y="160" width="50" height="25" rx="6" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <text x="138" y="177" fontSize="14">🎵</text>
      {/* Dotted path from wand to items */}
      <path d="M125 60 Q150 70 140 85" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  )
}

// Chat interface for LLM
function ChatInterface({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Phone/Screen frame */}
      <rect x="45" y="20" width="110" height="165" rx="15" fill="white" stroke={color} strokeWidth="2.5" />
      {/* Screen */}
      <rect x="52" y="35" width="96" height="130" rx="4" fill={color} opacity="0.05" />
      {/* User message */}
      <rect x="70" y="45" width="70" height="24" rx="12" fill={color} opacity="0.2" />
      <text x="80" y="61" fontSize="9" fill={color}>AI가 뭐야?</text>
      {/* Bot message */}
      <rect x="58" y="78" width="80" height="35" rx="12" fill={color} opacity="0.6" />
      <text x="65" y="93" fontSize="8" fill="white">AI는 인간의</text>
      <text x="65" y="105" fontSize="8" fill="white">지능을 모방한 기술!</text>
      {/* Bot avatar */}
      <circle cx="58" cy="125" r="8" fill={color} opacity="0.4" />
      <text x="53" y="128" fontSize="8">🤖</text>
      {/* Input field */}
      <rect x="55" y="140" width="90" height="18" rx="9" fill="white" stroke={color} strokeWidth="1" opacity="0.5" />
      <text x="63" y="152" fontSize="7" fill={color} opacity="0.4">메시지 입력...</text>
      {/* Typing indicator */}
      <circle cx="62" cy="130" r="2" fill={color} opacity="0.3" />
      <circle cx="70" cy="130" r="2" fill={color} opacity="0.5" />
      <circle cx="78" cy="130" r="2" fill={color} opacity="0.7" />
    </svg>
  )
}

// Palette/canvas for image generation
function CreativePalette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Canvas */}
      <rect x="60" y="30" width="100" height="80" rx="8" fill="white" stroke={color} strokeWidth="2" />
      {/* Artwork on canvas */}
      <circle cx="90" cy="55" r="12" fill={color} opacity="0.3" />
      <circle cx="120" cy="65" r="15" fill={color} opacity="0.4" />
      <rect x="75" y="80" width="50" height="20" rx="4" fill={color} opacity="0.2" />
      {/* Text prompt below */}
      <rect x="40" y="125" width="120" height="30" rx="8" fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" />
      <text x="52" y="144" fontSize="9" fill={color}>"귀여운 고양이 그려줘"</text>
      {/* Arrow from text to canvas */}
      <path d="M100 125 L100 115" stroke={color} strokeWidth="2" markerEnd="url(#arrowPal)" />
      <defs>
        <marker id="arrowPal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0,0 6,3 0,6" fill={color} />
        </marker>
      </defs>
      {/* Sparkles */}
      <text x="160" y="45" fontSize="14">🎨</text>
      <text x="30" y="60" fontSize="12">✨</text>
      {/* Color dots */}
      <circle cx="55" cy="170" r="6" fill="#FF6B6B" />
      <circle cx="75" cy="170" r="6" fill="#2EC4B6" />
      <circle cx="95" cy="170" r="6" fill="#FFB830" />
      <circle cx="115" cy="170" r="6" fill="#7C5CFC" />
      <circle cx="135" cy="170" r="6" fill={color} opacity="0.3" />
    </svg>
  )
}

// Maze with search path for core concepts
function SearchMaze({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Maze grid background */}
      <rect x="30" y="30" width="140" height="140" rx="8" fill={color} opacity="0.05" stroke={color} strokeWidth="2" />
      {/* Maze walls */}
      <line x1="70" y1="30" x2="70" y2="90" stroke={color} strokeWidth="3" opacity="0.3" />
      <line x1="30" y1="70" x2="90" y2="70" stroke={color} strokeWidth="3" opacity="0.3" />
      <line x1="110" y1="50" x2="110" y2="130" stroke={color} strokeWidth="3" opacity="0.3" />
      <line x1="70" y1="110" x2="130" y2="110" stroke={color} strokeWidth="3" opacity="0.3" />
      <line x1="150" y1="70" x2="150" y2="150" stroke={color} strokeWidth="3" opacity="0.3" />
      {/* Search path highlighted */}
      <path d="M45 45 L50 55 L50 90 L70 90 L90 90 L90 120 L120 120 L120 90 L140 90 L155 105"
            fill="none" stroke={color} strokeWidth="3" strokeDasharray="5 5" opacity="0.6" />
      {/* Start point */}
      <circle cx="45" cy="45" r="8" fill={color} opacity="0.4" />
      <text x="41" y="50" fontSize="10" fill="white">S</text>
      {/* Question marks at decision points */}
      <circle cx="70" cy="90" r="10" fill={color} opacity="0.3" />
      <text x="65" y="95" fontSize="14" fill={color}>?</text>
      <circle cx="120" cy="120" r="10" fill={color} opacity="0.3" />
      <text x="115" y="125" fontSize="14" fill={color}>?</text>
      {/* End point (goal) */}
      <circle cx="155" cy="105" r="10" fill={color} opacity="0.8" />
      <text x="150" y="110" fontSize="12">⭐</text>
      {/* Search dots along path */}
      <circle cx="50" cy="70" r="3" fill={color} opacity="0.5" />
      <circle cx="90" cy="105" r="3" fill={color} opacity="0.5" />
      <circle cx="140" cy="90" r="3" fill={color} opacity="0.5" />
      {/* Magnifying glass */}
      <circle cx="160" cy="40" r="12" fill="none" stroke={color} strokeWidth="2" />
      <line x1="169" y1="49" x2="178" y2="58" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Learning curve chart for machine learning
function LearningCurve({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Axes */}
      <line x1="40" y1="160" x2="180" y2="160" stroke={color} strokeWidth="2.5" />
      <line x1="40" y1="160" x2="40" y2="30" stroke={color} strokeWidth="2.5" />
      {/* Grid lines */}
      <line x1="40" y1="120" x2="180" y2="120" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="40" y1="80" x2="180" y2="80" stroke={color} strokeWidth="0.5" opacity="0.2" />
      {/* Learning curve - smooth upward trend */}
      <path d="M45 155 Q70 140 90 110 Q110 85 130 65 Q150 50 175 42"
            fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      {/* Data points with labels */}
      <circle cx="55" cy="150" r="6" fill={color} opacity="0.3" />
      <circle cx="75" cy="132" r="6" fill={color} opacity="0.4" />
      <text x="80" y="128" fontSize="12">🐱</text>
      <circle cx="95" cy="105" r="6" fill={color} opacity="0.5" />
      <circle cx="115" cy="80" r="6" fill={color} opacity="0.6" />
      <text x="120" y="76" fontSize="12">🐶</text>
      <circle cx="135" cy="62" r="6" fill={color} opacity="0.7" />
      <circle cx="155" cy="52" r="7" fill={color} opacity="0.8" />
      <circle cx="175" cy="42" r="8" fill={color} />
      <text x="168" y="38" fontSize="14">⭐</text>
      {/* Axis labels */}
      <text x="85" y="180" fontSize="11" fill={color} opacity="0.6">Training →</text>
      <text x="10" y="100" fontSize="11" fill={color} opacity="0.6" transform="rotate(-90, 20, 100)">Accuracy</text>
      {/* Sparkle at top */}
      <text x="180" y="30" fontSize="14">✨</text>
    </svg>
  )
}

// Future vision with crystal ball for AI future
function FutureVision({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Crystal ball */}
      <circle cx="100" cy="95" r="45" fill={color} opacity="0.1" />
      <circle cx="100" cy="90" r="40" fill={color} opacity="0.15" stroke={color} strokeWidth="2" />
      {/* Glow effect */}
      <circle cx="100" cy="90" r="35" fill={color} opacity="0.05" />
      {/* Stars and planets inside ball */}
      <text x="75" y="75" fontSize="14">⭐</text>
      <text x="115" y="85" fontSize="12">🌟</text>
      <text x="90" y="105" fontSize="16">🪐</text>
      {/* Rocket */}
      <text x="105" y="95" fontSize="18">🚀</text>
      {/* Base stand */}
      <ellipse cx="100" cy="140" rx="25" ry="8" fill={color} opacity="0.3" />
      <path d="M75 140 L85 145 L115 145 L125 140" fill={color} opacity="0.4" />
      {/* Sparkles around */}
      <text x="40" y="70" fontSize="16">✨</text>
      <text x="155" y="65" fontSize="14">💫</text>
      <text x="50" y="130" fontSize="12">⭐</text>
      <text x="145" y="125" fontSize="13">✨</text>
      {/* Telescope in corner */}
      <line x1="160" y1="150" x2="180" y2="160" stroke={color} strokeWidth="3" opacity="0.5" />
      <circle cx="158" cy="148" r="6" fill="none" stroke={color} strokeWidth="2" opacity="0.5" />
      {/* Connection to future - dotted lines */}
      <path d="M100 135 L100 155" stroke={color} strokeWidth="2" strokeDasharray="3 3" opacity="0.3" />
      <circle cx="100" cy="160" r="5" fill={color} opacity="0.2" />
      {/* Vision rays */}
      <line x1="55" y1="75" x2="40" y2="60" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <line x1="145" y1="75" x2="160" y2="60" stroke={color} strokeWidth="1.5" opacity="0.2" />
      <line x1="70" y1="120" x2="55" y2="135" stroke={color} strokeWidth="1.5" opacity="0.2" />
    </svg>
  )
}

// Pineapple routes for optimization
function PineappleRoutes({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="20" y="130" width="30" height="25" rx="4" fill={color} opacity="0.4" />
      <polygon points="20,130 35,115 50,130" fill={color} opacity="0.5" />
      <path d="M50 142 Q80 120 100 130 Q120 140 150 120" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6 4" />
      <path d="M50 142 Q70 160 100 155 Q130 150 150 120" fill="none" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <circle cx="160" cy="115" r="15" fill={color} opacity="0.3" />
      <text x="152" y="122" fontSize="20">🍍</text>
      <circle cx="85" cy="115" r="10" fill="white" stroke={color} strokeWidth="1.5" />
      <text x="80" y="119" fontSize="9" fill={color} fontWeight="bold">3km</text>
      <circle cx="115" cy="155" r="10" fill="white" stroke={color} strokeWidth="1.5" />
      <text x="110" y="159" fontSize="9" fill={color} fontWeight="bold">5km</text>
      <circle cx="170" cy="170" r="12" fill="white" stroke={color} strokeWidth="1.5" />
      <text x="167" y="167" fontSize="8" fill={color}>N</text>
    </svg>
  )
}

// Coin flips for probability
function CoinFlips({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <ellipse cx="70" cy="70" rx="25" ry="25" fill={color} opacity="0.6" />
      <text x="60" y="75" fontSize="14" fill="white" fontWeight="bold">H</text>
      <ellipse cx="130" cy="70" rx="25" ry="25" fill={color} opacity="0.3" />
      <text x="120" y="75" fontSize="14" fill={color} fontWeight="bold">T</text>
      <rect x="40" y="120" width="120" height="20" rx="10" fill={color} opacity="0.15" />
      <rect x="40" y="120" width="60" height="20" rx="10" fill={color} opacity="0.5" />
      <text x="55" y="134" fontSize="10" fill="white" fontWeight="bold">50%</text>
      <text x="115" y="134" fontSize="10" fill={color}>50%</text>
      <rect x="60" y="155" width="30" height="30" rx="5" fill="white" stroke={color} strokeWidth="2" />
      <circle cx="70" cy="165" r="2.5" fill={color} />
      <circle cx="80" cy="165" r="2.5" fill={color} />
      <circle cx="75" cy="175" r="2.5" fill={color} />
      <text x="110" y="180" fontSize="24" fill={color} opacity="0.4">?</text>
      <text x="155" y="50" fontSize="14">🎲</text>
    </svg>
  )
}

// Regression line for ML chapter
function RegressionLine({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <line x1="35" y1="165" x2="180" y2="165" stroke={color} strokeWidth="2" />
      <line x1="35" y1="165" x2="35" y2="25" stroke={color} strokeWidth="2" />
      <circle cx="55" cy="145" r="5" fill={color} opacity="0.3" />
      <circle cx="70" cy="130" r="5" fill={color} opacity="0.3" />
      <circle cx="95" cy="110" r="5" fill={color} opacity="0.3" />
      <circle cx="110" cy="100" r="5" fill={color} opacity="0.3" />
      <circle cx="135" cy="90" r="5" fill={color} opacity="0.3" />
      <circle cx="150" cy="65" r="5" fill={color} opacity="0.3" />
      <circle cx="165" cy="55" r="5" fill={color} opacity="0.3" />
      <line x1="45" y1="155" x2="175" y2="45" stroke={color} strokeWidth="3" opacity="0.7" />
      <text x="90" y="95" fontSize="14">🏠</text>
      <text x="145" y="55" fontSize="14">🏢</text>
      <text x="80" y="185" fontSize="10" fill={color} opacity="0.5">면적 →</text>
    </svg>
  )
}

// Neural network builder for chapter 4
function NeuralBuilder({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="35" cy="55" r="14" fill={color} opacity="0.3" />
      <circle cx="35" cy="100" r="14" fill={color} opacity="0.3" />
      <circle cx="35" cy="145" r="14" fill={color} opacity="0.3" />
      <circle cx="100" cy="45" r="14" fill={color} opacity="0.5" />
      <circle cx="100" cy="100" r="14" fill={color} opacity="0.5" />
      <circle cx="100" cy="155" r="14" fill={color} opacity="0.5" />
      <circle cx="165" cy="100" r="16" fill={color} opacity="0.8" />
      <text x="158" y="105" fontSize="12" fill="white" fontWeight="bold">y</text>
      {[55, 100, 145].map(y1 => [45, 100, 155].map(y2 => (
        <line key={`b${y1}-${y2}`} x1="49" y1={y1} x2="86" y2={y2} stroke={color} strokeWidth="1" opacity="0.2" />
      )))}
      {[45, 100, 155].map(y1 => (
        <line key={`bh-${y1}`} x1="114" y1={y1} x2="149" y2={100} stroke={color} strokeWidth="1.5" opacity="0.3" />
      ))}
      <text x="168" y="60" fontSize="16">🔧</text>
      <text x="170" y="145" fontSize="12">⚡</text>
    </svg>
  )
}

// Lightbulb project for conclusion
function ProjectIdea({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="100" cy="75" r="35" fill={color} opacity="0.15" />
      <circle cx="100" cy="75" r="28" fill={color} opacity="0.25" />
      <path d="M90 65 Q95 55 100 65 Q105 55 110 65" fill="none" stroke={color} strokeWidth="2.5" />
      <rect x="88" y="108" width="24" height="12" rx="3" fill={color} opacity="0.4" />
      <rect x="90" y="118" width="20" height="6" rx="2" fill={color} opacity="0.5" />
      <line x1="100" y1="30" x2="100" y2="18" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="65" y1="45" x2="55" y2="38" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="135" y1="45" x2="145" y2="38" stroke={color} strokeWidth="2" opacity="0.4" />
      <text x="35" y="155" fontSize="14">📊</text>
      <text x="75" y="170" fontSize="14">💡</text>
      <text x="115" y="160" fontSize="14">🤖</text>
      <text x="150" y="150" fontSize="14">🚀</text>
    </svg>
  )
}

// Terminal with Claude logo for getting started
function TerminalClaude({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="25" y="35" width="150" height="110" rx="12" fill="#1e1e2e" stroke={color} strokeWidth="2.5" />
      <rect x="25" y="35" width="150" height="24" rx="12" fill={color} opacity="0.9" />
      <circle cx="42" cy="47" r="4" fill="#ff5f56" />
      <circle cx="56" cy="47" r="4" fill="#ffbd2e" />
      <circle cx="70" cy="47" r="4" fill="#27c93f" />
      <text x="40" y="80" fontSize="11" fill={color} fontFamily="monospace" opacity="0.8">$ claude</text>
      <text x="40" y="95" fontSize="10" fill="#8b8b8b" fontFamily="monospace">╭──────────────╮</text>
      <text x="40" y="108" fontSize="10" fill={color} fontFamily="monospace" fontWeight="bold"> Claude Code ✨</text>
      <text x="40" y="121" fontSize="10" fill="#8b8b8b" fontFamily="monospace">╰──────────────╯</text>
      <rect x="55" y="155" width="90" height="25" rx="6" fill={color} opacity="0.15" />
      <text x="70" y="172" fontSize="11" fill={color} fontWeight="bold">시작하기 →</text>
    </svg>
  )
}

// Command palette for basic commands
function CommandPalette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="30" y="30" width="140" height="140" rx="14" fill="white" stroke={color} strokeWidth="2" opacity="0.95" />
      <rect x="40" y="42" width="120" height="22" rx="8" fill={color} opacity="0.1" stroke={color} strokeWidth="1" />
      <text x="50" y="57" fontSize="10" fill={color} opacity="0.5">명령어를 입력하세요...</text>
      <rect x="40" y="72" width="120" height="20" rx="6" fill={color} opacity="0.15" />
      <text x="48" y="86" fontSize="9" fill={color} fontWeight="bold">/edit 파일 수정하기</text>
      <rect x="40" y="97" width="120" height="20" rx="6" fill={color} opacity="0.08" />
      <text x="48" y="111" fontSize="9" fill={color}>/test 테스트 실행</text>
      <rect x="40" y="122" width="120" height="20" rx="6" fill={color} opacity="0.08" />
      <text x="48" y="136" fontSize="9" fill={color}>/commit 변경 커밋</text>
      <rect x="40" y="147" width="120" height="20" rx="6" fill={color} opacity="0.08" />
      <text x="48" y="161" fontSize="9" fill={color}>/review 코드 리뷰</text>
    </svg>
  )
}

// Code editor with AI suggestions
function CodeWithAI({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="20" y="25" width="160" height="150" rx="10" fill="#1e1e2e" stroke={color} strokeWidth="2" />
      <rect x="20" y="25" width="35" height="150" rx="10" fill="#161622" />
      <text x="30" y="52" fontSize="8" fill="#555" fontFamily="monospace">1</text>
      <text x="30" y="66" fontSize="8" fill="#555" fontFamily="monospace">2</text>
      <text x="30" y="80" fontSize="8" fill="#555" fontFamily="monospace">3</text>
      <text x="30" y="94" fontSize="8" fill="#555" fontFamily="monospace">4</text>
      <text x="30" y="108" fontSize="8" fill="#555" fontFamily="monospace">5</text>
      <text x="60" y="52" fontSize="8" fill="#c792ea" fontFamily="monospace">function</text>
      <text x="102" y="52" fontSize="8" fill="#82aaff" fontFamily="monospace">hello()</text>
      <text x="60" y="66" fontSize="8" fill="#c3e88d" fontFamily="monospace">  return "Hi"</text>
      <text x="60" y="80" fontSize="8" fill="#c792ea" fontFamily="monospace">{'}'}</text>
      <rect x="58" y="88" width="110" height="30" rx="6" fill={color} opacity="0.2" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
      <text x="65" y="100" fontSize="7" fill={color} opacity="0.7">✨ AI 제안:</text>
      <text x="65" y="112" fontSize="7" fill={color} fontFamily="monospace">+ 에러 처리 추가</text>
      <text x="150" y="158" fontSize="16">🤖</text>
    </svg>
  )
}

// Bug with magnifying glass for debugging
function DebuggerView({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <rect x="25" y="40" width="100" height="80" rx="8" fill="#1e1e2e" stroke={color} strokeWidth="1.5" />
      <text x="32" y="58" fontSize="7" fill="#ff5370" fontFamily="monospace">Error:</text>
      <text x="32" y="70" fontSize="7" fill="#ff5370" fontFamily="monospace">undefined is</text>
      <text x="32" y="82" fontSize="7" fill="#ff5370" fontFamily="monospace">not a function</text>
      <line x1="32" y1="92" x2="115" y2="92" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <text x="32" y="105" fontSize="7" fill={color} fontFamily="monospace">→ line 42</text>
      <circle cx="155" cy="75" r="28" fill="none" stroke={color} strokeWidth="3" />
      <line x1="175" y1="95" x2="190" y2="110" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <text x="145" y="80" fontSize="20">🐛</text>
      <path d="M135 130 Q150 125 165 130" fill="none" stroke={color} strokeWidth="2" />
      <text x="140" y="145" fontSize="8" fill={color} fontWeight="bold">버그 발견!</text>
      <rect x="50" y="155" width="100" height="25" rx="6" fill={color} opacity="0.15" />
      <text x="60" y="172" fontSize="9" fill={color}>✅ claude "fix this"</text>
    </svg>
  )
}

// Workflow automation with connected nodes
function WorkflowAuto({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <circle cx="50" cy="50" r="20" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <text x="40" y="55" fontSize="12">📝</text>
      <circle cx="150" cy="50" r="20" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <text x="140" y="55" fontSize="12">🔍</text>
      <circle cx="50" cy="150" r="20" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <text x="40" y="155" fontSize="12">🧪</text>
      <circle cx="150" cy="150" r="20" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <text x="140" y="155" fontSize="12">🚀</text>
      <circle cx="100" cy="100" r="24" fill={color} opacity="0.8" />
      <text x="88" y="105" fontSize="14" fill="white" fontWeight="bold">CC</text>
      <line x1="68" y1="58" x2="80" y2="82" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="132" y1="58" x2="120" y2="82" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="68" y1="142" x2="80" y2="118" stroke={color} strokeWidth="2" opacity="0.4" />
      <line x1="132" y1="142" x2="120" y2="118" stroke={color} strokeWidth="2" opacity="0.4" />
      <path d="M70 50 L130 50" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <path d="M150 70 L150 130" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <path d="M130 150 L70 150" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <path d="M50 130 L50 70" stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
    </svg>
  )
}

// Map course+chapter to illustration
const illustrationMap: Record<string, React.FC<{ color: string }>[]> = {
  'ai-intro': [RobotCharacter, SearchMaze, LearningCurve, NeuralNetworkFriendly, GlobalNetwork, FutureVision],
  'ml-basics': [DataFunnel, DecisionTree, ChartGraph],
  'deep-learning': [NeuralNetworkFriendly, ImageGrid, SpeechBubbles],
  'generative-ai': [MagicWand, ChatInterface, CreativePalette],
  'making-ai': [PineappleRoutes, CoinFlips, RegressionLine, NeuralBuilder, ProjectIdea],
  'claude-code': [TerminalClaude, CommandPalette, CodeWithAI, DebuggerView, WorkflowAuto],
  'agent-skills': [RobotCharacter, BrainWithGears, GlobalNetwork, CommandPalette, CodeWithAI, WorkflowAuto, MagicWand, FutureVision],
}

export default function ChapterIllustration({ courseSlug, chapterIndex, className = '' }: ChapterIllustrationProps) {
  const theme = getCourseTheme(courseSlug)
  const illustrations = illustrationMap[courseSlug] || illustrationMap['ai-intro']
  const IllustrationComponent = illustrations[chapterIndex % illustrations.length]

  return (
    <div className={`${className}`}>
      <IllustrationComponent color={theme.hex} />
    </div>
  )
}

export { RobotCharacter, BrainWithGears, GlobalNetwork, DataFunnel, DecisionTree, ChartGraph, NeuralNetworkFriendly, ImageGrid, SpeechBubbles, MagicWand, ChatInterface, CreativePalette, SearchMaze, LearningCurve, FutureVision, PineappleRoutes, CoinFlips, RegressionLine, NeuralBuilder, ProjectIdea, TerminalClaude, CommandPalette, CodeWithAI, DebuggerView, WorkflowAuto }
