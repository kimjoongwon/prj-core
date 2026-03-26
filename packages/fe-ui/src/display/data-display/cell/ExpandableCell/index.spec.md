# ExpandableCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/display/data-display/cell/ExpandableCell/

## 역할

트리 구조에서 확장/축소 가능한 셀을 표시하는 Cell 컴포넌트. 폴더(열림/닫힘)/문서 SVG 아이콘과 세로/가로 연결선을 포함하여 계층 구조를 시각화한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태 (트리 구조):

┌─────────────────────────────────┬──────────┐
│ 이름 (계층 구조)                │ 설명     │
├─────────────────────────────────┼──────────┤
│ 📂 루트 카테고리 (depth=0)      │ 최상위   │
├─────────────────────────────────┼──────────┤
│ │                               │          │
│ ├─ 📂 중간 카테고리 (depth=1)  │ 중간     │
├─────────────────────────────────┼──────────┤
│ │  │                            │          │
│ │  └─ 📄 하위 항목 (depth=2)   │ 하위     │
├─────────────────────────────────┼──────────┤
│ 📄 단독 항목 (expandable=false) │ 단독     │
└─────────────────────────────────┴──────────┘

셀 내부 구조 (depth=1, canExpand=true, isExpanded=true):

  [세로선]─[가로선] [📂 열린폴더] 중간 카테고리
  │         └─ depth * 2rem 들여쓰기

셀 내부 구조 (depth=1, canExpand=false):

  [세로선]─[가로선] [📄 문서아이콘] 하위 항목

셀 내부 구조 (depth=0, canExpand=true, isExpanded=false):

  [📁 닫힌폴더] 루트 카테고리
  (연결선 없음, depth=0이므로)

아이콘 상태별:

  📂  열린 폴더 (canExpand=true, isExpanded=true)  - 노란색, 클릭 가능
  📁  닫힌 폴더 (canExpand=true, isExpanded=false) - 노란색, 클릭 가능
  📄  문서      (canExpand=false)                  - primary색, 클릭 불가
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 루트 + 닫힘 (`depth=0, canExpand=true, isExpanded=false`) | `📁 항목명` |
| 루트 + 열림 (`depth=0, canExpand=true, isExpanded=true`) | `📂 항목명` |
| 중간 노드 (`depth=1, canExpand=false`) | `│ └─ 📄 항목명` |
| 들여쓰기 없음 (`expandable=false`) | `📄 항목명` |

## Props

```typescript
interface ExpandableCellProps {
  /** 표시할 값 */
  value: string | number;
  /** 확장 가능한 트리 구조 여부 @default true */
  expandable?: boolean;
  /** 트리 깊이 (들여쓰기 계산용) @default 0 */
  depth?: number;
  /** 하위 항목 존재 여부 (폴더/문서 아이콘 결정) @default false */
  canExpand?: boolean;
  /** 현재 확장 상태 @default false */
  isExpanded?: boolean;
  /** 확장/축소 토글 핸들러 */
  onToggleExpand?: () => void;
}
```

## 표시 규칙

| 조건 | 아이콘 | 동작 |
|---|---|---|
| `canExpand=true`, `isExpanded=true` | 열린 폴더 (노란색) | 클릭 시 축소 |
| `canExpand=true`, `isExpanded=false` | 닫힌 폴더 (노란색) | 클릭 시 확장 |
| `canExpand=false` | 문서 (primary) | 클릭 불가 |
| `expandable=false` | 문서 (primary) | 들여쓰기 없음 |

## 레이아웃

- 들여쓰기: `depth * 2rem` (expandable일 때만)
- 연결선: `depth > 0`일 때 세로선 + 가로선 표시
- 아이콘 크기: `h-7 w-7` 컨테이너, `h-5 w-5` SVG

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
