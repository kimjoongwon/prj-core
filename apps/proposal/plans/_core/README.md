# 공통 시스템 기획 (_core)

이 폴더는 **프로젝트 독립적인 공통 시스템 기획**을 관리합니다.
모든 프로젝트(project-alpha, prj-core 등)에서 재사용 가능한 시스템을 정의합니다.

---

## 폴더 구조

```
_core/
├── infrastructure/          # 인프라 레이어
│   ├── 2026-01-31-CASL/    # 권한 시스템 (RBAC + ABAC)
│   ├── 2026-02-07-SpaceAccessControl/  # Space 기반 접근 제어
│   ├── Authentication/      # 인증 시스템 (예정)
│   └── MultiTenancy/        # 멀티테넌시 (예정)
│
├── navigation/              # 네비게이션 레이어
│   └── 2026-01-31-MenuSystem/  # 메뉴 시스템
│
├── ui-system/               # UI 시스템 레이어
│   ├── Surface/             # Surface/엘리베이션 (예정)
│   └── DataGrid/            # DataGrid 공통 (예정)
│
└── shared-domain/           # 공유 도메인 레이어
    ├── Role/                # 역할 관리 (예정)
    └── Tenant/              # 테넌트 관리 (예정)
```

---

## 카테고리별 역할

| 카테고리 | 역할 | 매핑되는 코드 |
|----------|------|---------------|
| `infrastructure/` | 인프라 레벨 공통 시스템 | `packages/be-common/`, `packages/store/` |
| `navigation/` | 네비게이션 관련 | `packages/store/`, `packages/constant/routing/` |
| `ui-system/` | UI 시스템 공통 | `packages/ui/src/components/` |
| `shared-domain/` | 여러 프로젝트 공유 도메인 | `packages/entity/`, `packages/service/` |

---

## 공통 시스템 판단 기준

| 조건 | → `_core/` | → `{project}/{app}/` |
|------|-----------|----------------------|
| 모든 프로젝트에서 필요한 기능 | ✅ | |
| `packages/`에 코드가 위치 | ✅ | |
| 비즈니스 로직이 프로젝트 무관 | ✅ | |
| 프로젝트 특수 요구사항 | | ✅ |
| 고객사별 커스터마이징 필요 | | ✅ |

---

## 프로젝트에서 참조하기

### 1. `_app.md` 파일에 사용하는 공통 시스템 명시

각 프로젝트/앱의 `_app.md` 파일에서 사용하는 공통 시스템을 명시합니다:

```markdown
# project-alpha/admin-web

## 사용하는 공통 시스템

| 공통 시스템 | 위치 | 커스터마이징 |
|------------|------|-------------|
| CASL 권한 | `/_core/infrastructure/2026-01-31-CASL/` | Subject 확장 |
| 메뉴 시스템 | `/_core/navigation/2026-01-31-MenuSystem/` | 메뉴 상수만 변경 |

## 프로젝트별 확장

- 추가 Subject: `member`, `reservation`
- 메뉴 상수: `packages/constant/src/routing/project-alpha-menu.ts`
```

### 2. 기획서 내에서 참조

프로젝트 기획서에서 공통 시스템을 참조할 때:

```markdown
## 의존하는 공통 시스템

> 권한 체계는 [CASL 기획서](/_core/infrastructure/2026-01-31-CASL/01-overview.md) 참조
```

---

## 공통 시스템 목록

### infrastructure/ - 인프라

| 시스템 | 폴더 | 설명 | 상태 |
|--------|------|------|------|
| CASL | `2026-01-31-CASL/` | RBAC+ABAC 권한 관리 | ✅ 완료 |
| SpaceAccessControl | `2026-02-07-SpaceAccessControl/` | Space 기반 접근 제어 (Guard/Interceptor/SpaceContext) | ✅ 완료 |
| Authentication | (예정) | 인증 시스템 | ⏳ 예정 |
| MultiTenancy | (예정) | 멀티테넌시 | ⏳ 예정 |

### navigation/ - 네비게이션

| 시스템 | 폴더 | 설명 | 상태 |
|--------|------|------|------|
| MenuSystem | `2026-01-31-MenuSystem/` | 3-depth 메뉴 시스템 | ✅ 완료 |

### ui-system/ - UI 시스템

| 시스템 | 폴더 | 설명 | 상태 |
|--------|------|------|------|
| Surface | (예정) | Surface/엘리베이션 시스템 | ⏳ 예정 |
| DataGrid | (예정) | DataGrid 공통 패턴 | ⏳ 예정 |

### shared-domain/ - 공유 도메인

| 시스템 | 폴더 | 설명 | 상태 |
|--------|------|------|------|
| Role | (예정) | 역할 관리 | ⏳ 예정 |
| Tenant | (예정) | 테넌트 관리 | ⏳ 예정 |

---

## orch-stage 연동

공통 시스템 기획을 위한 orch-stage 실행:

```bash
# 공통 시스템 기획 시작
/orch-stage full core=infrastructure feature=RateLimiting

# 기존 공통 시스템 수정
/orch-stage run stage=2 plan=_core/infrastructure/2026-01-31-CASL
```

---

## 변경 이력

| 날짜 | 변경 내용 |
|------|----------|
| 2026-01-31 | _core 구조 초기 생성, CASL/MenuSystem 이동 |
| 2026-02-07 | SpaceAccessControl 인프라 시스템 추가 |
