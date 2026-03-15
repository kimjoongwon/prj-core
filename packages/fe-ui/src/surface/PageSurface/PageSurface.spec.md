# PageSurface 컴포넌트 기획서

> 생성일: 2026-03-15
> 타입: surface
> 위치: packages/fe-ui/src/surface/PageSurface/PageSurface.tsx

## 역할

페이지 콘텐츠가 올라갈 raised 표면만 제공합니다.
구조 배치와 제목 영역은 `Page`, `PageTitleBar`가 계속 담당합니다.

## Props

```typescript
interface PageSurfaceProps {
  children: ReactNode;
  className?: string;
  elevation?: ElevationLevel; // default: "raised"
  padding?: SurfacePadding; // default: "md"
}
```

## 동작

- 이 컴포넌트는 `Surface`에 페이지용 기본 엘리베이션(`raised`)만 부여합니다.
- `Page`의 `top`, `leftAside`, `rightAside`, `footer` 같은 구조 슬롯은 소유하지 않습니다.
- 페이지 제목/설명/액션은 `Page`의 `top` 슬롯에서 `PageTitleBar`로 계속 표현합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | layout 책임을 제거하고 raised 표면 프리셋 전용 래퍼로 단순화 | codex |
| 2026-03-15 | PageSurface 신규 생성 | codex |
