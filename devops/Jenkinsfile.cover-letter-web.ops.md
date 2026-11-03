# Jenkinsfile.cover-letter-web 기획서

> 생성일: 2026-11-02
> 타입: jenkins-pipeline
> 위치: devops/Jenkinsfile.cover-letter-web

## 역할

`cover-letter-web` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드해 Harbor production 저장소에 푸시합니다.
빌드 성공 후에는 GitOps 반영 Job을 비동기로 트리거해 **prj-deploy**의 `prod/cover-letter-web.yaml` 이미지 태그를 갱신합니다(2026-09-27 저장소 분리 이후).

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `cover-letter-web` |
| 이미지 경로 | `HARBOR_REGISTRY/prod/cover-letter-web` — SHA-12 커밋 태그만 push (`latest` 없음) |
| 애플리케이션 | `apps/cover-letter/web`, Vite `base=/cover-letter/`, 운영 URL `https://onjitda.com/cover-letter` |
| 런타임 포트 | nginx 컨테이너 targetPort `8080`; Helm Service port `80` → targetPort `8080`, Ingress port `80` |
| 브랜치 정책 | `main` 보호 브랜치와 승인된 내부 Job만 허용하며 PR/그 외 브랜치는 즉시 실패 |
| 빌드 방식 | `buildctl --addr tcp://buildkitd.devops-tools.svc.cluster.local:1234`로 rootless 원격 buildkitd 빌드 |
| 실행 컨테이너 | `docker.io/moby/buildkit:v0.33.0-rootless` digest 고정, `privileged` 아님, PVC 마운트 없음 |
| 캐시 저장 | BuildKit 캐시는 buildkitd 데몬의 PVC에 저장되어 빌드 간 재사용됨 |
| Harbor 인증 | Jenkinsfile에 registry login 없음. **push 자격은 클라이언트(buildctl) 컨테이너에 마운트된 `buildkit-client-config`가 전달**(원격 buildkit 인증은 클라이언트 side — 2026-10-05 실증). 데몬용 `buildkit-registry-config`와 세트 (런북 참조) |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV=prod`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT`, `SOURCE_BUZZ_EVENT_ID` |
| 최초 태그 부트스트랩 | Job DSL이 선언하는 `INITIALIZE_APP` boolean 기본값 `false`; 최초 `prod/cover-letter-web.yaml` 생성 승인 실행에서만 `true`로 전달 |
| 알림 | buzz #cicd 채널 성공/실패 알림. 성공 알림 `event_id`를 `SOURCE_BUZZ_EVENT_ID`로 전달해 범프/배포 알림을 같은 스레드로 묶고, 실패 시 @ZCode 멘션 |
| 실패 전파 정책 | 범프 호출 자체가 실패하면 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지. `wait: false`이므로 후속 범프 잡 실패·ArgoCD 실패는 전파되지 않음 |

## 구현 체크리스트

- [x] 보안 게이트(main 전용 검사, `TRUSTED_DEPLOYMENT`, 내부 배포 환경변수 검증)를 통일된 B구조로 유지함
- [x] privileged 없는 rootless buildctl 컨테이너로 이미지를 빌드함
- [x] 빌드와 push를 `buildctl --output type=image,push=true` 단일 명령으로 수행함
- [x] `Dockerfile.cover-letter-web`는 수정 없이 dockerfile.v0 프론트엔드가 그대로 소비함
- [x] prod GitOps 트리거 stage 계약(파라미터, 비동기, UNSTABLE 전파)을 사용함
- [x] SHA-12 커밋 태그만 push하고 registry credential은 buildctl 공급 경로로 전달함
- [x] 이미지 빌드·푸시 성공 뒤에만 `INITIALIZE_APP`을 GitOps Job으로 전달함
- [x] 파라미터 선언은 canonical owner인 `prj-devops` Job DSL에 두고 Jenkinsfile에서는 값을 소비·전달만 함

## 운영 노트

- 운영 검증은 승인된 내부 Job에서 이미지 1회 빌드·푸시 후 `https://onjitda.com/cover-letter/`와 `/healthz` 응답을 확인합니다.
- 신규 앱의 첫 운영 빌드에서는 기본값 `false`로 GitOps 범프가 파일 부재로 실패할 수 있습니다. 이미지 빌드 성공 후 승인된 내부 Job을 수동 실행해 `INITIALIZE_APP=true`로 최초 `prod/cover-letter-web.yaml`을 만들고, 이후 자동 빌드는 `false`로 기존 파일을 범프합니다. 기존 파일이 이미 있으면 `true`여도 정상 범프됩니다.

## 잔여 위험

buildkitd 데몬이 단일 장애점이므로 데몬 장애 시 이 잡의 빌드가 실패합니다. 실제 Jenkins/registry 실행과 운영 URL 응답 검증은 아직 수행하지 않았습니다.
