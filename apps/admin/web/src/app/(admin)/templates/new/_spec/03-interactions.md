# 03-interactions: 템플릿 등록 화면

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: 템플릿 관리 (Email/SMS/Push 채널 CRUD + 변수 관리 + 미리보기 + 발송 테스트)
- **L1 행위자**: 시스템 관리자 (PLATFORM_ADMIN), Company 관리자 (COMPANY_MANAGER, 향후 확장)
- **L2 Goals**: 템플릿 목록 조회, 상세 확인, 등록, 수정, 삭제, 활성/비활성 토글, 미리보기, 발송 테스트, 변수 관리
- **L3 Features**: 13개 기능 (FEA-001~013) - 목록/검색/필터, 상세/변수표시, 등록/수정 폼, 삭제/토글, 미리보기/발송테스트, 변수 관리
- **L4 Screens**: 4개 화면 (목록, 상세, 등록, 수정)

---

## L5: 인터랙션 (Action)

### 템플릿 등록 화면 (SCR-003)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-017 | 유형 선택 | RadioGroup 변경 | 폼 동적 변환 (EMAIL/SMS/PUSH별 필드 변경) | FEA-007 |
| MT-L5-ACT-018 | 변수 추가 | "+ 변수 추가" 버튼 클릭 | 변수 테이블에 빈 행 추가 | FEA-013 |
| MT-L5-ACT-019 | 변수 삭제 | 행의 X 버튼 클릭 | 해당 변수 행 제거 (본문 사용 중이면 경고 표시) | FEA-013 |
| MT-L5-ACT-020 | 등록 제출 | 등록 버튼 클릭 | 유효성 검증 -> POST API -> 상세 화면 이동 | FEA-007 |
| MT-L5-ACT-021 | 등록 취소 | 취소 버튼 클릭 | 목록 화면(/templates)으로 이동 | FEA-007 |

### 인터랙션 상세

#### MT-L5-ACT-020: 등록 제출

```
[트리거] 등록 버튼 클릭
    |
    +--[1] 프론트엔드 유효성 검증
    |      +-- type: 필수 선택
    |      +-- code: 필수, 영문 대문자+언더스코어 (/^[A-Z][A-Z0-9_]*$/)
    |      +-- name: 필수
    |      +-- subject: EMAIL/PUSH일 때 필수, PUSH는 50자 제한
    |      +-- content: 필수, PUSH는 200자 제한
    |      +-- 변수명: 영문 카멜케이스 (/^[a-zA-Z][a-zA-Z0-9]*$/), 목록 내 중복 불가
    |      +-- 검증 실패 -> 인라인 에러 메시지
    |
    +--[2] API 호출: POST /api/v1/templates
    |      - Request body: CreateTemplateDto (변수 배열 포함)
    |
    +--[3] 응답 처리
    |      +-- 성공 (201) -> 상세 화면으로 이동 + 성공 토스트
    |      +-- 409 (code 중복) -> code 필드 에러 표시
    |      +-- 기타 에러 -> 에러 토스트
    |
    +--[4] 목록 캐시 무효화
```

### 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 등록 성공 | success | "템플릿이 등록되었습니다." |
| 코드 중복 (409) | error | "이미 존재하는 템플릿 코드입니다." |
| 저장 실패 | error | "저장에 실패했습니다. 다시 시도해주세요." |
| 권한 없음 (403) | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| MT-L6-API-003 | POST | /api/v1/templates | 템플릿 등록 | 신규 |

### API 상세

---

#### MT-L6-API-003: 템플릿 등록

**Endpoint**: `POST /api/v1/templates`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Request Body**:
```typescript
interface CreateTemplateDto {
  code: string;                  // 필수, unique, 영문 대문자+언더스코어
  name: string;                  // 필수, 템플릿 이름
  type: "EMAIL" | "SMS" | "PUSH"; // 필수, 유형
  subject?: string;              // EMAIL/PUSH일 때 필수
  content: string;               // 필수, 본문 (EMAIL: HTML, SMS/PUSH: 텍스트)
  description?: string;          // 설명
  variables?: CreateTemplateVariableDto[]; // 변수 배열
}

interface CreateTemplateVariableDto {
  name: string;                  // 필수, 영문 카멜케이스
  description?: string;          // 한글 설명
  defaultValue?: string;         // 기본값
  isRequired?: boolean;          // 필수 여부 (기본: false)
}
```

**Response** (201 Created):
```typescript
{
  httpStatus: 201;
  message: "템플릿 등록 성공";
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

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 400 | "유효하지 않은 요청입니다" | 유효성 검증 실패 |
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 409 | "이미 존재하는 템플릿 코드입니다" | code 중복 |

### API 호출 흐름

| 화면 | 액션 | API | 성공 시 | 실패 시 |
|------|------|-----|--------|--------|
| 등록 | 저장 | POST /api/v1/templates | 상세 이동 + 성공 토스트 | 에러 토스트 |

### Orval 생성 훅

```typescript
import {
  // CRUD
  useCreateTemplate,

  // Query Key (캐시 무효화용)
  getGetTemplatesQueryKey,
} from "@cocrepo/api";
```
