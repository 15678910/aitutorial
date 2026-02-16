import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { WikiArticle, WikiEdit } from '../types/community'

interface WikiFilter {
  category?: string
  tag?: string
  search?: string
}

interface WikiState {
  articles: WikiArticle[]
  loading: boolean
  getArticles: (filter?: WikiFilter) => WikiArticle[]
  getArticle: (slug: string) => WikiArticle | null
  addArticle: (title: string, content: string, category: string, tags: string[], authorId: string, authorName: string) => void
  editArticle: (slug: string, content: string, editorId: string, editorName: string, summary: string) => void
  incrementViews: (slug: string) => void
  getCategories: () => string[]
}

const STORAGE_KEY = 'ai-platform-wiki'

// localStorage helpers
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const getSampleArticles = (): WikiArticle[] => [
  {
    id: 'wiki-1',
    slug: 'ai-basic-terms',
    title: 'AI 기초 용어 사전',
    content: `# AI 기초 용어 사전

## 인공지능 (Artificial Intelligence, AI)
인간의 학습, 추론, 지각 능력을 컴퓨터 프로그램으로 구현한 기술입니다.

## 머신러닝 (Machine Learning, ML)
데이터에서 패턴을 학습하여 예측이나 결정을 수행하는 AI의 한 분야입니다.
- **지도학습**: 레이블이 있는 데이터로 학습
- **비지도학습**: 레이블 없이 데이터의 구조를 파악
- **강화학습**: 보상을 통해 최적의 행동을 학습

## 딥러닝 (Deep Learning)
인공신경망을 여러 층으로 쌓아 복잡한 패턴을 학습하는 머신러닝 기법입니다.

## 트랜스포머 (Transformer)
2017년 "Attention is All You Need" 논문에서 제안된 신경망 아키텍처로, GPT와 BERT의 기반입니다.

## LLM (Large Language Model)
대규모 텍스트 데이터로 학습된 언어 모델입니다. GPT-4, Claude, Gemini 등이 있습니다.

## 프롬프트 (Prompt)
AI 모델에 입력하는 텍스트 지시문입니다. 프롬프트의 품질이 결과를 크게 좌우합니다.

## 파인튜닝 (Fine-tuning)
사전 학습된 모델을 특정 작업에 맞게 추가 학습시키는 과정입니다.

## RAG (Retrieval Augmented Generation)
외부 데이터를 검색하여 LLM의 응답을 보강하는 기법입니다.`,
    category: '기초',
    tags: ['AI', '용어', '입문'],
    authorId: 'sample-user-1',
    authorName: '김민수',
    lastEditorId: 'sample-user-1',
    lastEditorName: '김민수',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    views: 234,
    editHistory: [
      {
        id: 'edit-1',
        articleId: 'wiki-1',
        editorId: 'sample-user-5',
        editorName: '정민호',
        summary: 'RAG 항목 추가',
        editedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
    ],
  },
  {
    id: 'wiki-2',
    slug: 'ml-algorithm-comparison',
    title: 'ML 알고리즘 비교표',
    content: `# ML 알고리즘 비교표

## 분류 알고리즘

| 알고리즘 | 장점 | 단점 | 사용 사례 |
|---------|------|------|----------|
| 로지스틱 회귀 | 해석 용이, 빠름 | 비선형 관계 학습 어려움 | 스팸 분류, 이탈 예측 |
| 의사결정 트리 | 직관적, 해석 쉬움 | 과적합 위험 | 고객 세그먼트 |
| 랜덤 포레스트 | 높은 정확도, 과적합 방지 | 느린 예측 속도 | 금융 사기 탐지 |
| SVM | 고차원 데이터에 효과적 | 대규모 데이터에 느림 | 이미지 분류 |
| XGBoost | 최고 수준 성능 | 하이퍼파라미터 튜닝 복잡 | 캐글 대회 |

## 회귀 알고리즘

| 알고리즘 | 장점 | 단점 | 사용 사례 |
|---------|------|------|----------|
| 선형 회귀 | 간단, 해석 용이 | 비선형 관계 한계 | 가격 예측 |
| 릿지/라소 | 정규화로 과적합 방지 | 하이퍼파라미터 선택 필요 | 다중공선성 데이터 |
| 신경망 | 복잡한 패턴 학습 | 블랙박스, 데이터 많이 필요 | 복잡한 예측 문제 |

## 선택 가이드
1. **데이터가 적은 경우**: 로지스틱 회귀, SVM
2. **해석이 중요한 경우**: 의사결정 트리, 선형 회귀
3. **정확도가 최우선**: XGBoost, 랜덤 포레스트
4. **비정형 데이터**: 딥러닝`,
    category: '머신러닝',
    tags: ['ML', '알고리즘', '비교'],
    authorId: 'sample-user-5',
    authorName: '정민호',
    lastEditorId: 'sample-user-9',
    lastEditorName: '한지우',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    views: 189,
    editHistory: [
      {
        id: 'edit-2',
        articleId: 'wiki-2',
        editorId: 'sample-user-9',
        editorName: '한지우',
        summary: '선택 가이드 섹션 추가',
        editedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      },
    ],
  },
  {
    id: 'wiki-3',
    slug: 'prompt-engineering-guide',
    title: '프롬프트 엔지니어링 가이드',
    content: `# 프롬프트 엔지니어링 가이드

## 기본 원칙

### 1. 명확하고 구체적으로 작성
- 나쁜 예: "코드 작성해줘"
- 좋은 예: "Python으로 CSV 파일을 읽어 매출 데이터를 월별로 집계하는 함수를 작성해줘"

### 2. 역할 지정 (Role Prompting)
\`\`\`
당신은 10년 경력의 시니어 Python 개발자입니다.
코드 리뷰를 해주세요. 특히 성능, 보안, 가독성 측면에서 피드백해주세요.
\`\`\`

### 3. 출력 형식 지정
\`\`\`
다음 형식으로 응답해주세요:
- 요약: (1-2문장)
- 장점: (목록)
- 개선점: (목록)
- 점수: (1-10)
\`\`\`

### 4. Few-shot 예시 제공
입력-출력 예시를 2-3개 제공하면 원하는 패턴을 정확하게 학습시킬 수 있습니다.

### 5. Chain of Thought (CoT)
"단계별로 생각해보세요" 를 추가하면 복잡한 추론 문제의 정확도가 향상됩니다.

## 고급 기법

### Self-Consistency
같은 질문을 여러 번 묻고, 가장 일관된 답변을 선택합니다.

### Tree of Thoughts
여러 추론 경로를 탐색하고 평가하여 최적의 답변을 도출합니다.

### ReAct (Reasoning + Acting)
추론과 도구 사용을 결합하여 복잡한 작업을 수행합니다.`,
    category: '생성형AI',
    tags: ['프롬프트', 'LLM', '가이드'],
    authorId: 'sample-user-4',
    authorName: '최서연',
    lastEditorId: 'sample-user-4',
    lastEditorName: '최서연',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    views: 312,
    editHistory: [],
  },
  {
    id: 'wiki-4',
    slug: 'python-data-libraries',
    title: 'Python 데이터 분석 라이브러리 정리',
    content: `# Python 데이터 분석 라이브러리 정리

## 데이터 처리

### Pandas
데이터 분석의 핵심 라이브러리. DataFrame으로 구조화된 데이터를 쉽게 다룰 수 있습니다.
\`\`\`python
import pandas as pd
df = pd.read_csv('data.csv')
df.groupby('category').mean()
\`\`\`

### NumPy
수치 연산의 기반 라이브러리. 다차원 배열과 행렬 연산을 지원합니다.
\`\`\`python
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(arr.mean(), arr.std())
\`\`\`

## 시각화

### Matplotlib
가장 기본적인 시각화 라이브러리. 세밀한 커스터마이징이 가능합니다.

### Seaborn
Matplotlib 기반의 통계 시각화 라이브러리. 아름다운 기본 스타일을 제공합니다.

### Plotly
인터랙티브 차트를 쉽게 만들 수 있습니다. 웹 대시보드에 적합합니다.

## 머신러닝

### Scikit-learn
전통적 ML 알고리즘의 표준 라이브러리. 일관된 API로 쉽게 사용할 수 있습니다.

### XGBoost / LightGBM
그래디언트 부스팅 알고리즘. 정형 데이터에서 최고 수준의 성능을 보입니다.

## 딥러닝

### PyTorch
연구와 실무 모두에서 인기 있는 딥러닝 프레임워크. 동적 계산 그래프를 지원합니다.

### TensorFlow / Keras
Google의 딥러닝 프레임워크. 프로덕션 배포에 강점이 있습니다.

## 추천 학습 순서
1. NumPy + Pandas (2주)
2. Matplotlib + Seaborn (1주)
3. Scikit-learn (2주)
4. PyTorch 또는 TensorFlow (4주)`,
    category: 'Python',
    tags: ['Python', '라이브러리', '데이터분석'],
    authorId: 'sample-user-9',
    authorName: '한지우',
    lastEditorId: 'sample-user-6',
    lastEditorName: '강하늘',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    views: 156,
    editHistory: [
      {
        id: 'edit-3',
        articleId: 'wiki-4',
        editorId: 'sample-user-6',
        editorName: '강하늘',
        summary: '추천 학습 순서 추가 및 코드 예시 보완',
        editedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
    ],
  },
]

const loadInitialArticles = (): WikiArticle[] => {
  const stored = loadFromStorage<WikiArticle[]>(STORAGE_KEY, [])
  if (stored.length > 0) {
    return stored
  }
  return getSampleArticles()
}

const saveArticlesToStorage = (articles: WikiArticle[]) => {
  saveToStorage(STORAGE_KEY, articles)
}

export const useWikiStore = create<WikiState>((set, get) => ({
  articles: loadInitialArticles(),
  loading: false,

  getArticles: (filter?: WikiFilter) => {
    let result = [...get().articles]

    if (filter?.category) {
      result = result.filter((a) => a.category === filter.category)
    }
    if (filter?.tag) {
      result = result.filter((a) => a.tags.includes(filter.tag!))
    }
    if (filter?.search) {
      const search = filter.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.content.toLowerCase().includes(search) ||
          a.tags.some((t) => t.toLowerCase().includes(search))
      )
    }

    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  },

  getArticle: (slug: string) => {
    return get().articles.find((a) => a.slug === slug) ?? null
  },

  addArticle: (title: string, content: string, category: string, tags: string[], authorId: string, authorName: string) => {
    const slug = generateSlug(title)
    const now = new Date().toISOString()
    const newArticle: WikiArticle = {
      id: `wiki-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      authorId,
      authorName,
      lastEditorId: authorId,
      lastEditorName: authorName,
      createdAt: now,
      updatedAt: now,
      views: 0,
      editHistory: [],
    }

    set((state) => {
      const newArticles = [newArticle, ...state.articles]
      saveArticlesToStorage(newArticles)
      return { articles: newArticles }
    })

    try {
      supabase.from('wiki_articles').insert({
        id: newArticle.id,
        slug: newArticle.slug,
        title: newArticle.title,
        content: newArticle.content,
        category: newArticle.category,
        tags: newArticle.tags,
        author_id: authorId,
        author_name: authorName,
        last_editor_id: authorId,
        last_editor_name: authorName,
        created_at: now,
        updated_at: now,
      })
    } catch (error) {
      console.error('Failed to sync article to Supabase:', error)
    }
  },

  editArticle: (slug: string, content: string, editorId: string, editorName: string, summary: string) => {
    const now = new Date().toISOString()
    const newEdit: WikiEdit = {
      id: `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      articleId: '',
      editorId,
      editorName,
      summary,
      editedAt: now,
    }

    set((state) => {
      const newArticles = state.articles.map((a) => {
        if (a.slug !== slug) return a
        const edit = { ...newEdit, articleId: a.id }
        return {
          ...a,
          content: content.trim(),
          lastEditorId: editorId,
          lastEditorName: editorName,
          updatedAt: now,
          editHistory: [...a.editHistory, edit],
        }
      })
      saveArticlesToStorage(newArticles)
      return { articles: newArticles }
    })

    try {
      const article = get().articles.find((a) => a.slug === slug)
      if (article) {
        supabase
          .from('wiki_articles')
          .update({
            content: content.trim(),
            last_editor_id: editorId,
            last_editor_name: editorName,
            updated_at: now,
          })
          .eq('slug', slug)

        supabase.from('wiki_edits').insert({
          id: newEdit.id,
          article_id: article.id,
          editor_id: editorId,
          editor_name: editorName,
          summary,
          edited_at: now,
        })
      }
    } catch (error) {
      console.error('Failed to sync article edit to Supabase:', error)
    }
  },

  incrementViews: (slug: string) => {
    set((state) => {
      const newArticles = state.articles.map((a) => {
        if (a.slug !== slug) return a
        return { ...a, views: a.views + 1 }
      })
      saveArticlesToStorage(newArticles)
      return { articles: newArticles }
    })

    try {
      supabase.rpc('increment_wiki_views', { article_slug: slug })
    } catch (error) {
      console.error('Failed to sync view increment to Supabase:', error)
    }
  },

  getCategories: () => {
    const categories = new Set(get().articles.map((a) => a.category))
    return Array.from(categories).sort()
  },
}))
