# Jenkinsfile.tool-storybook 기획서

> 생성일: 2026-03-18  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.tool-storybook

## 역할

`tool-storybook` 이미지를 빌드하고 Harbor production 저장소에 푸시합니다.  
빌드 성공 후에는 GitOps 반영 Job을 비동기로 트리거해 `prj-devops`의 prod 태그를 갱신합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `tool-storybook` |
| 이미지 경로 | `HARBOR_REGISTRY/prod/tool-storybook` |
| 브랜치 정책 | `main` 브랜치만 허용, 그 외 브랜치는 즉시 실패 |
| Podman 실행 이미지 | `quay.io/podman/stable:v5.8.4` multi-arch manifest를 digest로 고정 |
| pull 정책 | agent 시작 시 `alwaysPullImage: true`, 이미지 빌드 시 `podman build --pull=always` |
| 격리 경계 | 동적 Jenkins agent Pod와 build별 PVC 하위 Podman storage/workspace 경로 사용 |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| 빌드 인자 | `STORYBOOK_DISABLE_CHROMATIC`, `STORYBOOK_BUILD_NOFILE` |
| 빌드 리밋 | `podman build --ulimit nofile=<value>:<value>`로 RUN 컨테이너의 파일 디스크립터 한계를 상향 |
| 워크스페이스 위치 | `ws(/var/lib/containers/tsb/b<build>/ws)`로 Jenkins workspace를 짧은 PVC 하위 경로에 고정 |
| 임시 디렉터리 | `TMPDIR`, `XDG_RUNTIME_DIR`, `HOME`을 `/var/lib/containers/*` 아래로 고정해 Podman 임시 파일을 PVC로 유도 |
| 빌드별 경로 | workspace/Podman storage를 `/var/lib/containers/tsb/b<build>/{ws,root,run,tmp,home}`로 단순화 |
| Ephemeral Storage | `podman` 컨테이너에 `request=8Gi`, `limit=20Gi`를 요청 |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] `podman build/push`를 기존 앱과 동일하게 수행함
- [x] production 저장소(`prod/tool-storybook`)만 대상으로 푸시함
- [x] `main` 브랜치 외에는 배포를 막아 prod-only 정책을 강제함
- [x] GitOps Job을 `wait: false` 비동기로 실행함
- [x] GitOps 트리거 실패가 이미지 빌드 성공을 실패로 바꾸지 않음
- [x] `podman build --pull=always`와 fully qualified base image 리터럴로 short-name resolution 문제를 회피함
- [x] Podman agent를 안전 버전과 검증된 multi-arch digest로 고정하고 매 실행마다 pull함
- [x] Storybook 정적 이미지 빌드에서는 Chromatic addon 비활성화와 `nofile` 상향 인자를 함께 전달함
- [x] `podman build --ulimit`로 builder RUN 컨테이너 hard/soft nofile 한계를 직접 상향함
- [x] Podman 컨테이너의 `ephemeral-storage` request/limit를 명시해 low-storage 노드 배치를 피함
- [x] workspace 및 Podman 임시 디렉터리를 PVC로 유도해 emptyDir 기반 ephemeral storage 사용량을 줄임
- [x] `ws(...)`와 Podman `--root/--runroot/--tmpdir`를 빌드별 PVC 경로로 고정해 overlay/tmp/workspace가 노드 ephemeral storage를 쓰지 않도록 함
- [x] `ephemeral-storage` request/limit를 `8Gi/20Gi`로 상향해 더 큰 여유가 있는 노드로 스케줄되도록 조정함

## 잔여 위험

`privileged: true`는 현재 Jenkins Podman 스토리지 드라이버와 PVC 운영 계약을 실제 환경에서 검증하기 전까지 배포 전용 job에서만 유지합니다. 외부 PR은 `Jenkinsfile.public-ci`의 비특권 컨테이너만 사용합니다.
build별 storage 경로는 작업 간 오염을 줄이지만 privileged 컨테이너의 노드 탈출 영향을 제거하지 않으므로, 전용 namespace와 격리된 builder node pool에서 운용하고 rootless Podman 전환 검증 후 권한을 제거해야 합니다.
