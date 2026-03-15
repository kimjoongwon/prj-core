# Folder Service 기획서

> 생성일: 2026-03-15
> 타입: service
> 위치: packages/be-service/src/folder.service/index.ts

## 역할

현재 선택된 Space의 폴더 목록 조회와 폴더 생성/수정/삭제를 담당합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할                          |
| ---------------------- | ----------------------------- |
| `FoldersRepository`    | 폴더 조회/생성/수정/삭제 수행 |
| `SpaceContext`         | 현재 요청 Space 식별          |

## 메서드

| 메서드         | 설명                                      |
| -------------- | ----------------------------------------- |
| `getFolders`   | 현재 Space의 폴더 목록과 totalCount 반환  |
| `createFolder` | 현재 Space 아래에 새 폴더를 생성          |
| `updateFolder` | 현재 Space 안에서 폴더명/상위 폴더를 수정 |
| `deleteFolder` | 하위 폴더와 에셋이 없는 폴더를 삭제       |

## 비즈니스 규칙

- `X-Space-ID`가 없으면 요청을 거부합니다.
- 목록은 현재 선택된 Space의 활성 폴더만 조회합니다.
- 폴더 생성 시 `parentFolderId`가 있으면 같은 Space의 활성 폴더인지 검증합니다.
- 폴더 경로(`path`)는 `부모 path + name` 규칙으로 계산하고 중복되면 거부합니다.
- 루트 폴더는 같은 Space의 루트 형제 기준으로, 하위 폴더는 같은 부모 기준으로 다음 `sortOrder`를 부여합니다.
- 공백만 있는 폴더명은 거부합니다.
- 폴더 수정 시 하위 폴더 아래로 재배치하는 순환 구조는 거부하고, 현재 폴더와 하위 폴더의 materialized path를 함께 갱신합니다.
- 폴더 삭제는 하위 폴더나 에셋이 남아 있으면 거부합니다.

## 변경 이력

| 일자       | 내용                                                                                                         | 작성자 |
| ---------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-03-15 | assets 남은 폴더 관리 범위를 위해 `updateFolder`와 `deleteFolder`를 추가하고 path 재작성/삭제 가드를 정의    | codex  |
| 2026-03-15 | assets 폴더 생성 최소 흐름을 위해 parent 검증, path 중복 검사, sortOrder 계산을 포함한 `createFolder`를 추가 | codex  |
| 2026-03-15 | admin assets 폴더 선택 목록 복구를 위한 FolderService 신규 추가                                              | codex  |
