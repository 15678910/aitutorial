import { useState, useEffect, useRef, useCallback } from 'react';

interface GradientDescentProps {
  className?: string;
}

export default function GradientDescent({ className = '' }: GradientDescentProps) {
  const [position, setPosition] = useState(0.8); // Position on x-axis (0 to 1)
  const [learningRate, setLearningRate] = useState(0.1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [history, setHistory] = useState<number[]>([0.8]);
  const animationRef = useRef<number | undefined>(undefined);

  // Loss function: y = (x - 0.5)^2 * 4 (parabola with minimum at x=0.5)
  const lossFunction = (x: number) => Math.pow(x - 0.5, 2) * 4;

  // Derivative: y' = 8(x - 0.5)
  const derivative = (x: number) => 8 * (x - 0.5);

  const currentLoss = lossFunction(position);

  // Scale values for SVG display
  const svgWidth = 400;
  const svgHeight = 300;
  const padding = 40;
  const graphWidth = svgWidth - 2 * padding;
  const graphHeight = svgHeight - 2 * padding;

  // Convert position to SVG coordinates
  const xToSvg = (x: number) => padding + x * graphWidth;
  const yToSvg = (y: number) => svgHeight - padding - y * graphHeight;

  // Generate curve path
  const generateCurvePath = () => {
    const points: string[] = [];
    for (let x = 0; x <= 1; x += 0.02) {
      const y = lossFunction(x);
      points.push(`${xToSvg(x)},${yToSvg(y)}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const performStep = useCallback(() => {
    const gradient = derivative(position);
    const newPosition = position - learningRate * gradient;

    // Clamp to valid range
    const clampedPosition = Math.max(0.05, Math.min(0.95, newPosition));

    setPosition(clampedPosition);
    setHistory(prev => [...prev, clampedPosition]);
  }, [position, learningRate]);

  const startAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (isAnimating && Math.abs(derivative(position)) > 0.01) {
      const timeout = setTimeout(() => {
        performStep();
      }, 300);
      return () => clearTimeout(timeout);
    } else if (isAnimating) {
      setIsAnimating(false);
    }
  }, [isAnimating, position, performStep]);

  const reset = () => {
    setIsAnimating(false);
    const randomStart = 0.1 + Math.random() * 0.8;
    setPosition(randomStart);
    setHistory([randomStart]);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const ballX = xToSvg(position);
  const ballY = yToSvg(lossFunction(position));

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">경사 하강법 시각화</h3>
        <p className="text-gray-600 text-sm">
          AI가 최적의 해를 찾아가는 과정을 관찰해보세요. 공이 골짜기 바닥을 향해 굴러갑니다.
        </p>
      </div>

      {/* SVG Canvas */}
      <div className="bg-surface rounded-lg p-4 mb-6 border-2 border-gray-200">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="w-full bg-white rounded shadow-inner"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid-descent" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width={svgWidth} height={svgHeight} fill="url(#grid-descent)" />

          {/* Axes */}
          <line
            x1={padding}
            y1={svgHeight - padding}
            x2={svgWidth - padding}
            y2={svgHeight - padding}
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={svgHeight - padding}
            stroke="#9ca3af"
            strokeWidth="2"
          />

          {/* Axis labels */}
          <text x={svgWidth / 2} y={svgHeight - 10} fontSize="12" fill="#6b7280" textAnchor="middle">
            파라미터 값
          </text>
          <text
            x={15}
            y={svgHeight / 2}
            fontSize="12"
            fill="#6b7280"
            textAnchor="middle"
            transform={`rotate(-90, 15, ${svgHeight / 2})`}
          >
            손실 (Loss)
          </text>

          {/* Loss curve */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke="#29264c"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* History trail */}
          {history.length > 1 && history.slice(0, -1).map((pos, i) => {
            const nextPos = history[i + 1];
            return (
              <line
                key={i}
                x1={xToSvg(pos)}
                y1={yToSvg(lossFunction(pos))}
                x2={xToSvg(nextPos)}
                y2={yToSvg(lossFunction(nextPos))}
                stroke="#32c2a2"
                strokeWidth="2"
                opacity={0.3 + (i / history.length) * 0.7}
                strokeDasharray="3,3"
              />
            );
          })}

          {/* Current position ball */}
          <g>
            {/* Glow effect */}
            <circle
              cx={ballX}
              cy={ballY}
              r="12"
              fill="#32c2a2"
              opacity="0.3"
            />
            {/* Main ball */}
            <circle
              cx={ballX}
              cy={ballY}
              r="8"
              fill="#32c2a2"
              stroke="white"
              strokeWidth="2"
              className={isAnimating ? 'animate-pulse' : ''}
            />
          </g>

          {/* Minimum marker */}
          <g>
            <circle
              cx={xToSvg(0.5)}
              cy={yToSvg(0)}
              r="4"
              fill="#ef4444"
              opacity="0.6"
            />
            <text
              x={xToSvg(0.5)}
              y={yToSvg(0) + 20}
              fontSize="10"
              fill="#ef4444"
              textAnchor="middle"
              fontWeight="bold"
            >
              최소값
            </text>
          </g>
        </svg>
      </div>

      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* Learning Rate */}
        <div className="bg-surface p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-primary">학습률 (Learning Rate)</span>
            <span className="text-sm text-gray-600">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="0.3"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            disabled={isAnimating}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent disabled:opacity-50"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>느림 (0.01)</span>
            <span>빠름 (0.30)</span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {learningRate < 0.1 && '🐌 조심스럽게 천천히 이동합니다'}
            {learningRate >= 0.1 && learningRate < 0.2 && '🚶 적당한 속도로 이동합니다'}
            {learningRate >= 0.2 && '🏃 빠르게 이동하지만 불안정할 수 있습니다'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={performStep}
            disabled={isAnimating || Math.abs(derivative(position)) < 0.01}
            className="flex-1 px-4 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            👣 한 걸음
          </button>
          <button
            onClick={startAnimation}
            disabled={Math.abs(derivative(position)) < 0.01 && !isAnimating}
            className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors shadow-md ${
              isAnimating
                ? 'bg-warning text-white hover:bg-warning/90'
                : 'bg-primary text-white hover:bg-primary-dark'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {isAnimating ? '⏸️ 일시정지' : '▶️ 자동 실행'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md"
          >
            🔄 초기화
          </button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="text-sm text-primary font-semibold mb-1">현재 위치</div>
          <div className="text-2xl font-bold text-primary">{position.toFixed(3)}</div>
        </div>
        <div className="bg-accent/5 p-4 rounded-lg border border-accent/20">
          <div className="text-sm text-accent font-semibold mb-1">현재 손실값</div>
          <div className="text-2xl font-bold text-accent">{currentLoss.toFixed(3)}</div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-surface p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">최적화 진행도</span>
          <span className="text-sm text-gray-600">{history.length} 스텝</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent to-success h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, (1 - currentLoss) * 100)}%` }}
          />
        </div>
        {Math.abs(derivative(position)) < 0.01 && (
          <p className="text-sm text-success font-semibold mt-2 flex items-center gap-2">
            <span>✓</span>
            <span>최소값에 도달했습니다!</span>
          </p>
        )}
      </div>

      {/* Educational Note */}
      <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-accent">💡 핵심 개념:</strong> 경사 하강법(Gradient Descent)은
          AI가 최적의 파라미터를 찾는 핵심 알고리즘입니다. 현재 위치에서 손실이 가장 빠르게
          감소하는 방향으로 조금씩 이동하며, 학습률은 이동 보폭을 결정합니다.
          너무 크면 불안정하고, 너무 작으면 시간이 오래 걸립니다.
        </p>
      </div>
    </div>
  );
}
