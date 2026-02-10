import { useState } from 'react';

interface NeuronSimulatorProps {
  className?: string;
}

export default function NeuronSimulator({ className = '' }: NeuronSimulatorProps) {
  const [weights, setWeights] = useState([0.5, 0.3, 0.2]);
  const [inputs] = useState([1, 1, 1]); // Fixed inputs for simplicity
  const [bias, setBias] = useState(0);
  const [threshold, setThreshold] = useState(0.5);

  // Calculate weighted sum
  const weightedSum = weights.reduce((sum, w, i) => sum + w * inputs[i], 0) + bias;

  // Apply step activation function
  const output = weightedSum >= threshold ? 1 : 0;
  const isFiring = output === 1;

  const handleWeightChange = (index: number, value: number) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">뉴런 시뮬레이터</h3>
        <p className="text-gray-600 text-sm">
          가중치를 조절하여 인공 뉴런이 어떻게 작동하는지 관찰해보세요.
        </p>
      </div>

      {/* Inputs and Weights */}
      <div className="space-y-4 mb-6">
        {weights.map((weight, index) => (
          <div key={index} className="bg-surface p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-primary">
                입력 {index + 1} (x{index + 1} = {inputs[index]})
              </span>
              <span className="text-sm text-gray-600">
                가중치 w{index + 1}: {weight.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={weight}
              onChange={(e) => handleWeightChange(index, parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-1.0</span>
              <span>0</span>
              <span>1.0</span>
            </div>
          </div>
        ))}

        {/* Bias */}
        <div className="bg-surface p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-primary">편향 (bias)</span>
            <span className="text-sm text-gray-600">b: {bias.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.1"
            value={bias}
            onChange={(e) => setBias(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>-1.0</span>
            <span>0</span>
            <span>1.0</span>
          </div>
        </div>

        {/* Threshold */}
        <div className="bg-surface p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-primary">활성화 임계값</span>
            <span className="text-sm text-gray-600">{threshold.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0</span>
            <span>1.0</span>
            <span>2.0</span>
          </div>
        </div>
      </div>

      {/* Calculation Display */}
      <div className="bg-primary/5 rounded-lg p-4 mb-6 border-2 border-primary/20">
        <h4 className="font-semibold text-primary mb-3">계산 과정</h4>
        <div className="space-y-2 text-sm font-mono">
          <div className="text-gray-700">
            합계 = w₁×x₁ + w₂×x₂ + w₃×x₃ + b
          </div>
          <div className="text-gray-700">
            합계 = ({weights[0].toFixed(2)}×{inputs[0]}) + ({weights[1].toFixed(2)}×{inputs[1]}) +
            ({weights[2].toFixed(2)}×{inputs[2]}) + {bias.toFixed(2)}
          </div>
          <div className="text-primary font-bold text-base">
            합계 = {weightedSum.toFixed(3)}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="text-gray-700">
              활성화 함수: {weightedSum.toFixed(3)} {weightedSum >= threshold ? '≥' : '<'} {threshold.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Output Visualization */}
      <div className="text-center">
        <div className="inline-flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-700">출력:</span>
          <div
            className={`
              w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold
              transition-all duration-300 shadow-lg
              ${isFiring
                ? 'bg-success text-white shadow-success/50 scale-110'
                : 'bg-gray-300 text-gray-600 scale-100'
              }
            `}
          >
            {output}
          </div>
          <div className="text-left">
            <div className={`font-bold text-lg ${isFiring ? 'text-success' : 'text-gray-500'}`}>
              {isFiring ? '🔥 발화!' : '😴 미발화'}
            </div>
            <div className="text-sm text-gray-600">
              {isFiring ? '뉴런이 활성화되었습니다' : '뉴런이 비활성 상태입니다'}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-accent">💡 핵심 개념:</strong> 인공 뉴런은 여러 입력값에 가중치를 곱한 후
          합산합니다. 이 합계가 임계값을 넘으면 뉴런이 '발화'하여 신호를 전달합니다.
          딥러닝은 수백만 개의 이러한 뉴런들이 연결된 네트워크입니다.
        </p>
      </div>
    </div>
  );
}
