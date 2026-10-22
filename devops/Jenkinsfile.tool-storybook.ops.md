# Jenkinsfile.tool-storybook 기획서

> 생성일: 2026-03-18  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.tool-storybook

## 역할

`tool-storybook` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드해 Harbor production 저장소에 푸시합니다.  
빌드 성공 후에는 GitOps 반영 Job을 비동기로 트리거해 **prj-deploy**의 `prod/tool-storybook.yaml` 이미지 태그를 갱신합니다(2026-09-27 저장소 분리 이후).  
2026-10-04 BuildKit 파일럿(`Jenkinsfile.tool-storybook.buildkit`)을 본체로 병합해 Podman 빌드를 제거했습니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `tool-storybook` |
| 이미지 경로 | `HARBOR_REGISTRY/prod/tool-storybook` — SHA-12 커밋 태그만 push (`latest` 없음) |
| 브랜치 정책 | `main` 브랜치만 허용, PR/그 외 브랜치는 즉시 실패 |
| 빌드 방식 | `buildctl --addr tcp://buildkitd.devops-tools.svc.cluster.local:1234`로 원격 buildkitd 빌드 (Podman 미사용) |
| 실행 컨테이너 | `docker.io/moby/buildkit:v0.33.0-rootless` digest 고정, `privileged` 아님, PVC 마운트 없음 |
| 캐시 저장 | BuildKit 캐시는 buildkitd 데몬의 PVC에 저장되어 빌드 간 재사용됨 |
| Harbor 인증 | Jenkinsfile에 registry login 없음. **push 자격은 클라이언트(buildctl) 컨테이너에 마운트된 `buildkit-client-config`가 전달**(원격 buildkit 인증은 클라이언트 side — 2026-10-05 실증). 데몬용 `buildkit-registry-config`와 세트 (런북 참조) |
| 빌드 인자 | `STORYBOOK_DISABLE_CHROMATIC=true` (파일럿에서 `STORYBOOK_BUILD_NOFILE` build-arg는 제거됨 — Dockerfile 기본값과 RUN 내 ulimit 폴백이 처리) |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV=prod`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT`, `SOURCE_BUZZ_EVENT_ID` |
| 알림 | buzz #cicd 채널 성공/실패 알림. 성공 알림 `event_id`를 `SOURCE_BUZZ_EVENT_ID`로 전달해 범프/배포 알림을 같은 스레드로 묶고, 실패 시 @ZCode 멘션 |
| 실패 전파 정책 | 범프 호출 자체가 실패하면 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지. `wait: false`이므로 후속 범프 잡 실패·ArgoCD 실패는 전파되지 않음 |

## 구현 체크리스트

- [x] 보안 게이트(main 전용 검사, `TRUSTED_DEPLOYMENT`, 내부 배포 환경변수 검증)를 유지함
- [x] privileged 없는 buildctl 컨테이너로 빌드 방식을 교체함
- [x] 빌드와 push를 `buildctl --output type=image,push=true` 단일 명령으로 수행함
- [x] `Dockerfile.tool-storybook`은 수정 없이 dockerfile.v0 프론트엔드가 그대로 소비함
- [x] prod GitOps 트리거 stage 계약(파라미터, 비동기, UNSTABLE 전파)을 유지함
- [x] 파일럿 검증 완료 구조(알림 컨테이너 제거·wget 폴백·event_id 정규식 추출)를 그대로 본체에 병합함

## 운영 노트

- 현재 DSL의 잡은 `tool-storybook-build`이며 push-router 자동 대상에는 없습니다. main 배포는 수동 실행합니다. Jenkins 차트 적용·재시작 뒤에는 잡 정의 및 push-router GWT 등록을 확인하며, 과거 파일럿 적용 기록으로 현재 런타임 상태를 단정하지 않습니다.
- 함정: 적용 직후 첫 gitops 범프 빌드는 선언적 파라미터가 한 번 지워져 `TRUSTED_DEPLOYMENT != 'true'`로 실패할 수 있습니다. 파라미터를 명시해 재실행하면 됩니다(prj-devops docs/buzz-ci-integration.md).
- 적용 후 첫 앱 빌드에서 buildctl 파드 프로비저닝(구 파일럿 잡의 containerCap 라벨 대기 이력)을 관찰합니다. 검증 관점: 같은 커밋으로 2회 빌드해 `--progress=plain` 로그에서 pnpm/turbo 스텝의 `CACHED` 표시를 확인하고 빌드 시간을 비교하며, 이미지 push 성공을 확인합니다.
- watch-item: BuildKit은 빌드별 ulimit 상향이 불가합니다. Storybook 빌드의 `nofile=65536` 요구가 buildkitd 데몬 기본값으로 충분한지 관찰합니다. 부족하면 빌드 실패(EMFILE)로 나타나며, 이 경우 Dockerfile RUN 내 ulimit 폴백 로직 점검이 필요합니다.

## 잔여 위험

buildkitd 데몬이 단일 장애점이므로 데몬 장애 시 이 잡의 빌드가 실패합니다. 파일럿 병합으로 Podman 병행 운영 경로가 사라져 롤백 시 git history의 구 Jenkinsfile 복원이 필요합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-09-20 | BuildKit 파일럿 파이프라인 `Jenkinsfile.tool-storybook.buildkit` 신설 (캐시 마운트 영속성 검증) | codex |
| 2026-10-04 | 파일럿을 본체로 병합 — Podman 빌드 제거, `--ulimit nofile`/`STORYBOOK_BUILD_NOFILE` build-arg 제거, 파일럿 2파일 삭제 | zcode |
| 2026-10-04 | 운영 노트 정정 — prj-devops d5baa2b의 파일럿 잡 본체 병합 반영, 남은 외부 조치를 Jenkins 차트 helm upgrade 1건으로 확정 | zcode |
