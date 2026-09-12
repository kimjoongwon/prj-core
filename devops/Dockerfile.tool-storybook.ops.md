# Dockerfile.tool-storybook 기획서

> 생성일: 2026-03-18
> 타입: dockerfile
> 위치: devops/Dockerfile.tool-storybook

## 역할

`tool-storybook` 정적 산출물을 빌드하고, `/storybook` prefix로 서빙하는 nginx 런타임 이미지를 생성합니다.
빌드 단계에서는 `turbo prune` 결과만 사용해 Storybook 의존 그래프만 설치·빌드합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| 베이스 이미지 | `node:24.21.0-alpine3.24`, `nginx:1.30.4-alpine3.24` multi-arch manifest를 각각 tag와 digest로 고정 |
| 빌드 도구 | `pnpm 10.34.5`, `turbo 2.9.14` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=tool-storybook --docker` |
| builder 단계 | prune된 워크스페이스 기준으로 `pnpm install --no-frozen-lockfile --prefer-offline` 후 `nofile` 한계를 상향하고 `type-check:prod`를 먼저 실행한 뒤 `STORYBOOK_DISABLE_CHROMATIC=true` 상태로 `pnpm exec turbo build --filter=tool-storybook...` 실행 |
| runner 단계 | fully qualified `docker.io/library/nginx:1.30.4-alpine3.24@sha256:...` 기반 정적 파일 서빙 |
| 런타임 포트 | `3009` |
| 진입 경로 | `/storybook` 요청을 `/storybook/`으로 정규화하고 정적 산출물을 해당 prefix 아래에서 반환 |

## 구현 체크리스트

- [x] `turbo prune --scope=tool-storybook --docker`로 불필요한 workspace를 제거
- [x] `out/json` 선복사 후 `pnpm install --no-frozen-lockfile`로 prune lockfile 기준 설치를 수행
- [x] `pnpm exec turbo type-check:prod --filter=tool-storybook...`로 배포용 타입 체크를 먼저 수행
- [x] `pnpm exec turbo build --filter=tool-storybook...`로 Storybook 의존 그래프만 빌드
- [x] 정적 산출물 `apps/tool/storybook/storybook-static`를 nginx document root로 복사
- [x] `/storybook` prefix 전용 nginx 라우팅 설정을 포함
- [x] Podman 비대화형 빌드에서도 short-name resolution prompt가 발생하지 않도록 fully qualified base image를 사용
- [x] builder 단계에서 `nofile` 한계를 상향해 Vite/Storybook의 `EMFILE` 실패를 완화
- [x] 배포용 정적 빌드에서는 Chromatic addon을 비활성화해 불필요한 Git 스캔을 제거
- [x] Node와 NGINX 베이스 이미지를 안전 버전과 검증된 multi-arch digest로 고정
- [x] Dependabot의 `/devops` Docker 감시를 위해 `FROM`의 베이스 이미지를 변수 대신 리터럴로 선언
