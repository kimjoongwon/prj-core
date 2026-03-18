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
| 이미지 경로 | `harbor.cocdev.co.kr/prod/tool-storybook` |
| 브랜치 정책 | `main` 브랜치만 허용, 그 외 브랜치는 즉시 실패 |
| 실행 Stage | `Validate Branch` → `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | `GITOPS_UPDATE_JOB` 환경변수(기본 `/gitops-prod-image-bump`) |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] `podman build/push`를 기존 앱과 동일하게 수행함
- [x] production 저장소(`prod/tool-storybook`)만 대상으로 푸시함
- [x] `main` 브랜치 외에는 배포를 막아 prod-only 정책을 강제함
- [x] GitOps Job을 `wait: false` 비동기로 실행함
- [x] GitOps 트리거 실패가 이미지 빌드 성공을 실패로 바꾸지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-18 | Storybook prod 이미지 빌드 및 GitOps bump 전용 Jenkins pipeline 신규 추가 | codex |
