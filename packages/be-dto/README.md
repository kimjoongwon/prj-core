# @cocrepo/dto

NestJS 애플리케이션을 위한 Data Transfer Objects (DTO) 패키지입니다.

## 설치

```bash
pnpm add @cocrepo/dto
```

## 주요 기능

### DTO 구조

이 패키지는 CRUD 작업별로 DTO를 구성합니다:

- **기본 DTO**: 엔티티의 응답 형태
- **Create DTO**: 생성 요청
- **Update DTO**: 수정 요청
- **Query DTO**: 조회/필터링 요청

Entity 기반 응답 DTO는 `EntityResponseType`으로 Entity의 필드 메타데이터를
재사용합니다. 응답에 포함할 필드만 `pick`으로 선택하고, API 전용 관계는
`relations`의 지연 callback으로 지정합니다. 관계 callback의 반환 타입은
순환 참조를 피하기 위해 API 타입으로 추론하지 않으며, 필요한 관계 타입은
DTO에서 `declare`로 좁힙니다.

### 핵심 응답의 API 전용 계약

Role·User·조직·운동·일정·템플릿·감사·보안 정책의 일반 응답은 Entity에서 공개 필드를 직접 선택합니다. 관계는 지연 callback과 DTO의 `declare` 타입만 지정하며, 필드 데코레이터와 내부 ULID 제외 선언을 중복하지 않습니다.

`UserDto.spaceId`, `ProgramDto.activityCount/previewExerciseNames/executionPlan`은 API projection으로 유지합니다. `AbilityDto.fields/conditions`는 Entity의 필드 타입을 사용하되 기존 일반 응답의 Swagger 미선언 계약을 보존합니다. `SubjectSummaryDto`의 nullable 미선언 표시 필드와 `FitnessCenterSpaceDto`의 기본값 없는 콘텐츠 언어도 해당 API 계약에 남습니다. `UserClassificationDto.user`는 기존 Swagger·Prisma와 동일한 단일 `UserDto` 관계입니다.

### Entity 응답 변환 경계

`EntityResponseType(Entity, { pick, relations, extraFields })`는 선택한 필드의
검증·변환·Swagger 메타데이터를 복사합니다. 관계는 `ClassField`를 다시 적용하지
않고 중첩 `Type`과 Swagger의 타입 대상만 교체하여 필수·nullable·배열·설명을
보존합니다. Entity의 메서드는 DTO로 상속하지 않습니다.

`extraFields`는 Entity에 없거나 Entity와 API 계약이 다른 필드의 공개 목록입니다.
해당 필드의 API 타입과 데코레이터는 DTO에서 선언합니다. Entity와 API의 타입·
검증·nullable·기본값·Swagger 노출 계약이 다른 필드는 `pick`에서 제외하고
`extraFields`로 명시한 뒤 기존 API 계약으로 선언합니다.

실제 API 응답은 `DtoTransformInterceptor`가 사용하는 `transformToDto`를 통과합니다.
이 함수는 `prepareEntityResponseType`으로 변환 전에 concrete DTO의 `Exclude`
전략을 준비합니다. Entity 응답을 포함하는 wrapper는 Swagger·Expose로 선언된
공개 필드를 유지하고 임의 속성을 제외합니다. 그 안의 Entity 응답과 API 전용
중첩 관계도 같은 공개 필드 정책을 적용합니다. Entity 응답이 없는 일반 DTO의
기존 변환 동작은 유지합니다. Entity 응답 변환 실패 시 원본
Entity를 반환하지 않습니다.

Entity가 없는 API 전용 관계 DTO는 상속된 Swagger 필드와 기존 `Expose` 필드를
공개합니다. Swagger에 없는 `Type` 전용 필드는 공개 여부를 나타내는 `Expose`가
필요합니다. `Exclude` 필드는 계속 제외되고 임의 속성은 노출하지 않습니다.
관계 준비는 실제 응답 변환 시 수행하므로 상호 참조 callback을 모듈 선언 중에
실행하지 않습니다.

직접 class-transformer를 사용하는 테스트나 별도 경계에서는 먼저
`prepareEntityResponseType(DtoClass)`를 호출해야 합니다. 기본 옵션의
`plainToInstance`만으로는 상속한 클래스의 제외 전략이 보장되지 않습니다.
현재 사용처가 없는 Entity의 deprecated `toDto()` 경로는 새 응답 경계로 사용하지
않으며, Entity가 DTO helper를 import하도록 의존성을 추가하지 않습니다.

---

## 사용 예시

### 기본 DTO 사용

```typescript
import type { UserDto } from '@cocrepo/dto';

function readUserEmail(user: UserDto): string {
  return user.email;
}
```

DTO 인스턴스의 숫자 ID는 bigint이며, API 응답에서는 decimal 문자열로 직렬화됩니다.
Entity에서 DTO로 변환하는 코드는 위 공통 응답 경계를 사용합니다.

### Create DTO와 Update DTO 파생

```typescript
import { Role } from '@cocrepo/entity';
import { PartialType, PickType } from '@nestjs/swagger';

// 각각 create-role.dto.ts / update-role.dto.ts에 선언합니다.
export class CreateRoleDto extends PickType(Role, [
  'name', 'displayName', 'description',
] as const) {}

export class UpdateRoleDto extends PartialType(
  PickType(Role, ['displayName', 'description'] as const),
) {}
```

생성·수정의 허용 필드를 각각 명시하고 Entity에서 직접 파생합니다. 필수·선택·
null·기본값의 세부 계약과 API 전용 예외는 [요청 계약 문서](request-contracts.md)를
따릅니다. 현재 controller에서 사용하지 않는 `CreateUserDto/UpdateUserDto`도
기존 필드 계약을 유지하며, 평문 비밀번호 입력은 별도 인증·회원 입력 DTO가 소유합니다.

### Query DTO 사용

`EntityQueryType(Entity, filterKeys)`는 `QueryDto`를 실제로 상속하여
`skip/take/toPageMetaDto()`를 보존합니다. Entity와 같은 의미의 ID·enum·boolean
필터 메타데이터를 선택하고, 검색어·정렬·기간·null 특수값·관계 검색 등 API 전용
계약은 Query DTO에 둡니다. Entity 메서드·초기값과 선택 필드의 Swagger `default`는
가져오지 않습니다.

선택 필터는 `PartialType(..., { skipNullProperties: false })`로 생략만 허용합니다.
`null`은 선택된 Entity 필드의 nullable 정책에 따라 검증합니다. Entity에서는
nullable이어도 검색 API가 null을 금지하던 관계 ID는 Query 전용 선언을 유지하고,
`"null"`을 검색 특수값으로 받는 기존 변환도 해당 Query DTO에 둡니다.

```typescript
import { QueryUserDto } from '@cocrepo/dto';
import { plainToInstance } from 'class-transformer';

const query = plainToInstance(QueryUserDto, { skip: '0', take: '20' });
const pageMeta = query.toPageMetaDto(75);
```

---

## 제공 DTO 목록

### 인증 (Auth)

| DTO | 설명 |
|-----|------|
| `LoginPayloadDto` | 로그인 요청 |
| `SignUpPayloadDto` | 회원가입 요청 |
| `TokenDto` | 토큰 응답 |

### 사용자/조직

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| User | `UserDto` | `CreateUserDto` | `UpdateUserDto` | `QueryUserDto` |
| Tenant | `TenantDto` | `CreateTenantDto` | `UpdateTenantDto` | `QueryTenantDto` |
| Space | `SpaceDto` | `CreateSpaceDto` | `UpdateSpaceDto` | `QuerySpaceDto` |
| Role | `RoleDto` | `CreateRoleDto` | `UpdateRoleDto` | `QueryRoleDto` |
| Group | `GroupDto` | — | — | — |

### 콘텐츠

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| Category | `CategoryDto` | — | — | — |
| Exercise | `ExerciseDto` | `CreateExerciseDto` | `UpdateExerciseDto` | `GetExercisesQueryDto` |
| Program | `ProgramDto` | `CreateProgramDto` | `UpdateProgramDto` | `QueryProgramDto` |
| Routine | `RoutineDto` | `CreateRoutineDto` | `UpdateRoutineDto` | `QueryRoutineDto` |
| Subject | `SubjectDto` | — | — | — |

### 일정

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| Timeline | `TimelineDto` | `CreateTimelineDto` | `UpdateTimelineDto` | `QueryTimelineDto` |
| Session | `SessionDto` | `CreateSessionDto` | `UpdateSessionDto` | `QuerySessionDto` |
| FitnessCenter | `FitnessCenterDto` | `CreateFitnessCenterDto` | `UpdateFitnessCenterDto` | `QueryFitnessCenterDto` |

### 에셋

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| Asset | `AssetDto` | `CreateAssetDto` | `UpdateAssetDto` | `AssetQueryDto` |

### 연관/분류

| 엔티티 | 기본 | Create | Update | Query |
|--------|------|--------|--------|-------|
| UserAssociation | `UserAssociationDto` | `CreateUserAssociationDto` | `UpdateUserAssociationDto` | `QueryUserAssociationDto` |
| SpaceAssociation | `SpaceAssociationDto` | `CreateSpaceAssociationDto` | `UpdateSpaceAssociationDto` | `QuerySpaceAssociationDto` |
| RoleAssociation | `RoleAssociationDto` | `CreateRoleAssociationDto` | `UpdateRoleAssociationDto` | `QueryRoleAssociationDto` |

---

## 파일 구조

```
src/
├── auth/                    # 인증 관련 DTO
│   ├── login-payload.dto.ts
│   ├── sign-up-payload.dto.ts
│   ├── token.dto.ts
│   └── index.ts
├── create/                  # 생성 DTO
│   ├── create-user.dto.ts
│   ├── create-tenant.dto.ts
│   └── ...
├── update/                  # 수정 DTO
│   ├── update-user.dto.ts
│   ├── update-tenant.dto.ts
│   └── ...
├── query/                   # 조회 DTO
│   ├── query-user.dto.ts
│   ├── page-meta.dto.ts
│   ├── query.dto.ts
│   └── ...
├── mapped-types/            # 응답 파생과 공개 필드 준비
├── abstract.dto.ts          # AbstractEntity 공통 필드의 Mapped Type
├── user.dto.ts              # 기본 DTO
├── tenant.dto.ts
└── index.ts
```

---

## 페이지네이션

`QueryDto`는 offset 방식의 `skip/take`를 사용합니다. `skip`은 0 이상,
`take`는 1~200이며 기본값은 지정하지 않습니다. `toPageMetaDto(totalCount)`가
기존 `PageMetaDto`를 반환합니다. `sort?: string[]`은 해당 검색 API에 필요할 때
하위 Query DTO에 선언하고 JSON:API의 `name`/`-createdAt` 형식을 유지합니다.

검증은 다음 명령을 사용합니다.

```bash
pnpm --filter @cocrepo/dto type-check
pnpm --filter @cocrepo/dto test
pnpm --filter @cocrepo/dto lint
```

---

## 의존성

- `@cocrepo/constant` - 상수
- `@cocrepo/decorator` - 필드 데코레이터
- `@cocrepo/entity` - 공통 필드·관계 메타데이터
- `@nestjs/mapped-types` - Query 메타데이터 상속
- `@cocrepo/enum` - 열거형
- `@cocrepo/toolkit` - 유틸리티
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
- `class-validator` (peer)
- `class-transformer` (peer)
