# Permission 화면 기획서

**플랫폼:** Web Admin
**작성일:** 2026-01-30

---

## 개요

CASL, RBAC, ABAC를 통합한 유연하고 확장 가능한 권한 관리 시스템을 구축하여 역할 기반 접근 제어, 속성 기반 접근 제어, 데이터 보호, 유연한 확장성을 제공합니다.

### 핵심 기능

| 기능 | 설명 |
|------|------|
| 역할 관리 | 역할(Role) 생성/수정/삭제 및 권한 할당 |
| 권한 관리 | Ability 관리 (Role 기본 권한, User 예외 권한) |
| Subject 관리 | 권한 대상(entity, menu, feature, ui) 관리 |
| Action 관리 | 행위(crud, visibility, bulk, workflow) 관리 |
| UI 가시성 | Role별 UI 요소 가시성 제어 (Mobile, Web Admin, Web User) |
| 데이터 마스킹 | 민감 정보 마스킹 처리 (이메일, 전화번호 등) |

### 라우팅 경로

| 화면 | 경로 | 설명 |
|------|------|------|
| 역할 목록 | `/roles` | 전체 역할 목록 |
| 역할 생성 | `/roles/new` | 새 역할 생성 |
| 역할 수정 | `/roles/[id]/edit` | 역할 상세 및 수정 |
| 권한 관리 | `/roles/abilities` | 권한 관리 메인 |
| Role 권한 | `/roles/abilities/roles` | Role별 권한 설정 |
| User 예외 권한 | `/roles/abilities/users` | User별 예외 권한 설정 |
| Subject 관리 | `/roles/abilities/subjects` | Subject 관리 |
| Action 관리 | `/roles/abilities/actions` | Action 관리 |
| UI 가시성 | `/roles/abilities/ui-elements` | UI 가시성 설정 |

---

## 문서 구조

| 문서 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 화면 개요 (L0-L2 기반) |
| [02-structure.md](./02-structure.md) | 화면 구조 (L3-L4 기반) |
| [03-interactions.md](./03-interactions.md) | 인터랙션 정의 (L5-L6 기반) |
| [04-ui-details.md](./04-ui-details.md) | UI 상세 (L7-L8 기반) |
| [05-technical-design.md](./05-technical-design.md) | 기술 설계서 |

---

## 진행 상황

- [x] 기획서 작성 완료
- [x] 기술 설계서 작성 완료
- [ ] 컴포넌트 구현 (Stage 4)
- [ ] 페이지 통합 (Stage 5)
