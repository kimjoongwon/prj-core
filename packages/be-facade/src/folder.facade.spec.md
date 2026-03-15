# Folder Facade 기획서

> 생성일: 2026-03-15
> 타입: application-service
> 위치: packages/be-facade/src/folder.facade.ts

## 역할

Folder controller 경계에서 목록 응답과 pagination meta를 조합합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| `FolderService` | 폴더 목록 조회 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| `getFolders` | 폴더 목록과 pagination meta 반환 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 폴더 목록 복구를 위한 FolderFacade 신규 추가 | codex |
