# 시설 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/spaces/[spaceId]/ground`
> 파일: `apps/admin/src/app/(admin)/spaces/[spaceId]/ground/page.tsx`

## L3: 기능 (Feature)

### 목적

특정 시설(Ground)의 상세 정보를 조회합니다. 기본 정보, 이미지, 연결된 Space 정보를 표시합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 시설 상세 조회 | 시설의 전체 정보 표시 |
| F-002 | 로고/이미지 표시 | 등록된 이미지 미리보기 |
| F-003 | 수정 이동 | "수정" 버튼 클릭 시 `/spaces/[spaceId]/ground/edit` 이동 |
| F-004 | 목록 이동 | 뒤로가기 또는 "목록" 버튼으로 `/spaces` 이동 |

### 접근 권한

| Actor | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (FULL_ACCESS) | 가능 | 조회 + 수정 버튼 표시 |
| ACT-002 (MANAGE) | 가능 (조회만) | 수정 버튼 미표시 |
| ACT-003 (VIEW) | 가능 (조회만) | 수정 버튼 미표시 |

## L4: 화면 구조 (Screen)

### 레이아웃

```
페이지 헤더 영역 (title=시설명, actions=[수정 버튼])
├── 섹션 영역 (title="기본 정보")
│   ├── 시설명 (name)
│   ├── 라벨 (label)
│   ├── 주소 (address)
│   ├── 전화번호 (phone)
│   ├── 이메일 (email)
│   ├── 사업자등록번호 (businessNo)
│   ├── 등록일 (createdAt)
│   └── 수정일 (updatedAt)
├── 섹션 영역 (title="이미지") [이미지 있을 때만]
│   ├── 로고 이미지 (logoImageFileId)
│   └── 대표 이미지 (imageFileId)
└── 섹션 영역 (title="연결된 Space")
    └── Space ID, Space 정보
```

### 표시 필드

| 필드 | 레이블 | 표시 형식 | 비고 |
|------|--------|----------|------|
| name | 시설명 | 텍스트 | 페이지 타이틀로도 사용 |
| label | 라벨 | Badge | 없으면 "-" |
| address | 주소 | 텍스트 | - |
| phone | 전화번호 | 텍스트 | - |
| email | 이메일 | 텍스트 (링크) | mailto: 링크 |
| businessNo | 사업자등록번호 | 텍스트 | - |
| createdAt | 등록일 | 날짜 포맷 | - |
| updatedAt | 수정일 | 날짜 포맷 | 없으면 "-" |
| logoImageFileId | 로고 이미지 | Image | 없으면 섹션 미표시 |
| imageFileId | 대표 이미지 | Image | 없으면 섹션 미표시 |
| spaceId | 연결된 Space ID | 텍스트 | - |

### 인터랙션

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/spaces/[spaceId]/ground/edit`으로 이동 |
| 뒤로가기 | `/spaces`로 이동 |
| 이메일 클릭 | `mailto:` 링크 실행 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| GET | `/api/v1/spaces/[spaceId]/ground` | `useGetSpaceGround(spaceId)` | 시설 단건 조회 |

### Prefetch

```typescript
// _prefetch.ts
prefetchGetSpaceGroundQuery(spaceId)
```

## 컴포넌트 구성

```
GroundDetailPage (page.tsx - 서버)
└── GroundDetailClient (_client.tsx - 클라이언트)
    └── 페이지 헤더 영역 (title=name, actions=[수정 버튼])
        ├── 섹션 영역 (title="기본 정보")
        │   └── GroundDetailInfo (Widget - 기본 정보 표시)
        ├── 섹션 영역 (title="이미지") [조건부]
        │   └── GroundImageViewer (Widget - 이미지 미리보기)
        └── 섹션 영역 (title="연결된 Space")
            └── SpaceInfoPanel (Widget - Space 정보)
```


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | `apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/_client.tsx` |
|------|------|
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | DataGrid/테이블은 필요 시 `padding="none"`, 그 외 기본 패딩 |
| 예외 | 없음. `Layout`/`Page`/`Section` 슬롯 배치만으로는 surface가 생기지 않으므로 page 또는 `_client.tsx`가 owner를 명시합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
