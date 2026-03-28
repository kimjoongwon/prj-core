# FailedAttemptsCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/FailedAttemptsCell/

## 역할

IDP 계정의 로그인 실패 횟수를 중앙 정렬로 표시하고, 임계치 이상은 danger 톤으로 강조하는 셀.

## Props

```typescript
interface FailedAttemptsCellProps {
  count: number;
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | IDP 계정 컬럼의 실패 횟수 렌더링을 columns 내부 구현에서 cell 레이어로 이동 | codex |
