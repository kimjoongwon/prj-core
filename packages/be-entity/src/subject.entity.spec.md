# Subject Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/subject.entity.ts

## 역할

CASL 권한 시스템의 Subject(권한 대상)를 정의하는 엔티티입니다. 엔티티(`entity:xxx`), 메뉴(`menu:xxx`), 기능(`feature:xxx`), UI 요소(`ui:xxx`) 등 권한을 부여할 수 있는 대상을 계층적으로 관리합니다. 그룹별 색상과 한글 라벨을 제공하는 도메인 메서드를 포함합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required, unique | - | Subject 이름 ('entity:User', 'menu:dashboard' 등) |
| displayName | string \| null | nullable | null | 화면 표시명 |
| icon | string \| null | nullable | null | 아이콘 |
| group | string \| null | nullable | null | 그룹 ('entity', 'menu', 'feature', 'ui') |
| order | number | required | - | 정렬 순서 |
| isSystem | boolean | required | - | 시스템 기본 Subject 여부 |

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
| SubjectType (비공식) | "entity" | 데이터 엔티티 대상 |
| SubjectType (비공식) | "menu" | 메뉴 대상 |
| SubjectType (비공식) | "feature" | 기능 대상 |
| SubjectType (비공식) | "ui" | UI 요소 대상 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| abilities | Ability[] | OneToMany | 이 Subject를 대상으로 하는 Ability 목록 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isEntitySubject() | boolean | entity: 접두사 여부 확인 |
| isMenuSubject() | boolean | menu: 접두사 여부 확인 |
| isFeatureSubject() | boolean | feature: 접두사 여부 확인 |
| isUiSubject() | boolean | ui: 접두사 여부 확인 |
| getSubjectType() | "entity" \| "menu" \| "feature" \| "ui" \| "unknown" | Subject 유형 반환 |
| getSubjectName() | string | 접두사 제거 후 실제 이름 반환 |
| getGroupColor() | "primary" \| "secondary" \| "success" \| "warning" \| "default" | HeroUI variant 색상 반환 |
| getGroupLabel() | string | 그룹별 한글 라벨 반환 |

## 비즈니스 규칙

- Subject 이름은 `{type}:{name}` 형식의 콜론 구분 계층 구조를 사용합니다.
- `isSystem=true`인 Subject는 시스템 기본 Subject로 삭제 불가합니다.
- `order` 필드로 Subject 목록 정렬 순서를 제어합니다.
- 그룹별로 색상을 부여하여 UI에서 시각적 구분을 제공합니다.
- Ability는 Subject + Action 조합으로 권한을 정의합니다.

## 구현 체크리스트

- [x] subject.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma SubjectEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
