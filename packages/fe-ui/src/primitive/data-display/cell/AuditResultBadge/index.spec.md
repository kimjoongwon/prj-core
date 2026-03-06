# AuditResultBadge 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/AuditResultBadge/

## 역할

로그인 감사 로그의 결과(SUCCESS/FAILURE/LOCKED)를 색상 코딩된 Chip으로 표시하는 Cell 컴포넌트. observer로 감싸져 있어 MobX observable 변경을 추적한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌───────────────┬────────────┬─────────────────────┐
│ 사용자        │ 결과       │ 시도 일시           │
├───────────────┼────────────┼─────────────────────┤
│ user@co.kr    │ ╔══════╗  │ 2024-01-15 10:30:45 │
│               │ ║  성공  ║ │                     │
│               │ ╚══════╝  │                     │
├───────────────┼────────────┼─────────────────────┤
│ user2@co.kr   │ ╔══════╗  │ 2024-01-15 10:31:02 │
│               │ ║  실패  ║ │                     │
│               │ ╚══════╝  │                     │
├───────────────┼────────────┼─────────────────────┤
│ user3@co.kr   │ ╔══════╗  │ 2024-01-15 10:35:10 │
│               │ ║  잠금  ║ │                     │
│               │ ╚══════╝  │                     │
└───────────────┴────────────┴─────────────────────┘

셀 내부 구조:

  [ 성공 ]   ← Chip (success, flat, sm) - 초록 배경
  [ 실패 ]   ← Chip (danger,  flat, sm) - 빨간 배경
  [ 잠금 ]   ← Chip (warning, flat, sm) - 노란 배경
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 성공 (`SUCCESS`) | `[ 성공 ]` - 초록색(success) Chip |
| 실패 (`FAILURE`) | `[ 실패 ]` - 빨간색(danger) Chip |
| 잠금 (`LOCKED`) | `[ 잠금 ]` - 노란색(warning) Chip |
| 기타 | `[ 원본값 ]` - 빨간색(danger) Chip |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
