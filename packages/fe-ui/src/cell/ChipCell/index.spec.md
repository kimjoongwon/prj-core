# ChipCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/ChipCell/

## 역할

단일 문자열 값을 HeroUI Chip으로 렌더링하는 범용 셀. 값이 비어 있으면 placeholder를 텍스트로 표시한다.

## Props

```typescript
interface ChipCellProps {
  label?: string | number | null;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "dot";
  size?: "sm" | "md" | "lg";
  placeholder?: string;
  className?: string;
  align?: "center" | "start" | "end";
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | columns 인라인 Chip/Badge 마크업 제거를 위해 범용 칩 셀을 추가 | codex |
