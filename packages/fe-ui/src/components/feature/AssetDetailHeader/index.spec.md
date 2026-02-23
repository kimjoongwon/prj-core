# AssetDetailHeader Feature 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetDetailHeader/

## 역할

Asset 상세 페이지의 상단 헤더를 담당하는 Feature 컴포넌트입니다. 브레드크럼, 제목, 액션 버튼(수정/삭제)을 관리합니다.

## 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  에셋 > 2024 시즌 포스터 > hero-image.png                     [수정] [삭제]  │
│  에셋 상세 정보를 확인하고 관리합니다.                                       │
└─────────────────────────────────────────────────────────────────────────────┘

[삭제 확인 다이얼로그]
┌─────────────────────────────────────────────────┐
│ 에셋 삭제                              [X]       │
├─────────────────────────────────────────────────┤
│                                                 │
│ "hero-image.png" 에셋을 삭제하시겠습니까?        │
│                                                 │
│ 이 작업은 되돌릴 수 없습니다.                   │
│                                                 │
├─────────────────────────────────────────────────┤
│                        [취소]  [삭제]           │
└─────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `ready` | 데이터 로드 완료 | 브레드크럼 + 액션 버튼 |
| `deleting` | 삭제 처리 중 | 삭제 버튼 로딩 상태 |
| `confirmDelete` | 삭제 확인 | 다이얼로그 표시 |

## Props

```typescript
interface AssetDetailHeaderProps {
  asset: Asset;                                // 에셋 데이터
  breadcrumbItems: BreadcrumbItem[];           // 브레드크럼 아이템
  onEdit: () => void;                          // 수정 버튼 핸들러
  onDelete: () => void;                        // 삭제 버튼 핸들러
  onDownload?: () => void;                     // 다운로드 버튼 핸들러 (선택)
  isDeleting?: boolean;                        // 삭제 처리 중 상태
  className?: string;                          // 추가 클래스
}

interface BreadcrumbItem {
  label: string;                               // 표시 텍스트
  href?: string;                               // 이동 경로 (없으면 링크 아님)
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| HStack | `ui/surfaces/HStack` | 수평 레이아웃 |
| Button | `@heroui/react` | 수정/삭제 버튼 |
| Modal | `@heroui/react` | 삭제 확인 다이얼로그 |

## Store 연결

**없음** (Props로 전달받음)

## 이벤트

| 이벤트 | 설명 |
|--------|------|
| `onEdit` | 수정 버튼 클릭 시 호출 |
| `onDelete` | 삭제 버튼 클릭 시 호출 (확인 다이얼로그 표시 후) |
| `onDownload` | 다운로드 버튼 클릭 시 호출 (선택) |

## 브레드크럼 구성

```typescript
// 예시: 에셋 > 폴더명 > 파일명
const breadcrumbItems = [
  { label: '에셋', href: '/assets' },
  { label: '2024 시즌 포스터', href: '/assets?folderId=xxx' },
  { label: 'hero-image.png' },  // 현재 페이지 (링크 없음)
];
```

## 액션 버튼 구성

| 버튼 | variant | 색상 | 동작 |
|------|---------|------|------|
| 수정 | flat | primary | onEdit() |
| 삭제 | flat | danger | 확인 다이얼로그 → onDelete() |

## 삭제 확인 다이얼로그

| 항목 | 내용 |
|------|------|
| 제목 | 에셋 삭제 |
| 메시지 | `"{파일명}" 에셋을 삭제하시겠습니까?` |
| 경고 | 이 작업은 되돌릴 수 없습니다. |
| 취소 버튼 | 다이얼로그 닫기 |
| 삭제 버튼 | danger 색상, onDelete() 호출 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | bg-content1 |
| 패딩 | p-6 |
| 버튼 간격 | gap-2 |

## 구현 체크리스트

- [x] AssetDetailHeader.tsx
- [x] types.ts
- [x] index.ts
- [x] Breadcrumb 통합
- [x] 삭제 확인 다이얼로그
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 기본 렌더링 | 1 | 0 | 0 | 1 |
| 브레드크럼 | 1 | 0 | 0 | 1 |
| 수정 버튼 | 1 | 0 | 0 | 1 |
| 삭제 버튼 | 1 | 0 | 0 | 1 |
| 삭제 확인 | 2 | 0 | 0 | 2 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset, breadcrumbItems 전달됨 |
| **When** | AssetDetailHeader 렌더링 |
| **Then** | 브레드크럼, 파일명, 액션 버튼 표시 |

### [TC-002] 수정 버튼 클릭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetDetailHeader 렌더링됨 |
| **When** | [수정] 버튼 클릭 |
| **Then** | onEdit() 호출 |

### [TC-003] 삭제 버튼 클릭

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetDetailHeader 렌더링됨 |
| **When** | [삭제] 버튼 클릭 |
| **Then** | 삭제 확인 다이얼로그 표시 |

### [TC-004] 삭제 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 삭제 확인 다이얼로그 표시됨 |
| **When** | [삭제] 버튼 클릭 |
| **Then** | onDelete() 호출, 다이얼로그 닫힘 |

### [TC-005] 삭제 취소

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 삭제 확인 다이얼로그 표시됨 |
| **When** | [취소] 버튼 클릭 |
| **Then** | 다이얼로그 닫힘, onDelete() 호출 안 됨 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-feature-planner |
| 2026-02-23 | 구현 완료 | fe-feature-builder |
