# Jenkinsfile.live-web 기획서

> 생성일: 2026-10-19  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.live-web

## 역할

`live-web` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드해 Harbor production 저장소에 푸시하고,
빌드 성공 후 GitOps 반영 Job을 비동기로 트리거해 **prj-deploy**의 `prod/live-web.yaml` 이미지 태그를 갱신합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `live-web` |
| 이미지 경로 | `HARBOR_REGISTRY/prod/live-web` — SHA-12 커밋 태그만 push (`latest` 없음) |
| 브랜치 정책 | `main` 브랜치만 허용, PR/그 외 브랜치는 즉시 실패 (운영 전용) |
| 빌드 방식 | `buildctl --addr tcp://buildkitd.devops-tools.svc.cluster.local:1234` 원격 buildkitd 빌드 |
| 실행 컨테이너 | `docker.io/moby/buildkit:v0.33.0-rootless` digest 고정, `buildkit-client-config` 마운트 |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | `APP_NAME=live-web`, `IMAGE_TAG`, `DEPLOY_ENV=prod` 파라미터로 `GITOPS_UPDATE_JOB` 비동기 호출 |
| 알림 | buzz #cicd 성공/실패 알림, 실패 시 @ZCode 멘션 (proposal-web과 동일 계약) |
| 실패 전파 정책 | 범프 호출 자체가 실패하면 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지. `wait: false`이므로 후속 범프 잡 실패·ArgoCD 실패는 전파되지 않음 |

## 구현 체크리스트

- [x] Jenkinsfile.proposal-web을 그대로 복제해 앱 식별자·Dockerfile 경로만 교체함 (구조 diff 검증 완료)
- [x] 잡 등록은 prj-devops `helm/development-tools/jenkins/values.yaml`의 Job DSL 목록에 추가 (pipelineJob + push-router 2곳)

## 운영 노트

- 2026-10-22 소스 기준 Jenkins DSL, prj-deploy `prod/live-web.yaml`, ArgoCD `live-web-prod`가 연결되어 있습니다. 범프 잡은 기존 파일만 갱신하므로 새 앱 등록 시 태그 파일·Application의 준비가 선행되어야 합니다. 실제 Jenkins 차트 적용 상태는 별도 확인합니다.
- 이후에는 stg→main PR 머지 시 push-router가 경로 매칭(`apps/live/web/.*` 등)으로 자동 트리거한다.

## 잔여 위험

buildkitd 데몬이 단일 장애점이라 데몬 장애 시 이 잡의 빌드가 실패한다 (다른 앱 잡과 동일).

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-10-19 | proposal-web 계약 복제로 최초 작성 | zcode |
