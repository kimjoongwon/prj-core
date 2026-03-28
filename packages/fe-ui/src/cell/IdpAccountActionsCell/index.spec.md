# IdpAccountActionsCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/IdpAccountActionsCell/

## 역할

IDP 계정 행에서 잠금 해제 버튼과 상세 이동 버튼을 한 묶음으로 렌더링하는 셀.

## Props

```typescript
interface IdpAccountActionsCellProps {
  accountId: string;
  isLocked: boolean;
  onUnlock: () => void;
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | IDP 계정 컬럼의 복합 액션 버튼을 columns 내부 구현에서 cell 레이어로 이동 | codex |
