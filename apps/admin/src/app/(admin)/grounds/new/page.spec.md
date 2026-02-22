# 시설 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/grounds/new`
> 파일: `apps/admin/src/app/(admin)/grounds/new/page.tsx`

## L3: 기능 (Feature)

### 목적

새 시설(Ground)을 등록합니다. 시설 등록 시 서버에서 새 Space가 자동으로 함께 생성됩니다. 플랫폼 관리자(FULL_ACCESS)만 사용 가능합니다.

### 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 기본 정보 입력 | 시설명(필수), 라벨, 주소(필수), 전화번호(필수), 이메일(필수), 사업자등록번호(필수) |
| F-002 | 이미지 업로드 | 로고 이미지, 대표 이미지 파일 업로드 |
| F-003 | 등록 제출 | 유효성 검사 후 API 호출 |
| F-004 | 취소 | 목록 페이지(`/grounds`)로 이동 |

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
PageSurface (title="시설 등록")
├── SectionSurface (title="기본 정보")
│   ├── name (Input, 필수)
│   ├── label (Input, 선택)
│   ├── address (Input, 필수)
│   ├── phone (Input, 필수)
│   ├── email (Input, 필수)
│   └── businessNo (Input, 필수)
├── SectionSurface (title="이미지")
│   ├── logoImageFileId (FileUpload, 선택)
│   └── imageFileId (FileUpload, 선택)
└── 하단 버튼 영역
    ├── "취소" 버튼 (secondary)
    └── "등록" 버튼 (primary)
```

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
| "취소" 버튼 클릭 | `/grounds`로 이동 |
| "등록" 버튼 클릭 | 유효성 검사 → POST `/api/v1/grounds` 호출 |
| 등록 성공 | `/grounds/[newGroundId]`로 이동 (성공 토스트 표시) |
| 등록 실패 (중복 사업자번호) | 에러 메시지 표시 |
| 이미지 업로드 클릭 | 파일 선택 다이얼로그 열기 |

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 | 설명 |
|--------|-----------|----------|------|
| POST | `/api/v1/grounds` | `useCreateGround()` | 시설 등록 (Space 자동 생성) |

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
    └── PageSurface (title="시설 등록")
        ├── SectionSurface (title="기본 정보")
        │   └── GroundForm (Feature - 기본 정보 폼)
        ├── SectionSurface (title="이미지")
        │   └── GroundImageForm (Feature - 이미지 업로드 폼)
        └── 버튼 영역
            ├── Button ("취소")
            └── Button ("등록", primary)
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-screen-planner |
