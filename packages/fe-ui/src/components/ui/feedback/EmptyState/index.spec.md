# EmptyState UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/EmptyState/

## 역할

데이터가 없거나 구현되지 않은 페이지에 표시하는 빈 상태 컴포넌트. Card 기반으로 제목, 설명, 아이콘, 액션 버튼을 포함한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[커스텀 아이콘 + 액션 버튼 있음]
┌──────────────────────────────────────┐
│                                      │
│           [📋 커스텀 아이콘]          │
│                                      │
│        등록된 데이터가 없습니다        │  ← title
│   데이터를 추가하려면 버튼을 누르세요  │  ← description
│                                      │
│           [ + 새로 추가 ]            │  ← action
│                                      │
└──────────────────────────────────────┘

[아이콘 없음 (statusLabel Chip 표시)]
┌──────────────────────────────────────┐
│                                      │
│         ┌──────────────┐             │
│         │   준비 중    │             │  ← Chip (statusLabel)
│         └──────────────┘             │
│                                      │
│          서비스 준비 중입니다         │  ← title
│       곧 사용하실 수 있습니다.        │  ← description
│                                      │
└──────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 아이콘 제공 | 커스텀 아이콘 → title → description → action |
| 아이콘 미제공 | statusLabel Chip → title → description → action |
| action 없음 | title + description만 표시 |

## Props

```typescript
interface EmptyStateProps {
  /** 제목 */
  title: string;
  /** 설명 */
  description: string;
  /** 상태 라벨 (기본: "준비 중") */
  statusLabel?: string;
  /** 아이콘 (옵션) */
  icon?: ReactNode;
  /** 액션 버튼 (옵션) */
  action?: ReactNode;
}
```

## 상태

| 상태 | 동작 |
|------|------|
| icon 제공됨 | 커스텀 아이콘 표시 |
| icon 미제공 | Chip으로 statusLabel 표시 |
| action 제공됨 | 하단에 액션 버튼 영역 표시 |

## HeroUI 매핑

기반: `import { Card, CardBody, CardHeader, Chip } from '@heroui/react'`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
