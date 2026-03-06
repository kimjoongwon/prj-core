# FilterPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/FilterPanel/

## 역할

그룹 체크박스, 옵션 체크박스, 검색을 조합한 필터 UI를 제공합니다. 필터 상태 관리와 초기화 기능을 포함합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
전체 구조
┌──────────────────────────────┐
│  🔍 검색...                  │  ← showSearch: true
├──────────────────────────────┤
│  그룹 선택                   │  ← groupsTitle
│  ☑ 그룹A                    │
│  ☑ 그룹B                    │
│  ☐ 그룹C                    │
├──────────────────────────────┤
│  옵션 선택                   │  ← optionsTitle
│  ☑ 옵션1                    │
│  ☐ 옵션2                    │
│  ☐ 옵션3                    │
├──────────────────────────────┤
│  [children 슬롯]             │
├──────────────────────────────┤
│  [필터 초기화]               │  ← resetLabel 버튼
└──────────────────────────────┘

검색 숨김 (showSearch: false)
┌──────────────────────────────┐
│  그룹 선택                   │
│  ☑ 그룹A                    │
│  ☐ 그룹B                    │
├──────────────────────────────┤
│  옵션 선택                   │
│  ☐ 옵션1                    │
├──────────────────────────────┤
│  [필터 초기화]               │
└──────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (검색 포함) | 검색창 + 그룹 체크박스 + 옵션 체크박스 + 초기화 |
| 검색 숨김 | 그룹 체크박스 + 옵션 체크박스 + 초기화 |
| 그룹만 | 그룹 체크박스만 표시 (options 미전달) |
| 옵션만 | 옵션 체크박스만 표시 (groups 미전달) |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
