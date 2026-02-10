interface NeuralNetworkSvgProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function NeuralNetworkSvg({
  className = '',
  width = 400,
  height = 250
}: NeuralNetworkSvgProps) {
  return (
    <svg
      viewBox="0 0 400 250"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        @keyframes flowData {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes neuronPulse {
          0%, 100% { r: 14; opacity: 0.8; }
          50% { r: 16; opacity: 1; }
        }
        @keyframes activateNode {
          0%, 100% { fill: #32c2a2; }
          50% { fill: #5dd4b8; }
        }
        .data-flow {
          animation: flowData 3s ease-in-out infinite;
        }
        .data-flow:nth-child(2) { animation-delay: 0.5s; }
        .data-flow:nth-child(3) { animation-delay: 1s; }
        .data-flow:nth-child(4) { animation-delay: 1.5s; }
        .data-flow:nth-child(5) { animation-delay: 2s; }
        .neuron-active {
          animation: neuronPulse 2s ease-in-out infinite, activateNode 2s ease-in-out infinite;
        }
        .neuron-active:nth-child(2n) { animation-delay: 0.3s; }
        .neuron-active:nth-child(3n) { animation-delay: 0.6s; }
      `}</style>

      <defs>
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3d3a66" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#32c2a2" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d3a66" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="neuronGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5dd4b8" />
          <stop offset="100%" stopColor="#32c2a2" />
        </radialGradient>
        <radialGradient id="inputGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3d3a66" />
          <stop offset="100%" stopColor="#29264c" />
        </radialGradient>
      </defs>

      {/* Layer labels */}
      <text x="60" y="25" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">입력층</text>
      <text x="200" y="25" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">은닉층</text>
      <text x="340" y="25" textAnchor="middle" fill="#29264c" fontSize="13" fontWeight="600">출력층</text>

      {/* Connections - Input to Hidden */}
      <g opacity="0.6">
        <line x1="60" y1="70" x2="200" y2="80" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="60" y1="70" x2="200" y2="125" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="60" y1="70" x2="200" y2="170" stroke="url(#connectionGradient)" strokeWidth="1.5" />

        <line x1="60" y1="125" x2="200" y2="80" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="60" y1="125" x2="200" y2="125" stroke="url(#connectionGradient)" strokeWidth="2" />
        <line x1="60" y1="125" x2="200" y2="170" stroke="url(#connectionGradient)" strokeWidth="1.5" />

        <line x1="60" y1="180" x2="200" y2="80" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="60" y1="180" x2="200" y2="125" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="60" y1="180" x2="200" y2="170" stroke="url(#connectionGradient)" strokeWidth="1.5" />
      </g>

      {/* Connections - Hidden to Output */}
      <g opacity="0.6">
        <line x1="200" y1="80" x2="340" y2="105" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="200" y1="80" x2="340" y2="145" stroke="url(#connectionGradient)" strokeWidth="1.5" />

        <line x1="200" y1="125" x2="340" y2="105" stroke="url(#connectionGradient)" strokeWidth="2" />
        <line x1="200" y1="125" x2="340" y2="145" stroke="url(#connectionGradient)" strokeWidth="2" />

        <line x1="200" y1="170" x2="340" y2="105" stroke="url(#connectionGradient)" strokeWidth="1.5" />
        <line x1="200" y1="170" x2="340" y2="145" stroke="url(#connectionGradient)" strokeWidth="1.5" />
      </g>

      {/* Animated data flows along path from input to hidden to output */}
      <g>
        <path id="flow1" d="M 60 70 L 200 125 L 340 105" fill="none" stroke="none" />
        <path id="flow2" d="M 60 125 L 200 125 L 340 145" fill="none" stroke="none" />
        <path id="flow3" d="M 60 180 L 200 170 L 340 145" fill="none" stroke="none" />

        <circle className="data-flow" r="3" fill="#5dd4b8">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#flow1" />
          </animateMotion>
        </circle>
        <circle className="data-flow" r="3" fill="#5dd4b8">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#flow2" />
          </animateMotion>
        </circle>
        <circle className="data-flow" r="3" fill="#5dd4b8">
          <animateMotion dur="3s" repeatCount="indefinite">
            <mpath href="#flow3" />
          </animateMotion>
        </circle>
        <circle className="data-flow" r="3" fill="#32c2a2">
          <animateMotion dur="3s" repeatCount="indefinite" begin="0.7s">
            <mpath href="#flow1" />
          </animateMotion>
        </circle>
        <circle className="data-flow" r="3" fill="#32c2a2">
          <animateMotion dur="3s" repeatCount="indefinite" begin="1.2s">
            <mpath href="#flow2" />
          </animateMotion>
        </circle>
      </g>

      {/* Input layer neurons */}
      <g>
        <circle cx="60" cy="70" r="14" fill="url(#inputGradient)" stroke="#29264c" strokeWidth="2" />
        <circle cx="60" cy="125" r="14" fill="url(#inputGradient)" stroke="#29264c" strokeWidth="2" />
        <circle cx="60" cy="180" r="14" fill="url(#inputGradient)" stroke="#29264c" strokeWidth="2" />
      </g>

      {/* Hidden layer neurons - with active animation */}
      <g>
        <circle className="neuron-active" cx="200" cy="80" r="14" fill="url(#neuronGradient)" stroke="#32c2a2" strokeWidth="2" />
        <circle className="neuron-active" cx="200" cy="125" r="14" fill="url(#neuronGradient)" stroke="#32c2a2" strokeWidth="2" />
        <circle className="neuron-active" cx="200" cy="170" r="14" fill="url(#neuronGradient)" stroke="#32c2a2" strokeWidth="2" />
      </g>

      {/* Output layer neurons */}
      <g>
        <circle className="neuron-active" cx="340" cy="105" r="14" fill="url(#neuronGradient)" stroke="#5dd4b8" strokeWidth="2" />
        <circle className="neuron-active" cx="340" cy="145" r="14" fill="url(#neuronGradient)" stroke="#5dd4b8" strokeWidth="2" />
      </g>

      {/* Decorative icons in neurons */}
      <g fill="#f9fafb" fontSize="10" textAnchor="middle">
        <text x="60" y="74">x₁</text>
        <text x="60" y="129">x₂</text>
        <text x="60" y="184">x₃</text>

        <text x="200" y="84">h₁</text>
        <text x="200" y="129">h₂</text>
        <text x="200" y="174">h₃</text>

        <text x="340" y="109">y₁</text>
        <text x="340" y="149">y₂</text>
      </g>

      {/* Bottom label */}
      <text
        x="200"
        y="220"
        textAnchor="middle"
        fill="#29264c"
        fontSize="14"
        fontWeight="600"
      >
        순방향 신경망 구조
      </text>
    </svg>
  );
}
