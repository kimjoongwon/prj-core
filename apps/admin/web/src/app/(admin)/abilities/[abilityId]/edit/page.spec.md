# 권한 수정 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/abilities/[abilityId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  권한 수정                              [← 취소]            [💾 저장]   │
│  권한 정보를 수정합니다.                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                                │
│                                                                          │
│  이름 (읽기 전용)                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ read:post                                 권한 이름은 수정 불가    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  설명                                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 게시글 읽기 권한                                                   │ │
│  └────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  CASL 정보                                                │
│                                                                          │
│  Subject                              Action                            │
│  ┌──────────────────────────────────┐ ┌────────────────────────────────┐│
│  │ Post (게시글)              ▼     │ │ read (읽기)             ▼     ││
│  └──────────────────────────────────┘ └────────────────────────────────┘│
│                                                                          │
│  Fields (쉼표 구분)                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ title, content                                                     │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  Conditions (JSON)                                                       │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ {"authorId": "${user.id}"}                                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  거부 권한 (cannot)  ○ OFF                                               │
│  거부 사유  (inverted=true일 때 활성화)                                  │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ (비활성화)                                                         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 권한 상세 페이지에서 "수정" 버튼을 클릭하여 수정 페이지에 진입한다.
2. 기존 데이터가 폼에 자동으로 채워진다.
3. 권한 이름은 읽기 전용으로 수정할 수 없다.
4. 설명, Subject, Action, Fields, Conditions, 거부 여부, 거부 사유를 수정한다.
5. "저장" 버튼을 클릭하여 변경사항을 저장한다.
6. 저장 성공 시 해당 권한 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `페이지 헤더 영역` | title="권한 수정", description="권한 정보를 수정합니다." |
| 액션 영역 | `Button` x2 | "취소" (ArrowLeft) + "저장" (Save, primary) |
| 기본 정보 섹션 | `섹션 영역` | 이름(Input, 읽기 전용), 설명(Textarea) |
| CASL 정보 섹션 | `섹션 영역` | Subject(Select), Action(Select), Fields(Textarea), Conditions(Textarea), 거부 토글(Switch), 거부 사유(Textarea) |

## 폼 필드

| 필드 | 컴포넌트 | 필수 | 읽기 전용 | 설명 |
|------|----------|:----:|:---------:|------|
| name | Input | - | O | "권한 이름은 수정할 수 없습니다." |
| description | Textarea | X | X | 설명 수정 |
| subjectId | Select | X | X | Subject 변경 |
| actionId | Select | X | X | Action 변경 |
| fields | Textarea | X | X | 쉼표 구분 필드 |
| conditions | Textarea | X | X | JSON 형식 조건 |
| inverted | Switch | X | X | 거부 여부 토글 |
| reason | Textarea | X | X | inverted=true일 때만 활성화 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 중 | API 응답 대기 | Spinner + "로딩 중..." |
| 데이터 없음 | 권한을 찾을 수 없음 | "권한을 찾을 수 없습니다." + "목록으로" 버튼 |
| 폼 표시 | 기존 데이터 prefill | 수정 가능한 폼 |
| 저장 중 | PATCH API 호출 대기 | 저장 버튼 isLoading |
| 저장 성공 | 성공 토스트 + 이동 | "권한 수정 성공" 토스트 → 상세 페이지 이동 |
| 저장 실패 | 에러 토스트 | "권한 수정 실패" 에러 메시지 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR Prefetch | `GET /api/v1/abilities/:id` (prefetchAbilityEditData) | 상세 데이터 프리페치 |
| 클라이언트 | `GET /api/v1/abilities/:id` (useGetAbilityById) | 기존 데이터 조회 |
| 클라이언트 | `GET /api/v1/subjects` (useGetSubjects) | Subject 선택 옵션 |
| 클라이언트 | `GET /api/v1/actions` (useGetActions) | Action 선택 옵션 |
| 저장 버튼 클릭 | `PATCH /api/v1/abilities/:id` (useUpdateAbility) | 권한 수정 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/abilities/${abilityId}` 상세 페이지로 router.push |
| onClickSaveButton | 유효성 검사 후 updateAbility 뮤테이션 실행 |

## 로컬 상태 (useLocalObservable)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| name | string | "" | 권한 이름 (읽기 전용) |
| description | string | "" | 설명 |
| subjectId | string | "" | Subject ID |
| actionId | string | "" | Action ID |
| fields | string | "" | 필드 (쉼표 구분) |
| conditions | string | "" | 조건 (JSON 문자열) |
| inverted | boolean | false | 거부 여부 |
| reason | string | "" | 거부 사유 |
| isInitialized | boolean | false | 초기 데이터 로딩 완료 여부 |

## 초기 데이터 로딩

useEffect로 API 응답 데이터를 로컬 상태에 한 번만 채운다:
- `ability.fields` 배열을 쉼표 구분 문자열로 변환
- `ability.conditions` 객체를 JSON.stringify로 변환
- `isInitialized` 플래그로 중복 초기화 방지

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/abilities/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/abilities/[abilityId]/edit/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 입력, 검증, 생성/수정 폼 흐름만 담당합니다.

## Rendering Decision

- 기본 패턴: `page.tsx` 단일 CSR
- page role: `form`
- reusable target: `widget/form`
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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx`를 `Page + PageTitleBar + PageTitleBar` 패턴으로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
