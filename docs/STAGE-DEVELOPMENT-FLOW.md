# 5단계 분할 개발 플로우 가이드

페이지/기능 개발 시 5단계로 나누어 각 단계별 사용자 리뷰를 받으며 진행하는 개발 방식입니다.

## 목차

- [개요](#개요)
- [플로우 다이어그램](#플로우-다이어그램)
- [사용법](#사용법)
- [Stage별 상세 가이드](#stage별-상세-가이드)
- [실전 예시](#실전-예시)
- [변경 발생 시 대응](#변경-발생-시-대응)
- [핵심 원칙](#핵심-원칙)

---

## 개요

### 왜 5단계로 나누나요?

| 기존 방식 | 5단계 방식 |
|----------|-----------|
| 전체 구현 후 리뷰 | 단계별 리뷰로 조기 피드백 |
| 변경 시 전체 재작업 | 해당 단계부터만 재시작 |
| 산출물 추적 어려움 | 단계별 문서 자동 생성 |

### 장점

- **조기 피드백**: 잘못된 방향으로 가기 전에 수정 가능
- **영향 범위 최소화**: Entity 변경 시 Stage 2부터, API 변경 시 Stage 3부터 재시작
- **문서화 자동화**: 각 단계별 산출물 문서 생성
- **병렬 작업 가능**: Stage 4에서 컴포넌트들을 병렬로 생성

---

## 플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│ Stage 1: 데이터 설계                                         │
│ planner → technical-designer → [사용자 리뷰] ✓              │
│ 산출물: 기획.md, 기획-design.md                              │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 2: 스키마 구현                                         │
│ schema-builder → entity-builder → dto-builder → seed-maker  │
│ → [사용자 리뷰] ✓                                            │
│ 산출물: 기획-schema.md                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 3: 백엔드 로직                                         │
│ repository-builder → service-builder → facade-builder       │
│ → controller-builder → [사용자 리뷰] ✓                       │
│ 산출물: 기획-backend.md                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인 + Orval 실행
┌─────────────────────────────────────────────────────────────┐
│ Stage 4: 컴포넌트 구현                                       │
│ ui-component → widget-builder → feature-builder (병렬 가능)  │
│ → [사용자 리뷰] ✓                                            │
│ 산출물: 기획-components.md                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓ 사용자 승인
┌─────────────────────────────────────────────────────────────┐
│ Stage 5: 페이지 통합                                         │
│ page-builder → page-reviewer → [사용자 리뷰] ✓               │
│ 산출물: 기획-complete.md                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 사용법

### 전체 실행 (Stage 1부터)

새 기능을 처음부터 개발할 때 사용합니다.

```
/orch-stage full

**페이지명:** MemberListPage
**요구사항:**
- 회원 목록 조회
- 검색 및 필터링
- 회원 등록/수정/삭제
```

### 특정 단계부터 시작

이미 기획/설계가 완료된 상태에서 시작할 때 사용합니다.

```
/orch-stage start stage=3

**기획서:** apps/proposal/plans/2026-01-10-MemberList.md
**설계서:** apps/proposal/plans/2026-01-10-MemberList-design.md
```

### 특정 단계만 실행

특정 단계만 다시 실행할 때 사용합니다.

```
/orch-stage run stage=2

**설계서:** apps/proposal/plans/2026-01-10-MemberList-design.md
```

### 상태 확인

현재 진행 상태를 확인합니다.

```
/orch-stage status

**기획서:** apps/proposal/plans/2026-01-10-MemberList.md
```

---

## Stage별 상세 가이드

### Stage 1: 데이터 설계

**목표:** 요구사항에서 기획서와 기술 설계서 작성

**호출되는 에이전트:**
1. `planner` (또는 `design-analyzer` - Figma 있을 때)
2. `technical-designer`

**산출물:**
| 파일 | 설명 |
|------|------|
| `apps/proposal/plans/YYYY-MM-DD-{기능명}.md` | 화면 기획서 |
| `apps/proposal/plans/YYYY-MM-DD-{기능명}-design.md` | 기술 설계서 |

**리뷰 포인트:**
- Entity 설계가 요구사항에 맞는가?
- API 설계가 적절한가?
- 컴포넌트 분류가 올바른가?

---

### Stage 2: 스키마 구현

**목표:** Prisma 스키마, Entity, DTO 구현

**호출되는 에이전트:**
1. `schema-builder` - Prisma 스키마 생성
2. `entity-builder` - Entity 클래스 생성
3. `vo-builder` - Value Object 생성 (필요시)
4. `dto-builder` - DTO 클래스 생성
5. `seed-maker` - 시드 데이터 생성 (필요시)

**산출물:**
| 경로 | 설명 |
|------|------|
| `packages/prisma/schema/{domain}.prisma` | Prisma 스키마 |
| `packages/entity/src/{entity}.entity.ts` | Entity 클래스 |
| `packages/dto/src/{domain}/*.dto.ts` | DTO 클래스 |
| `packages/prisma/seed-data.ts` | 시드 데이터 |
| `apps/proposal/plans/YYYY-MM-DD-{기능명}-schema.md` | 결과 문서 |

**실행되는 명령:**
```bash
pnpm --filter=@cocrepo/prisma generate
pnpm --filter=@cocrepo/prisma migrate dev --name {name}
```

**리뷰 포인트:**
- Prisma 스키마가 설계와 일치하는가?
- Entity 클래스가 올바른가?
- DTO가 API 명세와 맞는가?

---

### Stage 3: 백엔드 로직

**목표:** Repository, Service, Controller 구현

**호출되는 에이전트 (순차 실행):**
1. `repository-builder` - Prisma Repository 생성
2. `service-builder` - 비즈니스 로직 구현
3. `facade-builder` - 여러 Service 조합 (필요시)
4. `controller-builder` - REST Controller 생성

**산출물:**
| 경로 | 설명 |
|------|------|
| `packages/repository/src/{entities}.repository.ts` | Repository |
| `packages/service/src/{entities}.service.ts` | Service |
| `apps/server/src/module/{domain}/{entities}.controller.ts` | Controller |
| `apps/server/src/module/{domain}/{entities}.module.ts` | Module |
| `apps/proposal/plans/YYYY-MM-DD-{기능명}-backend.md` | 결과 문서 |

**후속 작업:**
```bash
# Stage 4 시작 전 필수 실행
pnpm --filter=@cocrepo/api generate
```

**리뷰 포인트:**
- API 엔드포인트가 설계와 일치하는가?
- 비즈니스 로직이 올바른가?

---

### Stage 4: 컴포넌트 구현

**목표:** UI, Widget, Feature 컴포넌트 구현

**사전 작업:**
```bash
pnpm --filter=@cocrepo/api generate  # Orval API 클라이언트 생성
```

**호출되는 에이전트 (병렬 가능):**
1. `ui-component-builder` - Pure UI 컴포넌트
2. `input-component-builder` - 폼 입력 컴포넌트
3. `widget-builder` - 데이터 표시 위젯
4. `feature-builder` - 비즈니스 로직 + Store 연동
5. `store-builder` - MobX Store (필요시)

**산출물:**
| 경로 | 설명 |
|------|------|
| `packages/ui/src/components/ui/{Component}/` | Pure UI |
| `packages/ui/src/components/inputs/{Component}/` | Input |
| `packages/ui/src/components/widget/{Component}/` | Widget |
| `packages/ui/src/components/feature/{Component}/` | Feature |
| `apps/proposal/plans/YYYY-MM-DD-{기능명}-components.md` | 결과 문서 |

**리뷰 포인트:**
- 컴포넌트 계층이 올바른가? (ui → widget → feature)
- 재사용성이 적절한가?

---

### Stage 5: 페이지 통합

**목표:** 페이지 컴포넌트 구현 및 규칙 검증

**호출되는 에이전트:**
1. `page-builder` - Pure UI Page, 통합 훅, Route Page 생성
2. `page-reviewer` - 프로젝트 규칙 검증

**산출물:**
| 경로 | 설명 |
|------|------|
| `packages/ui/src/components/page/{Page}/` | Pure UI Page |
| `apps/{app}/app/{route}/page.tsx` | Route Page |
| `apps/{app}/app/{route}/hooks/use{Page}.ts` | 통합 훅 |
| `apps/proposal/plans/YYYY-MM-DD-{기능명}-complete.md` | 완료 보고서 |

**규칙 검증 항목:**
- useCallback/useMemo 금지
- 핸들러 네이밍 (on[Event][UI])
- API 사용 (@cocrepo/api)
- MobX observer 래핑

---

## 실전 예시

### 예시: 회원 목록 관리 페이지

#### 1. Stage 1 실행

```
/orch-stage full

**페이지명:** MemberListPage
**요구사항:**
- 회원 목록 조회 (검색, 필터링)
- 회원 상세 보기
- 회원 등록/수정/삭제
- 상태 변경 (활성/비활성)
```

**결과:**
- `apps/proposal/plans/2026-01-10-MemberList.md` (기획서)
- `apps/proposal/plans/2026-01-10-MemberList-design.md` (설계서)

**Claude 출력:**
```
✅ Stage 1 완료: 데이터 설계

📁 생성된 문서:
- 기획서: apps/proposal/plans/2026-01-10-MemberList.md
- 설계서: apps/proposal/plans/2026-01-10-MemberList-design.md

📋 사용자 리뷰 포인트:
- [ ] Entity 설계가 요구사항에 맞는가?
- [ ] API 설계가 적절한가?

→ 리뷰 완료 후 "Stage 2 진행" 또는 수정 요청을 해주세요.
```

#### 2. 사용자 리뷰 후 Stage 2 진행

```
Stage 2 진행
```

**결과:**
- Prisma 스키마, Entity, DTO 생성
- `apps/proposal/plans/2026-01-10-MemberList-schema.md`

#### 3. 계속 진행...

각 Stage 완료 후 "Stage N 진행"으로 다음 단계 시작

---

## 변경 발생 시 대응

### 영향 범위 표

| 변경 단계 | 영향 범위 | 재작업 범위 |
|----------|----------|------------|
| Stage 1 (기획) | Stage 1만 | 설계 문서만 수정 |
| Stage 2 (스키마) | Stage 2~5 | 스키마부터 재생성 |
| Stage 3 (백엔드) | Stage 3~5 | 백엔드부터 재생성 |
| Stage 4 (컴포넌트) | Stage 4~5 | 컴포넌트부터 재생성 |
| Stage 5 (페이지) | Stage 5만 | 페이지만 수정 |

### 재시작 예시

#### Entity 변경 시 (Stage 1 리뷰 중)

**상황:** "Member에 전화번호 필드도 추가해주세요"

```
# 설계서 수정 후 Stage 2부터 재시작
/orch-stage start stage=2 plan=2026-01-10-MemberList
```

#### API 변경 시 (Stage 3 리뷰 중)

**상황:** "삭제 대신 소프트 삭제로 변경해주세요"

```
# 설계서 수정 후 Stage 3부터 재시작
/orch-stage start stage=3 plan=2026-01-10-MemberList
```

#### 컴포넌트 수정 시 (Stage 4 리뷰 중)

**상황:** "MemberCard 디자인을 변경해주세요"

```
# Stage 4만 다시 실행
/orch-stage run stage=4 plan=2026-01-10-MemberList
```

---

## 핵심 원칙

### 하위호환성 미고려 (Critical)

**모든 변경은 전체 마이그레이션 방식으로 진행합니다.**

```
❌ 금지:
- 기존 API 유지하면서 새 API 추가
- deprecated 마킹 후 나중에 제거
- 하위호환 래퍼/어댑터 함수 추가
- 이전 버전 지원 코드

✅ 권장:
- 기존 코드 삭제 → 새 코드로 전체 교체
- 호출하는 모든 코드를 한 번에 수정
- 마이그레이션 완료 후 이전 코드 흔적 없음
```

### 단계별 리뷰 필수

각 Stage 완료 후 반드시 사용자 리뷰를 받습니다:
- 조기에 문제 발견
- 방향성 확인
- 불필요한 재작업 방지

### 산출물 문서화

각 Stage별 결과 문서를 자동 생성합니다:
- `-design.md`: 기술 설계서
- `-schema.md`: 스키마 구현 결과
- `-backend.md`: 백엔드 구현 결과
- `-components.md`: 컴포넌트 구현 결과
- `-complete.md`: 전체 완료 보고서

---

## 관련 문서

- 에이전트 상세: `.claude/agents/orch-stage.md`
- 기획 오케스트레이터: `.claude/agents/orch-requirement.md`
