# LockStatusCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/LockStatusCell/

## 역할

영구잠금, 일시잠금, 정상 상태를 색상 칩으로 표시하는 IDP 계정 전용 셀.

## Props

```typescript
interface LockStatusCellProps {
  isPermanentlyLocked: boolean;
  lockedUntil?: string | null;
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | IDP 계정 잠금 상태 렌더링을 columns 내부 구현에서 cell 레이어로 이동 | codex |
