# Surface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Surface/

## 역할

엘리베이션(높이) 시스템을 통해 시각적 계층을 표현하는 기본 Surface 컴포넌트. cva 기반으로 elevation, padding, radius를 제어한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[elevation 계층 시각화]

elevation=flat (레벨 0)
┌──────────────────────────────────┐
│  bg-background, 그림자 없음      │  ← 페이지 배경
└──────────────────────────────────┘

  elevation=raised (레벨 1)
  ┌──────────────────────────────┐
  │  bg-content1, shadow-sm      │  ← 페이지 섹션 (PageSurface 기본값)
  └──────────────────────────────┘

    elevation=elevated (레벨 2) ← 기본값
    ┌──────────────────────────┐
    │  bg-content1, shadow-md  │  ← 카드, DataGrid (SectionSurface 기본값)
    │  border-divider 테두리   │
    └──────────────────────────┘

      elevation=floating (레벨 3)
      ┌────────────────────────┐
      │  bg-content2, shadow-lg│  ← 드롭다운, 팝오버
      └────────────────────────┘

        elevation=overlay (레벨 4)
        ┌──────────────────────┐
        │ bg-content2, shad-xl │  ← 모달, 다이얼로그
        └──────────────────────┘

[padding 변형]
┌──┐  ← padding=none (p-0)
│  │
└──┘

┌────┐  ← padding=sm (p-3)
│    │
└────┘

┌──────┐  ← padding=md (p-4, 기본값)
│      │
└──────┘

┌────────┐  ← padding=lg (p-6)
│        │
└────────┘

[radius 변형]
┌──────────────┐  ← radius=xl (기본값, rounded-xl)
│              │
└──────────────┘

┌─────────────┐  ← radius=none (squared)
│             │
└─────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| flat | 배경색만 (그림자 없음) |
| raised | 약한 그림자 + content1 배경 |
| elevated (기본) | 중간 그림자 + 테두리 + content1 배경 |
| floating | 강한 그림자 + content2 배경 |
| overlay | 가장 강한 그림자 + content2 배경 |

## Props

```typescript
type SurfaceProps = VariantProps<typeof surfaceVariants> & {
  children?: ReactNode;
  className?: string;
  as?: ElementType;     // @default "div"
};
```

## 변형 (Variants)

### elevation

| 레벨 | 이름 | Shadow | Background | 용도 |
|------|------|--------|------------|------|
| 0 | flat | none | bg-background | 페이지 배경 |
| 1 | raised | sm | bg-content1 | 페이지 섹션 |
| 2 | elevated | md | bg-content1 + border-divider | 카드 (기본값) |
| 3 | floating | lg | bg-content2 | 드롭다운 |
| 4 | overlay | xl | bg-content2 | 모달 |

### padding

| 값 | CSS |
|----|-----|
| none | p-0 |
| sm | p-3 |
| md | p-4 (기본값) |
| lg | p-6 |

### radius

| 값 | CSS |
|----|-----|
| none | rounded-none |
| sm | rounded-sm |
| md | rounded-md |
| lg | rounded-lg |
| xl | rounded-xl (기본값) |

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
