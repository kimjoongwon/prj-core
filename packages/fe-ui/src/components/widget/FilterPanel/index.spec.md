# FilterPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/FilterPanel/

## 역할

그룹 체크박스, 옵션 체크박스, 검색을 조합한 필터 UI를 제공합니다. 필터 상태 관리와 초기화 기능을 포함합니다.

## Props

```typescript
interface FilterPanelProps {
  filter: FilterState;
  onFilterChange: (filter: FilterState) => void;
  groups?: FilterGroup[];
  groupsTitle?: string;           // 기본값: "그룹 선택"
  options?: FilterOption[];
  optionsTitle?: string;          // 기본값: "옵션 선택"
  showSearch?: boolean;           // 기본값: true
  searchPlaceholder?: string;     // 기본값: "검색..."
  resetLabel?: string;            // 기본값: "필터 초기화"
  initialFilter?: FilterState;
  children?: ReactNode;
  className?: string;
}

interface FilterState {
  selectedGroups: string[];
  selectedOptions: string[];
  searchQuery: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 검색 입력 필드 |
| HeroUI Checkbox/CheckboxGroup | 그룹/옵션 필터 체크박스 |
| HeroUI Button | 필터 초기화 버튼 |

## 상태 관리

**없음** (외부에서 filter 상태를 관리)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| children | 옵션 필터와 초기화 버튼 사이의 추가 컨텐츠 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
