# 메시지 템플릿 목록 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/templates`

## 디자인 목업

> 페이지의 전체 UI 레이아웃을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────────┐
│ 페이지 헤더 영역                                    [+ 템플릿 등록]   │
│ 메시지 템플릿                                                     │
│ 시스템에 등록된 메시지 템플릿을 관리합니다.                        │
├─────────────────────────────────────────────────────────────────┤
│ 섹션 영역                                                    │
│  [🔍 이름, 코드 검색...  ] [유형: 전체 ▼] [상태: 전체 ▼]         │
│ ┌──────────┬────────────┬──────────┬──────┬─────────────┬──────┐ │
│ │ 코드     │ 이름       │ 유형     │ 활성 │ 설명        │ 등록일│ │
│ ├──────────┼────────────┼──────────┼──────┼─────────────┼──────┤ │
│ │WELCOME   │ 회원가입   │[EMAIL]   │  ●   │가입 환영 메..│2026..│ │
│ │SMS_VERIFY│ SMS 인증   │[SMS]     │  ●   │-            │2026..│ │
│ │PUSH_NOTI │ 푸시 알림  │[PUSH]    │  ○   │푸시 알림 템..│2026..│ │
│ └──────────┴────────────┴──────────┴──────┴─────────────┴──────┘ │
│  [< 이전]  1 / 3  [다음 >]                                        │
└─────────────────────────────────────────────────────────────────┘
```

## 사용자 시나리오

1. 관리자가 시스템에 등록된 메시지 템플릿 목록을 조회한다
2. 이름/코드로 검색하거나, 유형(EMAIL/SMS/PUSH) 및 활성 상태로 필터링한다
3. 코드 컬럼을 클릭하여 템플릿 상세 페이지로 이동한다
4. 인라인 Switch로 템플릿 활성/비활성 상태를 토글한다
5. "템플릿 등록" 버튼을 클릭하여 등록 페이지로 이동한다

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 래퍼 | `Page` | 페이지 콘텐츠 구조 배치 |
| 페이지 헤더 | `PageTitleBar` | title="메시지 템플릿", description="시스템에 등록된 메시지 템플릿을 관리합니다.", actions에 "템플릿 등록" 버튼 |
| 데이터 그리드 | `Section` > `MetaDataGrid` | 템플릿 목록 표시, 검색/필터/페이지네이션 지원 |

## 컬럼 정의

| 필드 | 라벨 | 크기 | 정렬 | 셀 컴포넌트 |
|------|------|------|------|-------------|
| code | 코드 | 180 | - | 링크 스타일 (클릭 시 상세 이동) |
| name | 이름 | 200 | - | 기본 |
| type | 유형 | 100 | center | `TemplateTypeChipCell` (EMAIL/SMS/PUSH) |
| isActive | 활성 | 80 | center | `TemplateActiveToggleCell` (Switch) |
| description | 설명 | 250 | - | 텍스트 (1줄 제한, "-" 폴백) |
| createdAt | 등록일 | 150 | - | `DateTimeCell` |

## 필터/검색 정의

| 위치 | 타입 | ID | 설명 |
|------|------|-----|------|
| 좌측 | search | search | 이름, 코드로 검색 (debounce 300ms) |
| 좌측 | select | type | 유형 필터 (전체/이메일/SMS/푸시) |
| 좌측 | select | isActive | 상태 필터 (전체/활성/비활성) |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 로딩 | suspense 재조회 중 | `Suspense` fallback에서 MetaDataGrid 로딩 상태 |
| 데이터 표시 | 목록 로드 완료 | 페이지네이션 포함 템플릿 목록 |
| 빈 데이터 | 조회 결과 없음 | "등록된 템플릿이 없습니다." |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 | `useGetTemplatesSuspense({ take, skip, search, type, isActive })` | CSR + Suspense 기반 목록 조회 |
| 토글 시 | `useToggleTemplateStatus({ templateId })` | 활성/비활성 상태 토글 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| 코드 클릭 | `/templates/{templateId}` 상세 페이지로 이동 |
| "템플릿 등록" 버튼 클릭 | `/templates/new` 등록 페이지로 이동 |
| onToggleTemplateStatusSwitch | `toggleTemplateStatus` API 호출 후 목록 캐시 무효화, 성공/실패 토스트 |
| 검색/필터 변경 | URL 쿼리 파라미터 업데이트로 API 재호출 |

## 특이사항

- CSR + Suspense 기본 패턴을 사용하며 `_client.tsx`, `_prefetch.ts` 없이 `page.tsx` 단일 파일로 구성
- 서버 사이드 페이지네이션 사용 (meta.total, meta.skip, meta.take, meta.totalPages)
- nuqs 기반 URL 상태 관리
- 인라인 활성 토글 시 목록 캐시 무효화 (`getGetTemplatesQueryKey`)
- FULL_ACCESS 권한 필요

## 구현 체크리스트

- [x] page.tsx (클라이언트 컴포넌트, `Suspense` + `useGetTemplatesSuspense`)
- [x] `_client.tsx` 없음 (CSR 기본 패턴)
- [x] `_prefetch.ts` 없음 (SSR 예외 아님)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | `templates` 목록을 CSR + Suspense 기본 패턴으로 전환하고 `_client.tsx`, `_prefetch.ts` 계층을 제거 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-03 | 페이지 이벤트 핸들러를 `on[Event][UI]` 규칙에 맞춰 정리 (`onToggleTemplateStatusSwitch`) | codex |
| 2026-03-03 | `_client.tsx` 반복 헤더 제거를 위해 `Page + PageTitleBar + Section` 조합 적용 | codex |
| 2026-03-03 | Page/Section `mode` 제거 반영 (단일 구조 기준으로 문서 표현 정리) | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
