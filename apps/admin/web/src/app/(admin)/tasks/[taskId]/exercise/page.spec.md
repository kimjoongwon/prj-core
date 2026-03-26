# 운동 종목 상세 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/tasks/[taskId]/exercise`

## 사용자 시나리오

1. 관리자가 운동 목록에서 운동명을 클릭하여 상세 페이지에 진입한다
2. 운동 기본 정보(이름, 지속시간, 반복횟수, 설명, Space, 등록일)를 확인한다
3. 운동 이미지와 영상이 있으면 미디어 섹션에서 확인한다
4. 이 운동을 사용 중인 루틴 목록을 확인한다
5. 현재 Space 소유 운동이면 "수정" 버튼으로 수정 페이지로 이동한다
6. 현재 Space 소유 운동이고 루틴에서 사용 중이 아니면 "삭제" 버튼으로 삭제한다

## L3: 기능 목록

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-001 | 기본 정보 표시 | 높음 | 운동의 모든 정보를 상세하게 표시 |
| F-002 | 미디어 표시 | 중간 | 이미지 썸네일 및 영상 플레이어 |
| F-003 | 사용 루틴 목록 | 중간 | 이 운동이 포함된 루틴 표시 |
| F-004 | 수정 이동 | 높음 | 현재 Space 소유 운동만 수정 가능 |
| F-005 | 삭제 | 중간 | 루틴 사용 중 아닌 경우에만 삭제 가능 |

## L4: 화면 구조

### 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title=운동명, actions에 "수정" / "삭제" 버튼 (현재 Space 소유 시만) |
| 기본 정보 | `섹션 영역` | title="기본 정보", 운동 메타 정보 표시 |
| 미디어 | `섹션 영역` | title="미디어", 이미지/영상 표시 (미디어 있을 때만 표시) |
| 사용 루틴 목록 | `섹션 영역` | title="사용 중인 루틴", 루틴 목록 (루틴이 있을 때만 표시) |

### 기본 정보 표시

| 항목 | 설명 |
|------|------|
| 운동명 | name |
| 지속시간 | duration (초 → "분:초" 형식 변환, 예: 90초 → "1분 30초") |
| 반복횟수 | `{count}회` |
| 설명 | description (없으면 "-") |
| 소속 Space | task.space.name (상위 Space 소유이면 "상위 Space" Badge 표시) |
| 등록일 | createdAt (DateTimeCell) |
| 수정일 | updatedAt (DateTimeCell, 없으면 "-") |

### 미디어 섹션 표시

| 항목 | 설명 |
|------|------|
| 운동 이미지 | imageFileId가 있으면 이미지 표시 (최대 가로 500px) |
| 운동 영상 | videoFileId가 있으면 HTML5 비디오 플레이어 표시 |

### 사용 루틴 목록 표시

Activity를 통해 이 운동을 포함하는 루틴 목록:

| 컬럼 | 설명 |
|------|------|
| 루틴명 | routine.name (클릭 시 해당 루틴 상세 페이지로 이동) |
| 라벨 | routine.label |
| Space | routine.task.space.name |
| 등록일 | routine.createdAt |

### 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 데이터 조회 중 | 스켈레톤 UI |
| 데이터 표시 | 정상 조회 | 기본 정보 + 미디어 + 루틴 목록 |
| 존재하지 않음 | 404 | "운동 종목을 찾을 수 없습니다." 메시지 + 목록 돌아가기 버튼 |
| 삭제 진행 중 | 삭제 API 호출 중 | "삭제" 버튼 비활성화 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetTaskExerciseQuery({ taskId })` | Exercise + Task(Space, Creator) 정보 포함 |
| 클라이언트 | `useGetTaskExercise({ taskId })` | SSR 이후 클라이언트에서 재사용 |
| 클라이언트 | `useGetTaskRoutines({ taskId })` | 이 Exercise를 사용 중인 루틴 목록 |
| 삭제 시 | `useDeleteTask()` | 삭제 후 `/tasks` 목록으로 이동 |

### 응답 데이터 구조

```typescript
{
  id: string;
  name: string;
  duration: number;         // 초 단위
  count: number;
  description?: string;
  imageFileId?: string;
  videoFileId?: string;
  taskId: string;
  task: {
    spaceId: string;
    space: { id: string; name: string; };
    creator?: { id: string; name: string; };
  };
  createdAt: string;
  updatedAt?: string;
}
```

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "수정" 버튼 클릭 | `/tasks/{taskId}/exercise/edit` 수정 페이지로 이동 |
| "삭제" 버튼 클릭 | 확인 모달 표시 → 확인 시 `deleteTask` 호출 → 성공 시 `/tasks` 이동 |
| 루틴명 클릭 | `/routines/{routineId}` 루틴 상세 페이지로 이동 |

## 비즈니스 규칙

- **수정/삭제 권한**: 현재 Space 소유 운동(task.spaceId === currentSpaceId)만 가능
- **삭제 제약**: 루틴 Activity에서 사용 중이면 삭제 불가 (서버에서 409 에러, 에러 토스트 표시)
- **삭제 제약 UI**: "사용 중인 루틴" 섹션이 있으면 "삭제" 버튼에 비활성 스타일 또는 툴팁 표시
- **지속시간 표시**: `Math.floor(duration / 60)`분 `duration % 60`초 형식

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (삭제 핸들러)


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/tasks/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

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
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
