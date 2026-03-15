# \_client client 기획서

> 생성일: 2026-03-15
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/assets/\_client.tsx

## 역할

브라우저에서만 에셋 목록 API를 호출하고, 좌측 FolderTree와 우측 목록 그리드를 결합해 폴더 탐색/검색/에셋 업로드/에셋 삭제/폴더 생성·이름 변경·삭제 상호작용을 관리합니다.

## 공개 계약

| 항목           | 설명                               |
| -------------- | ---------------------------------- |
| default export | 에셋 목록 페이지 클라이언트 진입점 |

## 의존성

| 모듈                    | 용도                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| `@cocrepo/api/assets`   | 에셋/폴더 조회, 에셋 업로드·삭제, 폴더 생성·수정·삭제              |
| `@cocrepo/ui`           | `PageSurface`, `SectionSurface`, `FolderTree`, `MetaDataGrid` 조합 |
| `@heroui/react`         | 버튼/토스트와 폴더 생성·이름 변경·삭제 modal UI                    |
| `@tanstack/react-query` | 캐시 무효화                                                        |
| `next/link`             | 에셋 상세 이동                                                     |

## 비즈니스 메모

- 선택 Space는 브라우저 PersistStore 기반 `x-space-id` 헤더에 의존하므로 SSR 없이 렌더링합니다.
- 목록 초기/검색 상태와 선택 폴더는 `useMetaDataGridQueryStates`로 querystring과 동기화합니다.
- 페이지 구조는 `Page + PageTitleBar`를 유지하고 본문 표면만 `PageSurface/SectionSurface`로 표현합니다.
- `FolderTree` 헤더의 `폴더 생성` 버튼은 현재 선택 폴더를 부모로 삼는 local modal을 열고, 성공 시 새 폴더를 현재 선택 상태로 전환합니다.
- `FolderTree` 헤더의 `이름 변경/삭제` 버튼은 현재 선택 폴더 기준 modal을 열고, 성공 시 folder query cache를 무효화합니다.
- 상단 `업로드` 버튼은 선택 폴더가 있을 때만 hidden file input을 열고 multipart `POST /api/v1/assets`를 호출합니다.

## Surface ownership

- 이 파일은 `Page` boundary 안에서 assets 목록 본문 surface owner를 직접 소유합니다.
- `PageSurface`는 좌측 `FolderTree`와 우측 `MetaDataGrid`를 하나의 raised 본문으로 묶습니다.
- `SectionSurface`는 폴더 탐색/목록 브라우저 블록을 elevated 레이어로 감싸고 내부 `MetaDataGrid`는 `padding="none"`으로 붙입니다.

## 변경 이력

| 일자       | 내용                                                                                                                      | 작성자 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2026-03-15 | assets 남은 범위를 마감하며 폴더 이름 변경/삭제 modal과 선택 폴더 기준 에셋 업로드 흐름을 `_client.tsx`에 반영            | codex  |
| 2026-03-15 | FolderTree 헤더 버튼과 local modal state를 연결해 현재 선택 위치 기준 폴더 생성 흐름을 추가                               | codex  |
| 2026-03-15 | assets 목록 클라이언트 spec에 `PageSurface`/`SectionSurface` ownership을 명시                                             | codex  |
| 2026-03-15 | assets 목록을 좌측 `FolderTree` + 우측 `MetaDataGrid` 구조로 정리하고 `folderId`를 트리 선택 기반 querystring 상태로 유지 | codex  |
| 2026-03-15 | assets 목록 클라이언트 화면에 `Page + PageTitleBar` 구조는 유지하고 본문에 `PageSurface/SectionSurface`를 적용            | codex  |
| 2026-03-15 | SSR invalid URL 회피를 위해 browser-only assets 목록 클라이언트 파일 신규 추가                                            | codex  |
