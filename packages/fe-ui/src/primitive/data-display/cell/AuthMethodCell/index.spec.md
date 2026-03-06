# AuthMethodCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/AuthMethodCell/

## 역할

OIDC 토큰 엔드포인트 인증 방식(client_secret_basic, client_secret_post, none)을 Chip으로 표시하는 Cell 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌──────────────────┬─────────────────┬──────────────┐
│ 클라이언트 ID    │ 인증 방식       │ 등록일       │
├──────────────────┼─────────────────┼──────────────┤
│ my-app           │ ╔═════════╗    │ 2024-01-15   │
│                  │ ║  Basic  ║    │              │
│                  │ ╚═════════╝    │              │
├──────────────────┼─────────────────┼──────────────┤
│ my-app-2         │ ╔═════════╗    │ 2024-01-16   │
│                  │ ║  Post   ║    │              │
│                  │ ╚═════════╝    │              │
├──────────────────┼─────────────────┼──────────────┤
│ my-app-public    │ ╔══════════════╗│ 2024-01-17   │
│                  │ ║ None (Public)║│              │
│                  │ ╚══════════════╝│              │
└──────────────────┴─────────────────┴──────────────┘

셀 내부 구조:

  [ Basic ]         ← Chip (primary,   flat, sm) - 파란 배경
  [ Post ]          ← Chip (secondary, flat, sm) - 보라 배경
  [ None (Public) ] ← Chip (warning,   flat, sm) - 노란 배경
  [ 원본값 ]        ← Chip (default,   flat, sm) - 회색 배경
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| Basic (`client_secret_basic`) | `[ Basic ]` - 파란색(primary) Chip |
| Post (`client_secret_post`) | `[ Post ]` - 보라색(secondary) Chip |
| Public (`none`) | `[ None (Public) ]` - 노란색(warning) Chip |
| 기타 | `[ 원본값 ]` - 회색(default) Chip |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
