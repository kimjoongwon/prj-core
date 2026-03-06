# ActiveStatusCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/ActiveStatusCell/

## 역할

활성/비활성 상태를 HeroUI Chip으로 표시하는 Cell 컴포넌트. DataGrid에서 boolean 상태값을 시각적으로 구분하여 보여준다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌─────────────┬──────────────┬─────────────┐
│ 이름        │ 상태         │ 등록일      │
├─────────────┼──────────────┼─────────────┤
│ 홍길동      │ ╔══════╗    │ 2024-01-15  │
│             │ ║  활성  ║   │             │
│             │ ╚══════╝    │             │
├─────────────┼──────────────┼─────────────┤
│ 김철수      │ ╔══════╗    │ 2024-01-16  │
│             │ ║ 비활성 ║  │             │
│             │ ╚══════╝    │             │
└─────────────┴──────────────┴─────────────┘

셀 내부 구조 (flex, 중앙 정렬):

  [ 활성 ]      ← Chip (success, flat, sm) - 초록 배경
  [ 비활성 ]    ← Chip (default, flat, sm) - 회색 배경
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 활성 (`isActive=true`) | `[ 활성 ]` - 초록색(success) Chip |
| 비활성 (`isActive=false`) | `[ 비활성 ]` - 회색(default) Chip |

## Props

```typescript
interface ActiveStatusCellProps {
  /** 활성 여부 */
  isActive: boolean;
}
```

## 표시 규칙

| 값 | 표시 텍스트 | Chip color |
|---|---|---|
| `true` | 활성 | success |
| `false` | 비활성 | default |

## HeroUI 매핑

- `Chip` (size="sm", variant="flat")
- 중앙 정렬 (`flex w-full justify-center`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
