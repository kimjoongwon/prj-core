# album.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/album.prisma

## 역할

Album/AlbumEntry를 통해 사용자 정의 에셋 컬렉션을 관리합니다.

## 운영 규칙

- `album.prisma` 변경 시 `album.prisma.spec.md`를 함께 갱신합니다.
- Album-Asset 연결(AlbumEntry) 유일성 및 정렬 규칙을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 asset.prisma에서 Album 도메인 분리 | codex |

