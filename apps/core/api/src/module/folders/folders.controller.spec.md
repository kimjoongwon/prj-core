# Folders Controller 기획서

> 생성일: 2026-03-15
> 타입: controller
> 위치: `apps/core/api/src/module/folders/folders.controller.ts`

## 역할

Folder 목록 조회 API를 노출하고 controller boundary 조합은 `FolderFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| folderFacade | FolderFacade | Folder 목록 조회 boundary |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getFolders` | 폴더 목록 조회 (`data + meta`) |

## 비즈니스 메모

- 목록 응답의 메타 계산은 `FolderFacade`가 담당합니다.
- 조회는 `VIEW` 이상 권한을 요구합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 폴더 선택 목록 복구를 위한 FoldersController 신규 추가 | codex |
