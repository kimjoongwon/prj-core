# Folders Module 기획서

> 생성일: 2026-03-15
> 타입: module
> 위치: apps/core/api/src/module/folders/folders.module.ts

## 역할

`FoldersController`가 `FolderFacade`를 주입받도록 provider를 구성합니다.

## provider 구성

| provider | 설명 |
|----------|------|
| FolderFacade | Folder controller boundary 조합 |
| FolderService | Folder 목록 조회 규칙 |
| FoldersRepository | Folder 영속성 접근 |
| SpaceContext | 현재 요청 Space 제공 |

## exports

| export | 설명 |
|--------|------|
| FolderFacade | 다른 모듈이 참조할 수 있는 Folder boundary 진입점 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 폴더 API 라우트 복구를 위한 FoldersModule 신규 추가 | codex |
