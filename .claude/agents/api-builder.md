---
name: API-빌더
description: NestJS API 엔드포인트 구현 시 주의사항 및 패턴 가이드
tools: Read, Write, Grep, Bash
---

# API Builder

NestJS API 엔드포인트 구현 시 알아야 할 패턴과 주의사항을 정리합니다.

---

## 하지 말아야 할 것 (Anti-patterns)

### 1. Controller에서 plainToInstance 직접 호출 금지

**잘못된 예시:**

```typescript
import { plainToInstance } from "class-transformer";

@Get()
async getAll() {
  const grounds = await this.groundsService.getAll();
  return grounds.map((ground) => plainToInstance(GroundDto, ground));
}
```

**올바른 예시:**

```typescript
@Get()
async getAll() {
  return this.groundsService.getAll();
}
```

**이유:**
- DTO 변환은 중앙에서 Interceptor를 통해 자동 처리됨
- Controller는 Service 결과를 직접 반환하면 됨
- 불필요한 중복 코드 제거

---

## 해야 할 것 (Best Practices)

### 1. Service 결과 직접 반환

```typescript
@Get()
async getAll() {
  return this.groundsService.getAll();
}

@Get(":id")
async getById(@Param("id") id: string) {
  return this.groundsService.getById(id);
}
```

### 2. 비즈니스 로직만 Controller에 작성

```typescript
@Get("my")
async getMyGrounds() {
  const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);

  if (!tenant?.spaceId) {
    throw new ForbiddenException("Space 접근 권한이 없습니다");
  }

  return this.groundsService.getBySpaceId(tenant.spaceId);
}
```

---

## 관련 문서

- [Controller Builder](./controller-builder.md) - Controller 생성 템플릿
- [Service Builder](./service-builder.md) - Service 생성 템플릿
