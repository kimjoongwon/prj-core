# @cocrepo/entity

데이터베이스 엔티티 타입 정의 패키지입니다. Prisma 스키마와 매핑되는 TypeScript 클래스를 제공합니다.

## 설치

```bash
pnpm add @cocrepo/entity
```

## 주요 기능

### 엔티티 클래스

Prisma 모델과 매핑되는 TypeScript 클래스입니다. Swagger 문서화와 유효성 검증 데코레이터가 적용되어 있습니다.

---

## 사용 예시

### 기본 사용

```typescript
import { UserEntity, TenantEntity, SpaceEntity } from '@cocrepo/entity';

// 타입으로 사용
function processUser(user: UserEntity) {
  console.log(user.email);
}
```

### 상속을 통한 확장

```typescript
import { AbstractEntity } from '@cocrepo/entity';

// AbstractEntity를 상속하여 공통 필드 사용
class CustomEntity extends AbstractEntity {
  customField: string;
}
```

### 응답 엔티티 사용

```typescript
import { ResponseEntity } from '@cocrepo/entity';

// API 응답 래퍼
const response: ResponseEntity<UserEntity> = {
  success: true,
  data: userEntity,
  meta: {
    timestamp: new Date(),
  },
};
```

---

## 제공 엔티티 목록

### 핵심 엔티티

| 엔티티 | 설명 |
|--------|------|
| `AbstractEntity` | 모든 엔티티의 기본 클래스 (id, createdAt, updatedAt) |
| `ResponseEntity` | API 응답 래퍼 |

### 사용자/조직

| 엔티티 | 설명 |
|--------|------|
| `UserEntity` | 사용자 |
| `ProfileEntity` | 사용자 프로필 |
| `TenantEntity` | 테넌트 (최상위 조직) |
| `TenancyEntity` | 테넌시 정보 |
| `SpaceEntity` | 스페이스 (하위 조직/지점) |
| `RoleEntity` | 역할 |
| `GroupEntity` | 그룹 |

### 콘텐츠

| 엔티티 | 설명 |
|--------|------|
| `CategoryEntity` | 카테고리 |
| `ExerciseEntity` | 운동 |
| `ProgramEntity` | 프로그램 |
| `RoutineEntity` | 루틴 |
| `SubjectEntity` | 주제 |

### 일정

| 엔티티 | 설명 |
|--------|------|
| `TimelineEntity` | 타임라인 |
| `SessionEntity` | 세션 |
| `GroundEntity` | 그라운드 |

### 작업

| 엔티티 | 설명 |
|--------|------|
| `TaskEntity` | 작업 (추상) |
| `ActivityEntity` | 활동 |
| `ActionEntity` | 액션 |
| `AssignmentEntity` | 할당 |

### 파일

| 엔티티 | 설명 |
|--------|------|
| `FileEntity` | 파일 |
| `FileAssociationEntity` | 파일 연관 |
| `FileClassificationEntity` | 파일 분류 |

### 연관 (Association)

| 엔티티 | 설명 |
|--------|------|
| `UserAssociationEntity` | 사용자 연관 |
| `SpaceAssociationEntity` | 스페이스 연관 |
| `RoleAssociationEntity` | 역할 연관 |

### 분류 (Classification)

| 엔티티 | 설명 |
|--------|------|
| `UserClassificationEntity` | 사용자 분류 |
| `SpaceClassificationEntity` | 스페이스 분류 |
| `RoleClassificationEntity` | 역할 분류 |

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
├── ground.entity.ts             # 그라운드
├── task.entity.ts               # 작업
├── activity.entity.ts           # 활동
├── action.entity.ts             # 액션
├── assignment.entity.ts         # 할당
├── file.entity.ts               # 파일
├── file-association.entity.ts   # 파일 연관
├── file-classification.entity.ts
├── user-association.entity.ts   # 사용자 연관
├── space-association.entity.ts
├── role-association.entity.ts
├── user-classification.entity.ts
├── space-classification.entity.ts
├── role-classification.entity.ts
├── types/
│   ├── json.ts                  # JSON 타입
│   └── page-meta.ts             # 페이지 메타
└── index.ts
```

---

## AbstractEntity

모든 엔티티의 기본 클래스입니다:

```typescript
export class AbstractEntity {
  id: string;           // UUID
  createdAt: Date;      // 생성 일시
  updatedAt: Date;      // 수정 일시
  deletedAt?: Date;     // 삭제 일시 (soft delete)
}
```

---

## 의존성

- `@cocrepo/decorator` - 데코레이터
- `@cocrepo/types` - 타입 정의
- `class-transformer` - 직렬화
- `@prisma/client` (peer)
- `@nestjs/common` (peer)
- `@nestjs/swagger` (peer)
