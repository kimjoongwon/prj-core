# Jenkinsfile.design-web 기획서

> 생성일: 2026-10-22
> 타입: jenkins-pipeline
> 위치: devops/Jenkinsfile.design-web

## 역할

`design-web` 이미지를 원격 BuildKit 데몬(buildkitd)으로 빌드해 Harbor production 저장소에 푸시하고,
GitOps 반영 Job을 비동기로 트리거해 prj-deploy `prod/design-web.yaml` 이미지 태그를 갱신합니다.
`Jenkinsfile.proposal-web` 구조 복제 — 잡 등록은 prj-devops jenkins values Job DSL 목록 2곳(pipelineJob + push-router).

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `design-web` (Next.js 정적 링크 디렉터리, basePath `/design`) |
| 이미지 경로 | `HARBOR_REGISTRY/prod/design-web` — SHA-12 커밋 태그만 push |
| 브랜치 정책 | `main` 브랜치만 허용(운영 전용, stg 없음 — proposal-web과 동일) |
| 빌드 방식 | `buildctl` 원격 빌더(buildkitd) — Dockerfile은 `devops/Dockerfile.design-web` |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | `APP_NAME=design-web`, `IMAGE_TAG`, `DEPLOY_ENV=prod` 등 — `Jenkinsfile.gitops-update` choices에 등록됨 |
| 알림 | buzz #cicd 성공/실패 알림, 실패 시 @ZCode 멘션 (proposal-web과 동일 계약) |
| 실패 전파 정책 | 범프 호출 자체가 실패하면 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지. `wait: false`이므로 후속 범프 잡 실패·ArgoCD 실패는 전파되지 않음 |

## 구현 체크리스트

- [x] Jenkinsfile.proposal-web에서 앱명만 치환해 생성(왕복 diff 검증)
- [x] `devops/Jenkinsfile.gitops-update` APP_NAME choices에 `design-web` 추가
- [x] prj-devops `scripts/jenkins/update-gitops-image-tag.sh` allowlist에 `design-web` 등록(별도 저장소 변경)
