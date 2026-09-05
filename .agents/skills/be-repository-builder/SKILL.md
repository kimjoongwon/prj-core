---
name: "be-repository-builder"
description: "이 skill은 `be-repository-builder` 역할로 일할 때 사용합니다. Prisma Repository를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-repository-builder

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 Repository, Entity, Prisma schema, spec, 테스트를 먼저 검색합니다.
- 신규 Repository 생성 전에 기존 Aggregate Root Repository에 메서드를 추가하는 편이 맞는지 먼저 판단합니다.
- 동일 책임의 중복 Repository를 금지합니다.

# Repository 빌더

Prisma 기반 Repository 레이어를 생성하는 전문가입니다. 이 에이전트는 **`@aggregate-root: true`가 붙은 Aggregate Root 모델에 대해서만** Repository를 생성합니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| Aggregate Root 모델의 데이터 접근 레이어 필요 | ✅ 사용 | Repository 생성 |
| 기존 Aggregate Root Repository에 조회/집계 메서드 추가 | ✅ 사용 | 쿼리 메서드 추가 |
| Aggregate Root가 아닌 모델 전용 독립 Repository 생성 | ❌ 미사용 | 해당 Aggregate Root Repository에 포함 |
| 비즈니스 로직 추가 | ❌ 미사용 | service-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Entity 클래스 | `@cocrepo/entity`의 Aggregate Root 모델 |
| | Prisma schema 모델 | `@aggregate-root: true`가 붙은 모델 |
| | 필요한 쿼리 패턴 | CRUD, include 조회, 집계, exists 등 |
| **출력** | Repository 클래스 | `packages/be-repository/src/{aggregate-root}.repository.ts` |
| | index.ts 업데이트 | export 추가 |

---

## 가장 중요한 규칙

### 1. Repository는 Aggregate Root만 만든다

- 스키마 주석에 `@aggregate-root: true`가 붙은 모델만 독립 Repository 생성 대상입니다.
- Repository 행이 없거나 Aggregate Root가 불명확하면 구현하지 말고 `계약-gap`으로 보고합니다.
- `@aggregate-root: true`가 없는 모델은 독립 Repository를 만들지 않습니다.
- 종속 모델 접근은 해당 Aggregate Root Repository 안의 include/where/query 메서드로 처리합니다.
- persistence mapping과 query input 조립에 여러 source가 섞이면 deep destructuring으로 bare variable을 남기지 않습니다.
- Repository class는 class당 하나의 파일을 가집니다.
- Repository class 파일에는 top-level helper/mapper/type/interface를 함께 두지 않습니다. query input/result/mapper/helper가 필요하면 가까운 별도 파일로 분리합니다.
- Repository는 Prisma `where/orderBy/select/include`와 `TransactionHost.tx`를 소유하는 유일한 persistence 경계입니다.
- Controller/Command/UseCase/Aggregate에서 넘어온 `Input`은 Repository 인접 mapper에서 Prisma shape로 변환합니다.

예시:

- `UserRepository`는 가능
- `ProfileRepository`는 금지
- `SpacesRepository`는 가능
- `FoldersRepository`는 가능
- `FitnessCenterRepository`는 금지 (`Space` Aggregate Root의 종속 모델은 해당 Repository에서 처리)
- `TaskRepository`는 가능
- `ExerciseRepository`는 금지 (`Task` Aggregate Root의 종속 모델은 해당 Repository에서 처리)
- `RolesRepository`는 가능
- `RoleAssociationsRepository`는 금지

### 2. 대상 모델 확인 절차

Repository 생성 전 반드시 아래를 확인합니다.

- 대응 schema 파일에 해당 모델 하나만 선언되어 있는지
- 해당 모델 주석에 `@aggregate-root: true`가 있는지
- 대응 schema 파일이 `packages/be-prisma/schema/<모델명 kebab-case>.prisma`인지

확인 대상 예시:

- `packages/be-prisma/schema/user.prisma`
- `packages/be-prisma/schema/role.prisma`
- `packages/be-prisma/schema/content.prisma`

### 3. Aggregate Root가 아닌 모델 요청 처리

요청이 `Profile`, `FitnessCenter`, `Exercise`, `RoleAssociation`, `InquiryMessage`처럼 Aggregate Root가 아닌 모델을 대상으로 오면:

- 독립 Repository를 만들지 않습니다.
- 어느 Aggregate Root Repository에 메서드를 추가해야 하는지 판단합니다.
- 예: `Profile` 조회 요구는 `UsersRepository`, `fitness center` 조회 요구는 `SpacesRepository`, `exercise` 조회 요구는 `TasksRepository` 메서드로 구현

### 4. 메서드 네이밍 규칙

- Repository는 "왜"가 아니라 "어떤 데이터를 가져오는지"만 표현합니다.
- 허용 prefix: `find`, `count`, `create`, `createMany`, `updateById`, `removeById`, `deleteById`, `exists`
- `get`, `ForAuth`, `Accessible`, `Valid`, `Crud`, `Visibility` 등 도메인 목적 표현 금지

### 5. 타입 규칙

- 생성/수정 파라미터는 Prisma 타입을 사용합니다.
- Prisma create/update input은 Repository 또는 Repository 인접 persistence mapper 경계에서만 노출합니다. Controller, Command, UseCase, Aggregate public method로 역류시키지 않습니다.
- Repository 파일 내부에서 `interface`, `type`, `enum` 선언 금지
- 반환은 Entity로 변환합니다.

```typescript
async create(userInput: Prisma.UserUncheckedCreateInput): Promise<User>
async updateById(id: bigint, userInput: Prisma.UserUncheckedUpdateInput): Promise<User>
```

---

## 내부 Entity 복원 경계

Repository는 내부 `src/to-domain-entity.ts`의 `toDomainEntity(EntityClass, persistedValue)`를
사용합니다. 기존 단일·배열 overload를 유지하며, 구현은 `toDomainData`를 거쳐
`@cocrepo/entity`의 공개 `hydrateEntity`를 호출합니다. 클래스가 필요 없는 조회
projection은 `toDomainData`를 사용합니다.

복원 정책과 네 권한 관계 그래프의 기준은 [Entity README](../../../packages/be-entity/README.md#내부-객체-복원)입니다.
DB 반환의 이메일 대소문자, 저장된 비밀번호, ULID, bigint, Date를 API 변환
데코레이터로 다시 처리하지 않습니다. `plainToInstance(Entity, record)`나
`ignoreDecorators: true`를 복원 우회로 사용하지 않습니다. JWT 캐시는 repository를
의존하지 않고 같은 공개 `hydrateEntity`를 직접 사용합니다.

`Policy.entries`, `Policy.roleAssignments`, `PolicyEntry.ability`,
`RoleAssignment.policy`의 기존 중첩 Entity와 공유·순환 참조를 유지합니다.
나머지 관계를 새 규칙으로 일괄 변환하지 않으며, 조회 projection이나 이미
복원된 관계 객체의 값은 보존합니다. 응답 공개 필드 필터링은 DTO 변환 경계가
담당하므로 Repository에서 API 전용 DTO를 생성하지 않습니다.

## 구현 원칙

### ✅ 권장

```typescript
await this.txHost.tx.user.findUnique(...)
await this.txHost.tx.user.findMany(...)

findByIdWithTenantsAndProfiles(id: bigint)
findByEmailSelectCredentials(email: string)
countBySpaceId(spaceId: bigint)

return userRecord ? toDomainEntity(User, userRecord) : null;
```

### ❌ 금지

```typescript
// Aggregate Root가 아닌 모델의 독립 Repository 금지
export class ProfilesRepository {}

// Aggregate Root 내부 종속 모델만을 위한 Repository 생성 금지
export class TaskExerciseRepository {}

// 범용 Prisma Args 전달 금지
findUnique(args: Prisma.UserFindUniqueArgs)

// 도메인 목적 메서드명 금지
findByEmailForAuth(email: string)

// 커스텀 타입 선언 금지
interface CreateUserParams {}
```

---

## 작업 프로세스

### 1단계: Aggregate Root 확인

- 대상 Entity가 어떤 schema 파일에 선언됐는지 찾습니다.
- 해당 모델이 `@aggregate-root: true`인지 먼저 확인합니다.
- 태그가 없으면 독립 Repository 생성 작업으로 진행하지 않습니다.

### 2단계: 기존 Repository 확인

- 기존 `{AggregateRoot}sRepository`가 있으면 우선 그 파일에 메서드를 추가합니다.
### 3단계: 종속 모델 접근 설계

- Aggregate Root 내부의 종속 모델이나 명시적 관계 모델 데이터가 필요하면 해당 Aggregate Root Repository에서 `include`, `select`, relation filter로 처리합니다.
- 종속 모델 전용 Repository로 책임을 쪼개지 않습니다.

### 4단계: index.ts / spec 동기화

- `packages/be-repository/src/index.ts` export를 갱신합니다.
---

## 예시

### 올바른 패턴

```typescript
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class UsersRepository {
  async findByIdWithTenantsAndProfiles(id: bigint): Promise<User | null> {
    const userRecord = await this.txHost.tx.user.findUnique({
      where: { id },
      include: {
        profiles: true,
        tenants: true,
      },
    });

    return userRecord ? toDomainEntity(User, userRecord) : null;
  }
}
```

`Profile`가 필요해도 `ProfilesRepository`를 만들지 않고 `UsersRepository`에 포함합니다.

---

## 산출물 체크리스트

- 대상 모델에 `@aggregate-root: true`가 있는가?
- Aggregate Root가 아닌 모델의 독립 Repository를 만들지 않았는가?
- 메서드명이 데이터 설명 중심인가?
- Prisma 타입을 직접 사용했는가?
- `toDomainEntity`를 통해 API 데코레이터 없이 내부 값을 복원하는가?
- 권한 관계 네 개와 Entity 메서드·bigint·Date·비밀번호·ULID 보존을 관련 테스트에서 확인했는가?
- index.ts와 Repository 계약을 함께 갱신했는가?

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
