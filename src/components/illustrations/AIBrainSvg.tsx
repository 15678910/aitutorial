interface AIBrainSvgProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function AIBrainSvg({
  className = '',
  width = 300,
  height = 250
}: AIBrainSvgProps) {
  return (
    <svg
      viewBox="0 0 300 250"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes synapse {
          0%, 100% { stroke-dashoffset: 0; }
          50% { stroke-dashoffset: 10; }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 2px #32c2a2); }
          50% { filter: drop-shadow(0 0 8px #32c2a2); }
        }
        .node { animation: pulse 3s ease-in-out infinite; }
        .node:nth-child(2n) { animation-delay: 0.5s; }
        .node:nth-child(3n) { animation-delay: 1s; }
        .connection {
          stroke-dasharray: 5 5;
          animation: synapse 2s linear infinite;
        }
        .brain-outline { animation: glow 4s ease-in-out infinite; }
      `}</style>

      <defs>
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#29264c" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#3d3a66" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#29264c" stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5dd4b8" />
          <stop offset="100%" stopColor="#32c2a2" />
        </radialGradient>
      </defs>

      {/* Neural connections */}
      <g opacity="0.4">
        <path className="connection" d="M 80 90 Q 100 100 120 85" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 120 85 Q 140 75 165 90" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 165 90 Q 185 105 200 95" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 90 120 Q 120 115 150 120" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 150 120 Q 180 125 210 115" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 85 150 Q 110 145 140 155" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 140 155 Q 170 165 195 150" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 110 180 Q 140 175 170 180" stroke="#32c2a2" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 80 90 Q 75 120 85 150" stroke="#5dd4b8" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 165 90 Q 155 120 140 155" stroke="#5dd4b8" strokeWidth="1.5" fill="none" />
        <path className="connection" d="M 200 95 Q 205 125 195 150" stroke="#5dd4b8" strokeWidth="1.5" fill="none" />
      </g>

      {/* Brain outline - left hemisphere */}
      <path
        className="brain-outline"
        d="M 70 100
           Q 60 80, 70 60
           Q 80 45, 95 40
           Q 105 38, 115 42
           Q 125 38, 135 40
           Q 145 43, 150 50
           Q 155 60, 152 75
           Q 150 90, 145 105
           Q 140 125, 135 145
           Q 130 165, 125 180
           Q 118 195, 105 200
           Q 90 203, 80 195
           Q 70 185, 68 170
           Q 65 150, 68 130
           Q 70 115, 70 100 Z"
        fill="url(#brainGradient)"
        stroke="#3d3a66"
        strokeWidth="2"
      />

      {/* Brain outline - right hemisphere */}
      <path
        className="brain-outline"
        d="M 150 50
           Q 160 45, 175 43
           Q 190 42, 205 48
           Q 218 55, 225 68
           Q 230 85, 228 105
           Q 226 125, 222 145
           Q 218 165, 210 180
           Q 200 195, 185 200
           Q 172 202, 160 195
           Q 150 185, 145 170
           Q 142 150, 145 130
           Q 148 110, 150 90
           Q 152 70, 150 50 Z"
        fill="url(#brainGradient)"
        stroke="#3d3a66"
        strokeWidth="2"
      />

      {/* Neural nodes - layered for depth */}
      <g>
        <circle className="node" cx="80" cy="90" r="6" fill="url(#nodeGradient)" />
        <circle className="node" cx="120" cy="85" r="5" fill="url(#nodeGradient)" />
        <circle className="node" cx="165" cy="90" r="6" fill="url(#nodeGradient)" />
        <circle className="node" cx="200" cy="95" r="5" fill="url(#nodeGradient)" />

        <circle className="node" cx="90" cy="120" r="5" fill="url(#nodeGradient)" />
        <circle className="node" cx="150" cy="120" r="7" fill="url(#nodeGradient)" />
        <circle className="node" cx="210" cy="115" r="5" fill="url(#nodeGradient)" />

        <circle className="node" cx="85" cy="150" r="6" fill="url(#nodeGradient)" />
        <circle className="node" cx="140" cy="155" r="5" fill="url(#nodeGradient)" />
        <circle className="node" cx="195" cy="150" r="6" fill="url(#nodeGradient)" />

        <circle className="node" cx="110" cy="180" r="5" fill="url(#nodeGradient)" />
        <circle className="node" cx="170" cy="180" r="5" fill="url(#nodeGradient)" />
      </g>

      {/* Accent detail lines for cerebral cortex effect */}
      <g opacity="0.3" stroke="#5dd4b8" strokeWidth="1" fill="none">
        <path d="M 75 75 Q 85 70 95 75" />
        <path d="M 100 60 Q 110 55 120 60" />
        <path d="M 155 65 Q 165 60 175 65" />
        <path d="M 190 75 Q 200 70 210 75" />
        <path d="M 80 130 Q 90 125 100 130" />
        <path d="M 180 130 Q 190 125 200 130" />
      </g>

      {/* Label */}
      <text
        x="150"
        y="230"
        textAnchor="middle"
        fill="#29264c"
        fontSize="16"
        fontWeight="600"
        fontFamily="sans-serif"
      >
        인공 신경망
      </text>
    </svg>
  );
}
