# AI Form Field Entity 기획서

> 생성일: 2026-02-26
> 수정일: 2026-02-26
> 타입: entity
> 위치: packages/be-entity/src/ai-form-field.entity.ts

## 역할

AI 폼 템플릿에서 AI가 채울 개별 필드의 설정을 정의하는 엔티티입니다. 각 필드는 대상 필드명, 프롬프트, 필수 여부, 기본값 등을 설정할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| templateId | UUID | FK, required | - | 소속 템플릿 ID |
| fieldName | String | required | - | 대상 필드명 (Entity 필드명) |
| fieldLabel | String | optional | - | 필드 표시명 (한글) |
| fieldType | FormFieldType | required | - | 필드 타입 |
| prompt | Text | required | - | AI 프롬프트 (이 필드를 어떻게 채울지) |
| isRequired | Boolean | required | true | 필수 필드 여부 |
| defaultValue | String | optional | - | 기본값 |
| validationRegex | String | optional | - | 유효성 검증 정규식 |
| validationMessage | String | optional | - | 유효성 검증 실패 메시지 |
| maxLength | Integer | optional | - | 최대 길이 |
| options | Json | optional | - | 선택 옵션 (select, radio용) |
| order | Integer | required | 0 | 필드 순서 |
| groupId | UUID | FK, optional | - | 필드 그룹 ID (계층 구조) |
| metadata | Json | optional | - | 추가 메타데이터 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |

## Enum

### FormFieldType

| 값 | 설명 |
|-----|------|
| TEXT | 단행 텍스트 |
| TEXTAREA | 여러 줄 텍스트 |
| NUMBER | 숫자 |
| SELECT | 단일 선택 |
| MULTI_SELECT | 다중 선택 |
| CHECKBOX | 체크박스 |
| RADIO | 라디오 버튼 |
| DATE | 날짜 |
| DATETIME | 날짜/시간 |
| EMAIL | 이메일 |
| PHONE | 전화번호 |
| URL | URL |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | AIFormTemplate | N:1 | 소속 템플릿 |
| belongsTo | AIFormField (group) | N:0..1 | 상위 필드 그룹 |
| hasMany | AIFormField | 1:N | 하위 필드 그룹 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isValidValue(value) | boolean | 값 유효성 검증 |
| getEffectivePrompt() | string | 프롬프트 + 기본값 조합 |
| formatValue(value) | any | 타입에 맞게 값 포맷팅 |
| getOptions() | Option[] | 선택 옵션 목록 반환 |

## 비즈니스 규칙

- 동일 템플릿 내에서 fieldName은 유니크해야 함
- order 값으로 필드 정렬 순서 결정
- SELECT, MULTI_SELECT, RADIO 타입은 options 필수
- validationRegex가 있는 경우 값 검증에 사용
- 그룹 필드는 계층 구조 지원 (최대 2단계)

## 구현 체크리스트

- [ ] ai-form-field.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isValidValue | 3 | 2 | 1 | 6 |
| getEffectivePrompt | 2 | 0 | 1 | 3 |
| formatValue | 3 | 0 | 1 | 4 |

### [TC-001] isValidValue - TEXT 타입

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | fieldType=TEXT, isRequired=true |
| **When** | isValidValue("텍스트") 호출 |
| **Then** | true 반환 |

### [TC-002] isValidValue - 필수 필드 빈값

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | fieldType=TEXT, isRequired=true |
| **When** | isValidValue("") 호출 |
| **Then** | false 반환 |

### [TC-003] isValidValue - 정규식 검증

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | fieldType=EMAIL, validationRegex=이메일 정규식 |
| **When** | isValidValue("test@example.com") 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `packages/be-entity/src/ai-form-template.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | orch-requirement |
