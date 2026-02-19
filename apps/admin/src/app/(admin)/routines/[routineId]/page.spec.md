# 루틴 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/routines/[routineId]`

## 사용자 시나리오

1. 관리자가 루틴 목록에서 루틴명을 클릭하여 상세 페이지에 진입한다
2. 루틴 기본 정보(이름, 라벨, 소속 Space, 생성자, 생성일)를 확인한다
3. 루틴에 구성된 Activity 목록을 순서대로 확인한다 (운동명, 반복 횟수, 휴식 시간, 메모)
4. 현재 Space 소유 루틴이면 "수정" 버튼으로 수정 페이지로 이동한다
5. 현재 Space 소유 루틴이면 "삭제" 버튼으로 루틴을 삭제한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `PageSurface` | title=루틴명, actions에 "수정" / "삭제" 버튼 (현재 Space 소유 시만 표시) |
| 기본 정보 | `SectionSurface` | title="기본 정보", 메타 정보 표시 |
| Activity 목록 | `SectionSurface` | title="운동 구성", Activity 카드 목록 (순서 포함) |
| 사용 프로그램 | `SectionSurface` | title="사용 중인 프로그램", Programs 목록 (programsCount > 0 시 표시) |

## 기본 정보 표시

| 항목 | 설명 |
|------|------|
| 루틴명 | name |
| 라벨 | label |
| 소속 Space | space.name (상위 Space 루틴이면 "상위 Space" Badge 표시) |
| 생성자 | creator.name (없으면 "시스템") |
| 생성일 | createdAt (DateTimeCell) |
| 운동 수 | activities.length개 |

## Activity 목록 표시

순서 번호와 함께 Activity를 카드 형태로 나열:

| 항목 | 설명 |
|------|------|
| 순서 | order (1, 2, 3...) |
| 운동명 | activity.task.exercise.name |
| 반복 횟수 | `{repetitions}회` |
| 휴식 시간 | `{restTime}초` (0이면 "없음") |
| 메모 | notes (없으면 비표시) |

## 사용 프로그램 목록 (programsCount > 0 시)

| 컬럼 | 설명 |
|------|------|
| 프로그램명 | program.name |
| 세션 | program.session.name |
| 강사 | program.instructorId (User명 조회 필요) |
| 정원 | program.capacity |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 데이터 조회 중 | 스켈레톤 UI |
| 데이터 표시 | 정상 조회 | 기본 정보 + Activity 목록 |
| 존재하지 않음 | 404 | "루틴을 찾을 수 없습니다." 메시지 + 목록 돌아가기 버튼 |
| 삭제 진행 중 | 삭제 API 호출 | 삭제 버튼 비활성화 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetRoutineQuery({ routineId })` | 루틴 + Activities + Space 정보 포함 |
| 클라이언트 | `useGetRoutine({ routineId })` | SSR 이후 클라이언트에서 재사용 |
| 삭제 시 | `useDeleteRoutine()` | 삭제 후 `/routines` 목록으로 이동 |

### 응답 데이터 구조

```typescript
{
  id: string;
  name: string;
  label: string;
  spaceId: string;
  space: { id: string; name: string; };
  creatorId: string | null;
  creator: { id: string; name: string; } | null;
  createdAt: string;
  activities: {
    id: string;
    order: number;
    repetitions: number;
    restTime: number;
    notes: string | null;
    task: {
      exercise: {
        name: string;
        duration: number;
        count: number;
      };
    };
  }[];
  programs: {
    id: string;
    name: string;
    capacity: number;
  }[];
}
```

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/routines/{routineId}/edit` 수정 페이지로 이동 |
| "삭제" 버튼 클릭 | 확인 모달 표시 ("사용 중인 프로그램이 있습니다" 경고 포함 시) → 확인 시 `deleteRoutine` 호출 → 성공 시 `/routines` 이동 |
| "목록으로" 링크 | `/routines` 목록 페이지로 이동 |

## 비즈니스 규칙

- **소유권 확인**: `routine.spaceId === currentSpaceId` 일 때만 수정/삭제 버튼 표시
- **삭제 경고**: `programs.length > 0` 이면 삭제 확인 모달에 사용 중인 프로그램 수 경고 표시
- **상위 Space 루틴**: 소유권이 없으므로 수정/삭제 불가, "읽기 전용" 배지 표시

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트, Prefetch + HydrationBoundary)
- [ ] _client.tsx (클라이언트 컴포넌트, observer 래핑)
- [ ] _prefetch.ts (prefetchGetRoutineQuery 호출)
- [ ] hooks/useHandlers.ts (삭제 핸들러)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | 직접 기획 |
