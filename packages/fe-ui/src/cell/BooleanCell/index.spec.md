# BooleanCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/BooleanCell/

## 역할

불린 값을 "예/아니오" Chip으로 표시하는 Cell 컴포넌트. null/undefined는 "-"로 표시한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌───────────────┬──────────────┬──────────────────┐
│ 항목명        │ 활성화 여부  │ 공개 여부        │
├───────────────┼──────────────┼──────────────────┤
│ 설정 A        │ ╔═════╗     │ ╔══════════╗     │
│               │ ║  예  ║    │ ║  아니오  ║     │
│               │ ╚═════╝     │ ╚══════════╝     │
├───────────────┼──────────────┼──────────────────┤
│ 설정 B        │ ╔══════════╗ │      -           │
│               │ ║  아니오  ║ │   (plain text)   │
│               │ ╚══════════╝ │                  │
└───────────────┴──────────────┴──────────────────┘

셀 내부 구조:

  [ 예 ]      ← Chip (success, flat, sm) - 초록 배경
  [ 아니오 ]  ← Chip (default, flat, sm) - 회색 배경
  -           ← 일반 텍스트 (null/undefined)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 참 (`true`) | `[ 예 ]` - 초록색(success) Chip |
| 거짓 (`false`) | `[ 아니오 ]` - 회색(default) Chip |
| 없음 (`null` / `undefined`) | `-` - 일반 텍스트 |

## Props

```typescript
interface BooleanCellProps {
  /** 불린 값 */
  value: boolean | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 | Chip color |
|---|---|---|
| `true` | 예 | success |
| `false` | 아니오 | default |
| `null` / `undefined` | - | (plain text) |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
