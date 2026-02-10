interface HeroIllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function HeroIllustration({
  className = '',
  width = 600,
  height = 400
}: HeroIllustrationProps) {
  return (
    <svg
      viewBox="0 0 600 400"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(5px); }
        }
        @keyframes rotate360 {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 8px #32c2a2); }
          50% { opacity: 0.8; filter: drop-shadow(0 0 20px #5dd4b8); }
        }
        @keyframes dataStream {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes connectionPulse {
          0%, 100% { stroke-width: 1.5; opacity: 0.3; }
          50% { stroke-width: 2.5; opacity: 0.7; }
        }
        .float-element { animation: float 4s ease-in-out infinite; }
        .float-element:nth-child(2n) { animation-delay: 0.5s; animation-duration: 5s; }
        .float-element:nth-child(3n) { animation-delay: 1s; animation-duration: 4.5s; }
        .orbit {
          transform-origin: center;
          animation: rotate360 20s linear infinite;
        }
        .glow { animation: pulseGlow 3s ease-in-out infinite; }
        .data-particle { animation: dataStream 3s ease-in-out infinite; }
        .data-particle:nth-child(2n) { animation-delay: 0.6s; }
        .data-particle:nth-child(3n) { animation-delay: 1.2s; }
        .scale-in { animation: scaleIn 1s ease-out forwards; }
        .neural-connection { animation: connectionPulse 2s ease-in-out infinite; }
      `}</style>

      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29264c" />
          <stop offset="50%" stopColor="#3d3a66" />
          <stop offset="100%" stopColor="#29264c" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5dd4b8" />
          <stop offset="100%" stopColor="#32c2a2" />
        </linearGradient>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d3a66" />
          <stop offset="100%" stopColor="#29264c" />
        </linearGradient>
        <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5dd4b8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#32c2a2" stopOpacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
        </filter>
      </defs>

      {/* Background ambient circles */}
      <g opacity="0.1">
        <circle cx="150" cy="100" r="80" fill="url(#accentGradient)" filter="url(#blur)" />
        <circle cx="450" cy="300" r="100" fill="url(#accentGradient)" filter="url(#blur)" />
      </g>

      {/* Neural network background connections */}
      <g opacity="0.2">
        <line className="neural-connection" x1="100" y1="150" x2="250" y2="200" stroke="#32c2a2" />
        <line className="neural-connection" x1="250" y1="200" x2="400" y2="180" stroke="#32c2a2" />
        <line className="neural-connection" x1="150" y1="250" x2="300" y2="280" stroke="#5dd4b8" />
        <line className="neural-connection" x1="300" y1="280" x2="450" y2="250" stroke="#5dd4b8" />
        <line className="neural-connection" x1="200" y1="100" x2="350" y2="120" stroke="#32c2a2" />
      </g>

      {/* Central human figure - stylized and modern */}
      <g className="scale-in" transform="translate(250, 180)">
        {/* Head */}
        <circle cx="0" cy="0" r="30" fill="url(#heroGradient)" stroke="#32c2a2" strokeWidth="2.5" />

        {/* Face details - minimalist */}
        <circle cx="-10" cy="-5" r="3" fill="#5dd4b8" />
        <circle cx="10" cy="-5" r="3" fill="#5dd4b8" />
        <path d="M -8 8 Q 0 12 8 8" stroke="#5dd4b8" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Body */}
        <path d="M 0 30 L 0 90" stroke="#3d3a66" strokeWidth="15" strokeLinecap="round" />

        {/* Arms */}
        <path d="M 0 45 L -40 70" stroke="#3d3a66" strokeWidth="12" strokeLinecap="round" />
        <path d="M 0 45 L 40 70" stroke="#3d3a66" strokeWidth="12" strokeLinecap="round" />

        {/* Legs */}
        <path d="M 0 90 L -20 130" stroke="#3d3a66" strokeWidth="12" strokeLinecap="round" />
        <path d="M 0 90 L 20 130" stroke="#3d3a66" strokeWidth="12" strokeLinecap="round" />

        {/* Glow effect around head - AI consciousness */}
        <circle cx="0" cy="0" r="40" fill="url(#glowGradient)" className="glow" />
      </g>

      {/* Left floating screen - data visualization */}
      <g className="float-element" transform="translate(80, 120)">
        <rect x="0" y="0" width="100" height="75" rx="6"
              fill="url(#screenGradient)"
              stroke="#32c2a2"
              strokeWidth="2" />
        {/* Chart inside */}
        <rect x="10" y="45" width="8" height="20" fill="#32c2a2" />
        <rect x="25" y="35" width="8" height="30" fill="#5dd4b8" />
        <rect x="40" y="25" width="8" height="40" fill="#32c2a2" />
        <rect x="55" y="40" width="8" height="25" fill="#5dd4b8" />
        <rect x="70" y="30" width="8" height="35" fill="#32c2a2" />
        {/* Screen title */}
        <text x="50" y="20" textAnchor="middle" fill="#5dd4b8" fontSize="10" fontWeight="600">데이터 분석</text>
      </g>

      {/* Right floating screen - neural network */}
      <g className="float-element" transform="translate(420, 140)">
        <rect x="0" y="0" width="100" height="75" rx="6"
              fill="url(#screenGradient)"
              stroke="#5dd4b8"
              strokeWidth="2" />
        {/* Neural net visualization */}
        <g opacity="0.8">
          <circle cx="20" cy="30" r="4" fill="#32c2a2" />
          <circle cx="20" cy="50" r="4" fill="#32c2a2" />
          <circle cx="50" cy="25" r="4" fill="#5dd4b8" />
          <circle cx="50" cy="40" r="4" fill="#5dd4b8" />
          <circle cx="50" cy="55" r="4" fill="#5dd4b8" />
          <circle cx="80" cy="35" r="4" fill="#32c2a2" />
          <circle cx="80" cy="45" r="4" fill="#32c2a2" />

          <line x1="20" y1="30" x2="50" y2="25" stroke="#32c2a2" strokeWidth="1" />
          <line x1="20" y1="30" x2="50" y2="40" stroke="#32c2a2" strokeWidth="1" />
          <line x1="20" y1="50" x2="50" y2="40" stroke="#32c2a2" strokeWidth="1" />
          <line x1="20" y1="50" x2="50" y2="55" stroke="#32c2a2" strokeWidth="1" />
          <line x1="50" y1="25" x2="80" y2="35" stroke="#5dd4b8" strokeWidth="1" />
          <line x1="50" y1="40" x2="80" y2="35" stroke="#5dd4b8" strokeWidth="1" />
          <line x1="50" y1="40" x2="80" y2="45" stroke="#5dd4b8" strokeWidth="1" />
          <line x1="50" y1="55" x2="80" y2="45" stroke="#5dd4b8" strokeWidth="1" />
        </g>
        <text x="50" y="18" textAnchor="middle" fill="#5dd4b8" fontSize="10" fontWeight="600">신경망</text>
      </g>

      {/* Bottom floating screen - code/model */}
      <g className="float-element" transform="translate(150, 280)">
        <rect x="0" y="0" width="120" height="70" rx="6"
              fill="url(#screenGradient)"
              stroke="#32c2a2"
              strokeWidth="2" />
        {/* Code lines */}
        <line x1="10" y1="20" x2="60" y2="20" stroke="#32c2a2" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="30" x2="80" y2="30" stroke="#5dd4b8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="40" x2="55" y2="40" stroke="#32c2a2" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="50" x2="70" y2="50" stroke="#5dd4b8" strokeWidth="2" strokeLinecap="round" />
        {/* Brackets */}
        <text x="75" y="25" fill="#5dd4b8" fontSize="16" fontWeight="bold">{`{}`}</text>
        <text x="60" y="18" textAnchor="middle" fill="#5dd4b8" fontSize="10" fontWeight="600">AI 모델</text>
      </g>

      {/* Data nodes orbiting around figure */}
      <g className="orbit" transform="translate(300, 200)">
        <circle cx="120" cy="0" r="8" fill="#32c2a2" opacity="0.7" />
        <circle cx="-120" cy="0" r="8" fill="#5dd4b8" opacity="0.7" />
        <circle cx="0" cy="120" r="8" fill="#32c2a2" opacity="0.7" />
        <circle cx="0" cy="-120" r="8" fill="#5dd4b8" opacity="0.7" />

        {/* Connection lines to orbit nodes */}
        <line x1="-50" y1="0" x2="-120" y2="0" stroke="#5dd4b8" strokeWidth="1" opacity="0.3" />
        <line x1="50" y1="0" x2="120" y2="0" stroke="#32c2a2" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="-50" x2="0" y2="-120" stroke="#5dd4b8" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="50" x2="0" y2="120" stroke="#32c2a2" strokeWidth="1" opacity="0.3" />
      </g>

      {/* Animated data particles flowing */}
      <g>
        <path id="dataPath1" d="M 100 200 Q 200 180 300 200" fill="none" stroke="none" />
        <path id="dataPath2" d="M 300 200 Q 400 220 500 200" fill="none" stroke="none" />
        <path id="dataPath3" d="M 200 100 Q 300 120 400 100" fill="none" stroke="none" />

        <circle className="data-particle" r="4" fill="#5dd4b8" opacity="0">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#dataPath1" />
          </animateMotion>
        </circle>
        <circle className="data-particle" r="4" fill="#32c2a2" opacity="0">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#dataPath2" />
          </animateMotion>
        </circle>
        <circle className="data-particle" r="4" fill="#5dd4b8" opacity="0">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#dataPath3" />
          </animateMotion>
        </circle>
      </g>

      {/* Decorative circuit pattern elements */}
      <g opacity="0.2" stroke="#32c2a2" strokeWidth="1.5" fill="none">
        <circle cx="80" cy="80" r="6" />
        <line x1="80" y1="86" x2="80" y2="100" />
        <circle cx="520" cy="320" r="6" />
        <line x1="520" y1="314" x2="520" y2="300" />
        <rect x="500" y="80" width="12" height="12" />
        <line x1="506" y1="92" x2="506" y2="105" />
      </g>

      {/* Title text */}
      <text x="300" y="380" textAnchor="middle" fill="#29264c" fontSize="18" fontWeight="700">
        AI와 함께하는 학습 여정
      </text>
    </svg>
  );
}
