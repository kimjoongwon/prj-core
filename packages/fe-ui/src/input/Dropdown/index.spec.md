# Dropdown Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/Dropdown/

## 역할

트리거 요소 클릭 시 드롭다운 메뉴를 표시하는 컴포넌트. HeroUI의 Dropdown 시스템을 래핑하여 선언적 인터페이스를 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
닫힌 상태 (트리거: 버튼)
┌────────────────┐
│  더보기  ▾     │  ← trigger (어떤 ReactNode든 가능)
└────────────────┘

열린 상태 (메뉴 표시)
┌────────────────┐
│  더보기  ▾     │
└────────────────┘
┌────────────────┐
│  수정하기       │  ← DropdownItem (key: "edit")
│  복사하기       │  ← DropdownItem (key: "copy")
│ ─────────────  │
│  삭제하기       │  ← DropdownItem (key: "delete", color: "danger")
└────────────────┘

트리거: 아이콘 버튼
     [⋮]
      │
┌─────────────┐
│  편집        │
│  공유        │
│  삭제        │
└─────────────┘

아이템 hover 상태
┌────────────────┐
│  수정하기       │
│░░복사하기░░░░░░│  ← hover 시 배경 flat 하이라이트
│  삭제하기       │
└────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 텍스트 트리거 + 드롭다운 메뉴 |
| 아이콘 트리거 | 아이콘 버튼(⋮, ···) + 드롭다운 메뉴 |
| 위험 아이템 | 삭제 등 위험 액션은 빨간 텍스트 |
| 구분선 포함 | 아이템 그룹 사이 구분선 |

## Props

```typescript
interface DropdownItemProps extends Omit<HeroUIDropdownItemProps, "children"> {
  /** 아이템 고유 키 */
  key: string;
  /** 표시 텍스트 */
  label: string;
}

interface DropdownProps extends Omit<HeroUIDropdownProps, "children" | "trigger"> {
  /** 드롭다운을 여는 트리거 요소 */
  trigger: React.ReactNode;
  /** 드롭다운 메뉴 아이템 목록 */
  dropdownItems: DropdownItemProps[];
  /** 아이템 선택 핸들러 */
  onAction?: (key: string) => void;
}
```

## 동작 흐름

1. `trigger` 요소 클릭 -> 드롭다운 메뉴 열림
2. 아이템 클릭 -> `onAction(key)` 호출
3. 외부 클릭 -> 드롭다운 닫힘

## HeroUI 매핑

- `Dropdown` + `DropdownTrigger` + `DropdownMenu` + `DropdownItem`
- DropdownMenu: variant="flat"

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
