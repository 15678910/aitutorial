import GlossaryHighlighter from './GlossaryHighlighter'
import Card from '../ui/Card'

/**
 * Demo component showing how to use the GlossaryHighlighter
 *
 * Usage Example:
 *
 * import { GlossaryHighlighter } from '@/components/glossary'
 *
 * function LessonContent() {
 *   return (
 *     <GlossaryHighlighter>
 *       <p>
 *         AI는 머신러닝과 딥러닝 기술을 활용하여 자연어 처리와 컴퓨터 비전 등의
 *         작업을 수행합니다. GPT와 같은 LLM은 Transformer 아키텍처를 사용합니다.
 *       </p>
 *     </GlossaryHighlighter>
 *   )
 * }
 *
 * The component will automatically:
 * - Detect glossary terms in the text
 * - Add a book icon (📖) and dotted underline
 * - Show a tooltip with the definition when clicked
 * - Only highlight the FIRST occurrence of each term
 */
export default function GlossaryDemo() {
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary mb-4">Glossary System Demo</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">AI 기초 강의 예시</h2>
        <GlossaryHighlighter>
          <div className="space-y-4 text-gray-700">
            <p>
              <strong>인공지능(AI)</strong>이란 무엇일까요? AI는 인간의 학습능력과 추론능력을
              컴퓨터로 구현한 기술입니다. 현대의 AI는 주로 머신러닝과 딥러닝을 기반으로
              작동합니다.
            </p>

            <p>
              머신러닝은 크게 지도학습, 비지도학습, 강화학습으로 나뉩니다. 지도학습에서는
              레이블이 있는 데이터셋을 사용하여 모델을 학습시키며, 선형 회귀나 로지스틱 회귀
              같은 알고리즘을 활용합니다.
            </p>

            <p>
              딥러닝은 신경망을 여러 층으로 쌓아 복잡한 패턴을 학습합니다. CNN은 이미지 처리에,
              RNN은 시퀀스 데이터 처리에 특화되어 있습니다. 최근에는 Transformer 구조를 사용한
              LLM이 자연어 처리 분야에서 큰 성과를 내고 있습니다.
            </p>

            <p>
              모델을 학습시킬 때는 경사 하강법을 사용하여 손실 함수를 최소화합니다. 과적합을
              방지하기 위해 드롭아웃이나 배치 정규화 같은 기법을 사용하며, 하이퍼파라미터
              튜닝을 통해 성능을 최적화합니다.
            </p>
          </div>
        </GlossaryHighlighter>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">웹 개발 강의 예시</h2>
        <GlossaryHighlighter>
          <div className="space-y-4 text-gray-700">
            <p>
              이 프로젝트는 React와 TypeScript를 사용하여 SPA를 구축합니다. Vite를 통해
              빠른 개발 경험을 제공하며, 컴포넌트 기반으로 UI를 설계합니다.
            </p>

            <p>
              백엔드는 Supabase를 사용하며, REST API를 통해 데이터를 주고받습니다. PostgreSQL
              데이터베이스에 RLS를 적용하여 보안을 강화하고, OAuth를 통해 사용자 인증을
              처리합니다.
            </p>

            <p>
              Git을 사용한 버전 관리와 GitHub를 통한 협업이 중요합니다. Branch를 생성하여
              작업하고, Pull Request를 통해 코드 리뷰를 받은 후 Merge합니다. Conventional
              Commits 규칙을 따라 일관성 있는 커밋 메시지를 작성합니다.
            </p>

            <p>
              코드 스플리팅과 번들링을 통해 성능을 최적화하며, CI/CD 파이프라인을 구축하여
              자동으로 테스트하고 배포합니다. 스테이징 환경에서 충분히 테스트한 후 프로덕션에
              배포합니다.
            </p>
          </div>
        </GlossaryHighlighter>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary mb-4">데이터 과학 강의 예시</h2>
        <GlossaryHighlighter>
          <div className="space-y-4 text-gray-700">
            <p>
              데이터 전처리는 데이터셋을 준비하는 중요한 단계입니다. 피처를 선택하고 정규화나
              스케일링을 통해 데이터의 범위를 조정합니다.
            </p>

            <p>
              모델의 성능을 평가할 때는 교차 검증을 사용하며, 정밀도와 재현율, F1 Score 등의
              지표를 확인합니다. ROC 곡선과 AUC를 통해 전체적인 분류 성능을 파악할 수 있습니다.
            </p>

            <p>
              편향과 분산의 트레이드오프를 이해하는 것이 중요합니다. 앙상블 기법을 사용하면
              여러 모델을 결합하여 더 나은 성능을 얻을 수 있으며, 랜덤 포레스트는 부트스트랩을
              활용한 대표적인 앙상블 알고리즘입니다.
            </p>
          </div>
        </GlossaryHighlighter>
      </Card>

      <div className="bg-surface p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-3">사용 팁</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>📖 아이콘과 점선 밑줄이 있는 용어를 클릭하면 상세 설명을 볼 수 있습니다.</li>
          <li>각 용어는 한 번만 하이라이트되어 가독성을 유지합니다.</li>
          <li>코드 블록이나 제목 내의 용어는 하이라이트되지 않습니다.</li>
          <li>툴팁 외부를 클릭하면 툴팁이 닫힙니다.</li>
        </ul>
      </div>
    </div>
  )
}
