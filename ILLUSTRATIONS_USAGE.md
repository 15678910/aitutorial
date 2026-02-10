# SVG Illustrations Usage Guide

## Overview

The project includes 5 custom SVG illustration components designed for the Korean AI learning platform:

1. **AIBrainSvg** - Animated brain with neural network connections
2. **NeuralNetworkSvg** - 3-layer neural network with data flow animation
3. **DataFlowSvg** - Data processing pipeline visualization
4. **MLProcessSvg** - Machine learning process diagram
5. **HeroIllustration** - Hero section illustration with human-AI interaction

## Installation

All components are located in `src/components/illustrations/` and can be imported from the barrel export:

```tsx
import {
  AIBrainSvg,
  NeuralNetworkSvg,
  DataFlowSvg,
  MLProcessSvg,
  HeroIllustration
} from '@/components/illustrations';
```

## Usage Examples

### Basic Usage

```tsx
import { AIBrainSvg } from '@/components/illustrations';

function MyComponent() {
  return (
    <div>
      <AIBrainSvg />
    </div>
  );
}
```

### With Custom Size

```tsx
<AIBrainSvg width={400} height={300} />
```

### With Custom Styling

```tsx
<AIBrainSvg className="mx-auto my-8 drop-shadow-xl" />
```

### Responsive Layout

```tsx
<div className="w-full max-w-2xl">
  <HeroIllustration className="w-full h-auto" />
</div>
```

## Component Details

### AIBrainSvg

**Purpose**: Represents artificial neural networks and AI thinking
**Default Size**: 300x250
**Animations**: Pulsing nodes, flowing connections, glowing effect
**Colors**: Primary navy, accent teal
**Korean Label**: "인공 신경망"

```tsx
<AIBrainSvg
  width={300}
  height={250}
  className="mx-auto"
/>
```

### NeuralNetworkSvg

**Purpose**: Educational diagram of neural network architecture
**Default Size**: 400x250
**Animations**: Data particles flowing through network layers, pulsing neurons
**Layers**: Input (입력층) → Hidden (은닉층) → Output (출력층)
**Korean Label**: "순방향 신경망 구조"

```tsx
<NeuralNetworkSvg
  width={400}
  height={250}
  className="my-6"
/>
```

### DataFlowSvg

**Purpose**: Shows data transformation pipeline
**Default Size**: 400x200
**Animations**: Floating input icons, flowing particles, rotating gears, floating output icons
**Flow**: Data (데이터) → Processing (처리) → Insights (인사이트)
**Features**: Icons for text, images, audio input; charts, patterns, lightning output

```tsx
<DataFlowSvg
  width={400}
  height={200}
  className="w-full"
/>
```

### MLProcessSvg

**Purpose**: Machine learning workflow diagram
**Default Size**: 500x150
**Animations**: Flowing arrows, pulsing step boxes, floating icons
**Steps**:
  - Data (데이터) - Database icon
  - Training (학습) - Loop/iteration icon
  - Model (모델) - Brain icon
  - Prediction (예측) - Target icon
**Korean Label**: "머신러닝 프로세스"

```tsx
<MLProcessSvg
  width={500}
  height={150}
  className="my-8"
/>
```

### HeroIllustration

**Purpose**: Main hero section visual for landing page
**Default Size**: 600x400
**Animations**:
  - Floating screens with data visualizations
  - Orbiting data nodes
  - Flowing data particles
  - Pulsing glow effects
**Features**:
  - Stylized human figure interacting with AI
  - Multiple floating screens showing:
    - Data analysis (데이터 분석)
    - Neural network (신경망)
    - AI model (AI 모델)
  - Ambient background effects
  - Circuit pattern decorations
**Korean Label**: "AI와 함께하는 학습 여정"

```tsx
<HeroIllustration
  width={600}
  height={400}
  className="w-full max-w-4xl mx-auto"
/>
```

## Design System

### Colors Used

All illustrations use the platform's color palette:

- **Primary**: `#29264c` (navy) - Main structural elements
- **Primary Light**: `#3d3a66` - Secondary structures
- **Accent**: `#32c2a2` (teal) - Active elements, highlights
- **Accent Light**: `#5dd4b8` - Glows, emphasis
- **Surface**: `#f9fafb` - Text, light elements

### Animation Principles

1. **Subtle and Smooth**: Animations enhance rather than distract
2. **Educational Purpose**: Movements illustrate concepts (data flow, neural activation)
3. **Performance**: CSS animations only, no JavaScript required
4. **Accessible**: Respects user motion preferences (can be disabled via CSS)

### Accessibility

To respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .your-container * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Example Layout Compositions

### Course Hero Section

```tsx
function CourseHero() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-teal-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-navy mb-4">
              AI 기초부터 시작하세요
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              인공지능의 원리를 쉽고 재미있게 배워보세요
            </p>
            <button className="btn-primary">시작하기</button>
          </div>
          <div>
            <HeroIllustration className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### Chapter Introduction

```tsx
function ChapterIntro() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="text-center mb-8">
        <AIBrainSvg className="mx-auto mb-6" width={250} height={200} />
        <h2 className="text-3xl font-bold mb-4">신경망의 원리</h2>
        <p className="text-gray-600">
          인간의 뇌에서 영감을 받은 인공 신경망의 작동 방식을 알아봅시다
        </p>
      </div>
    </div>
  );
}
```

### Concept Explanation Grid

```tsx
function ConceptsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
      <div className="card">
        <NeuralNetworkSvg className="w-full mb-4" />
        <h3 className="text-xl font-semibold mb-2">신경망 구조</h3>
        <p>입력층, 은닉층, 출력층으로 구성된 네트워크</p>
      </div>

      <div className="card">
        <DataFlowSvg className="w-full mb-4" />
        <h3 className="text-xl font-semibold mb-2">데이터 처리</h3>
        <p>원시 데이터에서 의미있는 인사이트 도출</p>
      </div>

      <div className="card">
        <MLProcessSvg className="w-full mb-4" />
        <h3 className="text-xl font-semibold mb-2">학습 프로세스</h3>
        <p>데이터 수집부터 예측까지의 전 과정</p>
      </div>
    </div>
  );
}
```

## Props Interface

All components share the same props interface:

```tsx
interface IllustrationProps {
  className?: string;  // Optional CSS classes
  width?: number;      // Optional width (default varies)
  height?: number;     // Optional height (default varies)
}
```

## File Locations

```
src/
└── components/
    └── illustrations/
        ├── AIBrainSvg.tsx          (300x250)
        ├── NeuralNetworkSvg.tsx    (400x250)
        ├── DataFlowSvg.tsx         (400x200)
        ├── MLProcessSvg.tsx        (500x150)
        ├── HeroIllustration.tsx    (600x400)
        └── index.ts                (barrel export)
```

## Tips

1. **Responsive Design**: Use Tailwind's `w-full h-auto` for responsive scaling
2. **Performance**: SVGs are lightweight and render efficiently
3. **Customization**: Fork components to adjust colors or animations
4. **Composition**: Combine multiple illustrations in layouts
5. **Accessibility**: Add `aria-label` to parent containers for screen readers

```tsx
<div aria-label="Neural network diagram showing data flow">
  <NeuralNetworkSvg />
</div>
```

## Future Enhancements

Potential additions:
- Dark mode variants
- Interactive hover states
- Click-to-pause animations
- Export individual animation keyframes
- More specialized illustrations (CNNs, RNNs, Transformers)
