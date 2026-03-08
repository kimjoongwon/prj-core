# Dockerfile.core-api 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.core-api

## 역할

`core-api` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune --scope=core-api --docker` 결과를 기반으로 관련 워크스페이스를 빌드하고,
최종 런타임에서는 supervisor로 nginx와 API 프로세스를 함께 실행합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> dev` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=core-api --docker` |
| builder 단계 | `out/json`을 먼저 복사해 install 실행 후 `out/full`을 덮어써 빌드 수행 |
| 런타임 프로세스 | `supervisord`가 nginx와 Node 앱 프로세스를 함께 관리 |
| 노출 포트 | `80`, `3006` |

## 구현 체크리스트

- [x] `core-api` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 lockfile/의존성 설치의 기준점을 고정
- [x] 빌드 단계에서 Turbo를 통해 관련 워크스페이스를 함께 빌드
- [x] Podman/CI 환경에서 메모리 피크를 낮추기 위해 `turbo build --concurrency=1` 적용
- [x] 런타임에서 nginx + API 동시 실행 구조 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | `devops/Dockerfile.core-api`의 `turbo build`에 `--concurrency=1`을 적용해 컨테이너 빌드 메모리 사용량을 낮춤 | codex |
| 2026-03-08 | `core-api` 빌드에서 `out/json` 복사 → `pnpm install` → `out/full` 복사로 정렬해 lockfile 덮어쓰기/일치성 이슈를 방지 | codex |
