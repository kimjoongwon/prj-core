# @cocrepo/design-system

HeroUI 기반 디자인 시스템 패키지입니다. 테마 설정, 디자인 토큰, Provider를 제공합니다.

## 설치

```bash
pnpm add @cocrepo/design-system
```

## 주요 기능

### DesignSystemProvider

애플리케이션 루트에 디자인 시스템 Provider를 설정합니다:

```tsx
import { DesignSystemProvider } from '@cocrepo/design-system';

function App() {
  return (
    <DesignSystemProvider>
      <YourApp />
    </DesignSystemProvider>
  );
}
```

### 테마 설정

HeroUI 테마를 커스터마이징합니다:

```tsx
import { DesignSystemProvider } from '@cocrepo/design-system';

function App() {
  return (
    <DesignSystemProvider
      theme="dark"
      defaultTheme="system"
    >
      <YourApp />
    </DesignSystemProvider>
  );
}
```

### 디자인 토큰

일관된 디자인을 위한 토큰 값을 제공합니다:

```typescript
import { tokens } from '@cocrepo/design-system';

// 색상 토큰
const primaryColor = tokens.colors.primary;
const backgroundColor = tokens.colors.background;

// 간격 토큰
const spacing = tokens.spacing.md;

// 타이포그래피 토큰
const fontSize = tokens.typography.fontSize.lg;
```

### HeroUI 설정

커스텀 HeroUI 설정을 제공합니다:

```typescript
import { heroUIConfig } from '@cocrepo/design-system';

// tailwind.config.js에서 사용
export default {
  plugins: [heroUIConfig],
};
```

### 기본 스타일

전역 CSS 스타일을 포함합니다:

```typescript
// 애플리케이션 진입점에서 import
import '@cocrepo/design-system/styles/base.css';
```

---

## 파일 구조

```
src/
├── provider/
│   ├── index.ts
│   └── DesignSystemProvider.tsx  # 메인 Provider
├── theme/
│   ├── index.ts
│   ├── tokens.ts                  # 디자인 토큰
│   └── heroui.config.ts           # HeroUI 설정
├── styles/
│   └── base.css                   # 기본 스타일
└── index.ts
```

## 사용 예시

### 전체 설정

```tsx
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { DesignSystemProvider } from '@cocrepo/design-system';
import '@cocrepo/design-system/styles/base.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DesignSystemProvider>
      <App />
    </DesignSystemProvider>
  </React.StrictMode>
);
```

### Tailwind CSS 통합

```javascript
// tailwind.config.js
import { heroUIConfig } from '@cocrepo/design-system';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [heroUIConfig],
};
```

## 의존성

- `@heroui/react` - UI 컴포넌트
- `@heroui/use-theme` - 테마 훅
- `react` (peer)
- `react-dom` (peer)
- `tailwindcss` (peer)
