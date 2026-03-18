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
| 빌드 인자 | `NODE_BASE_IMAGE`, `NGINX_BASE_IMAGE`, `STORYBOOK_DISABLE_CHROMATIC`, `STORYBOOK_BUILD_NOFILE` |
| 빌드 리밋 | `podman build --ulimit nofile=<value>:<value>`로 RUN 컨테이너의 파일 디스크립터 한계를 상향 |
| GitOps 트리거 | `GITOPS_UPDATE_JOB` 환경변수(기본 `/gitops-prod-image-bump`) |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] `podman build/push`를 기존 앱과 동일하게 수행함
- [x] production 저장소(`prod/tool-storybook`)만 대상으로 푸시함
- [x] `main` 브랜치 외에는 배포를 막아 prod-only 정책을 강제함
- [x] GitOps Job을 `wait: false` 비동기로 실행함
- [x] GitOps 트리거 실패가 이미지 빌드 성공을 실패로 바꾸지 않음
- [x] `podman build --pull=always`와 fully qualified base image 인자로 short-name resolution 문제를 회피함
- [x] Storybook 정적 이미지 빌드에서는 Chromatic addon 비활성화와 `nofile` 상향 인자를 함께 전달함
- [x] `podman build --ulimit`로 builder RUN 컨테이너 hard/soft nofile 한계를 직접 상향함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-18 | `podman build --ulimit nofile=...`를 추가해 Dockerfile 내부 `ulimit`만으로 올릴 수 없는 builder hard limit도 함께 상향 | codex |
| 2026-03-18 | Storybook 정적 이미지 빌드에 `STORYBOOK_DISABLE_CHROMATIC` 및 `STORYBOOK_BUILD_NOFILE` 인자를 추가해 `EMFILE` 실패를 완화 | codex |
| 2026-03-18 | Podman 비대화형 빌드에서 short-name resolution 오류를 피하도록 fully qualified base image build arg와 `--pull=always`를 추가 | codex |
| 2026-03-18 | Storybook prod 이미지 빌드 및 GitOps bump 전용 Jenkins pipeline 신규 추가 | codex |
