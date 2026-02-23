# AssetStatsBar Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetStatsBar/

## 역할

에셋 통계 정보를 시각화하여 표시하는 컴포넌트입니다. 전체 수, 종류별 수, 전체 용량을 표시합니다.

## 디자인 목업

```
[일반 모드]
┌─────────────────────────────────────────────────────────────────┐
│  [💾]            [🖼️]           [🎬]           [📄]           [💾]  │
│  150             80             30             40             500 MB │
│  전체            이미지          비디오          문서           전체 용량 │
└─────────────────────────────────────────────────────────────────┘

[컴팩트 모드]
┌─────────────────────────────────────────────────────────────────┐
│  💾 150   🖼️ 80   🎬 30   📄 40   💾 500 MB                    │
└─────────────────────────────────────────────────────────────────┘
```

## Props

```typescript
interface AssetStatsBarProps {
  stats: AssetStats;                           // 통계 데이터
  showItems?: ("total" | "image" | "video" | "document" | "size")[]; // 표시 항목
  compact?: boolean;                           // 컴팩트 모드
  className?: string;                          // 추가 클래스
}

interface AssetStats {
  totalCount: number;
  imageCount: number;
  videoCount: number;
  documentCount: number;
  totalSize: number;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| SizeDisplay | ui/data-display | 파일 크기 포맷팅 |
| HStack | ui/surfaces | 가로 레이아웃 |
| VStack | ui/surfaces | 세로 레이아웃 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 아이콘 및 색상

| 항목 | 아이콘 | 색상 | 배경 |
|------|--------|------|------|
| 전체 | HardDrive | text-default-500 | bg-default-100 |
| 이미지 | Image | text-primary | bg-primary/10 |
| 비디오 | Video | text-secondary | bg-secondary/10 |
| 문서 | FileText | text-default-500 | bg-default-100 |
| 용량 | HardDrive | text-success | bg-success/10 |

## 디자인 토큰

| 항목 | 값 (일반) | 값 (컴팩트) |
|------|-----------|-------------|
| 배경 | bg-content1 | bg-content2 |
| 테두리 | border-divider | 없음 |
| 라운드 | rounded-xl | rounded-lg |
| 패딩 | p-4 | p-3 |

## 구현 체크리스트

- [x] AssetStatsBar.tsx
- [x] index.ts (barrel export)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 상위 기획서

- `apps/admin/app/(admin)/assets/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-widget-builder |
