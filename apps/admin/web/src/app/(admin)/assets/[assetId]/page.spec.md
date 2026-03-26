# 에셋 상세 페이지 기획서

> 생성일: 2026-02-22
> 타입: page
> 경로: `/assets/[assetId]`
> 파일: `apps/admin/web/src/app/(admin)/assets/[assetId]/page.tsx`

## L3: 기능 (Feature)

### 목적

선택한 에셋의 상세 정보를 확인하고 관리합니다. 타입별 상세 정보(Image: width/height/exif, Video: duration/codec, Document: pageCount)를 표시합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 에셋 기본 정보 조회 | 파일명, 타입, 크기, MIME 타입, 업로드 상태 등 |
| F-002 | 타입별 상세 정보 | Image(width, height, exif), Video(duration, codec), Document(pageCount) |
| F-003 | 미리보기 | 이미지/비디오 미리보기, 문서 PDF 뷰어 |
| F-004 | 파생 리소스 확인 | 썸네일, 프리뷰, 트랜스코딩 목록 |
| F-005 | 메타데이터 편집 | 파일명 변경, 태그 추가 등 |
| F-006 | 폴더 이동 | 다른 폴더로 에셋 이동 |
| F-007 | 에셋 삭제 | 소프트 삭제 |

### 접근 권한

| Actor | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (FULL_ACCESS) | 가능 | 전체 Space 에셋 조회/관리 |
| ACT-002 (MANAGE) | 가능 | 현재 Space 에셋 조회/관리 |
| ACT-003 (VIEW) | 가능 | 조회만 가능 (수정/삭제 불가) |

## L4: 화면 구조 (Screen)

### 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← 에셋 목록                          [폴더 이동] [다운로드] [삭제]           │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│ │                                 │ │ 기본 정보                            │ │
│ │                                 │ │ ┌───────────────┬─────────────────┐ │ │
│ │          [미리보기]              │ │ │ 파일명        │ banner.jpg      │ │ │
│ │                                 │ │ │ MIME 타입     │ image/jpeg      │ │ │
│ │         (이미지/비디오/          │ │ │ 크기          │ 2.4 MB          │ │ │
│ │          문서 뷰어)              │ │ │ 상태          │ READY           │ │ │
│ │                                 │ │ │ 폴더          │ /이미지/배너    │ │ │
│ │                                 │ │ │ 등록일        │ 2024.02.22      │ │ │
│ │                                 │ │ └───────────────┴─────────────────┘ │ │
│ │                                 │ │                                     │ │
│ │                                 │ │ 이미지 정보                         │ │
│ │                                 │ │ ┌───────────────┬─────────────────┐ │ │
│ │                                 │ │ │ 해상도        │ 1920 x 1080     │ │ │
│ │                                 │ │ │ 색상 공간     │ sRGB            │ │ │
│ │                                 │ │ │ EXIF          │ [상세 보기]     │ │ │
│ └─────────────────────────────────┘ │ └───────────────┴─────────────────┘ │ │
│                                     │                                     │ │
│                                     │ 파생 리소스                          │ │
│                                     │ ┌───────────┬───────┬─────────────┐ │ │
│                                     │ │ 종류      │ 크기  │ 미리보기    │ │ │
│                                     │ ├───────────┼───────┼─────────────┤ │ │
│                                     │ │ 썸네일    │ 50KB  │ [보기]      │ │ │
│                                     │ │ 프리뷰    │ 200KB │ [보기]      │ │ │
│                                     │ └───────────┴───────┴─────────────┘ │ │
│                                     └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

[비디오 타입]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ...                                                                          │
│ │ 비디오 정보                         │ │
│ │ ┌───────────────┬─────────────────┐ │ │
│ │ │ 재생 시간     │ 00:02:30        │ │ │
│ │ │ 해상도        │ 1920 x 1080     │ │ │
│ │ │ 코덱          │ H.264           │ │ │
│ │ │ 비트레이트    │ 5000 kbps       │ │ │
│ │ │ 오디오        │ 있음            │ │ │
│ └───────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

[문서 타입]
┌─────────────────────────────────────────────────────────────────────────────┐
│ ...                                                                          │
│ │ 문서 정보                           │ │
│ │ ┌───────────────┬─────────────────┐ │ │
│ │ │ 페이지 수     │ 15              │ │ │
│ │ │ 시트 수       │ -               │ │ │
│ │ │ 슬라이드 수   │ -               │ │ │
│ │ │ 텍스트 추출   │ [다운로드]      │ │ │
│ └───────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 레이아웃

```
Page + PageTitleBar
└── PageSurface
    ├── SectionSurface
    │   └── Section(top = PageTitleBar level=2 "기본 정보")
    ├── SectionSurface
    │   └── Section(top = PageTitleBar level=2 "폴더 이동")
    └── SectionSurface
        └── Section(top = PageTitleBar level=2 "스토리지 정보")
```

## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 상세 본문 전체를 raised 레이어로 묶고 상태 분기(loading/notFound/ready)를 동일한 배경 위에서 유지 |
| SectionSurface 대상 | 기본 정보, 폴더 이동, 스토리지 정보 등 상세 블록 |
| SectionSurface padding | 기본 패딩 유지. 각 `Section` 본문이 카드형 블록으로 구분되어야 함 |
| 예외 | 없음. 상세 블록 제목은 `Section(top=PageTitleBar)`가 담당하지만 배경/elevation은 `SectionSurface`가 소유 |

### 컴포넌트 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
| 미리보기 | AssetPreview | `AssetPreview` Widget |
| 기본 정보 | AssetBasicInfo | `AssetBasicInfo` Widget |
| 타입별 정보 | AssetTypeInfo | `AssetTypeInfo` Widget |
| 파생 리소스 | DerivativeList | `DerivativeList` Widget |

### 타입별 상세 정보

| 타입 | 필드 |
|------|------|
| IMAGE | width, height, colorSpace, exif |
| VIDEO | durationMs, width, height, frameRate, codec, bitRateKbps, hasAudio |
| DOCUMENT | pageCount, sheetCount, slideCount, extractedTextKey |

## 사용자 시나리오

1. **에셋 상세 진입**: 에셋 목록에서 카드 클릭 시 상세 페이지 진입
2. **미리보기 확인**: 이미지/비디오는 인라인 미리보기, 문서는 PDF 뷰어
3. **타입별 정보 확인**: 이미지는 EXIF, 비디오는 코덱/재생시간, 문서는 페이지 수
4. **파생 리소스 확인**: 썸네일, 프리뷰 등 파생 리소스 목록 확인
5. **폴더 이동**: 다른 폴더로 에셋 이동
6. **다운로드**: 원본 파일 다운로드
7. **삭제**: 소프트 삭제

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| `loading` | 초기 로딩 중 | Skeleton |
| `notFound` | 에셋 없음 | NotFound 컴포넌트 |
| `ready` | 데이터 로드 완료 | 상세 정보 표시 |
| `deleted` | 삭제된 에셋 | "삭제된 에셋입니다" 메시지 |

## API 호출

| 시점 | API | 캐싱 |
|------|-----|------|
| 진입 | `GET /api/v1/assets/{assetId}` | React Query staleTime 30s |
| 폴더 이동 | `PATCH /api/v1/assets/{assetId}/move` | 캐시 무효화 |
| 삭제 | `DELETE /api/v1/assets/{assetId}` | 캐시 무효화 |

## 페이지 파일 구조 (Stage 4)

```text
apps/admin/web/src/app/(admin)/assets/[assetId]/
├── page.tsx          # 클라이언트 boundary (`dynamic(..., { ssr: false })`)
├── _client.tsx       # 브라우저 전용 상세 렌더링 (observer)
└── hooks/
    └── useAssetDetailPage.ts
```

### Browser-only 렌더링 특이사항

- 선택 Space 헤더가 브라우저 PersistStore에 의존하므로 상세 API 호출은 `_client.tsx`에서만 수행합니다.
- `page.tsx`는 `dynamic(..., { ssr: false })`로 서버 렌더 단계의 상대 URL/Space 헤더 누락 오류를 차단합니다.

### 클라이언트 핸들러 네이밍

- `onClickBackButton`
- `onClickMoveAssetButton`
- `onClickDeleteAssetButton`
- `onClickDownloadAssetButton`

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 뒤로가기 버튼 클릭 | `/assets`로 이동 |
| 폴더 이동 버튼 클릭 | 폴더 선택 모달 오픈 → API 호출 |
| 다운로드 버튼 클릭 | 원본 파일 다운로드 |
| 삭제 버튼 클릭 | 삭제 확인 다이얼로그 → API 호출 |
| 파생 리소스 보기 클릭 | 해당 파생 리소스 미리보기 모달 |

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useAssetDetailHandlers.ts
- [ ] AssetPreview Widget
- [ ] AssetBasicInfo Widget
- [ ] AssetTypeInfo Widget
- [ ] DerivativeList Widget
- [x] E2E 테스트 (Playwright)

## 테스트 케이스

> 구현 도구: Playwright (E2E)

### 테스트 커버리지

| 시나리오 | Happy Path | Error Path | Edge Case | 합계 |
|---------|:----------:|:----------:|:---------:|:----:|
| 에셋 상세 조회 | 1 | 1 | 1 | 3 |
| 타입별 정보 | 3 | 0 | 0 | 3 |
| 폴더 이동 | 1 | 1 | 0 | 2 |
| 에셋 삭제 | 1 | 1 | 0 | 2 |

### [TC-001] 에셋 상세 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 이미지 에셋이 존재하는 상태 |
| **When** | `/assets/{assetId}` 페이지 진입 |
| **Then** | 에셋 상세 정보와 미리보기가 표시됨 |

### [TC-002] 존재하지 않는 에셋

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 존재하지 않는 에셋 ID |
| **When** | `/assets/{nonExistentId}` 페이지 진입 |
| **Then** | NotFound 컴포넌트 표시 |

### [TC-003] 타입별 정보 - 이미지

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 이미지 타입 에셋 |
| **When** | 상세 페이지 진입 |
| **Then** | width, height, colorSpace, EXIF 정보 표시 |

### [TC-004] 타입별 정보 - 비디오

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 비디오 타입 에셋 |
| **When** | 상세 페이지 진입 |
| **Then** | duration, codec, bitRate, hasAudio 정보 표시 |

### [TC-005] 타입별 정보 - 문서

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 문서 타입 에셋 |
| **When** | 상세 페이지 진입 |
| **Then** | pageCount, sheetCount, slideCount 정보 표시 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`
- `apps/admin/web/src/app/(admin)/assets/page.spec.md`

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/assets/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/assets/[assetId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-15 | assets 상세 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시 | codex |
| 2026-03-15 | assets 상세를 no-SSR boundary로 전환해 server prefetch 단계의 URL/Space 헤더 오류를 제거 | codex |
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-26 | Stage 1 정합화: 경로 메타데이터를 apps/admin/web 기준으로 수정 | orch-requirement |
| 2026-02-26 | Stage 4 정합화: API 경로 및 SSR Prefetch 구조 보강 | orch-screen-planner |
| 2026-02-26 | Stage 6 구현: Orval 인터페이스 기반 상세 페이지(page/_client/_prefetch) 구현 | fe-page-builder |
| 2026-02-26 | Stage 7 구현: assets 상세 page.e2e.ts 추가 | qa-fe-e2e-testing |
| 2026-03-15 | 에셋 상세는 `Page + PageTitleBar` 구조를 유지하고 본문에 `PageSurface/SectionSurface` 표현 레이어를 적용 | codex |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
