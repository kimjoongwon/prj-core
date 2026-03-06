# GrantTypeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/GrantTypeCell/

## 역할

OIDC Grant Type 목록을 Chip 목록으로 표시하는 Cell 컴포넌트. 여러 Grant Type을 가로로 나열한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌──────────────────┬────────────────────────────────┬──────────┐
│ 클라이언트 ID    │ Grant Type                     │ 상태     │
├──────────────────┼────────────────────────────────┼──────────┤
│ my-app           │ [ Auth Code ] [ Refresh ]       │ 활성     │
├──────────────────┼────────────────────────────────┼──────────┤
│ my-service       │ [ Client Cred ]                 │ 활성     │
├──────────────────┼────────────────────────────────┼──────────┤
│ full-app         │ [ Auth Code ] [ Client Cred ]  │ 비활성   │
│                  │ [ Refresh ]                     │          │
├──────────────────┼────────────────────────────────┼──────────┤
│ no-grant-app     │      -                          │ 비활성   │
└──────────────────┴────────────────────────────────┴──────────┘

셀 내부 구조 (flex-wrap, gap-1):

  ┌─────────────┐ ┌─────────────┐
  │  Auth Code  │ │   Refresh   │  ← 각 타입마다 Chip (flat, sm)
  └─────────────┘ └─────────────┘

  여러 개인 경우 줄바꿈:
  ┌─────────────┐ ┌──────────────┐
  │  Auth Code  │ │ Client Cred  │
  └─────────────┘ └──────────────┘
  ┌─────────────┐
  │   Refresh   │
  └─────────────┘

  빈 배열:
  -   ← plain text
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| Authorization Code | `[ Auth Code ]` - Chip |
| Client Credentials | `[ Client Cred ]` - Chip |
| Refresh Token | `[ Refresh ]` - Chip |
| 복수 타입 | `[ Auth Code ] [ Refresh ]` - 가로 나열 (줄바꿈 가능) |
| 빈 배열 / null | `-` - 일반 텍스트 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
