# Plans 폴더 가이드

기획/설계 문서를 관리하는 폴더입니다.

---

## 폴더 구조

```
.claude/plans/
├── README.md                              ← 현재 문서
│
├── {기능명}/                              ← 대형 기획 (800줄 이상)
│   ├── README.md                          ← 개요 + 목차 + 진행 상황
│   ├── 01-philosophy.md                   ← 설계 철학/개념
│   ├── 02-scenarios.md                    ← 시나리오/예시
│   ├── 03-admin-ui.md                     ← 관리자 UI
│   └── {기능명}-design.md                 ← 기술 설계서
│
└── YYYY-MM-DD-{기능명}.md                 ← 소형 기획 (800줄 미만)
```

---

## 네이밍 규칙

### 파일명
```
YYYY-MM-DD-{기능명}.md
YYYY-MM-DD-{기능명}-design.md     (기술 설계서)
YYYY-MM-DD-{기능명}-{서브}.md     (Mobile, Admin 등)
```

### 폴더명 (대형 기획)
```
YYYY-MM-DD-{기능명}/
```

---

## 기획 목록

### 권한/인증 시스템

| 기획 | 규모 | 상태 | 설명 |
|------|------|------|------|
| [CASL-Permission-System](./2025-12-30-CASL-Permission-System/) | 대형 | Stage 2 | RBAC/ABAC 분리형 권한 |
| [AdminAuthenticationSystem](./2026-01-01-AdminAuthenticationSystem/) | 대형 | - | 관리자 인증 시스템 |
| [AdminLoginPage](./2025-12-30-AdminLoginPage.md) | 소형 | - | 로그인 페이지 |
| [SignupSystem](./2025-12-30-SignupSystem/) | 대형 | - | 회원가입 시스템 |
| [AgreementSystem](./2025-12-30-AgreementSystem/) | 중형 | - | 약관 동의 시스템 |

### 레이아웃/UI 시스템

| 기획 | 규모 | 상태 | 설명 |
|------|------|------|------|
| [AdminLayoutAndMenuSystem](./2025-12-30-AdminLayoutAndMenuSystem/) | 소형 | - | Admin 레이아웃 (Desktop + Mobile) |
| [AdminSpaceSelectPage](./2025-12-30-AdminSpaceSelectPage.md) | 소형 | - | 공간 선택 페이지 |
| [UIConfigsPage](./2025-12-30-UIConfigsPage/) | 대형 | - | UI 설정 페이지 |

### 데이터 관리

| 기획 | 규모 | 상태 | 설명 |
|------|------|------|------|
| [AdminTemplateManagement](./2025-12-30-AdminTemplateManagement/) | 대형 | - | 템플릿 관리 |
| [TableMetadataSystem](./2026-01-03-TableMetadataSystem/) | 대형 | - | 테이블 메타데이터 |
| [AdminTableMetadataSystem](./2026-01-03-AdminTableMetadataSystem/) | 대형 | - | Admin 테이블 메타 |
| [MemberListPage](./2026-01-03-MemberListPage/) | 중형 | - | 회원 목록 페이지 |
| [UserList](./2026-01-18-UserList/) | 중형 | 완료 | 회원 목록 (CRUD) |

---

## 규모 기준

| 규모 | 줄 수 | 구조 |
|------|-------|------|
| 소형 | ~300줄 | 단일 파일 |
| 중형 | 300~800줄 | 단일 파일 (분리 선택) |
| 대형 | 800줄+ | **폴더 구조 권장** |

---

## 폴더 구조화 기준

### 폴더로 분리해야 하는 경우
- 800줄 이상의 대형 기획
- 기획서 + 기술 설계서가 분리된 경우
- 여러 플랫폼(Web/Mobile)을 다루는 경우

### 단일 파일로 유지해도 되는 경우
- 300줄 미만의 소형 기획
- 단일 페이지/기능 기획
- 기술 설계서가 포함되지 않은 경우

---

## 5단계 개발 플로우

기획 문서는 [5단계 분할 개발 플로우](../../docs/STAGE-DEVELOPMENT-FLOW.md)를 따릅니다.

```
Stage 1: 데이터 설계     → 기획서 + 설계서 작성
Stage 2: 스키마 구현     → Prisma, Entity, DTO
Stage 3: 백엔드 로직     → Repository, Service, Controller
Stage 4: 컴포넌트 구현   → UI, Widget, Feature
Stage 5: 페이지 통합     → Page, Route
```
