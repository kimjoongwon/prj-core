# AuditResultBadge 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/AuditResultBadge/

## 역할

로그인 감사 로그의 결과(SUCCESS/FAILURE/LOCKED)를 색상 코딩된 Chip으로 표시하는 Cell 컴포넌트. observer로 감싸져 있어 MobX observable 변경을 추적한다.

## Props

```typescript
interface AuditResultBadgeProps {
  /** 감사 결과 (SUCCESS, FAILURE, LOCKED 등) */
  result: string;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `SUCCESS` | 성공 | success |
| `FAILURE` | 실패 | danger |
| `LOCKED` | 잠금 | warning |
| 기타 | 원본 문자열 | danger |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")
- `"use client"` + `observer` 래핑

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
