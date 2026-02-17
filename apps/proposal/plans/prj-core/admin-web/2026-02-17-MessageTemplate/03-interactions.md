# L5-L6: 인터랙션, API

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: 메시지 템플릿 관리 (Email/SMS/Push 채널 CRUD + 변수 관리 + 미리보기 + 발송 테스트)
- **L1 Actor**: 시스템 관리자 (FULL_ACCESS), Space 관리자 (MANAGE, 향후 확장)
- **L2 Goals**: 템플릿 목록 조회, 상세 확인, 등록, 수정, 삭제, 활성/비활성 토글, 미리보기, 발송 테스트, 변수 관리
- **L3 Features**: 13개 기능 (FEA-001~013) - 목록/검색/필터, 상세/변수표시, 등록/수정 폼, 삭제/토글, 미리보기/발송테스트, 변수 관리
- **L4 Screens**: 4개 화면 (목록, 상세, 등록, 수정)

---

## L5: 인터랙션 (Action)

### 템플릿 목록 화면 (SCR-001)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-001 | 목록 로드 | 화면 진입 | API 호출, 목록 렌더링 | FEA-001 |
| MT-L5-ACT-002 | 검색 실행 | Enter/검색 버튼 클릭 | 검색 파라미터로 API 재호출, skip=0 초기화 | FEA-002 |
| MT-L5-ACT-003 | 유형 필터 변경 | Select 값 변경 | 유형 파라미터로 API 재호출, skip=0 초기화 | FEA-003 |
| MT-L5-ACT-004 | 활성/비활성 필터 변경 | Select 값 변경 | isActive 파라미터로 API 재호출, skip=0 초기화 | FEA-004 |
| MT-L5-ACT-005 | 페이지 변경 | 페이지 버튼 클릭 | skip/take 변경 + API 재호출 | FEA-001 |
| MT-L5-ACT-006 | 등록 페이지 이동 | 등록 버튼 클릭 | /message-templates/new로 이동 | FEA-007 |
| MT-L5-ACT-007 | 상세 페이지 이동 | 행 클릭 | /message-templates/[messageTemplateId]로 이동 | FEA-005 |
| MT-L5-ACT-008 | 인라인 활성 토글 | Switch 클릭 | PATCH toggle-status API 호출, 행 상태 갱신 | FEA-010 |

### 템플릿 상세 화면 (SCR-002)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-009 | 상세 로드 | 화면 진입 | API 호출, 상세 정보 + 변수 목록 렌더링 | FEA-005, FEA-006 |
| MT-L5-ACT-010 | 수정 페이지 이동 | 수정 버튼 클릭 | /message-templates/[messageTemplateId]/edit로 이동 | FEA-008 |
| MT-L5-ACT-011 | 삭제 실행 | 삭제 버튼 클릭 | 확인 다이얼로그 -> DELETE API -> 목록으로 이동 | FEA-009 |
| MT-L5-ACT-012 | 활성 토글 | Switch 클릭 | PATCH toggle-status API 호출, 상태 즉시 갱신 | FEA-010 |
| MT-L5-ACT-013 | 미리보기 모달 열기 | 미리보기 버튼 클릭 | 모달 열림, 변수 입력 필드 표시 (기본값 prefill) | FEA-011 |
| MT-L5-ACT-014 | 미리보기 실행 | 미리보기 실행 버튼 클릭 | POST preview API 호출, 치환 결과 렌더링 | FEA-011 |
| MT-L5-ACT-015 | 발송 테스트 모달 열기 | 테스트 발송 버튼 클릭 | 모달 열림, 수신자 + 변수 입력 필드 표시 | FEA-012 |
| MT-L5-ACT-016 | 발송 테스트 실행 | 발송 버튼 클릭 | POST send-test API 호출, 결과 표시 | FEA-012 |

### 템플릿 등록 화면 (SCR-003)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-017 | 유형 선택 | RadioGroup 변경 | 폼 동적 변환 (EMAIL/SMS/PUSH별 필드 변경) | FEA-007 |
| MT-L5-ACT-018 | 변수 추가 | "+ 변수 추가" 버튼 클릭 | 변수 테이블에 빈 행 추가 | FEA-013 |
| MT-L5-ACT-019 | 변수 삭제 | 행의 X 버튼 클릭 | 해당 변수 행 제거 (본문 사용 중이면 경고 표시) | FEA-013 |
| MT-L5-ACT-020 | 등록 제출 | 등록 버튼 클릭 | 유효성 검증 -> POST API -> 상세 화면 이동 | FEA-007 |
| MT-L5-ACT-021 | 등록 취소 | 취소 버튼 클릭 | 목록 화면(/message-templates)으로 이동 | FEA-007 |

### 템플릿 수정 화면 (SCR-004)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| MT-L5-ACT-022 | 수정 폼 로드 | 화면 진입 | GET API 호출, 기존 데이터로 폼 채움 (code/type 읽기 전용) | FEA-008 |
| MT-L5-ACT-023 | 변수 추가/수정/삭제 | 변수 테이블 조작 | 변수 행 추가/수정/삭제 (인라인 편집) | FEA-013 |
| MT-L5-ACT-024 | 수정 제출 | 저장 버튼 클릭 | 유효성 검증 -> PATCH API -> 상세 화면 이동 | FEA-008 |
| MT-L5-ACT-025 | 수정 취소 | 취소 버튼 클릭 | 상세 화면(/message-templates/[messageTemplateId])으로 이동 | FEA-008 |

### 인터랙션 상세

#### MT-L5-ACT-008: 인라인 활성 토글 (목록)

```
[트리거] 목록 행의 Switch 클릭
    |
    +--[1] Optimistic UI: Switch 상태 즉시 전환
    |
    +--[2] API 호출: PATCH /api/v1/message-templates/:messageTemplateId/toggle-status
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 성공 토스트 ("템플릿이 활성화되었습니다" / "비활성화되었습니다")
    |      +-- 실패 -> Rollback (Switch 원래 상태), 에러 토스트
    |
    +--[4] 목록 캐시 갱신 (해당 행 데이터만 업데이트)
```

#### MT-L5-ACT-011: 삭제 실행

```
[트리거] 삭제 버튼 클릭
    |
    +--[1] 확인 다이얼로그 표시
    |      "이 템플릿을 삭제하시겠습니까?"
    |      "관련 변수도 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
    |      [취소] [삭제]
    |
    +--[2] API 호출: DELETE /api/v1/message-templates/:messageTemplateId
    |
    +--[3] 응답 처리
    |      +-- 성공 (204) -> 목록 화면으로 이동 + 성공 토스트
    |      +-- 실패 -> 에러 토스트
    |
    +--[4] 목록 캐시 무효화
```

#### MT-L5-ACT-014: 미리보기 실행

```
[트리거] 미리보기 모달 내 "미리보기 실행" 버튼 클릭
    |
    +--[1] 변수 값 수집 (폼의 Record<string, string>)
    |
    +--[2] API 호출: POST /api/v1/message-templates/:messageTemplateId/preview
    |      - Request body: { variables: { userName: "홍길동", orderNo: "ORD-001" } }
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 치환 결과 렌더링
    |      |    +-- EMAIL: subject + content(HTML) 렌더링 (iframe/shadow DOM)
    |      |    +-- SMS: content 텍스트 + 바이트 수 + 장수 계산
    |      |    +-- PUSH: subject + content 카드 형태
    |      +-- 실패 -> 에러 메시지 표시
    |
    +--[4] 미치환 변수 검사: {{...}} 패턴 잔존 시 경고 배지 표시
```

#### MT-L5-ACT-016: 발송 테스트 실행

```
[트리거] 발송 테스트 모달 내 "발송" 버튼 클릭
    |
    +--[1] 프론트엔드 유효성 검증
    |      +-- recipient: 필수
    |      |    +-- EMAIL: 유효한 이메일 형식
    |      |    +-- SMS: 유효한 전화번호 형식
    |      |    +-- PUSH: 디바이스 토큰 또는 사용자 ID
    |      +-- 필수 변수: isRequired=true인 변수에 값이 있는지 확인
    |      +-- 검증 실패 -> 인라인 에러 메시지
    |
    +--[2] API 호출: POST /api/v1/message-templates/:messageTemplateId/send-test
    |      - Request body: { recipient: "test@example.com", variables: { ... } }
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 성공 표시 ("발송 성공" + 발송 시각)
    |      +-- 실패 -> 에러 메시지 표시 (SMTP 오류, 게이트웨이 오류 등)
    |
    +--[4] 모달 유지 (닫기 버튼으로만 닫힘)
```

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
    +--[2] API 호출: POST /api/v1/message-templates
    |      - Request body: CreateMessageTemplateDto (변수 배열 포함)
    |
    +--[3] 응답 처리
    |      +-- 성공 (201) -> 상세 화면으로 이동 + 성공 토스트
    |      +-- 409 (code 중복) -> code 필드 에러 표시
    |      +-- 기타 에러 -> 에러 토스트
    |
    +--[4] 목록 캐시 무효화
```

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
    +--[2] API 호출: PATCH /api/v1/message-templates/:messageTemplateId
    |      - Request body: UpdateMessageTemplateDto (변수 배열 포함)
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 상세 화면으로 이동 + 성공 토스트
    |      +-- 기타 에러 -> 에러 토스트
    |
    +--[4] 상세/목록 캐시 무효화
```

### 상태 변화 흐름

#### 목록 화면 상태 흐름

```
[페이지 진입]
    |
    v
[로딩 상태] <-- GET /api/v1/message-templates
    |
    +-- 성공 --> [데이터 표시]
    |                |
    |    +-----------+-----------+-----------+-----------+
    |    |           |           |           |           |
    |    v           v           v           v           v
    |  검색       유형 필터   상태 필터   페이지 이동  인라인 토글
    |    |           |           |           |           |
    |    v           v           v           v           v
    |  [로딩] --> [데이터 갱신]             PATCH API
    |                                         |
    |                                     +---+---+
    |                                     v       v
    |                                   성공    실패
    |                                     |       |
    |                                   토스트  롤백+토스트
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼 --> [로딩 상태]
```

#### 상세 화면 상태 흐름

```
[페이지 진입]
    |
    v
[로딩 상태] <-- GET /api/v1/message-templates/:id
    |
    +-- 성공 --> [상세 표시]
    |                |
    |    +-----------+-----------+-----------+-----------+-----------+
    |    |           |           |           |           |           |
    |    v           v           v           v           v           v
    |  수정 이동  삭제 실행   활성 토글   미리보기    발송 테스트  (네비게이션)
    |    |           |           |           |           |
    |    v           v           v           v           v
    |  edit 이동  확인 모달   PATCH API   모달 열림   모달 열림
    |              |           |           |           |
    |              v           v           v           v
    |           DELETE API   갱신       POST API    POST API
    |              |                     |           |
    |              v                  렌더링 결과   성공/실패
    |           목록 이동
    |
    +-- 실패 --> [에러 상태] --> 재시도 버튼
```

### 모달 정의

#### 삭제 확인 다이얼로그

```
+------------------------------------------+
|         삭제 확인                          |
+------------------------------------------+
|                                           |
|  이 템플릿을 삭제하시겠습니까?             |
|  관련 변수도 함께 삭제됩니다.              |
|  이 작업은 되돌릴 수 없습니다.             |
|                                           |
+------------------------------------------+
|    [취소]                     [삭제]      |
+------------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 제목 | "삭제 확인" |
| 본문 | 삭제 경고 메시지 (변수 포함 삭제 안내) |
| 취소 버튼 | 모달 닫기 |
| 삭제 버튼 | DELETE API 호출 후 목록 이동 |

#### 미리보기 모달

```
+---------------------------------------------+
| [x]  템플릿 미리보기                         |
+---------------------------------------------+
|                                              |
| 변수 값 입력:                                |
| userName:  [홍길동_________]                 |
| orderNo:   [ORD-20260217___]                 |
| appName:   [서비스__________] (기본값: 서비스)|
|                                              |
| [미리보기 실행]                               |
|                                              |
| --- 렌더링 결과 ---                          |
| +------------------------------------------+|
| | [EMAIL: subject + HTML 렌더링 결과]       ||
| | 또는 [SMS: 텍스트 + 바이트 수 + 장수]     ||
| | 또는 [PUSH: 제목 + 본문 카드]             ||
| +------------------------------------------+|
|                                              |
| [!] 미치환 변수 없음 / 미치환 변수 1개 경고  |
|                                              |
|                               [닫기]         |
+---------------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 변수 입력 필드 | 정의된 변수별 Input (기본값 prefill) |
| 미리보기 실행 버튼 | POST preview API 호출 |
| 렌더링 결과 영역 | 유형별 렌더링 (EMAIL: iframe, SMS: 텍스트+바이트, PUSH: 카드) |
| 미치환 경고 | `{{...}}` 패턴 잔존 시 경고 배지 |
| 닫기 버튼 | 모달 닫기 |

#### 발송 테스트 모달

```
+---------------------------------------------+
| [x]  발송 테스트                             |
+---------------------------------------------+
|                                              |
| 수신자 정보:                                  |
| [EMAIL] 이메일: [test@example.com___]        |
| [SMS]   전화번호: [010-1234-5678___]         |
| [PUSH]  디바이스 토큰: [__________]          |
|                                              |
| 변수 값 입력:                                |
| userName:  [홍길동_________]                 |
| orderNo:   [ORD-20260217___]                 |
|                                              |
| [발송]                                        |
|                                              |
| --- 결과 ---                                 |
| [v] 발송 성공 (2026-02-17 15:30:45)         |
| 또는                                         |
| [!] 발송 실패: SMTP 연결 오류               |
|                                              |
|                               [닫기]         |
+---------------------------------------------+
```

| 요소 | 설명 |
|------|------|
| 수신자 입력 | 유형별 수신자 필드 (이메일/전화번호/디바이스 토큰) |
| 변수 입력 필드 | 정의된 변수별 Input (기본값 prefill) |
| 발송 버튼 | POST send-test API 호출 |
| 결과 표시 | 성공/실패 메시지 + 타임스탬프 |
| 닫기 버튼 | 모달 닫기 |

### 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 등록 성공 | success | "메시지 템플릿이 등록되었습니다." |
| 수정 성공 | success | "메시지 템플릿이 수정되었습니다." |
| 삭제 성공 | success | "메시지 템플릿이 삭제되었습니다." |
| 활성화 성공 | success | "템플릿이 활성화되었습니다." |
| 비활성화 성공 | success | "템플릿이 비활성화되었습니다." |
| 발송 테스트 성공 | success | "테스트 발송이 완료되었습니다." |
| 코드 중복 (409) | error | "이미 존재하는 템플릿 코드입니다." |
| 저장 실패 | error | "저장에 실패했습니다. 다시 시도해주세요." |
| 삭제 실패 | error | "삭제에 실패했습니다. 다시 시도해주세요." |
| 발송 실패 | error | "발송에 실패했습니다. 오류: {errorMessage}" |
| 미리보기 실패 | error | "미리보기에 실패했습니다. 다시 시도해주세요." |
| 권한 없음 (403) | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |
| 템플릿 없음 (404) | error | "존재하지 않는 메시지 템플릿입니다." |

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| MT-L6-API-001 | GET | /api/v1/message-templates | 템플릿 목록 조회 | 신규 |
| MT-L6-API-002 | GET | /api/v1/message-templates/:messageTemplateId | 템플릿 상세 조회 | 신규 |
| MT-L6-API-003 | POST | /api/v1/message-templates | 템플릿 등록 | 신규 |
| MT-L6-API-004 | PATCH | /api/v1/message-templates/:messageTemplateId | 템플릿 수정 | 신규 |
| MT-L6-API-005 | DELETE | /api/v1/message-templates/:messageTemplateId | 템플릿 삭제 | 신규 |
| MT-L6-API-006 | PATCH | /api/v1/message-templates/:messageTemplateId/toggle-status | 활성/비활성 토글 | 신규 |
| MT-L6-API-007 | POST | /api/v1/message-templates/:messageTemplateId/preview | 미리보기 | 신규 |
| MT-L6-API-008 | POST | /api/v1/message-templates/:messageTemplateId/send-test | 발송 테스트 | 신규 |

### API 상세

---

#### MT-L6-API-001: 템플릿 목록 조회

**Endpoint**: `GET /api/v1/message-templates`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| search | string | X | - | 이름/코드 통합 검색 (부분 일치) |
| type | string | X | - | 유형 필터 (EMAIL, SMS, PUSH) |
| isActive | boolean | X | - | 활성 상태 필터 (true/false) |
| sort | string[] | X | -createdAt | 정렬 (name, createdAt, code) |
| skip | number | X | 0 | 건너뛸 수 |
| take | number | X | 20 | 가져올 수 (1-100) |

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "메시지 템플릿 목록 조회 성공";
  data: MessageTemplateDto[];
  meta: {
    total: number;
    skip: number;
    take: number;
    totalPages: number;
  };
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |

---

#### MT-L6-API-002: 템플릿 상세 조회

**Endpoint**: `GET /api/v1/message-templates/:messageTemplateId`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "메시지 템플릿 상세 조회 성공";
  data: MessageTemplateDto;
}
```

**MessageTemplateDto**:
```typescript
interface MessageTemplateDto {
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
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-003: 템플릿 등록

**Endpoint**: `POST /api/v1/message-templates`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Request Body**:
```typescript
interface CreateMessageTemplateDto {
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
  message: "메시지 템플릿 등록 성공";
  data: MessageTemplateDto;
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 400 | "유효하지 않은 요청입니다" | 유효성 검증 실패 |
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 409 | "이미 존재하는 템플릿 코드입니다" | code 중복 |

---

#### MT-L6-API-004: 템플릿 수정

**Endpoint**: `PATCH /api/v1/message-templates/:messageTemplateId`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**Request Body**:
```typescript
interface UpdateMessageTemplateDto {
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
  message: "메시지 템플릿 수정 성공";
  data: MessageTemplateDto;
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 400 | "유효하지 않은 요청입니다" | 유효성 검증 실패 |
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-005: 템플릿 삭제

**Endpoint**: `DELETE /api/v1/message-templates/:messageTemplateId`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**동작**: removedAt 설정 (소프트 삭제), 관련 TemplateVariable도 cascade 삭제

**Response** (204 No Content)

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-006: 활성/비활성 토글

**Endpoint**: `PATCH /api/v1/message-templates/:messageTemplateId/toggle-status`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**동작**: isActive 값을 반전 (true -> false, false -> true)

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "메시지 템플릿 상태 변경 성공";
  data: MessageTemplateDto; // isActive가 반전된 상태
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-007: 미리보기

**Endpoint**: `POST /api/v1/message-templates/:messageTemplateId/preview`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**Request Body**:
```typescript
interface PreviewMessageTemplateDto {
  variables: Record<string, string>; // 변수명 -> 샘플 데이터
}
```

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "미리보기 성공";
  data: {
    type: "EMAIL" | "SMS" | "PUSH";
    subject: string | null;      // 변수 치환된 제목
    content: string;             // 변수 치환된 본문
    unresolvedVariables: string[]; // 미치환 변수 목록 (예: ["companyName"])
  };
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |

---

#### MT-L6-API-008: 발송 테스트

**Endpoint**: `POST /api/v1/message-templates/:messageTemplateId/send-test`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| messageTemplateId | string (UUID) | O | 템플릿 ID |

**Request Body**:
```typescript
interface SendTestMessageTemplateDto {
  recipient: string;             // 수신자 (이메일/전화번호/디바이스 토큰)
  variables: Record<string, string>; // 변수명 -> 데이터
}
```

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "테스트 발송 성공";
  data: {
    success: boolean;
    sentAt: string;              // 발송 시각 (ISO 8601)
    errorMessage: string | null; // 실패 시 오류 메시지
  };
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 400 | "유효하지 않은 수신자입니다" | 수신자 형식 오류 |
| 400 | "비활성화된 템플릿은 발송할 수 없습니다" | isActive=false |
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 메시지 템플릿입니다" | ID 미존재 |
| 502 | "외부 발송 서비스 오류" | 게이트웨이 연결 실패 |

### API 호출 흐름 (화면별)

| 화면 | 액션 | API | 성공 시 | 실패 시 |
|------|------|-----|--------|--------|
| 목록 | 페이지 진입 | GET /api/v1/message-templates | 목록 표시 | 에러 메시지 |
| 목록 | 검색 | GET /api/v1/message-templates?search=... | 목록 갱신 | 에러 토스트 |
| 목록 | 유형 필터 | GET /api/v1/message-templates?type=EMAIL | 목록 갱신 | 에러 토스트 |
| 목록 | 상태 필터 | GET /api/v1/message-templates?isActive=true | 목록 갱신 | 에러 토스트 |
| 목록 | 인라인 토글 | PATCH .../:id/toggle-status | 행 갱신 + 성공 토스트 | 롤백 + 에러 토스트 |
| 상세 | 페이지 진입 | GET /api/v1/message-templates/:id | 상세 표시 | 에러 메시지 |
| 상세 | 삭제 | DELETE /api/v1/message-templates/:id | 목록 이동 + 성공 토스트 | 에러 토스트 |
| 상세 | 활성 토글 | PATCH .../:id/toggle-status | 상태 갱신 + 성공 토스트 | 에러 토스트 |
| 상세 | 미리보기 | POST .../:id/preview | 렌더링 결과 표시 | 에러 메시지 |
| 상세 | 발송 테스트 | POST .../:id/send-test | 성공/실패 표시 | 에러 메시지 |
| 등록 | 저장 | POST /api/v1/message-templates | 상세 이동 + 성공 토스트 | 에러 토스트 |
| 수정 | 페이지 진입 | GET /api/v1/message-templates/:id | 폼 prefill | 에러 메시지 |
| 수정 | 저장 | PATCH /api/v1/message-templates/:id | 상세 이동 + 성공 토스트 | 에러 토스트 |

### Orval 생성 훅

```typescript
import {
  // 목록/상세 조회
  useGetMessageTemplates,
  useGetMessageTemplate,

  // CRUD
  useCreateMessageTemplate,
  useUpdateMessageTemplate,
  useDeleteMessageTemplate,

  // 특수 액션
  useToggleStatusMessageTemplate,
  usePreviewMessageTemplate,
  useSendTestMessageTemplate,

  // SSR Prefetch
  prefetchGetMessageTemplates,
  prefetchGetMessageTemplate,

  // Query Key (캐시 무효화용)
  getGetMessageTemplatesQueryKey,
  getGetMessageTemplateQueryKey,
} from "@cocrepo/api";
```

---

## Requirement Graph (L5-L6)

```json
{
  "nodes": [
    { "id": "MT-L5-ACT-001", "level": 5, "type": "action", "label": "목록 로드" },
    { "id": "MT-L5-ACT-002", "level": 5, "type": "action", "label": "검색 실행" },
    { "id": "MT-L5-ACT-003", "level": 5, "type": "action", "label": "유형 필터 변경" },
    { "id": "MT-L5-ACT-004", "level": 5, "type": "action", "label": "활성/비활성 필터 변경" },
    { "id": "MT-L5-ACT-005", "level": 5, "type": "action", "label": "페이지 변경" },
    { "id": "MT-L5-ACT-006", "level": 5, "type": "action", "label": "등록 페이지 이동" },
    { "id": "MT-L5-ACT-007", "level": 5, "type": "action", "label": "상세 페이지 이동" },
    { "id": "MT-L5-ACT-008", "level": 5, "type": "action", "label": "인라인 활성 토글" },
    { "id": "MT-L5-ACT-009", "level": 5, "type": "action", "label": "상세 로드" },
    { "id": "MT-L5-ACT-010", "level": 5, "type": "action", "label": "수정 페이지 이동" },
    { "id": "MT-L5-ACT-011", "level": 5, "type": "action", "label": "삭제 실행" },
    { "id": "MT-L5-ACT-012", "level": 5, "type": "action", "label": "활성 토글" },
    { "id": "MT-L5-ACT-013", "level": 5, "type": "action", "label": "미리보기 모달 열기" },
    { "id": "MT-L5-ACT-014", "level": 5, "type": "action", "label": "미리보기 실행" },
    { "id": "MT-L5-ACT-015", "level": 5, "type": "action", "label": "발송 테스트 모달 열기" },
    { "id": "MT-L5-ACT-016", "level": 5, "type": "action", "label": "발송 테스트 실행" },
    { "id": "MT-L5-ACT-017", "level": 5, "type": "action", "label": "유형 선택" },
    { "id": "MT-L5-ACT-018", "level": 5, "type": "action", "label": "변수 추가" },
    { "id": "MT-L5-ACT-019", "level": 5, "type": "action", "label": "변수 삭제" },
    { "id": "MT-L5-ACT-020", "level": 5, "type": "action", "label": "등록 제출" },
    { "id": "MT-L5-ACT-021", "level": 5, "type": "action", "label": "등록 취소" },
    { "id": "MT-L5-ACT-022", "level": 5, "type": "action", "label": "수정 폼 로드" },
    { "id": "MT-L5-ACT-023", "level": 5, "type": "action", "label": "변수 추가/수정/삭제" },
    { "id": "MT-L5-ACT-024", "level": 5, "type": "action", "label": "수정 제출" },
    { "id": "MT-L5-ACT-025", "level": 5, "type": "action", "label": "수정 취소" },
    { "id": "MT-L6-API-001", "level": 6, "type": "api", "label": "GET /api/v1/message-templates", "metadata": { "method": "GET", "endpoint": "/api/v1/message-templates", "queryParams": [{ "name": "search", "type": "string", "description": "이름/코드 통합 검색" }, { "name": "type", "type": "string", "description": "유형 필터 (EMAIL, SMS, PUSH)" }, { "name": "isActive", "type": "boolean", "description": "활성 상태 필터" }, { "name": "sort", "type": "string[]", "description": "정렬" }, { "name": "skip", "type": "number", "description": "건너뛸 수" }, { "name": "take", "type": "number", "description": "가져올 수" }], "isArrayResponse": true, "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-002", "level": 6, "type": "api", "label": "GET /api/v1/message-templates/:messageTemplateId", "metadata": { "method": "GET", "endpoint": "/api/v1/message-templates/:messageTemplateId", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-003", "level": 6, "type": "api", "label": "POST /api/v1/message-templates", "metadata": { "method": "POST", "endpoint": "/api/v1/message-templates", "requestBody": "CreateMessageTemplateDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-004", "level": 6, "type": "api", "label": "PATCH /api/v1/message-templates/:messageTemplateId", "metadata": { "method": "PATCH", "endpoint": "/api/v1/message-templates/:messageTemplateId", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "requestBody": "UpdateMessageTemplateDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-005", "level": 6, "type": "api", "label": "DELETE /api/v1/message-templates/:messageTemplateId", "metadata": { "method": "DELETE", "endpoint": "/api/v1/message-templates/:messageTemplateId", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-006", "level": 6, "type": "api", "label": "PATCH /api/v1/message-templates/:messageTemplateId/toggle-status", "metadata": { "method": "PATCH", "endpoint": "/api/v1/message-templates/:messageTemplateId/toggle-status", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-007", "level": 6, "type": "api", "label": "POST /api/v1/message-templates/:messageTemplateId/preview", "metadata": { "method": "POST", "endpoint": "/api/v1/message-templates/:messageTemplateId/preview", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "requestBody": "PreviewMessageTemplateDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } },
    { "id": "MT-L6-API-008", "level": 6, "type": "api", "label": "POST /api/v1/message-templates/:messageTemplateId/send-test", "metadata": { "method": "POST", "endpoint": "/api/v1/message-templates/:messageTemplateId/send-test", "pathParams": [{ "name": "messageTemplateId", "type": "string", "required": true, "description": "템플릿 ID" }], "requestBody": "SendTestMessageTemplateDto", "auth": "Bearer Token", "permissions": ["FULL_ACCESS"] } }
  ],
  "edges": [
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-001", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-002", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-003", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-004", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-005", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-006", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-007", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L5-ACT-008", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-009", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-010", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-011", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-012", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-013", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-014", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-015", "type": "parent" },
    { "from": "MT-L4-SCR-002", "to": "MT-L5-ACT-016", "type": "parent" },
    { "from": "MT-L4-SCR-003", "to": "MT-L5-ACT-017", "type": "parent" },
    { "from": "MT-L4-SCR-003", "to": "MT-L5-ACT-018", "type": "parent" },
    { "from": "MT-L4-SCR-003", "to": "MT-L5-ACT-019", "type": "parent" },
    { "from": "MT-L4-SCR-003", "to": "MT-L5-ACT-020", "type": "parent" },
    { "from": "MT-L4-SCR-003", "to": "MT-L5-ACT-021", "type": "parent" },
    { "from": "MT-L4-SCR-004", "to": "MT-L5-ACT-022", "type": "parent" },
    { "from": "MT-L4-SCR-004", "to": "MT-L5-ACT-023", "type": "parent" },
    { "from": "MT-L4-SCR-004", "to": "MT-L5-ACT-024", "type": "parent" },
    { "from": "MT-L4-SCR-004", "to": "MT-L5-ACT-025", "type": "parent" },
    { "from": "MT-L4-SCR-001", "to": "MT-L6-API-001", "type": "calls", "label": "목록 조회" },
    { "from": "MT-L4-SCR-001", "to": "MT-L6-API-006", "type": "calls", "label": "인라인 토글" },
    { "from": "MT-L4-SCR-002", "to": "MT-L6-API-002", "type": "calls", "label": "상세 조회" },
    { "from": "MT-L4-SCR-002", "to": "MT-L6-API-005", "type": "calls", "label": "삭제" },
    { "from": "MT-L4-SCR-002", "to": "MT-L6-API-006", "type": "calls", "label": "활성 토글" },
    { "from": "MT-L4-SCR-002", "to": "MT-L6-API-007", "type": "calls", "label": "미리보기" },
    { "from": "MT-L4-SCR-002", "to": "MT-L6-API-008", "type": "calls", "label": "발송 테스트" },
    { "from": "MT-L4-SCR-003", "to": "MT-L6-API-003", "type": "calls", "label": "등록" },
    { "from": "MT-L4-SCR-004", "to": "MT-L6-API-002", "type": "calls", "label": "수정 폼 로드" },
    { "from": "MT-L4-SCR-004", "to": "MT-L6-API-004", "type": "calls", "label": "수정" },
    { "from": "MT-L5-ACT-001", "to": "MT-L6-API-001", "type": "calls" },
    { "from": "MT-L5-ACT-002", "to": "MT-L6-API-001", "type": "calls" },
    { "from": "MT-L5-ACT-003", "to": "MT-L6-API-001", "type": "calls" },
    { "from": "MT-L5-ACT-004", "to": "MT-L6-API-001", "type": "calls" },
    { "from": "MT-L5-ACT-005", "to": "MT-L6-API-001", "type": "calls" },
    { "from": "MT-L5-ACT-008", "to": "MT-L6-API-006", "type": "calls" },
    { "from": "MT-L5-ACT-009", "to": "MT-L6-API-002", "type": "calls" },
    { "from": "MT-L5-ACT-011", "to": "MT-L6-API-005", "type": "calls" },
    { "from": "MT-L5-ACT-012", "to": "MT-L6-API-006", "type": "calls" },
    { "from": "MT-L5-ACT-014", "to": "MT-L6-API-007", "type": "calls" },
    { "from": "MT-L5-ACT-016", "to": "MT-L6-API-008", "type": "calls" },
    { "from": "MT-L5-ACT-020", "to": "MT-L6-API-003", "type": "calls" },
    { "from": "MT-L5-ACT-022", "to": "MT-L6-API-002", "type": "calls" },
    { "from": "MT-L5-ACT-024", "to": "MT-L6-API-004", "type": "calls" }
  ]
}
```
