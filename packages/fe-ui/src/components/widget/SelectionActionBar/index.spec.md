# SelectionActionBar Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SelectionActionBar/

## 역할

다중 선택 시 하단에 표시되는 액션 바입니다. 일괄 작업(삭제, 이동 등)을 수행할 수 있습니다.

## 디자인 목업

```
[선택됨]
┌─────────────────────────────────────────────────────────────────┐
│  5개 선택됨  ✕  │  [📁 이동]  [🗑️ 삭제]                        │
└─────────────────────────────────────────────────────────────────┘

[커스텀 액션 추가]
┌─────────────────────────────────────────────────────────────────┐
│  3개 선택됨  ✕  │  [📁 이동]  [📥 다운로드]  [🗑️ 삭제]          │
└─────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `hidden` | 선택 없음 | 표시되지 않음 |
| `visible` | 선택 있음 | 화면 하단 중앙에 표시 |

## Props

```typescript
interface SelectionActionBarProps {
  selectedCount: number;                       // 선택된 항목 수
  onDelete?: () => void;                       // 삭제 핸들러
  onMove?: () => void;                         // 이동 핸들러
  onClear: () => void;                         // 선택 해제 핸들러
  customActions?: ReactNode;                   // 커스텀 액션 버튼
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Button | HeroUI | 액션 버튼 |
| HStack | ui/surfaces | 가로 레이아웃 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 기본 액션

| 액션 | 아이콘 | 색상 | 표시 조건 |
|------|--------|------|-----------|
| 이동 | FolderInput | default | onMove 전달 시 |
| 삭제 | Trash2 | danger | onDelete 전달 시 |
| 선택 해제 | X | light | 항상 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 위치 | fixed bottom-6 |
| 정렬 | left-1/2 -translate-x-1/2 |
| 배경 | bg-content1 |
| 테두리 | border-divider |
| 라운드 | rounded-xl |
| 그림자 | shadow-lg |
| z-index | z-50 |

## 구현 체크리스트

- [x] SelectionActionBar.tsx
- [x] index.ts (barrel export)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 상위 기획서

- `apps/admin/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-widget-builder |
