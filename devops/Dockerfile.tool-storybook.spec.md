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
| 베이스 이미지 | `docker.io/library/node:24-alpine`, `docker.io/library/nginx:1.27-alpine` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=tool-storybook --docker` |
| builder 단계 | prune된 워크스페이스 기준으로 `pnpm install --no-frozen-lockfile --prefer-offline` 후 `pnpm exec turbo build --filter=tool-storybook...` 실행 |
| runner 단계 | fully qualified `docker.io/library/nginx:1.27-alpine` 기반 정적 파일 서빙 |
| 런타임 포트 | `3009` |
| 진입 경로 | `/storybook` 요청을 `/storybook/`으로 정규화하고 정적 산출물을 해당 prefix 아래에서 반환 |

## 구현 체크리스트

- [x] `turbo prune --scope=tool-storybook --docker`로 불필요한 workspace를 제거
- [x] `out/json` 선복사 후 `pnpm install --no-frozen-lockfile`로 prune lockfile 기준 설치를 수행
- [x] `pnpm exec turbo build --filter=tool-storybook...`로 Storybook 의존 그래프만 빌드
- [x] 정적 산출물 `apps/tool/storybook/storybook-static`를 nginx document root로 복사
- [x] `/storybook` prefix 전용 nginx 라우팅 설정을 포함
- [x] Podman 비대화형 빌드에서도 short-name resolution prompt가 발생하지 않도록 fully qualified base image를 사용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-18 | Podman의 short-name resolution 오류를 피하기 위해 Node/Nginx 베이스 이미지를 fully qualified reference로 명시 | codex |
| 2026-03-18 | Storybook 정적 빌드 산출물을 `/storybook` 하위 경로로 서빙하는 전용 Dockerfile 신규 추가 | codex |
