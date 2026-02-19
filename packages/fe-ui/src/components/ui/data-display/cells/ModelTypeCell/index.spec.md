# ModelTypeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/ModelTypeCell/

## 역할

OIDC 모델 타입(AccessToken, RefreshToken, Session 등)을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트.

## Props

```typescript
interface ModelTypeCellProps {
  /** OIDC 모델 타입 */
  type: string;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `AccessToken` | Access Token | primary |
| `RefreshToken` | Refresh Token | secondary |
| `AuthorizationCode` | Auth Code | warning |
| `Session` | Session | success |
| `Grant` | Grant | default |
| `ClientCredentials` | Client Cred | primary |
| `DeviceCode` | Device Code | warning |
| `Interaction` | Interaction | success |
| 기타 | 원본 문자열 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
