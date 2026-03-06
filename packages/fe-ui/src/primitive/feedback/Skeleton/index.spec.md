# Skeleton UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/primitive/feedback/Skeleton/

## 역할

콘텐츠 로딩 중 플레이스홀더를 표시하는 컴포넌트. HeroUI Skeleton의 패스스루 래퍼이다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[텍스트 라인 대체]
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← 한 줄 skeleton (애니메이션 shimmer)
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓

[카드 대체]
┌──────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │  ← 제목 영역
│                                  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │  ← 본문 라인 1
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        │  ← 본문 라인 2
│  ▓▓▓▓▓▓▓▓▓▓▓                   │  ← 본문 라인 3
└──────────────────────────────────┘

[원형 아바타 대체]
  ⬤  ← 원형 skeleton (isLoaded=false)
  (크기는 className으로 제어)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 회색 shimmer 애니메이션 블록 |
| isLoaded=true | 실제 children 렌더링 |
| isLoaded=false (기본) | shimmer 플레이스홀더 표시 |

## Props

```typescript
// HeroUI SkeletonProps 전체를 그대로 사용
import { type SkeletonProps } from "@heroui/react";
```

## HeroUI 매핑

기반: `import { Skeleton as NextSkeleton } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
