# AssetGridPanel Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetGridPanel/

## 역할

에셋 목록을 그리드 또는 리스트 형태로 표시하는 컴포넌트입니다. 뷰 모드 전환을 지원합니다.

## 디자인 목업

```
[그리드 뷰]
                          [☰ 그리드] [≡ 리스트]
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ [썸네일] │ │ [썸네일] │ │ [썸네일] │ │ [썸네일] │
│         │ │         │ │         │ │         │
│         │ │         │ │         │ │         │
├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤
│ file.jpg │ │ file2.jpg│ │ file3.jpg│ │ file4.jpg│
│ [이미지] │ │ [비디오] │ │ [문서]   │ │ [이미지] │
└─────────┘ └─────────┘ └─────────┘ └─────────┘

[리스트 뷰]
                          [☰ 그리드] [≡ 리스트]
┌───────────────────────────────────────────────────┐
│ ☐ [썸네일]  file.jpg      [이미지]    2.4 MB     │
├───────────────────────────────────────────────────┤
│ ☐ [썸네일]  file2.mp4     [비디오]    45 MB      │
├───────────────────────────────────────────────────┤
│ ☐ [썸네일]  file3.pdf     [문서]      1.2 MB     │
└───────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Spinner 표시 |
| `empty` | 데이터 없음 | 빈 상태 메시지 |
| `grid` | 그리드 뷰 | 4열 카드 배치 |
| `list` | 리스트 뷰 | 1열 행 배치 |

## Props

```typescript
interface AssetGridPanelProps {
  assets: AssetCardItem[];                     // 에셋 목록
  viewMode?: "grid" | "list";                  // 뷰 모드
  selectedIds?: Set<string>;                   // 선택된 에셋 ID Set
  onSelect?: (assetId: string, selected: boolean) => void; // 선택 핸들러
  onClick?: (asset: AssetCardItem) => void;    // 클릭 핸들러
  onViewModeChange?: (mode: "grid" | "list") => void; // 뷰 모드 변경 핸들러
  isLoading?: boolean;                         // 로딩 상태
  emptyMessage?: string;                       // 빈 상태 메시지
  columns?: number;                            // 그리드 컬럼 수
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| AssetCard | widget/AssetCard | 에셋 카드 |
| Button | HeroUI | 뷰 모드 토글 버튼 |
| Spinner | HeroUI | 로딩 스피너 |
| HStack | ui/surfaces | 가로 레이아웃 |
| VStack | ui/surfaces | 세로 레이아웃 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 그리드 컬럼 | 4열 (기본) |
| 카드 간격 | gap-4 |
| 리스트 간격 | gap-2 |

## 구현 체크리스트

- [x] AssetGridPanel.tsx
- [x] index.ts (barrel export)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 상위 기획서

- `apps/admin/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-widget-builder |
