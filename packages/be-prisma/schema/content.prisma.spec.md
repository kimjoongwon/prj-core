# content.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/content.prisma

## 역할

Content/Post와 TextTypes enum을 관리하는 콘텐츠 도메인 스키마를 정의합니다.

## 운영 규칙

- `content.prisma` 변경 시 `content.prisma.spec.md`를 함께 갱신합니다.
- 콘텐츠 발행 단위(Post)와 본문(Content)은 1:1 관계를 유지합니다(`Post.contentId @unique`, `Content.post`).

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 core.prisma에서 content 도메인 분리 | codex |
| 2026-03-09 | Post-Content 카디널리티를 1:1로 고정(`contentId @unique`, 역방향 `post` 단수화) | codex |
