# Action 등록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/actions/new`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────┐
│  Action 등록                                                         │
│  새로운 Action을 등록합니다.                       [← 목록으로]      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  ℹ️  이름 규칙 안내                                          │    │
│  │  소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다. │    │
│  │  예) user:create, order:approve                             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                                                             │    │
│  │  행위 식별자 *                                              │    │
│  │  ┌─────────────────────────────────────────────────────┐   │    │
│  │  │ user:create                                         │   │    │
│  │  └─────────────────────────────────────────────────────┘   │    │
│  │                                                             │    │
│  │  표시명                                                     │    │
│  │  ┌─────────────────────────────────────────────────────┐   │    │
│  │  │ 사용자 생성                                          │   │    │
│  │  └─────────────────────────────────────────────────────┘   │    │
│  │                                                             │    │
│  │  설명                                                       │    │
│  │  ┌─────────────────────────────────────────────────────┐   │    │
│  │  │                                                     │   │    │
│  │  │ 사용자를 시스템에 등록하는 행위입니다.               │   │    │
│  │  └─────────────────────────────────────────────────────┘   │    │
│  │                                                             │    │
│  │  분류                          정렬 순서                    │    │
│  │  ┌─────────────────────────┐  ┌──────────────────────┐    │    │
│  │  │ CRUD               ▾   │  │ 1                    │    │    │
│  │  └─────────────────────────┘  └──────────────────────┘    │    │
│  │                                                             │    │
│  │                            [취소]  [Action 등록]           │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 Action 목록에서 "등록" 버튼을 클릭하여 등록 페이지에 진입한다.
2. 행위 식별자(name)를 소문자로 입력한다 (자동 소문자 변환).
3. 표시명, 설명, 분류(group), 정렬 순서를 입력한다.
4. "Action 등록" 버튼을 클릭하여 생성한다.
5. 등록 성공 시 해당 Action 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="Action 등록", description="새로운 Action을 등록합니다." |
| 액션 영역 | `Button` | "목록으로" (ArrowLeft, light) |
| 안내 메시지 | `div` | primary 배경, 이름 규칙 안내 ("소문자로 시작하고...") |
| 폼 섹션 | `Section` | 행위 식별자, 표시명, 설명, 분류, 정렬 순서, 제출 버튼 |

## 폼 필드

| 필드 | 컴포넌트 | 필수 | 유효성 검사 |
|------|----------|:----:|------------|
| name | Input | O | 필수, 패턴: `^[a-z][a-z0-9:_]*$` |
| displayName | Input | X | maxLength=100 |
| description | Textarea | X | maxLength=200 |
| group | Select | X | 옵션: crud, visibility, workflow, bulk |
| order | Input (number) | X | 숫자 |

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
| 초기 | 빈 폼 표시 | 입력 폼 활성화 |
| 유효성 오류 | name 규칙 위반 | Input isInvalid + errorMessage |
| 등록 중 | API 호출 대기 | 등록 버튼 isLoading |
| 등록 성공 | 성공 + 이동 | 상세 페이지로 router.push |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 등록 버튼 클릭 | `POST /api/v1/actions` (useCreateAction) | Action 생성 (isSystem: false 고정) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/actions` 목록 페이지로 router.push |
| onClickSubmitButton | validate() 후 createAction 뮤테이션 실행 |
| name 입력 | 자동 toLowerCase() 변환 |

## 로컬 상태 (useLocalObservable)

| 필드 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| name | string | "" | 행위 식별자 |
| displayName | string | "" | 표시명 |
| description | string | "" | 설명 |
| group | string | "" | 분류 |
| order | number | 0 | 정렬 순서 |
| errors.name | string | "" | 이름 유효성 오류 메시지 |

## 유효성 검사 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 필수 | "행위 식별자를 입력해주세요." |
| name | 패턴 `/^[a-z][a-z0-9:_]*$/` | "소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다." |

## 참고사항

- page.tsx가 단순 구조로 HydrationBoundary 없이 직접 클라이언트 컴포넌트 렌더링
- CreateActionDto에 `isSystem: false`를 고정으로 전달

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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/actions/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/actions/new/page.tsx` |
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
| 2026-03-03 | `_client.tsx` 반복 헤더 마크업을 `Page + PageTitleBar`로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
