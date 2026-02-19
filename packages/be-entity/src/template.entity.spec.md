# Template Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/template.entity.ts

## 역할

이메일(EMAIL), SMS, 푸시 알림(PUSH) 메시지 템플릿을 관리하는 엔티티입니다. 고유 코드로 식별되며, 본문에 `{{변수명}}` 플레이스홀더를 포함할 수 있습니다. TemplateVariable을 통해 사용 가능한 변수를 정의하고 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| code | string | required, unique | - | 고유 코드 (시스템 내 식별자) |
| name | string | required | - | 템플릿 이름 |
| type | TemplateType | required | - | 템플릿 유형 (EMAIL, SMS, PUSH) |
| content | string | required | - | 본문 내용 |
| isActive | boolean | required | - | 활성 상태 |
| subject | string \| null | nullable | null | 제목 (이메일용) |
| description | string \| null | nullable | null | 설명 |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| TemplateType | EMAIL | 이메일 템플릿 |
| TemplateType | SMS | SMS 템플릿 |
| TemplateType | PUSH | 푸시 알림 템플릿 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| variables | TemplateVariable[] | OneToMany | 템플릿 변수 목록 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isEmail() | boolean | 이메일 템플릿 여부 확인 |
| isSms() | boolean | SMS 템플릿 여부 확인 |
| isPush() | boolean | 푸시 알림 템플릿 여부 확인 |
| isEnabled() | boolean | 활성 상태 여부 확인 (isActive && removedAt === null) |
| extractVariablePlaceholders() | string[] | 본문에서 {{변수명}} 플레이스홀더 목록 추출 |
| hasSubject() | boolean | 제목 존재 여부 확인 |

## 비즈니스 규칙

- `code`로 고유 식별되며, 시스템에서 특정 이벤트에 대한 템플릿을 코드로 참조합니다.
- `isActive=false` 또는 `removedAt!=null`이면 비활성화된 템플릿입니다.
- `subject`는 이메일 유형에서 필수이며, SMS/PUSH에서는 선택 사항입니다.
- 본문의 `{{변수명}}` 패턴이 `extractVariablePlaceholders()`로 추출됩니다.
- `variables`에 등록된 변수만 템플릿 렌더링 시 치환됩니다.
- 소프트 삭제를 통해 템플릿 삭제 이력을 보존합니다.

## 구현 체크리스트

- [x] template.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma TemplateEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
