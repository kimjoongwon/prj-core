# 03-interactions: 템플릿 수정 화면

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: 템플릿 관리 (Email/SMS/Push 채널 CRUD + 변수 관리 + 미리보기 + 발송 테스트)
- **L1 행위자**: 시스템 관리자 (PLATFORM_ADMIN), Company 관리자 (COMPANY_MANAGER, 향후 확장)
- **L2 Goals**: 템플릿 목록 조회, 상세 확인, 등록, 수정, 삭제, 활성/비활성 토글, 미리보기, 발송 테스트, 변수 관리
- **L3 Features**: 13개 기능 (FEA-001~013) - 목록/검색/필터, 상세/변수표시, 등록/수정 폼, 삭제/토글, 미리보기/발송테스트, 변수 관리
- **L4 Screens**: 4개 화면 (목록, 상세, 등록, 수정)

---

## L5: 인터랙션 (Action)

### 템플릿 수정 화면 (SCR-004)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-022 | 수정 폼 로드 | 화면 진입 | GET API 호출, 기존 데이터로 폼 채움 (code/type 읽기 전용) | FEA-008 |
| MT-L5-ACT-023 | 변수 추가/수정/삭제 | 변수 테이블 조작 | 변수 행 추가/수정/삭제 (인라인 편집) | FEA-013 |
| MT-L5-ACT-024 | 수정 제출 | 저장 버튼 클릭 | 유효성 검증 -> PATCH API -> 상세 화면 이동 | FEA-008 |
| MT-L5-ACT-025 | 수정 취소 | 취소 버튼 클릭 | 상세 화면(/templates/[templateId])으로 이동 | FEA-008 |

### 인터랙션 상세

#### MT-L5-ACT-024: 수정 제출

```
[트리거] 저장 버튼 클릭
    |
    +--[1] 프론트엔드 유효성 검증
    |      +-- name: 필수
    |      +-- subject: EMAIL/PUSH일 때 필수, PUSH는 50자 제한
    |      +-- content: 필수, PUSH는 200자 제한
    |      +-- 변수명: 영문 카멜케이스, 목록 내 중복 불가
    |      +-- 검증 실패 -> 인라인 에러 메시지
    |
    +--[2] API 호출: PATCH /api/v1/templates/:templateId
    |      - Request body: UpdateTemplateDto (변수 배열 포함)
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 상세 화면으로 이동 + 성공 토스트
    |      +-- 기타 에러 -> 에러 토스트
    |
    +--[4] 상세/목록 캐시 무효화
```

### 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 수정 성공 | success | "템플릿이 수정되었습니다." |
| 저장 실패 | error | "저장에 실패했습니다. 다시 시도해주세요." |
| 권한 없음 (403) | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |
| 템플릿 없음 (404) | error | "존재하지 않는 템플릿입니다." |

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| MT-L6-API-002 | GET | /api/v1/templates/:templateId | 템플릿 상세 조회 (수정 폼 로드) | 신규 |
| MT-L6-API-004 | PATCH | /api/v1/templates/:templateId | 템플릿 수정 | 신규 |

### API 상세

---

#### MT-L6-API-002: 템플릿 상세 조회

**Endpoint**: `GET /api/v1/templates/:templateId`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| templateId | string (UUID) | O | 템플릿 ID |

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "템플릿 상세 조회 성공";
  data: TemplateDto;
}
```

**TemplateDto**:
```typescript
interface TemplateDto {
  id: string;                    // UUID
  code: string;                  // 고유 코드 (예: WELCOME_EMAIL)
  name: string;                  // 템플릿 이름
  type: "EMAIL" | "SMS" | "PUSH"; // 유형
  subject: string | null;        // 제목 (EMAIL, PUSH)
  content: string;               // 본문
  description: string | null;    // 설명
  isActive: boolean;             // 활성 상태
  createdAt: string;             // 생성일 (ISO 8601)
  updatedAt: string;             // 수정일 (ISO 8601)
  variables: TemplateVariableDto[]; // 변수 목록
}
```

**TemplateVariableDto**:
```typescript
interface TemplateVariableDto {
  id: string;                    // UUID
  name: string;                  // 변수명 (예: userName)
  description: string | null;    // 한글 설명
  defaultValue: string | null;   // 기본값
  isRequired: boolean;           // 필수 여부
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-004: 템플릿 수정

**Endpoint**: `PATCH /api/v1/templates/:templateId`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| templateId | string (UUID) | O | 템플릿 ID |

**Request Body**:
```typescript
interface UpdateTemplateDto {
  name?: string;                 // 템플릿 이름
  subject?: string;              // 제목 (EMAIL/PUSH)
  content?: string;              // 본문
  description?: string;          // 설명
  variables?: UpdateTemplateVariableDto[]; // 변수 배열 (전체 교체)
}

interface UpdateTemplateVariableDto {
  id?: string;                   // 기존 변수 ID (수정 시), 없으면 신규 생성
  name: string;                  // 필수, 영문 카멜케이스
  description?: string;          // 한글 설명
  defaultValue?: string;         // 기본값
  isRequired?: boolean;          // 필수 여부
}
```

**변수 업데이트 전략**: 전체 교체 (Set semantics)
- 요청에 포함된 변수 목록으로 기존 변수를 전체 교체
- `id`가 있는 항목: 기존 변수 수정
- `id`가 없는 항목: 새 변수 생성
- 요청에 없는 기존 변수: 삭제

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "템플릿 수정 성공";
  data: TemplateDto;
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 400 | "유효하지 않은 요청입니다" | 유효성 검증 실패 |
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 템플릿입니다" | ID 미존재 |

### API 호출 흐름

| 화면 | 액션 | API | 성공 시 | 실패 시 |
|------|------|-----|--------|--------|
| 수정 | 페이지 진입 | GET /api/v1/templates/:id | 폼 prefill | 에러 메시지 |
| 수정 | 저장 | PATCH /api/v1/templates/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |

### Orval 생성 훅

```typescript
import {
  // 상세 조회 (폼 로드용)
  useGetTemplate,

  // CRUD
  useUpdateTemplate,

  // SSR Prefetch
  prefetchGetTemplate,

  // Query Key (캐시 무효화용)
  getGetTemplatesQueryKey,
  getGetTemplateQueryKey,
} from "@cocrepo/api";
```
