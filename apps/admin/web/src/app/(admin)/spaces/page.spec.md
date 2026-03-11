# 공간 목록 페이지 기획서

> 생성일: 2026-02-19
> 타입: page
> 경로: `/spaces`
> 파일: `apps/admin/web/src/app/(admin)/spaces/page.tsx`

## 목적

Space aggregate root 목록을 조회하고, 각 Space에 연결된 `ground` 1:1 detail로 진입합니다.

## 주요 기능

| ID | 기능 | 설명 |
|----|------|------|
| F-001 | 공간 목록 조회 | `GET /api/v1/spaces`로 Space + Ground detail 목록 조회 |
| F-002 | 검색 | 시설명/사업자등록번호/주소 기준 클라이언트 필터링 |
| F-003 | 등록 이동 | "공간 등록" 버튼 클릭 시 `/spaces/new` 이동 |
| F-004 | child detail 이동 | 행 클릭 시 `/spaces/[spaceId]/ground` 이동 |

## 화면 구조

```text
Page
└── PageTitleBar (title="공간 목록", actions=[공간 등록])
└── Section
    └── MetaDataGrid
        ├── 검색 입력
        └── 컬럼: 시설명, 라벨, 사업자등록번호, 주소, 전화번호, 이메일, 등록일
```

## API 연동

| 메서드 | 엔드포인트 | Orval 훅 |
|--------|-----------|----------|
| GET | `/api/v1/spaces` | `useGetSpaces()` |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 | req-screen-planner |
| 2026-03-03 | PageTitleBar/Section 패턴 정리 반영 | codex |
| 2026-03-11 | `/grounds` 페이지를 `/spaces` root 기준으로 전환 | codex |
