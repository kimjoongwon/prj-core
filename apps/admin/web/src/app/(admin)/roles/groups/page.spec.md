# 역할 그룹 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/groups`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                                              │
│  역할 그룹 목록                              [+ 그룹 추가]              │
│  역할을 그룹으로 분류하여 관리합니다.                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                           │
│ ┌──────────┬──────────────────────┬──────────────────┬────────────────┐ │
│ │ 그룹명   │ 라벨                 │ 생성일           │ 액션           │ │
│ ├──────────┼──────────────────────┼──────────────────┼────────────────┤ │
│ │ TRUSTED  │ 신뢰 그룹            │ 2026-01-10 09:00 │ [상세]         │ │
│ │ STANDARD │ 일반 그룹            │ 2026-01-10 09:01 │ [상세]         │ │
│ │ PREMIUM  │ 프리미엄 그룹        │ 2026-01-10 09:02 │ [상세]         │ │
│ └──────────┴──────────────────────┴──────────────────┴────────────────┘ │
│  총 3건                                                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 역할 그룹 목록을 조회한다.
2. 각 그룹의 이름, 라벨, 생성일을 테이블 형태로 확인한다.
3. "그룹 추가" 버튼을 클릭하여 등록 페이지로 이동한다.
4. 각 그룹의 "상세" 버튼을 클릭하여 상세 페이지로 이동한다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="역할 그룹 목록", description="역할을 그룹으로 분류하여 관리합니다." |
| 헤더 액션 | Button (Link) | "그룹 추가" 버튼, `/roles/groups/new`로 이동, Plus 아이콘 |
| 그룹 테이블 | `Section` > table | 컬럼: 그룹명, 라벨, 생성일, 액션 |
| 테이블 푸터 | div | 총 N건 표시 |

## 테이블 컬럼 정의

| 필드 | 라벨 | 크기 | 셀 렌더링 |
|------|------|------|-----------|
| name | 그룹명 | 200px | font-mono |
| label | 라벨 | 200px | text-default-600, 없으면 "-" |
| createdAt | 생성일 | 150px | DateTimeCell |
| (액션) | 액션 | 100px, center | "상세" Button (Link) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | API 호출 중 | "로딩 중..." 텍스트 |
| 빈 목록 | groups.length === 0 | Layers 아이콘 + "등록된 역할 그룹이 없습니다." |
| 데이터 표시 | 그룹 목록 존재 | 테이블 + 총 건수 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useQuery (getGroups)` | 그룹 목록 조회 (GET /api/v1/groups?type=Role), 임시 customInstance 사용 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| "그룹 추가" 버튼 클릭 | `/roles/groups/new`로 Link 이동 |
| "상세" 버튼 클릭 | `/roles/groups/${group.id}`로 Link 이동 |

## 비고

- SSR Prefetch 미적용 (TODO: Orval codegen 후 추가 예정)
- `type: "Role"` 쿼리 파라미터로 역할 그룹만 필터링

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, prefetch 미적용)
- [x] _client.tsx (클라이언트 컴포넌트, observer)
- [ ] Orval codegen 후 useGetGroups 훅 교체


## Surface / Elevation

| 항목 | 결정 |
|------|------|
| PageSurface owner | `apps/admin/web/src/app/(admin)/roles/groups/_client.tsx` |
|------|------|
| PageSurface 역할 | 페이지 헤더 아래 본문 전체를 raised surface로 묶습니다. |
| SectionSurface 대상 | 본문 섹션, 폼, 표, 로딩/빈 상태 블록 |
| SectionSurface padding | DataGrid/테이블은 필요 시 `padding="none"`, 그 외 기본 패딩 |
| 예외 | 없음. `Layout`/`Page`/`Section` 슬롯 배치만으로는 surface가 생기지 않으므로 page 또는 `_client.tsx`가 owner를 명시합니다. |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface ownership과 elevation 결정을 문서화 | codex |
| 2026-03-15 | Surface ownership/elevation 규칙과 PageSurface/SectionSurface 적용 기준을 문서화 | codex |
| 2026-03-15 | Surface owner와 elevation 규칙을 문서화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더 마크업을 `Page + PageTitleBar`로 정리 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
