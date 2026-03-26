# Logo UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/data-display/Logo/

## 역할

앱 로고를 표시하는 버튼 컴포넌트. 클릭 시 홈으로 이동하는 용도로 사용한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 기본 ]

  ┌───────────────┐
  │  플레이트      │  ← font-bold text-2xl, 클릭 가능한 버튼
  └───────────────┘
      ↑ 커서: pointer

[ 사이드바 상단 배치 예시 ]

┌─────────────────────────┐
│  플레이트                │  ← Logo 컴포넌트
├─────────────────────────┤
│  메뉴 1                  │
│  메뉴 2                  │
│  ...                    │
└─────────────────────────┘

[ 호버 상태 ]

  ┌───────────────┐
  │  플레이트      │  ← 배경 살짝 변경 (버튼 hover 스타일)
  └───────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | "플레이트" 굵은 텍스트 버튼 |
| 호버 | 버튼 hover 스타일 적용 |

## Props

```typescript
interface LogoProps {
  /** 클릭 핸들러 (보통 홈으로 이동) */
  onClick?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 커스텀 로고 콘텐츠 (미사용) */
  children?: React.ReactNode;
}
```

## 표시 내용

고정 텍스트 "플레이트"를 `font-bold text-2xl` 스타일로 표시.

## 내부 의존성

- `Button` (inputs/Button)
- `HStack` (layouts/HStack)

## HeroUI 매핑

유틸만 사용: `import { cn } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | 내부 의존성 경로 표기를 `layouts/HStack` 기준으로 정리 | codex |
