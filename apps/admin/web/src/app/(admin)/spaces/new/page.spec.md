# 시설 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/spaces/new`
> 파일: `apps/admin/src/app/(admin)/spaces/new/page.tsx`

## L3: 기능 (Feature)

### 목적

새 시설(Ground)을 등록합니다. 시설 등록 시 서버에서 새 Space가 자동으로 함께 생성됩니다. 플랫폼 관리자(FULL_ACCESS)만 사용 가능합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 기본 정보 입력 | 시설명(필수), 라벨, 주소(필수), 전화번호(필수), 이메일(필수), 사업자등록번호(필수) |
| F-002 | 이미지 업로드 | 로고 이미지, 대표 이미지 파일 업로드 |
| F-003 | 등록 제출 | 유효성 검사 후 API 호출 |
| F-004 | 취소 | 목록 페이지(`/spaces`)로 이동 |

### 특이사항

- Ground 등록 시 서버에서 새 Space를 자동 생성 (클라이언트에서 별도 처리 불필요)
- `businessNo`(사업자등록번호)는 유니크. 중복 시 서버 에러 처리 필요

### 접근 권한

| Actor | 접근 가능 여부 | 비고 |
|-------|---------------|------|
| ACT-001 (FULL_ACCESS) | 가능 | - |
| ACT-002 (MANAGE) | 불가 | - |
| ACT-003 (VIEW) | 불가 | - |

## L4: 화면 구조 (Screen)

### 레이아웃

```
페이지 헤더 영역 (title="시설 등록")
├── 섹션 영역 (title="기본 정보")
│   ├── name (Input, 필수)
│   ├── label (Input, 선택)
│   ├── address (Input, 필수)
│   ├── phone (Input, 필수)
│   ├── email (Input, 필수)
│   └── businessNo (Input, 필수)
├── 섹션 영역 (title="이미지")
│   ├── logoImageFileId (FileUpload, 선택)
│   └── imageFileId (FileUpload, 선택)
└── 하단 버튼 영역
    ├── "취소" 버튼 (secondary)
    └── "등록" 버튼 (primary)
```

- 페이지 헤더는 `Page + PageTitleBar` 조합으로 구현한다.
- 각 입력 섹션은 `Section + PageTitleBar`를 사용해 표면을 만든다.

### 입력 필드 정의

| 필드 | 레이블 | 타입 | 필수 | 유효성 |
|------|--------|------|:----:|--------|
| name | 시설명 | Input (text) | O | 최소 1자 이상 |
| label | 라벨 | Input (text) | X | 최대 20자 |
| address | 주소 | Input (text) | O | 최소 1자 이상 |
| phone | 전화번호 | Input (tel) | O | 전화번호 형식 |
| email | 이메일 | Input (email) | O | 이메일 형식 |
| businessNo | 사업자등록번호 | Input (text) | O | 10자리 숫자 (000-00-00000) |
| logoImageFileId | 로고 이미지 | FileUpload | X | 이미지 파일 (jpg, png, webp) |
| imageFileId | 대표 이미지 | FileUpload | X | 이미지 파일 (jpg, png, webp) |

### 인터랙션

| 이벤트 | 동작 |
|--------|------|
| "취소" 버튼 클릭 | `/spaces`로 이동 |
| "등록" 버튼 클릭 | 유효성 검사 → POST `/api/v1/spaces` 호출 |
| 등록 성공 | `/spaces/[newGroundId]`로 이동 (성공 토스트 표시) |
| 등록 실패 (중복 사업자번호) | 에러 메시지 표시 |
| 이미지 업로드 클릭 | 파일 선택 다이얼로그 열기 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| POST | `/api/v1/spaces` | `useCreateSpace()` | 시설 등록 (Space 자동 생성) |

### Request Body

```typescript
{
  name: string;           // 시설명 (필수)
  label?: string;         // 라벨 (선택)
  address: string;        // 주소 (필수)
  phone: string;          // 전화번호 (필수)
  email: string;          // 이메일 (필수)
  businessNo: string;     // 사업자등록번호 (필수, 유니크)
  logoImageFileId?: string; // 로고 이미지 파일 ID (선택)
  imageFileId?: string;   // 대표 이미지 파일 ID (선택)
}
```

## 컴포넌트 구성

```
GroundNewPage (page.tsx - 서버)
└── GroundNewClient (_client.tsx - 클라이언트)
    └── 페이지 헤더 영역 (title="시설 등록")
        ├── 섹션 영역 (title="기본 정보")
        │   └── GroundForm (Feature - 기본 정보 폼)
        ├── 섹션 영역 (title="이미지")
        │   └── GroundImageForm (Feature - 이미지 업로드 폼)
        └── 버튼 영역
            ├── Button ("취소")
            └── Button ("등록", primary)
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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/spaces/new/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `widget/form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 적용 규칙 명시 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
