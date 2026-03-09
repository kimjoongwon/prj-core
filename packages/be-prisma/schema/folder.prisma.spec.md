# folder.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/folder.prisma

## 역할

에셋 저장 폴더 트리(Folder)와 자기참조(parent/children) 구조를 정의합니다.

## 운영 규칙

- `folder.prisma` 변경 시 `folder.prisma.spec.md`를 함께 갱신합니다.
- 경로(path) 유일성과 트리 참조(parentFolderId) 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 asset.prisma에서 Folder 도메인 분리 | codex |

