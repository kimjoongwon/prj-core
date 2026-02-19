# Ability Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/ability.entity.ts

## 역할

CASL ABAC(Attribute-Based Access Control) 기반의 재사용 가능한 권한 정의 엔티티입니다. Subject(대상) + Action(행위) + fields(필드) + conditions(조건) 조합으로 세밀한 권한을 정의하며, 실제 부여는 Grant 테이블을 통해 Role 또는 User와 연결됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required, unique | - | 권한 이름 (재사용 가능한 고유 이름) |
| description | string \| null | nullable | null | 권한 설명 |
| fields | string[] | required | [] | 대상 필드 목록 (빈 배열이면 전체 필드) |
| conditions | Prisma.JsonValue \| null | nullable | null | 권한 조건 (JSON 형식) |
| inverted | boolean | required | false | 거부 권한 여부 (true: cannot, false: can) |
| reason | string \| null | nullable | null | 거부 사유 (inverted=true일 때 사용) |
| subjectId | string | FK, required | - | Subject ID (권한 대상) |
| actionId | string | FK, required | - | Action ID (행위 정의) |
| priority | number | optional | - | 우선순위 (Grant.priority 값, Grant에서 조회 시 설정) |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| subject | Subject | ManyToOne | 권한 대상 (CASL Subject) |
| action | Action | ManyToOne | 행위 정의 |
| grants | Grant[] | OneToMany | BRIDGE 테이블을 통해 Role/User에 연결 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isAllowed() | boolean | 허용 권한인지 확인 (inverted === false) |
| isDenied() | boolean | 거부 권한인지 확인 (inverted === true) |
| getActionName() | string \| null | Action 이름 가져오기 (action 관계 로드 시) |
| isMaskingAbility() | boolean | 마스킹 Action인지 확인 (action 관계 로드 시) |
| getMaskingPreset() | string \| null | 마스킹 프리셋 가져오기 (action 관계 로드 시) |

## 비즈니스 규칙

- Ability는 권한 정의만 담당하며, 실제 부여는 Grant 테이블에서 관리합니다.
- `inverted=true`이면 거부(cannot) 권한이며, 이 경우 `reason` 필드에 거부 사유를 기록합니다.
- `fields` 배열이 비어 있으면 해당 Subject의 모든 필드에 대한 권한을 의미합니다.
- `conditions`는 CASL의 조건부 권한 검사에 사용되며 JSON 형식으로 저장됩니다.
- `priority` 필드는 DB에 저장되지 않고, Grant에서 조회 시 설정됩니다.
- 마스킹 관련 메서드는 `action` 관계가 로드된 경우에만 사용 가능합니다.

## 구현 체크리스트

- [x] ability.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma AbilityEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
