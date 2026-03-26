# 권한 등록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/abilities/new`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  권한 등록                          [← 목록으로]           [💾 등록]    │
│  새로운 CASL 권한을 등록합니다.                                          │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                                │
│                                                                          │
│  이름 *                                                                  │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 예: read:post                                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│  설명                                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                                                                    │ │
│  └────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역  CASL 정보                                                │
│                                                                          │
│  Subject *                            Action *                          │
│  ┌──────────────────────────────────┐ ┌────────────────────────────────┐│
│  │ Subject 선택              ▼      │ │ Action 선택             ▼     ││
│  └──────────────────────────────────┘ └────────────────────────────────┘│
│                                                                          │
│  Fields (쉼표 구분)                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 예: title, content, status                                         │ │
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

1. 관리자가 "권한 추가" 버튼을 통해 등록 페이지에 진입한다.
2. 기본 정보(이름, 설명)를 입력한다.
3. CASL 정보(Subject, Action, Fields, Conditions)를 설정한다.
4. 필요 시 거부 권한(cannot)으로 전환하고 거부 사유를 입력한다.
5. "등록" 버튼을 클릭하여 권한을 생성한다.
6. 등록 성공 시 해당 권한 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="권한 등록", description="새로운 CASL 권한을 등록합니다." |
| 액션 영역 | `Button` x2 | "목록으로" (ArrowLeft) + "등록" (Save, primary) |
| 기본 정보 섹션 | `Section + PageTitleBar("기본 정보")` | 이름(Input, 필수), 설명(Textarea) |
| CASL 정보 섹션 | `Section + PageTitleBar("CASL 정보")` | Subject(Select, 필수), Action(Select, 필수), Fields(Textarea), Conditions(Textarea), 거부 토글(Switch), 거부 사유(Textarea) |

## 폼 필드

| 필드 | 컴포넌트 | 필수 | 유효성 검사 |
|------|----------|:----:|------------|
| name | Input | O | 빈 값 검사 |
| description | Textarea | X | - |
| subjectId | Select | O | 빈 값 검사 |
| actionId | Select | O | 빈 값 검사 |
| fields | Textarea | X | 쉼표 구분 파싱 |
| conditions | Textarea | X | JSON 형식 검증 |
| inverted | Switch | X | - |
| reason | Textarea | X | inverted=true일 때만 활성화 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 빈 폼 표시 | 입력 폼 활성화 |
| 등록 중 | API 호출 대기 | 등록 버튼 isLoading |
| 등록 성공 | 성공 토스트 + 이동 | "권한 등록 성공" 토스트 → 상세 페이지 이동 |
| 등록 실패 | 에러 토스트 | "권한 등록 실패" 에러 메시지 |
| 입력 오류 | 유효성 검사 실패 | "입력 오류" 토스트 (필수 필드 미입력, JSON 형식 오류) |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 페이지 진입 | `GET /api/v1/subjects` (useGetSubjects) | Subject 선택 옵션 로드 |
| 페이지 진입 | `GET /api/v1/actions` (useGetActions) | Action 선택 옵션 로드 |
| 등록 버튼 클릭 | `POST /api/v1/abilities` (useCreateAbility) | 권한 생성 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/abilities` 목록 페이지로 router.push |
| onClickCreateButton | 유효성 검사 후 createAbility 뮤테이션 실행 |

## 로컬 상태 (useLocalObservable)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| name | string | "" | 권한 이름 |
| description | string | "" | 설명 |
| subjectId | string | "" | Subject ID |
| actionId | string | "" | Action ID |
| fields | string | "" | 필드 (쉼표 구분 문자열) |
| conditions | string | "" | 조건 (JSON 문자열) |
| inverted | boolean | false | 거부 여부 |
| reason | string | "" | 거부 사유 |

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
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/abilities/new/page.tsx` |
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
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더/섹션 타이틀 마크업을 `PageTitleBar(level=1/2)` 패턴으로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
