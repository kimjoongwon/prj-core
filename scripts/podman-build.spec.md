# podman-build script 기획서

> 생성일: 2026-03-08
> 타입: script
> 위치: scripts/podman-build.sh

## 역할

Podman으로 선택한 서비스 이미지를 빌드합니다.
대화형 선택과 CLI 인자 입력(숫자/이름)을 모두 지원합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `core-api`, `admin-web`, `idp-api`, `idp-web` |
| Dockerfile 매핑 | `devops/Dockerfile.core-api|admin-web|idp-api|idp-web` |
| 이미지 이름 | `core-api`, `admin-web`, `idp-api`, `idp-web` |
| 공통 빌드 옵션 | `podman build --format=docker --layers` |
| 태그 정책 | `${TAG}`(기본 `local-<timestamp>`) + `latest` 동시 태깅 |
| 레지스트리/환경 | `REGISTRY` 기본 `harbor.cocdev.co.kr`, `ENV_NAME` 기본 `stg` |
| 빌드 로그 | 실행 중 터미널에 실시간 출력 + `${LOG_DIR}`에 타깃별 로그 파일 저장 |

## 구현 체크리스트

- [ ] `podman` 명령어 존재 여부를 시작 시 검증함
- [ ] 인터랙티브 모드에서 번호 다중 선택을 지원함
- [ ] CLI 인자 모드에서 숫자(`1 2`)와 이름(`core-api admin-web`)을 모두 지원함
- [ ] 선택된 각 대상에 대해 Dockerfile 존재 여부를 검증함
- [ ] 모든 대상을 `${REGISTRY}/${ENV_NAME}/${image}:${TAG}`와 `:latest`로 빌드함
- [ ] 각 타깃 빌드 로그를 실시간 출력하고 파일로 저장함 (`LOG_DIR`/`PODMAN_BUILD_LOG_DIR`)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | Podman 다중 이미지 빌드 스크립트 신규 추가 (인터랙티브/CLI, ENV/TAG/REGISTRY 기본값 지원) | codex |
| 2026-03-08 | macOS 기본 bash(3.2) + `set -u` 환경에서 빈 배열 참조 오류가 없도록 배열 순회 구문 보정 | codex |
| 2026-03-08 | 빌드 로그를 터미널에 실시간 출력하고 타깃별 로그 파일로 저장하도록 개선 (`tee`, 실패 시 로그 경로 안내) | codex |
| 2026-03-08 | Harbor 리포지토리 이름을 `core-api`/`admin-web`로 정렬하고, `plate-*` 입력 별칭 제거 | codex |
| 2026-03-08 | Docker/Jenkins 파일명 규칙을 앱명 기준(`core-api`, `admin-web`)으로 통일하고 타깃 선택/매핑 문구를 동기화 | codex |
