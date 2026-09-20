# Jenkinsfile.tool-storybook.buildkit 기획서

> 생성일: 2026-09-20  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.tool-storybook.buildkit

## 역할

`tool-storybook` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드하는 파일럿 파이프라인입니다.  
파일럿 목적은 `Dockerfile.tool-storybook`의 `--mount=type=cache` 캐시 마운트가 빌드 간 실제로 영속 동작하는지 검증하는 것입니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `tool-storybook` |
| 이미지 경로 | `HARBOR_REGISTRY/prod/tool-storybook` |
| 브랜치 정책 | `main` 브랜치만 허용, 그 외 브랜치는 즉시 실패 (기존 잡과 동일한 보안 게이트) |
| 빌드 방식 | `buildctl --addr tcp://buildkitd.devops-tools.svc.cluster.local:1234`로 원격 buildkitd 빌드 (Podman 미사용) |
| 실행 컨테이너 | `docker.io/moby/buildkit:v0.33.0-rootless` digest 고정, `privileged` 아님, PVC 마운트 없음 |
| 캐시 저장 | BuildKit 캐시는 buildkitd 데몬의 PVC에 저장되어 빌드 간 재사용됨 |
| Harbor 인증 | Jenkinsfile에 registry login 없음. buildkitd 데몬에 마운트된 시크릿으로 처리 (런북 참조) |
| 빌드 인자 | `STORYBOOK_DISABLE_CHROMATIC` (prod 태그 정책과 GitOps 트리거는 기존 잡과 동일) |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] 보안 게이트(main 전용 검사, `TRUSTED_DEPLOYMENT`, 내부 배포 환경변수 검증)를 기존 잡과 동일하게 유지함
- [x] privileged 없는 buildctl 컨테이너로 빌드 방식만 교체함
- [x] 빌드와 push를 `buildctl --output type=image,push=true` 단일 명령으로 수행함
- [x] `Dockerfile.tool-storybook`은 수정 없이 dockerfile.v0 프론트엔드가 그대로 소비함
- [x] prod GitOps 트리거 stage를 기존 잡과 동일하게 유지함

## 운영 노트

- 기존 `Jenkinsfile.tool-storybook` 잡은 그대로 병행 운영하며, 이 파일을 scriptPath로 하는 파일럿 잡은 Jenkins 관리자가 수동 생성해야 합니다.
- 검증 관점: 같은 커밋으로 2회 빌드해 `--progress=plain` 로그에서 pnpm/turbo 스텝의 `CACHED` 표시를 확인하고 빌드 시간을 비교하며, 이미지 push 성공을 확인합니다.
- watch-item: BuildKit은 빌드별 ulimit 상향이 불가합니다. Storybook 빌드의 `nofile=65536` 요구가 buildkitd 데몬 기본값으로 충분한지 관찰합니다.
- 롤백: 파일럿 잡을 삭제하면 되며 기존 Podman 잡에는 영향이 없습니다.

## 잔여 위험

buildkitd 데몬이 단일 장애점이므로 데몬 장애 시 파일럿 잡만 실패합니다. 캐시 영속화 검증 전에는 기존 Podman 잡을 대체하지 않습니다.
