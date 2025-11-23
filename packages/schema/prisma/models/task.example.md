# Task Schema 예제

## 개요

이 문서는 task.prisma 스키마의 각 모델과 그들의 관계를 실제 예제를 통해 설명합니다.

## 데이터 구조 예제

### 시나리오: 필라테스 센터의 주간 프로그램

```
Timeline "2025년 10월 첫째 주" [논리적 그룹]
├── Session (월요일 오전 10시 클래스) [실제 일정: 2025-10-06 10:00~11:00]
│   ├── Program (초급 필라테스 - 김강사) [여러 개 가능]
│   │   └── Routine (코어 강화 루틴)
│   │       ├── Activity #1 (순서: 1, 세트: 3, 휴식: 60초)
│   │       │   └── Task (플랭크)
│   │       │       └── Exercise (플랭크 30초)
│   │       ├── Activity #2 (순서: 2, 세트: 3, 휴식: 45초)
│   │       │   └── Task (크런치)
│   │       │       └── Exercise (크런치 15회)
│   │       └── Activity #3 (순서: 3, 세트: 3, 휴식: 0초)
│   │           └── Task (레그레이즈)
│   │               └── Exercise (레그레이즈 12회)
│   │
│   └── Program (중급 필라테스 - 이강사) [같은 세션, 다른 프로그램]
│       └── Routine (상체 강화 루틴)
│           └── ... (다른 운동들)
│
└── Session (수요일 오후 2시 클래스) [실제 일정: 2025-10-08 14:00~15:00]
    └── Program (중급반 코어 강화 - 이강사) [같은 루틴 재사용]
        └── Routine (코어 강화 루틴) [재사용됨!]
            └── ... (동일한 Activity들)

Timeline "가을 특별 이벤트" [다른 논리적 그룹]
└── Session (무료 체험 클래스) [실제 일정: 2025-10-15 10:00~11:00]
    └── ...
```

**관계 설명 및 예제:**

- `Timeline` 1 : N `Session`
  - → Timeline #1이 3개 Session 포함
- `Session` 1 : N `Program`
  - → Session #3이 2개 Program 포함 (Program #4, #5)
- `Routine` 1 : N `Program` (재사용)
  - → Routine #1이 3개 Program에서 사용됨 (Program #1, #3, #6)
  - → Routine #2가 2개 Program에서 사용됨 (Program #2, #5)
- `Routine` 1 : N `Activity`
  - → Routine #1이 3개 Activity 포함 (Activity #1, #2, #3)
- `Task` 1 : N `Activity` (재사용 - 도메인 독립적)
  - → Task #1 "플랭크"가 4개 Activity에서 사용됨 (Activity #1, #5, #6, #10)
  - → 각 Activity마다 다른 반복/휴식 시간 설정 가능
- `Task` 1 : 1 `Exercise`
  - → Task #1은 Exercise #1과 1:1 관계 (Task는 추상, Exercise가 운동 도메인 확장)

## 상세 예제 데이터

### 1. Timeline (타임라인)

```typescript
const timelines = [
  {
    id: "timeline-001",
    seq: 1,
    tenantId: "tenant-pilates-center",
    name: "2025년 10월 첫째 주",
    description: "가을 정규 시즌 첫째 주 일정",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "timeline-002",
    seq: 2,
    tenantId: "tenant-pilates-center",
    name: "가을 특별 이벤트",
    description: "신규 회원 유치를 위한 무료 체험 클래스",
    createdAt: "2025-10-01T00:00:00Z",
  },
];
```

**설명**: 타임라인은 세션들을 논리적으로 그룹화합니다. 기간 정보는 포함하지 않으며, 실제 일정은 각 Session이 관리합니다.

---

### 2. Session (세션)

#### 예제 2-1: 일회성 세션

```typescript
const oneTimeSession = {
  id: "session-001",
  seq: 1,
  type: "ONE_TIME", // 일회성
  startDateTime: "2025-10-06T10:00:00Z", // Session이 실제 시간 관리
  endDateTime: "2025-10-06T11:00:00Z",
  timelineId: "timeline-001",
  name: "월요일 오전 초급 필라테스",
  description: "초급반을 위한 기초 필라테스 세션",
  createdAt: "2025-10-01T00:00:00Z",
};
```

#### 예제 2-2: 반복 세션

```typescript
const recurringSession = {
  id: "session-002",
  seq: 2,
  type: "RECURRING", // 반복형
  repeatCycleType: "WEEKLY", // 주간 반복
  recurringDayOfWeek: "WEDNESDAY", // 매주 수요일
  startDateTime: "2025-10-08T14:00:00Z",
  endDateTime: "2025-10-08T15:00:00Z",
  timelineId: "timeline-001",
  name: "수요일 오후 중급 필라테스",
  description: "중급반을 위한 심화 필라테스 세션",
  createdAt: "2025-10-01T00:00:00Z",
};
```

---

### 3. Program (프로그램)

```typescript
const programs = [
  {
    id: "program-001",
    seq: 1,
    routineId: "routine-001",
    sessionId: "session-001",
    instructorId: "instructor-kim",
    capacity: 10, // 최대 10명
    name: "월요일 초급반 코어 강화",
    level: "초급",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "program-002",
    seq: 2,
    routineId: "routine-001", // 같은 루틴 재사용
    sessionId: "session-002",
    instructorId: "instructor-lee",
    capacity: 8,
    name: "수요일 중급반 코어 강화",
    level: "중급",
    createdAt: "2025-10-01T00:00:00Z",
  },
];
```

**설명**: 같은 "코어 강화 루틴"을 다른 세션에서 재사용하는 예제입니다. 각 프로그램은 다른 강사와 난이도를 가질 수 있습니다.

---

### 4. Routine (루틴)

```typescript
const routine = {
  id: "routine-001",
  seq: 1,
  name: "코어 강화 루틴",
  label: "Core Strength",
  createdAt: "2025-10-01T00:00:00Z",
};
```

**설명**: 복부와 코어 근육을 강화하는 운동들의 묶음입니다.

---

### 5. Activity (활동)

```typescript
const activities = [
  {
    id: "activity-001",
    seq: 1,
    routineId: "routine-001",
    taskId: "task-plank",
    order: 1, // 첫 번째 운동
    repetitions: 3, // 3세트
    restTime: 60, // 다음 운동까지 60초 휴식
    notes: "자세가 흐트러지지 않도록 주의",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "activity-002",
    seq: 2,
    routineId: "routine-001",
    taskId: "task-crunch",
    order: 2, // 두 번째 운동
    repetitions: 3,
    restTime: 45, // 45초 휴식
    notes: "목에 힘을 주지 말고 복근에 집중",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "activity-003",
    seq: 3,
    routineId: "routine-001",
    taskId: "task-leg-raise",
    order: 3, // 세 번째 운동
    repetitions: 3,
    restTime: 0, // 마지막 운동이므로 휴식 없음
    notes: "허리가 바닥에서 떨어지지 않도록 주의",
    createdAt: "2025-10-01T00:00:00Z",
  },
];
```

**설명**: Activity는 도메인 독립적으로 Task를 참조합니다. Routine 내에서 특정 Task를 어떻게 수행할지(순서, 세트 수, 휴식 시간)를 정의합니다. Task를 통해 Exercise 등 도메인별 모델에 접근합니다.

---

### 6. Task (태스크)

```typescript
const tasks = [
  {
    id: "task-plank",
    seq: 1,
    tenantId: "tenant-pilates-center",
    createdAt: "2025-10-01T00:00:00Z",
    // Task는 도메인 독립적 추상 계층
    // 구체적인 정보는 Exercise에 있음
  },
  {
    id: "task-crunch",
    seq: 2,
    tenantId: "tenant-pilates-center",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "task-leg-raise",
    seq: 3,
    tenantId: "tenant-pilates-center",
    createdAt: "2025-10-01T00:00:00Z",
  },
];
```

**설명**: Task는 도메인 독립적인 추상 계층입니다. 분류 및 그룹핑 역할만 하며, 실제 운동 정보는 Exercise가 담당합니다. 하나의 Task는 여러 Activity(루틴)에서 재사용될 수 있습니다.

---

### 7. Exercise (운동)

```typescript
const exercises = [
  {
    id: "exercise-001",
    seq: 1,
    taskId: "task-plank",
    name: "플랭크",
    description:
      "엎드려서 팔꿈치와 발끝으로 몸을 지탱하며 코어를 긴장시킵니다.",
    duration: 30, // 30초
    count: 3, // 3세트
    imageFileId: "file-plank-img",
    videoFileId: "file-plank-video",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "exercise-002",
    seq: 2,
    taskId: "task-crunch",
    name: "크런치",
    description: "누워서 무릎을 구부리고 상체를 들어올려 복근을 수축시킵니다.",
    duration: 0, // 횟수 기반이므로 시간 없음
    count: 15, // 15회 x 3세트
    imageFileId: "file-crunch-img",
    videoFileId: "file-crunch-video",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "exercise-003",
    seq: 3,
    taskId: "task-leg-raise",
    name: "레그레이즈",
    description: "누워서 다리를 곧게 펴고 들어올려 하복부를 자극합니다.",
    duration: 0,
    count: 12, // 12회 x 3세트
    imageFileId: "file-leg-raise-img",
    videoFileId: "file-leg-raise-video",
    createdAt: "2025-10-01T00:00:00Z",
  },
];
```

---

## 관계 시각화 (복수 관계 강조)

```
[Timeline #1] "2025년 10월 첫째 주" (논리적 그룹핑)
│
├─── [Session #1] 월요일 오전 10:00-11:00 (ONE_TIME)
│    │
│    ├── [Program #1] 초급반 코어 강화 (김강사, 정원 10명)
│    │    └── [Routine #1] "코어 기초 루틴"
│    │         ├─ [Activity #1] order:1, 반복:3, 휴식:60초
│    │         │    └── [Task #1] "플랭크" (id: task-plank)
│    │         │         └── [Exercise #1] 플랭크 30초 x 3세트
│    │         │
│    │         ├─ [Activity #2] order:2, 반복:3, 휴식:45초
│    │         │    └── [Task #2] "크런치" (id: task-crunch)
│    │         │         └── [Exercise #2] 크런치 15회 x 3세트
│    │         │
│    │         └─ [Activity #3] order:3, 반복:3, 휴식:0초
│    │              └── [Task #3] "레그레이즈" (id: task-leg-raise)
│    │                   └── [Exercise #3] 레그레이즈 12회 x 3세트
│    │
│    └── [Program #2] 중급반 상체 집중 (이강사, 정원 8명)
│         └── [Routine #2] "상체 강화 루틴"
│              ├─ [Activity #4] order:1, 반복:4, 휴식:90초
│              │    └── [Task #4] "푸쉬업" (id: task-pushup)
│              │         └── [Exercise #4] 푸쉬업 20회 x 4세트
│              │
│              └─ [Activity #5] order:2, 반복:4, 휴식:0초
│                   └── [Task #1] "플랭크" ◀── 재사용!
│                        └── [Exercise #1] (동일)
│
├─── [Session #2] 수요일 오후 14:00-15:00 (RECURRING, WEEKLY, WEDNESDAY)
│    │
│    └── [Program #3] 중급반 코어 심화 (박강사, 정원 12명)
│         └── [Routine #1] "코어 기초 루틴" ◀── Routine 재사용!
│              ├─ [Activity #6] order:1, 반복:4, 휴식:45초 (다른 설정)
│              │    └── [Task #1] "플랭크" ◀── Task 재사용!
│              │         └── [Exercise #1] (동일)
│              │
│              ├─ [Activity #7] order:2, 반복:4, 휴식:30초
│              │    └── [Task #2] "크런치" ◀── Task 재사용!
│              │         └── [Exercise #2] (동일)
│              │
│              └─ [Activity #8] order:3, 반복:4, 휴식:0초
│                   └── [Task #3] "레그레이즈" ◀── Task 재사용!
│                        └── [Exercise #3] (동일)
│
└─── [Session #3] 금요일 저녁 18:00-19:00 (ONE_TIME)
     │
     ├── [Program #4] 야간 초급반 (김강사, 정원 15명)
     │    └── [Routine #3] "전신 기초 루틴"
     │         ├─ [Activity #9] order:1, 반복:3, 휴식:90초
     │         │    └── [Task #5] "스쿼트" (id: task-squat)
     │         │         └── [Exercise #5] 스쿼트 15회 x 3세트
     │         │
     │         ├─ [Activity #10] order:2, 반복:3, 휴식:60초
     │         │    └── [Task #1] "플랭크" ◀── Task 재사용! (3번째)
     │         │         └── [Exercise #1] (동일)
     │         │
     │         └─ [Activity #11] order:3, 반복:3, 휴식:0초
     │              └── [Task #4] "푸쉬업" ◀── Task 재사용!
     │                   └── [Exercise #4] (동일)
     │
     └── [Program #5] 야간 중급반 (박강사, 정원 12명)
          └── [Routine #2] "상체 강화 루틴" ◀── Routine 재사용!
               (동일한 Activity #4, #5)

[Timeline #2] "가을 특별 이벤트" (다른 논리적 그룹)
│
└─── [Session #4] 무료 체험 클래스 2025-10-15 10:00-11:00 (ONE_TIME)
     └── [Program #6] 체험 클래스 (이강사, 정원 20명)
          └── [Routine #1] "코어 기초 루틴" ◀── Routine 재사용! (다른 Timeline)
               (동일한 Activity #1, #2, #3)
```

**핵심 포인트:**

- **Task 재사용**: "플랭크" Task가 4번 다른 Routine/Activity에서 사용됨 (Activity #1, #5, #6, #10)
- **Routine 재사용**: "코어 기초 루틴"이 3개 다른 Program에서 사용됨 (Program #1, #3, #6)
- **다른 설정**: 같은 Task/Routine도 Activity에서 다른 반복/휴식 시간 설정 가능
- **Session 유형**: ONE_TIME(일회성), RECURRING(반복) 다양한 유형
- **도메인 독립성**: Activity는 Task만 참조, Exercise는 Task 확장
- **Timeline**: 논리적 그룹핑만 담당, 기간 정보 없음
- **Session**: 실제 시간 정보 (startDateTime, endDateTime) 관리
- **N:M 관계**: `Routine`과 `Task`는 `Activity`를 통해 다대다 관계

---

## 실전 사용 시나리오

### 시나리오 1: 새로운 수업 추가하기

1. **Timeline** 생성 또는 기존 타임라인 선택 (예: "2025년 10월")
2. **Session** 생성 (일회성 or 반복, 시간 정보 포함)
3. **Routine** 생성 또는 기존 루틴 선택
4. **Program** 생성하여 Session과 Routine 연결
5. 강사 배정 및 정원 설정

### 시나리오 2: 새로운 루틴 만들기

1. **Routine** 생성
2. 필요한 **Task**들 생성 (도메인 독립적 추상 계층)
3. 각 Task에 **Exercise** 세부 정보 입력 (운동 도메인 확장)
4. **Activity**로 Routine과 Task 연결 (순서, 세트, 휴식시간 설정)

### 시나리오 3: 기존 루틴 재사용

1. 기존 **Routine** 선택
2. 새로운 **Session** 생성 (다른 Timeline에 속할 수 있음)
3. **Program**으로 기존 Routine과 새 Session 연결
4. 강사와 정원만 변경

### 시나리오 4: Timeline으로 그룹 관리

1. **Timeline** "정규 시즌" 생성
2. 여러 **Session**을 이 Timeline에 추가
3. 나중에 **Timeline** "특별 이벤트" 생성
4. 이벤트성 **Session**을 새 Timeline에 추가
5. UI에서 Timeline별로 필터링하여 조회

---

## 데이터 일관성 규칙

### 1. 고유성 제약

- Activity: 같은 Routine에 같은 Task는 한 번만 포함 가능 (`@@unique([routineId, taskId])`)
- Program: 같은 Session에서 같은 Routine은 한 번만 실행 가능 (`@@unique([sessionId, routineId])`)
- Exercise: 하나의 Task는 하나의 Exercise만 가능 (`@unique`)

### 2. 관계 제약

- Session은 반드시 Timeline에 속해야 함
- Program은 반드시 Routine과 Session을 가져야 함
- Activity는 반드시 Routine과 Task를 연결해야 함
- Exercise는 반드시 Task에 속해야 함

### 3. 비즈니스 규칙

- **Timeline**: 논리적 그룹핑만 담당, 기간 검증 불필요
- **Session**: startDateTime과 endDateTime은 필수
- Program의 capacity는 양수여야 함
- Exercise의 duration과 count 중 최소 하나는 0보다 커야 함
- Activity의 order는 같은 Routine 내에서 고유해야 함

---

## 개선 완료 사항 ✅

### 최근 스키마 개선

1. ✅ **Timeline 단순화**: 기간 정보 제거, 논리적 그룹핑 역할로 명확화
2. ✅ **Program 재사용성 향상**: `routineId`와 `sessionId`의 `@unique` 제거로 같은 루틴을 여러 세션에서 사용 가능
3. ✅ **Program 메타정보 추가**: `name`, `level` 필드 추가로 프로그램 구분 명확화
4. ✅ **Session 필드 정리**: `label` 제거하고 `name`으로 통합, `description` 추가
5. ✅ **Activity 강화**: `order`, `repetitions`, `restTime`, `notes` 필드 추가로 실행 정보 관리
6. ✅ **Activity 인덱싱**: `@@index([routineId, order])`로 순서 조회 최적화
7. ✅ **성능 최적화**: 모든 주요 조회 패턴에 인덱스 추가
8. ✅ **도메인 분리 명확화**: Task(추상), Exercise(운동 도메인) 계층 구조 정리
9. ✅ **멀티 도메인 대비**: Task를 통한 확장 가능한 아키텍처 구축

---

## 향후 확장 가능성

### 추가 고려사항

1. **Task 다형성 확장**: Exercise(운동) 외에 Treatment(헤어샵), Service(일반 서비스) 등 다양한 도메인 모델 추가
   ```prisma
   model Task {
     exercise  Exercise?   // 운동 도메인
     treatment Treatment? // 헤어샵 도메인 (미래)
     service   Service?   // 기타 서비스 (미래)
   }
   ```
2. **Program 참가자**: Enrollment 모델로 수강생 관리
3. **Routine 버전 관리**: 루틴 히스토리 추적
4. **TenantId 일관성**: Session, Program, Routine 등에도 tenantId 추가로 멀티테넌시 강화
5. **Session 예약**: Reservation 모델로 사용자 예약 관리
6. **Timeline 메타데이터**: 색상, 아이콘 등 UI 표현을 위한 필드 추가

### 도메인 독립성 유지 전략

- **Activity**: 도메인 독립적으로 유지 (Task만 참조)
- **Task**: 추상 계층으로 여러 도메인 모델의 브릿지 역할
- **Exercise/Treatment/Service**: 각 도메인별 전용 모델로 Task 확장
- 새로운 비즈니스 도메인 추가 시 Activity 코드 수정 불필요
