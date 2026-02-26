# AI Template Execution Entity 기획서

> 생성일: 2026-02-26
> 수정일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/ai-template-execution.entity.ts

## 역할

AI 폼 템플릿 실행 이력을 기록하는 엔티티입니다. 어떤 사용자가 어떤 템플릿을 사용했는지, 입력값과 결과값, 실행 시간, 토큰 사용량 등을 추적합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| templateId | UUID | FK, required | - | 실행한 템플릿 ID |
| userId | UUID | FK, required | - | 실행한 사용자 ID |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| userInput | Json | optional | - | 사용자 입력 (추가 프롬프트 등) |
| inputContext | Json | optional | - | 컨텍스트 데이터 (기존 엔티티 정보 등) |
| result | Json | required | - | AI 생성 결과 (필드별 값) |
| status | ExecutionStatus | required | - | 실행 상태 |
| errorMessage | Text | optional | - | 에러 메시지 |
| tokensUsed | Integer | optional | - | 사용된 토큰 수 |
| executionTimeMs | Integer | optional | - | 실행 시간 (ms) |
| aiProvider | AIProvider | required | - | 사용된 AI 제공자 |
| model | String | required | - | 사용된 모델 |
| isApplied | Boolean | required | false | 결과 적용 여부 |
| appliedAt | DateTime | optional | - | 결과 적용 일시 |
| targetEntityId | UUID | optional | - | 적용된 대상 Entity ID |
| createdAt | DateTime | required | now() | 생성 일시 |

## Enum

### ExecutionStatus

| 값 | 설명 |
|-----|------|
| PENDING | 대기 중 |
| RUNNING | 실행 중 |
| SUCCESS | 성공 |
| FAILED | 실패 |
| TIMEOUT | 타임아웃 |
| CANCELLED | 취소됨 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | AIFormTemplate | N:1 | 실행한 템플릿 |
| belongsTo | User | N:1 | 실행한 사용자 |
| belongsTo | Space | N:1 | 소속 Space |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isSuccess() | boolean | 성공 여부 확인 |
| isFailed() | boolean | 실패 여부 확인 |
| canApply() | boolean | 결과 적용 가능 여부 |
| markApplied(entityId) | void | 결과 적용 처리 |
| getFieldValue(fieldName) | any | 특정 필드 결과값 반환 |
| getFormattedResult() | Record<string, any> | 포맷팅된 전체 결과 반환 |

## 비즈니스 규칙

- SUCCESS 상태에서만 결과 적용 가능
- 동일한 실행은 한 번만 적용 가능
- 토큰 사용량은 비용 계산에 활용
- 실행 시간이 60초 초과 시 TIMEOUT으로 처리
- Space 격리: 모든 조회에 spaceId 조건 포함

## 구현 체크리스트

- [ ] ai-template-execution.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isSuccess/isFailed | 2 | 0 | 0 | 2 |
| canApply | 2 | 1 | 0 | 3 |
| markApplied | 1 | 1 | 0 | 2 |
| getFieldValue | 2 | 0 | 1 | 3 |

### [TC-001] canApply - 성공 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | status=SUCCESS, isApplied=false |
| **When** | canApply() 호출 |
| **Then** | true 반환 |

### [TC-002] canApply - 실패 상태

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | status=FAILED |
| **When** | canApply() 호출 |
| **Then** | false 반환 |

### [TC-003] markApplied - 적용 처리

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | SUCCESS 상태, 미적용 |
| **When** | markApplied(entityId) 호출 |
| **Then** | isApplied=true, appliedAt 설정 |

## 상위 기획서

- `packages/be-entity/src/ai-form-template.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
