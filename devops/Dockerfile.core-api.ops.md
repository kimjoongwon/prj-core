# Dockerfile.core-api 기획서

> 생성일: 2026-03-08
> 타입: dockerfile
> 위치: devops/Dockerfile.core-api

## 역할

`core-api` 이미지를 빌드하는 멀티스테이지 Dockerfile입니다.
`turbo prune --scope=core-api --docker` 결과를 기반으로 관련 워크스페이스를 빌드하고,
최종 런타임에서는 Node API 프로세스를 단일 프로세스로 실행합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 구성 | `base -> setup -> builder -> runner` |
| setup 단계 | `COPY . .` 후 `turbo prune --scope=core-api --docker` |
| builder 단계 | `out/json`을 먼저 복사해 install 실행 후 `out/full`을 덮어쓴 뒤 로컬 `turbo`로 `type-check:prod` 후 `build` 수행 |
| 런타임 프로세스 | Node가 `apps/core/api/dist/main`을 직접 실행 |
| 노출 포트 | `3006` |

## 구현 체크리스트

- [x] `core-api` 대상 prune 결과만 사용
- [x] `out/json`을 먼저 복사해 lockfile/의존성 설치의 기준점을 고정
- [x] `pnpm exec turbo type-check:prod --filter=core-api... --concurrency=1`로 배포용 타입 체크를 먼저 수행
- [x] 빌드 단계에서 Turbo를 통해 관련 워크스페이스를 함께 빌드
- [x] Podman/CI 환경에서 메모리 피크를 낮추기 위해 `turbo build --concurrency=1` 적용
- [x] 런타임에서 Node 단일 프로세스 실행 구조 유지
