# SectionSurface 컴포넌트 기획서

> 생성일: 2026-03-15
> 타입: surface
> 위치: packages/fe-ui/src/surface/SectionSurface/SectionSurface.tsx

## 역할

섹션 콘텐츠가 올라갈 elevated 표면만 제공합니다.
구조 배치와 제목 슬롯은 `Section`, `PageTitleBar`가 계속 담당합니다.

## Props

```typescript
interface SectionSurfaceProps {
  children: ReactNode;
  className?: string;
  elevation?: ElevationLevel; // default: "elevated"
  padding?: SurfacePadding; // default: "md"
}
```

## 동작

- 이 컴포넌트는 `Surface`에 섹션용 기본 엘리베이션(`elevated`)만 부여합니다.
- 섹션 제목/설명/액션은 `Section`의 `top` 슬롯에서 `PageTitleBar level={2}`로 계속 표현합니다.
- `className`은 표면 wrapper에 적용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | layout 책임을 제거하고 elevated 표면 프리셋 전용 래퍼로 단순화 | codex |
| 2026-03-15 | SectionSurface 신규 생성 | codex |
