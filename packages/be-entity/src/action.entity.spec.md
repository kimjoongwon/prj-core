# Action Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/action.entity.ts

## 역할

CASL Action의 완전한 정의를 담당하는 엔티티입니다. 행위(create, read, update, delete 등)를 정의하며, 마스킹·포맷팅·변환 등의 고급 설정을 `config` 필드에 JSON 형식으로 저장합니다. DDD 원칙에 따라 마스킹 프리셋 등의 설정을 엔티티 내부에 캡슐화합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required, unique | - | Action 이름 ('create', 'read', 'read:masked:email' 등) |
| displayName | string \| null | nullable | null | 화면 표시명 |
| description | string \| null | nullable | null | 설명 |
| group | string \| null | nullable | null | 그룹 ('crud', 'visibility', 'bulk', 'workflow') |
| order | number | required | - | 정렬 순서 |
| isSystem | boolean | required | - | 시스템 기본 Action 여부 |
| config | Prisma.JsonValue \| null | nullable | null | Action 설정 (마스킹, 포맷팅 등) |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| group (비공식) | 'crud' | 기본 CRUD 액션 |
| group (비공식) | 'visibility' | 마스킹/가시성 액션 |
| group (비공식) | 'bulk' | 대량 처리 액션 |
| group (비공식) | 'workflow' | 워크플로우 액션 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| abilities | Ability[] | OneToMany | 이 Action을 사용하는 Ability 목록 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getMaskingPreset() | string \| null | config에서 마스킹 프리셋 이름 반환 |
| getConfigType() | string \| null | config 설정 타입 반환 ('masking', 'format', 'transform') |
| isMaskingAction() | boolean | 마스킹 Action 여부 확인 |
| isCrudAction() | boolean | CRUD Action 여부 확인 |
| isVisibilityAction() | boolean | Visibility Action 여부 확인 |
| getTypedConfig() | ActionConfig | 타입 안전한 config 반환 |

## 비즈니스 규칙

- `isSystem=true`인 Action은 시스템에서 기본 제공하며 삭제 불가합니다.
- `config.type === 'masking'`이면 마스킹 Action으로, `config.preset`에 마스킹 프리셋을 지정합니다.
- Action 이름은 콜론(`:`)으로 구분된 계층 구조를 가질 수 있습니다 (예: `read:masked:email`).
- `group` 필드로 Action을 그룹핑하여 UI에서 분류 표시가 가능합니다.
- `order` 필드로 Action 목록 정렬 순서를 제어합니다.

## 구현 체크리스트

- [x] action.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ActionEntity 타입 implements
- [x] ActionConfig 타입 re-export (하위 호환성)
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
