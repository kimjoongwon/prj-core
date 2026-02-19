# RevokeButtonCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/RevokeButtonCell/

## 역할

폐기(Revoke) 버튼과 확인 팝오버를 제공하는 Cell 컴포넌트. 세션/토큰 폐기 시 확인 과정을 거친다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
