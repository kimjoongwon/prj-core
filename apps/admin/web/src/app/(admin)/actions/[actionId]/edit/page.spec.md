# Action 수정 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/actions/[actionId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                          [상세로 돌아가기 ←] │
│ Action 수정                                                       │
│ READ_ARTICLE · action                                             │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                    │
│                                                                   │
│  식별자 (읽기 전용)                                                │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ READ_ARTICLE                                    🔒      │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  표시명                                                            │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 게시글 읽기                                              │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  설명                                                              │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │ 게시글을 조회하는 액션입니다.                             │     │
│  │                                                         │     │
│  └─────────────────────────────────────────────────────────┘     │
│                                                                   │
│  분류                              정렬 순서                       │
│  ┌───────────────────────────┐    ┌──────────────────────┐       │
│  │ CRUD                    ▼ │    │ 10                   │       │
│  └───────────────────────────┘    └──────────────────────┘       │
│                                                                   │
│                                      [취소]  [저장]               │
└─────────────────────────────────────────────────────────────────┘

※ 시스템 Action(isSystem=true)인 경우:
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  시스템 Action은 수정할 수 없습니다.                           │
│                              [상세로 돌아가기]                     │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 Action 상세 페이지에서 "수정" 버튼을 클릭하여 수정 페이지에 진입한다.
2. 기존 데이터가 폼에 자동으로 채워진다.
3. 시스템 Action(isSystem=true)인 경우 수정 불가 안내를 보여주고 상세로 돌아가는 버튼을 제공한다.
4. 행위 식별자(name)는 읽기 전용으로 수정할 수 없다.
5. 표시명, 설명, 분류, 정렬 순서를 수정한다.
6. "저장" 버튼을 클릭하여 변경사항을 저장한다.
7. 저장 성공 시 해당 Action 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `페이지 헤더 영역` | title="Action 수정", description 동적 (표시명 또는 식별자 기반) |
| 액션 영역 | `Button` | "상세로 돌아가기" (ArrowLeft, light) |
| 폼 섹션 | `섹션 영역` | 식별자(읽기 전용), 표시명, 설명, 분류, 정렬 순서, 취소+저장 버튼 |

## 폼 필드

| 필드 | 컴포넌트 | 필수 | 읽기 전용 | 설명 |
|------|----------|:----:|:---------:|------|
| name | Input | - | O | 읽기 전용 + isDisabled |
| displayName | Input | X | X | maxLength=100 |
| description | TextArea | X | X | maxLength=200 |
| group | Select | X | X | 옵션: crud, visibility, workflow, bulk |
| order | Input (number) | X | X | 정렬 순서 |

## group 옵션

| 값 | 라벨 |
|----|------|
| crud | CRUD |
| visibility | Visibility |
| workflow | Workflow |
| bulk | Bulk |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | "로딩 중..." 텍스트 |
| 데이터 없음 | Action을 찾을 수 없음 | "Action을 찾을 수 없습니다." + "목록으로" 버튼 |
| 시스템 Action | isSystem=true | "시스템 Action은 수정할 수 없습니다." + "상세로 돌아가기" 버튼 |
| 폼 표시 | 기존 데이터 prefill | 수정 가능한 폼 |
| 저장 중 | PATCH API 호출 대기 | 저장 버튼 isLoading |
| 저장 성공 | 성공 + 이동 | 상세 페이지로 router.push |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 초기 렌더 | `GET /api/v1/actions/:id` (useGetActionById) | 기존 데이터 첫 조회 |
| 클라이언트 | `GET /api/v1/actions/:id` (useGetActionById) | 기존 데이터 조회 |
| 저장 버튼 클릭 | `PATCH /api/v1/actions/:id` (useUpdateAction) | Action 수정 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/actions/${actionId}` 상세 페이지로 router.push |
| onClickListButton | `/actions` 목록 페이지로 router.push |
| onClickSubmitButton | UpdateActionDto 조립 후 updateAction 뮤테이션 실행 |

## 로컬 상태 (useLocalObservable)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| displayName | string | "" | 표시명 |
| description | string | "" | 설명 |
| group | string | "" | 분류 |
| order | number | 0 | 정렬 순서 |
| errors.config | string | "" | (현재 미사용) |
| isInitialized | boolean | false | 초기 데이터 로딩 완료 여부 |

## 초기 데이터 로딩

useEffect로 API 응답 데이터를 로컬 상태에 한 번만 채운다:
- `action.displayName`, `action.description`, `action.group`, `action.order`를 로컬 상태에 복사
- `isInitialized` 플래그로 중복 초기화 방지

## 참고사항

- UpdateActionDto에 config 필드가 없으므로 config 수정 UI 미제공
- 시스템 Action 접근 시 수정 폼 대신 안내 메시지 표시

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/actions/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/actions/[actionId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page` |

- `page.tsx`는 상세 조회, 저장 mutation, 라우팅만 담당하고 시각 조합과 로컬 폼 상태는 `ActionEditScreen`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `form`
- reusable target: `form`
- screen component path: `packages/fe-ui/src/screen/ActionEditScreen/ActionEditScreen.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `ActionEditScreen` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | SectionSurface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | SectionSurface ownership/elevation 규칙과 ScreenSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | SectionSurface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
| 2026-03-30 | route가 query/mutation/navigation/local state를 소유하고 pure screen props를 주입하는 구조로 정리 | codex |
