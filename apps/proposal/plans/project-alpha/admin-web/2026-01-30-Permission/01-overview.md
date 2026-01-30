# 01. 화면 개요

> L0-L2 레이어 기반 기획서

---

## 1. 시스템 컨텍스트 (L0)

**시스템:** 권한 관리 시스템 (Permission Management System)

**목적:** CASL, RBAC, ABAC를 통합한 유연하고 확장 가능한 권한 관리 시스템 구축

**핵심 가치:**
- **보안:** 다층 보안 체계 (프론트엔드 → API Gateway → Service → Database)
- **유연성:** RBAC + ABAC 통합으로 정적/동적 권한 제어
- **확장성:** 새로운 Subject, Action, Ability 쉽게 추가
- **편의성:** 관리자 UI로 직관적인 권한 관리

---

## 2. 사용자 (L1 - Actor)

### 2.1 주요 사용자

| 사용자 (Actor) | 설명 | 권한 레벨 |
|---------------|------|-----------|
| **SUPER_ADMIN** | 시스템 최고 관리자 | 모든 권한 보유 |
| **ADMIN** | 일반 관리자 | 관리 권한, 전체 데이터 접근 |
| **USER** | 일반 사용자 | 본인 정보만 접근 |

### 2.2 사용자별 접근 범위

| 사용자 | 메뉴 접근 | 데이터 접근 | 관리 기능 |
|--------|----------|-----------|----------|
| SUPER_ADMIN | 전체 메뉴 | 전체 Space | 모든 기능 |
| ADMIN | 전체 메뉴 | 전체 Space | 모든 기능 |
| USER | 마이페이지만 | 본인 Space 제한 | 없음 |

---

## 3. 사용자 목표 (L2 - Goal)

### 3.1 SUPER_ADMIN 목표

| 목표 (Goal) | 설명 | 우선순위 |
|-----------|------|---------|
| 시스템 역할 관리 | 시스템 기본 역할(SUPER_ADMIN, ADMIN, USER) 관리 | 높음 |
| 커스텀 역할 생성 | 새로운 역할 생성 및 권한 부여 | 중간 |
| 전체 권한 감사 | 모든 사용자의 권한 현황 파악 | 중간 |
| 시스템 모니터링 | 권한 시스템 정상 작동 확인 | 낮음 |

### 3.2 ADMIN 목표

| 목표 (Goal) | 설명 | 우선순위 |
|-----------|------|---------|
| 사용자 권한 부여 | 사용자에게 역할 할당 | 높음 |
| 예외 권한 관리 | 특정 사용자의 예외 권한 설정 | 중간 |
| 권한 템플릿 활용 | 자주 사용하는 권한 조합 적용 | 중간 |

### 3.3 USER 목표

| 목표 (Goal) | 설명 | 우선순위 |
|-----------|------|---------|
| 본인 정보 조회 | 본인 프로필 및 정보 확인 | 높음 |
| 본인 정보 수정 | 프로필 수정 가능 | 높음 |
| 내 Space 리소스 접근 | 소속된 Space 내 리소스 접근 | 중간 |

---

## 4. 시스템 구조

### 4.1 권한 구성 요소

| 구성 요소 | 설명 | 예시 |
|----------|------|------|
| **Role** | 역할 | SUPER_ADMIN, ADMIN, USER |
| **Subject** | 권한 대상 | entity:User, menu:members, feature:export |
| **Action** | 행위 | create, read, update, delete, read:masked:email |
| **Ability** | Role 또는 User에 부여되는 구체적인 권한 | ADMIN can READ entity:User |
| **Tenant** | User + Space + Role 연결 | User alice가 Space A에서 ADMIN 역할 |

### 4.2 권한 체계

```
RBAC (Role-Based Access Control)
  Role → Ability → (Subject + Action + Conditions)

ABAC (Attribute-Based Access Control)
  Ability.conditions → { "field": "${variable}" }
  예: { "id": "${user.id}" } (본인 정보만 접근)
```

### 4.3 권한 병합 전략

```
1. Role 기본 권한 조회 (priority 0)
2. User 예외 권한 조회 (priority 10+)
3. Priority 기반 병합 (높은 Priority가 우선)
4. Subject + Action 조합으로 중복 제거
```

---

## 5. 핵심 시나리오

### 5.1 일반 사용자가 본인 정보만 수정

- USER Role: 본인 정보만 READ/UPDATE
- ADMIN Role: 모든 사용자 READ/UPDATE
- Conditions: `{ "id": "${user.id}" }`

### 5.2 사용자 예외 권한

- alice 사용자: USER Role이지만 특정 Space의 Ground를 관리
- bob 사용자: USER Role이지만 본인 Ground를 삭제 금지
- User 예외 권한의 Priority가 Role 기본 권한보다 높음

### 5.3 민감 정보 마스킹

- USER Role: 이메일 마스킹 표시 (`ex***@example.com`)
- ADMIN Role: 이메일 원본 표시
- Action: `READ:MASKED:EMAIL` vs `READ:FULL`

### 5.4 UI 가시성 제어

- USER Role: 마이페이지만 접근
- ADMIN Role: 모든 메뉴 접근
- SUPER_ADMIN: 모든 UI 요소 표시
- Subject: `menu:xxx`, `ui:xxx`

---

## 6. 보안 가이드라인

### 6.1 템플릿 변수 보안

**허용된 변수만 치환:**
- `${user.id}` - 사용자 ID
- `${user.spaceId}` - 사용자 기본 Space ID
- `${user.currentSpaceId}` - 현재 선택된 Space ID
- `${user.email}` - 사용자 이메일
- `${user.name}` - 사용자 이름
- `${user.currentTenantId}` - 현재 Tenant ID
- `${user.currentRoleId}` - 현재 Role ID

### 6.2 권한 검증 위치

| 레이어 | 검증 대상 | 목적 |
|-------|----------|------|
| **프론트엔드** | UI 가시성 | 사용자 경험 개선 |
| **API Gateway** | 엔드포인트 접근 | 미인증 요청 차단 |
| **서비스 레이어** | 비즈니스 로직 | 비즈니스 규칙 강제 |
| **데이터베이스** | 데이터 접근 | 마지막 보안 계층 |

### 6.3 민감 정보 보호

**마스킹 레벨:**
| 레벨 | Action | 설명 | 예시 |
|-----|--------|------|------|
| **FULL** | READ:FULL | 원본 표시 | example@domain.com |
| **HIDDEN** | READ:HIDDEN | 숨김 | *** |
| **MASKED** | READ:MASKED:* | 마스킹 | ex***@domain.com |

---

## 7. 향후 개선 사항

| 기능 | 설명 | 우선순위 |
|-----|------|---------|
| 조직 권한 그룹 | 부서/팀별 권한 그룹핑 | 높음 |
| 시간 기반 권한 | 일시적 권한 부여 (만료일자 설정) | 중간 |
| 승인 워크플로우 | 권한 승인 요청 및 이력 관리 | 낮음 |
| 권한 템플릿 | 자주 사용하는 권한 조합 템플릿화 | 중간 |
| 권한 시뮬레이터 | 특정 사용자의 권한 미리보기 | 높음 |
| 권한 영향도 분석 | 권한 변경 영향 범위 분석 | 낮음 |
