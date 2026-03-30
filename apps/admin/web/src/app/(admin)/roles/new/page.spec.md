# 역할 등록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/new`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌────────────────────────────────────────────────────────────────────┐
│  역할 등록                                      [← 목록으로]       │
│  새로운 역할을 등록합니다.                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ℹ  역할 식별자는 대문자 영문, 숫자, 언더스코어(_)만 사용 가능합니다. │
│     예: MY_ROLE, ADMIN_ROLE_1                                      │
│                                                                    │
│  ┌── 역할 정보 ─────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  역할 식별자 *                                               │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  MY_CUSTOM_ROLE                                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │  대문자로 자동 변환 / 형식: ^[A-Z][A-Z0-9_]*$               │  │
│  │                                                              │  │
│  │  표시명                                                      │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │  나의 커스텀 역할                                        │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  │                                                              │  │
│  │  설명                                                        │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │                                                         │  │  │
│  │  │  이 역할은 ...                                          │  │  │
│  │  │                                                         │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│                         ┌──────────────────────┐                  │
│                         │  💾  역할 등록          │                  │
│                         └──────────────────────┘                  │
└────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 새로운 역할을 등록하기 위해 페이지에 진입한다.
2. 역할 식별자(name), 표시명(displayName), 설명(description)을 입력한다.
3. 역할 식별자는 대문자로 자동 변환되며, `^[A-Z][A-Z0-9_]*$` 패턴을 따라야 한다.
4. "역할 등록" 버튼을 클릭하면 유효성 검사 후 API를 호출한다.
5. 등록 성공 시 역할 목록 페이지(`/roles`)로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="역할 등록", description="새로운 역할을 등록합니다." |
| 헤더 액션 | Button | "목록으로" 버튼, ArrowLeft 아이콘 |
| 안내 메시지 | div (primary) | 역할 식별자 입력 규칙 안내 |
| 입력 폼 | `Section` | name, displayName, description 입력 필드 |
| 제출 영역 | Button | "역할 등록" 버튼, Save 아이콘 |

## 폼 필드 정의

| 필드 | 라벨 | 타입 | 필수 | 유효성 검사 |
|------|------|------|:----:|-------------|
| name | 역할 식별자 | Input | O | 필수, `^[A-Z][A-Z0-9_]*$`, 최대 50자 |
| displayName | 표시명 | Input | X | 최대 50자 |
| description | 설명 | Textarea | X | 최대 200자, minRows=3 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 초기 | 빈 폼 | 입력 필드들 (빈 값) |
| 유효성 오류 | 검증 실패 | isInvalid + errorMessage 표시 |
| 제출 중 | API 호출 중 | 등록 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 폼 제출 | `useCreateRole` (POST /api/v1/roles) | 역할 생성, CreateRoleDto |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles`로 이동 |
| onClickSubmitButton | 유효성 검사 -> createRole 호출 |
| name Input 변경 | 대문자 자동 변환 (value.toUpperCase()) |

## 런타임 책임

- `page.tsx`가 `useCreateRole`, `useRouter`, `useLocalObservable`를 직접 소유합니다.
- `@cocrepo/ui`의 `AdminRolesNewPage`는 props-only pure page로 사용합니다.

## 폼 상태 관리

`useLocalObservable`로 관리하는 `RoleFormState`:
- `name`: string
- `displayName`: string
- `description`: string
- `errors.name`: string
- `errors.displayName`: string

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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/new/page.tsx` |
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
| 2026-03-30 | 역할 등록의 mutation/router/local state를 route page로 이동하고 `@cocrepo/ui` page를 pure contract로 분리 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-page-builder 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더 마크업을 `Page + PageTitleBar`로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
