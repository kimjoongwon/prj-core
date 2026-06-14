# 루틴 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/routines/[routineId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                      │
│  풀바디 루틴 A                          [수정]  [삭제]          │
│  (타 Space 루틴이면 [읽기 전용] 배지, 수정/삭제 버튼 미표시)    │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 기본 정보                                       │
│                                                                  │
│  루틴명      풀바디 루틴 A                                       │
│  라벨        FULL-A                                              │
│  소속 Space  헬스장 A  [상위 Space] ← 상위 Space면 배지 표시    │
│  생성자      홍길동                                              │
│  생성일      2026-02-19 10:30                                    │
│  운동 수     3개                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 운동 구성                                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  1.  스쿼트                                              │   │
│  │      반복 횟수: 3회   휴식 시간: 60초                    │   │
│  │      메모: 천천히 내리기                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  2.  데드리프트                                          │   │
│  │      반복 횟수: 5회   휴식 시간: 90초                    │   │
│  │      메모: -                                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  3.  벤치프레스                                          │   │
│  │      반복 횟수: 4회   휴식 시간: 없음                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역 - 사용 중인 프로그램  (programsCount > 0 시 표시) │
│                                                                  │
│  프로그램명         세션          강사      정원                 │
│  ─────────────────────────────────────────────────────────────  │
│  월요일 요가 클래스  1월 세션     김코치    20명                 │
│  수요일 근력 강화    2월 세션     이코치    15명                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 루틴 목록에서 루틴명을 클릭하여 상세 페이지에 진입한다
2. 루틴 기본 정보(이름, 라벨, 소속 Space, 생성자, 생성일)를 확인한다
3. 루틴에 구성된 Activity 목록을 순서대로 확인한다 (운동명, 반복 횟수, 휴식 시간, 메모)
4. 현재 Space 소유 루틴이면 "수정" 버튼으로 수정 페이지로 이동한다
5. 현재 Space 소유 루틴이면 "삭제" 버튼으로 루틴을 삭제한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title=루틴명, actions에 "목록/수정/삭제" 버튼 |
| 기본 정보 | `Section + PageTitleBar("기본 정보")` | 메타 정보 표시 |
| Activity 목록 | `Section + PageTitleBar("운동 구성")` | Activity 카드 목록 (순서 포함) |
| 사용 프로그램 | `Section + PageTitleBar("사용 중인 프로그램")` | Programs 목록 (programsCount > 0 시 표시) |

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

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (삭제 핸들러)


## SectionSurface / Elevation

| 항목 | 결정 |
|------|------|
| ScreenSurface owner | page/screen content owner |
| ScreenSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | 기본 패딩 |
| 예외 | 없음. `layout.tsx`는 `Page` 구조만 소유하고 surface는 page/screen content owner가 명시합니다. |

## Consumed Layout Contract

| 항목 | 값 |
|------|----|
| 참조 layout spec | `apps/admin/web/src/app/(admin)/routines/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/routines/[routineId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 상세 조회/읽기 전용 본문만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `detail`
- reusable target: `detail/view`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | SectionSurface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | SectionSurface ownership/elevation 규칙과 ScreenSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | SectionSurface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-19 | 초기 생성 | 직접 기획 |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 상세 화면 헤더/섹션 마크업을 `PageTitleBar`, `PageTitleBar` 조합으로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
