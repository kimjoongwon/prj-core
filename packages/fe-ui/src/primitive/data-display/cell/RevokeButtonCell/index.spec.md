# RevokeButtonCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/primitive/data-display/cell/RevokeButtonCell/

## 역할

폐기(Revoke) 버튼과 확인 팝오버를 제공하는 Cell 컴포넌트. 세션/토큰 폐기 시 확인 과정을 거친다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 (기본 상태):

┌────────────────────┐
│ 액션                │
├────────────────────┤
│ [ 🚫 폐기 ]        │  ← danger/flat 버튼
├────────────────────┤
│ [ 🚫 폐기 ]        │
└────────────────────┘

팝오버 열림 상태 (버튼 클릭 후):

┌────────────────────┐        ┌──────────────────────────────┐
│ [ 🚫 폐기 ] ◀──────────────│  이 세션/토큰을 폐기하시겠습니까?  │
└────────────────────┘        │                              │
                              │  [ 취소 ]      [ 폐기 ]      │
                              └──────────────────────────────┘
                                                  ↑ danger 버튼

로딩 상태:

┌────────────────────┐
│ [ ⟳ 폐기 ]        │  ← 비활성화 (isLoading)
└────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | `[ 🚫 폐기 ]` (danger/flat 버튼) |
| 팝오버 열림 | 왼쪽에 확인 팝오버 표시 |
| 로딩 중 | `[ ⟳ 폐기 ]` (버튼 비활성화) |

## Props

```typescript
interface RevokeButtonCellProps {
  /** 폐기 확인 후 호출되는 콜백 */
  onRevoke: () => void;
  /** 폐기 진행 중 여부 */
  isLoading?: boolean;
  /** 확인 메시지 @default "이 세션/토큰을 폐기하시겠습니까?" */
  confirmMessage?: string;
}
```

## 동작 흐름

1. "폐기" 버튼 클릭 -> Popover 열림
2. 확인 메시지 표시 + "취소"/"폐기" 버튼
3. "폐기" 클릭 -> `onRevoke()` 호출 + Popover 닫힘
4. "취소" 클릭 -> Popover 닫힘

## HeroUI 매핑

- `Button` (size="sm", color="danger", variant="flat") + `Ban` 아이콘 (lucide-react)
- `Popover` + `PopoverTrigger` + `PopoverContent` (placement="left")
- isLoading 시 버튼 비활성화

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
