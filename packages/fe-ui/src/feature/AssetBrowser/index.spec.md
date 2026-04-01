# AssetBrowser Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-04-01
> 타입: feature
> 위치: packages/fe-ui/src/feature/AssetBrowser/

## 역할

`AssetBrowser`는 에셋/폴더 관리 흐름의 공통 feature입니다.
`/assets`에서는 inline 관리 화면으로, task 등록/수정에서는 modal picker로 같은 UI와 CRUD 동작을 재사용합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `assetBrowserQueryInputs` | route query state가 공유하는 검색/필터/folder 입력 정의 |
| `AssetBrowserAsset` | feature가 소비하는 에셋 row 계약 |
| `AssetBrowserProps` | inline/modal, manage/picker 공통 props 계약 |
| `AssetBrowser` | 공개 feature 엔트리 |

## 동작 규칙

- `mode="manage"`: `/assets`와 같이 파일명 링크 + 삭제 중심 목록을 렌더링합니다.
- `mode="picker"`: task 폼 modal에서 선택/삭제를 함께 제공하고, type/status 필터 UI는 숨깁니다.
- `presentation="inline"`: page 본문에 직접 마운트합니다.
- `presentation="modal"`: modal 안에서 동일한 폴더 트리, 업로드, 폴더 CRUD, 목록 grid를 재사용합니다.
- Space 미선택, hydrate 전 fallback, 빈 상태 메시지는 feature 내부에서 공통 처리합니다.

## 의존성

| 모듈 | 용도 |
|------|------|
| `columns/master/adminColumns` | asset 목록 컬럼 조합 |
| `master/table/MetaDataGrid` | 검색/필터/페이지네이션 grid |
| `widget/FolderTree` | 폴더 트리 및 폴더 액션 버튼 |
| `surface/Surface` | 브라우저 본문 wrapper |
| `@heroui/react` | modal, input, button |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-01 | `/assets` CRUD와 task 등록/수정의 picker modal을 하나의 공통 feature로 구현 | codex |
| 2026-02-22 | 초기 생성 | req-feature-planner |
