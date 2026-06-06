# 루틴 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/routines/[routineId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                      │
│  루틴 수정                            [취소]  [저장]            │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 기본 정보                                       │
│                                                                  │
│  루틴 이름 *                                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 풀바디 루틴 A                        ← 기존 값으로 채워짐  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  단축 라벨 *                                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ FULL-A                               ← 기존 값으로 채워짐  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 운동 구성                    [+ 운동 추가]      │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ⠿ 1. 스쿼트                                  [삭제 ✕]  │   │
│  │     반복 횟수: [  3  ]  휴식 시간(초): [  60 ]           │   │
│  │     메모: ┌────────────────────────────────────────────┐ │   │
│  │           │ 천천히 내리기         ← 기존 메모 채워짐   │ │   │
│  │           └────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ⠿ 2. 데드리프트                              [삭제 ✕]  │   │
│  │     반복 횟수: [  5  ]  휴식 시간(초): [  90 ]           │   │
│  │     메모: ┌────────────────────────────────────────────┐ │   │
│  │           │                                            │ │   │
│  │           └────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Task/Exercise 선택 모달 - 등록 페이지와 동일]                       │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 루틴 상세에서 "수정" 버튼을 클릭하여 수정 페이지에 진입한다
2. 기존 기본 정보(이름, 라벨)가 채워진 폼을 확인한다
3. 기존 Activity 목록이 순서대로 편집 상태로 표시된다
4. 필드를 수정하고, 운동을 추가/삭제/순서 변경한다
5. "저장" 버튼을 클릭하여 변경사항을 저장한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="루틴 수정", actions에 "취소" / "저장" 버튼 |
| 기본 정보 섹션 | `Section + PageTitleBar("기본 정보")` | name/label 입력 필드 (기존 값 채움) |
| Activity 편집기 | `Section + PageTitleBar("활동 구성")` | Activity 카드 목록 + "운동 추가" 버튼 |

## 폼 필드 정의

### 기본 정보

| 필드 | 컴포넌트 | 유효성 | 설명 |
|------|----------|--------|------|
| name | Input | 필수, 1-100자 | 루틴 이름 (기존 값으로 초기화) |
| label | Input | 필수, 1-50자 | 단축 라벨 (기존 값으로 초기화) |

### Activity 편집기

등록 페이지와 동일한 구조, 기존 Activities가 초기값으로 채워짐:

| 필드 | 컴포넌트 | 유효성 | 설명 |
|------|----------|--------|------|
| taskId | - | 자동 | 선택된 선택된 Task ID |
| exerciseName | 읽기 전용 | - | 선택된 운동명 |
| repetitions | NumberInput | 최소 1 | 반복 횟수, 기존 값으로 초기화 |
| restTime | NumberInput | 최소 0 | 휴식 시간(초), 기존 값으로 초기화 |
| notes | TextArea | 선택, 최대 200자 | 메모, 기존 값으로 초기화 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 로딩 | 기존 데이터 조회 중 | 스켈레톤 UI |
| 편집 중 | 기존 데이터 채워진 폼 | 실시간 유효성 표시 |
| 저장 중 | API 호출 중 | 저장 버튼 비활성화 + 스피너 |
| 저장 성공 | 수정 완료 | 루틴 상세 페이지(`/routines/{routineId}`)로 이동 + 성공 토스트 |
| 저장 실패 | API 오류 | 에러 토스트 표시, 폼 유지 |
| 권한 없음 | 타 Space 소유 루틴 | 에러 표시 후 상세 페이지로 리다이렉트 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetRoutineQuery({ routineId })` | 기존 데이터 로드 |
| 운동 검색 | `useGetTasks({ search, spaceScope: INCLUDE_ANCESTORS })` | Task/Exercise 선택 모달에서 호출 |
| 저장 | `useUpdateRoutine({ routineId })` | name, label, activities 배열 전체 교체 |

### 요청 데이터 구조

```typescript
// PATCH /routines/:id
{
  name?: string;
  label?: string;
  activities?: {              // 전체 교체 방식 (순서 포함)
    taskId: string;
    order: number;
    repetitions: number;
    restTime: number;
    notes?: string;
  }[];
}
```

**Activities 업데이트 전략: 전체 교체(Replace All)**
- 기존 Activities 모두 삭제 후 새 목록으로 재생성
- 부분 업데이트 대신 전체 교체를 통해 순서 관리 단순화

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "운동 추가" 버튼 클릭 | Task/Exercise 선택 모달 오픈 |
| Exercise 선택 | 모달 닫기 + Activity 카드 목록 끝에 추가 |
| Activity 드래그 완료 | order 값 전체 재정렬 |
| Activity 삭제 | 해당 Activity 제거 + 나머지 order 재정렬 |
| "취소" 버튼 클릭 | 변경사항 있을 시 확인 모달 → 확인 시 상세 페이지(`/routines/{routineId}`)로 이동 |
| "저장" 버튼 클릭 | 유효성 검사 통과 시 `updateRoutine` API 호출 |

## 비즈니스 규칙

- **소유권 강제**: `routine.spaceId !== currentSpaceId` 이면 수정 불가, 상세 페이지로 리다이렉트
- **중복 운동 방지**: 동일 운동 추가 시도 시 "이미 추가된 운동입니다." 토스트
- **사용 중 루틴 수정**: 프로그램에서 사용 중이어도 수정 가능 (진행 중인 프로그램에 즉시 반영)

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (Activity 편집, 저장, 소유권 체크 핸들러)
- [ ] ExerciseSelectModal (Widget: 운동 선택 모달 - 등록 페이지와 공유)
- [ ] ActivityEditorCard (Widget: 개별 Activity 편집 카드 - 등록 페이지와 공유)


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | 참조 route layout의 `layout.tsx` skeleton |
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. surface skeleton은 참조 route layout이 소유하고 `page.tsx`는 내부 콘텐츠만 채웁니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/routines/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/routines/[routineId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `form`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | 직접 기획 |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 수정 화면 헤더/섹션 타이틀 마크업을 `PageTitleBar`, `PageTitleBar` 조합으로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
