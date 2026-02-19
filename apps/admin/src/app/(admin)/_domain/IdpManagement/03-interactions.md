# L5-L6: 인터랙션, API

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: IDP 관리 (OIDC Client CRUD + 세션/토큰 관리)
- **L1 Actor**: 시스템 관리자 (FULL_ACCESS)
- **L2 Goals**: 클라이언트 CRUD, 세션 조회/강제 폐기
- **L3 Features**: 목록/검색, 상세, 등록/수정 폼, 삭제/토글, 세션 목록/필터/폐기
- **L4 Screens**: 5개 화면 (클라이언트 목록/상세/등록/수정, 세션 목록)

---

## L5: 인터랙션 (Action)

### 클라이언트 목록 화면 (SCR-001)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| IDP-L5-ACT-001 | 목록 로드 | 화면 진입 | API 호출, 목록 렌더링 | FEA-001 |
| IDP-L5-ACT-002 | 검색 실행 | Enter/버튼 | 검색 파라미터로 API 재호출 | FEA-002 |
| IDP-L5-ACT-003 | 페이지 변경 | 페이지 클릭 | 페이지 변경 + API 재호출 | FEA-001 |
| IDP-L5-ACT-004 | 등록 페이지 이동 | 등록 버튼 클릭 | /oidc-clients/new로 이동 | FEA-004 |
| IDP-L5-ACT-005 | 상세 페이지 이동 | 행 클릭 | /oidc-clients/[id]로 이동 | FEA-003 |

### 클라이언트 상세 화면 (SCR-002)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| IDP-L5-ACT-006 | 상세 로드 | 화면 진입 | API 호출, 상세 렌더링 | FEA-003 |
| IDP-L5-ACT-007 | Secret 보기 토글 | 보기 버튼 클릭 | 마스킹/해제 전환 | FEA-003 |
| IDP-L5-ACT-008 | Secret 복사 | 복사 버튼 클릭 | 클립보드 복사 + 토스트 | FEA-003 |
| IDP-L5-ACT-009 | 수정 페이지 이동 | 수정 버튼 클릭 | /oidc-clients/[id]/edit로 이동 | FEA-005 |
| IDP-L5-ACT-010 | 삭제 실행 | 삭제 버튼 → 확인 다이얼로그 | DELETE API + 목록으로 이동 | FEA-006 |
| IDP-L5-ACT-011 | 활성 토글 | 토글 버튼 클릭 → 확인 | PATCH API + 상태 갱신 | FEA-007 |

### 클라이언트 등록 화면 (SCR-003)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| IDP-L5-ACT-012 | Secret 자동 생성 | 자동 생성 버튼 | 32byte hex 문자열 생성 | FEA-004 |
| IDP-L5-ACT-013 | Public 클라이언트 토글 | 체크박스 클릭 | Secret 필드 비활성화, auth method=none | FEA-004 |
| IDP-L5-ACT-014 | Redirect URI 추가 | + 버튼 | URI 입력 필드 추가 | FEA-004 |
| IDP-L5-ACT-015 | Redirect URI 제거 | X 버튼 | URI 입력 필드 삭제 | FEA-004 |
| IDP-L5-ACT-016 | 등록 제출 | 등록 버튼 클릭 | 유효성 검증 → POST API → 상세 페이지 이동 | FEA-004 |
| IDP-L5-ACT-017 | 등록 취소 | 취소 버튼 클릭 | 목록 페이지로 이동 | FEA-004 |

### 클라이언트 수정 화면 (SCR-004)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| IDP-L5-ACT-018 | 수정 폼 로드 | 화면 진입 | 기존 데이터로 폼 채움 | FEA-005 |
| IDP-L5-ACT-019 | 수정 제출 | 저장 버튼 클릭 | PATCH API → 상세 페이지 이동 | FEA-005 |
| IDP-L5-ACT-020 | 수정 취소 | 취소 버튼 클릭 | 상세 페이지로 이동 | FEA-005 |

### 세션 목록 화면 (SCR-005)

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| IDP-L5-ACT-021 | 세션 목록 로드 | 화면 진입 | API 호출, 목록 렌더링 | FEA-008 |
| IDP-L5-ACT-022 | 모델 타입 필터 | Select 변경 | 필터 적용 + API 재호출 | FEA-009 |
| IDP-L5-ACT-023 | 단건 폐기 | 폐기 버튼 → 확인 다이얼로그 | DELETE API + 목록 갱신 | FEA-010 |
| IDP-L5-ACT-024 | Grant 일괄 폐기 | Grant ID 클릭 → 일괄 폐기 → 확인 | REVOKE API + 목록 갱신 | FEA-010 |
| IDP-L5-ACT-025 | 페이지 변경 | 페이지 클릭 | 페이지 변경 + API 재호출 | FEA-008 |

### 인터랙션 상세

#### IDP-L5-ACT-016: 등록 제출

```
[트리거] 등록 버튼 클릭
    │
    ├─[1] 프론트엔드 유효성 검증
    │      ├─ clientId: 필수, 영문+숫자+하이픈, 3-64자
    │      ├─ clientName: 필수, 1-128자
    │      ├─ redirectUris: 최소 1개, 유효한 URI 형식
    │      ├─ grantTypes: 최소 1개 선택
    │      ├─ scope: 필수, "openid" 포함
    │      └─ 검증 실패 → 인라인 에러 메시지
    │
    ├─[2] API 호출: POST /api/oidc-clients
    │      - Request body: CreateOidcClientDto
    │
    ├─[3] 응답 처리
    │      ├─ 성공 (201) → 상세 페이지로 이동 + 성공 토스트
    │      ├─ 409 (clientId 중복) → clientId 필드 에러
    │      └─ 기타 에러 → 에러 토스트
    │
    └─[4] 등록 성공 시 클라이언트 목록 캐시 무효화
```

#### IDP-L5-ACT-023: 단건 폐기

```
[트리거] 폐기 버튼 클릭
    │
    ├─[1] 확인 다이얼로그 표시
    │      "이 세션/토큰을 폐기하시겠습니까?"
    │      [취소] [폐기]
    │
    ├─[2] API 호출: POST /api/oidc-sessions/:key/revoke
    │
    ├─[3] 응답 처리
    │      ├─ 성공 → 성공 토스트 + 목록 갱신
    │      └─ 실패 → 에러 토스트
    │
    └─[4] 목록 캐시 무효화
```

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| IDP-L6-API-001 | GET | /api/oidc-clients | 클라이언트 목록 조회 | 신규 |
| IDP-L6-API-002 | GET | /api/oidc-clients/:oidcClientId | 클라이언트 상세 조회 | 신규 |
| IDP-L6-API-003 | POST | /api/oidc-clients | 클라이언트 등록 | 신규 |
| IDP-L6-API-004 | PATCH | /api/oidc-clients/:oidcClientId | 클라이언트 수정 | 신규 |
| IDP-L6-API-005 | DELETE | /api/oidc-clients/:oidcClientId | 클라이언트 삭제 | 신규 |
| IDP-L6-API-006 | PATCH | /api/oidc-clients/:oidcClientId/toggle-active | 활성/비활성 토글 | 신규 |
| IDP-L6-API-007 | GET | /api/oidc-sessions | 세션/토큰 목록 조회 | 신규 |
| IDP-L6-API-008 | POST | /api/oidc-sessions/:key/revoke | 단건 세션 폐기 | 신규 |
| IDP-L6-API-009 | POST | /api/oidc-sessions/revoke-by-grant/:grantId | Grant 일괄 폐기 | 신규 |

### API 상세

#### IDP-L6-API-001: 클라이언트 목록 조회

**Endpoint**: `GET /api/oidc-clients`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| search | string | X | - | Client ID/이름 통합 검색 |
| isActive | boolean | X | - | 활성 상태 필터 |
| sort | string[] | X | -createdAt | 정렬 (clientName, createdAt) |
| skip | number | X | 0 | 건너뛸 수 |
| take | number | X | 20 | 가져올 수 (1-100) |

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "OIDC 클라이언트 목록 조회 성공";
  data: OidcClientDto[];
  meta: {
    total: number;
    skip: number;
    take: number;
    totalPages: number;
  };
}
```

#### IDP-L6-API-002: 클라이언트 상세 조회

**Endpoint**: `GET /api/oidc-clients/:oidcClientId`

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "OIDC 클라이언트 상세 조회 성공";
  data: OidcClientDto;
}
```

#### IDP-L6-API-003: 클라이언트 등록

**Endpoint**: `POST /api/oidc-clients`

**Request Body**:
```typescript
interface CreateOidcClientDto {
  clientId: string;           // 필수, unique, 3-64자
  clientSecret?: string;      // Confidential일 때만
  clientName: string;         // 필수, 1-128자
  redirectUris: string[];     // 필수, 최소 1개
  grantTypes: string[];       // 필수, 최소 1개
  responseTypes?: string[];   // 기본: ["code"]
  tokenEndpointAuthMethod?: string; // 기본: "client_secret_basic"
  scope?: string;             // 기본: "openid profile email"
  logoUri?: string;
  policyUri?: string;
  tosUri?: string;
}
```

**Response** (201 Created):
```typescript
{
  httpStatus: 201;
  message: "OIDC 클라이언트 등록 성공";
  data: OidcClientDto;
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 409 | "이미 존재하는 Client ID입니다" | clientId 중복 |

#### IDP-L6-API-004: 클라이언트 수정

**Endpoint**: `PATCH /api/oidc-clients/:oidcClientId`

**Request Body**: `UpdateOidcClientDto` (CreateOidcClientDto에서 clientId 제외, 모두 optional)

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "OIDC 클라이언트 수정 성공";
  data: OidcClientDto;
}
```

#### IDP-L6-API-005: 클라이언트 삭제

**Endpoint**: `DELETE /api/oidc-clients/:oidcClientId`

**동작**: removedAt 설정 (소프트 삭제)

**Response** (204 No Content)

#### IDP-L6-API-006: 활성/비활성 토글

**Endpoint**: `PATCH /api/oidc-clients/:oidcClientId/toggle-active`

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "OIDC 클라이언트 상태 변경 성공";
  data: OidcClientDto; // isActive 반전됨
}
```

#### IDP-L6-API-007: 세션/토큰 목록 조회

**Endpoint**: `GET /api/oidc-sessions`

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| modelType | string | X | - | 모델 타입 필터 (AccessToken, RefreshToken, Session, Grant 등) |
| skip | number | X | 0 | 건너뛸 수 |
| take | number | X | 20 | 가져올 수 |

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "OIDC 세션 목록 조회 성공";
  data: OidcSessionDto[];
  meta: {
    total: number;
    skip: number;
    take: number;
    totalPages: number;
  };
}
```

**OidcSessionDto**:
```typescript
interface OidcSessionDto {
  id: string;
  key: string;
  modelType: string;
  grantId: string | null;
  uid: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}
```

#### IDP-L6-API-008: 단건 세션 폐기

**Endpoint**: `POST /api/oidc-sessions/:key/revoke`

**Response** (204 No Content)

#### IDP-L6-API-009: Grant 일괄 폐기

**Endpoint**: `POST /api/oidc-sessions/revoke-by-grant/:grantId`

**동작**: 해당 Grant에 연결된 모든 토큰/세션 폐기

**Response** (204 No Content)

### Orval 생성 훅

```typescript
import {
  useGetOidcClients,
  useGetOidcClient,
  useCreateOidcClient,
  useUpdateOidcClient,
  useDeleteOidcClient,
  useToggleActiveOidcClient,
  useGetOidcSessions,
  useRevokeOidcSession,
  useRevokeOidcSessionsByGrant,
  prefetchGetOidcClients,
  prefetchGetOidcClient,
  prefetchGetOidcSessions,
} from "@cocrepo/api";
```

---

## Requirement Graph (L5-L6)

```json
{
  "nodes": [
    { "id": "IDP-L5-ACT-001", "level": 5, "type": "action", "label": "목록 로드" },
    { "id": "IDP-L5-ACT-002", "level": 5, "type": "action", "label": "검색 실행" },
    { "id": "IDP-L5-ACT-005", "level": 5, "type": "action", "label": "상세 페이지 이동" },
    { "id": "IDP-L5-ACT-006", "level": 5, "type": "action", "label": "상세 로드" },
    { "id": "IDP-L5-ACT-010", "level": 5, "type": "action", "label": "삭제 실행" },
    { "id": "IDP-L5-ACT-011", "level": 5, "type": "action", "label": "활성 토글" },
    { "id": "IDP-L5-ACT-016", "level": 5, "type": "action", "label": "등록 제출" },
    { "id": "IDP-L5-ACT-019", "level": 5, "type": "action", "label": "수정 제출" },
    { "id": "IDP-L5-ACT-021", "level": 5, "type": "action", "label": "세션 목록 로드" },
    { "id": "IDP-L5-ACT-023", "level": 5, "type": "action", "label": "단건 폐기" },
    { "id": "IDP-L5-ACT-024", "level": 5, "type": "action", "label": "Grant 일괄 폐기" },
    { "id": "IDP-L6-API-001", "level": 6, "type": "api", "label": "GET /api/oidc-clients", "metadata": { "method": "GET", "status": "new" } },
    { "id": "IDP-L6-API-002", "level": 6, "type": "api", "label": "GET /api/oidc-clients/:id", "metadata": { "method": "GET", "status": "new" } },
    { "id": "IDP-L6-API-003", "level": 6, "type": "api", "label": "POST /api/oidc-clients", "metadata": { "method": "POST", "status": "new" } },
    { "id": "IDP-L6-API-004", "level": 6, "type": "api", "label": "PATCH /api/oidc-clients/:id", "metadata": { "method": "PATCH", "status": "new" } },
    { "id": "IDP-L6-API-005", "level": 6, "type": "api", "label": "DELETE /api/oidc-clients/:id", "metadata": { "method": "DELETE", "status": "new" } },
    { "id": "IDP-L6-API-006", "level": 6, "type": "api", "label": "PATCH /api/oidc-clients/:id/toggle-active", "metadata": { "method": "PATCH", "status": "new" } },
    { "id": "IDP-L6-API-007", "level": 6, "type": "api", "label": "GET /api/oidc-sessions", "metadata": { "method": "GET", "status": "new" } },
    { "id": "IDP-L6-API-008", "level": 6, "type": "api", "label": "POST /api/oidc-sessions/:key/revoke", "metadata": { "method": "POST", "status": "new" } },
    { "id": "IDP-L6-API-009", "level": 6, "type": "api", "label": "POST /api/oidc-sessions/revoke-by-grant/:grantId", "metadata": { "method": "POST", "status": "new" } }
  ],
  "edges": [
    { "from": "IDP-L5-ACT-001", "to": "IDP-L6-API-001", "type": "calls" },
    { "from": "IDP-L5-ACT-002", "to": "IDP-L6-API-001", "type": "calls" },
    { "from": "IDP-L5-ACT-006", "to": "IDP-L6-API-002", "type": "calls" },
    { "from": "IDP-L5-ACT-010", "to": "IDP-L6-API-005", "type": "calls" },
    { "from": "IDP-L5-ACT-011", "to": "IDP-L6-API-006", "type": "calls" },
    { "from": "IDP-L5-ACT-016", "to": "IDP-L6-API-003", "type": "calls" },
    { "from": "IDP-L5-ACT-019", "to": "IDP-L6-API-004", "type": "calls" },
    { "from": "IDP-L5-ACT-021", "to": "IDP-L6-API-007", "type": "calls" },
    { "from": "IDP-L5-ACT-023", "to": "IDP-L6-API-008", "type": "calls" },
    { "from": "IDP-L5-ACT-024", "to": "IDP-L6-API-009", "type": "calls" }
  ]
}
```
