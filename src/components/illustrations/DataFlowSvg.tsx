interface DataFlowSvgProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function DataFlowSvg({
  className = '',
  width = 400,
  height = 200
}: DataFlowSvgProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes floatIn {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes floatOut {
          0% { transform: translateX(0); opacity: 0; }
          100% { transform: translateX(20px); opacity: 1; }
        }
        @keyframes processPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes flowParticle {
          0% { offset-distance: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .input-icon { animation: floatIn 1s ease-out forwards; }
        .input-icon:nth-child(2) { animation-delay: 0.2s; }
        .input-icon:nth-child(3) { animation-delay: 0.4s; }
        .output-icon { animation: floatOut 1s ease-out 1.5s forwards; }
        .output-icon:nth-child(2) { animation-delay: 1.7s; }
        .output-icon:nth-child(3) { animation-delay: 1.9s; }
        .processor { animation: processPulse 2s ease-in-out infinite; }
        .particle { animation: flowParticle 2s ease-in-out infinite; }
        .particle:nth-child(2) { animation-delay: 0.4s; }
        .particle:nth-child(3) { animation-delay: 0.8s; }
        .particle:nth-child(4) { animation-delay: 1.2s; }
        .gear {
          transform-origin: center;
          animation: rotate 4s linear infinite;
        }
      `}</style>

      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#29264c" />
          <stop offset="50%" stopColor="#32c2a2" />
          <stop offset="100%" stopColor="#5dd4b8" />
        </linearGradient>
        <linearGradient id="processorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d3a66" />
          <stop offset="100%" stopColor="#29264c" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Input data icons */}
      <g className="input-icons" opacity="0">
        {/* Text document icon */}
        <g className="input-icon" transform="translate(30, 50)">
          <rect x="0" y="0" width="30" height="38" rx="3" fill="#3d3a66" stroke="#29264c" strokeWidth="2" />
          <line x1="6" y1="10" x2="24" y2="10" stroke="#32c2a2" strokeWidth="2" />
          <line x1="6" y1="18" x2="24" y2="18" stroke="#32c2a2" strokeWidth="2" />
          <line x1="6" y1="26" x2="18" y2="26" stroke="#32c2a2" strokeWidth="2" />
        </g>

        {/* Image icon */}
        <g className="input-icon" transform="translate(30, 100)">
          <rect x="0" y="0" width="30" height="30" rx="3" fill="#3d3a66" stroke="#29264c" strokeWidth="2" />
          <circle cx="10" cy="10" r="4" fill="#5dd4b8" />
          <path d="M 5 20 L 12 13 L 18 19 L 25 12" stroke="#32c2a2" strokeWidth="2" fill="none" />
        </g>

        {/* Audio wave icon */}
        <g className="input-icon" transform="translate(30, 145)">
          <rect x="0" y="0" width="30" height="25" rx="3" fill="#3d3a66" stroke="#29264c" strokeWidth="2" />
          <path d="M 5 12.5 L 8 8 L 11 17 L 14 5 L 17 20 L 20 10 L 23 15 L 25 12.5"
                stroke="#32c2a2" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Flow paths and particles */}
      <g>
        <path id="flowPath1" d="M 70 65 Q 140 65 180 100" fill="none" stroke="none" />
        <path id="flowPath2" d="M 70 115 L 180 100" fill="none" stroke="none" />
        <path id="flowPath3" d="M 70 160 Q 140 135 180 100" fill="none" stroke="none" />

        {/* Visual flow lines */}
        <path d="M 70 65 Q 140 65 180 100" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M 70 115 L 180 100" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M 70 160 Q 140 135 180 100" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />

        {/* Animated particles */}
        <circle className="particle" r="4" fill="#32c2a2" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href="#flowPath1" />
          </animateMotion>
        </circle>
        <circle className="particle" r="4" fill="#5dd4b8" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href="#flowPath2" />
          </animateMotion>
        </circle>
        <circle className="particle" r="4" fill="#32c2a2" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath href="#flowPath3" />
          </animateMotion>
        </circle>
        <circle className="particle" r="4" fill="#5dd4b8" filter="url(#glow)">
          <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#flowPath1" />
          </animateMotion>
        </circle>
      </g>

      {/* Central processor/funnel */}
      <g className="processor" transform="translate(180, 100)">
        <path d="M -25 -30 L -15 0 L 15 0 L 25 -30 Z"
              fill="url(#processorGradient)"
              stroke="#32c2a2"
              strokeWidth="2" />
        <circle cx="0" cy="-15" r="8" fill="#32c2a2" opacity="0.6" />

        {/* Gear icon inside processor */}
        <g className="gear" transform="translate(0, -15)">
          <circle cx="0" cy="0" r="5" fill="#5dd4b8" />
          <rect x="-1" y="-7" width="2" height="14" fill="#5dd4b8" />
          <rect x="-7" y="-1" width="14" height="2" fill="#5dd4b8" />
        </g>
      </g>

      {/* Output flow paths */}
      <g>
        <path id="outPath1" d="M 220 100 Q 280 75 330 60" fill="none" stroke="none" />
        <path id="outPath2" d="M 220 100 L 330 100" fill="none" stroke="none" />
        <path id="outPath3" d="M 220 100 Q 280 125 330 145" fill="none" stroke="none" />

        <path d="M 220 100 Q 280 75 330 60" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M 220 100 L 330 100" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />
        <path d="M 220 100 Q 280 125 330 145" stroke="url(#flowGradient)" strokeWidth="2" fill="none" opacity="0.3" />

        <circle className="particle" r="4" fill="#5dd4b8" filter="url(#glow)">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1s">
            <mpath href="#outPath1" />
          </animateMotion>
        </circle>
        <circle className="particle" r="4" fill="#32c2a2" filter="url(#glow)">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1.2s">
            <mpath href="#outPath2" />
          </animateMotion>
        </circle>
        <circle className="particle" r="4" fill="#5dd4b8" filter="url(#glow)">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="1.4s">
            <mpath href="#outPath3" />
          </animateMotion>
        </circle>
      </g>

      {/* Output insights icons */}
      <g className="output-icons" opacity="0">
        {/* Chart icon */}
        <g className="output-icon" transform="translate(340, 50)">
          <rect x="0" y="0" width="32" height="28" rx="3" fill="#32c2a2" stroke="#29264c" strokeWidth="2" />
          <rect x="6" y="18" width="5" height="6" fill="#f9fafb" />
          <rect x="13" y="12" width="5" height="12" fill="#f9fafb" />
          <rect x="20" y="8" width="5" height="16" fill="#f9fafb" />
        </g>

        {/* Pattern/grid icon */}
        <g className="output-icon" transform="translate(340, 90)">
          <rect x="0" y="0" width="32" height="28" rx="3" fill="#5dd4b8" stroke="#29264c" strokeWidth="2" />
          <circle cx="10" cy="10" r="3" fill="#29264c" />
          <circle cx="22" cy="10" r="3" fill="#29264c" />
          <circle cx="10" cy="18" r="3" fill="#29264c" />
          <circle cx="22" cy="18" r="3" fill="#29264c" />
        </g>

        {/* Lightning/insight icon */}
        <g className="output-icon" transform="translate(340, 135)">
          <rect x="0" y="0" width="32" height="28" rx="3" fill="#32c2a2" stroke="#29264c" strokeWidth="2" />
          <path d="M 20 6 L 12 14 L 16 14 L 12 22 L 20 14 L 16 14 Z"
                fill="#f9fafb" stroke="#29264c" strokeWidth="1" />
        </g>
      </g>

      {/* Labels */}
      <text x="45" y="30" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">데이터</text>
      <text x="196" y="150" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">처리</text>
      <text x="356" y="30" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">인사이트</text>
    </svg>
  );
}
