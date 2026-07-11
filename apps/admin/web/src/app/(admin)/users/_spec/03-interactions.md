# L5-L6: 인터랙션, API

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: 이용자 조회 시스템 (조회 전용)
- **L1 행위자**: 관리자
- **L2 Goals**: 목록 조회, 검색, 필터링, 정렬
- **L3 Features**: 목록 표시, 통합 검색, 필터 패널, 정렬, 통계
- **L4 Screen**: 이용자 목록 화면 (`/users`)

---

## L5: 인터랙션 (Action)

### 화면별 인터랙션

#### USR-L4-SCR-001: 이용자 목록 화면

| ID | 액션 | 트리거 | 효과 | 연결 기능 |
|----|------|--------|------|----------|
| USR-L5-ACT-001 | 페이지 초기 로드 | 화면 진입 | API 호출, 목록 렌더링 | FEA-001, FEA-005 |
| USR-L5-ACT-002 | 검색어 입력 | Input 입력 | 검색어 상태 업데이트 | FEA-002 |
| USR-L5-ACT-003 | 검색 실행 | Enter 또는 버튼 클릭 | API 재호출 | FEA-002 |
| USR-L5-ACT-004 | 필터 패널 토글 | 필터 버튼 클릭 | 패널 펼침/접힘 | FEA-003 |
| USR-L5-ACT-005 | 필터 값 변경 | 필터 컨트롤 조작 | 필터 상태 업데이트 + API 재호출 | FEA-003 |
| USR-L5-ACT-006 | 필터 초기화 | 초기화 버튼 클릭 | 모든 필터 초기화 + API 재호출 | FEA-003 |
| USR-L5-ACT-007 | 정렬 변경 | 컬럼 헤더 클릭 | 정렬 상태 변경 + API 재호출 | FEA-004 |
| USR-L5-ACT-008 | 페이지 변경 | 페이지 번호 클릭 | 페이지 상태 변경 + API 재호출 | FEA-001 |
| USR-L5-ACT-009 | 페이지 크기 변경 | 페이지 크기 선택 | 페이지 크기 변경 + API 재호출 | FEA-001 |

### 인터랙션 상세

#### USR-L5-ACT-001: 페이지 초기 로드

```
[트리거] 화면 진입 (useEffect / SSR Prefetch)
    │
    ├─[1] 권한 체크: can('read', 'user')
    │      └─ 권한 없음 → 접근 불가 화면 표시
    │
    ├─[2] API 호출: GET /api/users
    │      - page: 1, limit: 20 (기본값)
    │      - X-Space-ID 헤더 포함
    │
    ├─[3] 응답 처리
    │      ├─ 성공 → 목록 렌더링
    │      └─ 실패 → 에러 메시지 표시
```

#### USR-L5-ACT-003: 검색 실행

```
[트리거] Enter 키 또는 검색 버튼 클릭
    │
    ├─[1] 검색어 유효성 확인
    │      └─ 공백만 입력 → 검색어 초기화로 처리
    │
    ├─[2] 쿼리 파라미터 구성
    │      - search: 입력된 검색어
    │      - page: 1 (검색 시 첫 페이지로)
    │      - 기존 필터/정렬 유지
    │
    ├─[3] API 호출: GET /api/users?search=...
    │
    └─[4] 결과 처리
           ├─ 결과 있음 → 목록 렌더링
           └─ 결과 없음 → "검색 결과가 없습니다" 표시
```

#### USR-L5-ACT-005: 필터 값 변경

```
[트리거] 필터 컨트롤 값 변경
    │
    ├─[1] 필터 상태 업데이트
    │      - roles: string[] (복수 선택)
    │      - status: UserStatus (단일)
    │      - categoryId: string (단일)
    │      - groupIds: string[] (복수 선택)
    │      - createdFrom: Date
    │      - createdTo: Date
    │
    ├─[2] 쿼리 파라미터 구성
    │      - page: 1 (필터 변경 시 첫 페이지로)
    │      - 검색어 유지
    │
    ├─[3] API 호출: GET /api/users?roles=...&status=...
    │
    └─[4] 목록 갱신
```

#### USR-L5-ACT-007: 정렬 변경

```
[트리거] 정렬 가능한 컬럼 헤더 클릭
    │
    ├─[1] 정렬 상태 토글
    │      - 현재 없음 → ASC
    │      - 현재 ASC → DESC
    │      - 현재 DESC → 없음
    │
    ├─[2] 쿼리 파라미터 구성
    │      - sort: 정렬 필드 배열 (JSON:API 컨벤션)
    │      - 부호 없음=ASC, -prefix=DESC (예: name, -createdAt)
    │      - 기존 검색/필터/페이지 유지
    │
    ├─[3] API 호출: GET /api/users?sort=name&sort=-createdAt
    │
    └─[4] 목록 갱신 (정렬 아이콘 상태 업데이트)
```

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| USR-L6-API-001 | GET | /api/users | 이용자 목록 조회 | 기존 구현 |
| USR-L6-API-002 | GET | /api/users/:id | 이용자 상세 조회 | 기존 구현 (미사용) |

### API 상세

#### USR-L6-API-001: 이용자 목록 조회

**기존 API 사용** - `apps/server/src/module/users/users.controller.ts`

**Endpoint**: `GET /api/users`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | 현재 Space ID |

**Query Parameters**:
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|:----:|--------|------|
| search | string | X | - | 통합 검색어 (이름, 이메일, 전화번호) |
| roles | string[] | X | - | 역할 필터 (복수) |
| status | enum | X | - | 상태 필터 (active, inactive, removed) |
| categoryId | uuid | X | - | 분류 카테고리 ID |
| groupIds | string[] | X | - | 그룹 ID 목록 (복수) |
| createdFrom | date | X | - | 가입일 시작 |
| createdTo | date | X | - | 가입일 종료 |
| sort | string[] | X | -createdAt | 복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, email |
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 20 | 페이지 크기 (1-100) |

**Response** (200 OK):
```typescript
interface Response {
  httpStatus: 200;
  message: "회원 목록 조회 성공";
  data: UserDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**UserDto 구조**:
```typescript
interface UserDto {
  id: string;
  seq: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date | null;
  removedAt: Date | null;
  profiles?: ProfileDto[];
  tenants?: TenantDto[];
  associations?: UserAssociationDto[];
  classification?: UserClassificationDto;
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "사용자를 찾을 수 없습니다" | 인증 실패 |
| 401 | "Space가 선택되지 않았습니다" | X-Space-ID 누락 |
| 500 | "Internal Server Error" | 서버 오류 |

### Orval 생성 훅

이 API는 Orval이 자동 생성한 React Query 훅을 사용합니다:

```typescript
// @cocrepo/api에서 import
import {
  useGetUsers,
  getGetUsersQueryKey,
  prefetchGetUsers
} from "@cocrepo/api";

// 사용 예시
const { data, isLoading, isError } = useGetUsers({
  search: "홍길동",
  roles: ["admin", "user"],
  status: "active",
  page: 1,
  limit: 20,
  sort: ["-createdAt"],
});
```

---

## Requirement Graph (L5-L6)

```json
{
  "nodes": [
    {
      "id": "USR-L5-ACT-001",
      "level": 5,
      "type": "action",
      "label": "페이지 초기 로드",
      "description": "화면 진입 시 권한 체크 및 API 호출"
    },
    {
      "id": "USR-L5-ACT-002",
      "level": 5,
      "type": "action",
      "label": "검색어 입력",
      "description": "검색창에 검색어 입력"
    },
    {
      "id": "USR-L5-ACT-003",
      "level": 5,
      "type": "action",
      "label": "검색 실행",
      "description": "Enter 또는 버튼 클릭으로 검색 실행"
    },
    {
      "id": "USR-L5-ACT-004",
      "level": 5,
      "type": "action",
      "label": "필터 패널 토글",
      "description": "필터 패널 펼침/접힘"
    },
    {
      "id": "USR-L5-ACT-005",
      "level": 5,
      "type": "action",
      "label": "필터 값 변경",
      "description": "필터 조건 변경 및 목록 갱신"
    },
    {
      "id": "USR-L5-ACT-006",
      "level": 5,
      "type": "action",
      "label": "필터 초기화",
      "description": "모든 필터 초기화"
    },
    {
      "id": "USR-L5-ACT-007",
      "level": 5,
      "type": "action",
      "label": "정렬 변경",
      "description": "컬럼별 정렬 토글"
    },
    {
      "id": "USR-L5-ACT-008",
      "level": 5,
      "type": "action",
      "label": "페이지 변경",
      "description": "페이지 이동"
    },
    {
      "id": "USR-L5-ACT-009",
      "level": 5,
      "type": "action",
      "label": "페이지 크기 변경",
      "description": "페이지당 표시 건수 변경"
    },
    {
      "id": "USR-L6-API-001",
      "level": 6,
      "type": "api",
      "label": "GET /api/users",
      "description": "이용자 목록 조회 API (기존 구현)",
      "metadata": {
        "method": "GET",
        "path": "/api/users",
        "status": "existing"
      }
    }
  ],
  "edges": [
    { "from": "USR-L3-FEA-001", "to": "USR-L5-ACT-001", "type": "triggers" },
    { "from": "USR-L3-FEA-001", "to": "USR-L5-ACT-008", "type": "triggers" },
    { "from": "USR-L3-FEA-001", "to": "USR-L5-ACT-009", "type": "triggers" },
    { "from": "USR-L3-FEA-002", "to": "USR-L5-ACT-002", "type": "triggers" },
    { "from": "USR-L3-FEA-002", "to": "USR-L5-ACT-003", "type": "triggers" },
    { "from": "USR-L3-FEA-003", "to": "USR-L5-ACT-004", "type": "triggers" },
    { "from": "USR-L3-FEA-003", "to": "USR-L5-ACT-005", "type": "triggers" },
    { "from": "USR-L3-FEA-003", "to": "USR-L5-ACT-006", "type": "triggers" },
    { "from": "USR-L3-FEA-004", "to": "USR-L5-ACT-007", "type": "triggers" },
    { "from": "USR-L5-ACT-001", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-003", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-005", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-006", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-007", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-008", "to": "USR-L6-API-001", "type": "calls" },
    { "from": "USR-L5-ACT-009", "to": "USR-L6-API-001", "type": "calls" }
  ]
}
```
