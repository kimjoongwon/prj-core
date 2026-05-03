# 운동 종목 수정 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/tasks/[taskId]/exercise/edit`

## 사용자 시나리오

1. 관리자가 운동 상세 페이지에서 "수정" 버튼을 클릭하여 이 페이지에 진입한다
2. 현재 운동 정보가 폼에 미리 채워진 상태로 로드된다
3. 변경할 필드를 수정한다 (이름, 지속시간, 반복횟수, 설명, 이미지, 영상)
4. "저장" 버튼을 클릭하여 변경 사항을 저장한다
5. 저장 성공 시 해당 운동의 상세 페이지로 이동한다

## L3: 기능 목록

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-001 | 기존 데이터 프리페칭 | 높음 | SSR에서 기존 운동 데이터를 미리 로드하여 폼에 채움 |
| F-002 | 기본 정보 수정 | 높음 | 이름, 지속시간, 반복횟수, 설명 수정 |
| F-003 | 이미지 변경 | 중간 | 공통 AssetBrowser modal에서 기존 이미지 해제/새 이미지 선택/업로드 |
| F-004 | 영상 변경 | 중간 | 공통 AssetBrowser modal에서 기존 영상 해제/새 영상 선택/업로드 |
| F-005 | 폼 유효성 검사 | 높음 | 필수 필드 미입력 시 에러 표시 |
| F-006 | 저장/취소 | 높음 | 저장 성공 시 상세 페이지 이동, 취소 시 상세 복귀 |
| F-007 | 접근 권한 검사 | 높음 | 현재 Space 소유 운동만 수정 가능. 타 Space 운동 접근 시 리다이렉트 |

## L4: 화면 구조

### 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title="운동 수정", actions에 "취소" / "저장" 버튼 |
| 기본 정보 섹션 | `섹션 영역` | title="기본 정보", 필수 필드 수정 |
| 미디어 섹션 | `섹션 영역` | title="미디어", 이미지/영상 변경 (선택) |

### 기본 정보 섹션 필드

| 필드 | 컴포넌트 | 유효성 | 기본값 | 설명 |
|------|----------|--------|--------|------|
| name | Input | 필수, 1-100자 | exercise.name | 운동 이름 |
| duration | DurationInput | 필수, 1초 이상 | exercise.duration | 지속시간 (분/초 분리 입력) |
| count | NumberInput | 필수, 최소 1 | exercise.count | 반복 횟수 |
| description | Textarea | 선택, 최대 500자 | exercise.description | 운동 설명 |

**DurationInput 기본값 처리:**
- `exercise.duration`(초) → 분: `Math.floor(duration / 60)`, 초: `duration % 60`
- 저장 시 `duration = min * 60 + sec` 계산

### 미디어 섹션 필드

| 필드 | 컴포넌트 | 설명 |
|------|----------|------|
| imageFileId | AssetBrowser picker | 기존 이미지 미리보기 표시. 삭제 버튼으로 기존 이미지 제거. 새 에셋 선택/업로드 가능 |
| videoFileId | AssetBrowser picker | 기존 영상 미리보기 표시. 삭제 버튼으로 기존 영상 제거. 새 에셋 선택/업로드 가능 |

### 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | 기존 데이터 조회 중 | 스켈레톤 UI |
| 폼 준비 | 기존 데이터 폼 채움 완료 | 수정 가능한 상태 |
| 저장 중 | API 호출 중 | "저장" 버튼 비활성화 + 스피너 |
| 저장 성공 | 수정 완료 | `/tasks/{taskId}/exercise` 상세 페이지로 이동 |
| 저장 실패 | API 오류 | 에러 토스트 표시, 폼 유지 |
| 접근 거부 | 타 Space 운동 접근 | 에러 토스트 + `/tasks` 목록으로 리다이렉트 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetTaskExerciseQuery({ taskId })` | 기존 데이터 로드 |
| 클라이언트 | `useGetTaskExercise({ taskId })` | SSR 이후 클라이언트 재사용 |
| 저장 | `useUpdateTaskExercise()` | 변경된 필드만 전송 (PATCH) |

### 요청 데이터 구조

```typescript
// PATCH /tasks/{taskId}/exercise
{
  name?: string;
  duration?: number;      // 초 단위
  count?: number;
  description?: string | null;
  imageFileId?: string | null;  // null: 이미지 제거
  videoFileId?: string | null;  // null: 영상 제거
}
```

## 런타임 책임

- route container가 `useParams`, `useRouter`, `useGetTaskExercise`, `useUpdateTaskExercise`, `useLocalObservable`을 소유합니다.
- route container가 `useTaskExerciseAssetBrowser()`를 통해 image/video picker slot과 공통 `AssetBrowser` bindings를 소유합니다.
- route container가 duration 분/초 변환, 스케줄 가능 상태 계산, 저장 성공/실패 toast와 상세 페이지 이동을 처리합니다.
- `TaskExerciseEditPage`는 입력값/에러/CTA handler만 렌더링합니다.

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "취소" 버튼 클릭 | `/tasks/{taskId}/exercise` 상세 페이지로 이동 (변경 사항 버림) |
| "저장" 버튼 클릭 | 폼 유효성 검사 → `updateExercise` 호출 → 성공 시 상세 이동 |
| 이미지 삭제 버튼 클릭 | `imageFileId = null` 설정 (저장 시 서버에 null 전송) |
| 이미지 picker 열기/업로드 | 공통 `AssetBrowser` modal과 `useAdminAssetBrowser()`가 선택/업로드/폴더 CRUD를 처리 |
| 영상 삭제 버튼 클릭 | `videoFileId = null` 설정 |
| 영상 picker 열기/업로드 | 공통 `AssetBrowser` modal과 `useAdminAssetBrowser()`가 선택/업로드/폴더 CRUD를 처리 |

## 비즈니스 규칙

- **수정 권한**: 현재 Space 소유 운동(task.spaceId === currentSpaceId)만 수정 가능
- **미디어 삭제**: `null`을 전송하면 서버에서 해당 파일 ID를 제거
- **변경 감지**: 기존 값과 동일한 필드는 요청에서 제외하거나 포함해도 무방

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (저장, 파일업로드, 미디어삭제 핸들러)


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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/edit/page.tsx` |
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
| 2026-05-02 | 수정 성공/실패 toast와 폼 검증 메시지를 런타임 i18n catalog 번역 경로로 연결 | codex |
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 pure page 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-04-01 | 수정 화면의 자산 변경 흐름을 공통 `AssetBrowser` modal과 shared hook 조합으로 전환 | codex |
| 2026-03-30 | 조회/저장/local state 책임을 route container로 명시하고 pure page props 위임 구조를 문서화 | codex |
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
