# SearchFilterBar Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SearchFilterBar/

## 역할

검색창과 필터 토글 버튼을 조합한 검색/필터 바입니다. Enter 키로 검색 실행, 필터 버튼에 적용된 필터 수 배지를 표시합니다.

## Props

```typescript
interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: () => void;
  onFilterToggle?: () => void;
  isFilterOpen?: boolean;        // 기본값: false
  filterCount?: number;          // 기본값: 0
  placeholder?: string;          // 기본값: "검색어를 입력하세요..."
  showFilterButton?: boolean;    // 기본값: true
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 검색 입력 필드 |
| HeroUI Button | 필터 토글 버튼 |
| Search/Filter (Lucide) | 아이콘 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
