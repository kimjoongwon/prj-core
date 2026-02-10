# L3-L4: 기능, 화면

## 이전 레이어 요약 (L0-L2)

- **L0 Context**: OIDC 클라이언트 앱 관리 및 세션/토큰 관리
- **L1 Actor**: 시스템 관리자 (FULL_ACCESS)
- **L2 Goals**: 클라이언트 CRUD, 세션 조회/강제 폐기

---

## L3: 기능 (Feature)

### 기능 목록

| ID | 기능명 | 목표 연결 | 우선순위 | 설명 |
|----|--------|----------|----------|------|
| IDP-L3-FEA-001 | 클라이언트 목록 표시 | GOL-001 | 높음 | 페이지네이션이 적용된 OIDC 클라이언트 목록 |
| IDP-L3-FEA-002 | 클라이언트 검색 | GOL-001 | 높음 | Client ID/이름으로 검색 |
| IDP-L3-FEA-003 | 클라이언트 상세 정보 | GOL-002 | 높음 | 설정 상세 표시 (Secret 마스킹) |
| IDP-L3-FEA-004 | 클라이언트 등록 폼 | GOL-003 | 높음 | 클라이언트 앱 등록 폼 |
| IDP-L3-FEA-005 | 클라이언트 수정 폼 | GOL-004 | 높음 | 기존 설정 수정 폼 |
| IDP-L3-FEA-006 | 클라이언트 삭제 | GOL-005 | 중간 | 소프트 삭제 (removedAt 설정) |
| IDP-L3-FEA-007 | 클라이언트 활성/비활성 토글 | GOL-005 | 중간 | isActive 토글 |
| IDP-L3-FEA-008 | 세션 목록 표시 | GOL-006 | 높음 | 활성 세션/토큰 목록 (DB OidcModel 기반) |
| IDP-L3-FEA-009 | 세션 필터링 | GOL-006 | 중간 | 모델 타입별 필터 (AccessToken, RefreshToken, Session 등) |
| IDP-L3-FEA-010 | 세션 강제 폐기 | GOL-007 | 높음 | 단건 폐기 + Grant 단위 일괄 폐기 |

### 기능 상세

#### IDP-L3-FEA-001: 클라이언트 목록 표시

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 정렬 |
|------|------|------|------|
| Client ID | clientId | 200px | - |
| 이름 | clientName | 200px | 지원 |
| 인증 방식 | tokenEndpointAuthMethod | 150px | - |
| Grant Types | grantTypes | 200px | - |
| 활성 | isActive | 80px | - |
| 등록일 | createdAt | 120px | 지원 |

**페이지네이션**: 페이지당 20건, 크기 변경 10/20/50

#### IDP-L3-FEA-004: 클라이언트 등록 폼

**필드**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|:----:|------|
| clientId | Text Input | O | 고유 클라이언트 식별자 (영문+숫자+하이픈) |
| clientName | Text Input | O | 표시 이름 |
| clientSecret | Text Input | X | 비밀키 (자동 생성 버튼 제공, Public 클라이언트는 빈값) |
| redirectUris | Tag Input | O | 리다이렉트 URI 목록 (복수) |
| grantTypes | Checkbox Group | O | 허용할 Grant Type |
| responseTypes | Checkbox Group | O | 응답 타입 |
| tokenEndpointAuthMethod | Select | O | 토큰 엔드포인트 인증 방식 |
| scope | Text Input | O | 허용 스코프 (공백 구분) |
| logoUri | Text Input | X | 로고 URI |
| policyUri | Text Input | X | 정책 URI |
| tosUri | Text Input | X | 서비스 약관 URI |

**Grant Type 옵션**: `authorization_code`, `client_credentials`, `refresh_token`
**Auth Method 옵션**: `client_secret_basic`, `client_secret_post`, `none` (Public)

#### IDP-L3-FEA-008: 세션 목록 표시

**표시 컬럼**:

| 컬럼 | 필드 | 너비 | 설명 |
|------|------|------|------|
| 키 | key | 200px | jti 또는 uid (앞 8자리 + ...) |
| 모델 타입 | modelType | 130px | AccessToken, RefreshToken, Session 등 |
| Grant ID | grantId | 150px | 관련 Grant (일괄 폐기용) |
| 만료 시간 | expiresAt | 150px | 만료 시각 + 남은 시간 |
| 등록일 | createdAt | 120px | |
| 액션 | - | 100px | 폐기 버튼 |

---

## L4: 화면 (Screen)

### 화면 목록

| ID | 화면명 | 경로 | 기능 연결 | 설명 |
|----|--------|------|----------|------|
| IDP-L4-SCR-001 | 클라이언트 목록 | /oidc-clients | FEA-001, FEA-002 | OIDC 클라이언트 목록 |
| IDP-L4-SCR-002 | 클라이언트 상세 | /oidc-clients/[oidcClientId] | FEA-003, FEA-006, FEA-007 | 클라이언트 상세 + 삭제/토글 |
| IDP-L4-SCR-003 | 클라이언트 등록 | /oidc-clients/new | FEA-004 | 신규 클라이언트 등록 |
| IDP-L4-SCR-004 | 클라이언트 수정 | /oidc-clients/[oidcClientId]/edit | FEA-005 | 기존 클라이언트 수정 |
| IDP-L4-SCR-005 | 세션 목록 | /oidc-sessions | FEA-008, FEA-009, FEA-010 | 세션/토큰 조회 + 폐기 |

### 화면 상세

#### IDP-L4-SCR-001: 클라이언트 목록 화면

**경로**: `/oidc-clients`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: OIDC 클라이언트                                   │ │
│ │ Description: 시스템에 등록된 OIDC 클라이언트를 관리합니다 │ │
│ │ Actions: [+ 클라이언트 등록]                              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 검색 영역                                                │ │
│ │ [🔍 Client ID 또는 이름으로 검색...                    ] │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                 │ │
│ │ ┌──────────┬──────┬──────────┬───────────┬────┬─────┐   │ │
│ │ │Client ID │ 이름 │ 인증방식 │Grant Types│활성│등록일│   │ │
│ │ ├──────────┼──────┼──────────┼───────────┼────┼─────┤   │ │
│ │ │prj-core..│Admin │basic     │auth_code  │ ✅ │...  │   │ │
│ │ │prj-core..│Mobile│none      │auth_code  │ ✅ │...  │   │ │
│ │ └──────────┴──────┴──────────┴───────────┴────┴─────┘   │ │
│ │ [Pagination]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### IDP-L4-SCR-002: 클라이언트 상세 화면

**경로**: `/oidc-clients/[oidcClientId]`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: prj-core-admin                                    │ │
│ │ Description: PRJ Core Admin                              │ │
│ │ Actions: [수정] [삭제] [활성/비활성 토글]                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                                │ │
│ │ Client ID:     prj-core-admin                            │ │
│ │ Client Secret: ●●●●●●●●●●●● [보기] [복사]               │ │
│ │ 이름:          PRJ Core Admin                            │ │
│ │ 활성 상태:     ✅ 활성                                    │ │
│ │ 등록일:        2026-01-15 10:30                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 인증 설정                                │ │
│ │ 인증 방식:     client_secret_basic                       │ │
│ │ Grant Types:   [authorization_code] [refresh_token]      │ │
│ │ Response Types: [code]                                   │ │
│ │ 스코프:        openid profile email roles                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: Redirect URIs                            │ │
│ │ • http://localhost:3000/api/v1/auth/callback              │ │
│ │ • https://admin.example.com/api/v1/auth/callback          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 추가 정보                                │ │
│ │ 로고 URI:      -                                         │ │
│ │ 정책 URI:      -                                         │ │
│ │ 약관 URI:      -                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### IDP-L4-SCR-003: 클라이언트 등록 화면

**경로**: `/oidc-clients/new`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: OIDC 클라이언트 등록                              │ │
│ │ Description: 새 OIDC 클라이언트를 등록합니다              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 기본 정보                                │ │
│ │ Client ID:     [________________] (영문+숫자+하이픈)     │ │
│ │ Client Name:   [________________]                        │ │
│ │ Client Secret: [________________] [🔄 자동 생성]         │ │
│ │                ☐ Public 클라이언트 (Secret 없음)          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 인증 설정                                │ │
│ │ 인증 방식:     [client_secret_basic ▼]                   │ │
│ │ Grant Types:   ☑ authorization_code  ☐ client_credentials│ │
│ │                ☑ refresh_token                            │ │
│ │ Response Types: ☑ code                                   │ │
│ │ 스코프:        [openid profile email________________]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: Redirect URIs                            │ │
│ │ [http://localhost:3000/callback____________] [+ 추가]    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ SectionSurface: 추가 정보 (선택)                          │ │
│ │ 로고 URI:      [________________]                        │ │
│ │ 정책 URI:      [________________]                        │ │
│ │ 약관 URI:      [________________]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [취소] [등록]                                                │
└─────────────────────────────────────────────────────────────┘
```

#### IDP-L4-SCR-005: 세션 목록 화면

**경로**: `/oidc-sessions`

**레이아웃**:

```
┌─────────────────────────────────────────────────────────────┐
│ PageSurface                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: OIDC 세션/토큰                                    │ │
│ │ Description: 활성 세션 및 토큰을 관리합니다              │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 필터 영역                                                │ │
│ │ 모델 타입: [전체 ▼] AccessToken|RefreshToken|Session|... │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DataGrid (SectionSurface padding="none")                 │ │
│ │ ┌──────┬──────────┬─────────┬──────────┬──────┬─────┐   │ │
│ │ │  키  │모델 타입 │Grant ID │ 만료시간 │등록일│액션 │   │ │
│ │ ├──────┼──────────┼─────────┼──────────┼──────┼─────┤   │ │
│ │ │a1b2..│AccessTkn │g-001..  │2h 30m 남 │...   │[폐기]│  │ │
│ │ │c3d4..│RefreshTkn│g-001..  │29d 남    │...   │[폐기]│  │ │
│ │ │e5f6..│Session   │ -       │ -        │...   │[폐기]│  │ │
│ │ └──────┴──────────┴─────────┴──────────┴──────┴─────┘   │ │
│ │ [Pagination]                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**UI 상태**:

| 상태 | 조건 | 표시 |
|------|------|------|
| 로딩 | API 호출 중 | DataGrid 스켈레톤 |
| 빈 상태 | 결과 0건 | "활성 세션이 없습니다" |
| 에러 | API 실패 | 에러 메시지 + 재시도 버튼 |
| 정상 | 데이터 있음 | 목록 표시 |

**권한 체크**:
- CASL: `can('manage', 'oidcClient')` (클라이언트), `can('manage', 'oidcSession')` (세션)
- System Space (ROOT Category) 전용

---

## Requirement Graph (L3-L4)

```json
{
  "nodes": [
    { "id": "IDP-L3-FEA-001", "level": 3, "type": "feature", "label": "클라이언트 목록 표시" },
    { "id": "IDP-L3-FEA-002", "level": 3, "type": "feature", "label": "클라이언트 검색" },
    { "id": "IDP-L3-FEA-003", "level": 3, "type": "feature", "label": "클라이언트 상세 정보" },
    { "id": "IDP-L3-FEA-004", "level": 3, "type": "feature", "label": "클라이언트 등록 폼" },
    { "id": "IDP-L3-FEA-005", "level": 3, "type": "feature", "label": "클라이언트 수정 폼" },
    { "id": "IDP-L3-FEA-006", "level": 3, "type": "feature", "label": "클라이언트 삭제" },
    { "id": "IDP-L3-FEA-007", "level": 3, "type": "feature", "label": "클라이언트 활성/비활성 토글" },
    { "id": "IDP-L3-FEA-008", "level": 3, "type": "feature", "label": "세션 목록 표시" },
    { "id": "IDP-L3-FEA-009", "level": 3, "type": "feature", "label": "세션 필터링" },
    { "id": "IDP-L3-FEA-010", "level": 3, "type": "feature", "label": "세션 강제 폐기" },
    { "id": "IDP-L4-SCR-001", "level": 4, "type": "screen", "label": "클라이언트 목록", "metadata": { "path": "/oidc-clients" } },
    { "id": "IDP-L4-SCR-002", "level": 4, "type": "screen", "label": "클라이언트 상세", "metadata": { "path": "/oidc-clients/[oidcClientId]" } },
    { "id": "IDP-L4-SCR-003", "level": 4, "type": "screen", "label": "클라이언트 등록", "metadata": { "path": "/oidc-clients/new" } },
    { "id": "IDP-L4-SCR-004", "level": 4, "type": "screen", "label": "클라이언트 수정", "metadata": { "path": "/oidc-clients/[oidcClientId]/edit" } },
    { "id": "IDP-L4-SCR-005", "level": 4, "type": "screen", "label": "세션 목록", "metadata": { "path": "/oidc-sessions" } }
  ],
  "edges": [
    { "from": "IDP-L2-GOL-001", "to": "IDP-L3-FEA-001", "type": "achieves" },
    { "from": "IDP-L2-GOL-001", "to": "IDP-L3-FEA-002", "type": "achieves" },
    { "from": "IDP-L2-GOL-002", "to": "IDP-L3-FEA-003", "type": "achieves" },
    { "from": "IDP-L2-GOL-003", "to": "IDP-L3-FEA-004", "type": "achieves" },
    { "from": "IDP-L2-GOL-004", "to": "IDP-L3-FEA-005", "type": "achieves" },
    { "from": "IDP-L2-GOL-005", "to": "IDP-L3-FEA-006", "type": "achieves" },
    { "from": "IDP-L2-GOL-005", "to": "IDP-L3-FEA-007", "type": "achieves" },
    { "from": "IDP-L2-GOL-006", "to": "IDP-L3-FEA-008", "type": "achieves" },
    { "from": "IDP-L2-GOL-006", "to": "IDP-L3-FEA-009", "type": "achieves" },
    { "from": "IDP-L2-GOL-007", "to": "IDP-L3-FEA-010", "type": "achieves" },
    { "from": "IDP-L3-FEA-001", "to": "IDP-L4-SCR-001", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-002", "to": "IDP-L4-SCR-001", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-003", "to": "IDP-L4-SCR-002", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-006", "to": "IDP-L4-SCR-002", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-007", "to": "IDP-L4-SCR-002", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-004", "to": "IDP-L4-SCR-003", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-005", "to": "IDP-L4-SCR-004", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-008", "to": "IDP-L4-SCR-005", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-009", "to": "IDP-L4-SCR-005", "type": "displayed_on" },
    { "from": "IDP-L3-FEA-010", "to": "IDP-L4-SCR-005", "type": "displayed_on" }
  ]
}
```
