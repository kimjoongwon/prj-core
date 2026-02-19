# Dropdown Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/Dropdown/

## 역할

트리거 요소 클릭 시 드롭다운 메뉴를 표시하는 컴포넌트. HeroUI의 Dropdown 시스템을 래핑하여 선언적 인터페이스를 제공한다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
