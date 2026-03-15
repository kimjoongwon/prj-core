# _client client 기획서

> 생성일: 2026-03-15
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/assets/_client.tsx

## 역할

브라우저에서만 에셋 목록 API를 호출하고, 폴더 필터/검색/삭제 상호작용을 관리합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | 에셋 목록 페이지 클라이언트 진입점 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/api/assets` | 에셋/폴더 조회 및 삭제 |
| `@cocrepo/ui` | `PageSurface`, `SectionSurface`, `MetaDataGrid` 조합 |
| `@heroui/react` | 버튼/토스트 UI |
| `@tanstack/react-query` | 캐시 무효화 |
| `next/link` | 에셋 상세 이동 |

## 비즈니스 메모

- 선택 Space는 브라우저 PersistStore 기반 `x-space-id` 헤더에 의존하므로 SSR 없이 렌더링합니다.
- 목록 초기/검색 상태는 `useMetaDataGridQueryStates`로 querystring과 동기화합니다.
- 페이지 구조는 `Page + PageTitleBar`를 유지하고 본문 표면만 `PageSurface/SectionSurface`로 표현합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | assets 목록 클라이언트 화면에 `Page + PageTitleBar` 구조는 유지하고 본문에 `PageSurface/SectionSurface`를 적용 | codex |
| 2026-03-15 | SSR invalid URL 회피를 위해 browser-only assets 목록 클라이언트 파일 신규 추가 | codex |
