# Subject 상세 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/subjects/[subjectId]`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                        [목록으로 ←]  │
│ Subject 상세                                                      │
│ Subject의 상세 정보를 조회합니다.                                  │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역  기본 정보                                         │
│                                                                   │
│  식별자                     표시명                                 │
│  User                       사용자                                │
│                                                                   │
│  아이콘                     분류                                   │
│  -                          [entity]                              │
│                                                                   │
│  정렬 순서                  시스템                                 │
│  1                          ●                                     │
│                                                                   │
│  생성일                     수정일                                 │
│  2026-01-01 09:00           2026-01-10 14:30                     │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역  필드 목록   (entity 그룹일 때만 표시)             │
│                                                                   │
│ ┌─────────────┬──────────────┬──────────┬──────┬──────┐          │
│ │ 필드명      │ 표시명       │ 타입     │ 필수 │ 관계 │          │
│ ├─────────────┼──────────────┼──────────┼──────┼──────┤          │
│ │ id          │ ID           │ String   │  ●   │  ○   │          │
│ │ name        │ 이름         │ String   │  ●   │  ○   │          │
│ │ roles       │ 역할 목록    │ Role[]   │  ○   │  ●   │          │
│ │ createdAt   │ 생성일       │ DateTime │  ●   │  ○   │          │
│ └─────────────┴──────────────┴──────────┴──────┴──────┘          │
│                                                                   │
│  ※ entity 그룹이 아닌 경우:                                       │
│  "이 Subject는 Entity 기반이 아니므로 필드 정보가 없습니다."       │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 Subject 목록에서 특정 Subject를 클릭하여 상세 정보를 조회한다
2. 기본 정보(식별자, 표시명, 아이콘, 분류, 정렬 순서, 시스템 여부, 생성일, 수정일)를 확인한다
3. entity 그룹 Subject인 경우 DMMF 기반 필드 목록(필드명, 표시명, 타입, 필수, 관계)을 확인한다
4. 목록으로 버튼을 클릭하여 Subject 목록 페이지로 돌아간다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | `페이지 헤더 영역` | title="Subject 상세", description="Subject의 상세 정보를 조회합니다.", actions에 "목록으로" 버튼 |
| 기본 정보 | `섹션 영역` (title="기본 정보") | 2컬럼 Grid 레이아웃으로 Subject 속성 표시 |
| 필드 목록 | `섹션 영역` (title="필드 목록") | entity 그룹만 Table 표시, 비entity는 안내 메시지 |

## 기본 정보 표시 필드

| 필드 | 라벨 | 표시 방식 |
|------|------|----------|
| name | 식별자 | 텍스트 |
| displayName | 표시명 | `DefaultCell` ("-" 폴백) |
| icon | 아이콘 | `DefaultCell` ("-" 폴백) |
| group | 분류 | `Chip` (그룹별 색상) |
| order | 정렬 순서 | 숫자 |
| isSystem | 시스템 | `BooleanCell` |
| createdAt | 생성일 | `DateTimeCell` |
| updatedAt | 수정일 | `DateTimeCell` |

## 필드 목록 테이블 (entity 그룹 전용)

| 컬럼 | 설명 |
|------|------|
| 필드명 | field.name |
| 표시명 | field.displayName ("-" 폴백) |
| 타입 | field.type (code 스타일) |
| 필수 | field.isRequired (`BooleanCell`) |
| 관계 | field.isRelation (`BooleanCell`) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | Subject 상세 조회 중 | `Spinner` (size="lg") |
| 데이터 없음 | Subject를 찾을 수 없음 | 안내 메시지 + "목록으로" 버튼 |
| 데이터 표시 | Subject 정보 + 필드 목록 표시 | 기본 정보 + 필드 테이블 |
| 필드 로딩 | entity 그룹 필드 조회 중 | 필드 섹션 내 `Spinner` |
| 비entity | entity 그룹이 아닌 Subject | "이 Subject는 Entity 기반이 아니므로 필드 정보가 없습니다." |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| SSR 프리페칭 | `prefetchGetSubjectByIdQuery(subjectId)` | Subject 상세 프리페칭 |
| 클라이언트 | `useGetSubjectById(subjectId)` | Subject 상세 조회 |
| 클라이언트 (조건부) | `getSubjectFields(subjectId)` | entity 그룹일 때만 필드 목록 조회 (useQuery + enabled) |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "목록으로" 버튼 클릭 | `/subjects` 페이지로 이동 |

## 특이사항

- Subject 필드 조회는 `group === "entity"` 조건에서만 `enabled: true`로 실행
- 필드 조회는 Orval 생성 훅이 아닌 `getSubjectFields` 함수를 `useQuery`에 직접 구성하여 사용
- Subject는 조회 전용 (수정/삭제 기능 없음)
- sidecar E2E는 브라우저 현재 origin 대신 admin APIRequestContext로 Subject 목록을 조회해 대상 ID를 선택한다

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
| 참조 layout spec | `apps/admin/web/src/app/(admin)/subjects/layout.spec.md` |
| consumed slot key | `children` |
| 콘텐츠 파일 | `apps/admin/web/src/app/(admin)/subjects/[subjectId]/page.tsx` |
| page가 소유하지 않는 skeleton | `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` |

- `page.tsx`는 Subject 상세 조회, entity 필드 조회, 라우팅만 담당하고 시각 조합은 `SubjectDetailPage`가 소유합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `detail`
- reusable target: `detail/view`
- screen component path: `packages/fe-ui/src/screen/SubjectDetailPage/SubjectDetailPage.tsx`
- SSR/prefetch 예외 승인 여부: 없음
- 추가 예외 파일: 없음 (`_client.tsx`, `_prefetch.ts` 미사용)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure screen naming sweep에 맞춰 pure screen 경로와 component 명 계약을 semantic 이름 기준으로 갱신 | codex |
| 2026-03-29 | `SubjectDetailPage` pure screen와 thin route container 구조로 전환하고 screen component path를 반영 | codex |
| 2026-03-21 | page.tsx 단일 CSR 계약과 현재 surface/rendering decision 기준으로 stale 예외 문구를 정리 | codex |
| 2026-03-21 | fe-route-agent 계약에 맞춰 consumed layout / rendering decision 섹션을 보강 | codex |
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-03-14 | sidecar E2E seed Subject 조회를 admin APIRequestContext 기준으로 고정 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | PageTitleBar(level=1/2) 패턴 정리 반영 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
