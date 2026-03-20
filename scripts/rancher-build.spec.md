# rancher-build script 기획서

> 생성일: 2026-03-08
> 타입: script
> 위치: scripts/rancher-build.sh

## 역할

Rancher Desktop 기반 이미지 파이프라인을 수행합니다.
기본적으로 `빌드 → 실행 검증 → 정리`만 수행하고, 필요 시 `PUSH=true`로 푸시를 활성화합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `core-api`, `admin-web`, `proposal-web`, `idp-api`, `idp-web` |
| Dockerfile 매핑 | `devops/Dockerfile.core-api|admin-web|proposal-web|idp-api|idp-web` |
| 이미지 이름 | `core-api`, `admin-web`, `proposal-web`, `idp-api`, `idp-web` |
| 컨테이너 CLI | 실제 `info` 호출이 성공하는 `docker`/`nerdctl`/Rancher Desktop 번들 CLI를 자동 선택하며, `docker`는 필요 시 `~/.rd/docker.sock`로 자동 연결, 수동 지정 시 `CONTAINER_CLI` 우선 |
| 공통 빌드 옵션 | `${CONTAINER_CLI} build` |
| 태그 정책 | `${TAG}`(기본 `local-<timestamp>`) + `latest` + `${CACHE_TAG}`(기본 `buildcache`) |
| 실행 검증 | 컨테이너 실행 후 HTTP probe (`core-api:3006/api-json`, `admin-web:3000/admin/auth/login`, `proposal-web:3011/`, `idp-api:3007/api-json`, `idp-web:3008/auth/login`) |
| 푸시 정책 | 기본적으로 비활성(`PUSH=false`), 필요 시 `PUSH=true`일 때만 실행 검증 후 push (`${TAG}`, `latest`, `${CACHE_TAG}`) |
| 인증 변수 | `REGISTRY_USERNAME/REGISTRY_PASSWORD` 또는 `HARBOR_USERNAME/HARBOR_PASSWORD` |
| 캐시 정책 | `PULL_CACHE=true`로 `${CACHE_TAG}` 사전 pull 시도, 빌드 시 캐시 태그 갱신 |
| 정리 정책 | 임시 검증 컨테이너/오래된 로그 정리, 기본값으로 dangling 이미지 정리 수행 (`PRUNE_DANGLING_IMAGES=true`) |
| 실패 시 정리 | 빌드/검증/푸시 중간 실패여도 EXIT 트랩으로 정리 단계 실행 |
| 로그 | 빌드/실행검증/푸시 로그를 `${LOG_DIR}`에 타깃별 파일로 저장 (`CONTAINER_BUILD_LOG_DIR` 또는 `RANCHER_BUILD_LOG_DIR`) |

## 구현 체크리스트

- [x] `docker` 또는 `nerdctl` 명령어 존재 여부뿐 아니라 실제 데몬 연결 가능 여부(`info`)까지 시작 시 검증함
- [x] 인터랙티브 모드에서 번호 다중 선택을 지원함
- [x] CLI 인자 모드에서 숫자(`1 2`)와 이름(`core-api admin-web`)을 모두 지원함
- [x] 선택된 각 대상에 대해 Dockerfile 존재 여부를 검증함
- [x] 모든 대상을 `${REGISTRY}/${ENV_NAME}/${image}:${TAG}`, `:latest`, `:${CACHE_TAG}`로 빌드함
- [x] 기본 흐름으로 실행 검증을 수행하고 실패 시 즉시 중단함
- [x] `PUSH=true`일 때에만 실행 검증 성공 후 push를 수행함
- [x] dangling 정리 기본값에서도 `latest`/`${CACHE_TAG}` 유지로 재빌드 속도를 보장함
- [x] 빌드/실행검증/푸시 로그를 타깃별 파일로 저장함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | `proposal-web` 이미지를 빌드/실행 검증 대상에 추가하고 포트 `3011` 루트 probe 계약을 정의 | codex |
| 2026-03-09 | `core-api` Docker 런타임 포트 변경에 맞춰 Rancher Desktop 실행 검증 포트를 `80`에서 `3006`으로 조정 | codex |
| 2026-03-08 | Podman 다중 이미지 빌드 스크립트 신규 추가 (인터랙티브/CLI, ENV/TAG/REGISTRY 기본값 지원) | codex |
| 2026-03-08 | macOS 기본 bash(3.2) + `set -u` 환경에서 빈 배열 참조 오류가 없도록 배열 순회 구문 보정 | codex |
| 2026-03-08 | 빌드 로그를 터미널에 실시간 출력하고 타깃별 로그 파일로 저장하도록 개선 (`tee`, 실패 시 로그 경로 안내) | codex |
| 2026-03-08 | Harbor 리포지토리 이름을 `core-api`/`admin-web`로 정렬하고, `plate-*` 입력 별칭 제거 | codex |
| 2026-03-08 | Docker/Jenkins 파일명 규칙을 앱명 기준(`core-api`, `admin-web`)으로 통일하고 타깃 선택/매핑 문구를 동기화 | codex |
| 2026-03-08 | 파이프라인을 `빌드→실행검증→푸시→정리`로 확장하고, `buildcache` 태그/캐시 pull/push 옵션으로 재빌드 속도 개선 | codex |
| 2026-03-08 | 실패 시에도 정리 단계가 실행되도록 EXIT 트랩 정리 플로우 추가 | codex |
| 2026-03-08 | 정리 기본값을 dangling 이미지 정리로 변경하고, push 완료 후 실행 태그 untag로 찌꺼기 누적 완화 | codex |
| 2026-03-08 | OOM/SIGKILL 대응을 위해 `BUILD_MEMORY`, `BUILD_CPUS`를 통한 빌드 자원 옵션 전달 지원 추가 | codex |
| 2026-03-08 | `BUILD_MEMORY`/`BUILD_CPUS` 리소스 옵션 지원을 제거하고 기본 `podman build --format=docker --layers` 고정으로 단순화 | codex |
| 2026-03-08 | 기본 동작을 `빌드→실행검증→정리`로 변경하고, `PUSH=false` 기본값으로 Harbor 푸시를 기본 비활성화 | codex |
| 2026-03-08 | 로컬 이미지 파이프라인을 Rancher Desktop 기준으로 전환하고 `docker`/`nerdctl` 및 Rancher Desktop 번들 CLI 자동 선택 구조로 변경 | codex |
| 2026-03-08 | `docker.sock` 미기동 환경에서도 Rancher Desktop의 실제 연결 가능한 CLI/소켓(`~/.rd/docker.sock`, `nerdctl`)로 자동 폴백하도록 데몬 probe 로직 추가 | codex |
