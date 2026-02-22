# 시설 목록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/grounds`
> 파일: `apps/admin/src/app/(admin)/grounds/page.tsx`

## L3: 기능 (Feature)

### 목적

시스템에 등록된 모든 시설(Ground)을 목록으로 조회하고 관리합니다. 시설은 Space를 구체화하는 물리적 공간으로, 플랫폼 관리자(FULL_ACCESS)만 접근 가능합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 시설 목록 조회 | 전체 시설을 DataGrid로 표시 |
| F-002 | 시설 검색 | 시설명 / 사업자등록번호 키워드 검색 |
| F-003 | 시설 등록 이동 | "시설 등록" 버튼 클릭 시 `/grounds/new` 이동 |
| F-004 | 시설 상세 이동 | 행 클릭 시 `/grounds/[groundId]` 이동 |

### 접근 권한

| Actor | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (FULL_ACCESS) | 가능 | 전체 시설 목록 조회 |
| ACT-002 (MANAGE) | 불가 | 시설 관리는 플랫폼 관리자 전용 |
| ACT-003 (VIEW) | 불가 | - |

## L4: 화면 구조 (Screen)

### 레이아웃

```
PageSurface (title="시설 목록", actions=[시설 등록 버튼])
└── SectionSurface (padding="none")
    └── DataGrid
        ├── 검색 바 (시설명 / 사업자등록번호)
        └── 테이블
            ├── 시설명 (name)
            ├── 라벨 (label)
            ├── 사업자등록번호 (businessNo)
            ├── 주소 (address)
            ├── 전화번호 (phone)
            ├── 이메일 (email)
            └── 등록일 (createdAt)
```

### DataGrid 컬럼 정의

| 컬럼명 | 필드 | 타입 | 정렬 | 설명 |
|--------|------|------|------|------|
| 시설명 | name | TextCell | 가능 | 시설 이름 (클릭 시 상세 이동) |
| 라벨 | label | BadgeCell | - | 단축 라벨 (없으면 "-") |
| 사업자등록번호 | businessNo | TextCell | - | 유니크한 사업자 번호 |
| 주소 | address | TextCell | - | 시설 주소 |
| 전화번호 | phone | TextCell | - | 시설 전화번호 |
| 이메일 | email | TextCell | - | 시설 이메일 |
| 등록일 | createdAt | DateCell | 가능 | 등록 일시 |

### 인터랙션

| 이벤트 | 동작 |
|--------|------|
| "시설 등록" 버튼 클릭 | `/grounds/new`로 이동 |
| 행 클릭 | `/grounds/[groundId]`로 이동 |
| 검색어 입력 | 시설명 / 사업자등록번호 필터링 |
| 컬럼 정렬 클릭 | 해당 컬럼 기준 정렬 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| GET | `/api/v1/grounds` | `useGetGrounds()` | 전체 시설 목록 조회 |

### Prefetch

```typescript
// _prefetch.ts
prefetchGetGroundsQuery()
```

## 컴포넌트 구성

```
GroundListPage (page.tsx - 서버)
└── GroundListClient (_client.tsx - 클라이언트)
    ├── PageSurface
    │   └── actions: Button ("시설 등록", Building2 아이콘)
    └── SectionSurface (padding="none")
        └── GroundDataGrid (Feature)
            ├── 검색 Input
            └── DataGrid
                ├── NameCell
                ├── LabelCell (Badge)
                ├── BusinessNoCell
                ├── AddressCell
                ├── PhoneCell
                ├── EmailCell
                └── DateCell
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-screen-planner |
