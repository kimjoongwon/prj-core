# Detailed Instructions for be-repository-builder

Source agent file: `.codex/agents/be-repository-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 Repository, Entity, Prisma schema, spec, 테스트를 먼저 검색합니다.
- 신규 Repository 생성 전에 기존 schema-owner Repository에 메서드를 추가하는 편이 맞는지 먼저 판단합니다.
- 동일 책임의 중복 Repository를 금지합니다.


# Repository Builder

Prisma 기반 Repository 레이어를 생성하는 전문가입니다. 이 에이전트는 **`@schema-owner: true`가 붙은 대표 모델에 대해서만** Repository를 생성합니다.

---

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| schema-owner 모델의 데이터 접근 레이어 필요 | ✅ 사용 | Repository 생성 |
| 기존 schema-owner Repository에 조회/집계 메서드 추가 | ✅ 사용 | 쿼리 메서드 추가 |
| CHILD/DETAIL/JOIN 모델 전용 독립 Repository 생성 | ❌ 미사용 | 부모 schema-owner Repository에 포함 |
| 비즈니스 로직 추가 | ❌ 미사용 | service-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

---

## 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Entity 클래스 | `@cocrepo/entity`의 대표 모델 |
| | Prisma schema 모델 | `@schema-owner: true`가 붙은 모델 |
| | Repository 인벤토리 | owner spec의 `백엔드 / API 계약` 아래 repository row |
| | 필요한 쿼리 패턴 | CRUD, include 조회, 집계, exists 등 |
| **출력** | Repository 클래스 | `packages/be-repository/src/{schema-owner}.repository.ts` |
| | Repository contract | owner spec의 `Repository 인벤토리` row |
| | index.ts 업데이트 | export 추가 |

---

## 가장 중요한 규칙

### 1. Repository는 schema-owner만 만든다

- 스키마 주석에 `@schema-owner: true`가 붙은 모델만 독립 Repository 생성 대상입니다.
- owner spec의 `Repository 인벤토리`에 명시된 영속성 필요/모델/메서드만 생성/수정하고, row의 `재사용/신규`, `소스/대상`, 소스 담당 `agent_type`, 소비 `agent_type` 계약을 벗어나지 않습니다.
- Repository row가 없거나 schema-owner가 불명확하면 구현하지 말고 `contract-gap`으로 보고합니다.
- `CHILD`, `DETAIL`, `JOIN` 모델이더라도 별도 marker가 없으면 독립 Repository를 만들지 않습니다.
- 하위 모델 접근은 부모 schema-owner Repository 안의 include/where/query 메서드로 처리합니다.
- persistence mapping과 query input 조립 시 `input.xxx`, `entity.id`, `row.field`처럼 값의 원천을 보존합니다. 여러 source가 섞이면 deep destructuring으로 bare variable을 남기지 않습니다.
- Repository class는 class당 하나의 파일을 가집니다.
- Repository class 파일에는 top-level helper/mapper/type/interface를 함께 두지 않습니다. query input/result/mapper/helper가 필요하면 가까운 별도 파일로 분리합니다.

예시:

- `UserRepository`는 가능
- `ProfileRepository`는 금지
- `SpacesRepository`는 가능
- `FoldersRepository`는 가능
- `GroundRepository`는 금지 (`Space` child는 부모 repository에서 처리)
- `TaskRepository`는 가능
- `ExerciseRepository`는 금지 (`Task` child는 부모 repository에서 처리)
- `RolesRepository`는 가능
- `RoleAssociationsRepository`는 금지

### 2. 대상 모델 확인 절차

Repository 생성 전 반드시 아래를 확인합니다.

- 해당 모델이 schema 파일의 대표 모델(`@schema-owner: true`)인지
- 해당 모델 주석에 `@schema-owner: true`가 있는지
- 대응 schema 파일이 도메인 폴더 구조 아래에 있는지

확인 대상 예시:

- `packages/be-prisma/schema/identity/user.prisma`
- `packages/be-prisma/schema/access-control/role.prisma`
- `packages/be-prisma/schema/content/content.prisma`

### 3. 비대표 모델 요청 처리

요청이 `Profile`, `Ground`, `Exercise`, `RoleAssociation`, `InquiryMessage`처럼 비대표 모델을 대상으로 오면:

- 독립 Repository를 만들지 않습니다.
- 어느 schema-owner Repository에 메서드를 추가해야 하는지 판단합니다.
- 예: `Profile` 조회 요구는 `UsersRepository`, `ground` 조회 요구는 `SpacesRepository`, `exercise` 조회 요구는 `TasksRepository` 메서드로 구현

### 4. 메서드 네이밍 규칙

- Repository는 "왜"가 아니라 "어떤 데이터를 가져오는지"만 표현합니다.
- 허용 prefix: `find`, `count`, `create`, `createMany`, `updateById`, `removeById`, `deleteById`, `exists`
- `get`, `ForAuth`, `Accessible`, `Valid`, `Crud`, `Visibility` 등 도메인 목적 표현 금지

### 5. 타입 규칙

- 생성/수정 파라미터는 Prisma 타입을 사용합니다.
- Repository 파일 내부에서 `interface`, `type`, `enum` 선언 금지
- 반환은 Entity로 변환합니다.

```typescript
async create(data: Prisma.UserUncheckedCreateInput): Promise<User>
async updateById(id: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>
```

---

## 구현 원칙

### ✅ Do

```typescript
await this.txHost.tx.user.findUnique(...)
await this.txHost.tx.user.findMany(...)

findByIdWithTenantsAndProfiles(id: string)
findByEmailSelectCredentials(email: string)
countBySpaceId(spaceId: string)

return result ? plainToInstance(User, result) : null;
```

### ❌ Don't

```typescript
// 비대표 모델 독립 Repository 금지
export class ProfilesRepository {}

// 대표 모델과 다른 aggregate child만을 위한 repository 생성 금지
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

### 1단계: schema-owner 확인

- 대상 Entity가 어떤 schema 파일에 선언됐는지 찾습니다.
- 해당 모델이 `@schema-owner: true`인지 먼저 확인합니다.
- marker가 없으면 독립 Repository 생성 작업으로 진행하지 않습니다.

### 2단계: 기존 Repository 확인

- 기존 `{SchemaOwner}sRepository`가 있으면 우선 그 파일에 메서드를 추가합니다.
- 없으면 새 Repository를 생성하고 Repository Contract는 route `page.spec.md` 또는 owner spec에 기록합니다.

### 3단계: 하위 모델 접근 설계

- CHILD/DETAIL/JOIN 데이터가 필요하면 부모 Repository에서 `include`, `select`, relation filter로 처리합니다.
- 하위 모델 전용 Repository로 책임을 쪼개지 않습니다.

### 4단계: index.ts / spec 동기화

- `packages/be-repository/src/index.ts` export를 갱신합니다.
- 별도 repository spec은 만들지 않고 owner spec 또는 route `page.spec.md`의 Repository Contract를 갱신합니다.

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

- 대상 모델에 `@schema-owner: true`가 있는가?
- 비대표 모델 독립 Repository를 만들지 않았는가?
- 메서드명이 데이터 설명 중심인가?
- Prisma 타입을 직접 사용했는가?
- index.ts와 Repository Contract를 함께 갱신했는가?

## Feedback Packet (필수)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
