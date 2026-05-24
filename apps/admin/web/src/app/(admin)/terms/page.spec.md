# 약관 관리 페이지

> 경로: `/terms`

## 목적

모바일과 web 서비스에 노출되는 서비스 이용약관, 개인정보처리방침, 마케팅 수신 동의, 위치정보 동의, 제3자 제공 동의 문서를 버전 단위로 관리한다.

## 렌더링

- CSR route page이며 Orval React Query 훅으로 서비스 문서 목록을 조회한다.
- pure screen는 `ServiceDocumentListPage`를 사용한다.
- 목록, 필터, 초안 작성/수정, 게시/보관/삭제를 한 화면에서 처리한다.
- HTML 본문 작성은 CKEditor 기반 WYSIWYG 에디터를 사용하며, Markdown/Plain text 형식은 textarea 입력을 유지한다.

## API

| 동작 | Orval hook |
|------|------------|
| 목록 조회 | `useGetServiceDocuments` |
| 생성 | `useCreateServiceDocument` |
| 수정 | `useUpdateServiceDocument` |
| 게시 | `usePublishServiceDocument` |
| 보관 | `useArchiveServiceDocument` |
| 삭제 | `useDeleteServiceDocument` |

## Query Params

| 이름 | 설명 |
|------|------|
| `take`, `skip` | 페이지네이션 |
| `search` | 제목/요약/버전 검색 |
| `kind` | 문서 종류 |
| `platform` | `ALL`, `WEB`, `MOBILE` |
| `status` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `locale` | 기본 `ko-KR` |

## 이벤트

| 이벤트 | 결과 |
|--------|------|
| `onClickNewButton` | 폼을 새 초안 작성 상태로 초기화 |
| `onClickSubmitButton` | 생성 또는 수정 mutation 실행 후 목록 invalidate |
| `onClickPublishButton` | 선택 문서 게시 mutation 실행 |
| `onClickArchiveButton` | 선택 문서 보관 mutation 실행 |
| `onClickDeleteButton` | 확인 후 삭제 mutation 실행 |

## E2E 관점

- `/terms` 진입 시 목록 조회 API가 호출된다.
- 필터 변경 시 query string과 목록 API params가 동기화된다.
- 필수 입력 누락 시 저장 mutation을 호출하지 않는다.
- HTML 형식 선택 시 CKEditor toolbar와 편집 영역이 렌더링된다.
- 게시 액션 성공 시 목록을 invalidate하고 성공 토스트를 표시한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | 초기 생성 | Codex |
| 2026-05-02 | HTML 본문 편집을 CKEditor 기반으로 변경 | Codex |
