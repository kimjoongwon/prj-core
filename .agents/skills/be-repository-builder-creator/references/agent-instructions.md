# be-repository-builder 상세 지시

원본 에이전트 파일: `.codex/agents/15-be-repository-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


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
| | Repository 인벤토리 | 담당 스펙의 `백엔드 / API 계약` 아래 repository 행 |
| | 필요한 쿼리 패턴 | CRUD, include 조회, 집계, exists 등 |
| **출력** | Repository 클래스 | `packages/be-repository/src/{aggregate-root}.repository.ts` |
| | Repository 계약 | 담당 스펙의 `Repository 인벤토리` 행 |
| | index.ts 업데이트 | export 추가 |

---

## 가장 중요한 규칙

### 1. Repository는 Aggregate Root만 만든다

- 스키마 주석에 `@aggregate-root: true`가 붙은 모델만 독립 Repository 생성 대상입니다.
- 담당 스펙의 `Repository 인벤토리`에 명시된 영속성 필요/모델/메서드만 생성/수정하고, 행의 `재사용/신규`, `소스/대상`, 소스 담당 `agent_type`, 소비 `agent_type` 계약을 벗어나지 않습니다.
- Repository 행이 없거나 Aggregate Root가 불명확하면 구현하지 말고 `계약-gap`으로 보고합니다.
- `@aggregate-root: true`가 없는 모델은 독립 Repository를 만들지 않습니다.
- 종속 모델 접근은 해당 Aggregate Root Repository 안의 include/where/query 메서드로 처리합니다.
- persistence mapping과 query input 조립 시 `input.xxx`, `entity.id`, `row.field`처럼 값의 원천을 보존합니다. 여러 source가 섞이면 deep destructuring으로 bare variable을 남기지 않습니다.
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
async create(data: Prisma.UserUncheckedCreateInput): Promise<User>
async updateById(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
```

---

## 구현 원칙

### ✅ 권장

```typescript
await this.txHost.tx.user.findUnique(...)
await this.txHost.tx.user.findMany(...)

findByIdWithTenantsAndProfiles(id: string)
findByEmailSelectCredentials(email: string)
countBySpaceId(spaceId: string)

return result ? plainToInstance(User, result) : null;
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
- 없으면 새 Repository를 생성하고 Repository 계약은 route `page.spec.md` 또는 담당 스펙에 기록합니다.

### 3단계: 종속 모델 접근 설계

- Aggregate Root 내부의 종속 모델이나 명시적 관계 모델 데이터가 필요하면 해당 Aggregate Root Repository에서 `include`, `select`, relation filter로 처리합니다.
- 종속 모델 전용 Repository로 책임을 쪼개지 않습니다.

### 4단계: index.ts / spec 동기화

- `packages/be-repository/src/index.ts` export를 갱신합니다.
- 별도 repository spec은 만들지 않고 담당 스펙 또는 route `page.spec.md`의 Repository 계약을 갱신합니다.

---

## 예시

### 올바른 패턴

```typescript
@Injectable()
export class UsersRepository {
  async findByIdWithTenantsAndProfiles(id: string): Promise<User | null> {
    const result = await this.txHost.tx.user.findUnique({
      where: { id },
      include: {
        profiles: true,
        tenants: true,
      },
    });

    return result ? plainToInstance(User, result) : null;
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
- index.ts와 Repository 계약을 함께 갱신했는가?
