# Folder Facade 기획서

> 생성일: 2026-03-15
> 타입: application-service
> 위치: packages/be-facade/src/folder.facade.ts

## 역할

Folder controller 경계에서 목록 응답 meta 조합과 폴더 CRUD 위임을 담당합니다.

## 의존성

| 의존성          | 역할                     |
| --------------- | ------------------------ |
| `FolderService` | 폴더 목록 조회/CRUD 수행 |

## 공개 메서드

| 메서드         | 설명                             |
| -------------- | -------------------------------- |
| `getFolders`   | 폴더 목록과 pagination meta 반환 |
| `createFolder` | 폴더 생성 요청을 Service에 위임  |
| `updateFolder` | 폴더 수정 요청을 Service에 위임  |
| `deleteFolder` | 폴더 삭제 요청을 Service에 위임  |

## 변경 이력

| 일자       | 내용                                                                               | 작성자 |
| ---------- | ---------------------------------------------------------------------------------- | ------ |
| 2026-03-15 | assets 남은 폴더 관리 범위를 위해 `updateFolder`/`deleteFolder` 위임 메서드를 추가 | codex  |
| 2026-03-15 | assets 페이지 폴더 생성 연결을 위해 `createFolder` 위임 메서드를 추가              | codex  |
| 2026-03-15 | admin assets 폴더 목록 복구를 위한 FolderFacade 신규 추가                          | codex  |
