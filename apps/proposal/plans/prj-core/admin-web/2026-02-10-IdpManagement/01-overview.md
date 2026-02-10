# L0-L2: 컨텍스트, 사용자, 목표

## L0: 시스템 컨텍스트

### 도메인 정의

| 항목 | 내용 |
|------|------|
| **도메인명** | IdpManagement (IDP 관리) |
| **범위** | OIDC Client CRUD + 세션/토큰 조회/폐기 |
| **설명** | 시스템 관리자가 OIDC 클라이언트 앱을 등록/관리하고, 활성 세션을 조회하여 강제 폐기할 수 있는 기능 |

### 핵심 비즈니스 개념

- **OIDC Client**: OpenID Connect 프로토콜을 사용하는 클라이언트 애플리케이션 (admin, mobile, swagger 등)
- **OIDC Session**: 사용자가 인증 후 발급받은 세션 (Access Token, Refresh Token, Grant 포함)
- **Grant Type**: 클라이언트가 사용할 수 있는 인증 방식 (authorization_code, client_credentials 등)
- **Redirect URI**: 인증 완료 후 리다이렉트될 URI
- **PKCE**: Public 클라이언트의 인증 코드 탈취 방지 메커니즘

### 시스템 경계

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Web Application                     │
├─────────────────────────────────────────────────────────────┤
│  [OIDC Client 관리 화면]                                     │
│   - 클라이언트 목록/상세/등록/수정/삭제                       │
│                                                              │
│  [OIDC 세션 관리 화면]                                       │
│   - 활성 세션 목록 조회                                      │
│   - 세션 강제 폐기                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (신규)                        │
│  - GET/POST/PATCH/DELETE /api/oidc-clients                  │
│  - GET /api/oidc-sessions                                   │
│  - POST /api/oidc-sessions/:id/revoke                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         PostgreSQL (OidcClient, OidcModel 테이블)            │
│         Redis (oidc-provider 토큰/세션 저장소)               │
└─────────────────────────────────────────────────────────────┘
```

---

## L1: 사용자 (Actor)

### 사용자 정의

| ID | 사용자 | 역할 | 주요 행동 |
|----|--------|------|----------|
| IDP-L1-ACT-001 | 시스템 관리자 | FULL_ACCESS | OIDC 클라이언트 등록/수정/삭제, 세션 관리 |

### 사용자 특성

#### 시스템 관리자 (FULL_ACCESS)

- **목표**: IDP에 연결된 클라이언트 앱을 관리하고, 보안 사고 시 세션을 강제 폐기
- **기술 수준**: OIDC 프로토콜 기본 이해 (Client ID, Secret, Redirect URI, Scope 등)
- **접근 권한**: System Space (ROOT Category) 전용, CASL: `can('manage', 'oidcClient')`, `can('manage', 'oidcSession')`

---

## L2: 사용자 목표 (Goal)

### 목표 정의

| ID | 목표 | 사용자 | 우선순위 | 설명 |
|----|------|--------|----------|------|
| IDP-L2-GOL-001 | 클라이언트 목록 조회 | 시스템 관리자 | 높음 | 등록된 OIDC 클라이언트 현황 파악 |
| IDP-L2-GOL-002 | 클라이언트 상세 확인 | 시스템 관리자 | 높음 | 특정 클라이언트의 설정 상세 확인 |
| IDP-L2-GOL-003 | 클라이언트 등록 | 시스템 관리자 | 높음 | 새 클라이언트 앱 등록 |
| IDP-L2-GOL-004 | 클라이언트 수정 | 시스템 관리자 | 높음 | 기존 클라이언트 설정 변경 |
| IDP-L2-GOL-005 | 클라이언트 삭제 | 시스템 관리자 | 중간 | 불필요한 클라이언트 비활성화/삭제 |
| IDP-L2-GOL-006 | 활성 세션 조회 | 시스템 관리자 | 높음 | 현재 활성 상태인 세션/토큰 목록 확인 |
| IDP-L2-GOL-007 | 세션 강제 폐기 | 시스템 관리자 | 높음 | 보안 사고 시 특정 세션/토큰 강제 무효화 |

### 목표 상세

#### IDP-L2-GOL-001: 클라이언트 목록 조회

**동기**: 시스템에 연결된 클라이언트 앱 현황을 한눈에 파악

**성공 기준**:
- 전체 클라이언트 목록 표시 (활성/비활성 구분)
- Client ID, 이름, 인증 방식, 활성 상태 확인 가능
- 이름/Client ID로 검색 가능

#### IDP-L2-GOL-003: 클라이언트 등록

**동기**: 새 프론트엔드 앱이나 외부 서비스를 IDP에 연결

**성공 기준**:
- Client ID, Secret 자동/수동 생성
- Redirect URI, Grant Type, Scope 설정
- Public/Confidential 클라이언트 유형 구분

#### IDP-L2-GOL-006: 활성 세션 조회

**동기**: 현재 인증된 세션 현황 파악, 이상 세션 탐지

**성공 기준**:
- 세션별 사용자, 클라이언트, 스코프, 만료 시간 확인
- 모델 타입별 필터링 (AccessToken, RefreshToken, Session)
- 만료 예정/만료된 세션 구분

#### IDP-L2-GOL-007: 세션 강제 폐기

**동기**: 보안 사고 시 즉시 대응 (토큰 탈취, 비정상 접근 등)

**성공 기준**:
- 특정 세션/토큰 단건 폐기
- Grant 단위 일괄 폐기 (관련 모든 토큰 함께 폐기)
- 폐기 후 즉시 목록 갱신

---

## Requirement Graph (L0-L2)

```json
{
  "nodes": [
    {
      "id": "IDP-L0-CTX-001",
      "level": 0,
      "type": "context",
      "label": "IDP 관리 시스템",
      "description": "OIDC 클라이언트 앱 관리 및 세션/토큰 관리"
    },
    {
      "id": "IDP-L1-ACT-001",
      "level": 1,
      "type": "actor",
      "label": "시스템 관리자",
      "description": "FULL_ACCESS 역할의 시스템 관리자"
    },
    { "id": "IDP-L2-GOL-001", "level": 2, "type": "goal", "label": "클라이언트 목록 조회" },
    { "id": "IDP-L2-GOL-002", "level": 2, "type": "goal", "label": "클라이언트 상세 확인" },
    { "id": "IDP-L2-GOL-003", "level": 2, "type": "goal", "label": "클라이언트 등록" },
    { "id": "IDP-L2-GOL-004", "level": 2, "type": "goal", "label": "클라이언트 수정" },
    { "id": "IDP-L2-GOL-005", "level": 2, "type": "goal", "label": "클라이언트 삭제" },
    { "id": "IDP-L2-GOL-006", "level": 2, "type": "goal", "label": "활성 세션 조회" },
    { "id": "IDP-L2-GOL-007", "level": 2, "type": "goal", "label": "세션 강제 폐기" }
  ],
  "edges": [
    { "from": "IDP-L0-CTX-001", "to": "IDP-L1-ACT-001", "type": "has_actor" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-001", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-002", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-003", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-004", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-005", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-006", "type": "wants" },
    { "from": "IDP-L1-ACT-001", "to": "IDP-L2-GOL-007", "type": "wants" }
  ]
}
```
