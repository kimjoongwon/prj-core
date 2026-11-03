# Dockerfile.cover-letter-web 기획서

> 생성일: 2026-11-02
> 타입: dockerfile
> 위치: devops/Dockerfile.cover-letter-web

## 역할

`cover-letter-web` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune` 결과만 대상으로 빌드해 컨텍스트 크기를 줄이고,
`pnpm` 의존성 설치 후 `cover-letter-web` 의존 그래프를 `turbo build`로 빌드해 Vite `dist`를 nginx로 서빙합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| 베이스 이미지 | Node `24.21.0-alpine3.24`와 nginx `1.30.4-alpine3.24` multi-arch manifest를 tag와 digest로 고정 |
| 빌드 도구 | `pnpm 10.34.5`, `turbo 2.9.14` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=cover-letter-web --docker` |
| builder 단계 | `out/json`을 먼저 복사한 뒤 prune된 워크스페이스 기준으로 `pnpm install --frozen-lockfile --prefer-offline` 실행, `out/full` 복원 후 `turbo build --filter=cover-letter-web...`로 Vite 빌드 수행 |
| 러너 단계 | `apps/cover-letter/web/dist`를 nginx document root로 복사하고 전체 nginx 설정 `nginx.cover-letter-web.conf` 사용 |
| 런타임 | nginx `8080`, UID/GID `101`; pid·모든 temp path는 writable한 `/tmp` 아래에 둠 |

## 구현 체크리스트

- [x] `turbo prune --scope=cover-letter-web --docker`로 불필요한 workspace를 제거
- [x] `out/json`을 먼저 복사해 설치 단계에서 `turbo prune` 산출물의 최신 lockfile을 유지
- [x] 저장소의 pnpm-lock.yaml과 설치 결과를 일치시키도록 `pnpm install --frozen-lockfile --prefer-offline` 사용
- [x] `pnpm exec turbo build --filter=cover-letter-web...`로 `cover-letter-web`과 필요한 의존 워크스페이스만 빌드
- [x] Vite 산출물 `apps/cover-letter/web/dist`를 nginx에 복사
- [x] 설치 store는 `/pnpm/store`, Turbo cache는 `/app/.turbo` BuildKit cache mount 사용
- [x] `/cover-letter/`은 index만 제공하고 누락 assets에는 SPA HTML fallback을 사용하지 않음
- [x] read-only root filesystem에서 동작하도록 pid·client/proxy/fastcgi/uwsgi/scgi temp 경로를 `/tmp`로 지정
- [x] nginx 공식 이미지의 entrypoint가 `/etc`를 수정하지 않도록 직접 `nginx -g 'daemon off;'`로 실행
- [x] Node와 nginx 베이스 이미지를 안전 버전과 검증된 multi-arch digest로 고정
- [x] Dependabot의 `/devops` Docker 감시가 `FROM` 리터럴을 인식할 수 있도록 유지
