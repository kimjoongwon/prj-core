# 시설 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/grounds/[groundId]/edit`
> 파일: `apps/admin/src/app/(admin)/grounds/[groundId]/edit/page.tsx`

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
| F-005 | 취소 | 상세 페이지(`/grounds/[groundId]`)로 이동 |

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
PageSurface (title="시설 수정")
├── SectionSurface (title="기본 정보")
│   ├── name (Input, 필수) - 기존값 채워짐
│   ├── label (Input, 선택) - 기존값 채워짐
│   ├── address (Input, 필수) - 기존값 채워짐
│   ├── phone (Input, 필수) - 기존값 채워짐
│   ├── email (Input, 필수) - 기존값 채워짐
│   └── businessNo (Input, 읽기 전용) - 기존값 표시, 수정 불가
├── SectionSurface (title="이미지")
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
| "취소" 버튼 클릭 | `/grounds/[groundId]`로 이동 |
| "저장" 버튼 클릭 | 유효성 검사 → PATCH `/api/v1/grounds/[groundId]` 호출 |
| 저장 성공 | `/grounds/[groundId]`로 이동 (성공 토스트 표시) |
| 저장 실패 | 에러 메시지 표시 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| GET | `/api/v1/grounds/[groundId]` | `useGetGround(groundId)` | 기존 데이터 조회 |
| PATCH | `/api/v1/grounds/[groundId]` | `useUpdateGround()` | 시설 정보 수정 |

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

### Prefetch

```typescript
// _prefetch.ts
prefetchGetGroundQuery(groundId)
```

## 컴포넌트 구성

```
GroundEditPage (page.tsx - 서버)
└── GroundEditClient (_client.tsx - 클라이언트)
    └── PageSurface (title="시설 수정")
        ├── SectionSurface (title="기본 정보")
        │   └── GroundForm (Feature - 기본 정보 폼, defaultValues 주입)
        ├── SectionSurface (title="이미지")
        │   └── GroundImageForm (Feature - 이미지 업로드 폼, defaultValues 주입)
        └── 버튼 영역
            ├── Button ("취소")
            └── Button ("저장", primary)
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-L3L4-planner |
