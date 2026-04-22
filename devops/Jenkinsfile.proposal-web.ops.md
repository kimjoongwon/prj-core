# Jenkinsfile.proposal-web 기획서

> 생성일: 2026-03-20  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.proposal-web

## 역할

`proposal-web` 이미지를 빌드하고 Harbor에 푸시합니다.  
프로덕션 브랜치(`main`)에서는 GitOps 반영 작업을 별도 Job으로 비동기 트리거합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `proposal-web` |
| 이미지 경로 | `harbor.cocdev.co.kr/{prod|stg}/proposal-web` |
| 실행 Stage | `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | `GITOPS_UPDATE_JOB` 환경변수(기본 `/gitops-prod-image-bump`) |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [ ] `podman build/push`를 기존과 동일하게 수행함
- [ ] `main` 브랜치에서만 GitOps Job 트리거함
- [ ] GitOps Job은 `wait: false` 비동기로 실행함
- [ ] GitOps 트리거 실패가 이미지 빌드 성공을 실패로 바꾸지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | `proposal-web` 이미지 빌드/푸시와 GitOps 비동기 트리거를 위한 Jenkins 파이프라인 신규 추가 | codex |
