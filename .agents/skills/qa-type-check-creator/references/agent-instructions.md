# Detailed Instructions for qa-type-checker

Source agent file: `.codex/agents/qa-type-checker.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 타입 체커

**TypeScript 타입 에러**를 근본 원인까지 추적하여 올바르게 해결하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 타입 에러 발생 시 | ✅ | 근본 원인 추적 및 해결 |
| API 타입 불일치 | ✅ | Orval 생성 타입 vs 백엔드 응답 추적 |
| 타입 강제(as) 제거 | ✅ | 임시 해결책을 근본 해결로 교체 |
| 단순 오타 수정 | ❌ | 직접 수정 |

---

## 2. 핵심 원칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **근본 원인 추적** | 에러 메시지만 보고 수정하지 않고 원인 파악 |
| **전체 흐름 확인** | 백엔드 → DTO → Swagger → Orval → 프론트엔드 |
| **타입 정의 확인** | 생성된 타입과 원본 DTO 비교 |
| **올바른 접근 경로** | 실제 타입 구조에 맞게 접근 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| `as` 타입 강제 | 런타임 에러 위험, 근본 해결 아님 |
| `any` 사용 | 타입 안전성 상실 |
| `@ts-ignore` | 에러 숨기기, 근본 해결 아님 |
| 타입 정의 임의 수정 | Orval 재생성 시 덮어씌워짐 |

---

## 3. 프로세스

### 3.1 타입 에러 분석 흐름

```
1. 에러 메시지 확인
   ↓
2. 문제 코드 위치 확인
   ↓
3. 관련 타입 정의 추적
   ├── Orval 생성 타입 (packages/fe-api/src/model/)
   ├── 백엔드 DTO (packages/be-dto/src/)
   └── 백엔드 컨트롤러 (apps/core/api/src/module/)
   ↓
4. 근본 원인 파악
   ├── 프론트엔드 사용 방식 오류?
   ├── 백엔드 DTO 누락?
   ├── Swagger 설정 문제?
   └── 응답 래퍼 구조 불일치?
   ↓
5. 올바른 해결책 적용
```

### 3.2 API 타입 불일치 추적 (Orval 프로젝트)

이 프로젝트는 Orval로 API 타입을 자동 생성합니다.

**추적 경로:**
```
프론트엔드 코드
  ↓ import
packages/fe-api/src/apis.ts (Orval 생성 훅)
  ↓ 반환 타입
packages/fe-api/src/model/*.ts (Orval 생성 타입)
  ↓ 원본
packages/be-dto/src/**/*.dto.ts (백엔드 DTO)
  ↓ 사용
apps/core/api/src/module/**/**.controller.ts (백엔드 컨트롤러)
```

### 3.3 응답 래퍼 구조 이해

이 프로젝트의 API 응답은 다음과 같이 래핑됩니다:

```typescript
// 실제 API 응답 구조
{
  httpStatus: 200,
  message: "성공",
  data: {              // ← 실제 데이터는 여기
    data: [...],       // ← 리스트
    meta: {...},       // ← 페이지네이션 메타
    stats: {...}       // ← 통계 (있는 경우)
  }
}
```

**올바른 접근 방식:**
```typescript
// ✅ 올바른 접근
const users = usersResponse?.data?.data ?? [];
const totalCount = usersResponse?.data?.meta?.total ?? 0;

// ❌ 잘못된 접근 (래퍼 구조 무시)
const users = usersResponse?.data ?? [];
const totalCount = usersResponse?.meta?.total ?? 0;
```

---

## 4. 예시: API 타입 에러 해결

### 에러 메시지
```
error TS2339: Property 'meta' does not exist on type 'GetUsers200AllOf'.
```

### 분석 과정

**1단계: Orval 생성 타입 확인**
```bash
# packages/fe-api/src/model/에서 관련 타입 찾기
grep -r "GetUsers200" packages/fe-api/src/model/
```

```typescript
// packages/fe-api/src/model/getUsers200AllOf.ts
export type GetUsers200AllOf = {
  httpStatus?: number;
  message?: string;
  data?: UserListResponseDto;  // ← meta는 여기 안에 있음
};
```

**2단계: 중첩된 타입 확인**
```typescript
// packages/fe-api/src/model/userListResponseDto.ts
export interface UserListResponseDto {
  data: UserDto[];
  meta: UserPaginationMetaDto;  // ← meta는 여기!
  stats: UserStatsDto;
}
```

**3단계: 구조 다이어그램 작성**
```
GetUsers200AllOf
├── httpStatus
├── message
└── data: UserListResponseDto
    ├── data: UserDto[]
    ├── meta: UserPaginationMetaDto  ← 여기
    └── stats: UserStatsDto
```

**4단계: 올바른 코드로 수정**
```typescript
// Before (잘못됨)
const totalCount = usersResponse?.meta?.total ?? 0;

// After (올바름)
const totalCount = usersResponse?.data?.meta?.total ?? 0;
```

---

## 5. 체크리스트

### 타입 에러 해결 시

- [ ] `as` 타입 강제 사용하지 않음
- [ ] `any` 사용하지 않음
- [ ] `@ts-ignore` 사용하지 않음
- [ ] 근본 원인 파악 완료
- [ ] Orval 생성 타입 구조 확인
- [ ] 백엔드 DTO와 일치 여부 확인
- [ ] 응답 래퍼 구조 고려

### API 타입 불일치 해결 시

- [ ] `packages/fe-api/src/model/` 타입 확인
- [ ] `packages/be-dto/src/` DTO 확인
- [ ] 백엔드 컨트롤러 응답 확인
- [ ] 래퍼 구조 (`data.data`, `data.meta`) 고려
- [ ] 올바른 접근 경로로 수정

---

## 6. 연관 에이전트

| 에이전트 | 관계 |
|----------|------|
| be-dto-builder | DTO 정의 생성/수정 |
| be-controller-builder | 컨트롤러 응답 구조 |
| fe-route-agent | 프론트엔드 API 사용 |

---

## 7. 프로젝트별 참고사항

### Orval 타입 재생성

```bash
pnpm --filter=@cocrepo/api codegen
```

### 타입 체크 실행

```bash
# 특정 패키지
pnpm tsc --noEmit -p apps/admin/tsconfig.json
pnpm tsc --noEmit -p packages/fe-ui/tsconfig.json

# 전체 (turbo 사용 시)
pnpm typecheck
```

### 흔한 타입 에러 패턴

| 에러 | 원인 | 해결 |
|------|------|------|
| `Property 'X' does not exist` | 래퍼 구조 미고려 | `response.data.X`로 접근 |
| `Type 'X' is not assignable to 'Y'` | DTO 필드 누락/변경 | 백엔드 DTO 확인 |
| `Object is possibly 'undefined'` | Optional 처리 누락 | `?.` 연산자 사용 |

### 응답 래퍼 구조 (중요)

```typescript
// 단일 객체 응답
response.data  // 실제 데이터

// 리스트 응답 (페이지네이션)
response.data.data   // 리스트
response.data.meta   // 페이지네이션 메타
response.data.stats  // 통계 (옵션)
```
