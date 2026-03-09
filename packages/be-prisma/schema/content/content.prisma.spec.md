# content.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/content/content.prisma

## 역할

Content/Post와 TextTypes enum을 관리하는 콘텐츠 도메인 스키마를 정의합니다.

## 운영 규칙

- `content.prisma` 변경 시 `content.prisma.spec.md`를 함께 갱신합니다.
- 콘텐츠 발행 단위(Post)와 본문(Content)은 1:1 관계를 유지합니다(`Post.contentId @unique`, `Content.post`).
- 파일 대표 모델은 `Content`이며 `@schema-owner: true`는 `Content`에만, `@aggregate-root: true`도 `Content`에만 부여합니다.
- 모델 주석 메타데이터는 `@schema-owner: true`, 필요 시 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 파일 대표 모델과 실제 aggregate root를 `@schema-owner: true` / `@aggregate-root: true`로 분리 | codex |
| 2026-03-10 | `content.prisma`의 aggregate root marker를 `Post`에서 `Content`로 바로잡음 | codex |
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | strict aggregate-root 분할 적용으로 core.prisma에서 content 도메인 분리 | codex |
| 2026-03-09 | Post-Content 카디널리티를 1:1로 고정(`contentId @unique`, 역방향 `post` 단수화) | codex |
