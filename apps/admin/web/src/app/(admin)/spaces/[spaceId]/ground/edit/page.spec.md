# 시설 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/spaces/[spaceId]/ground/edit`
> 파일: `apps/admin/src/app/(admin)/spaces/[spaceId]/ground/edit/page.tsx`

## L3: 기능 (Feature)

### 목적

기존 시설(Ground)의 정보를 수정합니다. 사업자등록번호는 변경 불가하며, 기본 정보와 이미지를 수정할 수 있습니다. 플랫폼 관리자(FULL_ACCESS)만 사용 가능합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 현재 정보 로드 | 기존 시설 정보를 폼에 미리 채워 표시 |
| F-002 | 기본 정보 수정 | 시설명, 라벨, 주소, 전화번호, 이메일 수정 (사업자등록번호 제외) |
| F-003 | 이미지 수정 | 로고 이미지, 대표 이미지 변경 |
| F-004 | 수정 제출 | 유효성 검사 후 PATCH API 호출 |
| F-005 | 취소 | 상세 페이지(`/spaces/[spaceId]/ground`)로 이동 |

### 특이사항

- `businessNo`(사업자등록번호)는 수정 불가 - 읽기 전용 표시
- 등록 시 자동 생성된 Space는 Ground 수정으로 변경 불가 (Space 관리는 별도)

### 접근 권한

| Actor | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (FULL_ACCESS) | 가능 | - |
| ACT-002 (MANAGE) | 불가 | 403 또는 리다이렉트 |
| ACT-003 (VIEW) | 불가 | 403 또는 리다이렉트 |

## L4: 화면 구조 (Screen)

### 레이아웃

```
페이지 헤더 영역 (title="시설 수정")
├── 섹션 영역 (title="기본 정보")
│   ├── name (Input, 필수) - 기존값 채워짐
│   ├── label (Input, 선택) - 기존값 채워짐
│   ├── address (Input, 필수) - 기존값 채워짐
│   ├── phone (Input, 필수) - 기존값 채워짐
│   ├── email (Input, 필수) - 기존값 채워짐
│   └── businessNo (Input, 읽기 전용) - 기존값 표시, 수정 불가
├── 섹션 영역 (title="이미지")
│   ├── logoImageFileId (FileUpload, 선택) - 기존 이미지 미리보기
│   └── imageFileId (FileUpload, 선택) - 기존 이미지 미리보기
└── 하단 버튼 영역
    ├── "취소" 버튼 (secondary)
    └── "저장" 버튼 (primary)
```

### 입력 필드 정의

| 필드 | 레이블 | 타입 | 필수 | 수정 가능 | 유효성 |
|------|--------|------|:----:|:---------:|--------|
| name | 시설명 | Input (text) | O | O | 최소 1자 이상 |
| label | 라벨 | Input (text) | X | O | 최대 20자 |
| address | 주소 | Input (text) | O | O | 최소 1자 이상 |
| phone | 전화번호 | Input (tel) | O | O | 전화번호 형식 |
| email | 이메일 | Input (email) | O | O | 이메일 형식 |
| businessNo | 사업자등록번호 | Input (text, disabled) | - | X | 읽기 전용 |
| logoImageFileId | 로고 이미지 | FileUpload | X | O | 이미지 파일 |
| imageFileId | 대표 이미지 | FileUpload | X | O | 이미지 파일 |

### 인터랙션

| 이벤트 | 동작 |
|--------|------|
| 페이지 진입 | GET 요청으로 기존 데이터 로드 후 폼에 채움 |
| "취소" 버튼 클릭 | `/spaces/[spaceId]/ground`로 이동 |
| "저장" 버튼 클릭 | 유효성 검사 → PATCH `/api/v1/spaces/[spaceId]/ground` 호출 |
| 저장 성공 | `/spaces/[spaceId]/ground`로 이동 (성공 토스트 표시) |
| 저장 실패 | 에러 메시지 표시 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| GET | `/api/v1/spaces/[spaceId]/ground` | `useGetSpaceGround(spaceId)` | 기존 데이터 조회 |
| PATCH | `/api/v1/spaces/[spaceId]/ground` | `useUpdateSpaceGround()` | 시설 정보 수정 |

### Request Body (PATCH)

```typescript
{
  name?: string;            // 시설명
  label?: string;           // 라벨
  address?: string;         // 주소
  phone?: string;           // 전화번호
  email?: string;           // 이메일
  // businessNo 제외 (수정 불가)
  logoImageFileId?: string; // 로고 이미지 파일 ID
  imageFileId?: string;     // 대표 이미지 파일 ID
}
```

### Fetch 전략

- 별도 `_prefetch.ts`는 없습니다.
- `GroundEditPage` 내부에서 `useGetSpaceGround(spaceId)`로 초기값을 로드합니다.

## 런타임 책임

- route container가 `useParams`, `useRouter`, `useGetSpaceGround`, `useUpdateSpaceGround`, `useLocalObservable`을 소유합니다.
- route container가 조회 결과를 pure page props로 매핑하고 저장 성공/실패 toast와 상세 페이지 이동을 처리합니다.
- `GroundEditPage`는 입력값/에러/CTA handler만 렌더링합니다.

## 컴포넌트 구성

```
apps/admin/web/.../spaces/[spaceId]/ground/edit/page.tsx
└── GroundEditPage (@cocrepo/ui export)
    └── GroundEditPageClient
        ├── PageTitleBar ("시설 정보 수정")
        ├── FormSectionCard
        │   └── FormSection ("기본 정보")
        │       └── name / label / address / phone / email / businessNo(default) 입력
        └── Button 영역 ("취소", "저장")
```


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/spaces/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-30 | 조회/저장/local state 책임을 route container로 명시하고 pure page props 위임 구조를 문서화 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
