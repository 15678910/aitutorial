import type { DiagnosticQuestion } from '../types/learningGuide'

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // Q1 - knowledge: 주제 사전 지식 수준
  {
    id: 'diag-knowledge-1',
    question: '이 주제에 대해 얼마나 알고 있나요?',
    category: 'knowledge',
    options: [
      {
        label: '처음 들어보는 주제예요',
        value: 'knowledge-1-a',
        levelScore: { beginner: 3 },
      },
      {
        label: '이름은 들어봤지만 잘 몰라요',
        value: 'knowledge-1-b',
        levelScore: { beginner: 1, intermediate: 1 },
      },
      {
        label: '기본적인 내용은 알고 있어요',
        value: 'knowledge-1-c',
        levelScore: { intermediate: 3 },
      },
      {
        label: '꽤 잘 알고 있어요',
        value: 'knowledge-1-d',
        levelScore: { advanced: 3 },
      },
    ],
  },
  // Q2 - knowledge: 코딩 경험
  {
    id: 'diag-knowledge-2',
    question: '코딩이나 프로그래밍을 해본 적이 있나요?',
    category: 'knowledge',
    options: [
      {
        label: '아니요, 이번이 처음이에요',
        value: 'knowledge-2-a',
        levelScore: { beginner: 2 },
      },
      {
        label: '학교에서 스크래치 같은 것을 해봤어요',
        value: 'knowledge-2-b',
        levelScore: { beginner: 1, intermediate: 1 },
      },
      {
        label: '간단한 프로그램을 만들어 본 적 있어요',
        value: 'knowledge-2-c',
        levelScore: { intermediate: 2 },
      },
      {
        label: '혼자서 프로젝트를 해본 적 있어요',
        value: 'knowledge-2-d',
        levelScore: { advanced: 2 },
      },
    ],
  },
  // Q3 - style: 학습 방법 선호
  {
    id: 'diag-style-1',
    question: '새로운 것을 배울 때 어떤 방법이 가장 좋아요?',
    category: 'style',
    options: [
      {
        label: '그림이나 영상으로 보는 게 좋아요',
        value: 'style-1-a',
        styleScore: { visual: 2 },
      },
      {
        label: '글로 차근차근 읽으면서 이해하는 게 좋아요',
        value: 'style-1-b',
        styleScore: { textual: 2 },
      },
      {
        label: '직접 해보거나 예시를 보는 게 좋아요',
        value: 'style-1-c',
        styleScore: { 'example-based': 2 },
      },
    ],
  },
  // Q4 - style: 설명 방식 선호
  {
    id: 'diag-style-2',
    question: '선생님이 설명할 때 어떤 방식이 이해가 잘 돼요?',
    category: 'style',
    options: [
      {
        label: '비유를 들어서 설명해줄 때 (예: 인터넷은 도로 같아요)',
        value: 'style-2-a',
        styleScore: { visual: 1 },
      },
      {
        label: '순서대로 1번, 2번, 3번 차근차근 설명해줄 때',
        value: 'style-2-b',
        styleScore: { textual: 1 },
      },
      {
        label: '실제 화면을 보여주면서 이렇게 하세요 할 때',
        value: 'style-2-c',
        styleScore: { 'example-based': 1 },
      },
    ],
  },
  // Q5 - preference: 학습 가이드 기대
  {
    id: 'diag-preference-1',
    question: '학습 가이드가 어떤 도움을 주면 좋겠어요?',
    category: 'preference',
    options: [
      {
        label: '어려운 말을 쉽게 풀어서 설명해줘',
        value: 'preference-1-a',
      },
      {
        label: '내가 얼마나 이해했는지 퀴즈를 내줘',
        value: 'preference-1-b',
      },
      {
        label: '실제로 어디에 쓰이는지 알려줘',
        value: 'preference-1-c',
      },
      {
        label: '더 알고 싶은 것을 알려줘',
        value: 'preference-1-d',
      },
    ],
  },
]
