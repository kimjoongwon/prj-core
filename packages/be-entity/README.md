# @cocrepo/entity

Prisma 저장 모델에 대응하는 도메인 Entity와 내부 객체 복원 함수를 제공합니다. 공통 필드의 타입·검증·변환·Swagger 정보와 도메인 동작을 이 패키지에서 관리합니다.

## 설치

```bash
pnpm add @cocrepo/entity
```

## 주요 기능

### 엔티티 클래스

Prisma 모델과 매핑되는 TypeScript 클래스입니다. Swagger 문서화와 유효성 검증 데코레이터가 적용되어 있습니다.

### 공통 API 메타데이터

각 Prisma 대응 Entity는 `@cocrepo/schema`의 대응 Schema를 직접 상속합니다. Schema가 공통 검증과 persistence 타입을 소유하고, Entity는 `declare` 필드에 Swagger·Transform metadata와 관계·도메인 메서드를 추가합니다. `AbstractEntityFields`는 공통 API metadata만 등록하며 검증을 중복 등록하지 않습니다. `Reservation`도 Schema를 직접 상속하고 도메인 메서드를 유지합니다.

### 공통 API 메타데이터의 소유권

Entity가 소유한 persisted scalar와 domain relation의 타입·변환·공통 검증·Swagger 메타데이터가 해당 필드의 단일 기준입니다. 생성·수정 DTO는 `@nestjs/swagger`의 명시적 `PickType/PartialType`으로 Entity에서 직접 파생합니다. 응답 DTO는 `EntityResponseType`, 같은 의미의 Query 필터는 `EntityQueryType`을 사용합니다. API 파생과 변환 경계는 [DTO README](../be-dto/README.md)를 따릅니다. 검색·정렬·페이지네이션, 가입·로그인 비밀번호, 응답 wrapper와 projection처럼 API 문맥에서만 의미가 있는 필드는 DTO가 소유합니다. Entity는 DTO를 import하지 않으며, DTO 파생 시 Entity의 생성자 기본값이 요청 기본값으로 복사될 수 있으므로 Entity initializer는 persistence/domain 기본값에만 사용해야 합니다.

---

## 사용 예시

### 기본 사용

```typescript
import { User, Tenant, Space } from '@cocrepo/entity';

// 타입으로 사용
function readUserEmail(user: User) {
  return user.email;
}
```

### 상속을 통한 확장

```typescript
import { AbstractEntity } from '@cocrepo/entity';
import { StringField } from '@cocrepo/decorator/field';

// AbstractEntity를 상속하여 공통 필드 사용
class CustomEntity extends AbstractEntity {
  @StringField({ description: "사용자 정의 필드" })
  customField!: string;
}
```

### 응답 엔티티 사용

```typescript
import { ResponseEntity, type User } from '@cocrepo/entity';

// wrapper 생성만 담당하며 공개 응답 변환은 공통 DTO 경계에서 수행합니다.
function wrapUser(user: User): ResponseEntity<User> {
  return ResponseEntity.WITH_ROUTE(user);
}
```

---

## 제공 엔티티 목록

### 핵심 엔티티

| 엔티티 | 설명 |
|--------|------|
| `AbstractEntity` | 일반 Entity의 공통 필드 (id, createdAt, updatedAt, removedAt) |
| `AbstractAggregateEntity` | AggregateRoot 상속과 같은 공통 필드를 유지하는 기본 클래스 |
| `hydrateEntity` | API 데코레이터를 실행하지 않는 내부 객체 복원 함수 |
| `ResponseEntity` | API 응답 래퍼 |

### 사용자/조직

| 엔티티 | 설명 |
|--------|------|
| `User` | 사용자 |
| `Profile` | 사용자 프로필 |
| `Tenant` | 사용자·공간·역할을 연결하는 멤버십 |
| `Space` | 운영 공간 |
| `Role` | 역할 |
| `Group` | 그룹 |

### 콘텐츠

| 엔티티 | 설명 |
|--------|------|
| `Category` | 카테고리 |
| `Exercise` | 운동 |
| `Program` | 프로그램 |
| `Routine` | 루틴 |
| `Subject` | 권한 대상 |

### 일정

| 엔티티 | 설명 |
|--------|------|
| `Timeline` | 타임라인 |
| `Session` | 세션 |
| `FitnessCenter` | 피트니스 센터 |

### 작업

| 엔티티 | 설명 |
|--------|------|
| `Task` | 작업 (추상) |
| `Activity` | 활동 |
| `Action` | 액션 |
| `RoleAssignment` | 역할에 대한 정책 할당 |

### 파일

| 엔티티 | 설명 |
|--------|------|
| `Asset` | 미디어 원본 |
| `Folder` | 파일 폴더 |
| `Derivative` | 미디어 파생본 |

### 연관 (Association)

| 엔티티 | 설명 |
|--------|------|
| `UserAssociation` | 사용자 연관 |
| `SpaceAssociation` | 스페이스 연관 |
| `RoleAssociation` | 역할 연관 |

### 분류 (Classification)

| 엔티티 | 설명 |
|--------|------|
| `UserClassification` | 사용자 분류 |
| `SpaceClassification` | 스페이스 분류 |
| `RoleClassification` | 역할 분류 |

---

## 파일 구조

```
src/
├── abstract.entity.ts           # 추상 엔티티 (공통 필드)
├── response.entity.ts           # 응답 래퍼
├── user.entity.ts               # 사용자
├── profile.entity.ts            # 프로필
├── tenant.entity.ts             # 테넌트
├── space.entity.ts              # 스페이스
├── role.entity.ts               # 역할
├── group.entity.ts              # 그룹
├── category.entity.ts           # 카테고리
├── exercise.entity.ts           # 운동
├── program.entity.ts            # 프로그램
├── routine.entity.ts            # 루틴
├── subject.entity.ts            # 주제
├── timeline.entity.ts           # 타임라인
├── session.entity.ts            # 세션
├── fitness-center.entity.ts      # 피트니스 센터
├── task.entity.ts               # 작업
├── activity.entity.ts           # 활동
├── action.entity.ts             # 액션
├── role-assignment.entity.ts    # 역할 정책 할당
├── asset.entity.ts              # 미디어 원본
├── folder.entity.ts             # 폴더
├── derivative.entity.ts         # 미디어 파생본
├── user-association.entity.ts   # 사용자 연관
├── space-association.entity.ts
├── role-association.entity.ts
├── user-classification.entity.ts
├── space-classification.entity.ts
├── role-classification.entity.ts
├── abstract-aggregate.entity.ts # AggregateRoot 기본 클래스
├── abstract-entity-fields.decorator.ts # 내부 공통 메타데이터
├── hydrate-entity.ts            # DB·캐시 객체 복원
└── index.ts
```

---

## AbstractEntity

일반 Entity의 기본 필드 shape입니다. AggregateRoot가 필요한 기존 Entity는 `AbstractAggregateEntity`를 사용합니다:

```typescript
export class AbstractEntity {
  id!: bigint;
  createdAt!: Date;
  updatedAt!: Date | null;
  removedAt!: Date | null;
}
```

---

## 내부 객체 복원

```typescript
import { hydrateEntity, User } from '@cocrepo/entity';

const user = hydrateEntity(User, {
  id: 1n,
  email: 'MixedCase@example.com',
  password: 'stored-password-hash',
  userId: '01ARZ3NDEKTSV4RRFFQ69G5FAV',
  createdAt: new Date(),
});
```

`hydrateEntity`는 Entity 생성 후 원본 속성을 복사합니다. 입력의 bigint·Date,
이메일 대소문자, 저장 비밀번호·ULID와 Entity 메서드를 보존하며 API의
`Transform/Type/Exclude`를 실행하지 않습니다. 단일 객체와 배열을 지원합니다.
문자열 날짜나 decimal ID를 API 규칙으로 파싱하는 함수가 아닙니다.

기존 권한 그래프의 다음 관계만 명시적으로 복원합니다.

| 원본 관계 | 복원할 Entity |
| --- | --- |
| `Policy.entries` | `PolicyEntry[]` |
| `Policy.roleAssignments` | `RoleAssignment[]` |
| `PolicyEntry.ability` | `Ability` |
| `RoleAssignment.policy` | `Policy` |

WeakMap으로 같은 객체의 공유·순환 참조를 유지합니다. 그 외 관계는 일괄
변환하지 않고 원래 값 또는 이미 복원된 관계 객체를 유지합니다. Repository의
내부 `toDomainEntity`와 JWT 캐시 복원이 이 helper를 사용합니다.
`plainToInstance(Entity, persistedValue)`나 `ignoreDecorators: true`로 내부 복원
경계를 대체하지 않습니다.

비밀번호 해시와 내부 ULID의 응답 제외는 Entity의 `@Exclude({ toPlainOnly: true })`에
선언합니다. 평문 비밀번호 입력 검증은 DTO·인증 스키마에 남습니다. 외부 응답의
공개 필드 선택과 중첩 DTO 변환은 [DTO 응답 경계](../be-dto/README.md#entity-응답-변환-경계)를 따릅니다.

## 검증

```bash
pnpm --filter @cocrepo/entity type-check
pnpm --filter @cocrepo/entity lint
```

변경된 복원 동작은 Repository·JWT 관련 테스트에서, API 메타데이터는 DTO의
입력·응답·Query 테스트와 OpenAPI 비교에서 함께 검증합니다.

## 의존성

- `@cocrepo/decorator` - 데코레이터
- `@cocrepo/type` - 타입 정의
- `class-transformer` - 직렬화
- `@cocrepo/prisma` - 저장 모델과 enum
- `@cocrepo/enum` - 도메인 enum 도우미
- `@nestjs/cqrs` - AggregateRoot
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
