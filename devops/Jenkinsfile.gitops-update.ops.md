# Jenkinsfile.gitops-update 운영 계약

> 소스 대조일: 2026-11-02. 위치: `devops/Jenkinsfile.gitops-update`. Jenkins 잡 이름은 `gitops-prod-image-bump`이며 prod/stg를 모두 처리한다.

## 역할

앱 빌드가 Harbor push 후 비동기로 호출하는 태그 범프 잡이다. `prj-devops main`에서 `scripts/jenkins/update-gitops-image-tag.sh`를 읽고 **prj-deploy main**의 `<prod|stg>/<앱>.yaml` 태그를 커밋·푸시한다. 기본은 기존 파일의 범프이며, 명시적으로 허용한 cover-letter-web/prod 최초 생성만 예외다. 차트·앱 소스 브랜치를 변경하지 않으며 배포 완료를 기다리지 않는다.

## 공개 계약

| 항목 | 설명 |
|---|---|
| 필수 입력 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`(prod/stg) |
| 앱 choices | core-api, admin-web, proposal-web, cover-letter-web, design-web, live-web, tool-storybook, idp-api, idp-web, dolmen-api, dolmen-web의 11개 |
| 최초 생성 | `INITIALIZE_APP` boolean, 기본 `false`. `cover-letter-web/prod`에만 `--initialize` 전달 허용. 다른 앱·환경은 거절 |
| 대상 파일 범위 | prod: 4서비스 + proposal/design/live/storybook, cover-letter-web 최초 생성 허용. stg: 4서비스 + Dolmen. choices 전체의 모든 환경 조합이 배포 가능한 것은 아님 |
| 추적 입력 | `SOURCE_BUILD_URL`, `SOURCE_COMMIT`, `SOURCE_BUZZ_EVENT_ID` |
| 실행 게이트 | PR 실행 거부, `TRUSTED_DEPLOYMENT=true`, 저장소 URL·deploy credential ID 필수, 태그는 소문자 16진수 SHA-12. cover-letter-web은 prod만 허용 |
| 소스·상태 저장소 | `GITOPS_REPOSITORY_URL`(prj-devops), `DEPLOY_REPOSITORY_URL`(prj-deploy), 둘 다 `GITOPS_BRANCH=main` |
| 클론·push 인증 | 두 저장소 익명 클론, prj-deploy push만 `GITOPS_DEPLOY_CREDENTIAL_ID`의 전용 deploy key(Secret text PEM) 사용 |
| push 대상 | `DEPLOY_REPOSITORY_URL`의 GitHub HTTPS 주소에서 SSH push URL 유도. 유도 실패 시 즉시 중단 |
| yq | prj-devops에 `install-yq.sh`가 있으면 부트스트랩 후 범프 스크립트 실행 |
| 동시 실행 | `disableConcurrentBuilds()`, push 충돌 시 스크립트의 pull/rebase 재시도 최대 3회 |
| 알림 | 업스트림 Buzz event ID에 reply, prj-deploy HEAD를 linkKey로 등록하여 배포 알림과 연결. 성공·실패 모두 best-effort |

## 실패와 no-op

범프 스크립트는 기존 파일의 `["<앱>"].image.tag`만 문자열로 수정한다. 같은 태그면 커밋·푸시 없이 성공한다. `INITIALIZE_APP=true`인 cover-letter-web/prod는 파일이 없을 때 동일 키와 SHA-12 문자열만 최초 생성한다. 파일이 이미 있으면 일반 범프를 수행한다. 기본값에서는 새 태그 파일을 만들지 않는다. 정적 앱의 stg 조합 일부는 명시적으로 차단하며, 그 외에도 파일이 없으면 `Values file not found`로 중단한다. live-web stg도 파일·Application이 없으므로 선택 대상이 아니다.

cover-letter-web 최초 등록은 `prj-devops/main`의 스크립트·Job DSL 반영 → 앱 이미지 push 후
`INITIALIZE_APP=true` 범프로 실제 태그 파일 생성 → Application·ingress 활성화 순서다.
상세 절차의 canonical owner는 prj-devops `docs/jenkins-gitops-image-bump.md`다.

앱 잡의 `wait: false` 호출 뒤 이 잡이 실패해도 앱 빌드 결과로 전파되지 않는다. 앱 빌드 성공, 범프 잡 성공, ArgoCD `Synced` + `Healthy`, 파드 이미지·필요 env, Buzz 배포 알림을 별도로 확인한다. Jenkins 차트 재적용 후 선언적 파라미터가 비어 첫 실행이 실패하면 입력을 명시해 재실행하고 실제 잡 기본값을 확인한다.

## 근거와 관련 문서

- [빌드·배포 런북](../docs/build-deploy-runbook.md)
- prj-devops `helm/development-tools/jenkins/values.yaml`, `scripts/jenkins/update-gitops-image-tag.sh`
- prj-deploy `prod/*.yaml`, `stg/*.yaml`

이 문서는 저장소 소스 계약을 설명한다. 실제 Jenkins credential·차트 적용·범프 실행·알림 도착은 별도 검증한다.
