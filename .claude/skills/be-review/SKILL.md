---
name: be-review
description: 백엔드 코드를 검증하고 규칙 위반 리포트를 생성합니다. 사용자가 "백엔드 리뷰", "BE 검증", "레이어 규칙 체크" 등을 요청할 때 사용합니다.
allowed-tools: Bash, Read, Grep
---

# 백엔드 리뷰 (be-review)

백엔드 코드를 검증하고 규칙 위반 리포트를 생성합니다.

---

## 중요 원칙

**절대 하지 말아야 할 것:**

- ❌ 직접 코드 수정 (수정 기능 제거됨)
- ❌ 빌더 에이전트 호출 (Task 도구 없음)
- ❌ 위반 사항 무시

**반드시 해야 할 것:**

- ✅ 모든 규칙 검증 (하나라도 위반 시 보고)
- ✅ 구체적인 위반 위치 명시 (파일, 라인, 현재 코드)
- ✅ 위반 사항별 수정 방향 안내

---

## 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 검증 대상 모듈/경로 | ✅ | 검증할 모듈 또는 파일 경로 |
| 레이어 유형 | ⚪ | schema, entity, dto, repository, service, facade, controller |

---

## 실행 지침

### 1단계: Critical 규칙 검증

```bash
# 1. DTO 위치 확인 (apps/server에 있으면 위반)
ls apps/server/src/module/**/dto/ 2>/dev/null
find apps/server/src -name "*.dto.ts" -type f

# 2. Service에서 Prisma 직접 호출 확인
grep -rn "this\.prisma\." apps/server/src/module/**/*.service.ts --include="*.ts"

# 3. Facade에서 Prisma 직접 호출 확인
grep -rn "this\.prisma\." apps/server/src/module/**/*.facade.ts --include="*.ts"
```

### 2단계: 레이어별 검증

#### Repository 규칙

```bash
# PrismaService 주입 확인
grep -L "PrismaService" packages/be-repository/src/*.ts 2>/dev/null

# 비즈니스 로직 존재 확인 (if/for/while 문)
grep -rEn "if\s*\(|for\s*\(|while\s*\(" packages/be-repository/src/*.ts
```

#### Service 규칙

```bash
# Prisma 직접 호출 금지
grep -rn "this\.prisma\." apps/server/src/module/**/*.service.ts

# Repository 의존 확인
grep -L "Repository" apps/server/src/module/**/*.service.ts 2>/dev/null
```

#### Facade 규칙

```bash
# Prisma 직접 호출 금지
grep -rn "this\.prisma\." apps/server/src/module/**/*.facade.ts

# 여러 Service 조합 확인
grep -c "Service" apps/server/src/module/**/*.facade.ts
```

#### Controller 규칙

```bash
# 비즈니스 로직 존재 확인
grep -rEn "if\s*\(|for\s*\(|while\s*\(" apps/server/src/module/**/*.controller.ts

# @cocrepo/dto import 확인
grep -L "@cocrepo/dto" apps/server/src/module/**/*.controller.ts 2>/dev/null

# @ApiResponseEntity 사용 확인
grep -L "@ApiResponseEntity" apps/server/src/module/**/*.controller.ts 2>/dev/null
```

### 3단계: API 응답 구조 검증

```bash
# ResponseEntity 직접 생성 금지
grep -rn "new ResponseEntity\|ResponseEntity\." apps/server/src/module/**/*.controller.ts

# *ListResponseDto 래퍼 DTO 금지
find packages/be-dto/src -name "*ListResponse*.dto.ts" -type f
```

### 4단계: Multi-Tenancy 검증

```bash
# SpaceGuard 또는 Space 관련 처리 확인
grep -L "SpaceGuard\|@CurrentTenant\|@CurrentSpace" apps/server/src/module/**/*.controller.ts 2>/dev/null

# canAccessAllSpaces 사용 확인 (Service에서)
grep -L "canAccessAllSpaces" apps/server/src/module/**/*.service.ts 2>/dev/null
```

---

## 레이어 의존성 규칙

```
Controller → Facade → Service → Repository → Prisma
         ↘ Service ↗
```

| 레이어 | 허용 의존 | 금지 의존 |
|--------|----------|----------|
| Controller | Facade, Service | Repository, Prisma |
| Facade | Service | Repository, Prisma |
| Service | Repository | Prisma |
| Repository | Prisma | - |

---

## 검증 체크리스트

### Critical 규칙

- [ ] DTO 위치: packages/be-dto 필수 (apps/server/dto 금지)
- [ ] Service에서 Prisma 직접 호출 금지
- [ ] Facade에서 Prisma 직접 호출 금지
- [ ] Controller에서 비즈니스 로직 금지

### 레이어별 규칙

- [ ] Repository: Prisma 쿼리만 작성
- [ ] Service: Repository 통해서만 데이터 접근
- [ ] Facade: Service 통해서만 접근
- [ ] Controller: 라우팅/DTO 검증만

### API 응답 구조

- [ ] @ApiResponseEntity 사용
- [ ] @ResponseMessage 사용
- [ ] *ListResponseDto 래퍼 DTO 금지
- [ ] ResponseEntity 직접 생성 금지

---

## 결과 리포트 템플릿

### 통과 리포트

```markdown
## ✅ 백엔드 리뷰 완료

### 검증 대상
- **모듈:** User
- **레이어:** Controller, Service, Repository
- **파일 수:** 5개

### 검증 결과

| 규칙 | 상태 | 비고 |
|------|------|------|
| DTO 위치 | ✅ 통과 | packages/be-dto에 위치 |
| 레이어 분리 | ✅ 통과 | 의존성 방향 준수 |
| Prisma 직접 호출 금지 | ✅ 통과 | Repository 통해 접근 |
| API 응답 구조 | ✅ 통과 | @ApiResponseEntity 사용 |
| Multi-Tenancy | ✅ 통과 | Space 필터링 적용 |

### 품질 점수: 100/100
```

### 위반 리포트

```markdown
## ⚠️ 백엔드 리뷰 - 수정 필요

### 검증 대상
- **모듈:** Ability
- **레이어:** Service
- **파일 수:** 3개

### 위반 사항 (2건)

#### 1. DTO 위치 위반 (Critical)
```
파일: apps/server/src/module/ability/dto/create-ability.dto.ts
현재: apps/server/src/module/ability/dto/에 위치
수정 방향: packages/be-dto/src/ability/에 이동
```

#### 2. Service에서 Prisma 직접 호출 위반
```
파일: apps/server/src/module/ability/ability.service.ts:25
현재: return this.prisma.ability.findMany();
수정 방향: return this.abilityRepository.findMany();
```

### 수정 방법
1. DTO는 반드시 packages/be-dto에 위치해야 합니다
2. Service는 Repository를 통해서만 데이터에 접근합니다

### 품질 점수: 60/100
```

---

## 주의사항

- 이 Skill은 **검증과 리포트만** 수행합니다
- 코드 수정은 사용자가 빌더 에이전트를 별도로 호출해야 합니다
- 위반 사항 발견 시 구체적인 수정 방향을 안내합니다
