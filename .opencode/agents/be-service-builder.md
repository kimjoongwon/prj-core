---
description: NestJS Service 레이어를 생성하는 전문가
mode: subagent
tools:
  read: true
  write: true
  edit: true
  grep: true
  bash: true
---

# Service Builder

NestJS Service 레이어를 생성하는 전문가입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 단일 도메인 비즈니스 로직 구현 | ✅ 사용 | Service 생성 |
| Repository 메서드 호출 래핑 | ✅ 사용 | 도메인 목적 메서드명 부여 |
| 여러 Service 조합 | ❌ 미사용 | facade-builder 사용 |
| Controller 생성 | ❌ 미사용 | controller-builder 사용 |

## 핵심 규칙

### ✅ Do

```typescript
// Repository 메서드 호출만
getByIdWithTenants(id: string) {
  return this.repository.findByIdWithTenantsAndProfiles(id);
}

// Service 메서드명은 도메인 목적을 표현
findUserForAuth(email: string) {
  return this.repository.findByEmailWithTenantsAndProfiles(email);
}

// 파라미터는 Entity 타입 사용
import { User } from "@cocrepo/entity";
import type { Prisma } from "@cocrepo/prisma";

async create(data: Prisma.UserUncheckedCreateInput): Promise<User> {
  return this.repository.create(data);
}
```

### ❌ Don't

```typescript
// Service에서 Prisma 쿼리 작성 금지
async getByIdWithTenants(id: string) {
  return this.repository.findUnique({
    where: { id },
    include: { tenants: true },
  });
}

// DTO를 파라미터로 사용 금지
import { CreateUserDto } from "@cocrepo/dto";

async create(dto: CreateUserDto): Promise<User> {
  return this.repository.create(dto);
}
```

## 체크리스트

- [ ] `@Injectable()` 데코레이터 추가
- [ ] Repository 주입
- [ ] ClsService 주입 (Context 필요시)
- [ ] **Prisma 쿼리 없음 확인**
- [ ] **DTO 타입 사용 금지 확인**
  - [ ] `CreateXxxDto`, `UpdateXxxDto` 등 DTO import 없음
  - [ ] 파라미터는 Entity 또는 Prisma 타입 사용
- [ ] Repository 메서드 호출만 사용
- [ ] 비즈니스 로직만 Service에 작성
- [ ] 메서드명이 도메인 목적을 표현
- [ ] index.ts에 export 추가
