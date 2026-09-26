# Jenkinsfile.gitops-update 기획서

> 생성일: 2026-03-08  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.gitops-update

## 역할

이미지 빌드와 분리된 GitOps 전용 Job입니다.  
파라미터로 전달받은 앱/태그 기준으로 **`prj-deploy`**의 `prod/<앱>.yaml` 태그를 갱신하고 커밋/푸시합니다
(2026-09-27 저장소 분리 — 이전에는 `prj-devops`의 `values-prod.yaml`을 갱신했음).

## 공개 계약

| 항목 | 설명 |
|------|------|
| 필수 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV` |
| 지원 앱 | `core-api`, `admin-web`, `proposal-web`, `spring-api`, `tool-storybook`, `idp-api`, `idp-web` |
| 추적 파라미터 | `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 클론 인증 | 없음 — 두 저장소 모두 공개라 익명 클론 (github-app-credential은 잡 정의의 prj-core 체크아웃에만 사용) |
| push 인증 | `GITOPS_DEPLOY_CREDENTIAL_ID` (prj-deploy 전용 deploy key, Secret text PEM — **다른 저장소에는 쓸 수 없는 키**, 2026-09-27 CI 권한 축소) |
| 대상 브랜치 | `main` (`GITOPS_BRANCH`) |
| 실행 스크립트 | `prj-devops/scripts/jenkins/update-gitops-image-tag.sh` |
| 동시 실행 제어 | `disableConcurrentBuilds()` |

## 구현 체크리스트

- [x] `IMAGE_TAG` 누락 시 즉시 실패함
- [x] `GITOPS_REPOSITORY_URL`·`DEPLOY_REPOSITORY_URL`·`GITOPS_DEPLOY_CREDENTIAL_ID` 누락 시 즉시 실패함
- [x] 스크립트는 `prj-devops` 클론에서 실행하고, workdir·push는 `prj-deploy` 클론(공개 — 익명 클론, deploy key push)으로 수행함
- [x] 스크립트 실행으로 GitOps tag 업데이트를 수행함 (2026-09-27 deploy key 전환 검증: #170/#171 no-op 성공)
- [x] 실행 결과에 입력 파라미터 요약을 출력함
