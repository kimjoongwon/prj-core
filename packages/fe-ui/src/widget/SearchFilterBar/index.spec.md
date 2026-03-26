# SearchFilterBar Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/SearchFilterBar/

## 역할

검색창과 필터 토글 버튼을 조합한 검색/필터 바입니다. Enter 키로 검색 실행, 필터 버튼에 적용된 필터 수 배지를 표시합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 상태 - 필터 없음]
┌───────────────────────────────────────┬───────────────┐
│ 🔍  검색어를 입력하세요...              │  ☰  필터      │
└───────────────────────────────────────┴───────────────┘

[필터 적용됨 (filterCount=3)]
┌───────────────────────────────────────┬───────────────┐
│ 🔍  검색어를 입력하세요...              │ ☰ 필터  [3]  │
└───────────────────────────────────────┴───────────────┘

[필터 패널 열림 (isFilterOpen=true)]
┌───────────────────────────────────────┬───────────────┐
│ 🔍  검색어를 입력하세요...              │ ☰ 필터  [3]  │
└───────────────────────────────────────┴───────────────┘
  ▼ 필터 패널 (외부 컴포넌트로 렌더링됨)

[필터 버튼 숨김 (showFilterButton=false)]
┌──────────────────────────────────────────────────────┐
│ 🔍  검색어를 입력하세요...                              │
└──────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 검색창 + 필터 버튼 (배지 없음) |
| 필터 적용 (filterCount > 0) | 필터 버튼 오른쪽에 숫자 배지 표시 |
| 필터 열림 (isFilterOpen=true) | 필터 버튼 활성화 색상으로 강조 |
| 필터 없음 (showFilterButton=false) | 검색창만 전체 너비로 표시 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
