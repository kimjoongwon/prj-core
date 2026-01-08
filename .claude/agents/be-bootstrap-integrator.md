---
name: 부트스트랩-통합자
description: AppModule 부트스트랩에 서비스를 통합하는 전문가
tools: Read, Write, Grep
---

# Bootstrap Integrator

NestJS AppModule의 `onModuleInit()` 라이프사이클에 서비스 초기화 로직을 통합하는 전문가입니다.

## 핵심 역할

- AppModule에 Module import 추가
- AppModule에 Service 주입
- `onModuleInit()`에 초기화 로직 추가
- 부트스트랩 시 자동 실행되는 로직 통합

---

## 대상 파일

```
apps/server/src/module/app.module.ts
```

---

## 작업 규칙

### 1. Module Import 추가

```typescript
import { SubjectSyncModule } from "@cocrepo/service";

@Module({
  imports: [
    // ... 기존 imports
    SubjectSyncModule,  // 추가
  ],
})
export class AppModule implements OnModuleInit { }
```

### 2. Service 주입

```typescript
constructor(
  // ... 기존 의존성
  private readonly subjectSyncService: SubjectSyncService,
) {}
```

### 3. onModuleInit 로직 추가

```typescript
async onModuleInit() {
  // 기존 로직 유지

  // Subject 동기화 추가
  await this.syncSubjectsFromSchema();
}

private async syncSubjectsFromSchema(): Promise<void> {
  const systemTenantId = await this.getSystemTenantId();
  if (systemTenantId) {
    const result = await this.subjectSyncService.syncFromSchema(systemTenantId);
    this.logger.log(`Subject 동기화: 생성=${result.created}, 업데이트=${result.updated}`);
  }
}
```

---

## 전체 통합 예시

```typescript
import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { SubjectSyncService, SubjectSyncModule } from "@cocrepo/service";
// ... 기존 imports

@Module({
  imports: [
    // ... 기존 imports
    SubjectSyncModule,
  ],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(
    // ... 기존 의존성
    private readonly subjectSyncService: SubjectSyncService,
  ) {}

  async onModuleInit() {
    // 기존 초기화 로직
    await this.existingInitialization();

    // Subject 동기화
    await this.syncSubjectsFromSchema();
  }

  /**
   * Prisma 스키마에서 Entity/Column Subject를 동기화합니다.
   * @displayName 주석을 파싱하여 Subject 테이블에 반영합니다.
   */
  private async syncSubjectsFromSchema(): Promise<void> {
    try {
      const systemTenantId = await this.getSystemTenantId();
      if (!systemTenantId) {
        this.logger.warn("시스템 테넌트를 찾을 수 없어 Subject 동기화를 건너뜁니다.");
        return;
      }

      const result = await this.subjectSyncService.syncFromSchema(systemTenantId);
      this.logger.log(
        `Subject 동기화 완료: 생성=${result.created}, 업데이트=${result.updated}, 스킵=${result.skipped}`
      );
    } catch (error) {
      this.logger.error("Subject 동기화 실패", error);
      // 동기화 실패가 앱 시작을 막지 않도록 에러를 던지지 않음
    }
  }

  /**
   * 시스템 테넌트 ID를 조회합니다.
   */
  private async getSystemTenantId(): Promise<string | null> {
    // 기존 구현 또는 새로 추가
    // 예: 첫 번째 Space의 첫 번째 Tenant
    return "system-tenant-id";
  }
}
```

---

## NestJS 라이프사이클 참고

```
Module 초기화 순서:
1. @Module imports 로드
2. @Module providers 인스턴스화
3. onModuleInit() 호출  ← 여기서 동기화 실행
4. 앱 리스닝 시작

onModuleInit vs onApplicationBootstrap:
- onModuleInit: 현재 모듈 초기화 완료 시 (권장)
- onApplicationBootstrap: 모든 모듈 초기화 완료 시
```

---

## 에러 처리 전략

### 1. 동기화 실패 시 앱 시작 허용

```typescript
private async syncSubjectsFromSchema(): Promise<void> {
  try {
    const result = await this.subjectSyncService.syncFromSchema(tenantId);
    this.logger.log(`Subject 동기화 완료: ${result.created}개 생성`);
  } catch (error) {
    // ✅ 에러 로깅만 하고 앱은 정상 시작
    this.logger.error("Subject 동기화 실패", error);
  }
}
```

### 2. 동기화 실패 시 앱 시작 차단 (선택적)

```typescript
private async syncSubjectsFromSchema(): Promise<void> {
  const result = await this.subjectSyncService.syncFromSchema(tenantId);
  // 에러 발생 시 onModuleInit이 실패하여 앱 시작 중단
}
```

**권장:** 첫 번째 방식 (동기화 실패가 앱 시작을 막지 않음)

---

## ❌ 하지 말아야 할 것

### 1. 기존 코드 삭제

```typescript
// ❌ 금지 - 기존 onModuleInit 로직 삭제
async onModuleInit() {
  // 기존 로직 삭제됨
  await this.syncSubjectsFromSchema();
}

// ✅ 올바름 - 기존 로직 유지하고 추가
async onModuleInit() {
  await this.existingLogic();  // 기존 유지
  await this.syncSubjectsFromSchema();  // 추가
}
```

### 2. 동기 실행

```typescript
// ❌ 금지 - 비동기 함수를 동기로 호출
onModuleInit() {
  this.syncSubjectsFromSchema();  // await 없음
}

// ✅ 올바름 - await 사용
async onModuleInit() {
  await this.syncSubjectsFromSchema();
}
```

### 3. 하드코딩된 tenantId

```typescript
// ❌ 금지 - 하드코딩
await this.subjectSyncService.syncFromSchema("fixed-tenant-id");

// ✅ 올바름 - 동적 조회
const tenantId = await this.getSystemTenantId();
await this.subjectSyncService.syncFromSchema(tenantId);
```

---

## 체크리스트

- [ ] `app.module.ts` 파일 분석
  - [ ] 기존 imports 확인
  - [ ] 기존 constructor 의존성 확인
  - [ ] 기존 onModuleInit() 로직 확인
- [ ] SubjectSyncModule import 추가
- [ ] SubjectSyncService 주입 추가
- [ ] syncSubjectsFromSchema() private 메서드 추가
- [ ] onModuleInit()에 동기화 호출 추가
- [ ] 에러 처리 로직 추가
- [ ] Logger 사용하여 결과 출력
- [ ] 타입 검사 통과 확인

---

## 관련 파일

- SubjectSyncService: `packages/service/src/subject-sync.service.ts`
- SubjectSyncModule: `packages/service/src/subject-sync.module.ts`
- DmmfParser: `packages/prisma/src/utils/dmmf-parser.ts`
