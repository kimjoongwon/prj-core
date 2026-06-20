# Jenkinsfile.gitops-update 기획서

> 생성일: 2026-03-08  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.gitops-update

## 역할

이미지 빌드와 분리된 GitOps 전용 Job입니다.  
파라미터로 전달받은 앱/태그 기준으로 `prj-devops`의 `values-prod.yaml` 태그를 갱신하고 커밋/푸시합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 필수 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV` |
| 지원 앱 | `core-api`, `admin-web`, `proposal-web`, `spring-api`, `tool-storybook` |
| 추적 파라미터 | `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 인증 | Jenkins `github-app-credential` (Username/Password 바인딩, `prj-devops` push 권한 필요) |
| 대상 브랜치 | `main` (`GITOPS_BRANCH`) |
| 실행 스크립트 | `prj-devops/scripts/jenkins/update-gitops-image-tag.sh` |
| 동시 실행 제어 | `disableConcurrentBuilds()` |

## 구현 체크리스트

- [ ] `IMAGE_TAG` 누락 시 즉시 실패함
- [ ] `github-app-credential`로 인증된 repo URL을 구성함
- [ ] 별도 app repo checkout 없이 `prj-devops` 저장소를 clone 한 뒤 workdir 기준으로 스크립트를 실행함
- [ ] 스크립트 실행으로 GitOps tag 업데이트를 수행함
- [ ] 실행 결과에 입력 파라미터 요약을 출력함