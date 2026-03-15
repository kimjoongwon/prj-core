# Surface 컴포넌트 기획서

> 생성일: 2026-03-15
> 타입: surface
> 위치: packages/fe-ui/src/surface/Surface/Surface.tsx

## 역할

엘리베이션과 패딩만 담당하는 기본 시각 표면 컴포넌트입니다.
layout이 정한 배치 위에 배경, border, shadow 계층을 입힙니다.

## Props

```typescript
type SurfacePadding = "none" | "sm" | "md" | "lg";

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  elevation?: ElevationLevel;
  padding?: SurfacePadding;
}
```

## 동작

- `tokens.elevation` 값을 사용해 background/shadow/border를 조합합니다.
- 기본 엘리베이션은 `elevated`입니다.
- 기본 패딩은 `md (p-6)`입니다.
- shape는 `rounded-xl`로 고정합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface 기본 표면 컴포넌트 신규 생성 | codex |
