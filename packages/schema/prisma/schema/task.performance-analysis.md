# Task Schema 성능 분석

> **최종 업데이트**: Timeline 구조 변경 및 성능 인덱스 적용 완료

## 1. 현재 인덱스 상태 (✅ 최적화 완료)

### ✅ 적용된 인덱스

| 모델 | 인덱스 타입 | 필드 | 용도 |
|------|------------|------|------|
| **Timeline** | PRIMARY KEY | id | 고유 식별자 조회 |
| Timeline | UNIQUE | seq | 순번 조회 |
| Timeline | INDEX | [tenantId] | ✅ 테넌트별 조회 |
| Timeline | INDEX | [tenantId, createdAt] | ✅ 테넌트별 생성순 조회 |
| Timeline | INDEX | [name] | ✅ 이름 검색 |
| **Session** | PRIMARY KEY | id | 고유 식별자 조회 |
| Session | UNIQUE | seq | 순번 조회 |
| Session | FOREIGN KEY | timelineId | Timeline 관계 조회 |
| Session | INDEX | [timelineId, startDateTime] | ✅ 타임라인별 시간순 조회 |
| Session | INDEX | [startDateTime, endDateTime] | ✅ 기간 범위 조회 |
| Session | INDEX | [type, startDateTime] | ✅ 세션 타입별 조회 |
| **Program** | PRIMARY KEY | id | 고유 식별자 조회 |
| Program | UNIQUE | seq | 순번 조회 |
| Program | UNIQUE | [sessionId, routineId] | 세션-루틴 조합 중복 방지 |
| Program | INDEX | [sessionId] | ✅ 세션별 프로그램 조회 |
| Program | INDEX | [routineId] | ✅ 루틴별 프로그램 조회 |
| Program | INDEX | [instructorId] | ✅ 강사별 스케줄 조회 |
| **Routine** | PRIMARY KEY | id | 고유 식별자 조회 |
| Routine | UNIQUE | seq | 순번 조회 |
| Routine | INDEX | [name] | ✅ 루틴 이름 검색 |
| **Activity** | PRIMARY KEY | id | 고유 식별자 조회 |
| Activity | UNIQUE | seq | 순번 조회 |
| Activity | UNIQUE | [routineId, taskId] | 루틴-태스크 조합 중복 방지 |
| Activity | INDEX | [routineId, order] | ✅ **순서 조회 최적화** |
| **Task** | PRIMARY KEY | id | 고유 식별자 조회 |
| Task | UNIQUE | seq | 순번 조회 |
| Task | INDEX | [tenantId] | ✅ 테넌트별 태스크 조회 |
| **Exercise** | PRIMARY KEY | id | 고유 식별자 조회 |
| Exercise | UNIQUE | seq | 순번 조회 |
| Exercise | UNIQUE | taskId | Task 관계 (1:1) |
| Exercise | INDEX | [name] | ✅ 운동 이름 검색 |

---

## 2. 성능 이슈 분석

### 🔴 심각 (Severity: High)

#### 2.1 Timeline 조회 시 tenantId 인덱스 부재
**문제점:**
```sql
-- 멀티테넌트 환경에서 가장 빈번한 쿼리
SELECT * FROM Timeline WHERE tenantId = 'tenant-001';
-- ❌ FULL TABLE SCAN 발생
```

**영향:**
- 테넌트별 타임라인 조회 시 전체 테이블 스캔
- 테넌트 수가 증가할수록 성능 급격히 저하

**해결책:**
```prisma
model Timeline {
  // ... 기존 필드
  tenantId String /// 테넌트 ID

  @@index([tenantId])
  @@index([tenantId, startDateTime]) // 기간별 조회 최적화
}
```

---

#### 2.2 Session 시간 범위 조회 인덱스 부재
**문제점:**
```sql
-- 특정 기간의 세션 조회 (매우 빈번)
SELECT * FROM Session
WHERE startDateTime >= '2025-10-01'
  AND endDateTime <= '2025-10-31';
-- ❌ FULL TABLE SCAN 발생
```

**영향:**
- 달력 UI, 스케줄 조회 시 성능 저하
- 날짜 범위가 넓을수록 더 느려짐

**해결책:**
```prisma
model Session {
  // ... 기존 필드

  @@index([startDateTime, endDateTime])
  @@index([timelineId, startDateTime]) // Timeline별 시간순 조회
  @@index([type, startDateTime]) // 세션 타입별 조회
}
```

---

#### 2.3 Program 조회 시 복합 인덱스 부족
**문제점:**
```sql
-- 강사별 프로그램 조회 (빈번)
SELECT * FROM Program WHERE instructorId = 'instructor-kim';
-- ❌ FULL TABLE SCAN 발생

-- 세션의 모든 프로그램 조회 (매우 빈번)
SELECT * FROM Program WHERE sessionId = 'session-001';
-- ⚠️ sessionId FK 인덱스만 사용 (routineId는 미사용)
```

**영향:**
- 강사 스케줄 조회 느림
- 세션별 프로그램 목록 조회 비효율

**해결책:**
```prisma
model Program {
  // ... 기존 필드

  @@index([instructorId])
  @@index([sessionId]) // FK이지만 명시적 인덱스 추가 권장
  @@index([routineId])
}
```

---

#### 2.4 Task의 tenantId 인덱스 부재
**문제점:**
```sql
-- 테넌트별 태스크 목록 조회
SELECT * FROM Task WHERE tenantId = 'tenant-001';
-- ❌ FULL TABLE SCAN 발생
```

**영향:**
- 태스크 라이브러리 조회 시 성능 저하
- 멀티테넌시 보안 취약

**해결책:**
```prisma
model Task {
  // ... 기존 필드

  @@index([tenantId])
}
```

---

### 🟡 보통 (Severity: Medium)

#### 2.5 Routine 이름 검색 인덱스 부재
**문제점:**
```sql
-- 루틴 이름 검색 (검색 기능 사용 시)
SELECT * FROM Routine WHERE name LIKE '%코어%';
-- ❌ FULL TABLE SCAN 발생
```

**영향:**
- 루틴 검색 기능 느림
- 전체 텍스트 검색 필요 시 추가 최적화 필요

**해결책:**
```prisma
model Routine {
  // ... 기존 필드

  @@index([name])
  // 또는 Full-Text Search
  @@fulltext([name, label])
}
```

---

#### 2.6 Exercise 이름 검색 인덱스 부재
**문제점:**
```sql
-- 운동 이름으로 검색
SELECT * FROM Exercise WHERE name LIKE '플랭크%';
-- ❌ FULL TABLE SCAN 발생
```

**해결책:**
```prisma
model Exercise {
  // ... 기존 필드

  @@index([name])
}
```

---

## 3. N+1 쿼리 문제 분석

### 🔴 심각한 N+1 문제

#### 3.1 Timeline → Sessions → Programs → Routine 조회
**시나리오:** 타임라인의 모든 프로그램 정보 조회

```typescript
// ❌ 나쁜 예 (N+1 문제 발생)
const timeline = await prisma.timeline.findUnique({
  where: { id: 'timeline-001' },
  include: {
    sessions: true, // 1번 쿼리
  },
});

for (const session of timeline.sessions) {
  const programs = await prisma.program.findMany({
    where: { sessionId: session.id }, // N번 쿼리
  });

  for (const program of programs) {
    const routine = await prisma.routine.findUnique({
      where: { id: program.routineId }, // N*M번 쿼리
    });
  }
}
// 총 쿼리: 1 + N + N*M 번
```

**해결책:**
```typescript
// ✅ 좋은 예 (단일 쿼리)
const timeline = await prisma.timeline.findUnique({
  where: { id: 'timeline-001' },
  include: {
    sessions: {
      include: {
        programs: {
          include: {
            routine: {
              include: {
                activities: {
                  include: {
                    task: {
                      include: {
                        exercise: true,
                      },
                    },
                  },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    },
  },
});
// 총 쿼리: 1번 (JOIN 사용)
```

---

#### 3.2 Routine → Activities 순서대로 조회
**시나리오:** 루틴의 모든 활동을 순서대로 조회

```typescript
// ❌ 나쁜 예
const routine = await prisma.routine.findUnique({
  where: { id: 'routine-001' },
});

const activities = await prisma.activity.findMany({
  where: { routineId: routine.id },
  orderBy: { order: 'asc' }, // ✅ 인덱스 사용 가능 (routineId, order)
});

for (const activity of activities) {
  const task = await prisma.task.findUnique({
    where: { id: activity.taskId }, // N번 쿼리
  });
  const exercise = await prisma.exercise.findUnique({
    where: { taskId: task.id }, // N번 쿼리
  });
}
```

**해결책:**
```typescript
// ✅ 좋은 예
const routine = await prisma.routine.findUnique({
  where: { id: 'routine-001' },
  include: {
    activities: {
      include: {
        task: {
          include: {
            exercise: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    },
  },
});
```

---

## 4. Soft Delete 성능 문제

### 🟡 removedAt 필터링 오버헤드

**현재 문제:**
모든 쿼리에서 `removedAt IS NULL` 조건 필요

```sql
-- 모든 쿼리마다 추가 조건
SELECT * FROM Timeline
WHERE tenantId = 'tenant-001'
  AND removedAt IS NULL;  -- 매번 체크 필요
```

**해결책:**

#### 옵션 A: removedAt 인덱스 추가 (권장)
```prisma
model Timeline {
  // ... 기존 필드

  @@index([tenantId, removedAt])
  @@index([startDateTime, removedAt])
}
```

#### 옵션 B: Partial Index (PostgreSQL)
```sql
-- 삭제되지 않은 레코드만 인덱싱
CREATE INDEX idx_timeline_tenant_active
ON Timeline(tenantId)
WHERE removedAt IS NULL;
```

---

## 5. 데이터 증가에 따른 성능 저하 예측

### 📊 성능 시나리오 분석

#### 시나리오 1: 소규모 필라테스 센터
- 테넌트: 1개
- Timeline: 주당 1개 (연간 52개)
- Session: Timeline당 10개 (연간 520개)
- Program: Session당 2개 (연간 1,040개)
- **성능:** 대부분 문제없음 (인덱스 없어도 괜찮음)

#### 시나리오 2: 중규모 프랜차이즈 (5개 지점)
- 테넌트: 5개
- Timeline: 연간 260개
- Session: 연간 2,600개
- Program: 연간 5,200개
- **성능:** ⚠️ tenantId, startDateTime 인덱스 **필수**

#### 시나리오 3: 대규모 플랫폼 (100개 지점)
- 테넌트: 100개
- Timeline: 연간 5,200개
- Session: 연간 52,000개
- Program: 연간 104,000개
- **성능:** 🔴 모든 권장 인덱스 **필수**, 파티셔닝 고려

---

## 6. 개선 우선순위

### 🔴 즉시 적용 (High Priority)
```prisma
model Timeline {
  // ... 기존 필드
  @@index([tenantId])
  @@index([tenantId, startDateTime])
}

model Session {
  // ... 기존 필드
  @@index([timelineId, startDateTime])
  @@index([startDateTime, endDateTime])
}

model Program {
  // ... 기존 필드
  @@index([sessionId])
  @@index([routineId])
  @@index([instructorId])
}

model Task {
  // ... 기존 필드
  @@index([tenantId])
}
```

### 🟡 추가 고려 (Medium Priority)
```prisma
model Routine {
  // ... 기존 필드
  @@index([name])
}

model Exercise {
  // ... 기존 필드
  @@index([name])
}
```

### 🟢 최적화 (Low Priority)
```prisma
// Soft Delete 최적화
model Timeline {
  @@index([tenantId, removedAt])
}

model Session {
  @@index([timelineId, removedAt])
}
```

---

## 7. 쿼리 최적화 가이드

### ✅ 권장 패턴

#### 7.1 항상 include 사용 (N+1 방지)
```typescript
// ✅ 좋은 예
const programs = await prisma.program.findMany({
  where: { sessionId: 'session-001' },
  include: {
    routine: {
      include: {
        activities: {
          include: {
            task: {
              include: { exercise: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    },
  },
});
```

#### 7.2 select를 통한 필드 선택
```typescript
// ✅ 필요한 필드만 조회
const sessions = await prisma.session.findMany({
  select: {
    id: true,
    name: true,
    startDateTime: true,
    endDateTime: true,
    programs: {
      select: {
        name: true,
        capacity: true,
        routine: {
          select: {
            name: true,
          },
        },
      },
    },
  },
});
```

#### 7.3 페이지네이션 사용
```typescript
// ✅ 대량 데이터 조회 시
const sessions = await prisma.session.findMany({
  where: { timelineId: 'timeline-001' },
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { startDateTime: 'asc' },
});
```

### ❌ 피해야 할 패턴

#### 7.4 루프 안에서 개별 쿼리
```typescript
// ❌ 나쁜 예
for (const sessionId of sessionIds) {
  const programs = await prisma.program.findMany({
    where: { sessionId },
  });
}

// ✅ 좋은 예
const programs = await prisma.program.findMany({
  where: { sessionId: { in: sessionIds } },
});
```

---

## 8. 모니터링 권장사항

### 추적해야 할 메트릭

1. **쿼리 실행 시간**
   - Timeline 조회: < 100ms
   - Session 조회: < 50ms
   - Program with includes: < 200ms

2. **인덱스 사용률**
   ```sql
   -- PostgreSQL
   SELECT schemaname, tablename, indexname, idx_scan
   FROM pg_stat_user_indexes
   WHERE tablename IN ('Timeline', 'Session', 'Program', 'Activity')
   ORDER BY idx_scan DESC;
   ```

3. **Slow Query 로깅**
   ```typescript
   // Prisma 미들웨어
   prisma.$use(async (params, next) => {
     const before = Date.now();
     const result = await next(params);
     const after = Date.now();

     if (after - before > 100) {
       console.warn(`Slow query (${after - before}ms):`, params);
     }

     return result;
   });
   ```

---

## 9. 결론

### 현재 상태 평가
- ✅ Activity의 `[routineId, order]` 인덱스는 잘 설계됨
- ⚠️ tenantId, startDateTime 등 핵심 필드 인덱스 부재
- 🔴 N+1 쿼리 위험 높음 (ORM 사용 패턴에 주의 필요)

### 즉시 조치 필요
1. **tenantId 인덱스 추가** (Timeline, Task)
2. **시간 범위 조회 인덱스 추가** (Session)
3. **Foreign Key 인덱스 명시** (Program)
4. **N+1 쿼리 방지 가이드라인 수립**

### 장기적 고려사항
- 데이터 파티셔닝 (테넌트별 또는 시간별)
- 읽기 전용 복제본 사용
- 캐싱 전략 (Redis 등)
- 통계성 쿼리는 별도 집계 테이블 사용
