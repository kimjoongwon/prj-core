# Jenkinsfile.core-api 기획서

> 생성일: 2026-03-08  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.core-api

## 역할

`core-api` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드해 Harbor production 저장소에 푸시합니다.  
빌드 성공 후에는 GitOps 반영 Job을 비동기로 트리거해 **prj-deploy**의 `prod/core-api.yaml` 이미지 태그를 갱신합니다(2026-09-27 저장소 분리 이후).

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `core-api` |
| 이미지 경로 | `HARBOR_REGISTRY/{prod,stg}/core-api` — SHA-12 커밋 태그만 push (`latest` 없음) |
| 브랜치 정책 | `main`(prod)·`stg` 허용 (2026-10-05 stg 재가동으로 복원 — B구조 buildkit 유지), 그 외 브랜치/PR은 즉시 실패. **체크아웃은 `BRANCH_NAME` 브랜치 기준**(2026-10-09 — 이전엔 잡 정의 SCM(main)을 그대로 빌드해 stg 빌드가 main 커밋을 태깅함) |
| 빌드 방식 | `buildctl --addr tcp://buildkitd.devops-tools.svc.cluster.local:1234`로 원격 buildkitd 빌드 (Podman 미사용) |
| 실행 컨테이너 | `docker.io/moby/buildkit:v0.33.0-rootless` digest 고정, `privileged` 아님, PVC 마운트 없음 |
| 캐시 저장 | BuildKit 캐시는 buildkitd 데몬의 PVC에 저장되어 빌드 간 재사용됨 |
| Harbor 인증 | Jenkinsfile에 registry login 없음. **push 자격은 클라이언트(buildctl) 컨테이너에 마운트된 `buildkit-client-config`가 전달**(원격 buildkit 인증은 클라이언트 side — 2026-10-05 실증). 데몬용 `buildkit-registry-config`와 세트 (런북 참조) |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV=ENV_NAME` (prod/stg), `SOURCE_BUILD_URL`, `SOURCE_COMMIT`, `SOURCE_BUZZ_EVENT_ID` |
| 알림 | buzz #cicd 채널 성공/실패 알림. 성공 알림 `event_id`를 `SOURCE_BUZZ_EVENT_ID`로 전달해 범프/배포 알림을 같은 스레드로 묶고, 실패 시 @ZCode 멘션 |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] 보안 게이트(main 전용 검사, `TRUSTED_DEPLOYMENT`, 내부 배포 환경변수 검증)를 통일된 B구조로 유지함
- [x] privileged 없는 buildctl 컨테이너로 빌드 방식을 교체함
- [x] 빌드와 push를 `buildctl --output type=image,push=true` 단일 명령으로 수행함
- [x] `Dockerfile.core-api`는 수정 없이 dockerfile.v0 프론트엔드가 그대로 소비함
- [x] prod GitOps 트리거 stage 계약(파라미터, 비동기, UNSTABLE 전파)을 기존 잡과 동일하게 유지함
- [x] registry login 단계 제거, `latest` 태그 폐지(SHA-12 GitOps만 사용). stg 브랜치 빌드는 2026-10-05 재가동으로 복원됨

## 운영 노트

- 2026-10-04 stg 비활성화 시기에 prod 전용으로 축소됐으나, 2026-10-04 밤 stg가 서비스 4앱으로 재가동되어 2026-10-05 stg 빌드 지원을 복원했습니다.
- 첫 적용 시 같은 커밋으로 2회 빌드해 `--progress=plain` 로그에서 캐시 재사용(`CACHED`)과 이미지 push 성공을 확인합니다.

## 잔여 위험

buildkitd 데몬이 단일 장애점이므로 데몬 장애 시 이 잡의 빌드가 실패합니다. Podman 롤백 경로는 제거되어 롤백 시 git history의 구 Jenkinsfile 복원이 필요합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-10-04 | Podman → BuildKit B구조 전환 · 2026-10-05 | stg 재가동으로 stg 빌드 지원 복원 | zcode |
| 2026-10-09 | stg 빌드가 잡 정의 SCM(main)을 체크아웃하던 버그 수정 — Checkout 스테이지가 `BRANCH_NAME` 브랜치를 직접 체크아웃하도록 변경 | zcode |
