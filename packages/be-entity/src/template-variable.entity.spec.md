# TemplateVariable Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/template-variable.entity.ts

## 역할

메시지 템플릿(Template)의 변수를 정의하는 엔티티입니다. 템플릿 본문에서 `{{변수명}}` 형식으로 사용되는 동적 변수를 관리합니다. 변수명, 필수 여부, 기본값, 설명을 포함하며, 템플릿 렌더링 시 변수값 치환에 사용됩니다. AbstractEntity를 상속하지 않습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| name | string | required | - | 변수명 |
| isRequired | boolean | required | - | 필수 여부 |
| templateId | string | FK, required | - | 소속 템플릿 ID |
| description | string \| null | nullable | null | 변수 설명 |
| defaultValue | string \| null | nullable | null | 기본값 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| template | Template | ManyToOne | 소속 템플릿 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| hasDefaultValue() | boolean | 기본값 설정 여부 확인 |
| toPlaceholder() | string | 플레이스홀더 형태 반환 (예: "name" → "{{name}}") |

## 비즈니스 규칙

- `isRequired=true`이면 템플릿 렌더링 시 해당 변수값이 반드시 제공되어야 합니다.
- `defaultValue`가 있으면 변수값 미제공 시 기본값을 사용합니다.
- 변수명은 `{{변수명}}` 형식으로 템플릿 본문에 삽입됩니다.
- `removedAt` 필드가 없어 소프트 삭제를 지원하지 않습니다.
- Template의 `extractVariablePlaceholders()` 메서드와 연계하여 변수 검증에 활용됩니다.

## 구현 체크리스트

- [x] template-variable.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma TemplateVariableEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
