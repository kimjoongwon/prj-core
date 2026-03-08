# next.config.ts 기획서

> 생성일: 2026-03-09
> 타입: config
> 위치: apps/idp/web/next.config.ts

## 역할

`idp-web`의 Next.js 빌드/런타임 계약을 정의합니다.
standalone 출력, 모노레포 Turbopack 루트, workspace 패키지 트랜스파일, API rewrite 규칙을 고정합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `output` | Docker 런타임용 `standalone` 출력 사용 |
| `turbopack.root` | 모노레포 루트(`../../..`) 기준으로 workspace 해석 |
| `transpilePackages` | `@cocrepo/api`, `@cocrepo/constant`, `@cocrepo/hook`, `@cocrepo/store`, `@cocrepo/ui`, `@cocrepo/toolkit`, `@cocrepo/type` 포함 |
| `rewrites()` | `/api/interaction`, `/api/forgot-password`, `/api/password-policy`, `/api/reset-password`, `/api/v1`를 IDP API 내부 URL로 프록시 |

## 구현 체크리스트

- [x] `standalone` 출력 유지
- [x] 모노레포 Turbopack 루트 유지
- [x] workspace 패키지 트랜스파일 목록 유지
- [x] 빌드 에러 무시용 환경 토글 제거

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | Docker 전용 `NEXT_IGNORE_BUILD_ERRORS`/`experimental.cpus` 토글을 제거하고 기본 Next 빌드 계약만 유지하도록 정리 | codex |
