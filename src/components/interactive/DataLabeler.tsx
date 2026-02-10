import { useState } from 'react';

interface Item {
  id: string;
  emoji: string;
  name: string;
  correctCategory: string;
}

interface DataLabelerProps {
  className?: string;
}

const ITEMS: Item[] = [
  { id: '1', emoji: '🐱', name: '고양이', correctCategory: '동물' },
  { id: '2', emoji: '🐶', name: '강아지', correctCategory: '동물' },
  { id: '3', emoji: '🚗', name: '자동차', correctCategory: '사물' },
  { id: '4', emoji: '🏠', name: '집', correctCategory: '사물' },
  { id: '5', emoji: '🌸', name: '꽃', correctCategory: '식물' },
  { id: '6', emoji: '🐟', name: '물고기', correctCategory: '동물' },
  { id: '7', emoji: '🦅', name: '독수리', correctCategory: '동물' },
  { id: '8', emoji: '🌳', name: '나무', correctCategory: '식물' },
];

const CATEGORIES = ['동물', '사물', '식물'];

export default function DataLabeler({ className = '' }: DataLabelerProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const handleDrop = (itemId: string, category: string) => {
    const newPlacements = { ...placements, [itemId]: category };
    setPlacements(newPlacements);
    setChecked(false);
  };

  const checkAnswers = () => {
    let correct = 0;
    ITEMS.forEach((item) => {
      if (placements[item.id] === item.correctCategory) {
        correct++;
      }
    });
    setScore(correct);
    setChecked(true);
  };

  const reset = () => {
    setPlacements({});
    setChecked(false);
    setScore(0);
  };

  const unplacedItems = ITEMS.filter(item => !placements[item.id]);
  const allPlaced = unplacedItems.length === 0;
  const perfectScore = checked && score === ITEMS.length;

  const getItemStatus = (item: Item) => {
    if (!checked) return 'default';
    if (!placements[item.id]) return 'default';
    return placements[item.id] === item.correctCategory ? 'correct' : 'incorrect';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-primary mb-2">데이터 라벨링 체험</h3>
        <p className="text-gray-600 text-sm">
          각 항목을 올바른 카테고리로 분류해보세요. 이것이 지도학습의 시작입니다!
        </p>
      </div>

      {/* Unplaced Items Pool */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>📦 분류할 항목들</span>
          <span className="text-sm text-gray-500">({unplacedItems.length}개 남음)</span>
        </h4>
        <div className="bg-surface p-4 rounded-lg min-h-[100px] border-2 border-dashed border-gray-300">
          {unplacedItems.length === 0 ? (
            <div className="text-center text-gray-400 py-6">
              모든 항목이 분류되었습니다! ✨
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {unplacedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white px-4 py-3 rounded-lg shadow-md border-2 border-gray-200 cursor-move hover:shadow-lg hover:scale-105 transition-all"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('itemId', item.id)}
                >
                  <div className="text-3xl mb-1">{item.emoji}</div>
                  <div className="text-xs text-gray-600 text-center">{item.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {CATEGORIES.map((category) => {
          const itemsInCategory = ITEMS.filter(item => placements[item.id] === category);

          return (
            <div
              key={category}
              className="border-2 border-primary/30 rounded-lg p-4 min-h-[180px] bg-primary/5"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const itemId = e.dataTransfer.getData('itemId');
                handleDrop(itemId, category);
              }}
            >
              <h5 className="font-bold text-primary mb-3 text-center text-lg">
                {category}
              </h5>
              <div className="space-y-2">
                {itemsInCategory.map((item) => {
                  const status = getItemStatus(item);
                  return (
                    <div
                      key={item.id}
                      className={`
                        px-3 py-2 rounded-lg flex items-center gap-2 cursor-move
                        transition-all
                        ${status === 'correct' ? 'bg-success/20 border-2 border-success' : ''}
                        ${status === 'incorrect' ? 'bg-error/20 border-2 border-error' : ''}
                        ${status === 'default' ? 'bg-white border-2 border-gray-200 hover:shadow-md' : ''}
                      `}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('itemId', item.id)}
                      onClick={() => {
                        // Allow moving back to pool on click
                        const newPlacements = { ...placements };
                        delete newPlacements[item.id];
                        setPlacements(newPlacements);
                        setChecked(false);
                      }}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      {status === 'correct' && <span className="ml-auto text-success">✓</span>}
                      {status === 'incorrect' && <span className="ml-auto text-error">✗</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={checkAnswers}
          disabled={!allPlaced}
          className="flex-1 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-dark transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {checked ? '✓ 확인됨' : '🎯 정답 확인'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors shadow-md"
        >
          🔄 다시하기
        </button>
      </div>

      {/* Score Display */}
      {checked && (
        <div
          className={`
            p-4 rounded-lg border-2 text-center transition-all
            ${perfectScore
              ? 'bg-success/10 border-success'
              : 'bg-warning/10 border-warning'
            }
          `}
        >
          <div className="text-3xl mb-2">
            {perfectScore ? '🎉' : '💪'}
          </div>
          <div className="text-xl font-bold mb-1">
            점수: {score} / {ITEMS.length}
          </div>
          <div className="text-sm text-gray-700">
            {perfectScore
              ? '완벽합니다! 🎊'
              : `${ITEMS.length - score}개를 다시 확인해보세요.`
            }
          </div>
        </div>
      )}

      {/* Success Message */}
      {perfectScore && (
        <div className="mt-4 p-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg border-2 border-accent animate-pulse">
          <p className="text-center font-bold text-primary text-lg">
            🎓 이것이 바로 지도학습입니다!
          </p>
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/30">
        <p className="text-sm text-gray-700 leading-relaxed">
          <strong className="text-accent">💡 핵심 개념:</strong> 지도학습(Supervised Learning)은
          정답이 있는 데이터로 AI를 훈련시키는 방법입니다. 사람이 직접 라벨을 붙인
          수천~수백만 개의 데이터로 AI는 패턴을 학습하고 새로운 데이터를 분류할 수 있게 됩니다.
        </p>
      </div>
    </div>
  );
}
