# AuthMethodCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/AuthMethodCell/

## 역할

OIDC 토큰 엔드포인트 인증 방식(client_secret_basic, client_secret_post, none)을 Chip으로 표시하는 Cell 컴포넌트.

## Props

```typescript
interface AuthMethodCellProps {
  /** 토큰 엔드포인트 인증 방식 */
  method: string;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `client_secret_basic` | Basic | primary |
| `client_secret_post` | Post | secondary |
| `none` | None (Public) | warning |
| 기타 | 원본 문자열 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
