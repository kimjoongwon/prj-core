# 공개 CI와 내부 배포 경계

외부 fork와 일반 Pull Request는 `Jenkinsfile.public-ci`만 실행합니다. 이 job에는 Jenkins credential, service account token, privileged container, registry push 또는 GitOps 권한을 연결하지 않습니다.

기존 서비스별 Jenkinsfile은 배포 전용입니다. Jenkins 관리자가 보호 브랜치 job에 다음 값을 주입해야 하며 SCM의 Pull Request job에는 설정하지 않습니다.

- `TRUSTED_DEPLOYMENT=true`: 승인된 내부 배포 job임을 나타내는 보호된 환경값
- `HARBOR_REGISTRY`: 내부 registry 주소
- `HARBOR_CREDENTIAL_ID`: Harbor push credential ID
- `GITOPS_UPDATE_JOB`: 승인된 GitOps 갱신 job 이름
- `GITOPS_CREDENTIAL_ID`: GitOps 저장소 쓰기 credential ID

서비스 배포는 `main` 또는 `stg` 보호 브랜치만 허용하고, Storybook은 `main`만 허용합니다. GitOps job도 `TRUSTED_DEPLOYMENT=true`가 없거나 PR 문맥이면 실행을 거부합니다. Jenkins 관리자는 배포 job의 Jenkinsfile 경로와 revision을 보호 브랜치로 고정하고 승인된 사용자만 수동 실행 또는 설정 변경이 가능하도록 권한을 제한해야 합니다.
