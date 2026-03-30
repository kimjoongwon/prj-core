# 운동 종목 등록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/tasks/new`

## 사용자 시나리오

1. 관리자가 운동 목록에서 "운동 등록" 버튼을 클릭하여 이 페이지에 진입한다
2. 운동 기본 정보(이름, 지속시간, 반복횟수, 설명)를 입력한다
3. 필요 시 운동 동작 이미지를 업로드한다
4. 필요 시 운동 시연 영상을 업로드하거나 링크를 입력한다
5. "저장" 버튼을 클릭하여 운동을 등록한다
6. 등록 성공 시 생성된 운동의 상세 페이지로 이동한다

## 도메인 동작

Exercise 등록 시 서버에서 Task와 Exercise를 동시 생성합니다.
- Task: `spaceId`(현재 Space), `creatorId`(현재 사용자) 자동 설정
- Exercise: 입력 데이터 저장, `taskId` 자동 연결

UI에서는 Exercise 폼 입력만 필요합니다.

## L3: 기능 목록

| ID | 기능 | 우선순위 | 설명 |
|----|------|----------|------|
| F-001 | 기본 정보 입력 | 높음 | 이름, 지속시간, 반복횟수, 설명 입력 |
| F-002 | 지속시간 UI | 높음 | 분/초 분리 입력 → 초 단위 변환 저장 |
| F-003 | 이미지 업로드 | 중간 | 운동 동작 이미지 (선택) |
| F-004 | 영상 업로드/링크 | 중간 | 운동 시연 영상 (선택) |
| F-005 | 폼 유효성 검사 | 높음 | 필수 필드 미입력 시 에러 표시 |
| F-006 | 저장/취소 | 높음 | 저장 성공 시 상세 페이지 이동, 취소 시 목록 복귀 |

## L4: 화면 구조

### 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `Page + PageTitleBar` | title="운동 등록", actions에 "취소"/"저장" 버튼 |
| 기본 정보 섹션 | `Section + PageTitleBar` | title="기본 정보", 필수 필드 입력 |
| 미디어 섹션 | `Section + PageTitleBar` | title="미디어", 이미지/영상 업로드 (선택) |

### 기본 정보 섹션 필드

| 필드 | 컴포넌트 | 유효성 | 설명 |
|------|----------|--------|------|
| name | Input | 필수, 1-100자 | 운동 이름 (예: "바벨 스쿼트", "푸시업") |
| duration | DurationInput | 필수, 1초 이상 | 지속시간 - 분/초 분리 입력 UI, 내부적으로 초 단위 저장 |
| count | NumberInput | 필수, 최소 1 | 반복 횟수 (예: 10회) |
| description | Textarea | 선택, 최대 500자 | 운동 설명, 수행 방법 등 |

**DurationInput UI 상세:**
- 분(min) 숫자 입력 + 초(sec) 숫자 입력을 나란히 배치
- 저장 시 `duration = min * 60 + sec` 계산
- 표시 예: "1분 30초" = 90초

### 미디어 섹션 필드

| 필드 | 컴포넌트 | 유효성 | 설명 |
|------|----------|--------|------|
| imageFileId | FileUpload | 선택, 이미지 파일 | 운동 동작 이미지 (jpg, png, gif 등) |
| videoFileId | FileUpload | 선택, 동영상 파일 | 운동 시연 영상 (mp4, mov 등) |

**파일 업로드 UI:**
- 드래그 앤 드롭 또는 파일 선택 버튼
- 업로드 후 미리보기 표시 (이미지: 썸네일, 영상: 재생 가능한 플레이어)
- 파일 삭제 버튼 포함

### 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 빈 폼 | 기본값 없음 |
| 작성 중 | 폼 입력 | 실시간 유효성 표시 |
| 저장 중 | API 호출 중 | "저장" 버튼 비활성화 + 스피너 |
| 저장 성공 | 생성 완료 | `/tasks/{taskId}/exercise` 상세 페이지로 이동 |
| 저장 실패 | API 오류 | 에러 토스트 표시, 폼 유지 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 저장 | `useCreateTask()` | Exercise + Task 동시 생성 |

### 요청 데이터 구조

```typescript
{
  name: string;           // 운동 이름 (필수)
  duration: number;       // 지속시간 (초, 필수)
  count: number;          // 반복 횟수 (필수)
  description?: string;   // 설명 (선택)
  imageFileId?: string;   // 이미지 파일 ID (선택)
  videoFileId?: string;   // 영상 파일 ID (선택)
}
```

### 응답 데이터 구조

```typescript
{
  id: string;             // 생성된 Exercise ID
  taskId: string;         // 자동 생성된 Task ID
  name: string;
  duration: number;
  count: number;
  description?: string;
  imageFileId?: string;
  videoFileId?: string;
  createdAt: string;
}
```

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "취소" 버튼 클릭 | `/tasks` 목록으로 이동 (폼 데이터 버림) |
| "저장" 버튼 클릭 | 폼 유효성 검사 → `createExercise` 호출 → 성공 시 상세 이동 |
| 이미지 업로드 | 파일 API 업로드 → `imageFileId` 설정 |
| 영상 업로드 | 파일 API 업로드 → `videoFileId` 설정 |

## 런타임 책임

- `page.tsx`가 `useCreateTask`, `useRouter`, `useLocalObservable`를 직접 소유합니다.
- `@cocrepo/ui`의 `AdminTasksNewPage`는 props-only pure page로 사용합니다.

## 비즈니스 규칙

- Exercise 등록 시 현재 사용자의 Space를 자동으로 Task.spaceId에 설정 (서버 처리)
- `duration`은 최소 1초 이상이어야 합니다
- `count`는 최소 1회 이상이어야 합니다
- 파일 업로드 완료 후 반환되는 fileId를 폼 필드에 저장합니다

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] hooks/useHandlers.ts (저장, 파일업로드 핸들러)


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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/tasks/new/page.tsx` |
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
| 2026-03-30 | 태스크 등록의 mutation/router/local state를 route page로 이동하고 `@cocrepo/ui` page를 pure contract로 분리 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-11 | aggregate root 기준 spaces/tasks 경로와 API 계약으로 전환 | codex |
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | Page/PageTitleBar + Section/PageTitleBar 패턴 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
