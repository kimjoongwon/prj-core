# AI Form Template Entity 기획서

> 생성일: 2026-02-26
> 수정일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/ai-form-template.entity.ts

## 역할

AI가 폼 필드를 자동으로 채우기 위한 템플릿을 정의하는 엔티티입니다. 관리자가 특정 도메인(Member, Inquiry, Role 등)을 대상으로 AI가 채울 필드와 각 필드별 프롬프트를 설정할 수 있습니다. OpenAI와 Anthropic 두 AI 제공자를 지원하며, 템플릿 선택 시 사용자가 추가 프롬프트를 입력할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| name | String | required | - | 템플릿 이름 |
| description | String | optional | - | 템플릿 설명 |
| targetDomain | String | required | - | 대상 도메인 (Member, Inquiry, Role 등) |
| targetEntity | String | required | - | 대상 Entity 클래스명 |
| aiProvider | AIProvider | required | - | AI 제공자 (OPENAI, ANTHROPIC) |
| model | String | optional | - | 사용할 모델 (gpt-4, claude-3-opus 등) |
| systemPrompt | Text | optional | - | 시스템 프롬프트 |
| isActive | Boolean | required | true | 활성화 여부 |
| priority | Integer | required | 0 | 정렬 우선순위 (낮을수록 우선) |
| allowUserPrompt | Boolean | required | true | 사용자 추가 프롬프트 허용 여부 |
| maxTokens | Integer | optional | - | 최대 토큰 수 |
| temperature | Float | optional | 0.7 | 생성 온도 (0~1) |
| metadata | Json | optional | - | 추가 메타데이터 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| createdById | UUID | FK, required | - | 생성자 User ID |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## Enum

### AIProvider

| 값 | 설명 |
|-----|------|
| OPENAI | OpenAI (GPT-4, GPT-3.5 등) |
| ANTHROPIC | Anthropic (Claude 시리즈) |

### AITemplateStatus

| 값 | 설명 |
|-----|------|
| DRAFT | 초안 |
| ACTIVE | 활성화 |
| INACTIVE | 비활성화 |
| ARCHIVED | 보관됨 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | User (createdBy) | N:1 | 생성자 |
| hasMany | AIFormField | 1:N | 폼 필드 설정 |
| hasMany | AITemplateExecution | 1:N | 실행 이력 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isActiveTemplate() | boolean | 활성화 여부 확인 |
| canUseProvider(provider) | boolean | 특정 제공자 사용 가능 여부 |
| getAvailableModels() | string[] | 사용 가능한 모델 목록 반환 |
| validateFieldConfig(config) | boolean | 필드 설정 유효성 검증 |
| buildSystemPrompt() | string | 시스템 프롬프트 조합 |
| buildFieldPrompt(fieldId) | string | 특정 필드 프롬프트 조합 |
| activate() | void | 템플릿 활성화 |
| deactivate() | void | 템플릿 비활성화 |
| archive() | void | 템플릿 보관 |
| duplicate() | AIFormTemplate | 템플릿 복제 |

## 비즈니스 규칙

- 동일한 targetDomain에서 isActive=true인 템플릿은 여러 개 존재 가능 (우선순위로 구분)
- AI 제공자별로 사용 가능한 모델 목록이 다름
- temperature는 0~1 사이의 값만 허용
- maxTokens는 모델별 최대값을 초과할 수 없음
- 필드 설정은 AIFormField 엔티티에서 관리
- Space 격리: 모든 조회/수정에 spaceId 조건 포함
- 템플릿 삭제 시 연관된 AIFormField도 함께 소프트 삭제

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Entity 목록

| Entity | 타입 | 의존성 | 병렬 그룹 |
|--------|------|--------|----------|
| AIFormTemplate | CONCRETE | - | 0 (먼저) |
| AIFormField | CONCRETE | AIFormTemplate | 1 |
| AITemplateExecution | CONCRETE | AIFormTemplate, User | 2 |

### Enum 목록

| Enum | 사용 Entity |
|------|-------------|
| AIProvider | AIFormTemplate |
| AITemplateStatus | AIFormTemplate |

### DTO 목록

| DTO | 타입 | Entity |
|-----|------|--------|
| CreateAIFormTemplateDto | Request | AIFormTemplate |
| UpdateAIFormTemplateDto | Request | AIFormTemplate |
| AIFormTemplateResponseDto | Response | AIFormTemplate |
| AIFormTemplateListQueryDto | Request | AIFormTemplate (목록 조회) |
| CreateAIFormFieldDto | Request | AIFormField |
| AIFormFieldResponseDto | Response | AIFormField |
| AIFormPreviewRequestDto | Request | AI 프리뷰 실행 |
| AIFormPreviewResponseDto | Response | AI 프리뷰 결과 |

### 병렬 실행 DAG

```
Level 0: AIFormTemplate (먼저)
    │
    ├── Level 1: AIFormField
    │
    └── Level 2: AITemplateExecution
```

## 구현 체크리스트

- [ ] ai-form-template.entity.ts
- [ ] ai-form-field.entity.ts
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
| isActiveTemplate | 1 | 0 | 0 | 1 |
| canUseProvider | 2 | 0 | 0 | 2 |
| validateFieldConfig | 1 | 1 | 1 | 3 |
| activate/deactivate | 2 | 0 | 0 | 2 |
| duplicate | 1 | 0 | 1 | 2 |

### [TC-001] isActiveTemplate - 활성화 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | isActive=true인 AIFormTemplate |
| **When** | isActiveTemplate() 호출 |
| **Then** | true 반환 |

### [TC-002] canUseProvider - OpenAI 확인

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | aiProvider=OPENAI인 AIFormTemplate |
| **When** | canUseProvider(OPENAI) 호출 |
| **Then** | true 반환 |

### [TC-003] validateFieldConfig - 유효한 설정

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 유효한 필드 설정 JSON |
| **When** | validateFieldConfig(config) 호출 |
| **Then** | true 반환 |

### [TC-004] validateFieldConfig - 유효하지 않은 설정

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 필수 필드가 누락된 설정 JSON |
| **When** | validateFieldConfig(config) 호출 |
| **Then** | false 반환 |

### [TC-005] duplicate - 템플릿 복제

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 필드가 포함된 AIFormTemplate |
| **When** | duplicate() 호출 |
| **Then** | 이름에 "(복사)"가 추가된 새 템플릿 반환 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
