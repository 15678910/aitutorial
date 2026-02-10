import { useState, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  class: 'A' | 'B';
}

interface DecisionBoundaryProps {
  className?: string;
}

export default function DecisionBoundary({ className = '' }: DecisionBoundaryProps) {
  const [points, setPoints] = useState<Point[]>([]);
  const [currentClass, setCurrentClass] = useState<'A' | 'B'>('A');
  const [boundary, setBoundary] = useState<{ slope: number; intercept: number } | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPoints([...points, { x, y, class: currentClass }]);
  };

  const calculateBoundary = () => {
    if (points.length < 2) return;

    // Simple linear boundary: find average position of each class
    const classA = points.filter(p => p.class === 'A');
    const classB = points.filter(p => p.class === 'B');

    if (classA.length === 0 || classB.length === 0) return;

    // Calculate centroids
    const centroidA = {
      x: classA.reduce((sum, p) => sum + p.x, 0) / classA.length,
      y: classA.reduce((sum, p) => sum + p.y, 0) / classA.length,
    };

    const centroidB = {
      x: classB.reduce((sum, p) => sum + p.x, 0) / classB.length,
      y: classB.reduce((sum, p) => sum + p.y, 0) / classB.length,
    };

    // Calculate perpendicular bisector
    const midX = (centroidA.x + centroidB.x) / 2;
    const midY = (centroidA.y + centroidB.y) / 2;

    const dx = centroidB.x - centroidA.x;
    const dy = centroidB.y - centroidA.y;

    // Perpendicular slope
    if (Math.abs(dx) < 0.01) {
      // Vertical line case
      setBoundary({ slope: Infinity, intercept: midX });
    } else {
      const slope = -dx / dy;
      const intercept = midY - slope * midX;
      setBoundary({ slope, intercept });
    }
  };

  const reset = () => {
    setPoints([]);
    setBoundary(null);
  };

  const toggleClass = () => {
    setCurrentClass(currentClass === 'A' ? 'B' : 'A');
  };

  // Calculate boundary line coordinates
  const getBoundaryLine = () => {
    if (!boundary) return null;

    const width = 400;
    const height = 300;

    if (boundary.slope === Infinity) {
      return { x1: boundary.intercept, y1: 0, x2: boundary.intercept, y2: height };
    }

    const y1 = boundary.slope * 0 + boundary.intercept;
    const y2 = boundary.slope * width + boundary.intercept;

    return { x1: 0, y1, x2: width, y2 };
  };

  const boundaryLine = getBoundaryLine();

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">결정 경계 시각화</h3>
        <p className="text-gray-600 text-sm">
          두 가지 클래스의 데이터 포인트를 배치하고 분류 경계선을 학습시켜보세요.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={toggleClass}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all shadow-md
            ${currentClass === 'A'
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-red-500 text-white hover:bg-red-600'
            }
          `}
        >
          현재 클래스: {currentClass === 'A' ? '🔵 파랑' : '🔴 빨강'}
        </button>

        <button
          onClick={calculateBoundary}
          disabled={points.length < 2}
          className="px-4 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          🎯 학습하기
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md"
        >
          🔄 초기화
        </button>
      </div>

      {/* Canvas */}
      <div className="bg-surface rounded-lg p-4 border-2 border-gray-200">
        <svg
          ref={canvasRef}
          width="400"
          height="300"
          className="w-full bg-white rounded cursor-crosshair shadow-inner"
          onClick={handleCanvasClick}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />

          {/* Decision boundary */}
          {boundaryLine && (
            <>
              {/* Shadow/glow effect */}
              <line
                x1={boundaryLine.x1}
                y1={boundaryLine.y1}
                x2={boundaryLine.x2}
                y2={boundaryLine.y2}
                stroke="#32c2a2"
                strokeWidth="8"
                opacity="0.2"
              />
              {/* Main boundary line */}
              <line
                x1={boundaryLine.x1}
                y1={boundaryLine.y1}
                x2={boundaryLine.x2}
                y2={boundaryLine.y2}
                stroke="#32c2a2"
                strokeWidth="3"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </>
          )}

          {/* Data points */}
          {points.map((point, index) => (
            <g key={index}>
              {/* Outer glow */}
              <circle
                cx={point.x}
                cy={point.y}
                r="10"
                fill={point.class === 'A' ? '#3b82f6' : '#ef4444'}
                opacity="0.2"
              />
              {/* Main circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill={point.class === 'A' ? '#3b82f6' : '#ef4444'}
                stroke="white"
                strokeWidth="2"
                className="transition-all hover:r-8"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-600 font-semibold">🔵 파랑 클래스</div>
          <div className="text-2xl font-bold text-blue-700">
            {points.filter(p => p.class === 'A').length}개
          </div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-sm text-red-600 font-semibold">🔴 빨강 클래스</div>
          <div className="text-2xl font-bold text-red-700">
            {points.filter(p => p.class === 'B').length}개
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-accent">💡 핵심 개념:</strong> 분류(Classification) 알고리즘은
          데이터를 여러 클래스로 나누는 경계선을 학습합니다. 선형 분류기는 직선으로,
          복잡한 모델은 곡선으로 경계를 만들 수 있습니다. 이것이 이미지 인식이나
          스팸 필터링의 기본 원리입니다.
        </p>
      </div>
    </div>
  );
}
