interface MLProcessSvgProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function MLProcessSvg({
  className = '',
  width = 500,
  height = 150
}: MLProcessSvgProps) {
  return (
    <svg
      viewBox="0 0 500 150"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes arrowFlow {
          0%, 100% { stroke-dashoffset: 20; }
          50% { stroke-dashoffset: 0; }
        }
        @keyframes stepHighlight {
          0%, 100% { transform: translateY(0); filter: drop-shadow(0 2px 4px rgba(50, 194, 162, 0.2)); }
          50% { transform: translateY(-3px); filter: drop-shadow(0 6px 12px rgba(50, 194, 162, 0.4)); }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .arrow {
          stroke-dasharray: 10 10;
          animation: arrowFlow 2s linear infinite;
        }
        .step-box { animation: stepHighlight 3s ease-in-out infinite; }
        .step-box:nth-child(2) { animation-delay: 0.5s; }
        .step-box:nth-child(3) { animation-delay: 1s; }
        .step-box:nth-child(4) { animation-delay: 1.5s; }
        .step-icon { animation: iconFloat 2s ease-in-out infinite; }
      `}</style>

      <defs>
        <linearGradient id="boxGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d3a66" />
          <stop offset="100%" stopColor="#29264c" />
        </linearGradient>
        <linearGradient id="boxGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#32c2a2" />
          <stop offset="100%" stopColor="#29264c" />
        </linearGradient>
        <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#32c2a2" />
          <stop offset="100%" stopColor="#5dd4b8" />
        </linearGradient>
      </defs>

      {/* Step 1: Data */}
      <g className="step-box" transform="translate(20, 40)">
        <rect x="0" y="0" width="90" height="70" rx="8"
              fill="url(#boxGradient1)"
              stroke="#32c2a2"
              strokeWidth="2" />

        {/* Database icon */}
        <g className="step-icon" transform="translate(45, 25)">
          <ellipse cx="0" cy="-5" rx="15" ry="5" fill="#32c2a2" />
          <rect x="-15" y="-5" width="30" height="15" fill="#32c2a2" />
          <ellipse cx="0" cy="10" rx="15" ry="5" fill="#5dd4b8" />
          <line x1="-15" y1="-5" x2="-15" y2="10" stroke="#29264c" strokeWidth="1" />
          <line x1="15" y1="-5" x2="15" y2="10" stroke="#29264c" strokeWidth="1" />
        </g>

        <text x="45" y="60" textAnchor="middle" fill="#f9fafb" fontSize="12" fontWeight="600">데이터</text>
      </g>

      {/* Arrow 1 */}
      <g>
        <path className="arrow" d="M 115 75 L 155 75"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none"
              markerEnd="url(#arrowhead)" />
        <polygon points="155,75 150,72 150,78" fill="#5dd4b8" />
      </g>

      {/* Step 2: Training */}
      <g className="step-box" transform="translate(165, 40)">
        <rect x="0" y="0" width="90" height="70" rx="8"
              fill="url(#boxGradient2)"
              stroke="#32c2a2"
              strokeWidth="2" />

        {/* Training/loop icon */}
        <g className="step-icon" transform="translate(45, 28)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#f9fafb" strokeWidth="2.5"
                  strokeDasharray="8 4" />
          <path d="M 10 -5 L 15 0 L 10 5" fill="#f9fafb" />
          <circle cx="-6" cy="-6" r="2.5" fill="#5dd4b8" />
          <circle cx="6" cy="0" r="2.5" fill="#5dd4b8" />
          <circle cx="-6" cy="6" r="2.5" fill="#5dd4b8" />
        </g>

        <text x="45" y="60" textAnchor="middle" fill="#f9fafb" fontSize="12" fontWeight="600">학습</text>
      </g>

      {/* Arrow 2 */}
      <g>
        <path className="arrow" d="M 260 75 L 300 75"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none" />
        <polygon points="300,75 295,72 295,78" fill="#5dd4b8" />
      </g>

      {/* Step 3: Model */}
      <g className="step-box" transform="translate(310, 40)">
        <rect x="0" y="0" width="90" height="70" rx="8"
              fill="url(#boxGradient1)"
              stroke="#5dd4b8"
              strokeWidth="2" />

        {/* Brain/model icon */}
        <g className="step-icon" transform="translate(45, 28)">
          <path d="M -8 0 Q -10 -8 -4 -12 Q 0 -14 4 -12 Q 10 -8 8 0 Q 6 8 0 10 Q -6 8 -8 0 Z"
                fill="#5dd4b8" />
          <circle cx="-4" cy="-4" r="2" fill="#29264c" />
          <circle cx="4" cy="-2" r="2" fill="#29264c" />
          <circle cx="0" cy="4" r="2" fill="#29264c" />
          <path d="M -4 -4 L 0 4 M 4 -2 L 0 4" stroke="#29264c" strokeWidth="1.5" />
        </g>

        <text x="45" y="60" textAnchor="middle" fill="#f9fafb" fontSize="12" fontWeight="600">모델</text>
      </g>

      {/* Arrow 3 */}
      <g>
        <path className="arrow" d="M 405 75 L 445 75"
              stroke="url(#arrowGradient)"
              strokeWidth="3"
              fill="none" />
        <polygon points="445,75 440,72 440,78" fill="#5dd4b8" />
      </g>

      {/* Step 4: Prediction */}
      <g className="step-box" transform="translate(390, 40)">
        <rect x="0" y="0" width="90" height="70" rx="8"
              fill="url(#boxGradient2)"
              stroke="#5dd4b8"
              strokeWidth="2" />

        {/* Target/prediction icon */}
        <g className="step-icon" transform="translate(45, 28)">
          <circle cx="0" cy="0" r="12" fill="none" stroke="#f9fafb" strokeWidth="2" />
          <circle cx="0" cy="0" r="7" fill="none" stroke="#f9fafb" strokeWidth="2" />
          <circle cx="0" cy="0" r="3" fill="#5dd4b8" />
          <line x1="0" y1="-15" x2="0" y2="-12" stroke="#f9fafb" strokeWidth="2" />
          <line x1="0" y1="12" x2="0" y2="15" stroke="#f9fafb" strokeWidth="2" />
          <line x1="-15" y1="0" x2="-12" y2="0" stroke="#f9fafb" strokeWidth="2" />
          <line x1="12" y1="0" x2="15" y2="0" stroke="#f9fafb" strokeWidth="2" />
        </g>

        <text x="45" y="60" textAnchor="middle" fill="#f9fafb" fontSize="12" fontWeight="600">예측</text>
      </g>

      {/* Title */}
      <text x="250" y="135" textAnchor="middle" fill="#29264c" fontSize="14" fontWeight="600">
        머신러닝 프로세스
      </text>
    </svg>
  );
}
