# Spacer UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/Spacer/

## 역할

요소 사이에 빈 공간을 생성하는 유틸리티 컴포넌트. 세로/가로 방향 지정 가능.

## Props

```typescript
interface SpacerProps {
  /** 공간 크기 (px 단위) @default 4 */
  size?: number;
  /** 공간 방향 @default "vertical" */
  direction?: "horizontal" | "vertical";
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 동작

| direction | 적용 CSS |
|-----------|----------|
| vertical | `h-[{size}px]` |
| horizontal | `w-[{size}px]` |

`aria-hidden="true"` 접근성 속성 포함.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
