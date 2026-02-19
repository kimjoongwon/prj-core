# PageSurface UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/PageSurface/

## 역할

페이지 전체 콘텐츠를 감싸는 래퍼 컴포넌트. Surface의 elevation을 "raised"로 고정하며, 제목/설명/액션 영역을 가진 헤더를 제공한다.

**주의: Page 컴포넌트에서만 사용. Layout에서 사용 금지.**

## Props

```typescript
type PageSurfaceProps = Omit<SurfaceProps, "elevation"> & {
  /** 페이지 제목 */
  title?: string;
  /** 페이지 설명 */
  description?: string;
  /** 우측 상단 액션 영역 (버튼 등) */
  actions?: ReactNode;
};
```

## 구조

```
Surface (elevation="raised", padding="none")
├── Header (title || actions 존재 시)
│   ├── 좌측: title + description
│   └── 우측: actions
└── Content (padding 적용)
```

## 엘리베이션

고정값 "raised" (shadow-sm, bg-content1)

## 내부 의존성

- `Surface` (surfaces/Surface)

## HeroUI 매핑

순수 구현. observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
