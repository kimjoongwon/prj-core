# DerivativeList Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/DerivativeList/

## 역할

에셋의 파생 리소스(썸네일, 프리뷰, 트랜스코딩) 목록을 표시하는 컴포넌트입니다. 각 파생 리소스의 종류, 크기, 미리보기를 제공합니다.

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────┐
│ 파생 리소스                                                      │
├─────────────────────────────────────────────────────────────────┤
│ 종류         │ 프로필    │ 크기      │ 해상도    │ 미리보기    │
├──────────────┼──────────┼──────────┼──────────┼────────────┤
│ 썸네일       │ default  │ 50 KB    │ 200x200  │ [보기]     │
│ 프리뷰       │ default  │ 200 KB   │ 800x600  │ [보기]     │
│ 트랜스코딩   │ 720p     │ 45 MB    │ 1280x720 │ [보기]     │
│ 트랜스코딩   │ 480p     │ 20 MB    │ 854x480  │ [보기]     │
│ 텍스트       │ ocr      │ 12 KB    │ -        │ [다운로드] │
└─────────────────────────────────────────────────────────────────┘

[미리보기 모달]
┌─────────────────────────────────────────────────┐
│ 썸네일 (200x200)                      [X]       │
├─────────────────────────────────────────────────┤
│                                                 │
│              [썸네일 이미지 표시]               │
│                                                 │
│                                                 │
├─────────────────────────────────────────────────┤
│ 크기: 50 KB  │  생성일: 2024.02.22 14:31        │
└─────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Skeleton 행 표시 |
| `empty` | 파생 리소스 없음 | "파생 리소스가 없습니다" 메시지 |
| `hasData` | 데이터 존재 | 테이블 행 표시 |

## Props

```typescript
interface DerivativeListProps {
  derivatives: Derivative[];                   // 파생 리소스 목록
  isLoading?: boolean;                         // 로딩 상태
  showPreview?: boolean;                       // 미리보기 버튼 표시
  showDownload?: boolean;                      // 다운로드 버튼 표시
  onPreview?: (derivative: Derivative) => void; // 미리보기 핸들러
  onDownload?: (derivative: Derivative) => void; // 다운로드 핸들러
  emptyMessage?: string;                       // 빈 상태 메시지
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Table | `ui/Table` | 테이블 |
| Badge | `ui/Badge` | 종류 뱃지 |
| Button | `ui/Button` | 미리보기/다운로드 버튼 |
| Modal | `ui/Modal` | 미리보기 모달 |
| EmptyState | `ui/EmptyState` | 빈 상태 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `header` | 헤더 영역 커스터마이징 |
| `rowActions` | 행 액션 버튼 커스터마이징 |
| `empty` | 빈 상태 커스터마이징 |

## 파생 리소스 종류 표시

| kind | 라벨 | 색상 |
|------|------|------|
| THUMBNAIL | 썸네일 | primary |
| PREVIEW | 프리뷰 | secondary |
| TRANSCODE | 트랜스코딩 | success |
| TEXT | 텍스트 | warning |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 48px |
| 라운드 | rounded-lg |
| 배경 | bg-content1 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] DerivativePreviewModal 서브컴포넌트
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 목록 렌더링 | 1 | 0 | 0 | 1 |
| 종류별 표시 | 4 | 0 | 0 | 4 |
| 미리보기 | 1 | 0 | 0 | 1 |
| 다운로드 | 1 | 0 | 0 | 1 |
| 빈 상태 | 1 | 0 | 0 | 1 |

### [TC-001] 목록 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | derivatives 배열에 3개 항목 |
| **When** | DerivativeList 렌더링 |
| **Then** | 3개의 행이 표시됨 |

### [TC-002] 종류별 뱃지 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | THUMBNAIL, PREVIEW, TRANSCODE, TEXT 타입 존재 |
| **When** | DerivativeList 렌더링 |
| **Then** | 각 종류에 맞는 라벨과 색상으로 뱃지 표시 |

### [TC-003] 미리보기 버튼 클릭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | onPreview 핸들러 전달됨 |
| **When** | [보기] 버튼 클릭 |
| **Then** | onPreview(derivative) 호출 |

### [TC-004] 빈 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | derivatives 배열이 비어있음 |
| **When** | DerivativeList 렌더링 |
| **Then** | EmptyState 표시 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화 | orch-screen-planner |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
