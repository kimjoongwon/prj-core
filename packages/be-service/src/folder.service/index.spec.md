# Folder Service 기획서

> 생성일: 2026-03-15
> 타입: service
> 위치: packages/be-service/src/folder.service/index.ts

## 역할

현재 선택된 Space의 폴더 목록 조회를 담당합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `FoldersRepository` | 폴더 목록 조회 |
| `SpaceContext` | 현재 요청 Space 식별 |

## 메서드

| 메서드 | 설명 |
|--------|------|
| `getFolders` | 현재 Space의 폴더 목록과 totalCount 반환 |

## 비즈니스 규칙

- `X-Space-ID`가 없으면 요청을 거부합니다.
- 목록은 현재 선택된 Space의 활성 폴더만 조회합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 폴더 선택 목록 복구를 위한 FolderService 신규 추가 | codex |
