# AssetDetailPanel Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetDetailPanel/

## 역할

에셋의 기본 메타데이터를 테이블 형태로 표시하는 컴포넌트입니다. 파일명, 타입, MIME, 크기, 상태 등 핵심 정보를 제공합니다.

## 디자인 목업

```
┌─────────────────────────────────────┐
│ 기본 정보                            │
├─────────────────────────────────────┤
│ 파일명       hero-image.png         │
│ 타입         IMAGE                  │
│ MIME         image/png              │
│ 크기         2.4 MB                 │
│ 상태         준비                   │
│ 생성일       2024.02.22 14:30       │
│ 수정일       2024.02.23 09:15       │
│ 생성자       홍길동                 │
└─────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Skeleton 행 표시 |
| `ready` | 데이터 존재 | 실제 데이터 표시 |
| `compact` | 간소화 모드 | 생성자/수정일 생략 |

## Props

```typescript
interface AssetDetailPanelProps {
  asset: Asset;                           // 에셋 데이터
  showTimestamp?: boolean;                // 생성일/수정일 표시 (기본값: true)
  showCreator?: boolean;                  // 생성자 표시 (기본값: true)
  compact?: boolean;                      // 간소화 모드
  className?: string;                     // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 패널 컨테이너 |
| Badge | `ui/Badge` | 상태/타입 뱃지 |
| Avatar | `ui/Avatar` | 생성자 아바타 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `header` | 헤더 영역 커스터마이징 |
| `footer` | 하단 영역 커스터마이징 |
| `row:{key}` | 특정 행 커스터마이징 |

## 데이터 매핑

| 필드 | 라벨 | 포맷 |
|------|------|------|
| originalName | 파일명 | 그대로 표시 |
| kind | 타입 | IMAGE/VIDEO/DOCUMENT 한글 변환 |
| mimeType | MIME | 그대로 표시 |
| sizeBytes | 크기 | bytes → KB/MB/GB 변환 |
| status | 상태 | UPLOADING/READY/FAILED 한글 변환 |
| createdAt | 생성일 | YYYY.MM.DD HH:mm |
| updatedAt | 수정일 | YYYY.MM.DD HH:mm |
| creator?.name | 생성자 | 이름 표시 |

## 상태/타입 표시 매핑

| status | 라벨 | 색상 |
|--------|------|------|
| UPLOADING | 업로드 중 | warning |
| READY | 준비 | success |
| FAILED | 실패 | danger |

| kind | 라벨 | 색상 |
|------|------|------|
| IMAGE | 이미지 | primary |
| VIDEO | 비디오 | secondary |
| DOCUMENT | 문서 | default |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 40px |
| 라벨 너비 | 100px |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |
| 라벨 색상 | text-default-500 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] 포맷팅 유틸리티 (formatBytes, formatDate)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 기본 렌더링 | 1 | 0 | 0 | 1 |
| 상태 뱃지 | 3 | 0 | 0 | 3 |
| 타입 뱃지 | 3 | 0 | 0 | 3 |
| 크기 포맷팅 | 3 | 0 | 0 | 3 |
| 간소화 모드 | 1 | 0 | 0 | 1 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset 데이터 전달됨 |
| **When** | AssetDetailPanel 렌더링 |
| **Then** | 모든 필드가 올바르게 표시됨 |

### [TC-002] 상태 뱃지 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | status=READY |
| **When** | AssetDetailPanel 렌더링 |
| **Then** | "준비" 뱃지가 success 색상으로 표시 |

### [TC-003] 크기 포맷팅

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sizeBytes=2621440 (2.5MB) |
| **When** | AssetDetailPanel 렌더링 |
| **Then** | "2.5 MB"로 표시 |

### [TC-004] 간소화 모드

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | compact=true |
| **When** | AssetDetailPanel 렌더링 |
| **Then** | 생성자/수정일 생략됨 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-widget-planner |
