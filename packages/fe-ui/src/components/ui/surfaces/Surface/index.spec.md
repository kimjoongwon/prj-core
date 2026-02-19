# Surface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Surface/

## 역할

엘리베이션(높이) 시스템을 통해 시각적 계층을 표현하는 기본 Surface 컴포넌트. cva 기반으로 elevation, padding, radius를 제어한다.

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
