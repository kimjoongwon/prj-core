# 03-interactions: 템플릿 목록 화면

## 이전 레이어 요약 (L0-L4)

- **L0 Context**: 템플릿 관리 (Email/SMS/Push 채널 CRUD + 변수 관리 + 미리보기 + 발송 테스트)
- **L1 행위자**: 시스템 관리자 (PLATFORM_ADMIN), Company 관리자 (COMPANY_MANAGER, 향후 확장)
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
| MT-L5-ACT-006 | 등록 페이지 이동 | 등록 버튼 클릭 | /templates/new로 이동 | FEA-007 |
| MT-L5-ACT-007 | 상세 페이지 이동 | 행 클릭 | /templates/[templateId]로 이동 | FEA-005 |
| MT-L5-ACT-008 | 인라인 활성 토글 | Switch 클릭 | PATCH toggle-status API 호출, 행 상태 갱신 | FEA-010 |

### 인터랙션 상세

#### MT-L5-ACT-008: 인라인 활성 토글 (목록)

```
[트리거] 목록 행의 Switch 클릭
    |
    +--[1] Optimistic UI: Switch 상태 즉시 전환
    |
    +--[2] API 호출: PATCH /api/v1/templates/:templateId/toggle-status
    |
    +--[3] 응답 처리
    |      +-- 성공 (200) -> 성공 토스트 ("템플릿이 활성화되었습니다" / "비활성화되었습니다")
    |      +-- 실패 -> Rollback (Switch 원래 상태), 에러 토스트
    |
    +--[4] 목록 캐시 갱신 (해당 행 데이터만 업데이트)
```

### 상태 변화 흐름

#### 목록 화면 상태 흐름

```
[페이지 진입]
    |
    v
[로딩 상태] <-- GET /api/v1/templates
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

### 피드백 메시지

| 상황 | 유형 | 메시지 |
|------|------|--------|
| 활성화 성공 | success | "템플릿이 활성화되었습니다." |
| 비활성화 성공 | success | "템플릿이 비활성화되었습니다." |
| 권한 없음 (403) | warning | "해당 작업을 수행할 권한이 없습니다." |
| 네트워크 에러 | error | "네트워크 오류가 발생했습니다." |

---

## L6: API

### API 목록

| ID | 메서드 | 경로 | 설명 | 상태 |
|----|--------|------|------|------|
| MT-L6-API-001 | GET | /api/v1/templates | 템플릿 목록 조회 | 신규 |
| MT-L6-API-006 | PATCH | /api/v1/templates/:templateId/toggle-status | 활성/비활성 토글 | 신규 |

### API 상세

---

#### MT-L6-API-001: 템플릿 목록 조회

**Endpoint**: `GET /api/v1/templates`

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
  message: "템플릿 목록 조회 성공";
  data: TemplateDto[];
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

#### MT-L6-API-006: 활성/비활성 토글

**Endpoint**: `PATCH /api/v1/templates/:templateId/toggle-status`

**Headers**:
| 헤더 | 필수 | 설명 |
|------|:----:|------|
| Authorization | O | Bearer {accessToken} |
| X-Space-ID | O | System Space ID |

**Path Parameters**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|:----:|------|
| templateId | string (decimal string) | O | 템플릿 ID |

**동작**: isActive 값을 반전 (true -> false, false -> true)

**Response** (200 OK):
```typescript
{
  httpStatus: 200;
  message: "템플릿 상태 변경 성공";
  data: TemplateDto; // isActive가 반전된 상태
}
```

**Errors**:
| 상태 | 메시지 | 조건 |
|------|--------|------|
| 401 | "인증이 필요합니다" | 토큰 없음/만료 |
| 403 | "접근 권한이 없습니다" | 권한 부족 |
| 404 | "존재하지 않는 템플릿입니다" | ID 미존재 |

### API 호출 흐름

| 화면 | 액션 | API | 성공 시 | 실패 시 |
|------|------|-----|--------|--------|
| 목록 | 페이지 진입 | GET /api/v1/templates | 목록 표시 | 에러 메시지 |
| 목록 | 검색 | GET /api/v1/templates?search=... | 목록 갱신 | 에러 토스트 |
| 목록 | 유형 필터 | GET /api/v1/templates?type=EMAIL | 목록 갱신 | 에러 토스트 |
| 목록 | 상태 필터 | GET /api/v1/templates?isActive=true | 목록 갱신 | 에러 토스트 |
| 목록 | 인라인 토글 | PATCH .../:id/toggle-status | 행 갱신 + 성공 토스트 | 롤백 + 에러 토스트 |

### Orval 생성 훅

```typescript
import {
  // 목록 조회
  useGetTemplates,

  // 특수 액션
  useToggleStatusTemplate,

  // SSR Prefetch
  prefetchGetTemplates,

  // Query Key (캐시 무효화용)
  getGetTemplatesQueryKey,
} from "@cocrepo/api";
```
