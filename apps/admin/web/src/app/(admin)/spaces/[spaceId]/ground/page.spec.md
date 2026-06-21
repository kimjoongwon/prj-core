# 시설 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/spaces/[spaceId]/ground`
> 파일: `apps/admin/src/app/(admin)/spaces/[spaceId]/ground/page.tsx`

## L3: 기능 (Feature)

### 목적

Company가 보유한 대표 서비스 시설(Ground)의 상세 정보를 조회합니다. Company의 사업자 정보와 Ground의 기본 정보, 이미지, 연결된 Space 정보를 표시합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 시설 상세 조회 | 시설의 전체 정보 표시 |
| F-002 | 로고/이미지 표시 | 등록된 이미지 미리보기 |
| F-003 | 수정 이동 | "수정" 버튼 클릭 시 `/spaces/[spaceId]/ground/edit` 이동 |
| F-004 | 목록 이동 | 뒤로가기 또는 "목록" 버튼으로 `/spaces` 이동 |

### 접근 권한

| 행위자 | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (PLATFORM_ADMIN) | 가능 | 조회 + 수정 버튼 표시 |
| ACT-002 (COMPANY_MANAGER) | 가능 (조회만) | 수정 버튼 미표시 |
| ACT-003 (MEMBER) | 가능 (조회만) | 수정 버튼 미표시 |

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
│   ├── 회사 사업자등록번호 (businessNo)
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
| businessNo | 회사 사업자등록번호 | 텍스트 | Company에서 파생 |
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

### Fetch 전략

- 별도 `_prefetch.ts`는 없습니다.
- `GroundDetailScreen` 내부에서 `useGetSpaceGround(spaceId)`를 직접 호출합니다.

## 컴포넌트 구성

```
apps/admin/web/.../spaces/[spaceId]/ground/page.tsx
└── GroundDetailScreen (@cocrepo/ui export)
    └── GroundDetailScreenClient
        ├── PageTitleBar (title=ground.name, action="수정")
        ├── SectionSurface
        │   └── Section ("기본 정보")
        └── SectionSurface
            └── Section ("연결된 Space")
```


## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| ScreenSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. `layout.tsx`는 `Page` 구조만 소유하고 surface는 page/screen content owner가 명시합니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/spaces/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)
