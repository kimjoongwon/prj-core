# Folders Controller 기획서

> 생성일: 2026-03-15
> 타입: controller
> 위치: `apps/core/api/src/module/folders/folders.controller.ts`

## 역할

Folder 목록 조회/생성/수정/삭제 API를 노출하고 controller boundary 조합은 `FolderFacade`에 위임합니다.

## 의존성

| 주입 대상    | 타입         | 설명                      |
| ------------ | ------------ | ------------------------- |
| folderFacade | FolderFacade | Folder 목록 조회 boundary |
| authContext  | AuthContext  | 요청 사용자 식별          |
| spaceContext | SpaceContext | 현재 Space 선택 상태 확인 |

## 엔드포인트

| Method | 경로         | Operation ID   | 설명                           |
| ------ | ------------ | -------------- | ------------------------------ |
| GET    | `/`          | `getFolders`   | 폴더 목록 조회 (`data + meta`) |
| POST   | `/`          | `createFolder` | 현재 Space 기준 폴더 생성      |
| PATCH  | `/:folderId` | `updateFolder` | 현재 Space 기준 폴더 수정      |
| DELETE | `/:folderId` | `deleteFolder` | 현재 Space 기준 폴더 삭제      |

## 비즈니스 메모

- 목록 응답의 메타 계산은 `FolderFacade`가 담당합니다.
- 조회는 `VIEW` 이상 권한을 요구합니다.
- 생성은 `MANAGE` 이상 권한과 선택된 Space, 인증 사용자 컨텍스트를 요구합니다.
- 수정/삭제도 `MANAGE` 이상 권한과 선택된 Space를 요구합니다.

## 변경 이력

| 일자       | 내용                                                                                       | 작성자 |
| ---------- | ------------------------------------------------------------------------------------------ | ------ |
| 2026-03-15 | assets 남은 폴더 관리 범위를 위해 PATCH/DELETE 엔드포인트를 추가                           | codex  |
| 2026-03-15 | assets sidebar 폴더 생성 흐름을 위해 POST `/` 엔드포인트와 Auth/Space 컨텍스트 검증을 추가 | codex  |
| 2026-03-15 | admin assets 폴더 선택 목록 복구를 위한 FoldersController 신규 추가                        | codex  |
