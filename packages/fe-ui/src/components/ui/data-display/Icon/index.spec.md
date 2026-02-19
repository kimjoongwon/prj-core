# Icon UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/Icon/

## 역할

커스텀 SVG 아이콘 모음. 각 아이콘은 독립된 컴포넌트로 제공된다.

## 아이콘 목록

| 아이콘 | 설명 |
|--------|------|
| DogPawIcon | 강아지 발바닥 아이콘 |
| InfoIcon | 정보(i) 원형 아이콘 |
| StarIcon | 별 아이콘 (filled 옵션) |
| WarningIcon | 경고 삼각형 아이콘 |

## 공통 Props

```typescript
// DogPawIcon, InfoIcon, WarningIcon
interface IconProps {
  size?: number;       // @default 20
  color?: string;      // @default "currentColor"
  className?: string;
}

// StarIcon (추가 prop)
interface StarIconProps extends IconProps {
  filled?: boolean;    // @default false
}
```

## HeroUI 매핑

순수 SVG 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
