# RBAC/ABAC 분리형 권한 시스템

**작성일:** 2025-12-30
**수정일:** 2026-01-13
**플랫폼:** Web (Admin/User) + Mobile (User)

---

## 5단계 개발 플로우 현황

```
Stage 1: 데이터 설계     ✅ 완료
Stage 2: 스키마 구현     ✅ 완료
Stage 3: 백엔드 로직     ✅ 완료
Stage 4: 컴포넌트 구현   ✅ 완료
Stage 5: 페이지 통합     ⏳ 대기
```

**다음 단계:**
```bash
/stage-orchestrator start stage=5 plan=2025-12-30-CASL-Permission-System
```

---

## 문서 구조

```
2025-12-30-CASL-Permission-System/
├── README.md                 ← 현재 문서 (개요 + 목차)
│
├── 01-philosophy.md          ← 설계 철학 (RBAC/ABAC 개념)
├── 02-scenarios.md           ← 현실 세계 예시 (F45 시나리오)
├── 03-admin-ui.md            ← 관리자 UI 화면 기획
│
└── ../2025-12-30-CASL-Permission-System-design.md
                              ← 기술 설계서 (Entity, API, DTO 등)
```

---

## 문서 목차

### 기획 문서 (이 폴더)

| 문서 | 설명 | 줄 수 |
|------|------|-------|
| [01-philosophy.md](./01-philosophy.md) | RBAC/ABAC 역할 분리, Subject 패턴 체계 | ~170줄 |
| [02-scenarios.md](./02-scenarios.md) | F45 피트니스 시나리오, 권한 흐름 예시 | ~490줄 |
| [03-admin-ui.md](./03-admin-ui.md) | 관리자 UI 와이어프레임, 화면 흐름 | ~450줄 |

### 기술 설계서 (별도 파일)

| 섹션 | 내용 |
|------|------|
| 5단계 개발 플로우 | Stage별 에이전트 작업 목록 및 상태 |
| 1. 설계 핵심 원칙 | DDD, Subject 패턴 |
| 2. 컴포넌트 분석 | 재사용/신규 컴포넌트 목록 |
| 3. Entity 설계 | Action, Ability, Subject 모델 |
| 4. Entity 클래스 | TypeScript 클래스 정의 |
| 5. CASL Types | 타입 정의 |
| 6. API 설계 | 엔드포인트, DTO |
| 7. Repository/Service 설계 | 레이어 구조 |
| 8. CASL Ability Factory | 팩토리 수정 사항 |
| 9. DTO 설계 | Request/Response DTO |
| 10. Seed 데이터 | 초기 데이터 |
| 11~12. 에이전트 실행 계획 | 구현 가이드 |

**설계서 바로가기:** [2025-12-30-CASL-Permission-System-design.md](../2025-12-30-CASL-Permission-System-design.md)

---

## 핵심 개념

### RBAC과 ABAC 역할 분리

| 구분 | RBAC | ABAC |
|------|------|------|
| **역할** | 메뉴/API 접근 제어 | 데이터 레벨 필터링 |
| **구현** | @RoleCategories 데코레이터 | CASL 라이브러리 |
| **대상** | menu:*, feature:* | entity:*, ui:* |

### Subject 패턴 체계

| 패턴 | 예시 | 용도 |
|------|------|------|
| `entity:xxx` | `entity:User` | 데이터 엔티티 |
| `menu:xxx` | `menu:settings` | 메뉴 접근 |
| `feature:xxx` | `feature:export` | 기능 접근 |
| `ui:xxx` | `ui:mobile-bottom-tab` | UI 요소 가시성 |

### Action 기반 가시성

| Action | 의미 | config |
|--------|------|--------|
| `read` | 전체 조회 | `null` |
| `read:masked:email` | 이메일 마스킹 | `{ type: "masking", preset: "PRESET_EMAIL" }` |
| `read:hidden` | 숨김 | `null` |

---

## 최신 변경 (2026-01-10)

- **Action 모델 도입**: `config: Json?` 필드로 마스킹/포맷팅 정의
- **FieldVisibility/MaskingPattern 제거**: Ability + Action으로 통합
- **UI Subject 패턴 추가**: `ui:xxx` 패턴으로 화면 요소 가시성 제어

---

## 관련 문서

- [5단계 분할 개발 플로우 가이드](../../../docs/STAGE-DEVELOPMENT-FLOW.md)
- [기술 설계자 에이전트](../../agents/etc-technical-designer.md)
- [기획자 에이전트](../../agents/etc-planner.md)
