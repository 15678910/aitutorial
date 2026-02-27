import { useState } from 'react';

interface NeuronSimulatorProps {
  className?: string;
}

function Tip({ label, tip }: { label: string; tip: string }) {
  return (
    <span className="group relative cursor-help">
      <span className="border-b-2 border-dashed border-accent/60">{label}</span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto z-50">
        {tip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
}

export default function NeuronSimulator({ className = '' }: NeuronSimulatorProps) {
  const [weights, setWeights] = useState([0.5, 0.3, 0.2]);
  const [inputs] = useState([1, 1, 1]);
  const [bias, setBias] = useState(0);
  const [threshold, setThreshold] = useState(0.5);

  const weightedSum = weights.reduce((sum, w, i) => sum + w * inputs[i], 0) + bias;
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
        <h3 className="text-2xl font-bold text-primary mb-2">
          <Tip label="뉴런" tip="뇌의 신경세포를 모방한 인공 신경망의 기본 단위입니다. 입력을 받아 처리한 뒤 결과를 출력합니다." /> 시뮬레이터
        </h3>
        <p className="text-gray-600 text-sm">
          <Tip label="가중치" tip="입력값의 중요도를 나타내는 숫자입니다. 가중치가 클수록 해당 입력이 결과에 더 큰 영향을 미칩니다." />를 조절하여 인공 뉴런이 어떻게 작동하는지 관찰해보세요.
        </p>
      </div>

      {/* Guide box */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>📘 용어 안내:</strong> 아래에서 <span className="border-b-2 border-dashed border-accent/60">점선 밑줄</span>이 있는 단어 위에 마우스를 올리면 뜻을 확인할 수 있습니다.
        </p>
      </div>

      {/* Inputs and Weights */}
      <div className="space-y-4 mb-6">
        {weights.map((weight, index) => (
          <div key={index} className="bg-surface p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-primary">
                <Tip label={`입력 ${index + 1}`} tip={`뉴런에 들어오는 ${index + 1}번째 신호입니다. x${index + 1}은 입력값을 나타내는 변수입니다.`} /> (x{index + 1} = {inputs[index]})
              </span>
              <span className="text-sm text-gray-600">
                <Tip label={`가중치 w${index + 1}`} tip={`${index + 1}번째 입력에 곱해지는 가중치입니다. w는 Weight(가중치)의 약자이고, 숫자는 몇 번째 입력에 해당하는지를 나타냅니다. 슬라이더를 움직여 값을 바꿔보세요!`} />: {weight.toFixed(2)}
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
            <span className="font-semibold text-primary">
              <Tip label="편향" tip="모든 입력과 무관하게 뉴런에 더해지는 값입니다. 뉴런이 활성화되는 기준점을 조절하는 역할을 합니다." /> (<Tip label="bias" tip="편향의 영어 표기입니다. 수식에서 b로 표시하며, 뉴런의 활성화 기준을 이동시킵니다." />)
            </span>
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
            <span className="font-semibold text-primary">
              <Tip label="활성화 임계값" tip="뉴런이 '발화'(활성화)되기 위해 가중합이 넘어야 하는 최소값입니다. 이 값보다 크면 뉴런이 신호를 전달합니다." />
            </span>
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
        <h4 className="font-semibold text-primary mb-3">
          <Tip label="계산 과정" tip="뉴런은 각 입력(x)에 가중치(w)를 곱한 값을 모두 더하고, 편향(b)을 추가합니다. 이 합이 임계값 이상이면 발화합니다." />
        </h4>
        <div className="space-y-2 text-sm font-mono">
          <div className="text-gray-700">
            <Tip label="합계" tip="가중합(Weighted Sum)이라고 합니다. 모든 (가중치 × 입력)을 더한 값에 편향을 추가한 것입니다." /> = w₁×x₁ + w₂×x₂ + w₃×x₃ + b
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
              <Tip label="활성화 함수" tip="뉴런의 출력을 결정하는 함수입니다. 여기서는 계단 함수(Step Function)를 사용하여, 합계가 임계값 이상이면 1(발화), 미만이면 0(미발화)을 출력합니다." />: {weightedSum.toFixed(3)} {weightedSum >= threshold ? '≥' : '<'} {threshold.toFixed(2)}
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
          <strong className="text-accent">💡 핵심 개념:</strong> 인공 <Tip label="뉴런" tip="신경망의 기본 계산 단위입니다." />은 여러 입력값에 <Tip label="가중치" tip="각 입력의 중요도를 나타내는 값입니다." />를 곱한 후
          합산합니다. 이 합계가 <Tip label="임계값" tip="뉴런이 활성화되기 위해 넘어야 하는 최소값입니다." />을 넘으면 뉴런이 '<Tip label="발화" tip="뉴런이 활성화되어 신호를 전달하는 것입니다." />'하여 신호를 전달합니다.
          <Tip label="딥러닝" tip="많은 층의 뉴런으로 이루어진 신경망을 사용하는 머신러닝 기법입니다." />은 수백만 개의 이러한 뉴런들이 연결된 네트워크입니다.
        </p>
      </div>
    </div>
  );
}
