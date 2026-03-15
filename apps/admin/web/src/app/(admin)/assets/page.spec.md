# 에셋 목록 페이지 기획서

> 생성일: 2026-02-22
> 타입: page
> 경로: `/assets`
> 파일: `apps/admin/web/src/app/(admin)/assets/page.tsx`

## L3: 기능 (Feature)

### 목적

업로드된 에셋(Image/Video/Document)을 폴더 기반으로 탐색하고 목록으로 관리합니다. 에셋 선택기(Picker) 모드를 지원하여 다른 리소스에서 재사용 가능합니다.

### 주요 기능

| ID    | 기능                | 설명                                                |
| ----- | ------------------- | --------------------------------------------------- |
| F-001 | 에셋 목록 조회      | 폴더 트리 + 그리드/테이블 뷰로 표시                 |
| F-002 | 폴더 탐색           | 좌측 폴더 트리에서 폴더 선택 시 해당 폴더 에셋 표시 |
| F-003 | 에셋 검색           | 파일명, MIME 타입 키워드 검색                       |
| F-004 | 타입 필터링         | IMAGE/VIDEO/DOCUMENT 타입 필터                      |
| F-005 | 에셋 업로드         | 드래그앤드롭 또는 파일 선택으로 업로드              |
| F-006 | 에셋 미리보기       | 클릭 시 미리보기 모달 표시                          |
| F-007 | 에셋 삭제           | 단일/일괄 삭제 (소프트 삭제)                        |
| F-008 | 폴더 생성/수정/삭제 | 폴더 관리 (목록 페이지 내에서 수행)                 |
| F-009 | 에셋 선택기 모드    | 다른 리소스에 에셋 연결 시 재사용 (단일/다중 선택)  |

### 접근 권한

| Actor                 | 접근 가능 여부 | 비고                           |
| --------------------- | -------------- | ------------------------------ |
| ACT-001 (FULL_ACCESS) | 가능           | 전체 Space 에셋 조회/관리      |
| ACT-002 (MANAGE)      | 가능           | 현재 Space 에셋 조회/관리      |
| ACT-003 (VIEW)        | 가능           | 조회만 가능 (업로드/삭제 불가) |

### 에셋 선택기(Picker) 모드

| 속성            | 설명                            |
| --------------- | ------------------------------- |
| `mode`          | `"manage"` (기본) / `"picker"`  |
| `selectionMode` | `"single"` / `"multiple"`       |
| `allowedTypes`  | `AssetKind[]` (예: `["IMAGE"]`) |
| `onSelect`      | `(assets: Asset[]) => void`     |
| `onClose`       | `() => void`                    |

## L4: 화면 구조 (Screen)

### 디자인 목업

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋                                    [📤 업로드] [📁 폴더 생성]           │
│ 미디어 리소스를 관리합니다.                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ 📁 폴더          │ │ 🔍 검색...                    [전체▼] [그리드|리스트] ││
│ │                  │ ├─────────────────────────────────────────────────────┤│
│ │ 📂 루트          │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  ││
│ │   📂 이미지      │ │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │  ││
│ │   📂 비디오      │ │ │ image │ │ photo │ │ video │ │ doc   │ │ logo  │  ││
│ │   📂 문서        │ │ │ .jpg  │ │ .png  │ │ .mp4  │ │ .pdf  │ │ .svg  │  ││
│ │   📂 보관함      │ │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  ││
│ │                  │ │                                                     ││
│ │                  │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐  ││
│ │                  │ │ │ [IMG] │ │ [IMG] │ │ [VID] │ │ [DOC] │ │ [IMG] │  ││
│ │                  │ │ │ banner│ │ icon  │ │ promo │ │ guide │ │ hero  │  ││
│ │                  │ │ │ .webp │ │ .png  │ │ .mov  │ │ .xlsx │ │ .jpg  │  ││
│ │                  │ │ └───────┘ └───────┘ └───────┘ └───────┘ └───────┘  ││
│ │                  │ │                                                     ││
│ │                  │ │                    < 1  2  3  >                     ││
│ └──────────────────┘ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘

[Picker 모드]
┌─────────────────────────────────────────────────────────────────────────────┐
│ 에셋 선택                                            [취소] [선택 완료]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────────────────────┐│
│ │ 📁 폴더          │ │ 🔍 검색...                              [이미지만] ││
│ │    ...           │ ├─────────────────────────────────────────────────────┤│
│ │                  │ │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐            ││
│ │                  │ │ │ ✓     │ │       │ │ ✓     │ │       │            ││
│ │                  │ │ │ [IMG] │ │ [IMG] │ │ [IMG] │ │ [IMG] │            ││
│ │                  │ │ │ photo │ │ icon  │ │ banner│ │ logo  │            ││
│ │                  │ │ └───────┘ └───────┘ └───────┘ └───────┘            ││
│ │                  │ │                                                     ││
│ └──────────────────┘ └─────────────────────────────────────────────────────┘│
│ 선택됨: 2개                                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 레이아웃

```
Page + PageTitleBar
└── PageSurface
    └── SectionSurface
        ├── FolderTree (좌측 사이드바, 240px)
        │   └── TreeView (계층적 폴더 구조)
        └── AssetBrowser (우측 메인)
            ├── Toolbar
            │   ├── SearchInput
            │   ├── TypeFilter (Dropdown)
            │   └── ViewToggle (Grid/List)
            └── AssetGrid / AssetList
                └── AssetCard / AssetRow
```

## Surface / Elevation

| 항목                   | 결정                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| PageSurface owner      | `apps/admin/web/src/app/(admin)/assets/_client.tsx`                                         |
| PageSurface 역할       | 좌측 폴더 트리와 우측 목록 영역을 하나의 raised 본문으로 묶음                               |
| SectionSurface 대상    | 폴더 탐색 + 에셋 목록 브라우저 본문                                                         |
| SectionSurface padding | `padding="none"`으로 `MetaDataGrid` 헤더/본문을 surface에 직접 밀착                         |
| 예외                   | 없음. 검색/필터/액션이 슬롯에 배치되더라도 surface는 자동 생성되지 않으므로 호출부에서 명시 |

### 컴포넌트 구성

| 영역      | 컴포넌트      | 기획서                     |
| --------- | ------------- | -------------------------- |
| 좌측      | FolderTree    | `FolderTree` Widget        |
| 우측 상단 | Toolbar       | Search, Filter, ViewToggle |
| 우측 메인 | AssetGrid     | `AssetBrowser` Feature     |
| 개별 카드 | AssetCard     | `AssetCard` Widget         |
| 미리보기  | PreviewModal  | `PreviewModal` Widget      |
| 업로드    | AssetUploader | `AssetUploader` Feature    |

### AssetGrid 아이템 정보

| 항목          | 설명                                                 |
| ------------- | ---------------------------------------------------- |
| 썸네일        | Derivative(THUMBNAIL) 이미지 또는 타입별 기본 아이콘 |
| 파일명        | originalName                                         |
| 타입 뱃지     | IMAGE/VIDEO/DOCUMENT                                 |
| 크기          | sizeBytes (사람이 읽기 쉬운 형태)                    |
| 선택 체크박스 | Picker 모드에서만 표시                               |

## 사용자 시나리오

1. **에셋 탐색**: 좌측 폴더 트리에서 폴더를 선택하여 해당 폴더의 에셋을 확인한다
2. **에셋 검색**: 검색어를 입력하여 파일명으로 에셋을 찾는다
3. **타입 필터링**: IMAGE/VIDEO/DOCUMENT 버튼으로 타입별 필터링한다
4. **에셋 업로드**: 드래그앤드롭 또는 업로드 버튼으로 새 에셋을 업로드한다
5. **에셋 미리보기**: 에셋 카드를 클릭하여 미리보기 모달을 연다
6. **에셋 삭제**: 선택 후 삭제 버튼으로 소프트 삭제한다
7. **폴더 생성**: "폴더 생성" 버튼으로 새 폴더를 만든다
8. **Picker 모드**: 다른 리소스에서 호출 시 에셋을 선택하여 반환한다

## 페이지 상태

| 상태               | 설명                          | UI                                                       |
| ------------------ | ----------------------------- | -------------------------------------------------------- |
| `loading`          | suspense 응답 대기            | `Suspense` fallback에서 `MetaDataGrid` 로딩 상태         |
| `spaceLoading`     | PersistStore가 hydrate되기 전 | `MetaDataGrid` 스켈레톤 (Space 선택 전에 API 호출 지연)  |
| `spaceNotSelected` | Space 미선택 상태             | EmptyState("Space를 선택하면 에셋을 조회할 수 있습니다") |
| `empty`            | 폴더에 에셋 없음              | EmptyState ("업로드된 에셋이 없습니다")                  |
| `hasData`          | 에셋 존재                     | AssetGrid/AssetList                                      |
| `uploading`        | 업로드 진행 중                | Progress 표시                                            |
| `picker`           | Picker 모드                   | 선택 UI 활성화                                           |

## API 호출

| 시점      | API                                                                    | 캐싱                                            |
| --------- | ---------------------------------------------------------------------- | ----------------------------------------------- |
| 진입      | `useGetAssetsSuspense({ take, skip, search, kind, status, folderId })` | React Query 캐시 사용                           |
| 진입      | `useGetFoldersSuspense()`                                              | React Query 캐시 사용                           |
| 폴더 생성 | `POST /api/v1/folders` (`useCreateFolder`)                             | 성공 시 폴더 query cache 무효화 후 새 폴더 선택 |
| 업로드    | `POST /api/v1/assets` (`useUploadAsset`)                               | 성공 시 assets query cache 무효화               |
| 삭제      | `DELETE /api/v1/assets/{id}`                                           | 캐시 무효화                                     |
| 폴더 수정 | `PATCH /api/v1/folders/{folderId}` (`useUpdateFolder`)                 | 성공 시 folders query cache 무효화              |
| 폴더 삭제 | `DELETE /api/v1/folders/{folderId}` (`useRemoveFolder`)                | 성공 시 folders query cache 무효화 후 상위 선택 |

## 페이지 파일 구조 (Stage 4)

```text
apps/admin/web/src/app/(admin)/assets/
├── page.tsx          # 클라이언트 boundary (`dynamic(..., { ssr: false })`)
├── _client.tsx       # 브라우저 전용 목록 렌더링 (`Suspense` + assets suspense hooks)
└── page.e2e.ts
```

### Browser-only 렌더링 특이사항

- Swagger에 assets/folders 엔드포인트가 아직 노출되지 않아 `@cocrepo/api/assets`는 수동 client surface를 유지합니다.
- 수동 client에도 generated client와 같은 `useGetAssetsSuspense`, `useGetFoldersSuspense` 표면을 제공합니다.
- 선택 Space 헤더가 브라우저 PersistStore에 의존하므로 실제 데이터 호출은 `_client.tsx`에서만 수행합니다.
- `page.tsx`는 `dynamic(..., { ssr: false })`로 서버 렌더 단계의 `Invalid URL` 오류를 차단합니다.
- PersistStore hydrate 완료 + Space 선택 여부가 확인될 때까지 API 호출을 지연하고, 미선택 시 EmptyState로 안내합니다.

### 클라이언트 핸들러 네이밍

- `onClickUploadButton`
- `onChangeSearchKeyword`
- `onClickAssetCard`
- `onClickDeleteAssetsButton`
- `onClickCompletePickerButton`

## 이벤트 핸들러

| 이벤트                       | 동작                                              |
| ---------------------------- | ------------------------------------------------- |
| 폴더 트리 노드 클릭          | 해당 폴더의 에셋 목록 로드                        |
| 폴더 생성 버튼 클릭          | 현재 선택 폴더를 부모로 하는 폴더 생성 modal 오픈 |
| 폴더 생성 modal 확인         | `POST /api/v1/folders` 호출 후 생성된 폴더 선택   |
| 폴더 이름 변경 버튼 클릭     | 현재 선택 폴더 기준 이름 변경 modal 오픈          |
| 폴더 삭제 버튼 클릭          | 현재 선택 폴더 기준 삭제 확인 modal 오픈          |
| 검색어 입력 (디바운스 300ms) | 검색 API 호출                                     |
| 타입 필터 선택               | 해당 타입만 필터링                                |
| 뷰 토글 클릭                 | 그리드/리스트 뷰 전환                             |
| 업로드 버튼 클릭             | 선택 폴더가 있을 때 파일 선택 다이얼로그 오픈     |
| 파일 드래그앤드롭            | 업로드 프로세스 시작                              |
| 에셋 카드 클릭               | 미리보기 모달 오픈                                |
| 에셋 삭제 버튼 클릭          | 삭제 확인 다이얼로그 → API 호출                   |
| Picker 모드 선택 완료        | 선택된 에셋 반환 및 모달 닫기                     |

## 구현 체크리스트

- [x] page.tsx (브라우저 전용 렌더 boundary)
- [x] \_client.tsx (클라이언트 컴포넌트, `Suspense` + assets suspense hooks)
- [x] `_prefetch.ts` 없음 (SSR 예외 아님)
- [ ] hooks/useAssetHandlers.ts
- [x] FolderTree Widget
- [x] FolderTree 기반 폴더 생성 modal 연결
- [x] FolderTree 기반 폴더 이름 변경/삭제 modal 연결
- [x] 선택 폴더 기준 에셋 업로드 버튼 연결
- [ ] AssetCard Widget
- [ ] AssetGrid Widget
- [ ] AssetBrowser Feature
- [ ] AssetUploader Feature
- [ ] PreviewModal Widget
- [ ] AssetPicker Feature (재사용 컴포넌트)
- [x] E2E 테스트 (Playwright)
- [x] PersistStore hydrate + Space 선택 여부 확인 후 데이터 요청 게이트 (Space 미선택 시 EmptyState)

## 테스트 케이스

> 구현 도구: Playwright (E2E)

### 테스트 커버리지

| 시나리오       | Happy Path | Error Path | Edge Case | 합계 |
| -------------- | :--------: | :--------: | :-------: | :--: |
| 에셋 목록 조회 |     1      |     1      |     1     |  3   |
| 폴더 탐색      |     1      |     0      |     1     |  2   |
| 에셋 검색      |     1      |     0      |     1     |  2   |
| 에셋 업로드    |     1      |     1      |     1     |  3   |
| 에셋 삭제      |     1      |     1      |     0     |  2   |
| Picker 모드    |     1      |     0      |     1     |  2   |

### [TC-001] 에셋 목록 조회

**분류:** Happy Path

| 구분      | 내용                  |
| --------- | --------------------- |
| **Given** | 에셋이 존재하는 상태  |
| **When**  | `/assets` 페이지 진입 |
| **Then**  | 에셋 그리드가 표시됨  |

### [TC-002] 폴더 탐색

**분류:** Happy Path

| 구분      | 내용                         |
| --------- | ---------------------------- |
| **Given** | 하위 폴더가 존재하는 상태    |
| **When**  | 폴더 트리에서 하위 폴더 클릭 |
| **Then**  | 해당 폴더의 에셋 목록 표시   |

### [TC-003] Picker 모드 단일 선택

**분류:** Happy Path

| 구분      | 내용                                          |
| --------- | --------------------------------------------- |
| **Given** | Picker 모드로 진입 (`selectionMode="single"`) |
| **When**  | 에셋 카드 클릭 후 선택 완료                   |
| **Then**  | 선택된 1개 에셋이 `onSelect`로 전달됨         |

### [TC-004] Picker 모드 다중 선택

**분류:** Happy Path

| 구분      | 내용                                            |
| --------- | ----------------------------------------------- |
| **Given** | Picker 모드로 진입 (`selectionMode="multiple"`) |
| **When**  | 여러 에셋 선택 후 선택 완료                     |
| **Then**  | 선택된 모든 에셋이 `onSelect`로 전달됨          |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 의존성

| 모듈                  | 용도                                                |
| --------------------- | --------------------------------------------------- |
| @cocrepo/api/assets   | assets manual suspense hook과 mutation surface 사용 |
| @tanstack/react-query | query invalidation 사용                             |

## 변경 이력

| 일자       | 내용                                                                                                                                  | 작성자              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 2026-03-15 | Stage 3/6 남은 범위를 마감하며 `/assets` 안에 폴더 이름 변경/삭제 modal과 선택 폴더 기준 에셋 업로드 흐름을 연결                      | codex               |
| 2026-03-15 | Stage 3/6 최소 재개로 `/assets` 안에서 현재 선택 폴더 기준 새 폴더를 생성하는 modal 흐름을 추가                                       | codex               |
| 2026-03-15 | assets 목록 spec에 `PageSurface`/`SectionSurface` ownership과 elevation 결정을 명시                                                   | codex               |
| 2026-03-15 | Stage 5/6 최소 재개로 assets 목록에 좌측 `FolderTree` 사이드바를 연결하고 폴더 선택을 `folderId` querystring 상태로 유지              | codex               |
| 2026-03-15 | PersistStore hydrate 상태/Space 선택을 확인하여 API 호출을 지연하고 미선택 시 EmptyState로 안내, 테스트에서 X-Space-ID 헤더 검증 추가 | codex               |
| 2026-03-15 | `x-space-id` 브라우저 의존성을 반영해 `page.tsx`를 no-SSR boundary로 분리하고 `_client.tsx`를 복구                                    | codex               |
| 2026-03-15 | assets 목록을 CSR + Suspense 단일 `page.tsx` 패턴으로 전환하고 `_client.tsx`, `_prefetch.ts`를 제거                                   | codex               |
| 2026-03-13 | `@cocrepo/api` root import를 split subpath import로 전환                                                                              | codex               |
| 2026-02-22 | 초기 생성                                                                                                                             | orch-requirement    |
| 2026-02-26 | Stage 1 정합화: 경로 메타데이터를 apps/admin/web 기준으로 수정                                                                        | orch-requirement    |
| 2026-02-26 | Stage 4 정합화: SSR Prefetch 구조와 핸들러 네이밍 규칙 보강                                                                           | orch-screen-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화                                                                          | orch-screen-planner |
| 2026-02-26 | Stage 6 구현: Orval 인터페이스 기반 목록 페이지(page/\_client/\_prefetch) 구현                                                        | fe-page-builder     |
| 2026-02-26 | Stage 7 구현: assets 목록 page.e2e.ts 추가                                                                                            | qa-fe-e2e-testing   |
| 2026-03-15 | 에셋 목록 페이지는 `Page + PageTitleBar` 구조를 유지하고 본문에 `PageSurface/SectionSurface` 표현 레이어를 적용                       | codex               |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리                                                                                 | codex               |
| 2026-03-03 | `_client.tsx` 반복 헤더를 `Page + PageTitleBar` 패턴으로 정리                                                                         | codex               |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리)                                                                     | codex               |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영                                                                                    | codex               |
