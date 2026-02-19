# Admin 도메인 기획 인덱스

> **프로젝트**: prj-core (자체 서비스)
> **앱**: admin-web (관리자 웹)

---

## 사용하는 공통 시스템

| 공통 시스템 | 위치 | 커스터마이징 |
|------------|------|-------------|
| CASL 권한 | [`packages/be-common/_spec/casl/`](../../../../../../packages/be-common/_spec/casl/) | 기본 사용 |
| 메뉴 시스템 | [`packages/common-constant/_spec/menu-system/`](../../../../../../packages/common-constant/_spec/menu-system/) | 메뉴 상수만 변경 |
| 인증/보안 | [`packages/be-common/_spec/auth-security/`](../../../../../../packages/be-common/_spec/auth-security/) | 기본 사용 |
| Space 접근 제어 | [`packages/be-common/_spec/space-access-control/`](../../../../../../packages/be-common/_spec/space-access-control/) | 기본 사용 |
| 네비게이션 | [`packages/fe-store/_spec/navigation/`](../../../../../../packages/fe-store/_spec/navigation/) | 기본 사용 |

---

## 프로젝트별 확장

### CASL Subject 확장

프로젝트에서 추가로 사용하는 Subject:

| Subject | Action | 설명 |
|---------|--------|------|
| `dashboard` | `read` | 대시보드 조회 |
| `user` | `read`, `create`, `update`, `delete` | 사용자 관리 |
| `admin` | `read`, `create`, `update`, `delete` | 관리자 관리 |
| `oidcClient` | `read`, `create`, `update`, `delete`, `manage` | OIDC 클라이언트 관리 |
| `oidcSession` | `read`, `manage` | OIDC 세션/토큰 관리 |

### 메뉴 상수 위치

- `packages/common-constant/src/routing/admin-menu.ts`

---

## 도메인 목록

| 도메인 | 폴더 | 상태 | 설명 |
|--------|------|------|------|
| User | [User/](./User/) | Stage 5 완료 | 이용자 목록 조회 (조회 전용) |
| Role | [Role/](./Role/) | Stage 6 완료 | 역할/권한/행위/대상 관리 (CASL 기반) |
| IdpManagement | [IdpManagement/](./IdpManagement/) | 기획 완료 | OIDC Client CRUD + 세션/토큰 관리 |
| MessageTemplate | [MessageTemplate/](./MessageTemplate/) | Stage 5 완료 | 메시지 템플릿 관리 |
| RoleGroupsAndCategories | [RoleGroupsAndCategories/](./RoleGroupsAndCategories/) | Stage 6 완료 | Role Group/Category 관리 |

---

## 기획서 구조

각 도메인 폴더는 다음 파일을 포함합니다:

```
_domain/[도메인]/
├── 01-overview.md             # L0-L2: 컨텍스트/사용자/목표
├── 02-structure.md            # L3-L4: 기능/화면 구조
├── 03-interactions.md         # L5-L6: 인터랙션/API (도메인 전체)
├── 04-ui-details.md           # L7-L8: 데이터 모델/컴포넌트
├── 05-technical-design.md     # L9-L10: 비즈니스 로직/테스트
├── domain-graph.json          # 요구사항 그래프 (있는 경우)
├── README.md                  # 도메인 개요 (있는 경우)
└── PROGRESS.md                # 개발 진행 상황
```

화면별 스펙은 각 라우트 폴더의 `_spec/` 디렉토리에 위치합니다:

```
[라우트]/_spec/
└── 03-interactions.md         # 해당 화면의 인터랙션 추출
```

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-02-18 | 기획서 마이그레이션 (중앙집중 → 코드 인접 분산 구조) |
| 2026-02-17 | MessageTemplate, RoleGroupsAndCategories 기능 추가 |
| 2026-02-14 | Role 기능 전체 재기획 (권한 관리 확장) |
| 2026-02-10 | IdpManagement 기능 기획 추가 |
| 2026-02-02 | User 기능 기획 추가 |
| 2026-01-31 | 초기 생성 |
