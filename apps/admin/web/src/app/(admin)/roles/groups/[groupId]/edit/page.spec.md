# 역할 그룹 수정 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/groups/[groupId]/edit`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  역할 그룹 수정                              [← 상세로 돌아가기]         │
│  TRUSTED                                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                           │
│                                                                          │
│  그룹명 *                                                                │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ TRUSTED                                          (대문자 자동변환) │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  라벨                                                                    │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ 신뢰 그룹                                                          │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│                                                    [취소]  [💾 저장]    │
└─────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 기존 역할 그룹의 정보를 수정하기 위해 페이지에 진입한다.
2. 기존 데이터가 로드되어 폼에 미리 채워진다.
3. 그룹명(name)과 라벨(label)을 수정할 수 있다.
4. 그룹명은 대문자로 자동 변환된다.
5. "저장" 버튼 클릭 시 유효성 검사 후 PATCH API를 호출한다.
6. 수정 성공 시 그룹 상세 페이지(`/roles/groups/${groupId}`)로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | 페이지 헤더 영역 | title="역할 그룹 수정", description 동적 |
| 헤더 액션 | Button | "상세로 돌아가기" 버튼, ArrowLeft 아이콘 |
| 입력 폼 | 섹션 영역 | name, label 입력 필드 |
| 하단 버튼 | Button x2 | "취소", "저장" |

## 폼 필드 정의

| 필드 | 라벨 | 타입 | 필수 | 유효성 검사 |
|------|------|------|:----:|-------------|
| name | 그룹명 | Input | O | 필수, 최대 50자 |
| label | 라벨 | Input | X | 최대 100자 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 데이터 없음 | group이 null | "그룹을 찾을 수 없습니다." + 목록으로 버튼 |
| 편집 가능 | 정상 조회 | 폼 필드 표시 (기존 데이터 prefill) |
| 유효성 오류 | 검증 실패 | isInvalid + errorMessage 표시 |
| 제출 중 | PATCH 호출 중 | 저장 버튼 isLoading |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useQuery (GET /api/v1/groups/${groupId})` | 그룹 상세 조회, 임시 customInstance 사용 |
| 폼 제출 | `useMutation (PATCH /api/v1/groups/${groupId})` | 그룹 수정, 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/groups/${groupId}`로 이동 |
| onClickListButton | `/roles/groups`로 이동 |
| onClickSubmitButton | 유효성 검사 -> updateGroup 호출 |
| name Input 변경 | 대문자 자동 변환 (value.toUpperCase()) |

## 폼 상태 관리

`useLocalObservable`로 관리하는 `GroupEditFormState`:
- `name`: string
- `label`: string
- `errors.name`: string
- `isInitialized`: boolean (useEffect로 초기값 설정, 한 번만)

## 비고

- SSR Prefetch 미적용 (TODO: Orval codegen 후 추가 예정)
- 수정 성공 시 해당 그룹 쿼리 캐시 무효화

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, observer 래핑, 단일 CSR)
- [ ] Orval codegen 후 useGetGroupById, useUpdateGroup 훅 교체


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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/roles/groups/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/roles/groups/[groupId]/edit/page.tsx` |
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
| 2026-03-03 | `_client.tsx`를 `Page + PageTitleBar` 기반으로 리팩터링 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
