# ModelTypeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/ModelTypeCell/

## 역할

OIDC 모델 타입(AccessToken, RefreshToken, Session 등)을 컬러 코딩된 Chip으로 표시하는 Cell 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌─────────────────────────────────┐
│ 타입                             │
├─────────────────────────────────┤
│ ╔══════════════╗                │
│ ║ Access Token ║  (primary)     │
│ ╚══════════════╝                │
├─────────────────────────────────┤
│ ╔═══════════════╗               │
│ ║ Refresh Token ║  (secondary)  │
│ ╚═══════════════╝               │
├─────────────────────────────────┤
│ ╔═══════════╗                   │
│ ║ Auth Code ║  (warning)        │
│ ╚═══════════╝                   │
├─────────────────────────────────┤
│ ╔═════════╗                     │
│ ║ Session ║  (success)          │
│ ╚═════════╝                     │
└─────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| AccessToken | `[ Access Token ]` (primary, 파란 계열) |
| RefreshToken | `[ Refresh Token ]` (secondary, 보라 계열) |
| AuthorizationCode | `[ Auth Code ]` (warning, 노란 계열) |
| Session | `[ Session ]` (success, 초록 계열) |
| Grant | `[ Grant ]` (default, 회색 계열) |
| ClientCredentials | `[ Client Cred ]` (primary, 파란 계열) |
| DeviceCode | `[ Device Code ]` (warning, 노란 계열) |
| Interaction | `[ Interaction ]` (success, 초록 계열) |
| 기타 | `[ 원본 문자열 ]` (default, 회색 계열) |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
