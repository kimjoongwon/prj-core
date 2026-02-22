# ProgramStore 기획서

> 생성일: 2026-02-19
> 타입: store
> 위치: packages/fe-store/src/stores/programStore.ts

## 역할

프로그램(Program) 관련 페이지의 클라이언트 상태를 관리하는 MobX Store입니다. Program은 Session 상세 페이지 내에 임베딩되어 관리되므로, 이 Store는 세션 상세 페이지의 "프로그램 목록" 섹션 상태와 Program 폼 상태를 담당합니다. 실제 데이터 fetching은 Orval 생성 React Query 훅이 담당합니다.

## 도메인 컨텍스트

```
Timeline → Session → Program (실제 클래스)
                       ├── routineId (루틴 연결)
                       ├── instructorId (강사 연결)
                       └── capacity, level, name
```

Program은 독립 목록 페이지 없이 Session 상세 페이지(`/timelines/[timelineId]/sessions/[sessionId]`) 내에서 관리됩니다.

## 상태 (Observable)

### 프로그램 목록 상태 (세션 상세 내 프로그램 섹션)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| programPage | `number` | `1` | 프로그램 목록 현재 페이지 |
| programTake | `number` | `10` | 프로그램 목록 페이지당 항목 수 |

### 프로그램 폼 상태

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| formRoutineId | `string` | `""` | 선택된 루틴 ID |
| formInstructorId | `string` | `""` | 선택된 강사 User ID |
| formName | `string` | `""` | 프로그램 이름 |
| formCapacity | `number` | `0` | 프로그램 정원 |
| formLevel | `string \| null` | `null` | 난이도 (초급/중급/고급/null) |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| programSkip | `number` | `(programPage - 1) * programTake` - 프로그램 목록 offset |
| programListParams | `object` | `{ take: programTake, skip: programSkip }` - useGetPrograms 훅에 전달 |
| isFormValid | `boolean` | `formName.length > 0 && !!formRoutineId && !!formInstructorId && formCapacity >= 1` |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setProgramPage` | `page: number` | 프로그램 목록 페이지 변경 |
| `setFormRoutineId` | `routineId: string` | 루틴 선택 |
| `setFormInstructorId` | `instructorId: string` | 강사 선택 |
| `setFormName` | `name: string` | 프로그램 이름 입력 |
| `setFormCapacity` | `capacity: number` | 정원 설정 |
| `setFormLevel` | `level: string \| null` | 난이도 설정 |
| `resetForm` | 없음 | 폼 상태 초기화 (등록/수정 완료 후) |
| `reset` | 없음 | 모든 상태 초기화 |

## 비동기 액션 (Flow)

없음 (데이터 fetching은 Orval 생성 React Query 훅 사용)

## 의존 Store

없음 (독립적)

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| `programStore` | `ProgramStore` |

## 사용되는 페이지

| 페이지 | 사용 상태 |
|--------|-----------|
| `/timelines/[timelineId]/sessions/[sessionId]` | programPage, programTake, programSkip, programListParams |
| `/timelines/[timelineId]/sessions/[sessionId]/programs/new` | formRoutineId, formInstructorId, formName, formCapacity, formLevel, isFormValid |
| `/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit` | 동일 (기존 값으로 초기화) |

## 구현 체크리스트

- [ ] programStore.ts
- [ ] RootStore에 `programStore` 속성 추가
- [ ] 폼 초기화 로직 (등록/수정 완료 시 `resetForm` 호출)
- [ ] 페이지 이탈 시 `reset` 호출

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-logic-planner |
