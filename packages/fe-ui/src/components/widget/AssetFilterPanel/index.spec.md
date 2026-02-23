# AssetFilterPanel Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetFilterPanel/

## 역할

에셋 목록의 필터를 표시하는 컴포넌트입니다. 종류(kind)와 상태(status)로 필터링할 수 있습니다.

## 디자인 목업

```
[종류 ▼]  [상태 ▼]

[종류 선택]
┌──────────────┐
│ 전체         │
│ 이미지       │
│ 비디오       │
│ 문서         │
└──────────────┘

[상태 선택]
┌──────────────┐
│ 전체         │
│ 업로드중     │
│ 준비완료     │
│ 실패         │
└──────────────┘
```

## Props

```typescript
interface AssetFilterPanelProps {
  filters: AssetFilters;                       // 현재 필터 값
  onChange: (filters: AssetFilters) => void;   // 필터 변경 핸들러
  showKindFilter?: boolean;                    // 종류 필터 표시 여부
  showStatusFilter?: boolean;                  // 상태 필터 표시 여부
  className?: string;                          // 추가 클래스
}

interface AssetFilters {
  kind?: AssetKind | "all";
  status?: AssetStatus | "all";
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Select | HeroUI | 드롭다운 선택 |
| HStack | ui/surfaces | 가로 레이아웃 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 필터 옵션

### 종류(kind)

| 값 | 라벨 |
|------|------|
| all | 전체 |
| IMAGE | 이미지 |
| VIDEO | 비디오 |
| DOCUMENT | 문서 |

### 상태(status)

| 값 | 라벨 |
|------|------|
| all | 전체 |
| UPLOADING | 업로드중 |
| READY | 준비완료 |
| FAILED | 실패 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 너비 | 128px (각 Select) |
| 크기 | sm |
| 배경 | bg-content2 |

## 구현 체크리스트

- [x] AssetFilterPanel.tsx
- [x] index.ts (barrel export)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 상위 기획서

- `apps/admin/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-widget-builder |
