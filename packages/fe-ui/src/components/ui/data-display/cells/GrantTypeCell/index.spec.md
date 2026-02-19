# GrantTypeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/GrantTypeCell/

## 역할

OIDC Grant Type 목록을 Chip 목록으로 표시하는 Cell 컴포넌트. 여러 Grant Type을 가로로 나열한다.

## Props

```typescript
interface GrantTypeCellProps {
  /** Grant Type 목록 */
  types: string[];
}
```

## 표시 규칙

| 값 | 표시 텍스트 |
|---|---|
| `authorization_code` | Auth Code |
| `client_credentials` | Client Cred |
| `refresh_token` | Refresh |
| 기타 | 원본 문자열 |
| 빈 배열 / null | - |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat") - 각 타입마다 하나씩
- `flex flex-wrap gap-1` 레이아웃

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
