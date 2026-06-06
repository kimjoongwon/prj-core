# ServiceDocumentListPage

## 목적

모바일과 web 서비스에서 노출할 약관, 개인정보처리방침, 마케팅 동의 등 서비스 문서를 버전 단위로 관리한다.

## Props

| 이름 | 설명 |
|------|------|
| `documents` | 서비스 문서 목록 |
| `totalCount` | 필터 결과 전체 개수 |
| `queryStates`, `setQueryStates` | 검색/필터/페이지네이션 상태 |
| `formMode`, `draft`, `editingDocumentId` | 우측 작성 패널 상태 |
| `onClickSubmitButton` | 초안 생성 또는 초안 수정 저장 |
| `onClickPublishButton` | 선택 문서를 게시하고 기존 게시 문서를 보관 |
| `onClickArchiveButton` | 선택 문서를 보관 |
| `onClickDeleteButton` | 선택 문서를 소프트 삭제 |

## Composition

- `Page`의 `top`에는 `PageTitleBar`를 배치한다.
- 본문은 `PageSurface`로 감싸고, 목록/폼 영역은 각각 `SectionSurface`를 소유한다.
- 좌측에는 검색/필터와 테이블을 배치하고, 우측에는 초안 작성/수정 패널을 배치한다.
- 우측 폼의 본문 입력은 `format=HTML`일 때 CKEditor 기반 `HtmlEditor`를 사용하고, 그 외 형식은 일반 `TextArea`를 사용한다.

## 상태

| 상태 | 렌더링 |
|------|--------|
| loading | 목록 상단에 `Spinner`, 테이블 emptyContent는 로딩 문구 |
| empty | 테이블 emptyContent에 등록 문서 없음 표시 |
| draft | 우측 패널에서 전체 식별자와 본문 입력 가능 |
| edit | 초안 문서의 제목/본문/옵션만 수정 가능, 식별자는 비활성 |
| html draft | HTML 형식 선택 시 WYSIWYG toolbar가 있는 CKEditor 입력면을 표시 |

## 이벤트

| 이벤트 | 결과 |
|--------|------|
| 문서 등록 | 새 초안 폼으로 초기화 |
| 수정 | DRAFT 문서를 폼에 주입 |
| 게시 | 같은 kind/platform/locale의 기존 게시 문서는 backend에서 보관 |
| 보관 | 문서를 ARCHIVED 상태로 전환 |
| 삭제 | 문서를 soft delete |
| 본문 형식 변경 | HTML이면 CKEditor, Markdown/Plain text면 textarea로 전환 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | 초기 생성 | Codex |
| 2026-05-02 | HTML 본문 입력을 CKEditor 기반 에디터로 전환 | Codex |
