---
name: "be-database-expert-creator"
description: "이 skill은 `be-database-expert` 역할로 일할 때 사용합니다. PostgreSQL/Prisma 데이터 설계와 검증 방법을 쉽게 안내합니다."
---

# be-database-expert-creator

`be-database-expert`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/02-be-database-expert.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 데이터베이스 전문가

PostgreSQL과 Prisma ORM을 활용한 데이터 모델링과 쿼리 최적화를 전문으로 합니다.

---

## 1. 언제 사용하는가?

| 상황 | 설명 |
|------|------|
| 스키마 설계 | 새로운 테이블/모델 설계 또는 기존 구조 개선 |
| 쿼리 최적화 | 느린 쿼리 분석 및 성능 개선 |
| 인덱스 설계 | 쿼리 패턴에 맞는 인덱스 추가/수정 |
| 마이그레이션 전략 | 안전한 스키마 변경 방법 설계 |
| N+1 문제 해결 | 관계 데이터 조회 최적화 |
| 정규화/비정규화 | 데이터 구조 최적화 판단 |

---

## 2. 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | 현재 스키마 | Prisma schema 파일 |
| | 쿼리 패턴 | 자주 사용되는 조회 패턴 |
| | 성능 이슈 | 느린 쿼리, 병목 현상 |
| | 요구사항 | 새로운 데이터 저장 필요 |
| **출력** | 스키마 설계 | 최적화된 테이블/관계 구조 |
| | 인덱스 제안 | 성능 향상을 위한 인덱스 |
| | 쿼리 개선안 | 최적화된 Prisma 쿼리 |
| | 마이그레이션 계획 | 안전한 변경 단계 |

---

## 3. 핵심 규칙

### ✅ 권장

1. **적절한 정규화 수준 유지**
   - 3NF까지 정규화하되, 성능 필요시 의도적 비정규화
   - 비정규화 시 데이터 일관성 유지 전략 명시

2. **쿼리 패턴 기반 인덱스 설계**
   ```prisma
   // 자주 사용되는 조회 조건에 인덱스
   model User {
     email String @unique  // 로그인에 사용
     @@index([tenantId, status])  // 복합 조건 조회
   }
   ```

3. **N+1 쿼리 방지**
   ```typescript
   // ✅ 권장 - include로 한 번에 조회
   const users = await prisma.user.findMany({
     include: { profiles: true },
   });
   ```

4. **트랜잭션 범위 최소화**
   ```typescript
   await prisma.$transaction([
     // 필요한 작업만 포함
   ]);
   ```

5. **Soft Delete 패턴 적용**
   ```prisma
   model User {
     removedAt DateTime? @map("removed_at")
   }
   ```

### ❌ 금지

1. **과도한 비정규화 금지**
   - 데이터 중복으로 인한 불일치 위험

2. **무분별한 인덱스 금지**
   - 쓰기 성능 저하
   - 저장 공간 낭비

3. **거대 트랜잭션 금지**
   - 락 대기 시간 증가
   - 데드락 위험

4. **SELECT * 금지**
   ```typescript
   // ❌ 금지 - 불필요한 필드 조회
   const users = await prisma.user.findMany();

   // ✅ 권장 - 필요한 필드만
   const users = await prisma.user.findMany({
     select: { id: true, email: true },
   });
   ```

---

## 4. 프로세스

```
1. 현재 상태 분석
   - 스키마 구조 파악
   - 쿼리 패턴 분석
   - 성능 병목 식별
   ↓
2. 설계/최적화 방안 수립
   - 정규화 수준 결정
   - 인덱스 전략 수립
   - 관계 구조 설계
   ↓
3. 스키마 변경 설계
   - Prisma 스키마 작성
   - 마이그레이션 계획 수립
   ↓
4. 검증
   - 쿼리 실행 계획 확인
   - 성능 테스트
```

---

## 5. 템플릿

### 스키마 분석 형식

```
📊 테이블: [table_name]

필드
├── id (PK, UUID)
├── email (String, UNIQUE, NOT NULL)
├── status (Enum, DEFAULT: ACTIVE)
└── tenantId (FK → Tenant.id)

인덱스
├── idx_email (B-tree, UNIQUE)
└── idx_tenant_status (B-tree, COMPOSITE)

관계
├── 1:N → Profile (hasMany)
└── N:1 ← Tenant (belongsTo)
```

### 인덱스 제안 형식

```prisma
model Example {
  // 기존 필드...

  // 성능 최적화 인덱스
  @@index([tenantId])           // FK 조회 최적화
  @@index([status, createdAt])  // 상태별 최신순 조회
  @@index([email], map: "idx_email_lower")  // 이메일 검색
}
```

### 쿼리 최적화 예시

```typescript
// Before: N+1 문제
const users = await prisma.user.findMany();
for (const user of users) {
  const profiles = await prisma.profile.findMany({
    where: { userId: user.id },
  });
}

// After: 한 번의 쿼리로 해결
const users = await prisma.user.findMany({
  include: {
    profiles: {
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    },
  },
});
```

### 마이그레이션 계획 형식

```markdown
## 마이그레이션 계획: [변경 내용]

### 1단계: 새 컬럼 추가 (nullable)
- 기존 데이터 영향 없음
- 앱 배포 불필요

### 2단계: 데이터 마이그레이션
- 기존 데이터 변환 스크립트 실행
- 검증 쿼리로 확인

### 3단계: 앱 코드 배포
- 새 컬럼 사용하는 코드 배포

### 4단계: 컬럼 제약조건 추가
- NOT NULL 제약 추가
- 이전 컬럼 제거 (선택)

### 롤백 계획
- [단계별 롤백 방법]
```

---

## 6. 체크리스트

### 스키마 설계
- [ ] 적절한 정규화 수준인가?
- [ ] PK/FK 관계가 명확한가?
- [ ] 필수 필드에 NOT NULL 제약이 있는가?
- [ ] UNIQUE 제약이 필요한 곳에 있는가?
- [ ] Soft Delete 필드(removedAt)가 있는가?

### 인덱스 설계
- [ ] FK 필드에 인덱스가 있는가?
- [ ] 자주 사용되는 조회 조건에 인덱스가 있는가?
- [ ] 복합 인덱스 컬럼 순서가 적절한가?
- [ ] 불필요한 인덱스는 없는가?

### 쿼리 최적화
- [ ] N+1 쿼리 문제가 없는가?
- [ ] 필요한 필드만 select하는가?
- [ ] 페이지네이션이 적용되어 있는가?
- [ ] 트랜잭션 범위가 최소화되어 있는가?

### 마이그레이션
- [ ] 무중단 배포가 가능한가?
- [ ] 롤백 계획이 있는가?
- [ ] 데이터 백업이 필요한가?

---

## 7. 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|----------|------|
| **선행** | technical-designer | Entity/API 설계에서 스키마 방향 결정 |
| **후행** | schema-builder | 설계된 스키마를 Prisma로 구현 |
| | repository-builder | 최적화된 쿼리 구현 |
| **관련** | seed-maker | 테스트 데이터 생성 |
| | 백엔드-architect | 전체 백엔드 아키텍처 협의 |

---

## 8. 프로젝트별 참고사항

### 기술 스택

- **DBMS**: PostgreSQL
- **ORM**: Prisma 7.0
- **캐싱**: Redis

### Prisma 스키마 위치

```
packages/be-prisma/schema/*.prisma
```

### 공통 시스템 필드

모든 모델에 포함되는 필드:
```prisma
model Example {
  id        String    @unique @default(ulid()) @db.VarChar(26)
  seq       Int       @id @default(autoincrement())
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime? @updatedAt @map("updated_at")
  removedAt DateTime? @map("removed_at")
}
```

- `id`는 API, URL, 이벤트와 외부 연동에서 사용하는 공개 ULID입니다.
- `seq`는 DB 내부 PK와 FK join에만 사용하는 자동 증가 숫자입니다.
- 외부 계약에는 `seq`를 노출하지 않습니다.

### 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 테이블명 | PascalCase | `UserProfile` |
| 컬럼명 (Prisma) | camelCase | `createdAt` |
| 컬럼명 (DB) | snake_case | `created_at` (@map 사용) |
| FK 컬럼 | {relation}Seq | `tenantSeq` |

### 멀티테넌시 고려사항

대부분의 테이블에 `tenantId`가 포함되어 있으며, 조회 시 항상 tenant 필터링 필요:
```typescript
const items = await prisma.item.findMany({
  where: { tenantId: currentTenantId },
});
```
